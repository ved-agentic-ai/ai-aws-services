import React, { useState } from 'react';
import { X, Settings, Database, Zap, Shield, Globe, Save, CheckCircle2, Info } from 'lucide-react';

export default function AwsSettingsModal({ awsConfig, setAwsConfig, onClose, liveMode, setLiveMode }) {
  const [formData, setFormData] = useState({ ...awsConfig });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAwsConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AWS Cloud Quest Settings</h3>
              <p className="text-xs text-slate-400">Configure your Cloud Quest S3 Bucket and Lambda parameters</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Mode Switcher Banner */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">Execution Mode</div>
              <div className="text-[11px] text-slate-400">Switch between Cloud Quest Live AWS API or Simulator</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLiveMode(!liveMode)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  liveMode
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {liveMode ? '🟢 AWS Live Mode' : '⚡ Lab Simulator'}
              </button>
            </div>
          </div>

          {/* S3 Bucket Name */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-amber-400" /> S3 Bucket Name
            </label>
            <input
              type="text"
              value={formData.s3Bucket}
              onChange={(e) => setFormData({ ...formData, s3Bucket: e.target.value })}
              placeholder="e.g. cloudquest-ml-bucket-0514"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500/50"
              required
            />
          </div>

          {/* AWS Region */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-sky-400" /> AWS Region
            </label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="us-east-1"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500/50"
              required
            />
          </div>

          {/* Lambda Function Name */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-emerald-400" /> Lambda Function Name
            </label>
            <input
              type="text"
              value={formData.lambdaName || ''}
              onChange={(e) => setFormData({ ...formData, lambdaName: e.target.value })}
              placeholder="e.g. CloudQuestPayComprehendFunction"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Lambda Function URL (No API Gateway Needed!) */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-amber-400" /> Lambda Function URL (No API Gateway Needed)
            </label>
            <input
              type="url"
              value={formData.lambdaFunctionUrl || ''}
              onChange={(e) => setFormData({ ...formData, lambdaFunctionUrl: e.target.value })}
              placeholder="https://xyz123.lambda-url.us-east-1.on.aws/"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500/50"
            />
            <p className="text-[10px] text-slate-400">
              In Lambda Console → Configuration → Function URL → Create Function URL (Auth type: NONE, allow CORS).
            </p>
          </div>

          {/* Info note */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>AWS Cloud Quest Note:</strong> Since API Gateway permissions are restricted in Cloud Quest, use the built-in <strong>Lambda Function URL</strong> above to connect directly to your Python Lambda without API Gateway!
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Configuration
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
