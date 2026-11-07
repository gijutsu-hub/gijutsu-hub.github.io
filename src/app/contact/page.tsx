import type { Metadata } from "next";

import PageHeader from "@/components/ui/PageHeader";
import PageNav from "@/components/ui/PageNav";
import Contact from "@/components/sections/Contact";
import { routeByHref } from "@/content/routes";

const route = routeByHref("/contact")!;

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
      <Contact index="01" />
      <PageNav href={route.href} />
    </>
  );
}
