import { Image } from "@/components/ui/image";

export default function BrandMark({ className = "h-11 w-11", light = false, src = "" }) {
  if (src) {
    return (
      <span
        className={`${className} relative inline-flex shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-black/10`}
      >
        <Image src={src} alt="" className="h-full w-full" fittingType="fill" />
      </span>
    );
  }

  return (
    <span
      className={`${className} relative inline-flex shrink-0 items-center justify-center rounded-2xl ${
        light ? "bg-white/10 text-accent" : "bg-primary text-accent"
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" fill="none" className="h-[62%] w-[62%]">
        <path
          d="M20 4.5l3.4 9.2 9.8.4-7.7 6.1 2.7 9.4-8.2-5.4-8.2 5.4 2.7-9.4-7.7-6.1 9.8-.4L20 4.5z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M20 20.5v13M14.5 27.5h11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </span>
  );
}