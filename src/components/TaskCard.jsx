import { Draggable } from 'react-beautiful-dnd';
import { PencilIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function TaskCard({ task, index, onEdit, onDelete }) {
  const getDueDateColor = () => {
    if (!task.dueDate) return '';
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const twoDaysFromNow = new Date(today.setDate(today.getDate() + 2));

    if (dueDate < today) return 'text-red-600';
    if (dueDate <= twoDaysFromNow) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg shadow p-4 mb-3 ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
              {task.description && (
                <p className="mt-1 text-sm text-gray-500">{task.description}</p>
              )}
              {task.dueDate && (
                <div className="mt-2 flex items-center">
                  <CalendarIcon className={`h-4 w-4 mr-1 ${getDueDateColor()}`} />
                  <span className={`text-xs ${getDueDateColor()}`}>
                    {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4 flex space-x-2">
              <button
                onClick={() => onEdit(task)}
                className="text-gray-400 hover:text-gray-500"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}