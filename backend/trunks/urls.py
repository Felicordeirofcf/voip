"""
URLs para o aplicativo de troncos SIP da plataforma VoIP.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrunkViewSet

# Criação do router para APIs baseadas em ViewSet
router = DefaultRouter()
router.register(r'trunks', TrunkViewSet)

urlpatterns = [
    # Inclusão das rotas do router
    path('', include(router.urls)),
]
