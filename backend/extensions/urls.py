"""
URLs para o aplicativo de ramais da plataforma VoIP.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExtensionViewSet

# Criação do router para APIs baseadas em ViewSet
router = DefaultRouter()
router.register(r'extensions', ExtensionViewSet)

urlpatterns = [
    # Inclusão das rotas do router
    path('', include(router.urls)),
]
