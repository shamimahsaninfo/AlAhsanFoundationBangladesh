const STEPS = ["পরিমাণ ও সময়", "আপনার তথ্য", "নিশ্চিত করুন"];

export default function DonationStepper({ step }) {
  return (
    <ol className="flex items-center gap-1.5">
      {STEPS.map((label, index) => (
        <li key={label} className="flex min-w-0 flex-1 items-center gap-1.5">
          <span
            aria-current={index === step ? "step" : undefined}
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${index <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
          >
            {index < step ? "✓" : index + 1}
          </span>
          <span className={`truncate text-[10.5px] leading-tight ${index === step ? "font-semibold text-primary" : "text-muted-foreground"}`}>{label}</span>
          {index < STEPS.length - 1 && <span className={`h-px flex-1 ${index < step ? "bg-primary" : "bg-border"}`} />}
        </li>
      ))}
    </ol>
  );
}