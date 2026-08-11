import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import { useState } from "react";

import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";

const STATUSES = [
    "IDEA",
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
    "COMPLETED"
];

export default function KanbanBoard({
                                        tasks,
                                        onStatusChange,
                                        onTaskClick
                                    }) {

    const [activeTask, setActiveTask] =
        useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        })
    );

    const handleDragStart = (event) => {

        const task = tasks.find(
            task =>
                String(task.id) ===
                String(event.active.id)
        );

        setActiveTask(task || null);
    };

    const handleDragEnd = async (event) => {

        const {
            active,
            over
        } = event;

        setActiveTask(null);

        if (!over) {
            return;
        }

        const task = tasks.find(
            task =>
                String(task.id) ===
                String(active.id)
        );

        if (!task) {
            return;
        }

        const newStatus = over.id;

        if (!STATUSES.includes(newStatus)) {
            return;
        }

        if (task.status === newStatus) {
            return;
        }

        await onStatusChange(
            task.id,
            newStatus
        );
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >

            <div className="flex gap-4 overflow-x-auto pb-4">

                {STATUSES.map((status) => {

                    const columnTasks =
                        tasks.filter(
                            task =>
                                task.status === status
                        );

                    return (
                        <TaskColumn
                            key={status}
                            status={status}
                            tasks={columnTasks}
                        >

                            {columnTasks.map(task => (

                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClick={onTaskClick}
                                />

                            ))}

                        </TaskColumn>
                    );

                })}

            </div>

            <DragOverlay>

                {activeTask ? (
                    <div className="w-[280px]">
                        <TaskCard
                            task={activeTask}
                            onClick={() => {}}
                            overlay
                        />
                    </div>
                ) : null}

            </DragOverlay>

        </DndContext>
    );
}