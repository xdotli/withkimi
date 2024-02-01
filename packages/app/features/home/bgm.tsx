import Sound from 'react-native-sound'

class BgmService {
  private static instance: BgmService | null = null
  private bgmInstance: Sound | null = null

  private constructor() {}

  public static getInstance(): BgmService {
    if (!BgmService.instance) {
      BgmService.instance = new BgmService()
    }

    return BgmService.instance
  }

  public async loadBgm(): Promise<void> {
    if (!this.bgmInstance) {
      const uri = 'https://live2d-one.vercel.app/background-music.mp3'
      this.bgmInstance = new Sound(uri, '', (error) => {
        if (error) {
          console.error('Error loading sound:', error)
          return
        }
        // Play the sound
        if(this.bgmInstance){
          this.bgmInstance.setNumberOfLoops(-1)
          this.bgmInstance.setVolume(0.1)
        }
      })
    }
  }

  public playBgm(): void {
    if (this.bgmInstance) {
      console.log("play bgm")
      this.bgmInstance.play((success) => {
        if (success) {
          console.log('successfully finished playing')
          // Release the sound resource when playback is complete
          if (this.bgmInstance) this.bgmInstance.release()
        } else {
          console.log('playback failed due to audio decoding errors')
        }
      })
    }
  }

  public pauseBgm(): void {
    if (this.bgmInstance) {
      console.log("pause bgm")
      this.bgmInstance.pause()
    }
  }

  public stopBgm(): void {
    if (this.bgmInstance) {
      console.log("stop bgm")
      this.bgmInstance.stop(() => {
        // Note: If you want to play a sound after stopping and rewinding it,
        // it is important to call play() in a callback.
        this.bgmInstance?.play();
      })
    }
  }

  public releaseBgm(): void {
    if (this.bgmInstance) {
      console.log("unload bgm")
      this.bgmInstance.release()
    }
  }
}

export default BgmService;