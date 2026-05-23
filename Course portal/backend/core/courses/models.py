from django.db import models

# Create your models here.

class Course(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    instructor = models.CharField(max_length=100)
    schedule = models.CharField(max_length=100)
    capacity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
class Registration(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')
    
    class Meta:
        unique_together = ['course', 'user']
    
    def __str__(self):
        return f"{self.user.username} - {self.course.title}"