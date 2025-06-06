import api from '../api/axios';

export const updateMessage = (id: string, content: string) =>
    api.patch(`/chat/messages/${id}`, { content });

export const deleteMessage = (id: string) =>
    api.delete(`/chat/messages/${id}`);