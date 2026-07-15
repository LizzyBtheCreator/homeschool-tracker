import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Homeschool Academy',
  description: 'Daily learning platform for Mathias',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh' }}>{children}</body>
    </html>
  )
}
