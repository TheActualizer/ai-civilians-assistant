export class RealtimeChat {
  private mediaRecorder: MediaRecorder | null = null;
  private onMessageCallback: (event: any) => void;

  constructor(onMessage: (event: any) => void) {
    this.onMessageCallback = onMessage;
  }

  async init() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      
      this.mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            await this.processAudio(base64Audio);
          };
          reader.readAsDataURL(event.data);
        }
      };

      this.mediaRecorder.start(1000); // Capture in 1-second chunks
      console.log('Voice chat initialized');
    } catch (error) {
      console.error('Error initializing voice chat:', error);
      throw error;
    }
  }

  private async processAudio(base64Audio: string) {
    try {
      const response = await fetch('/api/voice-to-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64Audio }),
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const data = await response.json();
      this.onMessageCallback({
        type: 'response.audio.delta',
        content: data.text,
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      this.onMessageCallback({
        type: 'response.audio.error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  disconnect() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      const tracks = this.mediaRecorder.stream.getTracks();
      tracks.forEach(track => track.stop());
      this.mediaRecorder = null;
      console.log('Voice chat disconnected');
    }
  }
}