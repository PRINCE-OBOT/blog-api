import type {
  Post,
  AuthResponse,
  LoginFormData,
  SignupFormData
} from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function getToken(): string | null {
  return localStorage.getItem("token");
}

function getUserId(): string {
  return JSON.parse(localStorage.getItem("user") || "")?.id;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

// ── Auth ──────────────────────────────────────────────
export const login = (data: LoginFormData): Promise<AuthResponse> =>
  request<AuthResponse>(
    "/login",
    {
      method: "POST",
      body: JSON.stringify(data)
    },
    false
  );

export const signup = (data: SignupFormData): Promise<AuthResponse> =>
  request<AuthResponse>(
    "/signup",
    {
      method: "POST",
      body: JSON.stringify(data)
    },
    false
  );

// ── Posts ─────────────────────────────────────────────
export const getAuthorPosts = (): Promise<Post[]> =>
  request<Post[]>(`/posts?authorId=${getUserId()}`);

export const getPost = (id: string): Promise<Post> =>
  request<Post>(`/posts/${id}`);

export const createPost = (formData: FormData): Promise<Post> =>
  request<Post>("/post", {
    method: "POST",
    body: formData
  });

export const updatePost = (id: string, formData: FormData): Promise<Post> =>
  request<Post>(`/posts/${id}`, {
    method: "PUT",
    body: formData
  });

export const deletePost = (id: string): Promise<void> =>
  request<void>(`/posts/${id}`, { method: "DELETE" });

export const togglePublish = (id: string, published: boolean): Promise<Post> =>
  request<Post>(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify({ published })
  });
