import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity, 
  TrendingUp, 
  Sprout, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  MapPin,
  CloudSun,
  Globe2,
  Filter,
  Layers,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { BatchAnalysis, DiagnosisResult } from '../../types';
import { LiveWeatherWidget } from './LiveWeatherWidget';
import { SpatialHotspotMap } from './SpatialHotspotMap';
import { SmartAdvisoryPanel } from './SmartAdvisoryPanel';
import { SupportedLanguage, SUPPORTED_LANGUAGES, t } from '../../lib/i18n';
import { AgriculturalRegion, PRESET_AGRICULTURAL_REGIONS } from '../../lib/weatherService';

interface FarmerAnalyticsProps {
  batches: BatchAnalysis[];
  userDiagnoses?: DiagnosisResult[];
  activeBatch?: BatchAnalysis | null;
  onSelectDiagnosis?: (item: DiagnosisResult) => void;
}

const SEVERITY_COLORS = {
  HEALTHY: '#059669',
  MILD: '#65a30d',
  MODERATE: '#d97706',
  SEVERE: '#ea580c',
  CRITICAL: '#e11d48'
};

const PALETTE = ['#059669', '#0284c7', '#d97706', '#db2777', '#7c3aed', '#0d9488', '#ea580c', '#16a34a'];

export const FarmerAnalytics: React.FC<FarmerAnalyticsProps> = ({
  batches,
  userDiagnoses = [],
  activeBatch,
  onSelectDiagnosis
}) => {
  const [selectedScope, setSelectedScope] = useState<string>(activeBatch ? activeBatch.id : 'ALL');
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [activeRegion, setActiveRegion] = useState<AgriculturalRegion>(PRESET_AGRICULTURAL_REGIONS[0]);

  // Aggregate all diagnoses according to the chosen dataset scope
  const allScopedDiagnoses: DiagnosisResult[] = useMemo(() => {
    if (selectedScope === 'ALL') {
      const batchItems = batches.flatMap(b => b.items || b.results || []);
      // deduplicate by id
      const map = new Map<string, DiagnosisResult>();
      [...batchItems, ...userDiagnoses].forEach(item => {
        if (item && item.id) map.set(item.id, item as DiagnosisResult);
      });
      return Array.from(map.values());
    } else if (selectedScope === 'USER_SCANS') {
      return userDiagnoses;
    } else {
      const targetBatch = batches.find(b => b.id === selectedScope || b.batchId === selectedScope);
      return (targetBatch?.items || targetBatch?.results || []) as DiagnosisResult[];
    }
  }, [batches, userDiagnoses, selectedScope]);

  // 1. DYNAMICALLY COMPUTED METRICS
  const totalSamples = allScopedDiagnoses.length;
  
  // Exact healthy (severity == 0% or <=10% or Healthy level)
  const strictlyZeroSeverity = allScopedDiagnoses.filter(d => d.severityPercentage === 0).length;
  const healthyCount = allScopedDiagnoses.filter(d => d.severityPercentage <= 10 || d.diseaseName.toLowerCase().includes('healthy')).length;
  const infectedCount = allScopedDiagnoses.filter(d => d.severityPercentage > 0 && !d.diseaseName.toLowerCase().includes('healthy')).length;
  
  // True statistical mean
  const avgSeverity = totalSamples > 0 
    ? Math.round((allScopedDiagnoses.reduce((acc, curr) => acc + (curr.severityPercentage || 0), 0) / totalSamples) * 10) / 10 
    : 0;

  // 2. DYNAMIC DISEASE DISTRIBUTION
  const diseaseMap: { [key: string]: number } = {};
  allScopedDiagnoses.forEach(d => {
    const dName = d.diseaseName || 'Unknown Pathogen';
    diseaseMap[dName] = (diseaseMap[dName] || 0) + 1;
  });

  const diseaseDistribution = useMemo(() => {
    return Object.entries(diseaseMap).map(([name, count]) => ({
      name,
      count,
      percentage: totalSamples > 0 ? Math.round((count / totalSamples) * 100) : 0
    })).sort((a, b) => b.count - a.count);
  }, [diseaseMap, totalSamples]);

  const dominantDisease = diseaseDistribution[0]?.name || 'Early Blight (Alternaria solani)';

  // 3. DYNAMIC SEVERITY CATEGORIZATION HISTOGRAM
  const severityDistribution = useMemo(() => {
    const counts = {
      HEALTHY: 0,
      MILD: 0,
      MODERATE: 0,
      SEVERE: 0,
      CRITICAL: 0
    };

    allScopedDiagnoses.forEach(d => {
      const p = d.severityPercentage;
      if (p <= 10) counts.HEALTHY++;
      else if (p <= 30) counts.MILD++;
      else if (p <= 60) counts.MODERATE++;
      else if (p <= 80) counts.SEVERE++;
      else counts.CRITICAL++;
    });

    return [
      { level: 'Healthy (0-10%)', count: counts.HEALTHY, key: 'HEALTHY', fill: SEVERITY_COLORS.HEALTHY },
      { level: 'Mild (11-30%)', count: counts.MILD, key: 'MILD', fill: SEVERITY_COLORS.MILD },
      { level: 'Moderate (31-60%)', count: counts.MODERATE, key: 'MODERATE', fill: SEVERITY_COLORS.MODERATE },
      { level: 'Severe (61-80%)', count: counts.SEVERE, key: 'SEVERE', fill: SEVERITY_COLORS.SEVERE },
      { level: 'Critical (81-100%)', count: counts.CRITICAL, key: 'CRITICAL', fill: SEVERITY_COLORS.CRITICAL },
    ];
  }, [allScopedDiagnoses]);

  // 4. PLANT SPECIES DISTRIBUTION
  const plantDistribution = useMemo(() => {
    const pMap: { [key: string]: number } = {};
    allScopedDiagnoses.forEach(d => {
      const pName = (d.plantName || 'Unknown Crop').split('(')[0].trim();
      pMap[pName] = (pMap[pName] || 0) + 1;
    });
    return Object.entries(pMap).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);
  }, [allScopedDiagnoses]);

  // 5. MEAN SEVERITY BY PATHOLOGY
  const avgSeverityByDisease = useMemo(() => {
    const sums: { [key: string]: { sum: number; count: number } } = {};
    allScopedDiagnoses.forEach(d => {
      const dName = d.diseaseName || 'General Foliage';
      if (!sums[dName]) sums[dName] = { sum: 0, count: 0 };
      sums[dName].sum += d.severityPercentage;
      sums[dName].count += 1;
    });

    return Object.entries(sums).map(([name, val]) => ({
      name,
      avgSeverity: Math.round((val.sum / val.count) * 10) / 10
    })).sort((a, b) => b.avgSeverity - a.avgSeverity);
  }, [allScopedDiagnoses]);

  return (
    <div id="farmer-analytics-view" className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in font-sans">
      
      {/* Top Header & Scope Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
              CropPulse Telemetry & Surveillance
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-emerald-950 tracking-tight mt-1 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-emerald-600 shrink-0" />
            {t('dashboard_title', lang)}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium max-w-3xl">
            {t('dashboard_subtitle', lang)}
          </p>
        </div>

        {/* Global Dataset Scope & Language Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Dataset Scope Dropdown */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl border border-emerald-200 shadow-xs">
            <FolderOpen className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="text-xs font-bold bg-transparent text-emerald-950 focus:outline-none cursor-pointer pr-2"
            >
              <option value="ALL">All Consolidated Records ({batches.flatMap(b=>b.items||[]).length + userDiagnoses.length} items)</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  Batch: {b.batchName || b.id} ({(b.items || []).length} items)
                </option>
              ))}
              <option value="USER_SCANS">Single-Leaf Scans ({userDiagnoses.length} items)</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-300 shadow-xs">
            <Globe2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="text-xs font-black bg-transparent text-emerald-950 focus:outline-none cursor-pointer pr-1"
            >
              {SUPPORTED_LANGUAGES.map(item => (
                <option key={item.code} value={item.code}>
                  {item.flag} {item.nativeName}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* 1. DYNAMIC TOP KPI TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Foliar Samples */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block mb-1">
            {t('total_samples', lang)}
          </span>
          <span className="text-3xl font-black text-emerald-950">{totalSamples}</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1">
            Live Database Scans
          </span>
        </div>

        {/* Healthy Samples */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block mb-1">
            {t('healthy_samples', lang)}
          </span>
          <span className="text-3xl font-black text-emerald-600">{healthyCount}</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1">
            {totalSamples > 0 ? `${Math.round((healthyCount / totalSamples) * 100)}% (${strictlyZeroSeverity} at 0%)` : '0%'}
          </span>
        </div>

        {/* Infected Samples */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition">
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-800 block mb-1">
            {t('infected_samples', lang)}
          </span>
          <span className="text-3xl font-black text-rose-600">{infectedCount}</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1">
            {totalSamples > 0 ? `${Math.round((infectedCount / totalSamples) * 100)}% infection rate` : '0%'}
          </span>
        </div>

        {/* Average Severity */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 block mb-1">
            {t('average_severity', lang)}
          </span>
          <span className="text-3xl font-black text-amber-600">{avgSeverity}%</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1">
            Statistical Mean Score
          </span>
        </div>

        {/* Dominant Pathogen */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm col-span-2 lg:col-span-1 hover:border-emerald-300 transition">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block mb-1">
            {t('dominant_pathogen', lang)}
          </span>
          <span className="text-base font-black text-emerald-950 truncate block mt-1">
            {dominantDisease}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1">
            Primary Agronomic Target
          </span>
        </div>

      </div>

      {/* 2. REAL-TIME MICROCLIMATE WEATHER & 48-HOUR FORECAST */}
      <LiveWeatherWidget
        lang={lang}
        onRegionChange={(reg) => setActiveRegion(reg)}
      />

      {/* 3. SPATIAL HOTSPOT & CANOPY GPS MAPPING */}
      <SpatialHotspotMap
        diagnoses={allScopedDiagnoses}
        centerLat={activeRegion.lat}
        centerLon={activeRegion.lon}
        regionName={activeRegion.name}
        lang={lang}
        onSelectSample={onSelectDiagnosis}
      />

      {/* 4. DYNAMIC ANALYTICS CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Disease Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-emerald-950 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              {t('disease_distribution', lang)}
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Live Frequency</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseDistribution.slice(0, 6)} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ecfdf5" />
                <XAxis type="number" unit="%" domain={[0, 100]} tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11, fontWeight: 700 }} />
                <Tooltip 
                  formatter={(val: any) => [`${val}%`, 'Frequency']}
                  contentStyle={{ backgroundColor: '#022c22', borderRadius: '16px', color: '#fff', fontSize: '12px', border: '1px solid #065f46' }}
                />
                <Bar dataKey="percentage" fill="#059669" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Severity Level Histogram */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-emerald-950 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              {t('severity_breakdown', lang)}
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Continuous Bins</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecfdf5" />
                <XAxis dataKey="level" tick={{ fontSize: 10, fontWeight: 700 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fontWeight: 700 }} />
                <Tooltip 
                  formatter={(val: any) => [`${val} samples`, 'Count']}
                  contentStyle={{ backgroundColor: '#022c22', borderRadius: '16px', color: '#fff', fontSize: '12px', border: '1px solid #065f46' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Plant Species Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-emerald-950 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-teal-600" />
              {t('species_breakdown', lang)}
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Crop Diversity</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={plantDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {plantDistribution.map((entry, index) => (
                    <Cell key={`plant-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`${val} leaves`, 'Count']}
                  contentStyle={{ backgroundColor: '#022c22', borderRadius: '16px', color: '#fff', fontSize: '12px', border: '1px solid #065f46' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Mean Severity by Pathogen */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-emerald-950 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              {t('pathogen_severity', lang)}
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Mean Lesion Impact</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgSeverityByDisease.slice(0, 6)} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecfdf5" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fontWeight: 700 }} />
                <Tooltip 
                  formatter={(val: any) => [`${val}%`, 'Mean Severity']}
                  contentStyle={{ backgroundColor: '#022c22', borderRadius: '16px', color: '#fff', fontSize: '12px', border: '1px solid #065f46' }}
                />
                <Bar dataKey="avgSeverity" fill="#e11d48" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 5. MULTILINGUAL SMART AGRONOMIC ADVISORY */}
      <SmartAdvisoryPanel
        dominantDisease={dominantDisease}
        diagnoses={allScopedDiagnoses}
        lang={lang}
        onLanguageChange={(newLang) => setLang(newLang)}
      />

    </div>
  );
};
