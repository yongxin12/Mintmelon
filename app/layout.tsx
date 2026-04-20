import "@/styles/globals.css"
import type { ReactNode } from "react"

export const metadata = {
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
