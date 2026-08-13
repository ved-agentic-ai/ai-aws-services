import React from 'react';
import { Database, Zap, Cpu, Settings, ShieldCheck, RefreshCw, Terminal, Layers, FlaskConical } from 'lucide-react';

export default function CloudQuestHeader({ awsConfig, setAwsConfig, openSettings, liveMode, setLiveMode, documentCount }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
      <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold flex-shrink-0">
            <Cpu className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2 whitespace-nowrap">
                CloudQuest <span className="text-amber-500">PayComprehend</span>
              </h1>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-500/20 whitespace-nowrap">
                ML Lab Edition
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400 flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
              <span>AWS S3</span> • <span>Lambda</span> • <span>Textract</span> • <span className="text-amber-400 font-medium">Comprehend</span> • <span className="text-emerald-400 font-medium">Bedrock GenAI</span>
            </p>
          </div>
        </div>

        {/* Center AWS Architecture Indicators */}
        <div className="hidden 2xl:flex items-center gap-3 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Database className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
            <span className="font-mono text-slate-400">S3:</span>
            <span className="font-medium text-slate-200 truncate max-w-[160px]" title={awsConfig.s3Bucket}>{awsConfig.s3Bucket}</span>
          </div>

          <div className="h-3.5 w-px bg-slate-800" />

          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
            <span className="font-mono text-slate-400">Lambda:</span>
            <span className="font-medium text-slate-200 truncate max-w-[160px]" title={awsConfig.lambdaName}>{awsConfig.lambdaName}</span>
          </div>

          <div className="h-3.5 w-px bg-slate-800" />

          <div className="flex items-center gap-1.5 text-emerald-400 whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="font-medium">Region: {awsConfig.region}</span>
          </div>
        </div>

        {/* Right Actions & Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Mode Selector Pill */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setLiveMode(false)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                !liveMode 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FlaskConical className="h-3.5 w-3.5 text-amber-400" />
              Lab Simulator
            </button>
            <button
              onClick={() => setLiveMode(true)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                liveMode 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              AWS Live Mode
            </button>
          </div>

          {/* Settings Trigger Button */}
          <button
            onClick={openSettings}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all shadow-sm"
          >
            <Settings className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">AWS Config</span>
          </button>
        </div>

      </div>
    </header>
  );
}
