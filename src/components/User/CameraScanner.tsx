import React, { useRef, useState, useEffect } from 'react';
import { Camera, SwitchCamera, Check, RotateCcw, X, AlertCircle, Sparkles } from 'lucide-react';

interface CameraScannerProps {
  onCaptureConfirm: (imageDataUrl: string) => void;
  onCancel: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onCaptureConfirm,
  onCancel
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [camerasAvailable, setCamerasAvailable] = useState<boolean>(true);

  // Start live stream
  const startCamera = async (mode: 'environment' | 'user') => {
    stopCamera();
    setError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera device API is not supported on this browser.');
        setCamerasAvailable(false);
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      if (mode === 'environment') {
        // Retry with user camera if rear is not available
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          streamRef.current = fallbackStream;
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            await videoRef.current.play();
          }
          return;
        } catch (fbErr) {
          // fall through
        }
      }
      setError('Unable to activate camera. Please verify camera permissions or upload an image file instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleToggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onCaptureConfirm(capturedImage);
    }
  };

  return (
    <div id="live-camera-scanner-modal" className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 animate-fade-in select-none">
      
      {/* Header Bar */}
      <div className="w-full max-w-xl flex items-center justify-between py-2 text-white z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-bold tracking-wide">
            {capturedImage ? 'Review Captured Leaf' : 'Live Plant Scanner'}
          </span>
        </div>
        <button
          onClick={() => { stopCamera(); onCancel(); }}
          className="p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="relative w-full max-w-xl flex-1 max-h-[70vh] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl">
        {error ? (
          <div className="p-6 text-center text-slate-300 max-w-sm">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Camera Unavailable</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">{error}</p>
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Upload Leaf Image Instead
            </button>
          </div>
        ) : capturedImage ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <img
              id="captured-leaf-preview"
              src={capturedImage}
              alt="Captured leaf preview"
              className="max-h-full max-w-full object-contain"
            />
            {/* Guide overlay */}
            <div className="absolute top-4 left-4 bg-emerald-950/80 text-emerald-300 text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preview Ready</span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Target Reticle Frame */}
            <div className="absolute inset-8 sm:inset-12 border-2 border-emerald-400/60 rounded-3xl pointer-events-none flex flex-col justify-between p-4 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
              <div className="flex justify-between">
                <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              </div>
              <div className="text-center">
                <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-emerald-300 border border-emerald-500/30">
                  Align single diseased leaf in frame
                </span>
              </div>
              <div className="flex justify-between">
                <span className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <span className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="w-full max-w-xl py-4 flex items-center justify-center gap-6 z-10">
        {capturedImage ? (
          <div className="flex items-center gap-4 w-full justify-center">
            <button
              id="retake-photo-btn"
              onClick={handleRetake}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              Retake
            </button>
            <button
              id="use-photo-btn"
              onClick={handleConfirmPhoto}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-900/50 transition"
            >
              <Check className="w-4 h-4" />
              Use This Photo
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-6">
            <button
              id="switch-camera-btn"
              onClick={handleToggleCamera}
              className="p-3.5 rounded-full bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Switch Camera (Front/Rear)"
            >
              <SwitchCamera className="w-5 h-5" />
            </button>

            {/* Shutter Button */}
            <button
              id="capture-photo-btn"
              onClick={handleCapture}
              disabled={!!error}
              className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1.5 hover:scale-105 active:scale-95 transition shadow-lg disabled:opacity-50"
            >
              <div className="w-full h-full rounded-full bg-emerald-500" />
            </button>

            <div className="w-12" /> {/* Balancing Spacer */}
          </div>
        )}
      </div>

    </div>
  );
};
