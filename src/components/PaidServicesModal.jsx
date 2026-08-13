import React, { useState } from 'react';
import { 
  DollarSign, ShieldAlert, Cpu, Sparkles, Check, AlertTriangle, X, Cloud, Zap, ArrowRight, ShieldCheck, Lock
} from 'lucide-react';

export default function PaidServicesModal({ isOpen, onClose, onConfirm, enabledServices, setEnabledServices }) {
  if (!isOpen) return null;

  const [localServices, setLocalServices] = useState(enabledServices || {
    bedrockGenAi: true,
    sageMakerMl: false,
    fraudDetector: false,
    kendraSearch: false
  });

  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  const toggleService = (key) => {
    setLocalServices(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setEnabledServices(localServices);
    onConfirm(localServices);
    onClose();
  };

  const PAID_SERVICES_LIST = [
    {
      id: 'bedrockGenAi',
      name: 'Amazon Bedrock (Generative AI - Claude 3.5 Sonnet)',
      icon: Sparkles,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      estimatedCost: '~$0.003 / 1,000 tokens (~$0.005 per doc)',
      billingType: 'On-Demand Pay-per-Token',
      recommended: true,
      description: 'Generates natural language invoice anomaly explanations, vendor fraud reasoning, and risk summaries.'
    },
    {
      id: 'sageMakerMl',
      name: 'Amazon SageMaker (Custom ML Risk Endpoint)',
      icon: Cpu,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/30',
      estimatedCost: '~$0.00002 / compute sec (~$0.001 per doc)',
      billingType: 'Serverless Inference',
      recommended: false,
      description: 'Executes custom Scikit-Learn/XGBoost credit risk scoring models trained on Swedish financial datasets.'
    },
    {
      id: 'fraudDetector',
      name: 'Amazon Fraud Detector (Automated ML Fraud Prevention)',
      icon: ShieldAlert,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      estimatedCost: '~$0.01 per fraud prediction',
      billingType: 'Pay-per-Evaluation',
      recommended: false,
      description: 'Detects duplicate payment redirection, phantom vendor creation, and invoice amount tampering.'
    },
    {
      id: 'kendraSearch',
      name: 'Amazon Kendra (Enterprise Intelligent Semantic Search)',
      icon: Cloud,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      estimatedCost: '~$0.81 / hour (~$590 / month dev tier)',
      billingType: 'Hourly Standing Instance',
      recommended: false,
      warning: 'Hourly standing cost! Only enable for dedicated enterprise deployments.',
      description: 'Allows natural language semantic queries across thousands of stored PDF invoices & contracts.'
    }
  ];

  const activeCount = Object.values(localServices).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900/90 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold flex-shrink-0">
              <DollarSign className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase">
                  Heavy Services Safeguard
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                  {activeCount} Active
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Enterprise Heavy AI Services & Cost Confirmation
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review itemized costs before enabling heavy AWS AI resources in your CloudFormation deployment.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Services List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>AWS Cost Protection Policy:</strong> Heavy services will only be included in your CloudFormation template and pipeline execution after your explicit confirmation below. Standard Textract & Comprehend tier remains 100% active.
            </div>
          </div>

          <div className="space-y-3">
            {PAID_SERVICES_LIST.map((srv) => {
              const IconComp = srv.icon;
              const isChecked = !!localServices[srv.id];

              return (
                <div
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    isChecked
                      ? 'bg-slate-900/90 border-amber-500/50 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-950/50 border-slate-800/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`h-10 w-10 rounded-xl ${srv.bgColor} border ${srv.borderColor} flex items-center justify-center ${srv.color} font-bold flex-shrink-0 mt-0.5`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{srv.name}</h4>
                        {srv.recommended && (
                          <span className="px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold">
                            RECOMMENDED
                          </span>
                        )}
                        {srv.warning && (
                          <span className="px-2 py-0.2 rounded bg-rose-500/10 text-rose-400 text-[9px] font-bold">
                            HOURLY COST
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{srv.description}</p>
                      
                      <div className="flex items-center gap-3 pt-1 text-[10px] font-mono">
                        <span className="text-amber-400 font-bold">Est. Cost: {srv.estimatedCost}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{srv.billingType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Custom Checkbox */}
                  <div className={`h-6 w-6 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-900 border-slate-700 text-transparent'
                  }`}>
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Disclaimer Checkbox */}
          <div
            onClick={() => setAcceptedDisclaimer(!acceptedDisclaimer)}
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors"
          >
            <div className={`h-5 w-5 rounded border flex items-center justify-center flex-shrink-0 ${
              acceptedDisclaimer ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold' : 'bg-slate-900 border-slate-700'
            }`}>
              {acceptedDisclaimer && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </div>
            <span className="text-xs text-slate-300 font-medium">
              I approve including the selected heavy AWS AI services in CloudFormation deployment and pipeline execution.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              // Reset to free standard tier
              const freeOnly = { bedrockGenAi: false, sageMakerMl: false, fraudDetector: false, kendraSearch: false };
              setLocalServices(freeOnly);
              setEnabledServices(freeOnly);
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Stay on Free Standard Tier ($0.00 Base)
          </button>

          <button
            disabled={!acceptedDisclaimer && activeCount > 0}
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
              !acceptedDisclaimer && activeCount > 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Confirm & Save Heavy Services Config ({activeCount} Selected)
          </button>
        </div>

      </div>
    </div>
  );
}
