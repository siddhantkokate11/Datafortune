import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal } from 'lucide-react';
import { Priority } from '../types';
import type { Task } from '../types';

interface Props {
  task: Task;
  isOverlay?: boolean;
}

const KanbanTask: React.FC<Props> = ({ task, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'Task',
      task,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group bg-white p-5 rounded-xl border border-slate-200/60 transition-all duration-300
        ${isDragging ? 'shadow-2xl ring-2 ring-indigo-500/20' : 'shadow-[0_1px_3px_rgba(0,0,0,0.05)]'}
        hover:shadow-lg hover:border-slate-300 cursor-default
      `}
    >
      {/* Top Section: Avatar and Info */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
             {/* Dynamic Initials from AssigneeId */}
             <span className="text-xs font-bold text-slate-500 uppercase">
               {task.assigneeId?.slice(0, 2) || 'UN'}
             </span>
          </div>
          {/* Active status dot as seen in premium UIs */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-slate-900 text-sm truncate leading-none mb-1">
              {task.title}
            </h3>
            <button className="text-slate-300 hover:text-slate-500 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 font-medium truncate">
            {task.assigneeId.toLowerCase()}@gmail.com
          </p>
        </div>
      </div>

      {/* Metadata Row: LinkedIn/Platform Style */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md">
          <div className="w-3.5 h-3.5 bg-[#0077B5] rounded-[2px] flex items-center justify-center text-[7px] text-white font-black">
            in
          </div>
          <span className="text-[10px] text-slate-500 font-bold tracking-tight">LinkedIn</span>
        </div>
        
        {/* Drag Handle Area - Now integrated more subtly */}
        <div 
          {...attributes} 
          {...listeners} 
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-slate-300 hover:text-indigo-500"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 2H5V3H4V2ZM7 2H8V3H7V2ZM4 5H5V6H4V5ZM7 5H8V6H7V5ZM4 8H5V9H4V8ZM7 8H8V9H7V8Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Bottom Row: Status and Priority Dots */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${
            task.priority === Priority.High ? 'bg-rose-500' : 
            task.priority === Priority.Medium ? 'bg-amber-500' : 'bg-emerald-500'
          }`} />
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-tighter">
            {task.priority}
          </span>
        </div>

        <div className="flex items-center -space-x-1.5">
          <div className="w-4 h-4 rounded-full bg-indigo-500 border border-white shadow-sm"></div>
          <div className="w-4 h-4 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center text-[6px] font-bold text-slate-500">
            +3
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanTask;