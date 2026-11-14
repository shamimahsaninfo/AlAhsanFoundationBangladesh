import { ShieldCheck } from "lucide-react";

export default function GatewayNotice({ title, note }) {
  return (
    <div role="status" className="rounded-2xl border border-border bg-secondary p-5">
      <ShieldCheck className="h-6 w-6 text-primary" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}