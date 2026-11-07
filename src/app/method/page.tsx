import type { Metadata } from "next";

import PageHeader from "@/components/ui/PageHeader";
import PageNav from "@/components/ui/PageNav";
import AttackMatrix from "@/components/sections/AttackMatrix";
import Scoring from "@/components/sections/Scoring";
import { routeByHref } from "@/content/routes";

const route = routeByHref("/method")!;

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
      <AttackMatrix index="01" />
      <Scoring index="02" />
      <PageNav href={route.href} />
    </>
  );
}
