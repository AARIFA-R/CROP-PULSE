import React, { useState } from 'react';
import { 
  Sprout, 
  Activity, 
  Download, 
  FileText, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Cpu, 
  Share2,
  BookmarkCheck
} from 'lucide-react';
import { DiagnosisResult } from '../../types';
import { SeverityMeter } from '../Shared/SeverityMeter';
import { VisualAnalysisViewer } from '../Shared/VisualAnalysisViewer';
import { MitigationCard } from '../Shared/MitigationCard';
import { generateSingleDiagnosisPDF } from '../../lib/pdfGenerator';

interface DiagnosisResultViewProps {
  result: DiagnosisResult;
  onNewScan: () => void;
  onBackToDashboard: () => void;
}

export const DiagnosisResultView: React.FC<DiagnosisResultViewProps> = ({
  result,
  onNewScan,
  onBackToDashboard
}) => {
  const [savedNotification, setSavedNotification] = useState<boolean>(false);

  const handleDownloadPDF = () => {
    generateSingleDiagnosisPDF(result);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CropPulse_Diagnosis_${result.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isHealthy = result.severityPercentage <= 10 || result.diseaseName.toLowerCase().includes('healthy');

  return (
    <div id="diagnosis-result-view" className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-100">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 hover:text-emerald-950 transition"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          Back to Dashboard
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="download-pdf-btn"
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider shadow-sm transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Download PDF Report
          </button>

          <button
            id="download-json-btn"
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs uppercase tracking-wider transition"
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            Export JSON
          </button>

          <button
            id="new-scan-btn"
            onClick={onNewScan}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-900/15 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Scan Another Leaf
          </button>
        </div>
      </div>

      {/* Main Diagnosis Highlights Banner */}
      <div className={`p-8 rounded-3xl border shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${
        isHealthy
          ? 'bg-emerald-50/70 border-emerald-200'
          : result.severityPercentage > 60
          ? 'bg-rose-50/70 border-rose-200'
          : 'bg-amber-50/70 border-amber-200'
      }`}>
        
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-white flex items-center gap-1.5 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              {result.modelVersion}
            </span>
            <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(result.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Sprout className="w-6 h-6 text-emerald-700" />
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                {result.plantName}
              </h2>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                {result.plantConfidence}% match
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                {result.diseaseName}
              </h3>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200">
                {result.diseaseConfidence}% confidence
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {result.description || result.symptoms}
          </p>
        </div>

        {/* Severity Gauge Box */}
        <div className="w-full lg:w-80 bg-white p-6 rounded-3xl border border-emerald-100 shadow-md">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800 block mb-2">
            Continuous Severity Index
          </span>
          <SeverityMeter
            percentage={result.severityPercentage}
            level={result.severityLevel}
            size="lg"
            showLabels={true}
          />
        </div>
      </div>

      {/* Grid: Visual Analysis on Left & Mitigation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Visual Explainability Inspector (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-emerald-950 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Explainable Computer Vision Analysis
            </h3>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Interactive 4-Layer Inspection
            </span>
          </div>

          <VisualAnalysisViewer
            originalUrl={result.originalImageUrl}
            segmentationUrl={result.segmentationImageUrl}
            gradCamUrl={result.gradCamImageUrl}
            lesions={result.lesions}
            gradCamHotspots={result.gradCamHotspots}
            diseaseName={result.diseaseName}
          />

          {/* Pathology Diagnostic Notes */}
          <div className="p-5 bg-white rounded-3xl border border-emerald-100 text-xs text-slate-700 space-y-2 shadow-sm">
            <div>
              <span className="font-black text-emerald-950 uppercase tracking-wider">Symptoms: </span>
              <span className="font-medium text-slate-600">{result.symptoms || 'Visual lesion patterns identified on foliar surface.'}</span>
            </div>
            {result.causes && (
              <div>
                <span className="font-black text-emerald-950 uppercase tracking-wider">Pathogen / Causative Factor: </span>
                <span className="font-medium text-slate-600">{result.causes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mitigation Guidance & Treatment (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-emerald-950 tracking-tight flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-emerald-600" />
              Actionable Mitigation Guidance
            </h3>
          </div>

          <MitigationCard
            mitigation={result.recommendations}
            diseaseName={result.diseaseName}
            plantName={result.plantName}
          />
        </div>

      </div>

    </div>
  );
};

