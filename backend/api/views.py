from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    View para a raiz da API, retorna informações básicas sobre a API
    """
    return Response({
        'status': 'online',
        'message': 'VoIP Platform API está funcionando corretamente',
        'version': 'v1.0',
        'documentation': {
            'swagger': '/swagger/',
            'redoc': '/redoc/'
        }
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_status(request):
    """
    View para verificar o status da API
    """
    return Response({
        'status': 'online',
        'message': 'API está funcionando normalmente'
    }, status=status.HTTP_200_OK)
