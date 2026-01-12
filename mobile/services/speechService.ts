import * as Speech from "expo-speech";

class SpeechService {
  private isSpeaking: boolean = false;
  private queue: string[] = [];

  // Speak text with Thai language support
  speak(text: string, interrupt: boolean = false) {
    if (interrupt) {
      this.stop();
    }

    if (this.isSpeaking && !interrupt) {
      this.queue.push(text);
      return;
    }

    this.isSpeaking = true;
    Speech.speak(text, {
      language: "th-TH",
      pitch: 1.0,
      rate: 1.0,
      onDone: () => {
        this.isSpeaking = false;
        this.speakNext();
      },
      onError: () => {
        this.isSpeaking = false;
        this.speakNext();
      },
    });
  }

  // Speak next item in queue
  private speakNext() {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) {
        this.speak(next);
      }
    }
  }

  // Stop current speech
  stop() {
    Speech.stop();
    this.isSpeaking = false;
    this.queue = [];
  }

  // Check if currently speaking
  isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  // Announce navigation instruction
  announceNavigation(instruction: string, distance: number) {
    const announcement = `${instruction} ระยะทาง ${Math.round(distance)} เมตร`;
    this.speak(announcement, true);
  }

  // Announce arrival
  announceArrival(roomNumber: string) {
    this.speak(`คุณมาถึงห้อง ${roomNumber} แล้ว`, true);
  }

  // Announce floor selection
  announceFloor(floorNumber: number) {
    this.speak(`เลือกชั้น ${floorNumber}`, false);
  }

  // Announce room selection
  announceRoom(roomNumber: string) {
    this.speak(`เลือกห้อง ${roomNumber}`, false);
  }

  // Announce button action
  announceButton(buttonName: string) {
    this.speak(buttonName, false);
  }
}

export default new SpeechService();
