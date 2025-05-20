"""
URLs para o aplicativo de contas da plataforma VoIP.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, AccountViewSet

# Criação do router para APIs baseadas em ViewSet
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'accounts', AccountViewSet)

urlpatterns = [
    # Inclusão das rotas do router
    path('', include(router.urls)),
]
