import { createBrowserRouter } from 'react-router';
import { FileShareView } from './pages/file-share-view';
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
    path: '/file/:id/share',
    element: <FileShareView />,
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
