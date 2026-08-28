import React from 'react';
import { 
  Tractor, 
  UploadCloud, 
  BarChart3, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingDown, 
  Activity, 
  ArrowRight, 
  FileText, 
  Layers,
  Sparkles,
  Download
} from 'lucide-react';
import { BatchAnalysis } from '../../types';
import { exportBatchToCSV, generateBatchSummaryPDF } from '../../lib/pdfGenerator';
import { useLanguage } from '../../context/LanguageContext';
import { LiveWeatherWidget } from './LiveWeatherWidget';

interface FarmerDashboardProps {
  batches: BatchAnalysis[];
  onStartBulkUpload: () => void;
  onOpenBatch: (batch: BatchAnalysis) => void;
  onOpenAnalytics: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  batches,
  onStartBulkUpload,
  onOpenBatch,
  onOpenAnalytics
}) => {
  const { t, language } = useLanguage();

  // Aggregate stats across all batches
  const totalBatches = batches.length;
  const totalSamples = batches.reduce((acc, curr) => acc + curr.totalImages, 0);
  const totalDiseased = batches.reduce((acc, curr) => acc + curr.diseasedCount, 0);
  const totalHealthy = batches.reduce((acc, curr) => acc + curr.healthyCount, 0);

  const overallAvgSeverity = totalSamples > 0
    ? Math.round((batches.reduce((acc, curr) => acc + (curr.averageSeverity * curr.totalImages), 0) / totalSamples) * 10) / 10
    : 0;

  return (
    <div id="farmer-dashboard-view" className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in font-sans">
      
      {/* Title & Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-black uppercase tracking-widest text-amber-800">
              {t('grower_operations')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight mt-1 flex items-center gap-3">
            <Tractor className="w-8 h-8 text-amber-600" />
            {t('farmer_console')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            {t('farmer_console_desc')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="farmer-new-bulk-btn"
            onClick={onStartBulkUpload}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-900/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <UploadCloud className="w-4 h-4" />
            {t('new_bulk_ingestion')}
          </button>
        </div>
      </div>

      {/* ENTERPRISE KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Batches */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-800">{t('field_surveys')}</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-4xl font-black text-emerald-950">{totalBatches}</span>
          <span className="text-[11px] text-slate-500 font-semibold mt-1">{t('completed_bulk_runs')}</span>
        </div>

        {/* Total Samples */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800">{t('total_foliar_samples')}</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-4xl font-black text-emerald-950">{totalSamples}</span>
          <span className="text-[11px] text-slate-500 font-semibold mt-1">{t('across_field_plots')}</span>
        </div>

        {/* Healthy vs Infected Ratio */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-rose-800">{t('infection_rate')}</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-4xl font-black text-rose-600">
            {totalSamples > 0 ? `${Math.round((totalDiseased / totalSamples) * 100)}%` : '0%'}
          </span>
          <span className="text-[11px] text-slate-500 font-semibold mt-1">{totalDiseased} {t('diseases_found')} / {totalHealthy} {t('healthy_leaves')}</span>
        </div>

        {/* Aggregate Avg Severity */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-800">{t('mean_severity')}</span>
            <TrendingDown className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-4xl font-black text-amber-600">{overallAvgSeverity}%</span>
          <span className="text-[11px] text-slate-500 font-semibold mt-1">{t('canopy_foliar_loss')}</span>
        </div>

      </div>

      {/* LIVE MICROCLIMATE TELEMETRY WIDGET */}
      <div className="space-y-4">
        <LiveWeatherWidget lang={language} />
      </div>

      {/* ACTION BANNER: EXPLORE ANALYTICS */}
      <div className="bg-emerald-950 text-white p-8 rounded-3xl border border-emerald-900 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <span className="text-amber-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {t('epidemiology_charts')}
          </span>
          <h3 className="text-2xl font-black text-white tracking-tight">
            {t('visualize_disease_spread')}
          </h3>
          <p className="text-xs text-emerald-200/80 font-medium leading-relaxed">
            {t('multi_chart_desc')}
          </p>
        </div>

        <button
          id="dashboard-view-analytics-btn"
          onClick={onOpenAnalytics}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition shrink-0"
        >
          <BarChart3 className="w-4 h-4" />
          {t('open_epidemiology')}
        </button>
      </div>

      {/* BATCH SURVEY HISTORY LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-emerald-950 tracking-tight">{t('crop_survey_batches')}</h2>
            <p className="text-xs text-slate-500 font-medium">{t('historical_batches_desc')}</p>
          </div>
        </div>

        {batches.length === 0 ? (
          <div className="bg-white border border-emerald-100 rounded-3xl p-12 text-center text-slate-500 max-w-md mx-auto my-4 shadow-sm">
            <Tractor className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-emerald-950">{t('no_batches_ingested')}</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6 font-medium">
              {t('no_batches_desc')}
            </p>
            <button
              onClick={onStartBulkUpload}
              className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-md transition"
            >
              {t('upload_first_batch')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-slate-400 font-bold">
                      {new Date(batch.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      batch.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}>
                      {batch.status}
                    </span>
                  </div>

                  <h3 
                    onClick={() => onOpenBatch(batch)}
                    className="text-lg font-black text-emerald-950 hover:text-amber-700 cursor-pointer transition tracking-tight"
                  >
                    {batch.batchName}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    {t('dominant_pathogen')}: <span className="font-bold text-emerald-950">{batch.dominantDisease || 'Healthy Foliage'}</span>
                  </p>
                </div>

                {/* Batch metrics pill row */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100/80 text-center text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">{t('total_scans')}</span>
                    <span className="font-black text-emerald-950 text-sm">{batch.totalImages}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">{t('diseases_found')}</span>
                    <span className="font-black text-rose-600 text-sm">{batch.diseasedCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">{t('avg_severity')}</span>
                    <span className="font-black text-amber-600 text-sm">{batch.averageSeverity}%</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportBatchToCSV(batch)}
                      title="Export CSV"
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    </button>
                    <button
                      onClick={() => generateBatchSummaryPDF(batch)}
                      title="Download PDF Certificate"
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      <Download className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenBatch(batch)}
                    className="flex items-center gap-1 text-xs font-black text-amber-700 hover:text-amber-800 uppercase tracking-wider"
                  >
                    <span>{t('view_batch')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

