import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, Sparkles, Sprout, Wind, Activity, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { DiseaseMitigation } from '../../types';

interface MitigationCardProps {
  mitigation: DiseaseMitigation;
  diseaseName: string;
  plantName: string;
}

export const MitigationCard: React.FC<MitigationCardProps> = ({
  mitigation,
  diseaseName,
  plantName
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('immediate');

  const toggle = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const hasImmediate = mitigation.immediate && mitigation.immediate.length > 0;
  const hasTreatment = mitigation.treatment && mitigation.treatment.length > 0;
  const hasPreventive = mitigation.preventive && mitigation.preventive.length > 0;
  const hasCultural = mitigation.cultural && mitigation.cultural.length > 0;
  const hasEnvironmental = mitigation.environmental && mitigation.environmental.length > 0;
  const hasMonitoring = mitigation.monitoring && mitigation.monitoring.length > 0;

  return (
    <div id="mitigation-recommendations-card" className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden font-sans">
      {/* Card Header */}
      <div className="p-5 bg-emerald-950 text-white border-b border-emerald-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              Agronomy Mitigation & Treatment Plan
            </h3>
            <p className="text-xs text-emerald-300 font-medium">
              Protocol for {plantName} • {diseaseName}
            </p>
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="divide-y divide-emerald-50">
        {/* 1. Immediate Actions */}
        {hasImmediate && (
          <div className="p-4 sm:p-5">
            <button
              onClick={() => toggle('immediate')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-xl bg-rose-100 text-rose-700">
                  <AlertCircle className="w-4 h-4" />
                </span>
                <span className="text-sm font-black text-emerald-950 group-hover:text-emerald-700 transition">
                  1. Immediate Remedial Actions
                </span>
                <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Urgent
                </span>
              </div>
              {expandedSection === 'immediate' ? (
                <ChevronUp className="w-4 h-4 text-emerald-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-emerald-700" />
              )}
            </button>

            {expandedSection === 'immediate' && (
              <ul className="mt-3 pl-8 space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                {mitigation.immediate.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 2. Treatment Guidance */}
        {hasTreatment && (
          <div className="p-4 sm:p-5">
            <button
              onClick={() => toggle('treatment')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-sm font-black text-emerald-950 group-hover:text-emerald-700 transition">
                  2. Chemical & Bio-Fungicide Treatment
                </span>
              </div>
              {expandedSection === 'treatment' ? (
                <ChevronUp className="w-4 h-4 text-emerald-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-emerald-700" />
              )}
            </button>

            {expandedSection === 'treatment' && (
              <ul className="mt-3 pl-8 space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                {mitigation.treatment.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 3. Preventive Practices */}
        {hasPreventive && (
          <div className="p-4 sm:p-5">
            <button
              onClick={() => toggle('preventive')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                <span className="text-sm font-black text-emerald-950 group-hover:text-emerald-700 transition">
                  3. Long-term Preventive Measures
                </span>
              </div>
              {expandedSection === 'preventive' ? (
                <ChevronUp className="w-4 h-4 text-emerald-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-emerald-700" />
              )}
            </button>

            {expandedSection === 'preventive' && (
              <ul className="mt-3 pl-8 space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                {mitigation.preventive.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 4. Cultural & Environmental Practices */}
        {(hasCultural || hasEnvironmental) && (
          <div className="p-4 sm:p-5">
            <button
              onClick={() => toggle('cultural')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-xl bg-teal-100 text-teal-800">
                  <Wind className="w-4 h-4" />
                </span>
                <span className="text-sm font-black text-emerald-950 group-hover:text-emerald-700 transition">
                  4. Cultural & Environmental Management
                </span>
              </div>
              {expandedSection === 'cultural' ? (
                <ChevronUp className="w-4 h-4 text-emerald-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-emerald-700" />
              )}
            </button>

            {expandedSection === 'cultural' && (
              <div className="mt-3 pl-8 space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                {hasCultural && (
                  <div>
                    <span className="font-black text-emerald-950 uppercase tracking-wider text-xs block mb-1">Cultural Practices:</span>
                    <ul className="space-y-1.5">
                      {mitigation.cultural?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {hasEnvironmental && (
                  <div>
                    <span className="font-black text-emerald-950 uppercase tracking-wider text-xs block mb-1">Micro-climate & Irrigation:</span>
                    <ul className="space-y-1.5">
                      {mitigation.environmental?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 5. Monitoring Advice */}
        {hasMonitoring && (
          <div className="p-4 sm:p-5">
            <button
              onClick={() => toggle('monitoring')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-xl bg-indigo-100 text-indigo-800">
                  <Activity className="w-4 h-4" />
                </span>
                <span className="text-sm font-black text-emerald-950 group-hover:text-emerald-700 transition">
                  5. Field Scouting & Monitoring Protocol
                </span>
              </div>
              {expandedSection === 'monitoring' ? (
                <ChevronUp className="w-4 h-4 text-emerald-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-emerald-700" />
              )}
            </button>

            {expandedSection === 'monitoring' && (
              <ul className="mt-3 pl-8 space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                {mitigation.monitoring?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

