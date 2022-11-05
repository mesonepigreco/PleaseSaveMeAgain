
export class AudioContext {
  constructor() {
    const ac = window.AudioContext || window.webkitAudioContext;
    this.context = new ac();

    this.buffers = [];
  }
}

export class AudioBuffer {
  /*
   * This class provides the buffer to the audio files
   * It uses the XML Http request to load the buffers and store them.
   * They could ether be on a URL or on the same server as the game
   */
  constructor(filename, audio_context) {
    
    // Create an XML request for the file
    this.buffer = null;
    this.context = audio_context;
    this.last_source = null;
    let self = this;
    
    let request = new XMLHttpRequest();
    request.open("GET", filename);
    request.responseType = "arraybuffer";
    request.onload = function() {
        let undecodedAudio = request.response;
        self.audio_context.decodeAudioData(undecodedAudio, (data) => {
            self.buffer = data
        });
    };
    request.send();
  }

  is_loaded() {
    if (this.buffer === null) return false;
    return true;
  }

  play(volume, delay, loop) {
    var source = this.context.createBufferSource();
    source.buffer = this.buffer;
    var gainNode = this.context.createGain();
    source.connect(gainNode);
    gainNode.connect(this.context.destination);
    gainNode.gain.value = volume;
    source.loop = loop;
    source.start(delay);
    console.log("CNT:", context, "BUFFER:", buffer);

    // Keep track of the last audio played, 
    // For simple applications we are able to stop and restart it.
    this.last_source = source;
    return source;
  }
}
