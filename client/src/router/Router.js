import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import DashBoard from '../pages/DashBoard/DashBoard';
import ProtectedRoute from './ProtectedRoute';
import { createBrowserRouter } from 'react-router-dom';
import { isAuthenticated } from '../services/AuthService';
// Define the routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    index: true,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    element: <ProtectedRoute isAuthenticated={isAuthenticated()} />, // Protects the nested routes
    children: [
      {
        path: '/dashboard',
        element: <DashBoard />,
      },
      // Add other protected routes here if needed
    ],
  },
  {
    path: '*',
    element: <p>404 Error - Nothing here...</p>, // Fallback for undefined routes
  },
]);

export default router;
