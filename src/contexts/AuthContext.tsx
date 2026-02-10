import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient } from '@/services/api';

interface AuthContextType {
    patient: Patient | null;
    isAuthenticated: boolean;
    login: (patient: Patient) => void;
    logout: () => void;
    updatePatient: (patient: Patient) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'healix_patient';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load patient from localStorage on mount
    useEffect(() => {
        try {
            const storedPatient = localStorage.getItem(STORAGE_KEY);
            if (storedPatient) {
                setPatient(JSON.parse(storedPatient));
            }
        } catch (error) {
            console.error('Failed to load patient from storage:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (patientData: Patient) => {
        setPatient(patientData);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(patientData));
        } catch (error) {
            console.error('Failed to save patient to storage:', error);
        }
    };

    const updatePatient = (patientData: Patient) => {
        setPatient(patientData);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(patientData));
        } catch (error) {
            console.error('Failed to update patient in storage:', error);
        }
    };

    const logout = () => {
        setPatient(null);
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem('NIC'); // Also remove NIC if stored
        } catch (error) {
            console.error('Failed to remove patient from storage:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                patient,
                isAuthenticated: !!patient,
                login,
                logout,
                updatePatient,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

