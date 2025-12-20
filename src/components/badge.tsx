export const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${className}`}
  >
    {children}
  </span>
);
