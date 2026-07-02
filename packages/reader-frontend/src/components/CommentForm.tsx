import { useState } from "react";
import type { CommentFormData } from "../types";

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => Promise<unknown>;
}

const EMPTY: CommentFormData = { username: "", content: "" };

const inputClass = `
  w-full bg-ink border border-border text-parchment
  px-3 py-2.5 text-sm font-body outline-none
  placeholder:text-border
  focus:border-brand transition-colors duration-150
`;

export default function CommentForm({ onSubmit }: CommentFormProps) {
  const [fields, setFields]         = useState<CommentFormData>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(fields);
      setFields(EMPTY);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled = submitting || !fields.username || !fields.content

  return (
    <div className="border border-border p-7 mt-8">
      <h3 className="font-display font-bold text-xs tracking-[0.1em] uppercase text-parchment mb-5">
        Leave a comment
      </h3>

      {success && (
        <div
          role="status"
          className="border border-success/25 bg-success/8 text-success font-display text-xs px-3 py-2.5 mb-5"
        >
          Comment posted — thanks!
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="border border-danger/25 bg-danger/8 text-like font-display text-xs px-3 py-2.5 mb-5"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="font-display text-[11px] font-semibold tracking-widest uppercase text-slate"
            >
              Username
            </label>
            <input
              id="username"
              className={inputClass}
              type="text"
              name="username"
              value={fields.username}
              onChange={handleChange}
              placeholder="Username"
              required
              autoComplete="name"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-5">
          <label
            htmlFor="content"
            className="font-display text-[11px] font-semibold tracking-widest uppercase text-slate"
          >
            Comment Content
          </label>
          <textarea
            id="content"
            className={`${inputClass} resize-y min-h-[110px]`}
            name="content"
            value={fields.content}
            onChange={handleChange}
            placeholder="What are your thoughts?"
            required
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="
            bg-brand text-white font-display font-bold text-xs tracking-[0.08em] uppercase
            px-6 py-3 transition-opacity duration-150
            hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {submitting ? "Posting…" : "Post comment"}
        </button>
      </form>
    </div>
  );
}
