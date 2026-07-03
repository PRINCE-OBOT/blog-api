
import LikeButton from "../components/LikeButton";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import { Spinner, StatusScreen } from "../components/ui";
import { usePost } from "../hooks/usePost";
import { Period } from "../components/Period";
import { format } from "date-fns";
import { useEffect } from "react";

import Prism from "prismjs";
// css style for code block - currently in dark theme
import "prismjs/themes/prism-tomorrow.css";

interface PostDetailProps {
  postId: string;
  onBack: () => void;
}

export default function PostDetail({ postId, onBack }: PostDetailProps) {
  const {
    post,
    likes,
    comments,
    liked,
    likeAnim,
    loading,
    error,
    handleLike,
    handleComment
  } = usePost(postId);

  const content = post?.content || "";

  useEffect(() => {
    if (content) {
      // Activate the style for code block in all code blocks
      Prism.highlightAll();
    }
  }, [content]);

  if (loading) {
    return (
      <StatusScreen>
        <Spinner />
      </StatusScreen>
    );
  }

  if (error || !post) {
    return (
      <StatusScreen>
        <p className="text-like font-display text-sm">
          {error ?? "Post not found."}
        </p>
        <button
          onClick={onBack}
          className="text-slate font-display text-xs tracking-wider uppercase hover:text-parchment transition-colors"
        >
          ← Back to posts
        </button>
      </StatusScreen>
    );
  }

  const {
    title,
    subtitle,
    hero_img_url,
    author,
    createdAt,
    updatedAt
  } = post;

  return (
    <div className="max-w-[760px] mx-auto px-8 pt-10 pb-16">
      {/* Back */}
      <button
        onClick={onBack}
        aria-label="Back to all posts"
        className="
          inline-flex items-center gap-1.5 text-slate font-display
          text-[11px] font-medium tracking-[0.05em] uppercase mb-10
          hover:text-parchment transition-colors duration-150
        "
      >
        ← All Posts
      </button>

      {/* Header */}
      <header className="border-b border-border pb-10 mb-10">
        <h1 className="font-display font-bold leading-tight tracking-[-0.03em] text-[clamp(1.8rem,4vw,2.8rem)] mb-4 text-parchment">
          {title}
        </h1>
        <h4 className="text-slate font-bold leading-tight">{subtitle}</h4>

        <div className="flex flex-col gap-1 text-slate text-xs font-display pt-5">
          <div>{format(createdAt, "MMMM d, yyyy")}</div>
          <div>{format(updatedAt, "MMMM d, yyyy")}</div>
        </div>
      </header>

      {/* Content */}
      <div
        className="prose prose-invert
        prose-headings:text-parchment
        prose-p:text-parchment
        prose-a:text-brand
        prose-strong:text-parchment
        [&_pre::-webkit-scrollbar]:hidden
        max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Like */}
      <div className="py-6 border-b border-border mb-10">
        <LikeButton
          likes={likes}
          liked={liked}
          animating={likeAnim}
          onClick={handleLike}
        />
      </div>

      {/* Comments */}
      <section aria-label="Comments">
        <h2 className="flex items-center gap-2 font-display font-bold text-[11px] tracking-[0.1em] uppercase text-slate mb-7">
          Comments
          <span className="bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 tracking-wide">
            {comments.length}
          </span>
        </h2>

        <CommentList comments={comments} />
        <CommentForm onSubmit={handleComment} />
      </section>
    </div>
  );
}
