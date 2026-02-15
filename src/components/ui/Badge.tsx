const variants = {
  confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "ready-for-refill": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  unavailable: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  ordered: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  follow_up_needed: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

function Badge({ children, variant = "pending", className = "" }) {
  const variantClass = variants[variant.toLowerCase()] || variants.pending;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClass} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
