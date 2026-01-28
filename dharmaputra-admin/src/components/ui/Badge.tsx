type Props = {
  label: string;
  color?: "green" | "red" | "yellow";
};

const colors = {
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
};

export default function Badge({ label, color = "green" }: Props) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors[color]}`}
    >
      {label}
    </span>
  );
}
