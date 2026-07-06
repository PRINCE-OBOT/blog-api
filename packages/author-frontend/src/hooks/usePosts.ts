import { useState, useEffect, useCallback } from "react";
import { deletePost, togglePublish, getAuthorPosts } from "../api";
import type { Post } from "../types";

interface UsePostsResult {
  posts: Post[];
  loading: boolean;
  error: string | null;
  handleDelete: (id: string) => Promise<void>;
  handleTogglePublish: (id: string, published: boolean) => Promise<void>;
}

export function usePosts(): UsePostsResult {
  const [posts, setPosts]     = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAuthorPosts()
      .then((data) => {
        if (!cancelled) setPosts(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleTogglePublish = useCallback(async (id: string, published: boolean) => {
    const updated = await togglePublish(id, published);
    setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }, []);

  return { posts, loading, error, handleDelete, handleTogglePublish };
}
