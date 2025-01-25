import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
import { resetPassword } from '../../features/user/userApi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { alerts, addAlert } = useAlerts();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email) {
      addAlert('Email not found. Please try again', 'error');
      return navigate('/forgot-password');
    }

    if (password !== confirmPassword) {
      addAlert('Passwords do not match', 'error');
      return;
    }

    setIsSubmitting(true);

    try {

      await resetPassword(code, password, email);
      addAlert('Password reset successful', 'success');
      setTimeout(() => navigate('/login', { state: { email } }), 2000);
    } catch (error) {
      addAlert(
        error.response?.data?.message || 'Failed to reset password',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen mt-36">
      <AlertContainer alerts={alerts} />
      <div className="w-1/3 mx-auto flex flex-col items-center border rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.3)] p-16 px-4 pb-8">
        <p className="font-bold mb-6">Reset Password</p>
        <form className="w-11/12 text-xs" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="p-2 bg-gray-50 rounded-md">{email}</div>
          </div>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-2 mb-4"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            required
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-2"
              value={password}
              onChange={e => setPassword(e.target.value.trim())}
              required
            />
          </div>
          <div className="relative mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-2"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value.trim())}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
          <div className="w-full flex flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm border rounded-md p-2 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`text-sm border rounded-md p-2 shadow-[0_0_10px_rgba(0,0,0,0.1)] w-36 ${
                isSubmitting ? 'text-gray-500 cursor-wait' : 'hover:bg-gray-200'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
