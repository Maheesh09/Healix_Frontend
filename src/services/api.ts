// API Configuration and Base Setup
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface Patient {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    nic?: string;
    created_at: string;
}

export interface RegisterData {
    full_name: string;
    email: string;
    phone?: string;
    password: string;
    nic?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    /**
     * Register a new patient account
     */
    async register(data: RegisterData): Promise<ApiResponse<Patient>> {
        try {
            const response = await fetch(`${this.baseUrl}/patients/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.detail || 'Registration failed',
                };
            }

            return result;
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    /**
     * Login with email and password
     */
    async login(data: LoginData): Promise<ApiResponse<Patient>> {
        try {
            const response = await fetch(`${this.baseUrl}/patients/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.detail || 'Login failed',
                };
            }

            return result;
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    /**
     * Get patient by ID
     */
    async getPatient(patientId: string): Promise<ApiResponse<Patient>> {
        try {
            const response = await fetch(`${this.baseUrl}/patients/${patientId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.detail || 'Failed to fetch patient',
                };
            }

            return result;
        } catch (error) {
            console.error('Get patient error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }
}

export const apiService = new ApiService();
