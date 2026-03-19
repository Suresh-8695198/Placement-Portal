from django.db import models

class AdminUser(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

       
from django.db import models
from datetime import timedelta
from django.utils import timezone

class AdminPasswordResetOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)

# admin_app/models.py   (or create announcements/models.py)

from django.db import models
from django.contrib.auth.models import User   # if you want to track who posted

class Announcement(models.Model):
    title       = models.CharField(max_length=200)
    message     = models.TextField()
    created_by  = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="announcements"
    )
    created_at  = models.DateTimeField(auto_now_add=True)
    is_active   = models.BooleanField(default=True)       # soft delete / hide
    important   = models.BooleanField(default=False)      # optional – highlight

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.created_at.date()})"