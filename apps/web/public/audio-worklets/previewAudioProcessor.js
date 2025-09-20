// Simple AudioWorklet processor for high-performance audio playback
// This file should NOT be bundled by Vite - it runs in the AudioWorklet thread

class PreviewAudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.port.onmessage = this.handleMessage.bind(this)
  }

  handleMessage(event) {
    const { type, data } = event.data
    
    switch (type) {
      case 'setVolume':
        this.volume = data.volume
        break
      case 'mute':
        this.muted = data.muted
        break
      default:
        console.warn('Unknown message type:', type)
    }
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0]
    const output = outputs[0]
    
    if (input && input.length > 0 && output && output.length > 0) {
      const inputChannel = input[0]
      const outputChannelL = output[0]
      const outputChannelR = output[1] || output[0] // Fallback to mono if no right channel
      
      const volume = this.volume || 1.0
      const muted = this.muted || false
      const actualVolume = muted ? 0 : volume
      
      // Simple pass-through with volume control
      for (let i = 0; i < inputChannel.length; i++) {
        const sample = inputChannel[i] * actualVolume
        outputChannelL[i] = sample
        if (outputChannelR !== outputChannelL) {
          outputChannelR[i] = sample
        }
      }
    }
    
    return true // Keep processor alive
  }
}

registerProcessor('preview-audio-processor', PreviewAudioProcessor)