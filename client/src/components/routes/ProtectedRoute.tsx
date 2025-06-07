import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const ProtectedRoute = () => {
    const accessToken = useAuthStore(state => state.accessToken);
    return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;