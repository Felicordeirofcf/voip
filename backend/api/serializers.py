from rest_framework import serializers
from django.contrib.auth.models import User
from accounts.models import Account, AccountUser, UserProfile
from extensions.models import Extension
from trunks.models import SIPTrunk
from monitoring.models import Call, CallMonitoring, Report


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'phone', 'is_super_admin', 'created_at', 'updated_at']


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'name', 'description', 'max_extensions', 'status', 'created_by', 'created_at', 'updated_at']


class AccountUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    account = AccountSerializer(read_only=True)
    
    class Meta:
        model = AccountUser
        fields = ['id', 'account', 'user', 'role', 'created_at', 'updated_at']


class ExtensionSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    
    class Meta:
        model = Extension
        fields = ['id', 'account', 'extension_number', 'name', 'status', 'created_by', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class SIPTrunkSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    
    class Meta:
        model = SIPTrunk
        fields = ['id', 'account', 'name', 'host', 'username', 'auth_type', 'status', 'last_activity', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class CallSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    
    class Meta:
        model = Call
        fields = ['id', 'account', 'call_id', 'extension', 'trunk', 'origin', 'destination', 
                 'call_direction', 'start_time', 'end_time', 'duration', 'status', 'quality_metrics', 'created_at']


class CallMonitoringSerializer(serializers.ModelSerializer):
    call = CallSerializer(read_only=True)
    
    class Meta:
        model = CallMonitoring
        fields = ['id', 'call', 'monitored_by', 'start_time', 'end_time', 'active']


class ReportSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    
    class Meta:
        model = Report
        fields = ['id', 'account', 'name', 'type', 'parameters', 'result_file', 'created_by', 'created_at']
