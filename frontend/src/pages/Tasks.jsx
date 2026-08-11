import { useEffect, useState } from "react";

import {
    Plus,
    RefreshCw,
    Trash2
} from "lucide-react";

import KanbanBoard from "../components/task/KanbanBoard";
import TaskForm from "../components/task/TaskForm";
import TaskDetails from "../components/task/TaskDetails";

import {
    deleteTask,
    getTasks,
    updateTaskStatus
} from "../services/taskService";

export default function Tasks() {

    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [selectedTask, setSelectedTask] =
        useState(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getTasks();

            setTasks(data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load tasks"
            );

        } finally {

            setLoading(false);
        }
    };

    const handleCreate = () => {

        setEditingTask(null);
        setShowForm(true);
    };

    const handleTaskClick = (task) => {

        setSelectedTask(task);
    };

    const handleEditFromDetails = (task) => {

        setSelectedTask(null);

        setEditingTask(task);

        setShowForm(true);
    };

    const handleDeletedFromDetails = (taskId) => {

        setTasks(current =>
            current.filter(
                task => task.id !== taskId
            )
        );

        setSelectedTask(null);
    };

    const handleSaved = (savedTask) => {

        setTasks(current => {

            const exists = current.some(
                task => task.id === savedTask.id
            );

            if (exists) {

                return current.map(task =>
                    task.id === savedTask.id
                        ? savedTask
                        : task
                );
            }

            return [
                savedTask,
                ...current
            ];
        });

        setShowForm(false);
        setEditingTask(null);
    };

    const handleStatusChange = async (
        taskId,
        newStatus
    ) => {

        const previousTasks = [...tasks];

        setTasks(current =>
            current.map(task =>
                task.id === taskId
                    ? {
                        ...task,
                        status: newStatus
                    }
                    : task
            )
        );

        try {

            const updatedTask =
                await updateTaskStatus(
                    taskId,
                    newStatus
                );

            setTasks(current =>
                current.map(task =>
                    task.id === taskId
                        ? updatedTask
                        : task
                )
            );

        } catch (error) {

            console.error(error);

            setTasks(previousTasks);

            setError(
                error.response?.data?.message ||
                "Failed to update task status"
            );
        }
    };

    const handleDelete = async (task) => {

        const confirmed = window.confirm(
            `Are you sure you want to delete "${task.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteTask(task.id);

            setTasks(current =>
                current.filter(
                    item => item.id !== task.id
                )
            );

            setShowForm(false);
            setEditingTask(null);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        }
    };

    if (loading) {

        return (
            <div className="flex min-h-64 items-center justify-center">

                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Page Header */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Tasks
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage and track your team's work
                    </p>

                </div>

                <div className="flex gap-2">

                    <button
                        onClick={loadTasks}
                        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>

                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        <Plus size={17} />
                        New Task
                    </button>

                </div>

            </div>

            {/* Error */}

            {error && (
                <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">

                    <span>{error}</span>

                    <button
                        onClick={() => setError("")}
                        className="font-medium"
                    >
                        ×
                    </button>

                </div>
            )}

            {/* Board */}

            <KanbanBoard
                tasks={tasks}
                onStatusChange={handleStatusChange}
                onTaskClick={handleTaskClick}
            />

            {/* Form */}

            {showForm && (
                <TaskForm
                    task={editingTask}
                    onClose={() => {
                        setShowForm(false);
                        setEditingTask(null);
                    }}
                    onSaved={handleSaved}
                    onDelete={handleDelete}
                />
            )}

            {selectedTask && (
                <TaskDetails
                    task={selectedTask}
                    onClose={() => {
                        setSelectedTask(null);
                    }}
                    onEdit={handleEditFromDetails}
                    onDeleted={handleDeletedFromDetails}
                />
            )}

        </div>
    );
}