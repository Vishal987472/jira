import {
    useDraggable
} from "@dnd-kit/core";

import {
    CalendarDays,
    GripVertical,
    User
} from "lucide-react";

const priorityStyles = {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700"
};

export default function TaskCard({
                                     task,
                                     onClick,
                                     overlay = false
                                 }) {

    const draggable = useDraggable({
        id: String(task.id),
        data: {
            task
        },
        disabled: overlay
    });

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging
    } = draggable;

    const style = transform
        ? {
            transform:
                `translate3d(${transform.x}px, ${transform.y}px, 0)`
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...(!overlay ? attributes : {})}
            className={`
                rounded-xl border border-slate-200
                bg-white p-4 shadow-sm
                transition
                ${isDragging
                ? "z-50 rotate-2 opacity-60 shadow-xl"
                : "hover:shadow-md"
            }
            `}
        >

            <div className="flex items-start gap-2">

                <button
                    {...(!overlay ? listeners : {})}
                    className="mt-0.5 cursor-grab text-slate-400 hover:text-slate-600 active:cursor-grabbing"
                    title="Drag task"
                >
                    <GripVertical size={16} />
                </button>

                <button
                    onClick={() => onClick(task)}
                    className="min-w-0 flex-1 text-left"
                >

                    <h3 className="font-medium text-slate-900">
                        {task.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {task.description}
                    </p>

                </button>

            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">

                {task.priority && (
                    <span
                        className={`
                            rounded-full px-2 py-1
                            text-[10px] font-semibold
                            ${priorityStyles[task.priority]}
                        `}
                    >
                        {task.priority}
                    </span>
                )}

                {task.dueDate && (
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                        <CalendarDays size={12} />
                        {task.dueDate}
                    </span>
                )}

            </div>

            <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3">

                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700">
                    {task.assigneeName
                            ?.charAt(0)
                            ?.toUpperCase()
                        || "?"}
                </div>

                <span className="truncate text-xs text-slate-500">
                    {task.assigneeName || "Unassigned"}
                </span>

            </div>

        </div>
    );
}