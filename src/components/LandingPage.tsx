import React from 'react';
import { 
  Scan, 
  Layers, 
  Flame, 
  BarChart3, 
  ShieldCheck, 
  Upload, 
  ArrowRight, 
  Sparkles, 
  Tractor, 
  CheckCircle2, 
  FileSpreadsheet, 
  Activity, 
  Microscope,
  Cpu,
  User,
  ShieldAlert
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onTryScanner: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogin,
  onTryScanner
}) => {
  return (
    <div id="landing-page" className="min-h-screen bg-[#F4F7F4] text-[#1A1A1A] flex flex-col font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-emerald-100">
        
        {/* Subtle Ambient Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-200/40 blur-[130px] pointer-events-none -z-10 rounded-full" />
        <div className="absolute top-1/4 right-10 w-[350px] h-[300px] bg-teal-100/60 blur-[100px] pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Overline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 text-[11px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            AI Computer Vision & Continuous Pathology
          </div>

          {/* Heading with Ultra-Bold Typography */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-emerald-950 max-w-5xl leading-[1.05]">
            Plant Disease Detection & <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">Severity Analysis</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-emerald-900/75 max-w-3xl font-medium leading-relaxed">
            Instant leaf pathology classification, 2D U-Net lesion segmentation, continuous percentage severity estimation, and verified agronomic mitigation protocols.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              id="hero-get-started-btn"
              onClick={onGetStarted}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-900/20 hover:shadow-emerald-900/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-try-scanner-btn"
              onClick={onTryScanner}
              className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-300 text-emerald-950 font-bold text-sm shadow-sm transition"
            >
              <Scan className="w-4 h-4 text-emerald-600" />
              <span>Launch Live Demo</span>
            </button>

            <button
              id="hero-login-btn"
              onClick={onLogin}
              className="px-6 py-4 rounded-2xl text-emerald-900 hover:text-emerald-950 font-bold text-sm hover:bg-emerald-100/50 transition"
            >
              Sign In
            </button>
          </div>

          {/* Trust Highlights Strip */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-emerald-900/80 font-bold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Lightweight U-Net Segmentation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Continuous Severity Regression Head</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Grad-CAM Saliency Maps</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>High-Throughput Farmer Ingestion</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SCIENTIFIC DIAGNOSTIC PIPELINE */}
      <section className="py-16 sm:py-20 bg-white border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
              End-to-End Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight mt-1">
              Agronomy Diagnostic Workflow
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base font-medium">
              From in-situ leaf capture to localized biochemical and cultural mitigation protocols.
            </p>
          </div>

          {/* Pipeline flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Capture / Ingest', desc: 'Live camera or high-res leaf upload', icon: Upload, color: 'text-emerald-700', bg: 'bg-emerald-100' },
              { step: '02', title: 'Species ID', desc: 'Plant identification & confidence match', icon: Microscope, color: 'text-emerald-700', bg: 'bg-emerald-100' },
              { step: '03', title: 'Pathology Detect', desc: 'Pathogen & disease classification', icon: Activity, color: 'text-amber-700', bg: 'bg-amber-100' },
              { step: '04', title: 'Lesion Masking', desc: '2D U-Net necrotic segmentation', icon: Layers, color: 'text-rose-700', bg: 'bg-rose-100' },
              { step: '05', title: 'Severity %', desc: 'Continuous 0-100% regression index', icon: BarChart3, color: 'text-amber-700', bg: 'bg-amber-100' },
              { step: '06', title: 'Mitigation Plan', desc: 'Curative, biological & cultural actions', icon: ShieldCheck, color: 'text-emerald-700', bg: 'bg-emerald-100' },
            ].map((node, idx) => {
              const Icon = node.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-[#F4F7F4] p-5 rounded-3xl border border-emerald-100 hover:border-emerald-300 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black font-mono text-emerald-800/60">{node.step}</span>
                      <div className={`p-2.5 rounded-xl ${node.bg} ${node.color} shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-sm font-black text-emerald-950 group-hover:text-emerald-700 transition">
                      {node.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 font-medium leading-relaxed">
                      {node.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CORE ARCHITECTURAL CAPABILITIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Platform Features</span>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight mt-1">
            Engineered for Precision Agrotechnology
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1: AI-Powered Detection */}
          <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 shadow-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-emerald-950 mb-2">AI-Powered Detection</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-4">
                Identifies 50+ plant species and common foliar pathologies—including early/late blights, rusts, powdery mildews, and nutrient chlorosis.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900 font-bold border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sub-second inference turnaround</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Calibrated species & disease confidence scores</span>
              </li>
            </ul>
          </div>

          {/* Feature 2: Continuous Severity Regression */}
          <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 shadow-sm">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-emerald-950 mb-2">Continuous Severity Head</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-4">
                Lightweight U-Net paired with a regression head estimates exact foliar lesion damage (0-100%) mapped across 5 standardized severity tiers.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900 font-bold border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Zone index (Healthy, Mild, Mod, Severe, Critical)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Actionable canopy defoliation metrics</span>
              </li>
            </ul>
          </div>

          {/* Feature 3: Grad-CAM Explainable AI */}
          <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-5 shadow-sm">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-emerald-950 mb-2">Grad-CAM & Explainability</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-4">
                Verify neural reasoning through Grad-CAM saliency heatmaps alongside high-precision necrotic lesion segmentation masks.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900 font-bold border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>4-Layer inspection (Raw, Mask, Heatmap, Overlay)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Transparent decision diagnostics</span>
              </li>
            </ul>
          </div>

          {/* Feature 4: Farmer Bulk Processing */}
          <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 shadow-sm">
                <Tractor className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-emerald-950 mb-2">Bulk Field Surveys</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-4">
                Process hundreds of crop images concurrently with resilient per-image handling, live progress telemetry, and batch summaries.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900 font-bold border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Drag-and-drop or whole folder uploads</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Exportable CSV data & PDF pathology certificates</span>
              </li>
            </ul>
          </div>

          {/* Feature 5: Mitigation Recommendations */}
          <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-emerald-950 mb-2">Mitigation Guidance</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-4">
                Structured action plans offering immediate chemical remediations, bio-fungicides, cultural practices, and scouting frequencies.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900 font-bold border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tailored for species and specific pathology</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Organic and IPM-aligned strategies</span>
              </li>
            </ul>
          </div>

          {/* Feature 6: Privacy & Cloud Persistence */}
          <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 shadow-sm">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-emerald-950 mb-2">Secure Cloud Persistence</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-4">
                Firebase Authentication and Firestore securely catalog past scans, batch logs, and historical disease trends.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900 font-bold border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Role-based access (Normal User vs. Farmer)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero background recording; camera stream clears on capture</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 4. USER ROLE EXPERIENCES (DARK CONTRAST SECTION) */}
      <section className="py-20 bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Two Dedicated Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Select Your Agronomy Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Normal User Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-emerald-900/60 border border-emerald-800 flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Normal User Mode
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-4 mb-2">
                  Daily Foliar Health Scanner
                </h3>
                <p className="text-emerald-100/75 text-sm leading-relaxed mb-6 font-medium">
                  Ideal for home gardeners, indoor growers, and botanists. Fast single-image disease diagnosis, real-time live camera capture, continuous severity gauge, and archived scan history.
                </p>
              </div>
              <button
                id="signup-normal-user-btn"
                onClick={onGetStarted}
                className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition text-center shadow-lg"
              >
                Start as Normal User
              </button>
            </div>

            {/* Farmer Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-emerald-900/60 border border-emerald-800 flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Farmer Enterprise Mode
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-4 mb-2">
                  Commercial Bulk Agronomy
                </h3>
                <p className="text-emerald-100/75 text-sm leading-relaxed mb-6 font-medium">
                  Engineered for field scouts and commercial growers. Multi-image batch ingestion, aggregate epidemiology distribution charts, and printable PDF compliance reports.
                </p>
              </div>
              <button
                id="signup-farmer-btn"
                onClick={onGetStarted}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition text-center shadow-lg"
              >
                Start as Commercial Farmer
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-white border-t border-emerald-100 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-black text-emerald-950">CROP PULSE AI</span>
            <span>• Plant Leaf Disease Detection & Continuous Severity Engine</span>
          </div>
          <div className="font-medium text-emerald-800/80">
            Powered by PyTorch U-Net & Google Gemini AI
          </div>
        </div>
      </footer>

    </div>
  );
};

