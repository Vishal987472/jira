import { useDroppable } from "@dnd-kit/core";

const statusConfig = {
    IDEA: {
        title: "Idea",
        color: "bg-violet-500"
    },

    TODO: {
        title: "To Do",
        color: "bg-slate-500"
    },

    IN_PROGRESS: {
        title: "In Progress",
        color: "bg-blue-500"
    },

    IN_REVIEW: {
        title: "In Review",
        color: "bg-amber-500"
    },

    COMPLETED: {
        title: "Completed",
        color: "bg-emerald-500"
    }
};

export default function TaskColumn({
                                       status,
                                       tasks,
                                       children
                                   }) {

    const { setNodeRef, isOver } =
        useDroppable({
            id: status
        });

    const config = statusConfig[status];

    return (
        <div
            ref={setNodeRef}
            className={`
                flex min-h-[500px] w-[280px]
                shrink-0 flex-col rounded-xl
                border border-slate-200
                bg-slate-100/70
                transition
                ${isOver ? "ring-2 ring-blue-400" : ""}
            `}
        >

            {/* Header */}

            <div className="flex items-center justify-between p-4">

                <div className="flex items-center gap-2">

                    <span
                        className={`
                            h-2.5 w-2.5 rounded-full
                            ${config.color}
                        `}
                    />

                    <h2 className="text-sm font-semibold text-slate-700">
                        {config.title}
                    </h2>

                </div>

                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                    {tasks.length}
                </span>

            </div>

            {/* Cards */}

            <div className="flex flex-1 flex-col gap-3 px-3 pb-3">

                {children}

                {tasks.length === 0 && (
                    <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-xs text-slate-400">
                        Drop tasks here
                    </div>
                )}

            </div>

        </div>
    );
}