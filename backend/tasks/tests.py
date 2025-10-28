import pytest
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from .models import Task

class TaskModelTest(TestCase):
    def test_create_task(self):
        """Test creación básica de tarea"""
        task = Task.objects.create(
            title="Test task @user #project email@test.com https://example.com",
            status="open",
            priority="normal"
        )
        
        self.assertEqual(task.title, "Test task @user #project email@test.com https://example.com")
        self.assertEqual(task.status, "open")
        self.assertTrue(isinstance(task, Task))

    def test_text_parsing_mentions(self):
        """Test parsing de @mentions"""
        task = Task.objects.create(
            title="Hello @devteam @user123 check this"
        )
        
        mentions = task.extract_mentions()
        self.assertIn('devteam', mentions)
        self.assertIn('user123', mentions)
        self.assertEqual(len(mentions), 2)

    def test_text_parsing_hashtags(self):
        """Test parsing de #hashtags"""
        task = Task.objects.create(
            title="Working on #project #urgent #tasks"
        )
        
        hashtags = task.extract_hashtags()
        self.assertIn('project', hashtags)
        self.assertIn('urgent', hashtags)
        self.assertIn('tasks', hashtags)
        self.assertEqual(len(hashtags), 3)

    def test_text_parsing_emails(self):
        """Test parsing de emails"""
        task = Task.objects.create(
            title="Contact us at test@example.com and admin@site.org"
        )
        
        emails = task.extract_emails()
        self.assertIn('test@example.com', emails)
        self.assertIn('admin@site.org', emails)
        self.assertEqual(len(emails), 2)

    def test_text_parsing_links(self):
        """Test parsing de links"""
        task = Task.objects.create(
            title="Visit https://example.com and http://test.org"
        )
        
        links = task.extract_links()
        self.assertIn('https://example.com', links)
        self.assertIn('http://test.org', links)
        self.assertEqual(len(links), 2)

    def test_task_string_representation(self):
        """Test __str__ method"""
        task = Task.objects.create(title="Test Task")
        self.assertEqual(str(task), "Test Task")


class TaskAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.task_data = {
            'title': 'API Test Task @team #api',
            'status': 'open',
            'priority': 'normal',
            'is_public': False
        }

    def test_create_task_via_api(self):
        """Test crear tarea via API"""
        response = self.client.post('/api/tasks/', self.task_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], self.task_data['title'])
        self.assertEqual(response.data['status'], 'open')

    def test_get_tasks_via_api(self):
        """Test obtener tareas via API"""
        # Crear una tarea primero
        Task.objects.create(title="Test Task 1")
        Task.objects.create(title="Test Task 2")
        
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_single_task_via_api(self):
        """Test obtener una tarea específica via API"""
        task = Task.objects.create(title="Single Task")
        
        response = self.client.get(f'/api/tasks/{task.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Single Task')

    def test_update_task_via_api(self):
        """Test actualizar tarea via API"""
        task = Task.objects.create(title="Original Task")
        
        update_data = {'title': 'Updated Task', 'status': 'today'}
        response = self.client.put(f'/api/tasks/{task.id}/', update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Task')
        self.assertEqual(response.data['status'], 'today')

    def test_delete_task_via_api(self):
        """Test eliminar tarea via API"""
        task = Task.objects.create(title="Task to Delete")
        
        response = self.client.delete(f'/api/tasks/{task.id}/')
       
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT) 
        
        
        self.assertEqual(Task.objects.count(), 0)

    def test_api_returns_parsed_fields(self):
        """Test que la API retorna campos de parsing"""
        task = Task.objects.create(
            title="Test @mention #hashtag email@test.com https://example.com"
        )
        
        response = self.client.get(f'/api/tasks/{task.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que incluye los campos de parsing
        self.assertIn('mentions', response.data)
        self.assertIn('hashtags', response.data)
        self.assertIn('emails', response.data)
        self.assertIn('links', response.data)


class TaskSerializerTest(TestCase):
    def test_serializer_validation(self):
        """Test validación del serializer"""
        from .serializers import TaskSerializer
        
        # Test título vacío
        data = {'title': ''}
        serializer = TaskSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('title', serializer.errors)

    def test_serializer_includes_calculated_fields(self):
        """Test que el serializer incluye campos calculados"""
        task = Task.objects.create(
            title="Test @user #project"
        )
        
        from .serializers import TaskSerializer
        serializer = TaskSerializer(task)
        
        data = serializer.data
        self.assertIn('mentions', data)
        self.assertIn('hashtags', data)
        self.assertIn('emails', data)
        self.assertIn('links', data)
        self.assertEqual(data['mentions'], ['user'])
        self.assertEqual(data['hashtags'], ['project'])