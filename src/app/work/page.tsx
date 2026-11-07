import type { Metadata } from "next";

import PageHeader from "@/components/ui/PageHeader";
import PageNav from "@/components/ui/PageNav";
import Projects from "@/components/sections/Projects";
import Research from "@/components/sections/Research";
import { routeByHref } from "@/content/routes";

const route = routeByHref("/work")!;

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
      <Projects index="01" />
      <Research index="02" />
      <PageNav href={route.href} />
    </>
  );
}
