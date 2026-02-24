import React, { useState, useMemo } from 'react';
import {
  DndContext, DragOverlay, closestCorners, KeyboardSensor,
  PointerSensor, useSensor, useSensors, defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useAppStore } from '../services/store';
import KanbanColumn from './KanbanColumn';
import KanbanTask from './KanbanTask';
import TaskModal from './TaskModal';
import type { Task } from '../types';

const KanbanBoard: React.FC = () => {
  const { tasks, columns, setTasks, searchQuery } = useAppStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [targetColumnId, setTargetColumnId] = useState<string | undefined>(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const lowerQuery = searchQuery.toLowerCase();
    return tasks.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) || 
      t.description.toLowerCase().includes(lowerQuery)
    );
  }, [tasks, searchQuery]);

  const openNewTaskModal = (columnId: string) => { 
    setEditingTask(undefined); 
    setTargetColumnId(columnId); 
    setIsModalOpen(true); 
  };
  
  const openEditModal = (task: Task) => { 
    setEditingTask(task); 
    setIsModalOpen(true); 
  };

  const onDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id);
    const activeTaskData = tasks.find((task) => task.id === activeId);
    if (activeTaskData) setActiveTask(activeTaskData);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    // Use 'tasks' directly instead of a callback
    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    if (activeIndex === -1) return;

    const activeTaskItem = tasks[activeIndex];

    if (isOverTask) {
      const overIndex = tasks.findIndex((t) => t.id === overId);
      if (overIndex === -1) return;

      const overTaskItem = tasks[overIndex];
      
      if (activeTaskItem.columnId !== overTaskItem.columnId) {
        const newTasks = [...tasks];
        newTasks[activeIndex] = { ...activeTaskItem, columnId: overTaskItem.columnId };
        // Pass the array directly to setTasks
        setTasks(arrayMove(newTasks, activeIndex, overIndex));
      }
    }
    
    if (isOverColumn) {
      if (activeTaskItem.columnId !== overId) {
        const newTasks = [...tasks];
        newTasks[activeIndex] = { ...activeTaskItem, columnId: overId };
        // Pass the array directly to setTasks
        setTasks(arrayMove(newTasks, activeIndex, newTasks.length - 1));
      }
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Use 'tasks' directly instead of a callback
    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    const overIndex = tasks.findIndex((t) => t.id === overId);
    
    if (activeIndex !== -1 && overIndex !== -1) {
      // Pass the array directly to setTasks
      setTasks(arrayMove(tasks, activeIndex, overIndex).map((t, index) => ({ ...t, order: index })));
    }
  };

  const dropAnimation = { 
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) 
  };

  return (
    <div className="flex-1 flex overflow-x-auto pb-4 h-[calc(100vh-140px)]">
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragStart={onDragStart} 
        onDragOver={onDragOver} 
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-6 items-start h-full">
          {columns.map((col) => (
            <KanbanColumn 
              key={col.id} 
              column={col} 
              tasks={filteredTasks.filter((task) => task.columnId === col.id).sort((a,b) => a.order - b.order)} 
              onAddTask={() => openNewTaskModal(col.id)} 
              onEditTask={openEditModal} 
            />
          ))}
        </div>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? <KanbanTask task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
      
      {isModalOpen && (
        <TaskModal 
          task={editingTask} 
          defaultColumnId={targetColumnId} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default KanbanBoard;