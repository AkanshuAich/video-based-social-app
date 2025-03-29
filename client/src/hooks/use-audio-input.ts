import { useState, useCallback, useEffect } from 'react';

export function useAudioInput() {
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  // Initialize audio context and analyser
  const initializeAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyserNode = context.createAnalyser();

      analyserNode.fftSize = 256;
      source.connect(analyserNode);

      setAudioStream(stream);
      setAudioContext(context);
      setAnalyser(analyserNode);
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }, []);

  // Start audio capture and analysis
  const startAudioCapture = useCallback(async () => {
    if (!audioContext) {
      await initializeAudio();
    }
  }, [audioContext, initializeAudio]);

  // Stop audio capture
  const stopAudioCapture = useCallback(() => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
    setAnalyser(null);
    setAudioLevel(0);
  }, [audioStream, audioContext]);

  // Analyze audio levels
  useEffect(() => {
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let animationFrameId: number;

    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255); // Normalize to 0-1
      animationFrameId = requestAnimationFrame(updateLevel);
    };

    updateLevel();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [analyser]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudioCapture();
    };
  }, [stopAudioCapture]);

  return {
    audioLevel,
    startAudioCapture,
    stopAudioCapture
  };
}
