import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/user/userSlice';

const UserInfo = () => {
  const user = useSelector(state => state.user.user);
  const { alerts } = useAlerts();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem('token');
    // Dispatch logout action to clear user state
    dispatch(logout());
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="w-screen mt-36">
      <AlertContainer alerts={alerts} />
      <div className="w-1/3 mx-auto flex flex-col items-center border rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.3)] p-16 px-4 pb-8">
        <div className="flex flex-col items-center mb-6">
          <FaUserCircle className="w-20 h-20 text-gray-600 mb-4" />
          <h2 className="text-xl font-bold">User Profile</h2>
        </div>

        <div className="w-11/12 text-xs">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="p-2 bg-gray-50 rounded-md">{user?.email}</div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Status
            </label>
            <div className="p-2 bg-gray-50 rounded-md">
              {user?.isVerified ? (
                <span className="text-green-600">Verified</span>
              ) : (
                <span className="text-red-600">Not Verified</span>
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Security Options
            </h3>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/change-password')}
                className="text-sm border rounded-md p-2 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-gray-200 text-left"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm border rounded-md p-2 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-red-100 text-red-600 text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
