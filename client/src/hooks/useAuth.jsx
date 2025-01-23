import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../features/user/userSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector(state => state.user);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user]);

  return { user, status, isAuthenticated: !!token };
};
