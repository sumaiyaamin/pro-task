import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getTasks = (userId) => api.get(`/tasks?userId=${userId}`);
export const createTask = (task) => api.post('/tasks', task);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const reorderTasks = (category, tasks) => api.put(`/tasks/reorder/${category}`, { tasks });
export const getActivities = (userId) => api.get(`/activities?userId=${userId}`);