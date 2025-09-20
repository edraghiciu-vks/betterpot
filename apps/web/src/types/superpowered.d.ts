// TypeScript declarations for Superpowered Web SDK
declare module '@superpoweredsdk/web' {
  export interface SuperpoweredWebAudioConfig {
    license?: string
    enableAudioOutput?: boolean
    enableAnalysis?: boolean
    enableTimeStretching?: boolean
    logLevel?: 'debug' | 'info' | 'warn' | 'error'
  }

  export class SuperpoweredWebAudio {
    audioContext: AudioContext
    
    constructor(config: SuperpoweredWebAudioConfig)
    start(): Promise<void>
    destroy(): void
  }

  export class SuperpoweredAdvancedAudioPlayer {
    constructor(
      sampleRate: number,
      channels: number,
      bufferSize: number,
      realtime: boolean
    )

    loadFromArrayBuffer(buffer: ArrayBuffer): boolean
    play(): void
    pause(): void
    stop(): void
    setPosition(seconds: number, andSeekBackward: boolean, synchronisedStart: boolean): void
    setVolume(volume: number): void
    getPosition(): number
    getDuration(): number
    isPlaying(): boolean
    isPaused(): boolean
  }
}