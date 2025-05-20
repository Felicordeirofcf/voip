from django.db import models
from accounts.models import Account

class Extension(models.Model):
    """
    Representa um ramal na plataforma VoIP.
    """
    account = models.ForeignKey(
        Account, 
        on_delete=models.CASCADE, 
        related_name='extensions',
        verbose_name="Conta"
    )
    extension_number = models.CharField(max_length=20, verbose_name="Número do Ramal")
    name = models.CharField(max_length=100, verbose_name="Nome")
    status = models.CharField(
        max_length=10,
        choices=[('active', 'Ativo'), ('inactive', 'Inativo')],
        default='active',
        verbose_name="Status"
    )
    password = models.CharField(max_length=100, verbose_name="Senha", blank=True, null=True)
    created_by = models.CharField(max_length=100, verbose_name="Criado por")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    def __str__(self):
        return f"{self.extension_number} - {self.name} ({self.account.name})"

    class Meta:
        verbose_name = "Ramal"
        verbose_name_plural = "Ramais"
        unique_together = ('account', 'extension_number')
        ordering = ['account', 'extension_number']
