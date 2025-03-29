import React, { useEffect, useRef, useState } from 'react';
import { useRoom } from '@/contexts/RoomContext';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';

interface VideoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: number;
}

const VideoPanel: React.FC<VideoPanelProps> = ({ isOpen, onClose, roomId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const { wsInstance } = useRoom();

  useEffect(() => {
    if (isOpen) {
      initializeMedia();
    } else {
      stopMedia();
    }
    return () => stopMedia();
  }, [isOpen]);

  const initializeMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopMedia = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-48 bg-background rounded-lg shadow-lg overflow-hidden border border-border z-50">
      <div className="relative h-full">
        {/* Video Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleVideo}
              className={`p-2 rounded-full ${
                isVideoEnabled ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
              }`}
            >
              {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </button>
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-full ${
                isAudioEnabled ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
              }`}
            >
              {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="text-white hover:text-primary transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;
