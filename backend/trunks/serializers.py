"""
Serializadores para o aplicativo de troncos SIP da plataforma VoIP.
"""
from rest_framework import serializers
from .models import SIPTrunk

class SIPTrunkSerializer(serializers.ModelSerializer):
    """
    Serializador para o modelo SIPTrunk.
    """
    account_name = serializers.CharField(source='account.name', read_only=True)
    
    class Meta:
        model = SIPTrunk
        fields = ['id', 'account', 'account_name', 'name', 'host', 'username', 
                  'password', 'auth_type', 'status', 'last_activity', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'last_activity', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }
