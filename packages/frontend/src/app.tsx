import { createBrowserRouter, RouterProvider } from 'react-router';
import { PageLayout, RequireAuth, RootLayout } from './layouts';
import { FilePage } from './pages/file';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { SharedFilePage } from './pages/shared-file';
import { SignupPage } from './pages/signup';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PageLayout />,
        children: [
          // Public routes
          { path: '/login/*', element: <LoginPage /> },
          { path: '/signup/*', element: <SignupPage /> },
          { path: '/file/:id/share', element: <SharedFilePage /> },
          // Protected routes
          {
            element: <RequireAuth />,
            children: [
              { path: '/', element: <HomePage /> },
              { path: '/file/:id', element: <FilePage /> },
            ],
          },
        ],
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
