import { MessageCircle, HeartPlus } from 'lucide-react'
import type { Author, Post } from "../types";
import { format } from 'date-fns';
import { NavLink } from 'react-router';


interface PostCardProps {
  post: Post;
  onSelect: (id: string) => void;
}

export default function PostCard({
  post,
}: PostCardProps) {
  const {
    id,
    title,
    content,
    subtitle,
    hero_img_url,
    author,
    comments,
    likes,
    createdAt,
    updatedAt
  } = post;

  const { firstName, lastName }: Author = author;

  const baseCard = `
    group relative cursor-pointer
    transition-colors duration-150 hover:bg-card
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand
    flex flex-col shadow-card rounded-xl p-4
  `;

  return (
    <NavLink
      className={`${baseCard}`}
      to={`/posts/${id}/post`}
      role="button"
      aria-label={`Read: ${title}`}
    >
      <div
        className={`p-3 flex flex-col gap-2 flex-1`}
      >
        <div>
          <span className="text-slate text-xs font-display mt-1">By</span>{" "}
          <span>
            {firstName} {lastName}
          </span>
        </div>
        <h2
          className={`font-display font-bold leading-tight tracking-tight text-parchment text-lg p-b-0`}
        >
          {title}
        </h2>
        {subtitle && (
          <h4 className={`text-slate font-bold leading-tight pb-4`}>
            {subtitle}
          </h4>
        )}
        <p
          className="
          prose prose-invert
          prose-headings:text-sm
          prose-headings:text-slate 
          prose-p:text-slate 
          prose-p:text-parchment
          prose-a:text-brand
          prose-strong:text-parchment
          [&_pre::-webkit-scrollbar]:hidden
          max-w-none
          border-l-2 pl-2 rounded-lg
          "
          dangerouslySetInnerHTML={{
            __html: `${content.slice(0, 100)}${content.length > 100 && "..."}`
          }}
        />

        <img
          src={hero_img_url}
          alt="blog_api_image_placeholder"
          className="h-40 object-cover"
        />

        <div className="flex flex-col gap-2 text-slate text-sm font-display mt-1">
          <span>Created: {format(createdAt, "MMMM d, yyyy")}</span>
          <span>Updated: {format(updatedAt, "MMMM d, yyyy")}</span>
        </div>

        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex gap-2">
            <MessageCircle fill="white" stroke="none" />
            {comments.length}
          </div>
          <span className="w-1 h-1 rounded-full bg-slate" aria-hidden="true" />
          <div className="flex gap-2">
            <HeartPlus fill="#F87171" stroke="none" />
            {likes.length}
          </div>
        </div>

        <span
          className="
          text-brand text-xs font-semibold tracking-wide uppercase font-display mt-1
          opacity-0 -translate-x-1 transition-all duration-150
          group-hover:opacity-100 group-hover:translate-x-0
        "
        >
          Read post →
        </span>
      </div>
    </NavLink>
  );
}
