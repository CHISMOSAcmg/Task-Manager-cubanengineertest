from django.db import models

class Task(models.Model):

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('today', 'Today'),  
    ]
    
    PRIORITY_CHOICES = [
        ('normal', 'Normal'), 
        ('high', 'High'),     
       
    ]

    title = models.CharField(max_length=500) 
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    is_public = models.BooleanField(default=False)
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    
    def extract_mentions(self):
        
        import re
        return re.findall(r'@(\w+)', self.title)

    def extract_hashtags(self):
       
        import re
        return re.findall(r'#(\w+)', self.title)

    def extract_emails(self):
        
        import re
        return re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', self.title)

    def extract_links(self):
    
        import re
        return re.findall(r'https?://[^\s]+', self.title)

    def __str__(self):
        return self.title
    class Meta:
        ordering = ['-created_at']  