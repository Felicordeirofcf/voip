"""
URLs para a API principal da plataforma VoIP.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import api_root

# Criação do router para APIs baseadas em ViewSet
router = DefaultRouter()

urlpatterns = [
    # Rota raiz da API
    path('', api_root, name='api-root'),
    
    # Inclusão das rotas do router
    path('', include(router.urls)),
]
