import type { Metadata } from "next";

import RepoDirectory from "@/components/sections/RepoDirectory";
import Signals from "@/components/sections/Signals";
import PageHeader from "@/components/ui/PageHeader";
import PageNav from "@/components/ui/PageNav";
import { routeByHref } from "@/content/routes";

const route = routeByHref("/research")!;

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
      <RepoDirectory index="01" />
      <Signals index="02" />
      <PageNav href={route.href} />
    </>
  );
}
