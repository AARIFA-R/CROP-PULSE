import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Droplets, 
  Wind, 
  Thermometer, 
  Compass, 
  RefreshCw, 
  CloudSun, 
  CloudFog, 
  MapPin,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { 
  LiveWeatherData, 
  PRESET_AGRICULTURAL_REGIONS, 
  AgriculturalRegion, 
  fetchLiveWeatherData 
} from '../../lib/weatherService';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguage } from '../../locales/translations';

interface LiveWeatherWidgetProps {
  lang?: SupportedLanguage;
  onRegionChange?: (region: AgriculturalRegion) => void;
}

export const LiveWeatherWidget: React.FC<LiveWeatherWidgetProps> = ({
  lang: propLang,
  onRegionChange
}) => {
  const { language: contextLang, t } = useLanguage();
  const activeLang = propLang || contextLang || 'en';

  const [regionList, setRegionList] = useState<AgriculturalRegion[]>(PRESET_AGRICULTURAL_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState<AgriculturalRegion>(PRESET_AGRICULTURAL_REGIONS[0]);
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsLockedCoords, setGpsLockedCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsErrorMessage, setGpsErrorMessage] = useState<string | null>(null);

  // Fetch weather data whenever selected region changes
  const loadWeather = async (region: AgriculturalRegion) => {
    setIsLoading(true);
    try {
      const data = await fetchLiveWeatherData(region.lat, region.lon, region.name);
      setWeatherData(data);
    } catch (err) {
      console.error('Weather load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedRegion);
    if (onRegionChange) {
      onRegionChange(selectedRegion);
    }
  }, [selectedRegion]);

  // Native GPS Location Handler
  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      const msg = 'Geolocation API is not supported by your browser environment.';
      console.error('GPS telemetry access blocked:', msg);
      setGpsErrorMessage(msg);
      return;
    }

    setGpsActive(true);
    setIsLoading(true);
    setGpsErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Device coordinates locked:", latitude, longitude);

        const customRegion: AgriculturalRegion = {
          id: 'user-gps-farm',
          name: `Current Field GPS (${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°)`,
          country: 'Local Telemetry',
          lat: latitude,
          lon: longitude,
          cropTypes: 'Field GPS Survey Plot'
        };

        setGpsLockedCoords({ lat: latitude, lon: longitude });

        // Update region list if not already present
        setRegionList(prev => {
          const filtered = prev.filter(r => r.id !== 'user-gps-farm');
          return [customRegion, ...filtered];
        });

        setSelectedRegion(customRegion);
        setGpsActive(false);
      },
      (error) => {
        console.error("GPS telemetry access blocked:", error.message);
        setGpsErrorMessage(`GPS access error: ${error.message}`);
        setGpsActive(false);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const toDisplayTemp = (celsius: number) => {
    if (tempUnit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius * 10) / 10;
  };

  return (
    <div id="microclimate-telemetry-card" className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-6 space-y-6 font-sans">
      
      {/* Header & Region Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-800">
              {t('microclimate_radar')}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight mt-0.5 flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-amber-500" />
            {selectedRegion.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {t('microclimate_desc')}
          </p>
        </div>

        {/* Region & GPS Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Region Dropdown */}
          <select
            id="microclimate-location-dropdown"
            value={selectedRegion.id}
            onChange={(e) => {
              const found = regionList.find(r => r.id === e.target.value);
              if (found) setSelectedRegion(found);
            }}
            className="px-3.5 py-2 text-xs font-bold rounded-2xl border border-emerald-200 bg-white text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          >
            {regionList.map(reg => (
              <option key={reg.id} value={reg.id}>
                {reg.id === 'user-gps-farm' ? `📍 ${reg.name}` : `${reg.name} - ${reg.country}`}
              </option>
            ))}
          </select>

          {/* MY GPS Button */}
          <button
            id="my-gps-btn"
            onClick={handleUseCurrentGPS}
            disabled={gpsActive}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm ${
              selectedRegion.id === 'user-gps-farm'
                ? 'bg-emerald-600 text-white shadow-emerald-900/20'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
            }`}
            title="Lock device native GPS coordinates"
          >
            <Compass className={`w-3.5 h-3.5 ${gpsActive ? 'animate-spin' : ''}`} />
            <span>{gpsActive ? 'Locating...' : t('my_gps')}</span>
          </button>

          {/* Refresh */}
          <button
            id="refresh-weather-btn"
            onClick={() => loadWeather(selectedRegion)}
            disabled={isLoading}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh Live Weather"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          {/* Unit Toggle */}
          <button
            onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
            className="px-2.5 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider transition"
          >
            °{tempUnit}
          </button>

        </div>
      </div>

      {/* GPS Success / Error banner */}
      {gpsLockedCoords && selectedRegion.id === 'user-gps-farm' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t('gps_tracking_active')}: {gpsLockedCoords.lat.toFixed(4)}°N, {gpsLockedCoords.lon.toFixed(4)}°E</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
            {t('gps_telemetry')}
          </span>
        </div>
      )}

      {gpsErrorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-2 text-xs text-rose-800 font-semibold">
          {gpsErrorMessage}
        </div>
      )}

      {/* Main Weather Telemetry Grid */}
      {weatherData && (
        <div className="space-y-6">
          
          {/* Fungal Incubation Alert Banner */}
          {weatherData.isHighFungalRisk && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-rose-800 bg-rose-200/70 px-2 py-0.5 rounded-full">
                    {t('pathogen_risk_alert')}
                  </span>
                  <span className="text-xs font-bold text-rose-950">
                    High Humidity Fungal Incubation Protocol Triggered
                  </span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed font-semibold">
                  {t('high_humidity_warning')}
                </p>
                <div className="text-[11px] font-bold text-rose-700 flex items-center gap-2 pt-1">
                  <span>Reason: {weatherData.fungalRiskReason}</span>
                </div>
              </div>
            </div>
          )}

          {/* Microclimate Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Temperature */}
            <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                  {t('temperature')}
                </span>
                <Thermometer className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-950">
                  {toDisplayTemp(weatherData.temperature)}°{tempUnit}
                </span>
                <span className="text-[11px] text-slate-500 font-bold">
                  Feels {toDisplayTemp(weatherData.feelsLike)}°
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block">
                Range: {toDisplayTemp(weatherData.dailyMinTemp)}° – {toDisplayTemp(weatherData.dailyMaxTemp)}°
              </span>
            </div>

            {/* 2. Humidity */}
            <div className={`p-4 rounded-3xl border space-y-1 ${
              weatherData.humidity >= 85 
                ? 'bg-rose-50 border-rose-200' 
                : weatherData.humidity >= 70 
                ? 'bg-amber-50 border-amber-200' 
                : 'bg-cyan-50/50 border-cyan-100'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  weatherData.humidity >= 85 ? 'text-rose-800' : 'text-cyan-800'
                }`}>
                  {t('humidity')}
                </span>
                <Droplets className={`w-4 h-4 ${weatherData.humidity >= 85 ? 'text-rose-600' : 'text-cyan-600'}`} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black ${
                  weatherData.humidity >= 85 ? 'text-rose-700' : 'text-cyan-950'
                }`}>
                  {weatherData.humidity}%
                </span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  weatherData.humidity >= 85 ? 'bg-rose-200 text-rose-800' : 'bg-cyan-100 text-cyan-800'
                }`}>
                  {weatherData.humidity >= 85 ? 'Critical Wet' : 'Optimal'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block">
                Threshold: &gt;85% triggers zoospore alert
              </span>
            </div>

            {/* 3. Wind Speed */}
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                  {t('wind_speed')}
                </span>
                <Wind className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {weatherData.windSpeed}
                </span>
                <span className="text-xs text-slate-500 font-bold">km/h</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block">
                Spore dispersal drift: {weatherData.windSpeed > 20 ? 'High' : 'Moderate'}
              </span>
            </div>

            {/* 4. Foliar Conditions */}
            <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                  Canopy Condition
                </span>
                <CloudFog className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm font-black text-emerald-950 block truncate">
                {weatherData.weatherDescription}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                Rain probability: {weatherData.maxPrecipProbability}%
              </span>
            </div>

          </div>

          {/* 48-Hour Microclimate & Precipitation Forecast Chart */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-600" />
                {t('precip_48h')}
              </h4>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  Precipitation (mm)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Humidity (%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Temperature (°C)
                </span>
              </div>
            </div>

            <div className="h-56 w-full bg-slate-50/70 rounded-3xl p-4 border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weatherData.hourlyForecast.slice(0, 24)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="formattedTime" tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 10]} hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#022c22', borderRadius: '16px', color: '#fff', fontSize: '12px', border: '1px solid #065f46' }}
                  />
                  <ReferenceLine yAxisId="left" y={85} stroke="#e11d48" strokeDasharray="3 3" label={{ value: '85% Fungal Inoculum Threshold', fill: '#e11d48', fontSize: 9, fontWeight: 800 }} />
                  <Bar yAxisId="right" dataKey="precipitation" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Rain (mm)" />
                  <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#f59e0b" strokeWidth={2} dot={false} name="Humidity %" />
                  <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#059669" strokeWidth={2} dot={false} name="Temp °C" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

