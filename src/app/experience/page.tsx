import type { Metadata } from "next";

import PageHeader from "@/components/ui/PageHeader";
import PageNav from "@/components/ui/PageNav";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import { routeByHref } from "@/content/routes";

const route = routeByHref("/experience")!;

export const metadata: Metadata = {
  title: route.title,
  description: route.description,
  alternates: { canonical: route.href },
};

export default function Page() {
  return (
    <>
      <PageHeader
        href={route.href}
        eyebrow={route.eyebrow}
        title={route.title}
        lede={route.description}
      />
      <Experience index="01" />
      <Skills index="02" />
      <PageNav href={route.href} />
    </>
  );
}
