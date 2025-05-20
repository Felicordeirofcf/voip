"""
Permissões personalizadas para o aplicativo de contas da plataforma VoIP.
"""
from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    """
    Permite acesso apenas a usuários que são Super Administradores.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            return request.user.profile.is_super_admin
        except:
            return False


class IsAccountAdmin(permissions.BasePermission):
    """
    Permite acesso apenas a usuários que são Administradores da conta.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Super Admin tem permissão total
        try:
            if request.user.profile.is_super_admin:
                return True
        except:
            pass
        
        # Verifica se é admin em alguma conta
        return request.user.account_memberships.filter(role='admin').exists()
    
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Super Admin tem permissão total
        try:
            if request.user.profile.is_super_admin:
                return True
        except:
            pass
        
        # Verifica se é admin da conta específica
        account = None
        if hasattr(obj, 'account'):
            account = obj.account
        elif type(obj).__name__ == 'Account':
            account = obj
        
        if account:
            return request.user.account_memberships.filter(account=account, role='admin').exists()
        
        return False


class IsAccountMember(permissions.BasePermission):
    """
    Permite acesso apenas a usuários que são membros da conta.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Super Admin tem permissão total
        try:
            if request.user.profile.is_super_admin:
                return True
        except:
            pass
        
        # Verifica se é membro de alguma conta
        return request.user.account_memberships.exists()
    
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Super Admin tem permissão total
        try:
            if request.user.profile.is_super_admin:
                return True
        except:
            pass
        
        # Verifica se é membro da conta específica
        account = None
        if hasattr(obj, 'account'):
            account = obj.account
        elif type(obj).__name__ == 'Account':
            account = obj
        
        if account:
            return request.user.account_memberships.filter(account=account).exists()
        
        return False
