"""
URL configuration for voip_core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# Configuração do Swagger/OpenAPI
schema_view = get_schema_view(
    openapi.Info(
        title="VoIP Platform API",
        default_version='v1',
        description="API para a plataforma VoIP baseada em MeuPABX",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contato@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Admin do Django
    path('admin/', admin.site.urls),
    
    # Documentação da API
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Autenticação JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # APIs dos aplicativos
    path('api/', include('api.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api/extensions/', include('extensions.urls')),
    path('api/trunks/', include('trunks.urls')),
    path('api/monitoring/', include('monitoring.urls')),
]

# Configuração para servir arquivos estáticos em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
