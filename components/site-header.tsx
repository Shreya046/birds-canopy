'use client'

import Link from 'next/link'
import { Bird, BarChart3, Info, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Birds Canopy home">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Bird /></span>
          <span><span className="block text-lg font-semibold tracking-tight">Birds Canopy</span><span className="block text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Western Ghats soundscape</span></span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          <Link href="/species" className="rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Species</Link>
          <Link href="/dashboard" className="rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Dashboard</Link>
          <Link href="/about" className="rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">About</Link>
        </nav>
        <Link href="/upload">
  <Button className="rounded-xl">
    <Upload data-icon="inline-start" />
    Identify a call
  </Button>
</Link>
      </div>
    </header>
  )
}

export function Footer() {
  return <footer className="border-t border-border/60"><div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><p>© 2026 Birds Canopy. Listening for life in the Western Ghats.</p><div className="flex gap-4"><Link href="/about" className="hover:text-foreground">Our mission</Link><Link href="/dashboard" className="hover:text-foreground">Field insights</Link></div></div></footer>
}