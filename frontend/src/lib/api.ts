import axios from 'axios';

export interface InquiryData {
    sender_name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const getHomeData = async () => {
    try {
        const response = await api.get('/home');
        return response.data;
    } catch (error) {
        console.error('Error fetching home data:', error);
        return null;
    }
};

export const getServices = async () => {
    try {
        const response = await api.get('/services');
        return response.data;
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
};

export const getEquipments = async () => {
    try {
        const response = await api.get('/equipments');
        return response.data.data || response.data; 
    } catch (error) {
        console.error('Error fetching equipments:', error);
        return [];
    }
};

export const submitInquiry = async (data: InquiryData) => {
    try {
        const response = await api.post('/inquiry', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// --- API KHUSUS ADMIN ---

export const addEquipment = async (formData: FormData) => {
    const response = await api.post('/admin/equipments', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
};

export const updateEquipment = async (id: number, formData: FormData) => {
    formData.append('_method', 'PUT'); 
    const response = await api.post(`/admin/equipments/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
};

export const deleteEquipment = async (id: number) => {
    const response = await api.delete(`/admin/equipments/${id}`);
    return response.data;
};

export const getAdminCategories = async () => {
    const response = await api.get('/admin/categories');
    return response.data;
};

export const addCategory = async (data: { name: string, description: string }) => {
    const response = await api.post('/admin/categories', data);
    return response.data;
};

export const updateCategory = async (id: number, data: { name: string, description: string }) => {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: number) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
};

// Services
export const getAdminServices = async () => {
    const response = await api.get('/admin/services');
    return response.data;
};

export const addService = async (formData: FormData) => {
    const response = await api.post('/admin/services', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
};

export const updateService = async (id: number, formData: FormData) => {
    formData.append('_method', 'PUT'); 
    const response = await api.post(`/admin/services/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
};

export const deleteService = async (id: number) => {
    const response = await api.delete(`/admin/services/${id}`);
    return response.data;
};

export default api;