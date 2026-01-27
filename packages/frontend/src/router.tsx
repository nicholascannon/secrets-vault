import { createBrowserRouter } from 'react-router';
import { FileView } from './pages/file-view/file-view';
import { HomePage } from './pages/home/index';
import { LoginPage } from './pages/login/index';
import { SignupPage } from './pages/signup/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/file/:id',
    element: <FileView />,
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
