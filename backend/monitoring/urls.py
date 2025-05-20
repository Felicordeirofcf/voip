"""
URLs para o aplicativo de monitoramento da plataforma VoIP.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CallStatsViewSet, MonitoringViewSet

# Criação do router para APIs baseadas em ViewSet
router = DefaultRouter()
router.register(r'calls', CallStatsViewSet)
router.register(r'monitoring', MonitoringViewSet, basename='monitoring')

urlpatterns = [
    # Inclusão das rotas do router
    path('', include(router.urls)),
]
