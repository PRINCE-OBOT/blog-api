export function Spinner() {
  return (
    <div
      className="w-7 h-7 rounded-full border-2 border-border border-t-brand animate-spin"
      aria-label="Loading"
      role="status"
    />
  );
}

interface StatusScreenProps {
  children: React.ReactNode;
}

export function StatusScreen({ children }: StatusScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 p-8">
      {children}
    </div>
  );
}
