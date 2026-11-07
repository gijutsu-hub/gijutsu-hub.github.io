import type { Metadata } from "next";

import PageHeader from "@/components/ui/PageHeader";
import PageNav from "@/components/ui/PageNav";
import Capability from "@/components/sections/Capability";
import DisciplineBlock from "@/components/sections/DisciplineBlock";
import { disciplines } from "@/content/disciplines";
import { routeByHref } from "@/content/routes";

const route = routeByHref("/capability")!;

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
      <Capability index="01" />
      {disciplines.map((discipline, i) => (
        <DisciplineBlock
          key={discipline.id}
          discipline={discipline}
          index={String(i + 2).padStart(2, "0")}
        />
      ))}
      <PageNav href={route.href} />
    </>
  );
}
