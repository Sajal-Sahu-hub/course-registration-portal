from django.urls import path, include
from .views import CourseViewSet, RegistrationViewSet
from rest_framework.routers import DefaultRouter

defaultRouter = DefaultRouter()
defaultRouter.register('courses', CourseViewSet, basename='course')
defaultRouter.register('registrations', RegistrationViewSet, basename='registration')


urlpatterns = [
    path('', include(defaultRouter.urls)),
]
