import type { Post, Comment, CommentFormData } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const getPosts = (): Promise<Post[]> =>
  request<Post[]>("/");

export const getPost = (id: string): Promise<Post> =>
  request<Post>(`/posts/${id}`);

export const likePost = (id: string): Promise<{ likes: number }> =>
  request<{ likes: number }>(`/posts/${id}/like`, { method: "POST" });

export const getComments = (postId: string): Promise<Comment[]> =>
  request<Comment[]>(`/posts/${postId}/comments`);

export const createComment = (
  postId: string,
  data: CommentFormData
): Promise<Comment> =>
  request<Comment>(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
