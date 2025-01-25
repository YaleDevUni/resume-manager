import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
import { forgotPassword } from '../../features/user/userApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { alerts, addAlert } = useAlerts();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      addAlert('Verification code sent to your email', 'success');
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      addAlert(
        error.response?.data?.message || 'Failed to send verification code',
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
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email address and we'll send you a verification code to
          reset your password.
        </p>
        <form className="w-11/12 text-xs" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-2 mb-6"
            value={email}
            onChange={e => setEmail(e.target.value.trim())}
            required
          />
          <div className="w-full flex flex-row justify-end mb-6">
            <button
              type="submit"
              className={`text-sm border rounded-md p-2 shadow-[0_0_10px_rgba(0,0,0,0.1)] w-36 ${
                isSubmitting ? 'text-gray-500 cursor-wait' : 'hover:bg-gray-200'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
