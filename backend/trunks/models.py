from django.db import models
from accounts.models import Account

class SIPTrunk(models.Model):
    """
    Representa um tronco SIP na plataforma VoIP.
    """
    account = models.ForeignKey(
        Account, 
        on_delete=models.CASCADE, 
        related_name='sip_trunks',
        verbose_name="Conta"
    )
    name = models.CharField(max_length=100, verbose_name="Nome")
    host = models.CharField(max_length=255, verbose_name="Host")
    username = models.CharField(max_length=100, verbose_name="Usuário")
    password = models.CharField(max_length=100, verbose_name="Senha")
    auth_type = models.CharField(
        max_length=20,
        choices=[('registration', 'Registro'), ('ip', 'IP')],
        default='registration',
        verbose_name="Tipo de Autenticação"
    )
    status = models.CharField(
        max_length=10,
        choices=[('active', 'Ativo'), ('inactive', 'Inativo'), ('error', 'Erro')],
        default='active',
        verbose_name="Status"
    )
    last_activity = models.DateTimeField(null=True, blank=True, verbose_name="Última Atividade")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    def __str__(self):
        return f"{self.name} ({self.account.name})"

    class Meta:
        verbose_name = "Tronco SIP"
        verbose_name_plural = "Troncos SIP"
        ordering = ['account', 'name']
