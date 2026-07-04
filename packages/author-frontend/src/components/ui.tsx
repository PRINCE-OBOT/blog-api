export function Spinner() {
  return (
    <div
      className="w-6 h-6 rounded-full border-2 border-border border-t-brand animate-spin"
      role="status"
      aria-label="Loading"
    />
  );
}

export function StatusScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-8">
      {children}
    </div>
  );
}

// Reusable labelled input
interface FieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}

const inputBase = `
  w-full bg-ink border border-border text-parchment
  px-3 py-2.5 text-sm font-body outline-none
  placeholder:text-slate/40
  focus:border-brand transition-colors duration-150
`;

export function Field({
  id, label, type = "text", value, onChange,
  placeholder, required, autoComplete, error,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-display text-[11px] font-semibold tracking-widest uppercase text-slate">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`${inputBase} ${error ? "border-danger" : ""}`}
      />
      {error && <p className="text-danger text-xs font-display">{error}</p>}
    </div>
  );
}

interface AlertProps { message: string; }
export function ErrorAlert({ message }: AlertProps) {
  return (
    <div role="alert" className="border border-danger/30 bg-danger/8 text-danger font-display text-xs px-4 py-3">
      {message}
    </div>
  );
}
export function SuccessAlert({ message }: AlertProps) {
  return (
    <div role="status" className="border border-success/30 bg-success/8 text-success font-display text-xs px-4 py-3">
      {message}
    </div>
  );
}
