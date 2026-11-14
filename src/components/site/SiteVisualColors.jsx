import { useRouterState } from "@tanstack/react-router";
import { buildVisualCss } from "@/lib/visual-colors";
import { buildVisualShapeCss } from "@/lib/visual-shapes";
import { buildStyleCss, buildGlobalCss } from "@/lib/visual-style";

export default function SiteVisualColors({ settings }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <>
      <style data-site-visual-global>{buildGlobalCss(settings.visual_global || {})}</style>
      <style data-site-visual-colors>{buildVisualCss(settings.visual_colors, pathname)}</style>
      <style data-site-visual-shapes>{buildVisualShapeCss(settings.visual_shapes, pathname)}</style>
      <style data-site-visual-styles>{buildStyleCss(settings.visual_styles, pathname)}</style>
    </>
  );
}