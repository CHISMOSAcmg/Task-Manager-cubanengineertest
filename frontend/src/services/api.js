import axios from 'axios';

// URL base para producción/desarrollo
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Mock functions para cuando el API no esté disponible
const mockTasks = [
  { id: 1, title: 'Primera tarea @team #urgent', raw_text: 'Primera tarea @team #urgent', status: 'open', priority: 'normal', is_public: false },
  { id: 2, title: 'Revisar email user@example.com', raw_text: 'Revisar email user@example.com', status: 'open', priority: 'high', is_public: true }
];

export const taskService = {
  // GET todas las tareas
  getTasks: async () => {
    try {
      const response = await api.get('/tasks/');
      return response;
    } catch (error) {
      console.log('API no disponible, usando datos mock');
      return { data: mockTasks };
    }
  },
  
  // GET tarea por ID
  getTask: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}/`);
      return response;
    } catch (error) {
      console.log('API no disponible, usando datos mock');
      const task = mockTasks.find(t => t.id === id) || mockTasks[0];
      return { data: task };
    }
  },
  
  // POST crear nueva tarea
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks/', taskData);
      return response;
    } catch (error) {
      console.log('API no disponible, creando tarea localmente');
      const newTask = {
        id: Date.now(),
        ...taskData,
        created_at: new Date().toISOString()
      };
      return { data: newTask };
    }
  },
  
  // PUT actualizar tarea
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}/`, taskData);
      return response;
    } catch (error) {
      console.log('API no disponible, actualizando tarea localmente');
      const updatedTask = {
        id: id,
        ...taskData,
        updated_at: new Date().toISOString()
      };
      return { data: updatedTask };
    }
  },
  
  // DELETE eliminar tarea
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}/`);
      return response;
    } catch (error) {
      console.log('API no disponible, eliminando tarea localmente');
      return { data: { success: true } };
    }
  },
};

export default api;