import React, { useState } from 'react';
import { X, FileText, Download, Building2, Calendar, DollarSign, CreditCard, Tag, Sparkles, ShieldAlert, CheckCircle2, Code, Layers, FileCheck, Eye, Cpu, Scan, CheckSquare } from 'lucide-react';

export default function DocumentDetailModal({ document, onClose }) {
  const [activeTab, setActiveTab] = useState('TEXTRACT'); // TEXTRACT | COMPREHEND | LINE_ITEMS | RAW_JSON

  if (!document) return null;

  const comprehend = document.comprehendInsights || {};
  const textract = document.textractInsights || {
    keyValues: [
      { key: 'VENDOR_NAME', value: document.vendorName, confidence: 99.4 },
      { key: 'INVOICE_RECEIPT_ID', value: document.invoiceNumber, confidence: 99.1 },
      { key: 'INVOICE_RECEIPT_DATE', value: document.invoiceDate, confidence: 99.0 },
      { key: 'TOTAL_AMOUNT', value: `${document.currencySymbol || '$'}${document.totalAmount.toFixed(2)}`, confidence: 99.6 },
      { key: 'TAX', value: `${document.currencySymbol || '$'}${document.taxAmount.toFixed(2)}`, confidence: 98.5 },
      { key: 'PAYMENT_METHOD', value: document.paymentMethod, confidence: 98.2 }
    ],
    boundingBoxes: [
      { text: document.vendorName, polygon: 'BoundingBox [Top: 0.12, Left: 0.25, Width: 0.50, Height: 0.06]', confidence: 99.8 }
    ],
    detectedBlocksCount: 48,
    ocrEngine: 'Amazon Textract AnalyzeExpense API v2'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {document.fileName}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                S3 URI: <span className="text-slate-300">{document.s3Uri}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dual Panel Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Panel: Document Visual Preview (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950/90 p-6 border-r border-slate-800 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-amber-400" /> Document Preview
                </span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
                  {document.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                </span>
              </div>

              {/* Actual Image / Document Reader Box */}
              {document.fileObjectUrl ? (
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl flex items-center justify-center p-2 min-h-[320px]">
                  <img
                    src={document.fileObjectUrl}
                    alt={document.fileName}
                    className="max-h-[380px] w-full object-contain rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <div className="bg-white text-slate-900 rounded-xl p-6 shadow-2xl border border-slate-200 text-xs font-mono space-y-4 relative overflow-hidden min-h-[320px]">
                  {/* Stamp */}
                  <div className="absolute top-4 right-4 border-2 border-emerald-600 text-emerald-600 font-black px-2 py-1 rotate-12 text-[10px] rounded uppercase opacity-80">
                    Textract OCR
                  </div>

                  <div className="border-b border-slate-200 pb-3">
                    <div className="font-bold text-sm text-slate-900">{document.vendorName}</div>
                    <div className="text-[10px] text-slate-500">Official Billing Receipt / Invoice</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">INVOICE NO:</span>
                      <span className="font-bold text-slate-800">{document.invoiceNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">DATE:</span>
                      <span className="font-bold text-slate-800">{document.invoiceDate}</span>
                    </div>
                  </div>

                  {/* Line items snippet */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Line Items:</div>
                    {document.lineItems?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-slate-700">
                        <span className="truncate max-w-[170px]">{item.description}</span>
                        <span className="font-semibold">{document.currencySymbol || '$'}{Number(item.total).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-900">TOTAL DUE:</span>
                    <span className="font-black text-slate-900">{document.currencySymbol || '$'}{document.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick S3 & Engine Metadata */}
            <div className="mt-6 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div><span className="text-slate-500">Textract OCR Score:</span> <span className="text-emerald-400 font-bold">{document.confidenceScore}%</span></div>
              <div><span className="text-slate-500">OCR Engine:</span> <span className="text-amber-400 font-medium">Textract AnalyzeExpense API</span></div>
            </div>
          </div>

          {/* Right Panel: Extracted AI Insights & Line Items (7 cols) */}
          <div className="lg:col-span-7 p-6 overflow-y-auto flex flex-col justify-between space-y-6">
            
            {/* Tabs Navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('TEXTRACT')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'TEXTRACT'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="h-4 w-4 text-amber-400" /> Amazon Textract OCR
              </button>

              <button
                onClick={() => setActiveTab('COMPREHEND')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'COMPREHEND'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="h-4 w-4 text-sky-400" /> Amazon Comprehend AI
              </button>

              <button
                onClick={() => setActiveTab('LINE_ITEMS')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'LINE_ITEMS'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="h-4 w-4 text-purple-400" /> Line Items ({document.lineItems?.length || 0})
              </button>

              <button
                onClick={() => setActiveTab('RAW_JSON')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'RAW_JSON'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="h-4 w-4 text-emerald-400" /> Raw AWS Payload
              </button>
            </div>

            {/* TAB 1: AMAZON TEXTRACT OCR */}
            {activeTab === 'TEXTRACT' && (
              <div className="space-y-6">
                
                {/* Engine Banner */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-amber-400" />
                    <span className="font-bold text-amber-300">Amazon Textract AnalyzeExpense API</span>
                  </div>
                  <span className="bg-slate-900 text-emerald-400 px-2 py-0.5 rounded font-mono text-[11px]">
                    {textract.detectedBlocksCount || 48} Blocks Detected
                  </span>
                </div>

                {/* Key-Value Pair Sets */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="h-4 w-4 text-amber-400" /> Extracted Textract Key-Value Sets (KEY_VALUE_SET)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {textract.keyValues?.map((kv, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-mono">
                          <span>{kv.key}</span>
                          <span className="text-emerald-400 font-semibold">{kv.confidence}%</span>
                        </div>
                        <div className="font-bold text-white text-sm truncate">{kv.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bounding Box Coordinates */}
                {textract.boundingBoxes && textract.boundingBoxes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Scan className="h-4 w-4 text-sky-400" /> OCR Bounding Box Geometries
                    </h4>
                    <div className="space-y-2">
                      {textract.boundingBoxes.map((box, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex flex-col gap-1 font-mono">
                          <div className="flex items-center justify-between text-slate-200 font-semibold">
                            <span>"{box.text}"</span>
                            <span className="text-emerald-400 text-[10px]">{box.confidence}% match</span>
                          </div>
                          <span className="text-[10px] text-slate-500">{typeof box.polygon === 'string' ? box.polygon : JSON.stringify(box.polygon)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: AMAZON COMPREHEND AI INSIGHTS */}
            {activeTab === 'COMPREHEND' && (
              <div className="space-y-6">
                
                {/* Financial Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase">Vendor Name</span>
                    <span className="font-bold text-white text-sm">{document.vendorName}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase">Total Amount</span>
                    <span className="font-extrabold text-amber-400 text-base">{document.currencySymbol || '$'}{document.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase">Tax / VAT</span>
                    <span className="font-bold text-slate-200 text-sm">{document.currencySymbol || '$'}{document.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase">Invoice Number</span>
                    <span className="font-mono text-slate-200 text-xs">{document.invoiceNumber}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase">Invoice Date</span>
                    <span className="font-mono text-slate-200 text-xs">{document.invoiceDate}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase">Payment Method</span>
                    <span className="font-medium text-slate-200 text-xs">{document.paymentMethod}</span>
                  </div>
                </div>

                {/* Comprehend Detected Entities */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-sky-400" /> Amazon Comprehend Named Entities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {comprehend.entities?.map((ent, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-2"
                      >
                        <span className="font-semibold text-slate-200">{ent.text}</span>
                        <span className="bg-sky-500/10 text-sky-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-sky-500/20">
                          {ent.type} ({Math.round(ent.score * 100)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Phrases */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Extracted Key Phrases & Topics
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {comprehend.keyPhrases?.map((kp, idx) => (
                      <span key={idx} className="bg-slate-800 text-slate-300 text-[11px] px-2 py-0.5 rounded-md border border-slate-700">
                        {kp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Risk / Compliance Notes */}
                {comprehend.riskNotes && (
                  <div className={`p-3 rounded-xl border text-xs ${
                    comprehend.riskFlag
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      {comprehend.riskFlag ? <ShieldAlert className="h-4 w-4 text-rose-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      Comprehend Audit Note
                    </div>
                    <p>{comprehend.riskNotes}</p>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: ITEMISED LINE ITEMS */}
            {activeTab === 'LINE_ITEMS' && (
              <div className="space-y-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 font-semibold text-[10px] uppercase">
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {document.lineItems?.map((item, idx) => (
                      <tr key={idx} className="text-slate-200">
                        <td className="py-2.5 px-3 font-medium">{item.description}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{document.currencySymbol || '$'}{Number(item.unitPrice).toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                          {document.currencySymbol || '$'}{Number(item.total).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: RAW AWS JSON PAYLOAD */}
            {activeTab === 'RAW_JSON' && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[350px] overflow-y-auto">
                <pre className="text-[11px] font-mono text-emerald-400 whitespace-pre-wrap">
                  {JSON.stringify(document, null, 2)}
                </pre>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
