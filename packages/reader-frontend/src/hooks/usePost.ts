import { useState, useEffect, useCallback } from "react";
import { getPost, getComments, likePost, createComment } from "../api/posts";
import type { Post, Comment, CommentFormData } from "../types";

interface UsePostResult {
  post: Post | null;
  comments: Comment[];
  likes: number;
  liked: boolean;
  likeAnim: boolean;
  loading: boolean;
  error: string | null;
  handleLike: () => Promise<void>;
  handleComment: (data: CommentFormData) => Promise<Comment>;
}

export function usePost(postId: string): UsePostResult {
  const [post, setPost]         = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes]       = useState<number>(0);
  const [liked, setLiked]       = useState<boolean>(false);
  const [likeAnim, setLikeAnim] = useState<boolean>(false);
  const [loading, setLoading]   = useState<boolean>(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([getPost(postId), getComments(postId)])
      .then(([postData, commentData]) => {
        if (cancelled) return;
        setPost(postData);
        setLikes(postData.likes ?? 0);
        setComments(commentData);
      })
      .catch((err: Error) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [postId]);

  const handleLike = useCallback(async (): Promise<void> => {
    if (liked) return;
    // Optimistic update
    setLikes((n) => n + 1);
    setLiked(true);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    try {
      await likePost(postId);
    } catch {
      // Revert on failure
      setLikes((n) => n - 1);
      setLiked(false);
    }
  }, [postId, liked]);

  const handleComment = useCallback(async (
    data: CommentFormData
  ): Promise<Comment> => {
    const newComment = await createComment(postId, data);
    setComments((prev) => [newComment, ...prev]);
    return newComment;
  }, [postId]);

  return {
    post, comments, likes, liked, likeAnim,
    loading, error, handleLike, handleComment,
  };
}
