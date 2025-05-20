"""
Views para o aplicativo de troncos SIP da plataforma VoIP.
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import SIPTrunk
from .serializers import SIPTrunkSerializer
from accounts.permissions import IsSuperAdmin, IsAccountAdmin, IsAccountMember

class TrunkViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gerenciamento de troncos SIP.
    
    Super Admins e Admins de conta podem configurar troncos SIP, conforme requisito.
    """
    queryset = SIPTrunk.objects.all()
    serializer_class = SIPTrunkSerializer
    
    def get_permissions(self):
        """
        Define permissões com base na ação:
        - Listagem/Visualização: Super Admin ou membro da conta
        - Criação/Edição/Exclusão: Super Admin ou admin da conta
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'test_connection']:
            permission_classes = [permissions.IsAuthenticated, IsAccountAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated, IsAccountMember]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Filtra troncos SIP com base no usuário:
        - Super Admin: todos os troncos
        - Outros usuários: apenas troncos de suas contas
        """
        user = self.request.user
        
        # Super Admin vê todos os troncos
        try:
            if user.profile.is_super_admin:
                return SIPTrunk.objects.all()
        except:
            pass
        
        # Outros usuários veem apenas troncos de suas contas
        account_ids = user.account_memberships.values_list('account_id', flat=True)
        return SIPTrunk.objects.filter(account_id__in=account_ids)
    
    @action(detail=False, methods=['get'])
    def by_account(self, request):
        """
        Filtra troncos SIP por conta.
        """
        account_id = request.query_params.get('account_id')
        if not account_id:
            return Response(
                {'error': 'account_id parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verifica permissão para ver troncos da conta
        user = request.user
        if not user.profile.is_super_admin:
            if not user.account_memberships.filter(account_id=account_id).exists():
                return Response(
                    {'error': 'You do not have permission to view trunks for this account'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        
        trunks = SIPTrunk.objects.filter(account_id=account_id)
        serializer = self.get_serializer(trunks, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def test_connection(self, request, pk=None):
        """
        Testa a conexão com o tronco SIP.
        
        Em uma implementação real, isso faria uma tentativa de registro
        ou verificação de conectividade com o provedor SIP.
        """
        trunk = self.get_object()
        
        # Simulação de teste de conexão
        # Em produção, isso seria substituído por uma verificação real
        import random
        success = random.choice([True, True, True, False])  # 75% de chance de sucesso
        
        if success:
            trunk.status = 'active'
            trunk.last_activity = timezone.now()
            trunk.save()
            return Response({
                'status': 'success',
                'message': 'Conexão estabelecida com sucesso',
                'details': {
                    'latency': f"{random.randint(5, 100)}ms",
                    'registration': 'OK'
                }
            })
        else:
            trunk.status = 'error'
            trunk.save()
            return Response({
                'status': 'error',
                'message': 'Falha ao estabelecer conexão',
                'details': {
                    'error': 'Falha de autenticação ou host inacessível'
                }
            }, status=status.HTTP_400_BAD_REQUEST)
