from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
   
    mentions = serializers.SerializerMethodField()
    hashtags = serializers.SerializerMethodField()
    emails = serializers.SerializerMethodField()
    links = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'is_public', 'due_date', 'created_at', 'updated_at',
           
            'mentions', 'hashtags', 'emails', 'links'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

   
    def get_mentions(self, obj):
        return obj.extract_mentions()

    def get_hashtags(self, obj):
        return obj.extract_hashtags()

    def get_emails(self, obj):
        return obj.extract_emails()

    def get_links(self, obj):
        return obj.extract_links()

  
    def validate_title(self, value):
        if len(value.strip()) == 0:
            raise serializers.ValidationError("Title cannot be empty")
        return value