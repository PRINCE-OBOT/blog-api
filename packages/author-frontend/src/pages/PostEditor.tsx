import { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { createPost, getPost, updatePost } from "../api";
import { Field, ErrorAlert, SuccessAlert, Spinner } from "../components/ui";
import type { Post, PostFormData } from "../types";
import {
  NavLink,
  useLocation,
  useOutletContext,
  useParams
} from "react-router";

interface PostEditorProps {
  post?: Post | null; // null = new post, Post = editing existing
  onBack: () => void;
  onSaved: () => void;
}

const EMPTY: PostFormData = {
  title: "",
  subtitle: "",
  content: "",
  published: false
};

export default function PostEditor() {
  const { onSaved }: PostEditorProps = useOutletContext();
  const location = useLocation();
  const { postId } = useParams();

  const isEditing =
    location.pathname.includes("/posts/") &&
    location.pathname.includes("/edit");

  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string>("");

  const [fields, setFields] = useState<PostFormData>(EMPTY);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editorLoading, setEditorLoading] = useState(true);

  useEffect(() => {
    if (isEditing) {
      getPost(postId || "")
        .then((post) => {
          setFields(post as PostFormData);
          setHeroPreview(post.hero_img_url || "");
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Failed to load post.");
        });
    } else {
      setFields(EMPTY);
      setHeroPreview("");
    }
  }, [isEditing, postId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function handleHeroFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate — image only, max 5MB
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    setError(null);
    setHeroFile(file);

    // Show local preview immediately while upload happens in background
    const objectUrl = URL.createObjectURL(file);
    setHeroPreview(objectUrl);
  }

  async function handlePublish() {
    const content = editorRef.current?.getContent() ?? fields.content;

    const { title, published } = fields;

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!content.trim()) {
      setError("Post content cannot be empty.");
      return;
    }

    const formData = (allFields: PostFormData) => {
      const data = new FormData();

      Object.entries(allFields).forEach(([key, value]) => {
        data.append(key, value as string);
      });

      return data;
    };

    const payload: FormData = formData({
      ...fields,
      hero_img: heroFile,
      content
    });

    setError(null);
    setSubmitting(true);

    try {
      if (isEditing) {
        await updatePost(postId || "", payload);
      } else {
        await createPost(payload);
      }
      setSuccess(
        published ? "Post published successfully!" : "Draft saved successfully!"
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
        <NavLink
          to="/"
          className="font-display text-[11px] font-medium tracking-[0.05em] uppercase text-slate hover:text-parchment transition-colors border border-border px-3 py-1.5"
        >
          ← Back
        </NavLink>
        <h1 className="font-display font-bold text-xl tracking-tight text-parchment">
          {isEditing ? "Edit Post" : "New Post"}
        </h1>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}
      {success && (
        <div className="mb-6">
          <SuccessAlert message={success} />
        </div>
      )}

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
          value={fields.subtitle || ""}
          onChange={handleChange}
          placeholder="A short supporting headline"
        />

        {/* Hero image URL */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="hero_img"
            className="font-display text-[11px] font-semibold tracking-widest uppercase text-slate"
          >
            Hero Image
          </label>

          {/* Dropzone-style label */}
          <label
            htmlFor="hero_img"
            className="
              flex flex-col items-center justify-center gap-2
              border border-dashed border-border hover:border-brand
              cursor-pointer transition-colors duration-150 p-6
              bg-card text-slate text-xs font-display
            "
          >
            <svg
              className="w-6 h-6 text-slate"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            {heroFile ? (
              <span className="text-parchment font-medium">
                {heroFile.name}
              </span>
            ) : (
              <span>
                Click to upload <span className="text-brand">hero image</span>
              </span>
            )}
            <span className="text-slate/60">PNG, JPG, WEBP — max 5MB</span>
          </label>

          {/* Hidden actual input */}
          <input
            id="hero_img"
            name="hero_img"
            type="file"
            accept="image/*"
            onChange={handleHeroFileChange}
            className="sr-only"
          />
        </div>

        {/* Hero image preview */}
        {heroPreview && (
          <div className="border border-border overflow-hidden relative">
            <img
              src={heroPreview}
              alt="Hero preview"
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={() => {
                setHeroFile(null);
                setHeroPreview("");
                setFields((prev) => ({ ...prev, hero_img_url: "" }));
              }}
              className="
                absolute top-2 right-2 bg-ink/80 border border-border
                text-slate hover:text-danger hover:border-danger
                font-display text-[10px] font-bold tracking-wide uppercase
                px-2 py-1 transition-colors duration-150
              "
            >
              Remove
            </button>
          </div>
        )}

        {/* TinyMCE Editor */}
        <div>
          <p className="font-display text-[11px] font-semibold tracking-widest uppercase text-slate mb-1.5">
            Content
          </p>
          {editorLoading && <Spinner />}
          <Editor
            onInit={(_evt, editor) => {
              editorRef.current = editor;
              setEditorLoading(false);
            }}
            initialValue={fields.content}
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            init={{
              height: 500,
              menubar: true,
              skin: "oxide-dark",
              content_css: "dark",
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "codesample"
              ],
              toolbar:
                "undo redo | blocks | bold italic underline | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | link image codesample | " +
                "removeformat | code fullscreen | help",
              codesample_languages: [
                { text: "JavaScript", value: "javascript" },
                { text: "TypeScript", value: "typescript" },
                { text: "HTML/XML", value: "markup" },
                { text: "CSS", value: "css" },
                { text: "Bash", value: "bash" },
                { text: "JSON", value: "json" }
              ],
              content_style: `
                body {
                  scrollbar-width: none;
                  -ms-overflow-style: none;
                  font-family: Inter, sans-serif;
                  font-size: 15px;
                  line-height: 1.7;
                  color: #C8C4BC;
                  background: #0A0A0A;
                  padding: 1rem 1.5rem;
                }
                
                *::-webkit-scrollbar {
                  display: none;
                }

                h1, h2, h3 {
                  font-family: 'Space Grotesk', sans-serif;
                  color: #F0EEE8;
                }
                a { color: #2563EB; }
                pre { background: #111; border-left: 3px solid #2563EB; padding: 1rem; }
              `
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
          <NavLink
            to="/"
            className="font-display font-bold text-[11px] tracking-[0.08em] uppercase px-5 py-2.5 border border-border text-slate hover:border-parchment hover:text-parchment transition-colors disabled:opacity-40"
          >
            Discard
          </NavLink>

          <button
            onClick={() => handlePublish()}
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
