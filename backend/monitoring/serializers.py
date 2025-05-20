"""
Serializadores para o aplicativo de monitoramento da plataforma VoIP.
"""
from rest_framework import serializers
from .models import Call, CallMonitoring, Report

class CallSerializer(serializers.ModelSerializer):
    """
    Serializador para o modelo Call.
    """
    account_name = serializers.CharField(source='account.name', read_only=True)
    extension_number = serializers.CharField(source='extension.extension_number', read_only=True)
    trunk_name = serializers.CharField(source='trunk.name', read_only=True)
    duration_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Call
        fields = ['id', 'account', 'account_name', 'call_id', 'extension', 'extension_number',
                  'trunk', 'trunk_name', 'origin', 'destination', 'call_direction', 
                  'start_time', 'end_time', 'duration', 'duration_formatted', 'status', 
                  'quality_metrics', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_duration_formatted(self, obj):
        """
        Formata a duração em formato HH:MM:SS.
        """
        if obj.duration:
            hours, remainder = divmod(obj.duration, 3600)
            minutes, seconds = divmod(remainder, 60)
            return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        return "00:00:00"


class CallMonitoringSerializer(serializers.ModelSerializer):
    """
    Serializador para o modelo CallMonitoring.
    """
    call_details = CallSerializer(source='call', read_only=True)
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = CallMonitoring
        fields = ['id', 'call', 'call_details', 'monitored_by', 'start_time', 
                  'end_time', 'active', 'duration']
        read_only_fields = ['id', 'start_time']
    
    def get_duration(self, obj):
        """
        Calcula a duração da sessão de monitoramento.
        """
        if obj.end_time and obj.start_time:
            duration_seconds = (obj.end_time - obj.start_time).total_seconds()
            minutes, seconds = divmod(int(duration_seconds), 60)
            return f"{minutes:02d}:{seconds:02d}"
        return "Em andamento"


class ReportSerializer(serializers.ModelSerializer):
    """
    Serializador para o modelo Report.
    """
    account_name = serializers.CharField(source='account.name', read_only=True)
    
    class Meta:
        model = Report
        fields = ['id', 'account', 'account_name', 'name', 'type', 'parameters', 
                  'result_file', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_at']
