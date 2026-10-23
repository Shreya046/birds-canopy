'use client'
import { useEffect, useState } from 'react'
import { ArrowRight, Bird, CheckCircle2, Leaf, MapPin, Play, ShieldCheck, Sprout, TreePine, Waves } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer, SiteHeader } from '@/components/site-header'


const features = ['Large curved beak with casque', 'Slate-grey feather patterning', 'Broad, rounded wings', 'Long graduated tail', 'Pale eye-ring and throat patch']
const habitat = [['Vegetation', 'Moist evergreen canopy'], ['Forest type', 'Lowland and mid-elevation'], ['Elevation', 'Up to 1,200 metres'], ['Climate', 'Warm, high-rainfall']]

export default function SpeciesPage() {

  const [birdData, setBirdData] = useState<any>(null)

  useEffect(() => {
    const storedData = localStorage.getItem('birdResult')

    if (storedData) {
      setBirdData(JSON.parse(storedData))
    }
  }, [])

  return  <main className="min-h-screen bg-background"><SiteHeader /><div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-16"><div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"><div className="overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-xl shadow-primary/10"><img
  src={
  birdData?.bird_info?.image || '/placeholder.jpg'
}
  alt={birdData?.species || 'Bird'}
  className="aspect-[4/3] w-full object-cover"
/></div><div><Badge className="rounded-full">
  {birdData?.bird_info?.iucn_status || 'Bird Species'}
</Badge><h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em]">
  {birdData?.species?.replaceAll('_', ' ') || 'Malabar Grey Hornbill'}
</h1><p className="mt-3 font-serif text-xl italic text-muted-foreground">
  {birdData?.bird_info?.scientific_name || 'Ocyceros griseus'}
</p><p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
  Habitat: {birdData?.bird_info?.habitat || 'Habitat information unavailable'}
</p><Button className="mt-7 rounded-xl"><Play data-icon="inline-start" />Play field recording</Button></div></div><div className="mt-16 grid gap-6 lg:grid-cols-2"><Card className="border-border/60 bg-card/60"><CardHeader><CardTitle>Taxonomy</CardTitle></CardHeader><CardContent className="grid gap-4 text-sm"><p className="flex justify-between border-b border-border/60 pb-3"><span className="text-muted-foreground">Family</span><span>Bucerotidae</span></p><p className="flex justify-between border-b border-border/60 pb-3"><span className="text-muted-foreground">Order</span><span>Bucerotiformes</span></p><p className="flex justify-between"><span className="text-muted-foreground">Local range</span><span>Western Ghats</span></p></CardContent></Card><Card className="border-border/60 bg-card/60"><CardHeader><CardTitle>Distinctive features</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm">{features.map((feature) => <p key={feature} className="flex items-center gap-3"><CheckCircle2 className="size-4 text-primary" />{feature}</p>)}</CardContent></Card></div><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]"><Card className="border-border/60 bg-card/60"><CardHeader><CardTitle>Habitat profile</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">{habitat.map(([label, value]) => <div key={label} className="rounded-2xl bg-muted/60 p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 text-sm font-medium">
  {label === 'Vegetation'
    ? birdData?.bird_info?.habitat || value
    : value}
</p></div>)}</CardContent></Card><Card className="border-border/60 bg-card/60"><CardHeader><CardTitle>Western Ghats distribution</CardTitle></CardHeader><CardContent><div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-primary/[0.05]"><div className="text-center"><MapPin className="mx-auto size-8 text-primary" /><p className="mt-3 text-sm font-medium">Distribution map</p><p className="mt-1 text-xs text-muted-foreground">From Goa to the southern ranges</p></div></div></CardContent></Card></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><Card className="border-primary/20 bg-primary/[0.06]"><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" />Conservation snapshot</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3"><div><p className="text-xs text-muted-foreground">IUCN status</p><p className="mt-1 font-medium">
  {birdData?.bird_info?.iucn_status || 'Least Concern'}
</p></div><div><p className="mt-1 font-medium text-primary">
  {birdData?.bird_info?.diet || 'Not Available'}
</p></div><div><p className="text-xs text-muted-foreground">Key threats</p><p className="mt-1 font-medium">
  {birdData?.bird_info?.major_threats?.join(', ') || 'Forest loss'}
</p></div></CardContent></Card><Card className="border-border/60 bg-card/60"><CardHeader><CardTitle className="flex items-center gap-2"><Sprout className="size-5 text-primary" />Biodiversity contribution</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2"><p className="flex gap-2"><TreePine className="size-4 shrink-0 text-primary" />Disperses large forest seeds</p><p className="flex gap-2"><Leaf className="size-4 shrink-0 text-primary" />Supports forest regeneration</p><p className="flex gap-2"><Bird className="size-4 shrink-0 text-primary" />Connects canopy habitats</p><p className="flex gap-2"><Waves className="size-4 shrink-0 text-primary" />Signals mature forest health</p></CardContent></Card></div></div><Footer /></main>
}