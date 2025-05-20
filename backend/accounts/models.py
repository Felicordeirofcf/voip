from django.db import models
from django.contrib.auth.models import User

class Account(models.Model):
    """
    Representa uma conta de cliente na plataforma VoIP.
    """
    name = models.CharField(max_length=100, verbose_name="Nome")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")
    max_extensions = models.IntegerField(default=10, verbose_name="Limite de Ramais")
    status = models.CharField(
        max_length=10,
        choices=[('active', 'Ativo'), ('inactive', 'Inativo')],
        default='active',
        verbose_name="Status"
    )
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='created_accounts',
        verbose_name="Criado por"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Conta"
        verbose_name_plural = "Contas"
        ordering = ['-created_at']


class AccountUser(models.Model):
    """
    Associação entre usuários e contas, definindo o papel do usuário na conta.
    """
    account = models.ForeignKey(
        Account, 
        on_delete=models.CASCADE, 
        related_name='account_users',
        verbose_name="Conta"
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='account_memberships',
        verbose_name="Usuário"
    )
    role = models.CharField(
        max_length=20,
        choices=[
            ('super_admin', 'Super Administrador'),
            ('admin', 'Administrador'),
            ('user', 'Usuário')
        ],
        default='user',
        verbose_name="Função"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    def __str__(self):
        return f"{self.user.username} - {self.account.name} ({self.get_role_display()})"

    class Meta:
        verbose_name = "Usuário da Conta"
        verbose_name_plural = "Usuários das Contas"
        unique_together = ('account', 'user')
        ordering = ['account', 'user']


class UserProfile(models.Model):
    """
    Perfil estendido para usuários com informações adicionais.
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='profile',
        verbose_name="Usuário"
    )
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Telefone")
    is_super_admin = models.BooleanField(default=False, verbose_name="Super Admin")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = "Perfil de Usuário"
        verbose_name_plural = "Perfis de Usuários"
