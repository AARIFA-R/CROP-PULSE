import React from 'react';
import { SeverityLevel } from '../../types';

interface SeverityMeterProps {
  percentage: number;
  level?: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const SeverityMeter: React.FC<SeverityMeterProps> = ({
  percentage,
  level,
  size = 'md',
  showLabels = true
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage * 10) / 10));

  const getColor = (pct: number) => {
    if (pct <= 10) return { text: 'text-emerald-700', bg: 'bg-emerald-500', track: 'bg-emerald-100 border-emerald-200', name: 'Healthy / Very Low' };
    if (pct <= 30) return { text: 'text-lime-800', bg: 'bg-lime-500', track: 'bg-lime-100 border-lime-200', name: 'Mild Infection' };
    if (pct <= 60) return { text: 'text-amber-800', bg: 'bg-amber-500', track: 'bg-amber-100 border-amber-200', name: 'Moderate Severity' };
    if (pct <= 80) return { text: 'text-orange-800', bg: 'bg-orange-500', track: 'bg-orange-100 border-orange-200', name: 'Severe Damage' };
    return { text: 'text-rose-800', bg: 'bg-rose-600', track: 'bg-rose-100 border-rose-200', name: 'Critical Defoliation' };
  };

  const currentTheme = getColor(clamped);
  const displayLevel = level || currentTheme.name;

  return (
    <div id="severity-meter-container" className="w-full flex flex-col gap-2 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${currentTheme.track} ${currentTheme.text}`}>
            {displayLevel}
          </span>
          <span className="text-xs text-slate-500 font-bold">
            {clamped}% Foliar Area
          </span>
        </div>
        <span className={`font-black font-mono ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-lg'} ${currentTheme.text}`}>
          {clamped}%
        </span>
      </div>

      {/* Progress Bar with Severity Zones */}
      <div className="relative w-full h-3.5 bg-emerald-50 rounded-full overflow-hidden border border-emerald-100">
        {/* Continuous Severity Fill */}
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${currentTheme.bg}`}
          style={{ width: `${clamped}%` }}
        />

        {/* Zone tick markers */}
        <div className="absolute inset-0 flex justify-between pointer-events-none px-0.5">
          <div className="w-px h-full bg-slate-300 opacity-60" style={{ left: '10%' }} />
          <div className="w-px h-full bg-slate-300 opacity-60" style={{ left: '30%' }} />
          <div className="w-px h-full bg-slate-300 opacity-60" style={{ left: '60%' }} />
          <div className="w-px h-full bg-slate-300 opacity-60" style={{ left: '80%' }} />
        </div>
      </div>

      {showLabels && (
        <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider px-0.5">
          <span>0% Healthy</span>
          <span>10%</span>
          <span>30% Mild</span>
          <span>60% Mod.</span>
          <span>80% Sev.</span>
          <span>100% Crit.</span>
        </div>
      )}
    </div>
  );
};

