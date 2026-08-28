import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Layers, 
  Flame, 
  Eye, 
  Compass, 
  ShieldAlert, 
  Maximize2, 
  Filter, 
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DiagnosisResult, SeverityLevel } from '../../types';
import { SupportedLanguage, t } from '../../lib/i18n';

interface SpatialHotspotMapProps {
  diagnoses: DiagnosisResult[];
  centerLat?: number;
  centerLon?: number;
  regionName?: string;
  lang?: SupportedLanguage;
  onSelectSample?: (item: DiagnosisResult) => void;
}

export interface MapSamplePoint {
  id: string;
  sample: DiagnosisResult;
  lat: number;
  lon: number;
  sectorName: string;
  severityPercentage: number;
  severityLevel: string;
  diseaseName: string;
  plantName: string;
  imageUrl: string;
}

export const SpatialHotspotMap: React.FC<SpatialHotspotMapProps> = ({
  diagnoses,
  centerLat = 36.6777,
  centerLon = -121.6555,
  regionName = 'Salinas Valley Sector 4 Field',
  lang = 'en',
  onSelectSample
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const hotspotLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const sectorsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [showHotspots, setShowHotspots] = useState(true);
  const [showSectors, setShowSectors] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HEALTHY' | 'INFECTED' | 'SEVERE'>('ALL');
  const [selectedPoint, setSelectedPoint] = useState<MapSamplePoint | null>(null);

  // Generate or extract spatial coordinates for all diagnoses around the survey area
  const samplePoints: MapSamplePoint[] = useMemo(() => {
    return diagnoses.map((item, idx) => {
      // Deterministic spatial offset based on hash/index around the center
      const angle = (idx * 137.5) * (Math.PI / 180); // golden angle distribution
      const radius = 0.003 + (idx % 6) * 0.0022; // ~300m to 1.5km spread
      const latOffset = Math.sin(angle) * radius;
      const lonOffset = Math.cos(angle) * radius * 1.25;

      const sectors = ['Sector A (North Quadrant)', 'Sector B (East Drip Block)', 'Sector C (South Furrow)', 'Sector D (West Buffer)'];
      const sectorName = sectors[idx % sectors.length];

      return {
        id: item.id || `point-${idx}`,
        sample: item,
        lat: centerLat + latOffset,
        lon: centerLon + lonOffset,
        sectorName,
        severityPercentage: item.severityPercentage,
        severityLevel: item.severityLevel,
        diseaseName: item.diseaseName,
        plantName: item.plantName,
        imageUrl: item.segmentationImageUrl || item.originalImageUrl
      };
    });
  }, [diagnoses, centerLat, centerLon]);

  // Filter sample points
  const filteredPoints = useMemo(() => {
    return samplePoints.filter(p => {
      if (activeFilter === 'HEALTHY') return p.severityPercentage <= 10 || p.diseaseName.toLowerCase().includes('healthy');
      if (activeFilter === 'INFECTED') return p.severityPercentage > 10;
      if (activeFilter === 'SEVERE') return p.severityPercentage > 60;
      return true;
    });
  }, [samplePoints, activeFilter]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Avoid duplicate initialization
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLon],
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      // High-precision clean cartographic tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add compact zoom control
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Layer groups
      const markersLayer = L.layerGroup().addTo(map);
      const hotspotLayer = L.layerGroup().addTo(map);
      const sectorsLayer = L.layerGroup().addTo(map);

      markersLayerGroupRef.current = markersLayer;
      hotspotLayerGroupRef.current = hotspotLayer;
      sectorsLayerGroupRef.current = sectorsLayer;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerLat, centerLon], 15);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [centerLat, centerLon]);

  // Render Sector Boundary Polygons
  useEffect(() => {
    const sectorsGroup = sectorsLayerGroupRef.current;
    if (!sectorsGroup) return;

    sectorsGroup.clearLayers();
    if (!showSectors) return;

    const sectorOffsets = [
      { name: 'Sector A (North)', color: '#059669', dLat: 0.004, dLon: 0.004, fill: '#10b981' },
      { name: 'Sector B (East)', color: '#d97706', dLat: 0.004, dLon: -0.004, fill: '#f59e0b' },
      { name: 'Sector C (South)', color: '#ea580c', dLat: -0.004, dLon: -0.004, fill: '#f97316' },
      { name: 'Sector D (West)', color: '#0284c7', dLat: -0.004, dLon: 0.004, fill: '#38bdf8' }
    ];

    sectorOffsets.forEach(sec => {
      const bounds: L.LatLngExpression[] = [
        [centerLat + sec.dLat - 0.002, centerLon + sec.dLon - 0.0025],
        [centerLat + sec.dLat + 0.002, centerLon + sec.dLon - 0.0025],
        [centerLat + sec.dLat + 0.002, centerLon + sec.dLon + 0.0025],
        [centerLat + sec.dLat - 0.002, centerLon + sec.dLon + 0.0025]
      ];

      const polygon = L.polygon(bounds, {
        color: sec.color,
        weight: 1.5,
        dashArray: '4, 6',
        fillColor: sec.fill,
        fillOpacity: 0.08
      });

      polygon.bindTooltip(sec.name, {
        permanent: false,
        direction: 'center',
        className: 'bg-emerald-950 text-white font-bold text-[10px] rounded-lg px-2 py-1'
      });

      polygon.addTo(sectorsGroup);
    });
  }, [centerLat, centerLon, showSectors]);

  // Render Markers & Hotspots
  useEffect(() => {
    const markersGroup = markersLayerGroupRef.current;
    const hotspotGroup = hotspotLayerGroupRef.current;
    if (!markersGroup || !hotspotGroup) return;

    markersGroup.clearLayers();
    hotspotGroup.clearLayers();

    filteredPoints.forEach(point => {
      const isHealthy = point.severityPercentage <= 10;
      const isSevere = point.severityPercentage > 60;
      
      const markerColor = isHealthy ? '#059669' : isSevere ? '#e11d48' : '#d97706';
      const markerBg = isHealthy ? 'bg-emerald-500' : isSevere ? 'bg-rose-600' : 'bg-amber-500';

      // 1. Hotspot Heatmap Bubble
      if (showHotspots && point.severityPercentage > 10) {
        const radiusMeters = 80 + (point.severityPercentage / 100) * 180;
        const heatColor = isSevere ? '#e11d48' : '#f59e0b';

        const heatCircle = L.circle([point.lat, point.lon], {
          radius: radiusMeters,
          color: heatColor,
          weight: 1,
          opacity: 0.4,
          fillColor: heatColor,
          fillOpacity: 0.22 + (point.severityPercentage / 100) * 0.25
        });

        heatCircle.addTo(hotspotGroup);
      }

      // 2. Custom HTML Marker Pin
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative group cursor-pointer">
            <div class="w-8 h-8 rounded-full ${markerBg} text-white font-black text-[10px] flex items-center justify-center shadow-lg border-2 border-white transform transition hover:scale-125">
              ${Math.round(point.severityPercentage)}%
            </div>
            ${isSevere ? '<span class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span></span>' : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([point.lat, point.lon], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPoint(point);
      });

      marker.addTo(markersGroup);
    });
  }, [filteredPoints, showHotspots]);

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col font-sans">
      
      {/* Map Control Toolbar */}
      <div className="p-4 sm:p-5 border-b border-emerald-100 bg-emerald-50/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
              {t('spatial_map_title', lang)}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-emerald-950 tracking-tight flex items-center gap-2 mt-0.5">
            <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
            {regionName}
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Visualizing {filteredPoints.length} georeferenced canopy inspection coordinates
          </p>
        </div>

        {/* Action Toggles & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Hotspot Toggle */}
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition ${
              showHotspots 
                ? 'bg-rose-600 text-white shadow-md' 
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${showHotspots ? 'animate-bounce' : ''}`} />
            <span>{t('hotspot_overlay', lang)}</span>
          </button>

          {/* Sector Boundary Toggle */}
          <button
            onClick={() => setShowSectors(!showSectors)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition ${
              showSectors 
                ? 'bg-emerald-900 text-white shadow-md' 
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sectors</span>
          </button>

          {/* Filter Pills */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-emerald-200 text-xs font-bold">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded-xl transition ${activeFilter === 'ALL' ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {t('filter_all', lang)}
            </button>
            <button
              onClick={() => setActiveFilter('INFECTED')}
              className={`px-2.5 py-1 rounded-xl transition ${activeFilter === 'INFECTED' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {t('filter_infected', lang)}
            </button>
            <button
              onClick={() => setActiveFilter('SEVERE')}
              className={`px-2.5 py-1 rounded-xl transition ${activeFilter === 'SEVERE' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {t('filter_severe', lang)}
            </button>
          </div>

        </div>

      </div>

      {/* Map Canvas Stage with Popup Overlay */}
      <div className="relative h-96 sm:h-[420px] w-full bg-slate-100">
        
        {/* Leaflet DOM container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Selected Sample Pin Card Overlay */}
        {selectedPoint && (
          <div className="absolute top-4 left-4 z-10 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-emerald-100 animate-fade-in font-sans">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  selectedPoint.severityPercentage <= 10 ? 'bg-emerald-500' : selectedPoint.severityPercentage > 60 ? 'bg-rose-500' : 'bg-amber-500'
                }`} />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {selectedPoint.sectorName}
                </span>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={selectedPoint.imageUrl}
                alt={selectedPoint.diseaseName}
                className="w-14 h-14 rounded-2xl object-cover border border-emerald-100 shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden">
                <h4 className="text-xs font-black text-emerald-950 truncate">
                  {selectedPoint.plantName}
                </h4>
                <p className="text-xs font-bold text-rose-700 truncate">
                  {selectedPoint.diseaseName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                    Severity: {selectedPoint.severityPercentage}%
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {selectedPoint.lat.toFixed(4)}, {selectedPoint.lon.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">
                {new Date(selectedPoint.sample.timestamp).toLocaleDateString()}
              </span>

              {onSelectSample && (
                <button
                  onClick={() => onSelectSample(selectedPoint.sample)}
                  className="text-[11px] font-black uppercase tracking-wider text-emerald-700 hover:text-emerald-950 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect Foliage
                </button>
              )}
            </div>
          </div>
        )}

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 shadow-md border border-slate-200 text-[10px] font-bold text-slate-700 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
            <span>Healthy Canopy (0-10%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
            <span>Mild / Moderate (11-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-xs" />
            <span>Severe / Critical Foci (&gt;60%)</span>
          </div>
          {showHotspots && (
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200 text-rose-700">
              <Flame className="w-3 h-3 text-rose-500" />
              <span>Pathogen Diffusion Radius</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
