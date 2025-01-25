import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/user/userSlice';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { resendVerification } from '../../features/user/userApi';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { alerts, addAlert } = useAlerts();
  const { status, error } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { token, userInfo } = await dispatch(
        login({ email, password })
      ).unwrap();
      localStorage.setItem('token', token);
      addAlert('Login successful', 'success');
      navigate('/dashboard', { state: { userInfo } });
    } catch (err) {
      if (err === 'VERIFY') {
        addAlert('Please verify your email to login. Redirecting....', 'error');
        setIsVerifying(true);
        await resendVerification(email);
        return navigate('/verification-pending', { state: { email } });
      }
      addAlert(err, 'error');
    }
  };

  const handleDemoLogin = e => {
    e.preventDefault();
    setEmail('yaledevuni@gmail.com');
    setPassword('123123123a');
    dispatch(login({ email: 'yaledevuni@gmail.com', password: '123123123a' }))
      .unwrap()
      .then(({ token, userInfo }) => {
        localStorage.setItem('token', token);
        addAlert('Login successful', 'success');
        navigate('/dashboard', { state: { userInfo } });
      })
      .catch(err => {
        addAlert(err, 'error');
      });
  };

  const handleEnter = e => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  return (
    <div className="w-screen mt-36">
      <AlertContainer alerts={alerts} />
      <div className="w-1/3 mx-auto flex flex-col items-center border rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.3)] p-16 px-4 pb-8">
        <p className="font-bold mb-6">Login to Resume Manager</p>
        <form
          className="w-11/12 text-xs"
          id="login-form"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="email"
            id="email"
            autoComplete="email"
            className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-2 mb-4"
            value={email}
            onChange={e => setEmail(e.target.value.trim())}
            required
          />
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="password"
              autoComplete="current-password"
              className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-2 mb-6"
              value={password}
              onChange={e => setPassword(e.target.value.trim())}
              onKeyPress={handleEnter}
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
          <div className="w-full flex flex-row justify-end gap-2 mb-6">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-sm border rounded-md p-2 shadow-[0_0_10px_rgba(0,0,0,0.1)] w-28 hover:bg-gray-200"
            >
              Demo Login
            </button>
            <button
              type="submit"
              className={`text-sm border rounded-md p-2 shadow-[0_0_10px_rgba(0,0,0,0.1)] w-28 ${
                status === 'loading' || isVerifying
                  ? 'text-gray-500 cursor-wait'
                  : 'hover:bg-gray-200'
              }`}
              disabled={status === 'loading' || isVerifying}
            >
              {status === 'loading' ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <div>
          <Link to="/signup" className="">
            First time to make account?{' '}
            <span className="text-blue-600">Sign Up Here</span>
          </Link>
        </div>
        <div className="">
          <Link
            to="/forgot-password"
            className="text-blue-600 text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
