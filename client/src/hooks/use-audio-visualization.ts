import { useState, useEffect, useRef } from 'react';
import { useRoom } from '@/contexts/RoomContext';

interface AudioVisualizationOptions {
  fftSize?: number;
  smoothingTimeConstant?: number;
  minDecibels?: number;
  maxDecibels?: number;
}

export function useAudioVisualization(options: AudioVisualizationOptions = {}) {
  const {
    fftSize = 256,
    smoothingTimeConstant = 0.8,
    minDecibels = -90,
    maxDecibels = -10
  } = options;
  
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [averageVolume, setAverageVolume] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const { isMuted, sendVoiceActivity } = useRoom();

  // Start the audio visualization
  const startVisualization = async () => {
    try {
      if (!navigator.mediaDevices) {
        console.error('Media Devices API not supported');
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      // Create audio context
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
      
      // Create analyzer
      const analyzerNode = context.createAnalyser();
      analyzerNode.fftSize = fftSize;
      analyzerNode.smoothingTimeConstant = smoothingTimeConstant;
      analyzerNode.minDecibels = minDecibels;
      analyzerNode.maxDecibels = maxDecibels;
      setAnalyser(analyzerNode);
      
      // Connect the stream to the analyzer
      const source = context.createMediaStreamSource(stream);
      source.connect(analyzerNode);
      
      // Create data array for analyzer
      const dataArray = new Uint8Array(analyzerNode.frequencyBinCount);
      setAudioData(dataArray);
      
      setIsRecording(true);
      
      // Start animation frame loop
      updateVisualization(analyzerNode, dataArray);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Stop the audio visualization
  const stopVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    
    if (audioContext) {
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
      setAudioContext(null);
    }
    
    setAnalyser(null);
    setAudioData(null);
    setIsRecording(false);
    setAverageVolume(0);
  };

  // Update the visualization on each animation frame
  const updateVisualization = (analyzer: AnalyserNode, dataArray: Uint8Array) => {
    if (!analyzer || !dataArray) return;

    animationFrameRef.current = requestAnimationFrame(() => 
      updateVisualization(analyzer, dataArray)
    );
    
    // Get frequency data
    analyzer.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    const normalizedAvg = avg / 255; // Normalize to 0-1
    setAverageVolume(normalizedAvg);
    
    // Send voice activity if not muted
    if (!isMuted) {
      sendVoiceActivity(normalizedAvg);
    }
  };

  // Toggle visualization
  const toggleVisualization = () => {
    if (isRecording) {
      stopVisualization();
    } else {
      startVisualization();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopVisualization();
    };
  }, []);

  return {
    audioData,
    isRecording,
    averageVolume,
    startVisualization,
    stopVisualization,
    toggleVisualization
  };
}
