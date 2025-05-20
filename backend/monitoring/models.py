from django.db import models
from accounts.models import Account
from extensions.models import Extension
from trunks.models import SIPTrunk

class Call(models.Model):
    """
    Representa uma chamada telefônica na plataforma VoIP.
    """
    account = models.ForeignKey(
        Account, 
        on_delete=models.CASCADE, 
        related_name='calls',
        verbose_name="Conta"
    )
    call_id = models.CharField(max_length=100, unique=True, verbose_name="ID da Chamada")
    extension = models.ForeignKey(
        Extension, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='calls',
        verbose_name="Ramal"
    )
    trunk = models.ForeignKey(
        SIPTrunk, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='calls',
        verbose_name="Tronco SIP"
    )
    origin = models.CharField(max_length=100, verbose_name="Origem")
    destination = models.CharField(max_length=100, verbose_name="Destino")
    call_direction = models.CharField(
        max_length=10,
        choices=[('inbound', 'Entrada'), ('outbound', 'Saída'), ('internal', 'Interna')],
        verbose_name="Direção"
    )
    start_time = models.DateTimeField(verbose_name="Início")
    end_time = models.DateTimeField(null=True, blank=True, verbose_name="Fim")
    duration = models.IntegerField(default=0, verbose_name="Duração (segundos)")
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Ativa'), 
            ('completed', 'Finalizada'), 
            ('missed', 'Perdida'),
            ('failed', 'Falha')
        ],
        verbose_name="Status"
    )
    quality_metrics = models.JSONField(null=True, blank=True, verbose_name="Métricas de Qualidade")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Registrado em")

    def __str__(self):
        return f"{self.origin} → {self.destination} ({self.get_status_display()})"

    class Meta:
        verbose_name = "Chamada"
        verbose_name_plural = "Chamadas"
        ordering = ['-start_time']


class CallMonitoring(models.Model):
    """
    Representa uma sessão de monitoramento (escuta) de chamada.
    """
    call = models.ForeignKey(
        Call, 
        on_delete=models.CASCADE, 
        related_name='monitoring_sessions',
        verbose_name="Chamada"
    )
    monitored_by = models.CharField(max_length=100, verbose_name="Monitorado por")
    start_time = models.DateTimeField(auto_now_add=True, verbose_name="Início")
    end_time = models.DateTimeField(null=True, blank=True, verbose_name="Fim")
    active = models.BooleanField(default=True, verbose_name="Ativo")
    
    def __str__(self):
        return f"Monitoramento: {self.call} por {self.monitored_by}"
    
    class Meta:
        verbose_name = "Monitoramento de Chamada"
        verbose_name_plural = "Monitoramentos de Chamadas"
        ordering = ['-start_time']


class Report(models.Model):
    """
    Representa um relatório gerado na plataforma.
    """
    account = models.ForeignKey(
        Account, 
        on_delete=models.CASCADE, 
        related_name='reports',
        verbose_name="Conta"
    )
    name = models.CharField(max_length=100, verbose_name="Nome")
    type = models.CharField(
        max_length=20,
        choices=[
            ('call_usage', 'Uso de Chamadas'), 
            ('performance', 'Performance'), 
            ('quality', 'Qualidade')
        ],
        verbose_name="Tipo"
    )
    parameters = models.JSONField(verbose_name="Parâmetros")
    result_file = models.FileField(upload_to='reports/', null=True, blank=True, verbose_name="Arquivo de Resultado")
    created_by = models.CharField(max_length=100, verbose_name="Criado por")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    
    def __str__(self):
        return f"{self.name} - {self.get_type_display()} ({self.account.name})"
    
    class Meta:
        verbose_name = "Relatório"
        verbose_name_plural = "Relatórios"
        ordering = ['-created_at']
