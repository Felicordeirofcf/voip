"""
Serializadores para o aplicativo de contas da plataforma VoIP.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Account, AccountUser, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializador para o modelo UserProfile.
    """
    class Meta:
        model = UserProfile
        fields = ['phone', 'is_super_admin', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """
    Serializador para o modelo User com perfil aninhado.
    """
    profile = UserProfileSerializer(read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    is_super_admin = serializers.BooleanField(source='profile.is_super_admin', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'is_active', 'date_joined', 'password', 'profile', 'is_super_admin']
        read_only_fields = ['id', 'date_joined']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        
        if password:
            user.set_password(password)
            user.save()
            
        # Cria perfil automaticamente
        UserProfile.objects.create(user=user)
        
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance


class AccountSerializer(serializers.ModelSerializer):
    """
    Serializador para o modelo Account.
    """
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Account
        fields = ['id', 'name', 'description', 'max_extensions', 'status', 
                  'created_by', 'created_by_username', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class AccountUserSerializer(serializers.ModelSerializer):
    """
    Serializador para o modelo AccountUser com dados de usuário aninhados.
    """
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AccountUser
        fields = ['id', 'account', 'user', 'username', 'email', 'full_name', 
                  'role', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
