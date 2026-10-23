'use client'

import { useEffect, useRef, useState } from 'react'
import { AudioLines, Bird, Check, FileAudio, Mic, Pause, Play, Sparkles, Upload, Waves, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const waveform = [18, 32, 24, 46, 62, 36, 52, 76, 44, 30, 58, 82, 52, 38, 68, 92, 48, 34, 58, 72, 42, 64, 88, 54, 28, 44, 70, 50, 78, 38, 60, 26, 48, 66, 34, 56, 82, 46, 30, 58, 72, 40, 68, 86, 52, 34, 62, 44, 74, 30, 50, 68, 38, 58, 80, 46, 28, 54, 76, 42, 64, 88, 52, 36, 60, 78]

export default function Page() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [result, setResult] = useState<any>(null)
  useEffect(() => {
    if (!isRecording && progress > 0 && progress < 100) {
      const timer = window.setInterval(() => setProgress((value) => Math.min(value + 12, 100)), 180)
      return () => window.clearInterval(timer)
    }
  }, [isRecording, progress])

  const acceptFile = (nextFile?: File) => {
    if (!nextFile || !['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/flac', 'audio/x-flac'].includes(nextFile.type) && !/\.(wav|mp3|flac)$/i.test(nextFile.name)) return
    setFile(nextFile)
    setProgress(8)
    setAnalyzed(false)
  }

 const analyze = async () => {
  if (!file) return

  try {
    setAnalyzing(true)

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(
      'http://127.0.0.1:8000/predict',
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await response.json()

    setResult(data)
localStorage.setItem(
  'birdResult',
  JSON.stringify(data)
)
setAnalyzed(true)
window.location.href = '/species'
  } catch (error) {
    console.error('Prediction failed:', error)
    alert('Prediction failed')
  } finally {
    setAnalyzing(false)
  }
}


  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_15%_0%,color-mix(in_oklab,var(--chart-1)_18%,transparent),transparent_30%),radial-gradient(circle_at_90%_25%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_32%)]" />
      <header className="relative z-10 border-b border-border/70 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Bird /></div><div><p className="text-lg font-semibold tracking-tight">EcoMeter</p><p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Field sound lab</p></div></div>
          <Badge variant="secondary" className="rounded-full px-3 py-1.5"><span className="mr-2 size-1.5 rounded-full bg-chart-1" />Perch 2.0 ready</Badge>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl text-center"><div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><AudioLines /></div><h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">Hear what lives here.</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">Upload a field recording or make one now. EcoMeter listens for the distinct voices of Western Ghats birds.</p></div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-border/70 bg-card/70 shadow-xl shadow-primary/5 backdrop-blur-xl">
            <CardHeader className="pb-5"><div className="flex items-start justify-between gap-4"><div><CardTitle className="text-xl">Add a bird call</CardTitle><CardDescription className="mt-1">Drop your best recording below</CardDescription></div><div className="rounded-xl bg-primary/10 p-2.5 text-primary"><Waves /></div></div></CardHeader>
            <CardContent>
              {!file ? <div onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); acceptFile(event.dataTransfer.files[0]) }} onClick={() => inputRef.current?.click()} className={`flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 text-center transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-primary/30 bg-primary/[0.04] hover:bg-primary/[0.08]'}`}><input ref={inputRef} type="file" accept=".wav,.mp3,.flac,audio/*" className="sr-only" onChange={(event) => acceptFile(event.target.files?.[0])} /><div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Upload /></div><p className="font-medium">Drag and drop your audio here</p><p className="mt-2 text-sm text-muted-foreground">or click to browse files</p><div className="mt-6 flex items-center gap-2"><Badge variant="outline">WAV</Badge><Badge variant="outline">MP3</Badge><Badge variant="outline">FLAC</Badge></div><p className="mt-4 text-xs text-muted-foreground">Maximum file size 50 MB</p></div> : <div className="rounded-3xl border border-primary/20 bg-primary/[0.04] p-5"><div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileAudio /></div><div className="min-w-0"><p className="truncate text-sm font-medium">{file.name}</p><p className="mt-1 text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB · ready to analyze</p></div></div><Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setFile(null); setProgress(0); setAnalyzed(false) }} aria-label="Remove audio"><X /></Button></div><div className="mt-8 flex h-24 items-center justify-between gap-[3px] rounded-2xl bg-primary px-4">{waveform.map((height, index) => <span key={index} className={`w-full rounded-full transition-all ${index % 5 === 0 ? 'bg-chart-1' : 'bg-primary-foreground/60'}`} style={{ height: `${height}%` }} />)}</div><div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>00:00</span><span>00:32</span></div>{progress < 100 && <div className="mt-6"><div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Uploading recording</span><span className="font-medium text-primary">{progress}%</span></div><Progress value={progress} className="h-2" /></div>}<div className="mt-6 flex items-center gap-3"><Button variant="outline" className="rounded-full" onClick={() => setIsPlaying(!isPlaying)} disabled={progress < 100}>{isPlaying ? <Pause data-icon="inline-start" /> : <Play data-icon="inline-start" />} {isPlaying ? 'Pause preview' : 'Play preview'}</Button><Button variant="ghost" size="icon" className="rounded-full" onClick={() => inputRef.current?.click()} aria-label="Replace audio"><Upload /></Button></div></div>}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="border-border/70 bg-card/70 shadow-xl shadow-primary/5 backdrop-blur-xl"><CardHeader><CardTitle className="text-xl">Record in the field</CardTitle><CardDescription>Capture a live call from your surroundings</CardDescription></CardHeader><CardContent><Button className={`h-14 w-full rounded-2xl text-base shadow-lg shadow-primary/15 ${isRecording ? 'bg-destructive hover:bg-destructive/90' : ''}`} onClick={() => { setIsRecording(!isRecording); if (!isRecording) { setFile(null); setProgress(0) } }}><Mic data-icon="inline-start" />{isRecording ? 'Stop recording' : 'Record Audio'}</Button>{isRecording && <div className="mt-5 flex items-center justify-center gap-2 text-sm text-destructive"><span className="size-2 animate-pulse rounded-full bg-destructive" />Recording your surroundings</div>}<div className="mt-6 flex items-start gap-3 rounded-2xl bg-muted/70 p-4"><Sparkles className="mt-0.5 size-4 shrink-0 text-primary" /><p className="text-xs leading-5 text-muted-foreground">For the clearest result, keep your phone still and record for at least 10 seconds.</p></div></CardContent></Card>
            <Card className="border-primary/20 bg-primary/[0.06] shadow-xl shadow-primary/5 backdrop-blur-xl"><CardContent className="p-6"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bird /></div><div><p className="text-sm font-medium">Ready for discovery?</p><p className="text-xs text-muted-foreground">Perch 2.0 will compare your call with 3,840 field recordings.</p></div></div><Button className="mt-6 h-12 w-full rounded-2xl" disabled={!file || progress < 100 || analyzing} onClick={analyze}>{analyzing ? 'Analyzing call…' : analyzed ? <><Check data-icon="inline-start" />Analysis complete</> : 'Analyze Bird Call'}</Button>{analyzed && result && (
  <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left">
    
    <h3 className="font-bold text-lg">
      {result.species?.replaceAll('_', ' ')}
    </h3>

    <p className="mt-2">
      Confidence: {result.confidence}%
    </p>

    <p>
      Scientific Name: {result.bird_info?.scientific_name}
    </p>

    <p>
      IUCN Status: {result.bird_info?.iucn_status}
    </p>

    <p>
      Habitat: {result.bird_info?.habitat}
    </p>
    
    <p>
  Diet: {result.bird_info?.diet}
</p>

<p>
  Interesting Fact:
  {result.bird_info?.interesting_fact}
</p>
  </div>
)}</CardContent></Card>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">Your recordings help map the living soundscape of the Western Ghats.</p>
      </div>
    </main>
  )
}