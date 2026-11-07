/**
 * Project World — a systems-design thought experiment, not a product.
 *
 * It sits on a security portfolio because of the threat model, not the
 * economics. The interesting content is the attack surface: an economy whose
 * money supply is minted from sensor readings has an oracle problem, and
 * "hack the smart meter, print the currency" is a supply-chain attack on a
 * currency. That is the part worth reading, so the page leads with the
 * failure modes rather than the vision.
 *
 * Framed as Concept throughout. Nothing here is built.
 */

export interface CreditType {
  symbol: string;
  name: string;
  pegged: string;
}

export interface FlowStep {
  label: string;
  detail: string;
}

export interface TradeOff {
  title: string;
  body: string;
}

export interface Phase {
  n: string;
  name: string;
  detail: string;
}

export const projectWorld = {
  name: "Project World",
  stage: "Concept" as const,
  tagline: "A physics-bound economic operating system",
  /** One honest sentence about what this is, before anything else. */
  standfirst:
    "A white paper exploring what an economy would look like if money could only be minted against measured energy and burned on consumption — and, more usefully, what would break if anyone tried it.",

  premise:
    "Fiat currency is debt-based, so servicing existing debt requires perpetual expansion on a planet with finite resources. Project World asks a narrower question than it first appears: if units of account were pegged to thermodynamic measurements rather than central-bank policy, what would the system's actual attack surface be?",

  credits: [
    { symbol: "BC", name: "Bio-Credits", pegged: "Caloric output, nutritional density, clean water" },
    { symbol: "GC", name: "Grid-Credits", pegged: "Kilowatt-hours of renewable energy, bandwidth" },
    { symbol: "TC", name: "Transit-Credits", pegged: "Kinetic movement and transport logistics" },
    { symbol: "LC", name: "Leisure-Credits", pegged: "Art, entertainment, non-essential goods" },
  ] satisfies CreditType[],

  flow: [
    { label: "Generate", detail: "A solar farm produces 1,000 kWh. IoT sensors attest to the output." },
    { label: "Mint", detail: "The chain mints Grid-Credits against the attested reading. Nothing is printed." },
    { label: "Exchange", detail: "An AI market maker swaps credit types on demand, removing the barter problem." },
    { label: "Consume", detail: "A household draws that electricity, or buys food with swapped Bio-Credits." },
    { label: "Burn", detail: "Spent credits leave circulation. Supply tracks generation, so inflation has nowhere to form." },
  ] satisfies FlowStep[],

  /**
   * Deliberately listed before the upside. A design document that leads with
   * its benefits is marketing; one that leads with its failure modes is
   * engineering.
   */
  risks: [
    {
      title: "The oracle problem is the whole system",
      body: "The chain is only as honest as the sensors feeding it. Compromise a smart meter's firmware and you mint currency from nothing — the same outcome as counterfeiting, reached through an IoT supply chain that is historically the softest target in any estate. Every other property here depends on attestation that nobody has solved at planetary scale.",
    },
    {
      title: "Subjective value resists measurement",
      body: "Kilowatt-hours are measurable; a handmade object's worth is not. Any pricing the AI assigns to Leisure-Credits is a policy decision wearing the costume of a calculation, and whoever writes that model holds the power the design claims to have abolished.",
    },
    {
      title: "Suppressed demand routes around the system",
      body: "If the allocator declines to fund something people want, they transact for it elsewhere. A grey market does not indicate failure of enforcement; it indicates the model mispriced human preference, and it will appear immediately.",
    },
    {
      title: "Incumbents have both motive and means",
      body: "A parallel settlement network that functions is a direct threat to monetary sovereignty. Expect it treated as one: sanctions, node-level takedowns, and pressure on the physical infrastructure the sensors sit on.",
    },
    {
      title: "Transition is the hardest part, not the architecture",
      body: "Supply chains run on fiat credit lines. Any migration that interrupts food distribution, even briefly, fails on contact with reality — which is why the roadmap is parallel and opt-in rather than a replacement.",
    },
  ] satisfies TradeOff[],

  claims: [
    {
      title: "Inflation becomes structurally difficult",
      body: "Supply is bounded by measured generation and reduced by consumption. You cannot spend energy that has not been produced — assuming the attestation holds, which is the load-bearing assumption above.",
    },
    {
      title: "Funding conflict gets expensive",
      body: "A state cannot print kilowatt-hours. Large-scale militarisation would have to be drawn from the same metered pool citizens use, making the cost immediate and visible rather than deferred through inflation.",
    },
    {
      title: "Surplus becomes allocable",
      body: "Global production already exceeds subsistence need. A system that tracks surplus directly can route a baseline of it as infrastructure rather than as charity.",
    },
    {
      title: "Restoration becomes the profitable activity",
      body: "If credits are minted on regeneration rather than extraction, the incentive gradient inverts: restoring an ecosystem pays, depleting one does not.",
    },
  ] satisfies TradeOff[],

  roadmap: [
    {
      n: "01",
      name: "Digital twin",
      detail: "Chain, multi-credit market maker and logistics engine built and run in simulation against real supply-chain data. Nothing touches production.",
    },
    {
      n: "02",
      name: "Opt-in micro-economies",
      detail: "Cooperatives and regenerative farms settle between themselves in credits, bypassing fiat for a narrow set of real trades.",
    },
    {
      n: "03",
      name: "Parallel network",
      detail: "The system runs alongside existing currency rather than replacing it. Adoption is voluntary and reversible, which is the only version that survives contact with incumbents.",
    },
  ] satisfies Phase[],
} as const;
