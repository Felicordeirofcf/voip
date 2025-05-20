"""
Views para o aplicativo de contas da plataforma VoIP.
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Account, AccountUser, UserProfile
from .serializers import UserSerializer, AccountSerializer, AccountUserSerializer, UserProfileSerializer
from .permissions import IsSuperAdmin, IsAccountAdmin, IsAccountMember

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gerenciamento de usuários.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """
        Retorna os dados do usuário autenticado.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsSuperAdmin])
    def set_super_admin(self, request, pk=None):
        """
        Define um usuário como Super Admin.
        """
        user = self.get_object()
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.is_super_admin = True
        profile.save()
        return Response({'status': 'user set as super admin'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsSuperAdmin])
    def remove_super_admin(self, request, pk=None):
        """
        Remove o status de Super Admin de um usuário.
        """
        user = self.get_object()
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.is_super_admin = False
        profile.save()
        return Response({'status': 'super admin status removed'})


class AccountViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gerenciamento de contas.
    """
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated, IsAccountMember])
    def users(self, request, pk=None):
        """
        Retorna os usuários associados a uma conta.
        """
        account = self.get_object()
        account_users = AccountUser.objects.filter(account=account)
        serializer = AccountUserSerializer(account_users, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsSuperAdmin])
    def add_user(self, request, pk=None):
        """
        Adiciona um usuário a uma conta com um papel específico.
        """
        account = self.get_object()
        user_id = request.data.get('user_id')
        role = request.data.get('role', 'user')
        
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        account_user, created = AccountUser.objects.get_or_create(
            account=account,
            user=user,
            defaults={'role': role}
        )
        
        if not created:
            account_user.role = role
            account_user.save()
        
        serializer = AccountUserSerializer(account_user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsSuperAdmin])
    def remove_user(self, request, pk=None):
        """
        Remove um usuário de uma conta.
        """
        account = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            account_user = AccountUser.objects.get(account=account, user_id=user_id)
            account_user.delete()
            return Response({'status': 'user removed from account'})
        except AccountUser.DoesNotExist:
            return Response({'error': 'User not found in this account'}, status=status.HTTP_404_NOT_FOUND)
