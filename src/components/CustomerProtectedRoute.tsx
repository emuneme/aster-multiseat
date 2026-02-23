import { Navigate, Outlet } from 'react-router-dom';
import { useCustomerAuthStore } from '../store/customerAuthStore';

const CustomerProtectedRoute = () => {
    const { isCustomerAuthenticated } = useCustomerAuthStore();

    if (!isCustomerAuthenticated) {
        return <Navigate to="/portal/login" replace />;
    }

    return <Outlet />;
};

export default CustomerProtectedRoute;
