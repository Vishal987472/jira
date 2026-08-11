import { useEffect, useState } from "react";

import {
    CalendarDays,
    Loader2,
    Trash2,
    X
} from "lucide-react";

import {
    createTask,
    updateTask
} from "../../services/taskService";

import { getUsers } from "../../services/userService";

const initialForm = {
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    assigneeId: "",
    labels: "",
    status: "IDEA"
};

export default function TaskForm({
                                     task,
                                     onClose,
                                     onSaved,
                                     onDelete
                                 }) {

    const isEditing = Boolean(task);

    const [form, setForm] = useState(initialForm);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [usersLoading, setUsersLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        loadUsers();

        if (task) {

            setForm({
                title: task.title || "",
                description: task.description || "",
                priority: task.priority || "MEDIUM",
                dueDate: task.dueDate || "",
                assigneeId: task.assigneeId
                    ? String(task.assigneeId)
                    : "",
                labels: task.labels || "",
                status: task.status || "IDEA"
            });

        } else {

            setForm(initialForm);
        }

    }, [task]);

    const loadUsers = async () => {

        try {

            const data = await getUsers();

            setUsers(data);

        } catch (error) {

            console.error(error);

        } finally {

            setUsersLoading(false);
        }
    };

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm(current => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!form.title.trim()) {
            setError("Task title is required");
            return;
        }

        if (!form.description.trim()) {
            setError("Task description is required");
            return;
        }

        setLoading(true);

        try {

            const payload = {
                title: form.title.trim(),
                description: form.description.trim(),
                priority: form.priority,
                dueDate: form.dueDate || null,
                assigneeId: form.assigneeId
                    ? Number(form.assigneeId)
                    : null,
                labels: form.labels.trim(),
                ...(isEditing && {
                    status: form.status
                })
            };

            let savedTask;

            if (isEditing) {

                savedTask = await updateTask(
                    task.id,
                    payload
                );

            } else {

                savedTask = await createTask(
                    payload
                );
            }

            onSaved(savedTask);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save task"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            {isEditing
                                ? "Edit Task"
                                : "Create New Task"}
                        </h2>

                        <p className="text-sm text-slate-500">
                            {isEditing
                                ? "Update task information"
                                : "Add a new task to your board"}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto p-6"
                >

                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">

                        {/* Title */}

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Title *
                            </label>

                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Implement user authentication"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Description */}

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Description *
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Describe the task..."
                                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Grid */}

                        <div className="grid gap-4 sm:grid-cols-2">

                            {/* Priority */}

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Priority
                                </label>

                                <select
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="LOW">
                                        Low
                                    </option>

                                    <option value="MEDIUM">
                                        Medium
                                    </option>

                                    <option value="HIGH">
                                        High
                                    </option>

                                    <option value="CRITICAL">
                                        Critical
                                    </option>
                                </select>
                            </div>

                            {/* Status */}

                            {isEditing && (
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="IDEA">
                                            Idea
                                        </option>

                                        <option value="TODO">
                                            To Do
                                        </option>

                                        <option value="IN_PROGRESS">
                                            In Progress
                                        </option>

                                        <option value="IN_REVIEW">
                                            In Review
                                        </option>

                                        <option value="COMPLETED">
                                            Completed
                                        </option>
                                    </select>
                                </div>
                            )}

                            {/* Due Date */}

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Due Date
                                </label>

                                <div className="relative">

                                    <CalendarDays
                                        size={17}
                                        className="absolute left-3 top-3 text-slate-400"
                                    />

                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={form.dueDate}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>
                            </div>

                            {/* Assignee */}

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Assignee
                                </label>

                                <select
                                    name="assigneeId"
                                    value={form.assigneeId}
                                    onChange={handleChange}
                                    disabled={usersLoading}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                                >
                                    <option value="">
                                        Unassigned
                                    </option>

                                    {users.map(user => (
                                        <option
                                            key={user.id}
                                            value={user.id}
                                        >
                                            {user.fullName}
                                        </option>
                                    ))}

                                </select>
                            </div>

                        </div>

                        {/* Labels */}

                        <div>

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Labels
                            </label>

                            <input
                                name="labels"
                                value={form.labels}
                                onChange={handleChange}
                                placeholder="backend, bug, urgent"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <p className="mt-1 text-xs text-slate-400">
                                Separate labels with commas
                            </p>

                        </div>

                    </div>

                    {/* Footer */}

                    <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">

                        <div>

                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => onDelete(task)}
                                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            )}

                        </div>

                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                            >

                                {loading && (
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                )}

                                {isEditing
                                    ? "Save Changes"
                                    : "Create Task"}

                            </button>

                        </div>

                    </div>

                </form>

            </div>

        </div>
    );
}