import PostList from "./pages/PostList";
import PostDetail from "./pages/PostDetail";
import NotFoundPage from "./components/NotFoundPage";
import App from "./App";

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
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
];

export default routes;
