import Hero from "@/components/hero/Hero";
import Capability from "@/components/sections/Capability";
import Contact from "@/components/sections/Contact";
import DisciplineBlock from "@/components/sections/DisciplineBlock";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Research from "@/components/sections/Research";
import Skills from "@/components/sections/Skills";
import { disciplines } from "@/content/disciplines";

/**
 * Section numbers are assigned here, from page order, rather than hardcoded in
 * each component. Hardcoding them meant inserting a section silently created a
 * duplicate number further down.
 */
function numbering() {
  let n = 0;
  return () => String(++n).padStart(2, "0");
}

export default function Home() {
  const next = numbering();

  return (
    <>
      <Hero />
      <Capability index={next()} />
      {disciplines.map((discipline) => (
        <DisciplineBlock key={discipline.id} discipline={discipline} index={next()} />
      ))}
      <Experience index={next()} />
      <Projects index={next()} />
      <Skills index={next()} />
      <Research index={next()} />
      <Contact index={next()} />
    </>
  );
}
