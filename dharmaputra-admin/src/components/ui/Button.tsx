type Props = {
  children: React.ReactNode;
  variant?: "primary" | "danger";
  onClick?: () => void;
};

const styles = {
  primary: "bg-slate-900 text-white hover:bg-slate-800",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

export default function Button({
  children,
  variant = "primary",
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-sm ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
