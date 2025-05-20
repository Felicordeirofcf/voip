"""
Views para o aplicativo de ramais da plataforma VoIP.
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Extension
from .serializers import ExtensionSerializer
from accounts.permissions import IsSuperAdmin, IsAccountAdmin, IsAccountMember

class ExtensionViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gerenciamento de ramais.
    
    Apenas Super Admins podem criar ramais, conforme requisito.
    Admins de conta podem visualizar e editar ramais de suas contas.
    """
    queryset = Extension.objects.all()
    serializer_class = ExtensionSerializer
    
    def get_permissions(self):
        """
        Define permissões com base na ação:
        - Criação: apenas Super Admin
        - Listagem/Visualização: Super Admin ou membro da conta
        - Edição/Exclusão: Super Admin ou admin da conta
        """
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsAccountAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated, IsAccountMember]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Filtra ramais com base no usuário:
        - Super Admin: todos os ramais
        - Outros usuários: apenas ramais de suas contas
        """
        user = self.request.user
        
        # Super Admin vê todos os ramais
        try:
            if user.profile.is_super_admin:
                return Extension.objects.all()
        except:
            pass
        
        # Outros usuários veem apenas ramais de suas contas
        account_ids = user.account_memberships.values_list('account_id', flat=True)
        return Extension.objects.filter(account_id__in=account_ids)
    
    def perform_create(self, serializer):
        """
        Registra o criador do ramal.
        """
        serializer.save(created_by=self.request.user.username)
    
    @action(detail=False, methods=['get'])
    def by_account(self, request):
        """
        Filtra ramais por conta.
        """
        account_id = request.query_params.get('account_id')
        if not account_id:
            return Response(
                {'error': 'account_id parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verifica permissão para ver ramais da conta
        user = request.user
        if not user.profile.is_super_admin:
            if not user.account_memberships.filter(account_id=account_id).exists():
                return Response(
                    {'error': 'You do not have permission to view extensions for this account'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        
        extensions = Extension.objects.filter(account_id=account_id)
        serializer = self.get_serializer(extensions, many=True)
        return Response(serializer.data)
