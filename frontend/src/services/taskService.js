import api from "./api";

export const getTasks = async () => {
    const response = await api.get("/tasks");
    return response.data;
};

export const getTask = async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
};

export const createTask = async (data) => {
    const response = await api.post("/tasks", data);
    return response.data;
};

export const updateTask = async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
};

export const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
};

export const updateTaskStatus = async (id, status) => {
    const response = await api.patch(
        `/tasks/${id}/status`,
        { status }
    );

    return response.data;
};

export const getTaskHistory = async (id) => {
    const response = await api.get(
        `/tasks/${id}/history`
    );

    return response.data;
};

export const getTaskAttachments = async (id) => {
    const response = await api.get(
        `/tasks/${id}/attachments`
    );

    return response.data;
};

export const uploadAttachment = async (taskId, file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        `/tasks/${taskId}/attachments`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};

export const downloadAttachment = async (id) => {

    const response = await api.get(
        `/attachments/${id}`,
        {
            responseType: "blob"
        }
    );

    return response;
};

export const deleteAttachment = async (id) => {
    await api.delete(`/attachments/${id}`);
};