import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Download, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  X, 
  BarChart3, 
  ArrowLeft, 
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';
import { BatchAnalysis, DiagnosisResult, SeverityLevel } from '../../types';
import { SeverityMeter } from '../Shared/SeverityMeter';
import { VisualAnalysisViewer } from '../Shared/VisualAnalysisViewer';
import { MitigationCard } from '../Shared/MitigationCard';
import { exportBatchToCSV, generateBatchSummaryPDF, generateSingleDiagnosisPDF } from '../../lib/pdfGenerator';

interface BatchAnalysisViewProps {
  batch: BatchAnalysis;
  onBackToDashboard: () => void;
  onOpenAnalytics: () => void;
}

export const BatchAnalysisView: React.FC<BatchAnalysisViewProps> = ({
  batch,
  onBackToDashboard,
  onOpenAnalytics
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'name' | 'severity-desc' | 'severity-asc'>('severity-desc');

  // Modal inspection of individual leaf result
  const [inspectingItem, setInspectingItem] = useState<DiagnosisResult | null>(null);

  const progressPercent = batch.totalImages > 0 
    ? Math.round((batch.processedImages / batch.totalImages) * 100) 
    : 0;

  // Filter items
  const filteredItems = batch.items.filter(item => {
    const matchesSearch = 
      item.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.fileName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDisease = selectedDiseaseFilter === 'ALL' || item.diseaseName === selectedDiseaseFilter;
    const matchesSeverity = selectedSeverityFilter === 'ALL' || item.severityLevel === selectedSeverityFilter;

    return matchesSearch && matchesDisease && matchesSeverity;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === 'name') return (a.fileName || a.plantName).localeCompare(b.fileName || b.plantName);
    if (sortOrder === 'severity-desc') return b.severityPercentage - a.severityPercentage;
    if (sortOrder === 'severity-asc') return a.severityPercentage - b.severityPercentage;
    return 0;
  });

  // Unique diseases for filter
  const uniqueDiseases = Array.from(new Set(batch.items.map(i => i.diseaseName)));

  const isProcessing = batch.status === 'PROCESSING' || batch.status === 'QUEUED';

  return (
    <div id="farmer-batch-analysis-view" className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in font-sans">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
        <div>
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 hover:text-emerald-950 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            Back to Farmer Dashboard
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-emerald-950 tracking-tight">
              {batch.batchName}
            </h2>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              batch.status === 'COMPLETED' 
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                : batch.status === 'PROCESSING' 
                ? 'bg-amber-100 text-amber-900 border border-amber-200 animate-pulse'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {batch.status}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Initiated {new Date(batch.createdAt).toLocaleString()} • {batch.processedImages} of {batch.totalImages} images processed
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="batch-analytics-btn"
            onClick={onOpenAnalytics}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm transition"
          >
            <BarChart3 className="w-4 h-4" />
            Batch Analytics
          </button>

          <button
            id="export-csv-btn"
            onClick={() => exportBatchToCSV(batch)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Export CSV
          </button>

          <button
            id="export-batch-pdf-btn"
            onClick={() => generateBatchSummaryPDF(batch)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs uppercase tracking-wider transition"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            PDF Certificate
          </button>
        </div>
      </div>

      {/* Progress Telemetry Card */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-emerald-950 flex items-center gap-2 uppercase tracking-wide">
            {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-amber-600" />}
            Batch Telemetry: {batch.processedImages} / {batch.totalImages} Samples Completed
          </span>
          <span className="text-amber-700 text-sm font-black">{progressPercent}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3.5 bg-emerald-50 rounded-full overflow-hidden p-0.5 border border-emerald-100">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              batch.status === 'COMPLETED' ? 'bg-emerald-600' : 'bg-amber-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Aggregate KPI line */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80">
            <span className="text-slate-500 block text-[10px] uppercase font-black tracking-wider">Healthy Canopy</span>
            <span className="text-lg font-black text-emerald-600">{batch.healthyCount} leaves</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100/80">
            <span className="text-slate-500 block text-[10px] uppercase font-black tracking-wider">Infected Samples</span>
            <span className="text-lg font-black text-rose-600">{batch.diseasedCount} leaves</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/80">
            <span className="text-slate-500 block text-[10px] uppercase font-black tracking-wider">Mean Severity</span>
            <span className="text-lg font-black text-amber-600">{batch.averageSeverity}%</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80">
            <span className="text-slate-500 block text-[10px] uppercase font-black tracking-wider">Dominant Pathology</span>
            <span className="text-base font-black text-emerald-950 truncate block">{batch.dominantDisease || 'Healthy Foliage'}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by sample name, crop, or disease..."
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Disease Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-emerald-600 shrink-0" />
          <select
            value={selectedDiseaseFilter}
            onChange={(e) => setSelectedDiseaseFilter(e.target.value)}
            className="w-full md:w-auto px-3.5 py-2.5 text-xs font-bold rounded-2xl border border-emerald-200 bg-white text-emerald-950 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Diseases ({batch.items.length})</option>
            {uniqueDiseases.map((dis, idx) => (
              <option key={idx} value={dis}>{dis}</option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSeverityFilter}
            onChange={(e) => setSelectedSeverityFilter(e.target.value)}
            className="w-full md:w-auto px-3.5 py-2.5 text-xs font-bold rounded-2xl border border-emerald-200 bg-white text-emerald-950 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Severity Levels</option>
            <option value="HEALTHY">Healthy (0-10%)</option>
            <option value="MILD">Mild (11-30%)</option>
            <option value="MODERATE">Moderate (31-60%)</option>
            <option value="SEVERE">Severe (61-80%)</option>
            <option value="CRITICAL">Critical (81-100%)</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <ArrowUpDown className="w-4 h-4 text-emerald-600 shrink-0" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="w-full md:w-auto px-3.5 py-2.5 text-xs font-bold rounded-2xl border border-emerald-200 bg-white text-emerald-950 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="severity-desc">Highest Severity First</option>
            <option value="severity-asc">Lowest Severity First</option>
            <option value="name">File Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-950 text-white font-black uppercase tracking-wider text-[11px] border-b border-emerald-900">
              <tr>
                <th className="py-3.5 px-4">Sample / Image</th>
                <th className="py-3.5 px-4">Crop Species</th>
                <th className="py-3.5 px-4">Pathology Diagnosis</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Severity %</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-bold">
                    No results match your search filters in this batch.
                  </td>
                </tr>
              ) : (
                sortedItems.map((item) => {
                  const isHealthy = item.severityPercentage <= 10;
                  return (
                    <tr key={item.id} className="hover:bg-emerald-50/40 transition">
                      
                      {/* Image Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.segmentationImageUrl || item.originalImageUrl}
                            alt={item.fileName}
                            className="w-11 h-11 rounded-xl object-cover bg-emerald-950 border border-emerald-100"
                          />
                          <div>
                            <p className="font-black text-emerald-950 truncate max-w-[140px]">
                              {item.fileName || 'Leaf Sample'}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono font-bold">
                              {item.id.substring(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Plant */}
                      <td className="py-3.5 px-4 font-black text-emerald-950">
                        {item.plantName}
                      </td>

                      {/* Disease */}
                      <td className="py-3.5 px-4">
                        <span className={`font-bold ${isHealthy ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {item.diseaseName}
                        </span>
                      </td>

                      {/* Confidence */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {item.diseaseConfidence}%
                      </td>

                      {/* Severity % with Meter */}
                      <td className="py-3.5 px-4">
                        <div className="w-24">
                          <SeverityMeter
                            percentage={item.severityPercentage}
                            level={item.severityLevel}
                            size="sm"
                            showLabels={false}
                          />
                        </div>
                      </td>

                      {/* Level Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.severityLevel === 'HEALTHY' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                          item.severityLevel === 'MILD' ? 'bg-lime-100 text-lime-900 border border-lime-200' :
                          item.severityLevel === 'MODERATE' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                          item.severityLevel === 'SEVERE' ? 'bg-orange-100 text-orange-900 border border-orange-200' :
                          'bg-rose-100 text-rose-900 border border-rose-200'
                        }`}>
                          {item.severityLevel}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setInspectingItem(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white font-black text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5 transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          Inspect
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INDIVIDUAL LEAF INSPECTION MODAL */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900">
              <div>
                <h3 className="text-xl font-black flex items-center gap-2 tracking-tight">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  {inspectingItem.plantName} — {inspectingItem.diseaseName}
                </h3>
                <p className="text-xs text-emerald-200/80 mt-1 font-medium">
                  Sample: {inspectingItem.fileName} • Severity: {inspectingItem.severityPercentage}% ({inspectingItem.severityLevel})
                </p>
              </div>
              <button
                onClick={() => setInspectingItem(null)}
                className="p-2 rounded-2xl text-slate-300 hover:text-white hover:bg-emerald-900 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Visual Explainability */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-2">
                  Computer Vision Segmentation & Explainability
                </h4>
                <VisualAnalysisViewer
                  originalUrl={inspectingItem.originalImageUrl}
                  segmentationUrl={inspectingItem.segmentationImageUrl}
                  gradCamUrl={inspectingItem.gradCamImageUrl}
                  lesions={inspectingItem.lesions}
                  gradCamHotspots={inspectingItem.gradCamHotspots}
                  diseaseName={inspectingItem.diseaseName}
                />
              </div>

              {/* Mitigation Protocol */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-2">
                  Recommended Agronomic Mitigation
                </h4>
                <MitigationCard
                  mitigation={inspectingItem.recommendations}
                  diseaseName={inspectingItem.diseaseName}
                  plantName={inspectingItem.plantName}
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-emerald-50/50 border-t border-emerald-100 flex items-center justify-between">
              <button
                onClick={() => generateSingleDiagnosisPDF(inspectingItem)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-950 text-white font-black text-xs uppercase tracking-wider hover:bg-emerald-900 transition"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                Download Individual PDF
              </button>

              <button
                onClick={() => setInspectingItem(null)}
                className="px-6 py-2.5 rounded-2xl border border-emerald-200 text-emerald-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-100 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

