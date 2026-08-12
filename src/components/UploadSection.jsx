import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, FileCode, CheckCircle2, ArrowRight, Loader2, Cpu, Zap, Database, Sparkles, AlertCircle } from 'lucide-react';
import { executeAwsPipeline } from '../services/awsPipeline';

export default function UploadSection({ onDocumentProcessed, awsConfig, liveMode }) {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;

    // Validate file extensions
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'];
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(ext)) {
      setErrorMsg(`Unsupported file type (.${ext}). Please upload PDF, PNG, JPG, or DOC files.`);
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      // Execute AWS pipeline (Live Lambda / Function URL or Simulator)
      const parsedDoc = await executeAwsPipeline(file, (stepInfo) => {
        setCurrentStep(stepInfo);
      }, awsConfig, liveMode);

      onDocumentProcessed(parsedDoc);
    } catch (err) {
      setErrorMsg('Failed to process document through AWS pipeline: ' + err.message);
    } finally {
      setIsProcessing(false);
      setCurrentStep(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="mb-8">
      {/* Upload Box Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Upload className="h-5 w-5 text-amber-500" />
            Upload Payment Documents & Receipts
          </h2>
          <p className="text-xs text-slate-400">
            Upload PDFs, Images (PNG/JPG), or DOC files. AWS S3 will trigger AWS Lambda, Textract Expense OCR, and Amazon Comprehend.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 font-mono">
            Supported: .PDF, .PNG, .JPG, .DOC, .DOCX
          </span>
        </div>
      </div>

      {/* Drag and Drop Container */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer ${
          dragActive
            ? 'border-2 border-dashed border-amber-400 bg-amber-500/10 shadow-xl shadow-amber-500/10 scale-[1.01]'
            : isProcessing
            ? 'border border-amber-500/40 bg-slate-900/90 shadow-2xl'
            : 'border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700 hover:shadow-xl'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          onChange={handleChange}
          className="hidden"
          disabled={isProcessing}
        />

        {/* Ambient Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-blue-500/5 to-emerald-500/5 pointer-events-none" />

        <div className="p-8 lg:p-12 text-center relative z-10">
          {isProcessing && currentStep ? (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Active Animation Spinner */}
              <div className="relative h-16 w-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                <Cpu className="h-7 w-7 text-amber-400 animate-pulse" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest font-mono text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {currentStep.stage}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">
                  {currentStep.label}
                </h3>
                <p className="text-xs text-slate-300 font-mono mt-1">
                  {currentStep.detail}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${currentStep.progress}%` }}
                />
              </div>

              {/* 5-Stage Live AWS Pipeline Stepper */}
              <div className="grid grid-cols-5 gap-2 text-center pt-2">
                {[
                  { stage: 'STAGING', label: '1. File Validation' },
                  { stage: 'S3_UPLOAD', label: '2. S3 Upload' },
                  { stage: 'S3_TRIGGER', label: '3. S3 Event' },
                  { stage: 'TEXTRACT', label: '4. Textract OCR' },
                  { stage: 'COMPREHEND', label: '5. Comprehend' }
                ].map((stg, idx) => {
                  const isDone = currentStep.progress >= ((idx + 1) * 20);
                  const isCurrent = currentStep.stage === stg.stage;

                  return (
                    <div
                      key={stg.stage}
                      className={`p-2 rounded-lg text-xs font-medium border transition-all ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold scale-105 shadow-md shadow-amber-500/20'
                          : isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="text-[10px] font-mono mb-0.5">STEP 0{idx + 1}</div>
                      <div className="truncate">{stg.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/20 to-slate-800 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/10">
                <Upload className="h-8 w-8 stroke-[1.8]" />
              </div>

              <div>
                <p className="text-base font-semibold text-white">
                  Drop your payment receipts, invoices, or billing documents here
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  or <span className="text-amber-400 font-bold underline">click to browse files</span> on your computer
                </p>
              </div>

              {/* Supported File Format Badges */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <FileText className="h-4 w-4 text-red-400" /> PDF Document
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <ImageIcon className="h-4 w-4 text-blue-400" /> PNG / JPG Image
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <FileCode className="h-4 w-4 text-indigo-400" /> DOC / DOCX
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
