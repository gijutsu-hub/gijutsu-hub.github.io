/**
 * Feature-detect WebGL before mounting a renderer.
 *
 * Catching the failure after the fact works, but it costs a thrown error and a
 * discarded canvas on every load for users who have WebGL off. Checking first
 * is cheap and keeps the console clean.
 */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");

    if (!context) return false;

    // Release the probe context immediately; browsers cap how many may exist.
    const lose = (context as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    lose?.loseContext();

    return true;
  } catch {
    return false;
  }
}
