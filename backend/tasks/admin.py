from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'priority', 'is_public', 'created_at']
    list_filter = ['status', 'priority', 'is_public']
    search_fields = ['title', 'description']