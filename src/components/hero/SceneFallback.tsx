/**
 * Shown while the WebGL bundle loads, and permanently where WebGL is
 * unavailable. A still that belongs to the same visual family as the scene,
 * so the swap is not jarring.
 */
export default function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="relative h-[70%] w-[70%] max-w-md">
        <div className="absolute inset-0 rounded-full border border-accent/15" />
        <div className="absolute inset-[12%] rounded-full border border-accent/10" />
        <div className="absolute inset-[28%] rounded-full border border-accent/[0.07]" />
        <div className="absolute inset-[42%] rounded-full bg-accent/[0.04] blur-2xl" />
      </div>
    </div>
  );
}
