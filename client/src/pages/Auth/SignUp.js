// src/pages/auth/Register.js
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../features/user/userSlice';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [jumpToLogin, setJumpToLogin] = useState(false);
  const [preventPress, setPreventPress] = useState(false);
  const { alerts, addAlert } = useAlerts();
  const { status, error } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (/\s/.test(password))
        throw new Error('Password cannot contain spaces');
      if (password !== confirmPassword)
        throw new Error('Passwords do not match');
      setPreventPress(true);
      await dispatch(register({ email, password })).unwrap();
      addAlert('Registration successful', 'success', 1500, () => {
        setPreventPress(false);
        navigate('/verification-pending');
      });
    } catch (err) {
      setPreventPress(false);
      addAlert(err?.message || err, 'error');
    }
  };

  useEffect(() => {
    if (jumpToLogin) {
      navigate('/login', { state: { email } });
    }
  }, [jumpToLogin, navigate]);

  return (
    <div className="w-screen  mt-36  ">
      <AlertContainer alerts={alerts} />
      <div className=" w-1/3 mx-auto flex flex-col items-center border rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.3)] p-16 px-4 pb-8">
        <p className=" font-bold  mb-6">Welcome to Resume Manger</p>
        <form className=" w-11/12 text-xs" id="login-form">
          <input
            type="email"
            placeholder="email"
            id="email"
            autoComplete="email"
            className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-2 mb-4 "
            value={email}
            onChange={e => setEmail(e.target.value.trim())}
          />
          <input
            id="password"
            type="password"
            placeholder="password"
            autoComplete="new-password"
            className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-2 mb-4 "
            value={password}
            onChange={e => setPassword(e.target.value.trim())}
          />
          <input
            id="confirm-password"
            type="password"
            placeholder="confirm-password"
            autoComplete="new-password"
            className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-2 mb-4 "
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </form>
        <div className=" w-11/12 flex flex-row justify-end mb-6">
          <button
            className={`border text-sm rounded-md p-2 shadow-[0_0_10px_rgba(0,0,0,0.1)]  w-28 ${
              preventPress ? ` text-gray-500 cursor-wait` : `hover:bg-gray-200`
            }`}
            onClick={preventPress ? () => {} : handleSubmit}
          >
            {preventPress ? 'Signing Up..' : 'Sign Up'}
          </button>
        </div>
        <div>
          <Link to="/login" className="">
            Do you have an account?{' '}
            <span className=" text-blue-600">Login Here</span>{' '}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
