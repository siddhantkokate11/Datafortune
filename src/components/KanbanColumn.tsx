import React, { useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Column, Task } from '../types';
import KanbanTask from './KanbanTask';
import { PlusIcon } from './Icons';

interface Props { 
  column: Column; 
  tasks: Task[]; 
  onAddTask: () => void; 
  onEditTask: (task: Task) => void; 
}

const KanbanColumn: React.FC<Props> = ({ column, tasks, onAddTask, onEditTask }) => {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  
  // The 'setNodeRef' must be applied to the droppable area to allow drag-and-drop
  const { setNodeRef, isOver } = useDroppable({ 
    id: column.id, 
    data: { 
      type: 'Column', 
      column 
    } 
  });

  
  // Premium SaaS Color Mapping for Recruitment Dashboard
  const getHeaderStyles = (title: string) => {
    const name = title.toLowerCase();
    if (name.includes('sourced') || name.includes('to do')) 
      return { border: 'border-t-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500' };
    if (name.includes('progress')) 
      return { border: 'border-t-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500' };
    if (name.includes('interview') || name.includes('review')) 
      return { border: 'border-t-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-600', dot: 'bg-purple-500' };
    return { border: 'border-t-indigo-500', bg: 'bg-indigo-500/10', text: 'text-indigo-600', dot: 'bg-indigo-500' };
  };

  const styles = getHeaderStyles(column.title);

  return (
    <div className={`
      w-80 min-w-[320px] flex flex-col bg-[#F9FAFB] rounded-2xl 
      border-t-4 ${styles.border} shadow-sm max-h-full transition-colors duration-200
      ${isOver ? 'bg-slate-100/80' : ''}
    `}>
      {/* Premium Column Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${styles.dot}`}></div>
          <h3 className={`font-black ${styles.text} text-[11px] uppercase tracking-[0.12em]`}>
            {column.title}
          </h3>
          <span className="ml-1 bg-white text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200 shadow-sm">
            {tasks.length}
          </span>
        </div>
        
        {/* ADD TASK BUTTON - Ensure this doesn't interfere with column dragging */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevents click from bubbling to DND sensors
            onAddTask();
          }} 
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {/* DRAPPABLE AREA */}
      <div 
        ref={setNodeRef} 
        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1 min-h-[200px]"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanTask 
              key={task.id} 
              task={task} 
              onEdit={() => onEditTask(task)} // Ensure the callback is passed down
            />
          ))}
        </SortableContext>

        {/* Dynamic Empty State */}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
              <PlusIcon className="w-5 h-5 text-slate-300" />
            </div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
              No Candidates
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;