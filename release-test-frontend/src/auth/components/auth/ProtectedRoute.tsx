import React, { useEffect } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import LoginRequired from '@/auth/pages/LoginRequired';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isLoggedIn, checkLoginStatus } = useAuth();

    useEffect(() => {
        checkLoginStatus();
    }, [checkLoginStatus]);

    if (!isLoggedIn) {
        return <LoginRequired />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;