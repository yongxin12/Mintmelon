export type Manifesto =
  | {
      mode: "easter-egg"
      text: string
      highlights: readonly (readonly [number, number])[]
      reveal: string
    }
  | {
      mode: "plain"
      text: string
    }

export function collectManifestoReveal(manifesto: Manifesto): string {
  if (manifesto.mode !== "easter-egg") return ""

  const collected = manifesto.highlights
    .map(([start, end]) => manifesto.text.slice(start, end))
    .join("")
    .replace(/\s/g, "")
    .toLowerCase()

  const target = manifesto.reveal.replace(/\s/g, "").toLowerCase()

  if (collected !== target) {
    throw new Error(`Manifesto highlight mismatch: expected ${target}, got ${collected}`)
  }

  return manifesto.reveal
}
