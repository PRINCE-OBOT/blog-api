import LikeButton from "../components/LikeButton";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import { Spinner, StatusScreen } from "../components/ui";
import { usePost } from "../hooks/usePost";

interface PostDetailProps {
  postId: string;
  onBack: () => void;
}

export default function PostDetail({ postId, onBack }: PostDetailProps) {
  const {
    post, comments, likes, liked, likeAnim,
    loading, error, handleLike, handleComment,
  } = usePost(postId);

  if (loading) {
    return <StatusScreen><Spinner /></StatusScreen>;
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

  const { title, tag, date, readTime, body } = post;

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
        {tag && (
          <span className="inline-block font-display text-[11px] font-semibold tracking-widest uppercase text-brand border border-brand px-2 py-0.5 mb-3">
            {tag}
          </span>
        )}

        <h1 className="font-display font-bold leading-tight tracking-[-0.03em] text-[clamp(1.8rem,4vw,2.8rem)] mb-4 text-parchment">
          {title}
        </h1>

        <div className="flex items-center gap-2 text-slate text-xs font-display">
          <span>{date}</span>
          <span className="w-1 h-1 rounded-full bg-slate" aria-hidden="true" />
          <span>{readTime} min read</span>
          <span className="w-1 h-1 rounded-full bg-slate" aria-hidden="true" />
          <span>{comments.length} comments</span>
        </div>
      </header>

      {/* Body */}
      <div
        className="
          text-muted leading-[1.8] text-base border-b border-border pb-10 mb-8
          [&_p]:mb-6
          [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-parchment
          [&_h2]:text-[1.35rem] [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4
          [&_pre]:bg-card [&_pre]:border [&_pre]:border-border [&_pre]:border-l-[3px]
          [&_pre]:border-l-brand [&_pre]:px-6 [&_pre]:py-5 [&_pre]:my-6
          [&_pre]:overflow-x-auto [&_pre]:text-[0.84rem] [&_pre]:leading-relaxed
          [&_code]:font-mono [&_code]:text-[#7DD3FC]
          [&_a]:text-brand [&_a]:underline-offset-4
        "
        dangerouslySetInnerHTML={{ __html: body }}
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
