export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getApiUrl = (path: string) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE_URL}/api/${cleanPath}`;
}; 