import { useState, useEffect } from "react";
import { getPosts } from "../api/posts";
import type { Post } from "../types";

interface UsePostsResult {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export function usePosts(): UsePostsResult {
  const [posts, setPosts]     = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getPosts()
      .then((data) => { if (!cancelled) setPosts(data); })
      .catch((err: Error) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { posts, loading, error };
}
