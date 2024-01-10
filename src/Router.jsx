import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Log_in from './Log_in';
import Post from './Post';
import PostForm from './PostForm';


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
    path:'/:postId/edit',
    element:<PostForm />
  },
  {
    path:'/:postId',
    element:<Post />
  },
  {
    path:'posts/new',
    element:<PostForm />
  }
];

const router = createBrowserRouter(routes);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
