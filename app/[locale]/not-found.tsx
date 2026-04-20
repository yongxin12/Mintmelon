import Link from "next/link"

export default function LocaleNotFound() {
  return (
    <main style={{ padding: "4rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
      <p>This page doesn&apos;t exist (or moved into the history).</p>
      <p>
        <Link href="/en/">← Back to home</Link>
      </p>
    </main>
  )
}
