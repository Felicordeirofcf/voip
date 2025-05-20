"""
Serializadores para o aplicativo de ramais da plataforma VoIP.
"""
from rest_framework import serializers
from .models import Extension
from accounts.models import Account

class ExtensionSerializer(serializers.ModelSerializer):
    """
    Serializador para o modelo Extension.
    """
    account_name = serializers.CharField(source='account.name', read_only=True)
    
    class Meta:
        model = Extension
        fields = ['id', 'account', 'account_name', 'extension_number', 'name', 
                  'status', 'password', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def validate(self, data):
        """
        Valida se a conta não excedeu o limite de ramais.
        """
        if self.instance is None:  # Apenas para criação
            account = data.get('account')
            if account:
                current_extensions_count = Extension.objects.filter(account=account).count()
                if current_extensions_count >= account.max_extensions:
                    raise serializers.ValidationError(
                        f"A conta atingiu o limite de {account.max_extensions} ramais."
                    )
        return data
