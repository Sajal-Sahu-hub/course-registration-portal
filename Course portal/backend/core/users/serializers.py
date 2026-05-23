from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name', 'username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}  # Make password write-only
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)  # Use create_user to handle password hashing
        return user