import { useEffect, useState } from "react";

import {
    CalendarDays,
    Download,
    File,
    FileText,
    History,
    Loader2,
    Trash2,
    Upload,
    User,
    X
} from "lucide-react";

import {
    deleteAttachment,
    deleteTask,
    downloadAttachment,
    getTaskAttachments,
    getTaskHistory,
    uploadAttachment
} from "../../services/taskService";

const priorityStyles = {
    LOW: "bg-slate-100 text-slate-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700"
};

const statusLabels = {
    IDEA: "Idea",
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    COMPLETED: "Completed"
};

const statusStyles = {
    IDEA: "bg-violet-100 text-violet-700",
    TODO: "bg-slate-100 text-slate-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    IN_REVIEW: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-emerald-100 text-emerald-700"
};

export default function TaskDetails({
                                        task,
                                        onClose,
                                        onEdit,
                                        onDeleted
                                    }) {

    const [attachments, setAttachments] =
        useState([]);

    const [history, setHistory] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [uploading, setUploading] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {

        if (!task) {
            return;
        }

        loadDetails();

    }, [task]);

    const loadDetails = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                attachmentData,
                historyData
            ] = await Promise.all([
                getTaskAttachments(task.id),
                getTaskHistory(task.id)
            ]);

            setAttachments(attachmentData);
            setHistory(historyData);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load task details"
            );

        } finally {

            setLoading(false);
        }
    };

    const handleUpload = async (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        try {

            setUploading(true);
            setError("");

            const attachment =
                await uploadAttachment(
                    task.id,
                    file
                );

            setAttachments(current => [
                ...current,
                attachment
            ]);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to upload attachment"
            );

        } finally {

            setUploading(false);

            event.target.value = "";
        }
    };

    const handleDownload = async (
        attachment
    ) => {

        try {

            const response =
                await downloadAttachment(
                    attachment.id
                );

            const url =
                window.URL.createObjectURL(
                    new Blob(
                        [response.data],
                        {
                            type:
                            attachment.fileType
                        }
                    )
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                attachment.fileName;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(error);

            setError(
                "Failed to download attachment"
            );
        }
    };

    const handleDeleteAttachment = async (
        attachment
    ) => {

        const confirmed =
            window.confirm(
                `Delete "${attachment.fileName}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteAttachment(
                attachment.id
            );

            setAttachments(current =>
                current.filter(
                    item =>
                        item.id !== attachment.id
                )
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete attachment"
            );
        }
    };

    const handleDeleteTask = async () => {

        const confirmed =
            window.confirm(
                `Delete "${task.title}" permanently?`
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteTask(task.id);

            onDeleted(task.id);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        }
    };

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            undefined,
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );
    };

    const formatDateTime = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleString(
            undefined,
            {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit"
            }
        );
    };

    const getFileIcon = (fileType) => {

        if (fileType?.startsWith("image/")) {
            return "🖼️";
        }

        if (fileType === "application/pdf") {
            return "📄";
        }

        return "📎";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

            <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                    <div className="min-w-0">

                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                            Task Details
                        </p>

                        <h2 className="truncate text-xl font-bold text-slate-900">
                            {task.title}
                        </h2>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Content */}

                <div className="flex-1 overflow-y-auto">

                    {error && (
                        <div className="mx-6 mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {loading ? (

                        <div className="flex min-h-80 items-center justify-center">

                            <Loader2
                                size={30}
                                className="animate-spin text-blue-600"
                            />

                        </div>

                    ) : (

                        <div className="grid gap-6 p-6 lg:grid-cols-3">

                            {/* Main */}

                            <div className="space-y-6 lg:col-span-2">

                                {/* Description */}

                                <section>

                                    <h3 className="mb-2 text-sm font-semibold text-slate-900">
                                        Description
                                    </h3>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                                        {task.description ||
                                            "No description provided."}
                                    </div>

                                </section>

                                {/* Attachments */}

                                <section>

                                    <div className="mb-3 flex items-center justify-between">

                                        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">

                                            <FileText size={17} />

                                            Attachments

                                            <span className="text-xs font-normal text-slate-400">
                                                ({attachments.length})
                                            </span>

                                        </h3>

                                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">

                                            {uploading ? (
                                                <Loader2
                                                    size={14}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Upload size={14} />
                                            )}

                                            {uploading
                                                ? "Uploading..."
                                                : "Upload"}

                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleUpload}
                                                disabled={uploading}
                                            />

                                        </label>

                                    </div>

                                    {attachments.length === 0 ? (

                                        <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">

                                            <File
                                                size={28}
                                                className="mx-auto text-slate-300"
                                            />

                                            <p className="mt-2 text-sm text-slate-500">
                                                No attachments yet
                                            </p>

                                        </div>

                                    ) : (

                                        <div className="space-y-2">

                                            {attachments.map(
                                                attachment => (

                                                    <div
                                                        key={
                                                            attachment.id
                                                        }
                                                        className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                                                    >

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg">
                                                            {getFileIcon(
                                                                attachment.fileType
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">

                                                            <p className="truncate text-sm font-medium text-slate-800">
                                                                {attachment.fileName}
                                                            </p>

                                                            <p className="text-xs text-slate-400">
                                                                {(
                                                                    attachment.fileSize /
                                                                    1024
                                                                ).toFixed(1)}
                                                                {" KB"}
                                                            </p>

                                                        </div>

                                                        <button
                                                            onClick={() =>
                                                                handleDownload(
                                                                    attachment
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                                            title="Download"
                                                        >
                                                            <Download
                                                                size={17}
                                                            />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDeleteAttachment(
                                                                    attachment
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                            title="Delete"
                                                        >
                                                            <Trash2
                                                                size={17}
                                                            />
                                                        </button>

                                                    </div>

                                                )
                                            )}

                                        </div>
                                    )}

                                </section>

                                {/* History */}

                                <section>

                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">

                                        <History size={17} />

                                        Status History

                                    </h3>

                                    {history.length === 0 ? (

                                        <div className="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-400">
                                            No status changes yet.
                                        </div>

                                    ) : (

                                        <div className="space-y-3">

                                            {history.map(item => (

                                                <div
                                                    key={item.id}
                                                    className="flex gap-3 rounded-xl border border-slate-200 p-4"
                                                >

                                                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />

                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex flex-wrap items-center gap-2 text-sm">

                                                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[item.oldStatus] || "bg-slate-100 text-slate-600"}`}>
                                                                {statusLabels[item.oldStatus] || item.oldStatus}
                                                            </span>

                                                            <span className="text-slate-400">
                                                                →
                                                            </span>

                                                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[item.newStatus] || "bg-slate-100 text-slate-600"}`}>
                                                                {statusLabels[item.newStatus] || item.newStatus}
                                                            </span>

                                                        </div>

                                                        <p className="mt-2 text-xs text-slate-400">

                                                            {item.changedByName}
                                                            {" • "}
                                                            {formatDateTime(
                                                                item.changedAt
                                                            )}

                                                        </p>

                                                    </div>

                                                </div>

                                            ))}

                                        </div>
                                    )}

                                </section>

                            </div>

                            {/* Sidebar */}

                            <aside className="space-y-4">

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                                    <h3 className="mb-4 text-sm font-semibold text-slate-900">
                                        Details
                                    </h3>

                                    <div className="space-y-4">

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Status
                                            </p>

                                            <span
                                                className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[task.status] || "bg-slate-100 text-slate-600"}`}
                                            >
                                                {statusLabels[task.status] ||
                                                    task.status}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Priority
                                            </p>

                                            <span
                                                className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority] || "bg-slate-100 text-slate-600"}`}
                                            >
                                                {task.priority || "—"}
                                            </span>
                                        </div>

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Assignee
                                            </p>

                                            <div className="mt-1 flex items-center gap-2">

                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                                                    {task.assigneeName
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                        "?"}
                                                </div>

                                                <span className="text-sm text-slate-700">
                                                    {task.assigneeName ||
                                                        "Unassigned"}
                                                </span>

                                            </div>

                                        </div>

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Due Date
                                            </p>

                                            <p className="mt-1 flex items-center gap-2 text-sm text-slate-700">

                                                <CalendarDays
                                                    size={15}
                                                />

                                                {formatDate(
                                                    task.dueDate
                                                )}

                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Created
                                            </p>

                                            <p className="mt-1 text-sm text-slate-700">
                                                {formatDate(
                                                    task.createdAt
                                                )}
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Last Updated
                                            </p>

                                            <p className="mt-1 text-sm text-slate-700">
                                                {formatDate(
                                                    task.updatedAt
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                {/* Labels */}

                                {task.labels && (
                                    <div className="rounded-xl border border-slate-200 p-4">

                                        <h3 className="mb-3 text-sm font-semibold text-slate-900">
                                            Labels
                                        </h3>

                                        <div className="flex flex-wrap gap-2">

                                            {task.labels
                                                .split(",")
                                                .map(label =>
                                                    label.trim()
                                                )
                                                .filter(Boolean)
                                                .map(label => (

                                                    <span
                                                        key={label}
                                                        className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                                                    >
                                                        {label}
                                                    </span>

                                                ))}

                                        </div>

                                    </div>
                                )}

                            </aside>

                        </div>
                    )}

                </div>

                {/* Footer */}

                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">

                    <button
                        onClick={handleDeleteTask}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>

                    <div className="flex gap-3">

                        <button
                            onClick={onClose}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Close
                        </button>

                        <button
                            onClick={() => onEdit(task)}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Edit Task
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}