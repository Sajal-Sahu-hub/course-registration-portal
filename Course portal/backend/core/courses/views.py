from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Course, Registration
from .serializers import CourseSerializer, RegistrationSerializer

# Create your views here.

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'
    

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminUser()]

class RegistrationViewSet(viewsets.ModelViewSet):
    serializer_class = RegistrationSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        if self.action == 'list':
            return [permissions.IsAuthenticated()]
        return [IsAdminUser()]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Registration.objects.all()
        return Registration.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
