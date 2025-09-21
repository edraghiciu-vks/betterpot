# WaveSurfer.js v7 API Reference

> **Source of Truth for BetterPot Implementation**
> 
> This document contains all essential WaveSurfer.js v7 API information needed for our implementation.
> Last updated: September 21, 2025

## 📦 Installation & Import

```bash
# Install WaveSurfer.js v7
npm install wavesurfer.js@7

# TypeScript types included - no @types package needed
```

```typescript
// Main library import
import WaveSurfer from 'wavesurfer.js'

// Plugin imports
import Hover from 'wavesurfer.js/plugins/hover'
import Timeline from 'wavesurfer.js/plugins/timeline'
import Regions from 'wavesurfer.js/plugins/regions'
```

## 🎯 Core WaveSurfer Class

### Static Methods

#### `WaveSurfer.create(options: WaveSurferOptions): WaveSurfer`
Create a new WaveSurfer instance

```typescript
const wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#4F4A85',
  progressColor: '#383351',
  url: '/audio.mp3',
})
```

## ⚙️ WaveSurfer Options

```typescript
interface WaveSurferOptions {
  // Required
  container: HTMLElement | string    // HTML element or selector where waveform renders

  // Visual Styling
  height?: number | 'auto'          // Height in pixels or "auto" to fill container
  waveColor?: string | string[] | CanvasGradient    // Waveform color
  progressColor?: string | string[] | CanvasGradient // Progress mask color
  cursorColor?: string              // Playback cursor color
  cursorWidth?: number              // Cursor width in pixels

  // Bar Rendering (for bar-style waveforms)
  barWidth?: number                 // Render as bars: ▁ ▂ ▇ ▃ ▅ ▂
  barGap?: number                   // Spacing between bars in pixels
  barRadius?: number                // Rounded borders for bars
  barHeight?: number                // Vertical scaling factor
  barAlign?: 'top' | 'bottom'       // Vertical bar alignment

  // Zoom & Layout
  minPxPerSec?: number              // Minimum pixels per second (zoom level)
  fillParent?: boolean              // Stretch to fill container (default: true)

  // Audio Source
  url?: string                      // Audio URL to load
  peaks?: Array<Float32Array | number[]>  // Pre-computed audio data
  duration?: number                 // Pre-computed duration
  media?: HTMLMediaElement          // Use existing media element

  // Playback
  autoplay?: boolean                // Play audio on load
  interact?: boolean                // Enable/disable clicks on waveform (default: true)
}
```

## 🎵 Core Methods

### Audio Playback
```typescript
// Play audio (returns Promise)
play(start?: number, end?: number): Promise<void>

// Pause audio
pause(): void

// Play or pause toggle
playPause(): Promise<void>

// Stop and reset to beginning
stop(): void

// Check if playing
isPlaying(): boolean

// Check if seeking
isSeeking(): boolean
```

### Time & Position
```typescript
// Jump to specific time (seconds)
setTime(time: number): void

// Seek to percentage [0..1]
seekTo(progress: number): void

// Skip forward/backward
skip(seconds: number): void

// Get current time
getCurrentTime(): number

// Get duration
getDuration(): number
```

### Loading & Data
```typescript
// Load audio by URL
load(url: string, channelData?: (Float32Array | number[])[], duration?: number): Promise<void>

// Load audio blob
loadBlob(blob: Blob, channelData?: (Float32Array | number[])[], duration?: number): Promise<void>

// Get decoded audio data
getDecodedData(): AudioBuffer | null

// Export peaks data
exportPeaks(options?: {
  channels?: number,
  maxLength?: number,
  precision?: number
}): number[][]
```

### Media Element Integration
```typescript
// Get HTML media element
getMediaElement(): HTMLMediaElement

// Set external media element
setMediaElement(element: HTMLMediaElement): void
```

### Volume & Playback Control
```typescript
// Set volume [0..1]
setVolume(volume: number): void

// Get volume
getVolume(): number

// Set/get muted state
setMuted(muted: boolean): void
getMuted(): boolean

// Playback rate control
setPlaybackRate(rate: number, preservePitch?: boolean): void
getPlaybackRate(): number
```

### Configuration & Styling
```typescript
// Update options and re-render
setOptions(options: Partial<WaveSurferOptions>): void

// Toggle interaction
toggleInteraction(isInteractive: boolean): void

// Zoom control
zoom(minPxPerSec: number): void
```

### Plugins
```typescript
// Register a plugin
registerPlugin<T extends GenericPlugin>(plugin: T): T

// Get active plugins
getActivePlugins(): GenericPlugin[]
```

### Cleanup
```typescript
// Destroy instance and cleanup
destroy(): void

// Empty waveform
empty(): void
```

## 📡 Events System

### Event Subscription
```typescript
// Subscribe to event
on<EventName>(event: EventName, listener: EventListener, options?: { once?: boolean }): () => void

// Subscribe once
once<EventName>(event: EventName, listener: EventListener): () => void

// Unsubscribe
un<EventName>(event: EventName, listener: EventListener): void

// Clear all events
unAll(): void
```

### Available Events

```typescript
interface WaveSurferEvents {
  // Lifecycle
  init: []                          // After wavesurfer is created
  ready: [duration: number]         // When audio is decoded and can play
  destroy: []                       // Before destruction (cleanup time)

  // Loading
  load: [url: string]               // Audio starts loading
  loading: [percent: number]        // During loading (progress)
  decode: [duration: number]        // When audio has been decoded
  error: [error: Error]             // Loading/decoding errors

  // Playback
  play: []                          // Audio starts playing
  pause: []                         // Audio pauses
  finish: []                        // Audio finishes playing
  timeupdate: [currentTime: number] // Position change (during playback)
  audioprocess: [currentTime: number] // Alias of timeupdate (only when playing)
  seeking: [currentTime: number]    // User seeks to new position

  // User Interaction
  click: [relativeX: number, relativeY: number]     // User clicks waveform
  dblclick: [relativeX: number, relativeY: number]  // User double-clicks
  interaction: [newTime: number]    // User interacts (clicks/drags)
  
  // Drag Events (for seeking)
  drag: [relativeX: number]         // User drags cursor
  dragstart: [relativeX: number]    // Drag starts
  dragend: [relativeX: number]      // Drag ends

  // Visual
  redraw: []                        // Visible waveform is drawn
  redrawcomplete: []                // All audio chunks drawn
  scroll: [visibleStartTime: number, visibleEndTime: number, scrollLeft: number, scrollRight: number]
  zoom: [minPxPerSec: number]       // Zoom level changes
}
```

## 🔌 Key Plugins for BetterPot

### Hover Plugin
Shows time position on hover with vertical line

```typescript
import Hover from 'wavesurfer.js/plugins/hover'

const hover = wavesurfer.registerPlugin(Hover.create({
  lineColor: '#ff0000',           // Color of hover line
  lineWidth: 2,                   // Width of hover line
  labelBackground: '#555',        // Background color of time label
  labelColor: '#fff',             // Text color of time label
  labelSize: '11px',              // Font size of time label
  formatTimeCallback: (seconds) => {  // Custom time formatting
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
}))
```

### Timeline Plugin
Displays time ruler below waveform

```typescript
import Timeline from 'wavesurfer.js/plugins/timeline'

const timeline = wavesurfer.registerPlugin(Timeline.create({
  height: 20,                     // Height of timeline
  insertPosition: 'afterbegin',   // Where to insert in container
  timeInterval: 0.2,              // Interval between time labels
  primaryLabelInterval: 5,        // Primary label interval
  secondaryLabelInterval: 1,      // Secondary label interval
  style: {
    fontSize: '10px',
    color: '#2D5016',
  }
}))
```

### Regions Plugin
Visual overlays for audio sections

```typescript
import Regions from 'wavesurfer.js/plugins/regions'

const regions = wavesurfer.registerPlugin(Regions.create())

// Add region
regions.addRegion({
  start: 10,                      // Start time in seconds
  end: 20,                        // End time in seconds
  color: 'rgba(0, 255, 0, 0.1)',  // Background color
  content: 'Intro',               // Text content
  drag: false,                    // Disable dragging
  resize: false                   // Disable resizing
})
```

## 🎨 CSS Styling with Shadow DOM

WaveSurfer v7 uses Shadow DOM for style isolation. Style with `::part()` selectors:

```css
/* Style the cursor */
#waveform ::part(cursor) {
  background-color: #ff6b6b;
}

/* Style cursor with pseudo-elements */
#waveform ::part(cursor):before {
  content: '🏄';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
}

/* Style regions */
#waveform ::part(region) {
  font-family: fantasy;
  border-radius: 4px;
}

/* Style waveform container */
#waveform ::part(wrapper) {
  border-radius: 8px;
  overflow: hidden;
}
```

### Available CSS Parts
- `cursor` - Playback cursor
- `region` - Region overlays
- `wrapper` - Main waveform container
- `canvas` - Waveform canvas elements

## 🔗 Integration with Existing Audio

### Using External Media Element
Perfect for integrating with our existing AudioService:

```typescript
// Get media element from our AudioService
const mediaElement = audioService.getMediaElement()

const wavesurfer = WaveSurfer.create({
  container: '#waveform',
  media: mediaElement,            // Use existing audio element
  interact: true,                 // Enable seeking via waveform
  // Don't set url - media element handles loading
})

// Sync with external controls
wavesurfer.on('interaction', (newTime) => {
  audioService.seek(newTime)
})
```

### Event Synchronization Pattern

```typescript
// AudioService controls playback, WaveSurfer provides visualization
class WaveSurferIntegration {
  constructor(audioService: AudioService) {
    this.audioService = audioService
    this.setupSync()
  }

  private setupSync() {
    // WaveSurfer seeking -> AudioService
    this.wavesurfer.on('interaction', (time) => {
      this.audioService.seek(time)
    })

    // AudioService time updates -> WaveSurfer (visual sync)
    this.audioService.on('timeupdate', (time) => {
      // WaveSurfer will automatically update if using same media element
    })

    // AudioService play/pause -> WaveSurfer stays in sync automatically
    // when using shared media element
  }
}
```

## ⚠️ Important Notes for Implementation

### Performance Considerations
- **Large Files**: Use pre-computed peaks for files >5MB
- **Mobile**: Consider disabling on low-end devices
- **Bundle Size**: ~272KB - reasonable for features provided

### HTML5 Audio Backend
- Only backend in v7 (Web Audio removed)
- Perfect for our existing AudioService integration
- Shares media element seamlessly

### TypeScript Support
- Full TypeScript definitions included
- No additional @types packages needed
- Excellent IDE support and type safety

### Browser Compatibility
- Modern browsers (ES6+ required)
- Shadow DOM support needed for styling
- Graceful degradation possible

## 🚀 Quick Integration Checklist

For BetterPot implementation:

1. ✅ **Install**: `npm install wavesurfer.js@7`
2. ✅ **Import**: Core library + Hover plugin
3. ✅ **Create**: WaveSurfer instance with existing media element
4. ✅ **Style**: Use CSS parts for Beatport design
5. ✅ **Events**: Handle `interaction` for seeking
6. ✅ **Sync**: Connect with AudioService time updates
7. ✅ **Mobile**: Test touch interactions
8. ✅ **Cleanup**: Call `destroy()` on unmount

This reference covers all essential APIs needed for our BetterPot implementation. Each section provides the exact TypeScript interfaces and usage patterns required for successful integration.