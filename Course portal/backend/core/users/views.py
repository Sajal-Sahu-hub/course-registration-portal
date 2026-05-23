from django.shortcuts import render
from rest_framework import generics, permissions
from .models import User
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)