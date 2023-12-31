import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Log_in from './Log_in';

export const routes = [
  {
    path: '/',
    element: <Log_in />,
  },
  {
    path: '/logged',
    element: <App />,
  },
];

const router = createBrowserRouter(routes);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
