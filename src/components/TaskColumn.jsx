import { Droppable } from 'react-beautiful-dnd';

export default function TaskColumn({ title, id, tasks, children }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {title} ({tasks.length})
      </h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px]"
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}