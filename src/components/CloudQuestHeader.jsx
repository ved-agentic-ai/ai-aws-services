import React from 'react';
import { Database, Zap, Cpu, Settings, ShieldCheck, RefreshCw, Terminal, Layers } from 'lucide-react';

export default function CloudQuestHeader({ awsConfig, setAwsConfig, openSettings, liveMode, setLiveMode, documentCount }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
              <Cpu className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  CloudQuest <span className="text-amber-500">PayComprehend</span>
                </h1>
                <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded border border-amber-500/20">
                  ML Lab Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>AWS S3</span> • <span>AWS Lambda</span> • <span>Textract</span> • <span className="text-amber-400 font-medium">Amazon Comprehend</span>
              </p>
            </div>
          </div>

          {/* Quick Mode Toggle for Mobile */}
          <button
            onClick={openSettings}
            className="md:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Center AWS Architecture Indicators */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Database className="h-4 w-4 text-amber-500" />
            <span className="font-mono text-slate-400">S3:</span>
            <span className="font-medium text-slate-200">{awsConfig.s3Bucket}</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2 text-slate-300">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="font-mono text-slate-400">Lambda:</span>
            <span className="font-medium text-slate-200">{awsConfig.lambdaName}</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Region: {awsConfig.region}</span>
          </div>
        </div>

        {/* Right Actions & Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Mode Selector Pill */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setLiveMode(false)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                !liveMode 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
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
