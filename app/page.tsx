'use client'

import { Area, AreaChart, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, Bird, Check, Clock3, Headphones, Leaf, MapPin, MoreHorizontal, Play, ShieldCheck, Sparkles, Waves } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'

const predictions = [
  { name: 'Malabar Grey Hornbill', scientific: 'Ocyceros griseus', score: 94, tone: 'bg-primary' },
  { name: 'Indian Grey Hornbill', scientific: 'Ocyceros birostris', score: 71, tone: 'bg-chart-2' },
  { name: 'Great Hornbill', scientific: 'Buceros bicornis', score: 48, tone: 'bg-chart-3' },
  { name: 'Malabar Pied Hornbill', scientific: 'Anthracoceros coronatus', score: 29, tone: 'bg-chart-4' },
  { name: 'Brown-headed Barbet', scientific: 'Psilopogon zeylanicus', score: 16, tone: 'bg-chart-5' },
]

const confidenceData = [{ value: 94, fill: 'var(--color-confidence)' }]
const activityData = [
  { time: '00:00', signal: 18 }, { time: '00:04', signal: 32 }, { time: '00:08', signal: 26 },
  { time: '00:12', signal: 58 }, { time: '00:16', signal: 48 }, { time: '00:20', signal: 76 },
  { time: '00:24', signal: 64 }, { time: '00:28', signal: 92 }, { time: '00:32', signal: 68 },
]

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_75%_8%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_32%),radial-gradient(circle_at_10%_75%,color-mix(in_oklab,var(--chart-1)_10%,transparent),transparent_28%)]" />
      <header className="relative z-10 border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Bird /></div>
            <div><p className="text-lg font-semibold tracking-tight">Birds Canopy</p><p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Western Ghats field lab</p></div>
          </div>
          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex"><span className="text-foreground">Observations</span><span>Species library</span><span>Conservation map</span></div>
          <Button variant="outline" size="sm" className="rounded-full bg-background/50"><Sparkles data-icon="inline-start" /> New analysis</Button>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-8 lg:px-10 lg:py-12">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground"><span className="size-2 rounded-full bg-chart-1" /> Observation / 24 Oct 2024</div><h1 className="max-w-xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">A voice from the canopy.</h1><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Perch 2.0 has identified a likely species from your field recording in Silent Valley National Park.</p></div>
          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur-md"><ShieldCheck className="text-primary" /> Analysis verified <span className="text-border">/</span> <span className="font-medium text-foreground">PC-2.0.1</span></div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="overflow-hidden border-border/70 bg-card/70 shadow-xl shadow-primary/5 backdrop-blur-xl">
            <CardContent className="p-0"><div className="grid md:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[330px] overflow-hidden bg-primary/10"><img src="/malabar-grey-hornbill.png" alt="Malabar Grey Hornbill perched in the Western Ghats" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" /><div className="absolute bottom-5 left-5 text-primary-foreground"><Badge className="mb-2 border-0 bg-chart-1/90 text-primary-foreground">Near threatened</Badge><p className="text-xs text-primary-foreground/75">Western Ghats, India</p></div></div>
              <div className="flex flex-col justify-between gap-8 p-7 lg:p-9"><div><div className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary"><Check className="size-4" /> AI prediction summary</div><h2 className="text-3xl font-semibold tracking-tight">Malabar Grey<br />Hornbill</h2><p className="mt-2 font-serif text-lg italic text-muted-foreground">Ocyceros griseus</p><div className="mt-7 flex items-center gap-5"><div className="relative size-[104px]"><ChartContainer config={{ confidence: { label: 'Confidence', color: 'var(--chart-1)' } }} className="size-full"><RadialBarChart innerRadius="76%" outerRadius="100%" barSize={9} data={confidenceData} startAngle={90} endAngle={-270}><PolarAngleAxis type="number" domain={[0, 100]} tick={false} /><RadialBar background={{ fill: 'var(--muted)' }} dataKey="value" cornerRadius={10} /></RadialBarChart></ChartContainer><span className="absolute inset-0 flex items-center justify-center text-xl font-semibold">94%</span></div><div><p className="text-sm font-medium">High confidence</p><p className="mt-1 max-w-[170px] text-xs leading-5 text-muted-foreground">A clear, distinct call signature matched across 3,840 field recordings.</p></div></div></div><div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border/70 pt-5 text-xs text-muted-foreground"><span className="flex items-center gap-2"><Clock3 className="size-4 text-primary" /> 1.8 sec prediction</span><span className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> Silent Valley</span></div></div>
            </div></CardContent>
          </Card>

          <Card className="border-border/70 bg-card/70 shadow-xl shadow-primary/5 backdrop-blur-xl"><CardHeader className="flex-row items-center justify-between pb-3"><div><CardTitle className="text-base">Field recording</CardTitle><p className="mt-1 text-xs text-muted-foreground">silent-valley-dawn.wav</p></div><Button size="icon" variant="ghost" className="rounded-full"><MoreHorizontal /></Button></CardHeader><CardContent><div className="rounded-2xl bg-primary p-5 text-primary-foreground"><div className="mb-8 flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-full bg-primary-foreground text-primary"><Play fill="currentColor" /></div><div><p className="text-sm font-medium">Dawn chorus</p><p className="text-xs text-primary-foreground/65">WAV · 32 seconds</p></div></div><Headphones className="text-primary-foreground/60" /></div><div className="mb-2 h-14"><ResponsiveContainer width="100%" height="100%"><AreaChart data={activityData}><Area type="monotone" dataKey="signal" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} strokeWidth={2} /></AreaChart></ResponsiveContainer></div><div className="flex justify-between text-[10px] text-primary-foreground/55"><span>00:00</span><span>00:32</span></div></div><div className="mt-5 flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-muted-foreground"><Waves className="size-4 text-primary" /> 48 kHz · stereo</span><Button variant="outline" size="sm" className="rounded-full">Download</Button></div></CardContent></Card>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Card className="border-border/70 bg-card/70 backdrop-blur-xl"><CardHeader><div className="flex items-center justify-between"><div><CardTitle className="text-base">Top predictions</CardTitle><p className="mt-1 text-xs text-muted-foreground">What else could be singing?</p></div><Badge variant="secondary" className="rounded-full">5 matches</Badge></div></CardHeader><CardContent className="flex flex-col gap-4">{predictions.map((bird, index) => <div key={bird.name} className="group flex items-center gap-3"><span className="w-5 text-xs text-muted-foreground">0{index + 1}</span><div className="min-w-0 flex-1"><div className="mb-1.5 flex items-baseline justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{bird.name}</p><p className="truncate text-[11px] italic text-muted-foreground">{bird.scientific}</p></div><span className="text-xs font-semibold tabular-nums">{bird.score}%</span></div><Progress value={bird.score} className="h-1.5 bg-muted" /></div></div>)}</CardContent></Card>
          <Card className="border-border/70 bg-card/70 backdrop-blur-xl"><CardHeader><CardTitle className="text-base">Species profile</CardTitle><p className="mt-1 text-xs text-muted-foreground">A quick field guide to your observation</p></CardHeader><CardContent><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-muted/60 p-4"><Leaf className="mb-5 size-5 text-primary" /><p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Habitat</p><p className="text-sm font-medium">Evergreen forest</p><p className="mt-1 text-xs text-muted-foreground">800–1,500m elevation</p></div><div className="rounded-2xl bg-muted/60 p-4"><Bird className="mb-5 size-5 text-primary" /><p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Diet</p><p className="text-sm font-medium">Fruits & insects</p><p className="mt-1 text-xs text-muted-foreground">Key seed disperser</p></div><div className="col-span-2 flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4"><div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Conservation note</p><p className="mt-1 text-sm font-medium">Protecting mature canopy protects this call.</p></div><ArrowUpRight className="text-primary" /></div></div></CardContent></Card>
        </div>
      </div>
    </main>
  )
}
