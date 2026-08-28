import React from 'react';
import { 
  Camera, 
  Upload, 
  Activity, 
  Heart, 
  AlertTriangle, 
  TrendingDown, 
  History, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Sprout 
} from 'lucide-react';
import { DiagnosisResult } from '../../types';
import { SeverityMeter } from '../Shared/SeverityMeter';
import { LiveWeatherWidget } from '../Farmer/LiveWeatherWidget';
import { useLanguage } from '../../context/LanguageContext';

interface UserDashboardProps {
  diagnoses: DiagnosisResult[];
  onStartCamera: () => void;
  onStartUpload: () => void;
  onViewAllHistory: () => void;
  onSelectDiagnosis: (diag: DiagnosisResult) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  diagnoses,
  onStartCamera,
  onStartUpload,
  onViewAllHistory,
  onSelectDiagnosis
}) => {
  const { t, language } = useLanguage();

  // Aggregate stats
  const totalScans = diagnoses.length;
  const healthyCount = diagnoses.filter(d => d.severityPercentage <= 10 || d.diseaseName.toLowerCase().includes('healthy')).length;
  const diseasedCount = totalScans - healthyCount;
  const avgSeverity = totalScans > 0 
    ? Math.round((diagnoses.reduce((acc, curr) => acc + curr.severityPercentage, 0) / totalScans) * 10) / 10 
    : 0;

  const recentDiagnoses = diagnoses.slice(0, 4);

  return (
    <div id="user-dashboard-view" className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in font-sans">
      
      {/* Title & Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
              {t('personal_diagnostics')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight mt-1">
            {t('plant_health_console')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            {t('plant_health_desc')}
          </p>
        </div>
      </div>

      {/* QUICK SCAN ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Large Action Card 1: Take Photo */}
        <div
          id="quick-scan-camera-card"
          onClick={onStartCamera}
          className="group relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white p-8 rounded-3xl shadow-xl shadow-emerald-900/15 hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between min-h-[210px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
              <Camera className="w-7 h-7" />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider text-emerald-200">
              {t('real_time_lens')}
            </span>
          </div>

          <div className="my-3">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
              {t('take_leaf_photo')}
            </h3>
            <p className="text-xs text-emerald-100 max-w-sm font-medium leading-relaxed">
              {t('camera_desc')}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-200 group-hover:text-white transition">
            <span>{t('launch_scanner')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Large Action Card 2: Upload Leaf Image */}
        <div
          id="quick-scan-upload-card"
          onClick={onStartUpload}
          className="group relative overflow-hidden bg-emerald-950 text-white p-8 rounded-3xl border border-emerald-900 shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between min-h-[210px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-emerald-900 text-emerald-400 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-800 text-[10px] font-black uppercase tracking-wider text-emerald-300">
              {t('high_resolution')}
            </span>
          </div>

          <div className="my-3">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
              {t('upload_leaf_image')}
            </h3>
            <p className="text-xs text-emerald-200/80 max-w-sm font-medium leading-relaxed">
              {t('upload_desc')}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400 group-hover:text-emerald-300 transition">
            <span>{t('select_leaf_image')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* HEALTH SUMMARY STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Scans */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800">{t('total_scans')}</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-4xl font-black text-emerald-950">{totalScans}</span>
          <span className="text-[11px] text-slate-500 font-semibold mt-1">{t('leaves_analyzed')}</span>
        </div>

        {/* Healthy Plants */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800">{t('healthy_leaves')}</span>
            <Heart className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-4xl font-black text-emerald-600">{healthyCount}</span>
          <span className="text-[11px] text-slate-500 font-semibold mt-1">
            {totalScans > 0 ? `${Math.round((healthyCount / totalScans) * 100)}% of total` : t('zero_pathology')}
          </span>
        </div>

        {/* Diseased Plants */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-rose-800">{t('diseases_found')}</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-4xl font-black text-rose-600">{diseasedCount}</span>
          <span className="text-[11px] text-slate-500 font-semibold mt-1">{t('mitigations_prescribed')}</span>
        </div>

        {/* Average Severity */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-800">{t('avg_severity')}</span>
            <TrendingDown className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-4xl font-black text-emerald-950">{avgSeverity}%</span>
          <span className="text-[11px] text-slate-500 font-semibold mt-1">{t('foliar_infection_index')}</span>
        </div>

      </div>

      {/* LIVE MICROCLIMATE & NATIVE GPS TELEMETRY WIDGET */}
      <div className="space-y-4">
        <LiveWeatherWidget lang={language} />
      </div>

      {/* RECENT DIAGNOSES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-emerald-950 tracking-tight">{t('recent_diagnoses')}</h2>
            <p className="text-xs text-slate-500 font-medium">{t('recent_diagnoses_desc')}</p>
          </div>

          {diagnoses.length > 0 && (
            <button
              id="view-all-diagnoses-btn"
              onClick={onViewAllHistory}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition shadow-sm"
            >
              <History className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('view_all')} ({diagnoses.length})</span>
            </button>
          )}
        </div>

        {recentDiagnoses.length === 0 ? (
          <div className="bg-white border border-emerald-100 rounded-3xl p-10 text-center text-slate-500 shadow-sm">
            <Sprout className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
            <p className="text-base font-black text-emerald-950">{t('no_scans_yet')}</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
              {t('no_scans_desc')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentDiagnoses.map((diag) => (
              <div
                key={diag.id}
                onClick={() => onSelectDiagnosis(diag)}
                className="bg-white rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer flex flex-col group"
              >
                <div className="relative h-40 bg-emerald-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={diag.segmentationImageUrl || diag.originalImageUrl}
                    alt={diag.diseaseName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-950/90 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-800">
                    {diag.severityPercentage}% {t('avg_severity')}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-black text-emerald-950 group-hover:text-emerald-700 transition truncate">
                      {diag.plantName}
                    </h4>
                    <p className="text-xs font-bold text-rose-700 mt-0.5 truncate">
                      {diag.diseaseName}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>{new Date(diag.timestamp).toLocaleDateString()}</span>
                    <span className="font-black text-emerald-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      {t('inspect')} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

