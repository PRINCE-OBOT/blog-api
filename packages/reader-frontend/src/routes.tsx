import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import App from './App';

const routes = [
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <PostList />
      },
      {
        path: "/posts/:postId/post",
        element: <PostDetail />
      }
    ]
  }
];

export default routes;
