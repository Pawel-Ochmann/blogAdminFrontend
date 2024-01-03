import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Log_in from './Log_in';
import Post from './Post';


export const routes = [
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/log_in',
    element: <Log_in />,
  },
  {
    path:'/post',
    element:<Post />
  }
];

const router = createBrowserRouter(routes);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
