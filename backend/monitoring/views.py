"""
Views para o aplicativo de monitoramento da plataforma VoIP.
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Avg, Sum, Q
from datetime import datetime, timedelta
import json
import os

from .models import Call, CallMonitoring, Report
from .serializers import CallSerializer, CallMonitoringSerializer, ReportSerializer
from accounts.permissions import IsSuperAdmin, IsAccountAdmin, IsAccountMember

class CallStatsViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gerenciamento de estatísticas de chamadas.
    """
    queryset = Call.objects.all()
    serializer_class = CallSerializer
    
    def get_permissions(self):
        """
        Define permissões com base na ação:
        - Listagem/Visualização: Super Admin ou membro da conta
        - Criação/Edição/Exclusão: Super Admin ou admin da conta
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsAccountAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated, IsAccountMember]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Filtra chamadas com base no usuário:
        - Super Admin: todas as chamadas
        - Outros usuários: apenas chamadas de suas contas
        """
        user = self.request.user
        
        # Super Admin vê todas as chamadas
        try:
            if user.profile.is_super_admin:
                return Call.objects.all()
        except:
            pass
        
        # Outros usuários veem apenas chamadas de suas contas
        account_ids = user.account_memberships.values_list('account_id', flat=True)
        return Call.objects.filter(account_id__in=account_ids)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Retorna chamadas ativas.
        """
        active_calls = self.get_queryset().filter(status='active')
        serializer = self.get_serializer(active_calls, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_account(self, request):
        """
        Filtra chamadas por conta.
        """
        account_id = request.query_params.get('account_id')
        if not account_id:
            return Response(
                {'error': 'account_id parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verifica permissão para ver chamadas da conta
        user = request.user
        if not user.profile.is_super_admin:
            if not user.account_memberships.filter(account_id=account_id).exists():
                return Response(
                    {'error': 'You do not have permission to view calls for this account'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        
        calls = Call.objects.filter(account_id=account_id)
        serializer = self.get_serializer(calls, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Retorna estatísticas de chamadas.
        """
        # Parâmetros de filtro
        account_id = request.query_params.get('account_id')
        period = request.query_params.get('period', 'today')
        
        # Definir período
        now = timezone.now()
        if period == 'today':
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == 'yesterday':
            start_date = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
            end_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == 'week':
            start_date = (now - timedelta(days=7))
        elif period == 'month':
            start_date = (now - timedelta(days=30))
        else:
            start_date = (now - timedelta(days=1))
        
        # Filtrar queryset
        queryset = self.get_queryset()
        if account_id:
            queryset = queryset.filter(account_id=account_id)
        
        if period == 'yesterday':
            queryset = queryset.filter(start_time__gte=start_date, start_time__lt=end_date)
        else:
            queryset = queryset.filter(start_time__gte=start_date)
        
        # Calcular estatísticas
        total_calls = queryset.count()
        completed_calls = queryset.filter(status='completed').count()
        missed_calls = queryset.filter(status='missed').count()
        failed_calls = queryset.filter(status='failed').count()
        active_calls = queryset.filter(status='active').count()
        
        avg_duration = queryset.filter(status='completed').aggregate(Avg('duration'))['duration__avg'] or 0
        total_duration = queryset.filter(status='completed').aggregate(Sum('duration'))['duration__sum'] or 0
        
        # Chamadas por direção
        inbound_calls = queryset.filter(call_direction='inbound').count()
        outbound_calls = queryset.filter(call_direction='outbound').count()
        internal_calls = queryset.filter(call_direction='internal').count()
        
        # Formatar duração média
        hours, remainder = divmod(int(avg_duration), 3600)
        minutes, seconds = divmod(remainder, 60)
        avg_duration_formatted = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        
        # Formatar duração total
        hours, remainder = divmod(int(total_duration), 3600)
        minutes, seconds = divmod(remainder, 60)
        total_duration_formatted = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        
        return Response({
            'total_calls': total_calls,
            'call_status': {
                'completed': completed_calls,
                'missed': missed_calls,
                'failed': failed_calls,
                'active': active_calls
            },
            'call_direction': {
                'inbound': inbound_calls,
                'outbound': outbound_calls,
                'internal': internal_calls
            },
            'duration': {
                'average': avg_duration_formatted,
                'total': total_duration_formatted,
                'average_seconds': int(avg_duration),
                'total_seconds': int(total_duration)
            },
            'period': period,
            'start_date': start_date,
            'end_date': now
        })


class MonitoringViewSet(viewsets.ViewSet):
    """
    API endpoint para monitoramento de chamadas.
    """
    def get_permissions(self):
        """
        Define permissões com base na ação.
        """
        permission_classes = [permissions.IsAuthenticated, IsAccountAdmin]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def active_sessions(self, request):
        """
        Retorna sessões de monitoramento ativas.
        """
        user = request.user
        
        # Filtrar por conta se não for Super Admin
        if not user.profile.is_super_admin:
            account_ids = user.account_memberships.values_list('account_id', flat=True)
            active_sessions = CallMonitoring.objects.filter(
                active=True,
                call__account_id__in=account_ids
            )
        else:
            active_sessions = CallMonitoring.objects.filter(active=True)
        
        serializer = CallMonitoringSerializer(active_sessions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='start')
    def start_monitoring(self, request, pk=None):
        """
        Inicia uma sessão de monitoramento para uma chamada.
        """
        try:
            call = Call.objects.get(pk=pk)
        except Call.DoesNotExist:
            return Response(
                {'error': 'Call not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verificar se a chamada está ativa
        if call.status != 'active':
            return Response(
                {'error': 'Cannot monitor a call that is not active'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar permissão para monitorar a chamada
        user = request.user
        if not user.profile.is_super_admin:
            if not user.account_memberships.filter(account=call.account).exists():
                return Response(
                    {'error': 'You do not have permission to monitor calls for this account'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # Criar sessão de monitoramento
        monitoring = CallMonitoring.objects.create(
            call=call,
            monitored_by=user.username,
            active=True
        )
        
        serializer = CallMonitoringSerializer(monitoring)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='stop')
    def stop_monitoring(self, request, pk=None):
        """
        Encerra uma sessão de monitoramento.
        """
        try:
            monitoring = CallMonitoring.objects.get(pk=pk)
        except CallMonitoring.DoesNotExist:
            return Response(
                {'error': 'Monitoring session not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verificar permissão para encerrar o monitoramento
        user = request.user
        if not user.profile.is_super_admin and monitoring.monitored_by != user.username:
            return Response(
                {'error': 'You do not have permission to stop this monitoring session'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Encerrar sessão
        monitoring.active = False
        monitoring.end_time = timezone.now()
        monitoring.save()
        
        serializer = CallMonitoringSerializer(monitoring)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='generate-report')
    def generate_report(self, request):
        """
        Gera um relatório com base nos parâmetros fornecidos.
        """
        # Obter parâmetros
        account_id = request.data.get('account_id')
        report_type = request.data.get('type')
        name = request.data.get('name')
        parameters = request.data.get('parameters', {})
        
        if not all([account_id, report_type, name]):
            return Response(
                {'error': 'account_id, type and name are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar permissão para gerar relatório
        user = request.user
        if not user.profile.is_super_admin:
            if not user.account_memberships.filter(account_id=account_id).exists():
                return Response(
                    {'error': 'You do not have permission to generate reports for this account'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        
        try:
            from accounts.models import Account
            account = Account.objects.get(pk=account_id)
        except Account.DoesNotExist:
            return Response(
                {'error': 'Account not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Criar relatório
        report = Report.objects.create(
            account=account,
            name=name,
            type=report_type,
            parameters=parameters,
            created_by=user.username
        )
        
        # Em uma implementação real, aqui seria iniciado um processo assíncrono
        # para gerar o relatório. Para simplificar, vamos apenas simular.
        
        # Simulação de geração de relatório
        # Em produção, isso seria feito por um worker assíncrono
        
        serializer = ReportSerializer(report)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='reports')
    def list_reports(self, request):
        """
        Lista relatórios disponíveis.
        """
        user = request.user
        account_id = request.query_params.get('account_id')
        
        # Filtrar por conta
        if account_id:
            # Verificar permissão
            if not user.profile.is_super_admin:
                if not user.account_memberships.filter(account_id=account_id).exists():
                    return Response(
                        {'error': 'You do not have permission to view reports for this account'}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
            reports = Report.objects.filter(account_id=account_id)
        else:
            # Super Admin vê todos os relatórios, outros usuários veem apenas de suas contas
            if user.profile.is_super_admin:
                reports = Report.objects.all()
            else:
                account_ids = user.account_memberships.values_list('account_id', flat=True)
                reports = Report.objects.filter(account_id__in=account_ids)
        
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data)
