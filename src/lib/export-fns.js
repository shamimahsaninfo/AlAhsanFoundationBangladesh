import { createServerFn } from "@tanstack/react-start";
import { requireUser } from "@/lib/auth-middleware";

// শুধু অ্যাডমিনের জন্য: সার্ভার-সাইড সোর্স ফাইলগুলো ZIP-এ যুক্ত করতে।
export const getServerSourceFiles = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    if (context.user?.role !== "admin") throw new Error("শুধুমাত্র অ্যাডমিন এই কাজ করতে পারেন");
    const { readServerSourceFiles } = await import("@/lib/source-bundle.server");
    return readServerSourceFiles();
  });
