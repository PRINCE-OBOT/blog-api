import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { createPost, updatePost } from "../api";
import { Field, ErrorAlert, SuccessAlert } from "../components/ui";
import type { Post, PostFormData } from "../types";

interface PostEditorProps {
  post?: Post | null;       // null = new post, Post = editing existing
  onBack: () => void;
  onSaved: () => void;
}

const EMPTY: PostFormData = {
  title: "",
  subtitle: "",
  hero_img_url: "",
  content: "",
  published: false,
};

export default function PostEditor({ post, onBack, onSaved }: PostEditorProps) {
  const isEditing = !!post;
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const [fields, setFields] = useState<PostFormData>(
    post
      ? {
          title:       post.title,
          subtitle:    post.subtitle ?? "",
          hero_img_url: post.hero_img_url,
          content:     post.content,
          published:   post.published,
        }
      : EMPTY
  );

  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [success, setSuccess]         = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSave(publishOverride?: boolean) {
    const content = editorRef.current?.getContent() ?? fields.content;

    if (!fields.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!fields.hero_img_url.trim()) {
      setError("Hero image URL is required.");
      return;
    }
    if (!content.trim()) {
      setError("Post content cannot be empty.");
      return;
    }

    const payload: PostFormData = {
      ...fields,
      content,
      published: publishOverride ?? fields.published,
    };

    setError(null);
    setSubmitting(true);

    try {
      if (isEditing) {
        await updatePost(post.id, payload);
      } else {
        await createPost(payload);
      }
      setSuccess(
        payload.published
          ? "Post published successfully!"
          : "Draft saved successfully!"
      );
      setTimeout(() => {
        setSuccess(null);
        onSaved();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
        <button
          onClick={onBack}
          className="font-display text-[11px] font-medium tracking-[0.05em] uppercase text-slate hover:text-parchment transition-colors border border-border px-3 py-1.5"
        >
          ← Back
        </button>
        <h1 className="font-display font-bold text-xl tracking-tight text-parchment">
          {isEditing ? "Edit Post" : "New Post"}
        </h1>
      </div>

      {error   && <div className="mb-6"><ErrorAlert message={error} /></div>}
      {success && <div className="mb-6"><SuccessAlert message={success} /></div>}

      <div className="flex flex-col gap-5">

        {/* Title */}
        <Field
          id="title"
          label="Title"
          value={fields.title}
          onChange={handleChange}
          placeholder="Post title"
          required
        />

        {/* Subtitle */}
        <Field
          id="subtitle"
          label="Subtitle (optional)"
          value={fields.subtitle}
          onChange={handleChange}
          placeholder="A short supporting headline"
        />

        {/* Hero image URL */}
        <Field
          id="hero_img_url"
          label="Hero Image URL"
          value={fields.hero_img_url}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          required
        />

        {/* Hero image preview */}
        {fields.hero_img_url && (
          <div className="border border-border overflow-hidden">
            <img
              src={fields.hero_img_url}
              alt="Hero preview"
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* TinyMCE Editor */}
        <div>
          <p className="font-display text-[11px] font-semibold tracking-widest uppercase text-slate mb-1.5">
            Content
          </p>
          <Editor
            onInit={(_evt, editor) => { editorRef.current = editor; }}
            initialValue={fields.content}
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            init={{
              height: 500,
              menubar: true,
              skin: "oxide-dark",
              content_css: "dark",
              plugins: [
                "advlist", "autolink", "lists", "link", "image",
                "charmap", "preview", "anchor", "searchreplace",
                "visualblocks", "code", "fullscreen", "insertdatetime",
                "media", "table", "code", "help", "wordcount", "codesample",
              ],
              toolbar:
                "undo redo | blocks | bold italic underline | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | link image codesample | " +
                "removeformat | code fullscreen | help",
              codesample_languages: [
                { text: "JavaScript", value: "javascript" },
                { text: "TypeScript", value: "typescript" },
                { text: "HTML/XML",   value: "markup"     },
                { text: "CSS",        value: "css"        },
                { text: "Bash",       value: "bash"       },
                { text: "JSON",       value: "json"       },
              ],
              content_style: `
                body {
                  font-family: Inter, sans-serif;
                  font-size: 15px;
                  line-height: 1.7;
                  color: #C8C4BC;
                  background: #0A0A0A;
                  padding: 1rem 1.5rem;
                }
                h1, h2, h3 {
                  font-family: 'Space Grotesk', sans-serif;
                  color: #F0EEE8;
                }
                a { color: #2563EB; }
                pre { background: #111; border-left: 3px solid #2563EB; padding: 1rem; }
              `,
            }}
          />
        </div>

        {/* Published toggle */}
        <label className="flex items-center gap-3 cursor-pointer self-start">
          <div className="relative">
            <input
              type="checkbox"
              name="published"
              checked={fields.published}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-border peer-checked:bg-brand transition-colors duration-150" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white transition-transform duration-150 peer-checked:translate-x-5" />
          </div>
          <span className="font-display text-sm font-medium text-parchment">
            Publish immediately
          </span>
        </label>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2 border-t border-border mt-2">
          <button
            onClick={onBack}
            disabled={submitting}
            className="font-display font-bold text-[11px] tracking-[0.08em] uppercase px-5 py-2.5 border border-border text-slate hover:border-parchment hover:text-parchment transition-colors disabled:opacity-40"
          >
            Discard
          </button>

          <button
            onClick={() => handleSave(false)}
            disabled={submitting}
            className="font-display font-bold text-[11px] tracking-[0.08em] uppercase px-5 py-2.5 border border-border text-slate hover:border-parchment hover:text-parchment transition-colors disabled:opacity-40"
          >
            {submitting ? "Saving…" : "Save Draft"}
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={submitting}
            className="font-display font-bold text-[11px] tracking-[0.08em] uppercase px-5 py-2.5 bg-brand text-white hover:opacity-85 transition-opacity disabled:opacity-40"
          >
            {submitting ? "Publishing…" : "Publish Post"}
          </button>
        </div>

      </div>
    </div>
  );
}
