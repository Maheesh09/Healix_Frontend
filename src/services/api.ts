// API Configuration and Base Setup
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-production-ecd63.up.railway.app/api/v1';

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

export interface CareCircleMember {
    id: string;
    patient_id: string;
    name: string;
    email: string;
    created_at: string;
}

export interface CareCircleMemberCreate {
    patient_id: string;
    name: string;
    email: string;
}

export interface CareCircleMemberUpdate {
    name?: string;
    email?: string;
}

export interface Medication {
    id: string;
    patient_id: string;
    name: string;
    dosage_mg: number;
    frequency_per_day: number;
    instructions?: string;
    created_at: string;
}

export interface MedicationCreate {
    patient_id: string;
    name: string;
    dosage_mg: number;
    frequency_per_day: number;
    instructions?: string;
}

export interface MedicationUpdate {
    name?: string;
    dosage_mg?: number;
    frequency_per_day?: number;
    instructions?: string;
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

    /**
     * Update patient information
     */
    async updatePatient(patientId: string, updates: Partial<Patient>): Promise<ApiResponse<Patient>> {
        try {
            const response = await fetch(`${this.baseUrl}/patients/${patientId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.detail || 'Failed to update patient',
                };
            }

            return result;
        } catch (error) {
            console.error('Update patient error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    /**
     * Delete patient account
     */
    async deletePatient(patientId: string): Promise<ApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/patients/${patientId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.detail || 'Failed to delete patient',
                };
            }

            return result;
        } catch (error) {
            console.error('Delete patient error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }


    // ==================== Care Circle Members API ====================

    /**
     * Get all care circle members
     */
    async getCareCircleMembers(patientId?: string): Promise<ApiResponse<CareCircleMember[]>> {
        try {
            const url = patientId
                ? `${this.baseUrl}/care-circle/members?patient_id=${patientId}`
                : `${this.baseUrl}/care-circle/members`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.detail || 'Failed to fetch members',
                };
            }

            return result;
        } catch (error) {
            console.error('Get care circle members error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    /**
     * Create a new care circle member
     */
    async createCareCircleMember(data: CareCircleMemberCreate): Promise<ApiResponse<CareCircleMember>> {
        try {
            const response = await fetch(`${this.baseUrl}/care-circle/members`, {
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
                    error: result.detail || 'Failed to add member',
                };
            }

            return result;
        } catch (error) {
            console.error('Create care circle member error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    /**
     * Update a care circle member
     */
    async updateCareCircleMember(memberId: string, data: CareCircleMemberUpdate): Promise<ApiResponse<CareCircleMember>> {
        try {
            const response = await fetch(`${this.baseUrl}/care-circle/members/${memberId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.detail || 'Failed to update member',
                };
            }

            return result;
        } catch (error) {
            console.error('Update care circle member error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    /**
     * Delete a care circle member
     */
    async deleteCareCircleMember(memberId: string): Promise<ApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/care-circle/members/${memberId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.detail || 'Failed to delete member',
                };
            }

            return result;
        } catch (error) {
            console.error('Delete care circle member error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    // ==================== Medications API ====================

    /**
     * Get all medications
     */
    async getMedications(): Promise<ApiResponse<Medication[]>> {
        try {
            const response = await fetch(`${this.baseUrl}/medications/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.detail || 'Failed to fetch medications',
                };
            }

            return result;
        } catch (error) {
            console.error('Get medications error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    /**
     * Get medications for a specific patient
     */
    async getMedicationsByPatient(patientId: string): Promise<ApiResponse<Medication[]>> {
        try {
            const response = await fetch(`${this.baseUrl}/medications/patient/${patientId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.detail || 'Failed to fetch medications',
                };
            }

            return result;
        } catch (error) {
            console.error('Get patient medications error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    /**
     * Create a new medication
     */
    async createMedication(data: MedicationCreate): Promise<ApiResponse<Medication>> {
        try {
            const response = await fetch(`${this.baseUrl}/medications/`, {
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
                    error: result.detail || 'Failed to add medication',
                };
            }

            return result;
        } catch (error) {
            console.error('Create medication error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    /**
     * Update a medication
     */
    async updateMedication(medicationId: string, data: MedicationUpdate): Promise<ApiResponse<Medication>> {
        try {
            const response = await fetch(`${this.baseUrl}/medications/${medicationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.detail || 'Failed to update medication',
                };
            }

            return result;
        } catch (error) {
            console.error('Update medication error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    /**
     * Delete a medication
     */
    async deleteMedication(medicationId: string): Promise<ApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/medications/${medicationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.detail || 'Failed to delete medication',
                };
            }

            return result;
        } catch (error) {
            console.error('Delete medication error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }
}


export const apiService = new ApiService();

