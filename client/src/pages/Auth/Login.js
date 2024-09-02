import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/user/userSlice';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
import useLocalStorage from '../../hooks/useLocalStorage';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { alerts, addAlert } = useAlerts();
  // const { setLocalStorageStateValue: setToken } = useLocalStorage(
  //   'token',
  //   null,
  //   ''
  // );
  const { status, user, error } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const handleSubmit = async e => {
    e.preventDefault();
    try {
    
      const { token, userInfo } = await dispatch(
        login({ username, password })
      ).unwrap();
      // setToken(token);
      localStorage.setItem('token', token);
      alert('Login successful');
      navigate('/dashboard', { state: { userInfo } });
    } catch (err) {
      addAlert(err, 'error');
    }
  };
  useEffect(() => {
    if (location.state?.username) {
      setUsername(location.state.username);
    }
  }, [location.state]);

  return (
    <div className="w-screen  mt-36  ">
      <AlertContainer alerts={alerts} />
      <div className=" w-1/2 mx-auto flex flex-col items-center border rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.3)] p-16 px-4 pb-8">
        <p className=" text-2xl font-bold  mb-6">Login to Resume Manger</p>
        <form className=" w-11/12" id="login-form">
          <input
            type="text"
            placeholder="username"
            id="username"
            autoComplete="on"
            className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-3 mb-6 "
            value={username}
            onChange={e => setUsername(e.target.value.trim())}
          ></input>
          <input
            id="password"
            type="password"
            placeholder="password"
            autoComplete="current-password"
            className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] w-full p-3 mb-6 "
            value={password}
            onChange={e => setPassword(e.target.value.trim())}
          ></input>
        </form>
        <div className=" w-11/12 flex flex-row justify-end mb-6">
          <button
            className={`border rounded-md p-3 shadow-[0_0_10px_rgba(0,0,0,0.1)]  w-32 ${
              status === 'loading'
                ? ` text-gray-500 cursor-wait`
                : `hover:bg-gray-200`
            }`}
            onClick={status !== 'loading' ? handleSubmit : () => {}}
          >
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <div>
          <Link to="/signup" className=" text-xl">
            First time to make account?{' '}
            <span className=" text-blue-600">Sign Up Here</span>{' '}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
