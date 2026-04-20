export const metadata = {
  title: "Mintmelon",
  robots: { index: false, follow: false },
  other: {
    "http-equiv=refresh": "0; url=/en/",
  },
}

export default function RootRedirect() {
  return (
    <main style={{ padding: "4rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <meta httpEquiv="refresh" content="0; url=/en/" />
      <p>
        Redirecting to <a href="/en/">/en/</a>…
      </p>
    </main>
  )
}
