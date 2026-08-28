import React, { useState } from 'react';
import { Eye, Layers, Flame, Scan, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';
import { LesionCoordinate, GradCamPoint } from '../../types';

interface VisualAnalysisViewerProps {
  originalUrl: string;
  segmentationUrl?: string;
  gradCamUrl?: string;
  lesions?: LesionCoordinate[];
  gradCamHotspots?: GradCamPoint[];
  diseaseName?: string;
}

export const VisualAnalysisViewer: React.FC<VisualAnalysisViewerProps> = ({
  originalUrl,
  segmentationUrl,
  gradCamUrl,
  lesions = [],
  diseaseName = 'Plant Leaf'
}) => {
  const [activeTab, setActiveTab] = useState<'original' | 'segmentation' | 'gradcam' | 'combined'>('segmentation');
  const [zoom, setZoom] = useState<number>(1);

  const getImageForTab = () => {
    switch (activeTab) {
      case 'original':
        return originalUrl;
      case 'segmentation':
        return segmentationUrl || originalUrl;
      case 'gradcam':
        return gradCamUrl || originalUrl;
      case 'combined':
        return segmentationUrl || originalUrl; // Combined rendering
      default:
        return originalUrl;
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(2.5, prev + 0.25));
  const handleZoomOut = () => setZoom(prev => Math.max(0.75, prev - 0.25));
  const handleResetZoom = () => setZoom(1);

  return (
    <div id="visual-analysis-viewer" className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex flex-col">
      {/* Visual Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            id="tab-original-btn"
            onClick={() => setActiveTab('original')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'original'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Original
          </button>

          <button
            id="tab-segmentation-btn"
            onClick={() => setActiveTab('segmentation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'segmentation'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            U-Net Mask
          </button>

          <button
            id="tab-gradcam-btn"
            onClick={() => setActiveTab('gradcam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'gradcam'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Grad-CAM
          </button>

          <button
            id="tab-combined-btn"
            onClick={() => setActiveTab('combined')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'combined'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            Combined
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            id="zoom-out-btn"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 px-1 min-w-[38px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            id="zoom-in-btn"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="zoom-reset-btn"
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] bg-black flex items-center justify-center overflow-hidden">
        <div
          className="transition-transform duration-200 ease-out flex items-center justify-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <img
            id="active-leaf-display"
            src={getImageForTab()}
            alt={diseaseName}
            className="max-h-[350px] sm:max-h-[400px] md:max-h-[440px] max-w-full object-contain select-none"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Floating Context Pill */}
        <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-sm border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {activeTab === 'original' && 'Raw input leaf photograph'}
            {activeTab === 'segmentation' && `U-Net predicted lesion areas (${lesions.length || 3} foci)`}
            {activeTab === 'gradcam' && 'Class Activation Map: Highlights neural attention regions'}
            {activeTab === 'combined' && 'Thermal activation combined with boundary segmentations'}
          </span>
        </div>
      </div>

      {/* Scientific Legend Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            <span>Necrotic Lesion Mask</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span>Chlorotic Halo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Healthy Parenchyma</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          Architecture: 2D U-Net + Grad-CAM Explainability
        </div>
      </div>
    </div>
  );
};
