import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import TaskItem from './TaskItem';
import AddTask from './AddTask';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  // Cargar tareas desde la API
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        console.log('Cargando tareas desde API...');
        const response = await taskService.getTasks();
        console.log('Respuesta de API:', response);
        
        if (response && response.data) {
          setTasks(response.data);
          console.log('Tareas cargadas:', response.data);
        } else {
          console.log('No hay datos en la respuesta');
          // Datos de ejemplo si la API no responde
          setTasks([
            { 
              id: 1, 
              title: 'Primera tarea @team #urgent', 
              raw_text: 'Primera tarea @team #urgent', 
              status: 'open', 
              priority: 'normal', 
              is_public: false 
            },
            { 
              id: 2, 
              title: 'Revisar email user@example.com', 
              raw_text: 'Revisar email user@example.com', 
              status: 'open', 
              priority: 'high', 
              is_public: true 
            }
          ]);
        }
      } catch (error) {
        console.error('Error cargando tareas:', error);
        // Datos de ejemplo en caso de error
        setTasks([
          { 
            id: 1, 
            title: 'Tarea de ejemplo @dev', 
            raw_text: 'Tarea de ejemplo @dev', 
            status: 'open', 
            priority: 'normal', 
            is_public: false 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const addTask = async (taskData) => {
    console.log('Agregando tarea:', taskData);
    try {
      const response = await taskService.createTask(taskData);
      const newTask = response.data;
      setTasks(prevTasks => [...prevTasks, newTask]);
      console.log('Tarea agregada exitosamente:', newTask);
    } catch (error) {
      console.error('Error agregando tarea:', error);
      // Fallback: agregar localmente
      const newTask = {
        id: Date.now(),
        ...taskData,
        created_at: new Date().toISOString()
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
  };

  const updateTask = async (taskId, updatedData) => {
    console.log('Actualizando tarea:', taskId, updatedData);
    try {
      const response = await taskService.updateTask(taskId, updatedData);
      const updatedTask = response.data;
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      );
      setEditingTask(null);
      console.log('Tarea actualizada exitosamente:', updatedTask);
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      // Fallback: actualizar localmente
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, ...updatedData } : task
        )
      );
      setEditingTask(null);
    }
  };

  const startEditing = (task) => {
    console.log('Iniciando edición de:', task);
    setEditingTask(task);
  };

  const cancelEditing = () => {
    console.log('Cancelando edición');
    setEditingTask(null);
  };

  if (loading) {
    return <div className="loading">Cargando tareas...</div>;
  }

  return (
    <div className="task-list">
      {tasks.length === 0 && !editingTask && (
        <div className="empty-state">
          <div className="empty-list">
            [ ] Type to add new task
          </div>
        </div>
      )}
      
      {tasks.map(task => (
        editingTask && editingTask.id === task.id ? (
          <AddTask 
            key={task.id}
            onAddTask={updateTask}
            onCancel={cancelEditing}
            editingTask={editingTask}
            isEditing={true}
          />
        ) : (
          <TaskItem 
            key={task.id} 
            task={task}
            onEdit={startEditing}
          />
        )
      ))}
      
      {!editingTask && (
        <AddTask 
          onAddTask={addTask}
          isEditing={false}
        />
      )}
    </div>
  );
};

export default TaskList;