import { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { getTasks, createTask, updateTask, deleteTask, reorderTasks } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import Header from './Header';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const COLUMNS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
};

export default function TaskBoard() {
  const [tasks, setTasks] = useState({
    TODO: [],
    IN_PROGRESS: [],
    DONE: []
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks(user.uid);
      const groupedTasks = response.data.reduce((acc, task) => {
        if (!acc[task.category]) acc[task.category] = [];
        acc[task.category].push(task);
        return acc;
      }, {
        TODO: [],
        IN_PROGRESS: [],
        DONE: []
      });
      setTasks(groupedTasks);
    } catch (error) {
      console.error('Fetch tasks error:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData) => {
    try {
      await createTask({ 
        ...formData, 
        userId: user.uid,
        userEmail: user.email // Optional: store user's email for reference
      });
      toast.success('Task created successfully');
      fetchTasks();
    } catch (error) {
      console.error('Create task error:', error);
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (formData) => {
    try {
      await updateTask(editingTask._id, {
        ...formData,
        userId: user.uid
      });
      toast.success('Task updated successfully');
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Update task error:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        console.error('Delete task error:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCategory = source.droppableId;
    const destCategory = destination.droppableId;

    const tasksCopy = { ...tasks };
    const [movedTask] = tasksCopy[sourceCategory].splice(source.index, 1);
    tasksCopy[destCategory].splice(destination.index, 0, movedTask);

    // Optimistic update
    setTasks(tasksCopy);

    try {
      await reorderTasks(destCategory, tasksCopy[destCategory].map(task => ({
        ...task,
        userId: user.uid
      })));
    } catch (error) {
      console.error('Reorder tasks error:', error);
      toast.error('Failed to reorder tasks');
      fetchTasks(); // Revert to server state on error
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        onAddTask={() => setIsFormOpen(true)}
        userEmail={user.email}
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6 px-4 sm:px-0">
          <h2 className="text-lg font-medium text-gray-900">
            Welcome back, {user.displayName || user.email}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage and organize your tasks across different categories
          </p>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(COLUMNS).map(([id, title]) => (
              <TaskColumn 
                key={id} 
                id={id} 
                title={title} 
                tasks={tasks[id]}
                count={tasks[id].length}
              >
                {tasks[id].map((task, index) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    index={index}
                    onEdit={setEditingTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </TaskColumn>
            ))}
          </div>
        </DragDropContext>
      </main>

      <TaskForm
        isOpen={isFormOpen || !!editingTask}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask}
      />
    </div>
  );
}