"""
Views para a API principal da plataforma VoIP.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import status

class ApiRootView(APIView):
    """
    Visão raiz da API que fornece links para os principais endpoints.
    """
    def get(self, request, format=None):
        return Response({
            'accounts': reverse('api-root', request=request, format=format) + 'accounts/',
            'extensions': reverse('api-root', request=request, format=format) + 'extensions/',
            'trunks': reverse('api-root', request=request, format=format) + 'trunks/',
            'monitoring': reverse('api-root', request=request, format=format) + 'monitoring/',
            'auth': {
                'token': reverse('token_obtain_pair', request=request, format=format),
                'token_refresh': reverse('token_refresh', request=request, format=format),
                'token_verify': reverse('token_verify', request=request, format=format),
            }
        })
