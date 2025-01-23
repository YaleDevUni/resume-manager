import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import DashBoard from '../pages/DashBoard/DashBoard';
import PdfUploader from '../pages/PdfUploader/RecruitmentAndPdf';
import ProtectedRoute from './ProtectedRoute';
import { createBrowserRouter } from 'react-router-dom';
import { isAuthenticated } from '../services/AuthService';
import VerificationSuccess from '../pages/Auth/VerificationSuccess';
import VerificationPending from '../pages/Auth/VerificationPending';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';
import UserInfo from '../pages/User/UserInfo';
import ChangePassword from '../pages/Auth/ChangePassword';
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
    path: '/verification-success',
    element: <VerificationSuccess />,
  },
  {
    path: '/verification-pending',
    element: <VerificationPending />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />,
  },
  {
    element: <ProtectedRoute isAuthenticated={isAuthenticated} />, // Protects the nested routes
    children: [
      {
        path: '/dashboard',
        element: <DashBoard />,
      },
      {
        path: '/dashboard/pdf-uploader',
        element: <PdfUploader />,
      },
      {
        path: '/dashboard/profile',
        element: <UserInfo />,
      },
      {
        path: '/dashboard/change-password',
        element: <ChangePassword />,
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
