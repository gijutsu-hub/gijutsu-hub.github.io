import Hero from "@/components/hero/Hero";
import SiteIndex from "@/components/sections/SiteIndex";

/**
 * Landing page: the hero, then a map of everything else.
 *
 * Content now lives on its own routes rather than as sections of one scroll.
 * See src/content/routes.ts — nav, paging and this index all read from it.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <SiteIndex />
    </>
  );
}
