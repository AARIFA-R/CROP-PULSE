import React, { useState, useMemo, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Sprout, 
  AlertCircle, 
  Calendar, 
  ArrowUpDown,
  Sparkles,
  LayoutGrid,
  List,
  Eye,
  X,
  CheckCircle2,
  MapPin,
  Globe,
  Settings,
  User,
  Tractor,
  CloudSun,
  ChevronDown,
  ChevronUp,
  Flame,
  Droplets,
  Thermometer,
  Wind
} from 'lucide-react';
import { DiagnosisResult, UserRole } from '../../types';
import { SeverityMeter } from '../Shared/SeverityMeter';
import { generateSingleDiagnosisPDF } from '../../lib/pdfGenerator';
import { VisualAnalysisViewer } from '../Shared/VisualAnalysisViewer';
import { SupportedLanguage, SUPPORTED_LANGUAGES, t } from '../../lib/i18n';
import { PRESET_AGRICULTURAL_REGIONS, AgriculturalRegion } from '../../lib/weatherService';
import { LiveWeatherWidget } from '../Farmer/LiveWeatherWidget';
import { SpatialHotspotMap } from '../Farmer/SpatialHotspotMap';

export interface DiagnosisHistoryProps {
  diagnoses: DiagnosisResult[];
  onSelectDiagnosis: (diagnosis: DiagnosisResult) => void;
  onDeleteDiagnosis: (id: string) => void;
  onNewScan: () => void;
  userRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  initialLanguage?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export const DiagnosisHistory: React.FC<DiagnosisHistoryProps> = ({
  diagnoses,
  onSelectDiagnosis,
  onDeleteDiagnosis,
  onNewScan,
  userRole = 'USER',
  onRoleChange,
  initialLanguage = 'en',
  onLanguageChange
}) => {
  const [lang, setLang] = useState<SupportedLanguage>(initialLanguage);
  const [activeRole, setActiveRole] = useState<UserRole>(userRole);
  const isFarmer = activeRole === 'FARMER';

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest-severity' | 'lowest-severity'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [quickInspectItem, setQuickInspectItem] = useState<DiagnosisResult | null>(null);

  // Weather Telemetry Banner & Settings Accordion state
  const [showTelemetryBanner, setShowTelemetryBanner] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<AgriculturalRegion>(PRESET_AGRICULTURAL_REGIONS[0]);

  // Synchronize internal role state if external prop changes
  useEffect(() => {
    if (userRole) setActiveRole(userRole);
  }, [userRole]);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLang(newLang);
    if (onLanguageChange) onLanguageChange(newLang);
  };

  const handleRoleToggle = () => {
    const nextRole: UserRole = isFarmer ? 'USER' : 'FARMER';
    setActiveRole(nextRole);
    if (onRoleChange) onRoleChange(nextRole);
  };

  // Dynamic real-time computed severity counters tied directly to database array
  const counts = useMemo(() => {
    return {
      all: diagnoses.length,
      healthy: diagnoses.filter(d => 
        d.severityPercentage === 0 || 
        d.severityLevel?.toLowerCase() === 'healthy' || 
        d.severityPercentage <= 10
      ).length,
      mild: diagnoses.filter(d => 
        (d.severityPercentage > 10 && d.severityPercentage <= 30) || 
        d.severityLevel?.toLowerCase() === 'mild'
      ).length,
      moderate: diagnoses.filter(d => 
        (d.severityPercentage > 30 && d.severityPercentage <= 60) || 
        d.severityLevel?.toLowerCase() === 'moderate'
      ).length,
      severe: diagnoses.filter(d => 
        (d.severityPercentage > 60 && d.severityPercentage <= 80) || 
        d.severityLevel?.toLowerCase() === 'severe'
      ).length,
      critical: diagnoses.filter(d => 
        d.severityPercentage > 80 || 
        d.severityLevel?.toLowerCase() === 'critical'
      ).length,
    };
  }, [diagnoses]);

  // Memoized filter logic
  const filtered = useMemo(() => {
    return diagnoses.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        item.plantName.toLowerCase().includes(q) ||
        item.diseaseName.toLowerCase().includes(q) ||
        (item.fileName || '').toLowerCase().includes(q) ||
        (item.symptoms || '').toLowerCase().includes(q);

      let matchesSeverity = true;
      if (severityFilter === 'HEALTHY') {
        matchesSeverity = item.severityPercentage <= 10 || item.severityLevel?.toLowerCase() === 'healthy' || item.diseaseName?.toLowerCase().includes('healthy');
      } else if (severityFilter === 'MILD') {
        matchesSeverity = (item.severityPercentage > 10 && item.severityPercentage <= 30) || item.severityLevel?.toLowerCase() === 'mild';
      } else if (severityFilter === 'MODERATE') {
        matchesSeverity = (item.severityPercentage > 30 && item.severityPercentage <= 60) || item.severityLevel?.toLowerCase() === 'moderate';
      } else if (severityFilter === 'SEVERE') {
        matchesSeverity = (item.severityPercentage > 60 && item.severityPercentage <= 80) || item.severityLevel?.toLowerCase() === 'severe';
      } else if (severityFilter === 'CRITICAL') {
        matchesSeverity = item.severityPercentage > 80 || item.severityLevel?.toLowerCase() === 'critical';
      }

      return matchesSearch && matchesSeverity;
    });
  }, [diagnoses, searchQuery, severityFilter]);

  // Memoized sort logic
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sortOrder === 'oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      if (sortOrder === 'highest-severity') return b.severityPercentage - a.severityPercentage;
      if (sortOrder === 'lowest-severity') return a.severityPercentage - b.severityPercentage;
      return 0;
    });
  }, [filtered, sortOrder]);

  return (
    <div id="diagnosis-history-view" className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in font-sans">
      
      {/* Top Header & Global Control Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-emerald-600 shrink-0" />
            {t(isFarmer ? 'history_title_farmer' : 'history_title_grower', lang)}
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1 max-w-2xl">
            {t(isFarmer ? 'history_subtitle_farmer' : 'history_subtitle_grower', lang)}
          </p>
        </div>

        {/* Global Control Panel: Multilingual, Mode Sync, Telemetry, New Scan */}
        <div id="dashboard-settings-panel" className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          
          {/* Dropdown Language Selector */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-emerald-200 shadow-sm text-emerald-950 text-xs font-bold hover:bg-emerald-50 transition cursor-pointer">
              <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
              <select
                id="language-advisory-select"
                aria-label={t('lang_advisory', lang)}
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-bold text-emerald-950 focus:outline-none cursor-pointer pr-1"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName} ({l.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Persona / Mode Switcher Toggle */}
          <button
            id="history-mode-switch-btn"
            onClick={handleRoleToggle}
            title="Switch between Grower and Farmer Mode"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider border transition shadow-sm ${
              isFarmer 
                ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600' 
                : 'bg-emerald-100 text-emerald-950 border-emerald-200 hover:bg-emerald-200'
            }`}
          >
            {isFarmer ? (
              <>
                <Tractor className="w-3.5 h-3.5" />
                <span>{t('farmer_mode', lang)}</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>{t('grower_mode', lang)}</span>
              </>
            )}
          </button>

          {/* Toggle Microclimate Weather Telemetry */}
          <button
            id="toggle-weather-telemetry-btn"
            onClick={() => setShowTelemetryBanner(prev => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider border transition shadow-sm ${
              showTelemetryBanner 
                ? 'bg-emerald-900 text-white border-emerald-900' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CloudSun className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">{t('weather_title', lang).split('&')[0]}</span>
            <span className="sm:hidden">Radar</span>
            {showTelemetryBanner ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* Scan New Leaf CTA */}
          <button
            id="history-scan-new-leaf-btn"
            onClick={onNewScan}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-900/15 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('scan_new_leaf', lang)}</span>
          </button>
        </div>
      </div>

      {/* Microclimate Telemetry Banner (Collapsible) */}
      {showTelemetryBanner && (
        <div className="bg-emerald-950 text-white rounded-3xl p-5 border border-emerald-800 shadow-lg space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-800 text-emerald-300">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black tracking-tight text-white">
                  {t('weather_title', lang)}
                </h4>
                <p className="text-[11px] text-emerald-300 font-medium">
                  {selectedRegion.name} • {selectedRegion.country}
                </p>
              </div>
            </div>

            {/* Region Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Region:
              </span>
              <select
                value={selectedRegion.id}
                onChange={(e) => {
                  const reg = PRESET_AGRICULTURAL_REGIONS.find(r => r.id === e.target.value);
                  if (reg) setSelectedRegion(reg);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-900 border border-emerald-700 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {PRESET_AGRICULTURAL_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.country})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Embedded Live Weather Radar Component */}
          <LiveWeatherWidget
            lang={lang}
            onRegionChange={(reg) => setSelectedRegion(reg)}
          />
        </div>
      )}

      {/* Filter and Search Bar with 3-Way Layout Switcher (Grid / List / Hotspot Map) */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="history-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder', lang)}
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <ArrowUpDown className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              id="history-sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full md:w-auto px-3.5 py-2 text-xs font-bold rounded-2xl border border-emerald-200 bg-white text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">{t('sort_newest', lang)}</option>
              <option value="oldest">{t('sort_oldest', lang)}</option>
              <option value="highest-severity">{t('sort_highest', lang)}</option>
              <option value="lowest-severity">{t('sort_lowest', lang)}</option>
            </select>
          </div>

          {/* 3-WAY LAYOUT SWITCHER: Grid / List / Hotspot Map View */}
          <div id="history-view-mode-selector" className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-end md:self-auto shrink-0">
            <button
              id="view-mode-grid-btn"
              onClick={() => setViewMode('grid')}
              title={t('view_grid', lang)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'grid' 
                  ? 'bg-white text-emerald-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('view_grid', lang).split(' ')[0]}</span>
            </button>

            <button
              id="view-mode-list-btn"
              onClick={() => setViewMode('list')}
              title={t('view_list', lang)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'list' 
                  ? 'bg-white text-emerald-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('view_list', lang).split(' ')[0]}</span>
            </button>

            <button
              id="view-mode-map-btn"
              onClick={() => setViewMode('map')}
              title={t('view_map', lang)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition ${
                viewMode === 'map' 
                  ? 'bg-emerald-900 text-white shadow-sm' 
                  : 'text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('view_map', lang).split(' ')[0]} Map</span>
            </button>
          </div>
        </div>

        {/* Dynamic Severity Filter Chips with Live .filter().length Counters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> {t('filter_severity', lang)}:
          </span>
          {[
            { key: 'ALL', label: t('pill_all_scans', lang), count: counts.all },
            { key: 'HEALTHY', label: t('pill_healthy', lang), count: counts.healthy },
            { key: 'MILD', label: t('pill_mild', lang), count: counts.mild },
            { key: 'MODERATE', label: t('pill_moderate', lang), count: counts.moderate },
            { key: 'SEVERE', label: t('pill_severe', lang), count: counts.severe },
            { key: 'CRITICAL', label: t('pill_critical', lang), count: counts.critical }
          ].map(chip => (
            <button
              key={chip.key}
              id={`filter-pill-${chip.key.toLowerCase()}`}
              onClick={() => setSeverityFilter(chip.key)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                severityFilter === chip.key
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-100'
              }`}
            >
              <span>{chip.label}</span>
              <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                severityFilter === chip.key ? 'bg-emerald-700 text-white' : 'bg-emerald-200 text-emerald-950'
              }`}>
                ({chip.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Results View */}
      {viewMode === 'map' ? (
        /* 1. HOTSPOT MAP VIEW */
        <div className="bg-white rounded-3xl border border-emerald-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-black text-emerald-950">
                {t('spatial_map_title', lang)}
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {sorted.length} {t('total_samples', lang).toLowerCase()}
            </span>
          </div>

          <SpatialHotspotMap
            diagnoses={sorted}
            centerLat={selectedRegion.lat}
            centerLon={selectedRegion.lon}
            regionName={selectedRegion.name}
            lang={lang}
            onSelectSample={(sample) => {
              onSelectDiagnosis(sample);
            }}
          />
        </div>
      ) : sorted.length === 0 ? (
        /* EMPTY STATE VIEW */
        <div id="history-empty-state" className="bg-white rounded-3xl border border-emerald-100 p-12 text-center text-slate-500 max-w-md mx-auto my-8 shadow-sm">
          <Sprout className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-black text-emerald-950">
            {t('no_diagnoses_found', lang)}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 mb-6 leading-relaxed">
            {diagnoses.length === 0
              ? t('no_diagnoses_empty_db', lang)
              : t('no_diagnoses_filtered', lang)}
          </p>
          <button
            onClick={onNewScan}
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider shadow-md hover:bg-emerald-500 transition"
          >
            {t('scan_a_leaf_now', lang)}
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* 2. GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((item) => (
            <div
              key={item.id}
              id={`diagnosis-card-${item.id}`}
              className="bg-white rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col group"
            >
              {/* Thumbnail / Visual Stage */}
              <div 
                onClick={() => setQuickInspectItem(item)}
                className="relative h-48 bg-emerald-950 cursor-pointer overflow-hidden flex items-center justify-center"
              >
                <img
                  src={item.segmentationImageUrl || item.originalImageUrl}
                  alt={item.diseaseName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Severity pill overlay */}
                <div className={`absolute top-3 left-3 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${
                  item.severityLevel === 'Healthy' 
                    ? 'bg-emerald-900/90 border-emerald-700' 
                    : item.severityPercentage > 60 
                    ? 'bg-rose-900/90 border-rose-700' 
                    : 'bg-amber-900/90 border-amber-700'
                }`}>
                  {item.severityLevel} • {item.severityPercentage}%
                </div>

                <div className="absolute bottom-3 right-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition shadow-md">
                  <Eye className="w-3.5 h-3.5" />
                  {t('quick_view', lang)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <span className="font-mono text-emerald-800">
                      {item.plantConfidence}% match
                    </span>
                  </div>

                  <h3 
                    onClick={() => setQuickInspectItem(item)}
                    className="text-lg font-black text-emerald-950 group-hover:text-emerald-700 transition cursor-pointer tracking-tight truncate"
                  >
                    {item.plantName}
                  </h3>

                  <p className="text-xs font-bold text-rose-700 mt-0.5 truncate">
                    {item.diseaseName}
                  </p>
                </div>

                {/* Mini Severity Meter */}
                <SeverityMeter
                  percentage={item.severityPercentage}
                  level={item.severityLevel}
                  size="sm"
                  showLabels={false}
                />

                {/* Actions Footer */}
                <div className="pt-3 border-t border-emerald-50 flex items-center justify-between">
                  <button
                    onClick={() => generateSingleDiagnosisPDF(item)}
                    title={t('pdf_report', lang)}
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-600 hover:text-emerald-950 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700" />
                    {t('pdf_report', lang)}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectDiagnosis(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-black text-[11px] uppercase tracking-wider transition"
                    >
                      {t('full_details', lang)}
                    </button>

                    <button
                      onClick={() => onDeleteDiagnosis(item.id)}
                      title="Delete Record"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      ) : (
        /* 3. LIST VIEW */
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm divide-y divide-emerald-50 overflow-hidden">
          {sorted.map((item) => (
            <div
              key={item.id}
              id={`diagnosis-row-${item.id}`}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-emerald-50/30 transition"
            >
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => setQuickInspectItem(item)}
                  className="w-16 h-16 rounded-2xl bg-emerald-950 overflow-hidden shrink-0 cursor-pointer shadow-sm relative group"
                >
                  <img
                    src={item.segmentationImageUrl || item.originalImageUrl}
                    alt={item.diseaseName}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-black text-emerald-950">
                      {item.plantName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {item.plantConfidence}% match
                    </span>
                  </div>
                  <p className="text-xs font-bold text-rose-700">
                    {item.diseaseName}
                  </p>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <div className="w-32">
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                    <span className="text-slate-500">{t('filter_severity', lang)}</span>
                    <span className="text-emerald-900">{item.severityPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        item.severityPercentage > 60 ? 'bg-rose-500' : item.severityPercentage > 25 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.severityPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generateSingleDiagnosisPDF(item)}
                    title={t('pdf_report', lang)}
                    className="p-2 rounded-xl text-slate-500 hover:text-emerald-950 hover:bg-emerald-50 transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectDiagnosis(item)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition shadow-sm"
                  >
                    {t('full_details', lang)}
                  </button>

                  <button
                    onClick={() => onDeleteDiagnosis(item.id)}
                    title="Delete Scan"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Inspect Drawer / Modal */}
      {quickInspectItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div>
                <h3 className="text-lg font-black text-emerald-950">
                  {quickInspectItem.plantName}
                </h3>
                <p className="text-xs font-bold text-rose-700">
                  {quickInspectItem.diseaseName}
                </p>
              </div>

              <button
                onClick={() => setQuickInspectItem(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Visual Viewer */}
              <VisualAnalysisViewer
                originalUrl={quickInspectItem.originalImageUrl}
                segmentationUrl={quickInspectItem.segmentationImageUrl}
                gradCamUrl={quickInspectItem.gradCamImageUrl}
                lesions={quickInspectItem.lesions}
                diseaseName={quickInspectItem.diseaseName}
              />

              {/* Severity Gauge */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                  {t('average_severity', lang)}: {quickInspectItem.severityPercentage}%
                </span>
                <SeverityMeter
                  percentage={quickInspectItem.severityPercentage}
                  level={quickInspectItem.severityLevel}
                  size="md"
                  showLabels={true}
                />
              </div>

              {/* Symptoms & Mitigations */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 mb-2">
                  Pathology Symptoms & Causes
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
                  {quickInspectItem.symptoms || quickInspectItem.causes || 'Pathogen leaf spot lesions with chlorotic yellow halo margins.'}
                </p>
              </div>

              {quickInspectItem.recommendations && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                    Immediate Remediation Steps
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                    {quickInspectItem.recommendations.immediate?.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
              <button
                onClick={() => generateSingleDiagnosisPDF(quickInspectItem)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition shadow-sm"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                {t('pdf_report', lang)}
              </button>

              <button
                onClick={() => {
                  const item = quickInspectItem;
                  setQuickInspectItem(null);
                  onSelectDiagnosis(item);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-md transition"
              >
                {t('full_details', lang)}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};


