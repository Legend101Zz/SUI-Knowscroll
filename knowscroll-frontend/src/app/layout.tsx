import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SuiProvider } from '@/context/SuiContext'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

// Loading component for Suspense fallback
function PageLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-txt-secondary">Loading...</p>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'KnowScroll - Guilt-Free Educational Reels',
  description: 'Learn while you scroll with KnowScroll',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <main className="min-h-screen">
          <SuiProvider>
            <Suspense fallback={<PageLoading />}>
              {children}
            </Suspense>
          </SuiProvider>
        </main>
      </body>
    </html>
  )
}