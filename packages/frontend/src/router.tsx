import { createBrowserRouter } from 'react-router';
import { HomePage } from './pages/home/index';
import { LoginPage } from './pages/login/index';
import { SignupPage } from './pages/signup/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
]);
