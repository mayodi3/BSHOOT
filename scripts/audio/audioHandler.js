export default class AudioHandler {
  constructor() {
    this.audioContext;
    this.sounds = {};
    this.laserSoundNode = null;
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
  }

  async loadSound(key, src) {
    try {
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds[key] = audioBuffer;
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  }

  playSound(key, maxOverlap = 3) {
    if (!this.sounds[key]) {
      console.warn(`Sound not found: ${key}`);
      return;
    }
    // Sound overlap management
    const activeSources = Object.values(this.sounds).filter(
      (sound) => sound.buffer === this.sounds[key] && !sound.ended
    );
    if (activeSources.length >= maxOverlap) return; // Limit reached, skip playing this sound
    // Create and play the sound
    const source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[key];
    // Introduce subtle pitch variations for realism
    const randomDetune = (Math.random() - 0.5) * 10; // Up to +/- 10 cents
    source.detune.value = randomDetune;
    source.connect(this.audioContext.destination);
    source.start(0);
    return source;
  }

  startLaser(key) {
    if (!this.laserSoundNode) {
      this.laserSoundNode = this.audioContext.createBufferSource();
      this.laserSoundNode.buffer = this.sounds[key];
      this.laserSoundNode.loop = true;
      this.laserSoundNode.connect(this.audioContext.destination);
      this.laserSoundNode.start();
    }
  }

  stopLaser() {
    if (this.laserSoundNode) {
      this.laserSoundNode.stop();
      this.laserSoundNode.disconnect();
      this.laserSoundNode = null;
    }
  }
}
