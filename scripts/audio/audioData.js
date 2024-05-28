export default class BEAT {
  constructor(
    name,
    filterFrequency = 100,
    peakGain = 15,
    threshold = 0.8,
    sampleSkip = 350,
    minAnimationTime = 0.4
  ) {
    this.isPlaying = false;
    this.name = name;
    this.filterFrequency = filterFrequency;
    this.peakGain = peakGain;
    this.threshold = threshold;
    this.sampleSkip = sampleSkip;
    this.minAnimationTime = minAnimationTime;
    this.songData = [];
    this.context = null;
    this.buffer = null;
    this.offlineContext = null;
    this.init();
    this.data = 0;
    this.isDetected = false;
  }

  init() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "audio/*";
    fileInput.style.position = "absolute";
    fileInput.style.zIndex = 100;
    document.body.appendChild(fileInput);

    fileInput.addEventListener("change", async (event) => {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.name = URL.createObjectURL(file);
        this.initContext();
        await this.load();
        this.play((data) => {
          this.isDetected = true;
          this.data = data;
        });
      }
    });
  }

  initContext() {
    if (!this.context) {
      this.context = new AudioContext();
    }
  }

  async load() {
    const resp = await fetch(this.name);
    const file = await resp.arrayBuffer();
    const buffer = await this.context.decodeAudioData(file);
    this.buffer = buffer;
    return await this.analyze();
  }

  play(cb) {
    this.initContext();
    this.isPlaying = true;
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.context.destination);
    source.loop = true;
    source.start();
    this.animate(cb);
  }

  async analyze() {
    this.initContext();
    this.offlineContext = new OfflineAudioContext(
      1,
      this.buffer.length,
      this.buffer.sampleRate
    );
    const source = this.offlineContext.createBufferSource();
    source.buffer = this.buffer;

    const filter = this.offlineContext.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = this.filterFrequency;
    filter.Q.value = 1;

    const filter2 = this.offlineContext.createBiquadFilter();
    filter2.type = "peaking";
    filter2.frequency.value = this.filterFrequency;
    filter2.Q.value = 1;
    filter2.gain.value = this.peakGain;

    source.connect(filter2);
    filter2.connect(filter);
    filter.connect(this.offlineContext.destination);
    source.start();
    const renderedBuffer = await this.offlineContext.startRendering();
    const data = renderedBuffer.getChannelData(0);
    this.songData = [];
    for (let i = 0; i < data.length; i += this.sampleSkip) {
      if (data[i] > this.threshold) {
        const time = i / renderedBuffer.sampleRate;
        const previousTime = this.songData.length
          ? this.songData[this.songData.length - 1].time
          : 0;
        if (time - previousTime > this.minAnimationTime) {
          this.songData.push({ data: data[i], time });
        }
      }
    }
  }

  animate(cb) {
    this.songData.forEach((d, i) => {
      const nextTime =
        i === this.songData.length - 1
          ? d.time
          : this.songData[i + 1].time - d.time;
      setTimeout(() => cb(d.data), d.time * 1000);
    });
  }
}
