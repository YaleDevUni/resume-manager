import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
import authApi from '../../services/UserApiService';
import { resendVerification } from '../../features/user/userApi';

const VerificationPending = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { alerts, addAlert } = useAlerts();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerification = async e => {
    e.preventDefault();
    if (isVerifying) return;
    try {
      setIsVerifying(true);
      await authApi.post('/verify', {
        email,
        code: verificationCode,
      });

      addAlert('Email verified successfully', 'success', 1500, () => {
        navigate('/login', { state: { email } });
      });
    } catch (error) {
      addAlert(
        error?.response?.data?.message || 'Verification failed',
        'error'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending) return;
    try {
      setIsResending(true);
      await resendVerification(email);
      addAlert('Verification code resent successfully', 'success');
    } catch (error) {
      addAlert(
        error?.response?.data?.message || 'Failed to resend code',
        'error'
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-screen mt-36">
      <AlertContainer alerts={alerts} />
      <div className="w-1/3 mx-auto flex flex-col items-center border rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.3)] p-16 px-4 pb-8">
        <svg
          className="w-16 h-16 text-yellow-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="text-gray-600 mb-6 text-center">
          A verification code has been sent to your email address. Please enter
          the 6-digit code below to verify your account.
        </p>

        <form onSubmit={handleVerification} className="w-full max-w-xs">
          <input
            type="text"
            maxLength="6"
            placeholder="Enter 6-digit code"
            className="w-full p-2 mb-4 border rounded-md text-center text-lg tracking-wider"
            value={verificationCode}
            onChange={e =>
              setVerificationCode(e.target.value.replace(/\D/g, ''))
            }
          />

          <button
            type="submit"
            disabled={verificationCode.length !== 6 || isVerifying}
            className={`w-full p-2 rounded-md text-white mb-3 ${
              verificationCode.length === 6 && !isVerifying
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            className={`w-full p-2 rounded-md text-white ${
              !isResending
                ? 'bg-gray-500 hover:bg-gray-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isResending ? 'Resending...' : 'Resend Code'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          If you don't see the email, please check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default VerificationPending;
