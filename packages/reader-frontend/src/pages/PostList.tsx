import PostCard from "../components/PostCard";
import { Spinner, StatusScreen } from "../components/ui";
import { usePosts } from "../hooks/usePosts";

interface PostListProps {
  onSelectPost: (id: string) => void;
}

export default function PostList({ onSelectPost }: PostListProps) {
  const { posts, loading, error } = usePosts();

  if (loading) {
    return (
      <StatusScreen>
        <Spinner />
      </StatusScreen>
    );
  }

  if (error) {
    return (
      <StatusScreen>
        <p className="text-like font-display text-sm">
          Failed to load posts: {error}
        </p>
      </StatusScreen>
    );
  }

  if (posts.length === 0) {
    return (
      <StatusScreen>
        <p className="text-slate font-display text-sm">
          No posts yet. Check back soon.
        </p>
      </StatusScreen>
    );
  }

  return (
    <>
      {/* Hero */}
      <div className="border-b border-border max-w-[1100px] mx-auto w-full px-8 pt-20 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-display text-[11px] font-semibold tracking-[0.15em] uppercase text-brand">
            BLOG-API
          </span>
          <span className="block w-9 h-px bg-brand" aria-hidden="true" />
        </div>

        <h1 className="font-display font-bold leading-none tracking-[-0.04em] text-[clamp(2.8rem,6vw,5rem)] max-w-2xl mb-6">
          COMPLEX.
          <br />
          UNDERSTAND.
          <br />
          <em className="not-italic text-brand">FUN.</em>
        </h1>

        <p className="text-slate text-base leading-relaxed max-w-md">
          Deep dives into Blog API
        </p>
      </div>

      {/* Posts */}
      <div className="max-w-[1100px] mx-auto w-full px-8">
        <p className="font-display text-[11px] font-semibold tracking-[0.15em] uppercase text-slate py-7">
          Latest Posts
        </p>

        <div className="flex flex-col border border-border w-[min(700px,100%)]">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onSelect={onSelectPost} />
          ))}
        </div>
      </div>
    </>
  );
}
