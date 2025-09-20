# Superpowered Audio Integration Plan
## Professional DJ Audio System for BetterPot

---

## 📋 Project Overview

**Goal**: Replace unreliable Howler.js with professional-grade Superpowered Web Audio SDK for ultra-low latency DJ audio playback (<10ms).

**Current Stack**: Bun + Turborepo + SolidJS + Vite + TypeScript  
**Target**: Professional DJ application with precise timing, crossfading, and real-time audio processing

---

## 🔍 Current Analysis

### ✅ Strengths of Existing Setup
- **Bun + Turborepo**: Excellent monorepo structure with fast builds
- **SolidJS**: Reactive framework compatible with Superpowered
- **Vite**: Modern bundler with good WASM support potential
- **TypeScript**: Full type safety throughout the stack
- **Clean Architecture**: Separate packages and clear separation of concerns
- **Existing Player Infrastructure**: State management already in place (`player.ts`)

### ⚠️ Identified Challenges & Solutions

#### 1. **Bun + Superpowered Compatibility**
- **Issue**: Bun is newer runtime; Superpowered primarily tested with Node/npm
- **Risk Level**: Medium
- **Solution**: Use npm for Superpowered installation, keep Bun for everything else

#### 2. **Static File Serving Requirements**
- **Issue**: Superpowered requires serving WASM files and AudioWorklet processors as static files
- **Risk Level**: High
- **Problem**: Vite dev server needs configuration for `.wasm` and `.js` worklet files
- **Solution**: Configure Vite with proper MIME types and static asset handling

#### 3. **Security Headers for SharedArrayBuffer**
- **Issue**: Superpowered performance benefits require `SharedArrayBuffer` which needs specific CORS headers
- **Risk Level**: Medium
- **Required Headers**: 
  ```
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
  ```
- **Current Problem**: CORS middleware doesn't include these headers

#### 4. **AudioWorklet File Serving**
- **Issue**: AudioWorklet processors must be served separately, not bundled with main application
- **Risk Level**: High
- **Problem**: Vite bundles everything; AudioWorklets need separate serving
- **Solution**: Configure Vite exclusions and public directory serving

#### 5. **SolidJS Reactivity Integration**
- **Issue**: Audio events need to trigger SolidJS reactive updates without performance impact
- **Risk Level**: Medium
- **Solution**: Proper event bridging between Superpowered callbacks and SolidJS signals

---

## 🚀 Implementation Phases

## **Phase 1: Infrastructure Setup**
*Estimated Time: 2-3 days*

### **Task 1.1: Install Superpowered SDK**
```bash
# Navigate to web app
cd apps/web

# Use npm specifically for Superpowered (Bun compatibility)
npm install @superpoweredsdk/web

# Verify installation
npm list @superpoweredsdk/web
```

**Files to modify**: `apps/web/package.json`

### **Task 1.2: Configure Vite for WASM & AudioWorklets**
**Problem**: Vite needs configuration for Superpowered static assets

**Required changes to `apps/web/vite.config.ts`**:
```typescript
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  
  // Add WASM support
  assetsInclude: ['**/*.wasm'],
  
  server: {
    port: 3000,
    // Add security headers for SharedArrayBuffer
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['solid-js'],
          beatport: ['@betterpot/betterpot-client'],
          superpowered: ['@superpoweredsdk/web']
        }
      }
    }
  },
  
  optimizeDeps: {
    include: ['@betterpot/betterpot-client', '@betterpot/shared-types'],
    exclude: ['@superpoweredsdk/web'] // Let Superpowered handle its own loading
  },
  
  // Configure worker and WASM file handling
  worker: {
    format: 'es'
  }
})
```

### **Task 1.3: Update Backend CORS Headers**
**Problem**: Missing SharedArrayBuffer security headers

**Modify `apps/api/src/middleware/cors.ts`**:
```typescript
import { cors } from 'hono/cors'

export const corsMiddleware = cors({
  origin: (origin) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean)
    
    return allowedOrigins.includes(origin) || !origin
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  
  // Add SharedArrayBuffer support headers
  exposeHeaders: [
    'Cross-Origin-Embedder-Policy',
    'Cross-Origin-Opener-Policy'
  ]
})

// Additional middleware for security headers
export const securityHeaders = (c, next) => {
  c.header('Cross-Origin-Embedder-Policy', 'require-corp')
  c.header('Cross-Origin-Opener-Policy', 'same-origin')
  return next()
}
```

### **Task 1.4: Create Static Assets Structure**
**Create directory structure**:
```
apps/web/public/
├── superpowered/           # Superpowered WASM files
├── audio-worklets/         # AudioWorklet processor files
└── samples/               # Audio sample files
```

### **Task 1.5: Remove Howler.js Dependencies**
**Clean up existing audio libraries**:
```bash
cd apps/web
npm uninstall howler @types/howler
```

**Remove from `apps/web/package.json`** and any imports.

---

## **Phase 2: Core Audio Service Implementation**
*Estimated Time: 3-5 days*

### **Task 2.1: Create Superpowered Audio Service**
**Create `apps/web/src/services/superpoweredAudioService.ts`**:

Key responsibilities:
- Initialize Superpowered WebAudio context
- Handle AudioWorklet loading
- Manage audio file loading and decoding
- Provide playback controls (play, pause, seek, volume)
- Bridge Superpowered events to SolidJS reactivity

### **Task 2.2: Create AudioWorklet Processor**
**Create `apps/web/public/audio-worklets/djAudioProcessor.js`**:

Features:
- Low-latency audio processing
- Crossfading capabilities
- Volume control and peak metering
- Cue point handling

### **Task 2.3: Update Shared Types**
**Enhance `packages/shared-types/src/player.ts`**:
```typescript
export interface DJTrack extends Track {
  // Add DJ-specific properties
  bpm?: number
  key?: string
  waveform?: Float32Array
  cuePoints?: CuePoint[]
  beatGrid?: BeatGrid
}

export interface CuePoint {
  id: string
  time: number
  label: string
  color?: string
}

export interface DJPlayerState extends PlayerState {
  // Add DJ-specific state
  crossfaderPosition: number  // -1 to 1
  deckA: DeckState | null
  deckB: DeckState | null
  masterVolume: number
  headphoneVolume: number
  latency: number
}

export interface DeckState {
  track: DJTrack | null
  isPlaying: boolean
  currentTime: number
  volume: number
  gain: number
  eq: {
    low: number
    mid: number
    high: number
  }
  effects: EffectState[]
}
```

### **Task 2.4: Implement Audio Loading Pipeline**
**Features**:
- Load Beatport preview URLs
- Decode audio files with Superpowered
- Cache decoded audio in memory
- Handle network errors and fallbacks

---

## **Phase 3: SolidJS Integration**
*Estimated Time: 2-3 days*

### **Task 3.1: Update Player Store**
**Enhance `apps/web/src/stores/player.ts`**:
- Replace basic state with DJ-specific state
- Integrate Superpowered service
- Maintain SolidJS reactivity
- Add crossfader and deck controls

### **Task 3.2: Update Player UI Component**
**Enhance `apps/web/src/components/Player/Player.tsx`**:
- Professional DJ interface
- Dual deck layout
- Crossfader control
- Volume faders and EQ knobs
- Waveform display (Phase 4)

### **Task 3.3: Create Audio Event Bridge**
**Implement event system**:
- Superpowered callbacks → SolidJS signals
- Avoid performance issues with reactive updates
- Handle audio timing events precisely

---

## **Phase 4: Professional DJ Features**
*Estimated Time: 5-7 days*

### **Task 4.1: BPM Detection & Sync**
- Implement Superpowered's BPM detection
- Beat grid analysis and visualization
- Tempo sync between decks
- Automatic beatmatching

### **Task 4.2: Key Detection & Harmonic Mixing**
- Musical key detection using Superpowered
- Harmonic compatibility scoring
- Key change suggestions
- Camelot wheel integration

### **Task 4.3: Cue Points & Loops**
- Hot cue functionality (8 cue points per deck)
- Loop creation and manipulation
- Saved cue points per track
- Loop roll effects

### **Task 4.4: Real-time Effects**
**Implement using Superpowered effects**:
- High/Mid/Low EQ per deck
- Reverb and delay sends
- Filter sweeps (high-pass/low-pass)
- Bitcrusher and distortion
- Gate and roll effects

### **Task 4.5: Crossfading & Mixing**
- Professional crossfader curve
- Channel faders with proper gain staging
- Headphone cue system
- Master output control
- Peak level metering

---

## **Phase 5: Advanced Features**
*Estimated Time: 3-5 days*

### **Task 5.1: Waveform Visualization**
- Real-time waveform rendering
- Beat grid overlay
- Playhead and cue point markers
- Zoom and scroll functionality

### **Task 5.2: Audio Analysis**
- Frequency spectrum analysis
- Dynamic range visualization
- Energy level detection
- Transition suggestion system

### **Task 5.3: Performance Optimization**
- Memory management for audio buffers
- CPU usage optimization
- Latency monitoring and reporting
- Browser compatibility testing

---

## **Phase 6: Testing & Validation**
*Estimated Time: 2-3 days*

### **Task 6.1: Latency Testing**
- Use Superpowered's latency test tools
- Measure round-trip latency
- Test on different browsers and devices
- Document performance characteristics

### **Task 6.2: Professional Audio Testing**
- Real DJ mixing scenarios
- Beatmatching accuracy testing
- Long-session stability testing
- Audio quality validation

### **Task 6.3: Browser Compatibility**
- Chrome (primary target)
- Safari (macOS/iOS)
- Firefox
- Edge
- Mobile browser testing

---

## 🔧 Technical Architecture

### **File Structure**
```
apps/web/
├── public/
│   ├── superpowered/          # WASM files
│   ├── audio-worklets/        # AudioWorklet processors
│   └── samples/               # Audio samples
├── src/
│   ├── services/
│   │   ├── superpoweredAudioService.ts
│   │   ├── audioLoader.ts
│   │   └── audioAnalyzer.ts
│   ├── stores/
│   │   ├── player.ts          # Enhanced DJ state
│   │   └── effects.ts         # Effects state management
│   ├── components/
│   │   ├── Player/
│   │   │   ├── Player.tsx     # Main DJ interface
│   │   │   ├── Deck.tsx       # Individual deck component
│   │   │   ├── Crossfader.tsx # Crossfader control
│   │   │   └── Waveform.tsx   # Waveform display
│   │   └── Effects/
│   │       ├── EQ.tsx         # EQ controls
│   │       └── EffectsRack.tsx # Effects interface
│   └── types/
│       └── audio.ts           # Audio-specific types
```

### **Data Flow**
```
Beatport API → Audio Loader → Superpowered Decoder → AudioWorklet → Web Audio → Speakers
                                        ↓
SolidJS State ← Audio Service ← Superpowered Events ← AudioWorklet Processor
```

---

## 🚨 Risk Assessment & Mitigation

### **High Risk Items**
1. **WASM Loading Issues**: Test thoroughly across browsers
2. **AudioWorklet Compatibility**: Have Web Audio API fallback
3. **SharedArrayBuffer Support**: Graceful degradation without it
4. **Bun Compatibility**: Use npm for Superpowered specifically

### **Medium Risk Items**
1. **Performance on Mobile**: Optimize for mobile browsers
2. **Memory Usage**: Implement proper cleanup
3. **Latency Variations**: Monitor and adapt to different devices

### **Mitigation Strategies**
1. **Progressive Enhancement**: Start with basic playback, add features incrementally
2. **Fallback Systems**: Web Audio API backup for Superpowered failures
3. **Error Handling**: Comprehensive error reporting and recovery
4. **Performance Monitoring**: Real-time latency and CPU monitoring

---

## 📊 Success Metrics

### **Technical Metrics**
- **Latency**: <10ms round-trip audio latency
- **CPU Usage**: <15% on modern hardware
- **Memory Usage**: <100MB for typical DJ session
- **Compatibility**: 95%+ on target browsers

### **Professional DJ Metrics**
- **Beatmatching Accuracy**: ±0.1 BPM precision
- **Crossfader Response**: <1ms transition time
- **Cue Point Accuracy**: ±10ms timing precision
- **Session Stability**: 4+ hours without audio dropouts

---

## 🎯 Next Steps

1. **Phase 1 Start**: Begin with infrastructure setup and Vite configuration
2. **Incremental Testing**: Test each phase thoroughly before proceeding
3. **Documentation**: Document any Bun-specific workarounds discovered
4. **Performance Baselines**: Establish baseline metrics early

---

## 📝 Notes

- **Licensing**: Using Superpowered under free experimentation license for private use
- **Future**: Consider commercial license if making public
- **Backup Plan**: Keep basic Web Audio API implementation as fallback
- **Documentation**: Maintain detailed notes on Bun + Superpowered integration quirks

---

*Last Updated: September 20, 2025*
*Project: BetterPot Professional DJ Application*