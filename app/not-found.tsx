import Link from "next/link"

export default function RootNotFound() {
  return (
    <main style={{ padding: "4rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>404</h1>
      <p>This page doesn&apos;t exist.</p>
      <p>
        <Link href="/en/">Go to Mintmelon →</Link>
      </p>
    </main>
  )
}
