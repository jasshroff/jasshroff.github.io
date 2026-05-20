import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hasAnyRole } from '../utils/authClaims';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { currentUser, authClaims } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (
        allowedRoles.length > 0 &&
        !hasAnyRole(authClaims, allowedRoles, currentUser?.email)
    ) {
        return <Navigate to="/profile" replace />;
    }

    return children;
};

export default ProtectedRoute;
