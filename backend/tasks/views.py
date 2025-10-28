from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

  
    def get_queryset(self):
        queryset = Task.objects.all()
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset


    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        """Eliminar múltiples tareas - para futuro uso"""
        task_ids = request.data.get('ids', [])
        Task.objects.filter(id__in=task_ids).delete()
        return Response({'status': 'tasks deleted'}, status=status.HTTP_200_OK)