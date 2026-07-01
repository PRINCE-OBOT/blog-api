import type { Comment } from "../types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  const { authorName, createdAt, body } = comment;
  return (
    <div className="group border-l-[3px] border-border hover:border-brand pl-5 pb-6 transition-colors duration-150">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-display font-semibold text-sm text-parchment">
          {authorName}
        </span>
        <time className="text-slate text-xs font-display" dateTime={createdAt}>
          {formatDate(createdAt)}
        </time>
      </div>
      <p className="text-muted text-sm leading-relaxed">{body}</p>
    </div>
  );
}

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-slate text-sm italic mb-6">
        No comments yet — be the first.
      </p>
    );
  }

  return (
    <div className="flex flex-col mb-8" aria-label="Comments">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
