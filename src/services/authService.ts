import api from '../api/axios';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'waiter' | 'cashier';
}

interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

const authService = {
    async login(credentials: object): Promise<LoginResponse> {
        await api.get('http://localhost:8000/sanctum/csrf-cookie');

        const { data } = await api.post<LoginResponse>('/login', credentials);
        
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    logout(): void {
        api.post('/logout').finally(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        });
    },

    getCurrentUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default authService;