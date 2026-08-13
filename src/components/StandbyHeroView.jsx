import React from 'react';
import { 
  Cpu, Sparkles, LayoutDashboard, Upload, Database, Layers, Cloud, ShieldCheck, ArrowRight, Activity, Zap, CheckCircle2
} from 'lucide-react';

export default function StandbyHeroView({ onSelectTab, onOpenPaidServicesModal }) {
  return (
    <div className="py-8 sm:py-12 space-y-8 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Central Animated Hero Orb & Title */}
      <div className="text-center space-y-5">
        
        {/* Animated Orb Graphic */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
          <div className="h-24 w-24 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl shadow-amber-500/20 flex items-center justify-center text-amber-400 relative">
            <Cpu className="h-12 w-12 stroke-[2.2] animate-bounce" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Activity className="h-3.5 w-3.5 animate-pulse" /> AWS AI Command Center • Standby Ready
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            PayComprehend <span className="text-amber-500">Financial AI Platform</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
            Select a module from the navigation bar above or launch a quick-action module below to begin document intelligence analysis.
          </p>
        </div>
      </div>

      {/* Quick Access Module Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Dashboard */}
        <div
          onClick={() => onSelectTab('DASHBOARD')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 cursor-pointer transition-all space-y-3 group"
        >
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1">
              Executive Dashboard <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">View real-time spending analytics, top vendors & OCR confidence.</p>
          </div>
        </div>

        {/* Card 2: Upload */}
        <div
          onClick={() => onSelectTab('UPLOAD')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 cursor-pointer transition-all space-y-3 group"
        >
          <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors flex items-center gap-1">
              Upload Document <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">Upload PDF, PNG, JPG, or Word files for instant AI parsing.</p>
          </div>
        </div>

        {/* Card 3: Explorer */}
        <div
          onClick={() => onSelectTab('EXPLORER')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 cursor-pointer transition-all space-y-3 group"
        >
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1">
              Document Explorer <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">Browse documents with Swedish Riskklass 1-5 credit scores.</p>
          </div>
        </div>

        {/* Card 4: Architecture */}
        <div
          onClick={() => onSelectTab('ARCHITECTURE')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 cursor-pointer transition-all space-y-3 group"
        >
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors flex items-center gap-1">
              Architecture & Spec <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">Inspect AWS architecture diagram & $0.015/invoice ROI metrics.</p>
          </div>
        </div>

      </div>

      {/* Realtime Telemetry Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-200">AWS Lambda & Textract Pipeline Status: Operational</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Latency: &lt; 1.8s</span>
          <span>•</span>
          <span>Nordic Risk Engine: Active</span>
        </div>
      </div>

    </div>
  );
}
