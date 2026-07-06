import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import PostEditor from "./pages/PostEditor";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";

const routes = [
  {
    path: "/login",
    element: (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    )
  },
  {
    path: "/signup",
    element: (
      <AuthProvider>
        <SignupPage />
      </AuthProvider>
    )
  },
  {
    element: (
      <AuthProvider>
        <ProtectedRoute />
      </AuthProvider>
    ),
    children: [
      {
        element: <App />,
        children: [
          {
            path: "/",
            element: <Dashboard />
          },
          {
            path: "/new",
            element: <PostEditor />
          },
          {
            path: "/posts/:postId/edit",
            element: <PostEditor />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
];

export default routes;
