interface LikeButtonProps {
  likes: number;
  liked: boolean;
  animating: boolean;
  onClick: () => void;
}

export default function LikeButton({ likes, liked, animating, onClick }: LikeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold font-display
        transition-colors duration-150 disabled:cursor-default
        border-border text-slate hover:border-like active:text-like
      `}
    >
      <svg
        className={`w-[18px] h-[18px] flex-shrink-0 transition-transform duration-150
          ${animating ? "animate-like-pop" : ""}
        `}
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{likes}</span>
    </button>
  );
}
