import { Audio } from 'expo-av'

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: false,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
})

class BgmService {
  private static instance: BgmService | null = null
  private bgmInstance: Audio.Sound | null = null

  private constructor() {}

  public static getInstance(): BgmService {
    if (!BgmService.instance) {
      BgmService.instance = new BgmService()
    }

    return BgmService.instance
  }

  public async loadBgm(): Promise<void> {
    if (!this.bgmInstance) {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
      this.bgmInstance = new Audio.Sound()
      await this.bgmInstance.loadAsync(require('packages/app/assets/background-music.mp3'))
      this.bgmInstance.setVolumeAsync(0.2)
      this.bgmInstance.setIsLoopingAsync(true)
    }
  }

  public playBgm(): void {
    if (this.bgmInstance) {
      console.log("play bgm")
      this.bgmInstance.playAsync()
    }
  }

  public pauseBgm(): void {
    if (this.bgmInstance) {
      console.log("pause bgm")
      this.bgmInstance.pauseAsync()
    }
  }

  public stopBgm(): void {
    if (this.bgmInstance) {
      console.log("stop bgm")
      this.bgmInstance.stopAsync()
    }
  }
}

export default BgmService;
