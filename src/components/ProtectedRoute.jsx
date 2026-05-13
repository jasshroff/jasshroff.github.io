import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hasAnyRole, isPrimaryAdminEmail } from '../utils/authClaims';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { currentUser, authClaims } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (
        allowedRoles.length > 0 &&
        !isPrimaryAdminEmail(currentUser?.email) &&
        !hasAnyRole(authClaims, allowedRoles)
    ) {
        return <Navigate to="/profile" replace />;
    }

    return children;
};

export default ProtectedRoute;
