// src/pages/auth/Register.js
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../features/user/userSlice';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
const SignUp = () => {
  const [username, setUsername] = useState('');
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
    if (password !== confirmPassword) {
      addAlert('Passwords do not match', 'error');
      return;
    }
    try {
      setPreventPress(true);
      await dispatch(register({ username, password })).unwrap();
      addAlert('Registration successful', 'success', 1500, () => {
        // NOTE: Link is not working as expected because of the lifecycle of the component.
        // You have to trigger the callback in the parent component of this hook.
        setPreventPress(false);
        setJumpToLogin(true);
      });
    } catch (err) {
      setPreventPress(false);
      addAlert(err, 'error');
    }
  };

  useEffect(() => {
    if (jumpToLogin) {
      navigate('/login', { state: { username } });
    }
  }, [jumpToLogin, navigate]);

  //  // Reset error alert if any on input change
  //  const handleChange = setter => e => {
  //    setter(e.target.value);
  //    if (error) dispatch(resetError());
  //  };
  return (
    <div className="w-screen  mt-36  ">
      <AlertContainer alerts={alerts} />
      <div className=" w-1/2 mx-auto flex flex-col items-center border rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.3)] p-16 px-4 pb-8">
        <p className=" text-2xl font-bold  mb-6">Welcome to Resume Manger</p>
        <form className=" w-11/12" id="login-form">
          <input
            type="text"
            placeholder="username"
            id="username"
            autoComplete="on"
            className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-3 mb-6 "
            value={username}
            onChange={e => setUsername(e.target.value)}
          ></input>
          <input
            id="password"
            type="password"
            placeholder="password"
            autoComplete="new-password"
            className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-3 mb-6 "
            value={password}
            onChange={e => setPassword(e.target.value)}
          ></input>
          <input
            id="confirm-password"
            type="password"
            placeholder="confirm-password"
            autoComplete="new-password"
            className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-3 mb-6 "
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          ></input>
        </form>
        <div className=" w-11/12 flex flex-row justify-end mb-6">
          <button
            className={`border rounded-md p-3 shadow-[0_0_10px_rgba(0,0,0,0.1)]  w-32 ${
              preventPress ? ` text-gray-500 cursor-wait` : `hover:bg-gray-200`
            }`}
            onClick={preventPress ? () => {} : handleSubmit}
          >
            {preventPress ? 'Signing Up..' : 'Sign Up'}
          </button>
        </div>
        <div>
          <Link to="/login" className=" text-xl">
            Do you have an account?{' '}
            <span className=" text-blue-600">Login Here</span>{' '}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
