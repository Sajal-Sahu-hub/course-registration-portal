from rest_framework import serializers
from .models import Course, Registration
from django.contrib.auth import get_user_model

class CourseSerializer(serializers.ModelSerializer):
    enrolled_students = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_enrolled_students(self, obj):
        return Registration.objects.filter(course=obj, status='accepted').count()

User = get_user_model()
class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
class RegistrationSerializer(serializers.ModelSerializer):
    user_details = UserBasicSerializer(source='user', read_only=True)
    class Meta:
        model = Registration
        fields = '__all__'  
        read_only_fields = ['user', 'applied_at']  # Make these fields read-only