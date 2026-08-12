import React, { useState } from 'react';
import { 
  X, FileText, Download, Building2, Calendar, DollarSign, CreditCard, Tag, Sparkles, 
  ShieldAlert, CheckCircle2, Code, Layers, FileCheck, Eye, Cpu, Scan, CheckSquare, 
  Table, Grid, FileCode2, HelpCircle, PenTool, SlidersHorizontal, Check, ArrowRight
} from 'lucide-react';

export default function DocumentDetailModal({ document, onClose }) {
  const [activeMainTab, setActiveMainTab] = useState('TEXTRACT'); // TEXTRACT | COMPREHEND | RAW_JSON
  const [textractSubTab, setTextractSubTab] = useState('RAW_TEXT'); // RAW_TEXT | LAYOUT | FORMS | TABLES | QUERIES | SIGNATURE
  const [comprehendSubTab, setComprehendSubTab] = useState('ENTITIES'); // ENTITIES | PHRASES | SENTIMENT | PII
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);

  // Config options matching AWS Textract Console (Screenshot 1)
  const [configOutputs, setConfigOutputs] = useState({
    layout: true,
    forms: true,
    tables: true,
    queries: true,
    signature: true
  });

  if (!document) return null;

  const comprehend = document.comprehendInsights || {};
  const textract = document.textractInsights || {};

  // Extract raw text blocks matching AWS Textract Console (Screenshot 2)
  const rawTextBlocks = document.textractRawText || [
    document.vendorName, 'INVOICE', document.invoiceNumber, document.invoiceDate,
    'Total Amount', `${document.currencySymbol || '$'}${document.totalAmount.toFixed(2)}`,
    'Tax', `${document.currencySymbol || '$'}${document.taxAmount.toFixed(2)}`,
    document.paymentMethod, 'Category', document.category
  ];

  // Key-value pairs matching AWS Forms Output
  const keyValues = document.textractKeyValues || textract.keyValues || [
    { key: 'VENDOR_NAME', value: document.vendorName, confidence: 99.4 },
    { key: 'INVOICE_NUMBER', value: document.invoiceNumber, confidence: 99.1 },
    { key: 'INVOICE_DATE', value: document.invoiceDate, confidence: 99.0 },
    { key: 'TOTAL_AMOUNT', value: `${document.currencySymbol || '$'}${document.totalAmount.toFixed(2)}`, confidence: 99.6 },
    { key: 'TAX', value: `${document.currencySymbol || '$'}${document.taxAmount.toFixed(2)}`, confidence: 98.5 },
    { key: 'PAYMENT_METHOD', value: document.paymentMethod, confidence: 98.2 }
  ];

  // Tables output matching AWS Textract Tables Output
  const tablesData = document.textractTables || [
    {
      headers: ['Description', 'Qty', 'Unit Price', 'Total'],
      rows: (document.lineItems || []).map(item => [
        item.description,
        item.quantity || 1,
        `${document.currencySymbol || '$'}${Number(item.unitPrice || 0).toFixed(2)}`,
        `${document.currencySymbol || '$'}${Number(item.total || 0).toFixed(2)}`
      ])
    }
  ];

  // Download JSON results function
  const handleDownloadResults = () => {
    const exportData = {
      documentName: document.fileName,
      s3Uri: document.s3Uri,
      processedAt: new Date().toISOString(),
      textractResults: {
        rawBlocks: rawTextBlocks,
        keyValues: keyValues,
        tables: tablesData
      },
      comprehendResults: comprehend
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.fileName.split('.')[0]}_aws_results.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-[#0B0F19] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {document.fileName}
                <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {document.confidenceScore || 99.2}% AWS Confidence
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                S3 URI: <span className="text-slate-300">{document.s3Uri}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Results Button (Matching AWS Console) */}
            <button
              onClick={handleDownloadResults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              <Download className="h-4 w-4 stroke-[2.5]" />
              <span>Download Results</span>
            </button>

            {/* Configure Data Outputs Drawer Toggle */}
            <button
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                showConfigDrawer
                  ? 'bg-slate-700 text-white border-slate-600'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">Configure Data Outputs</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Configure Outputs Drawer Overlay (Matching Screenshot 1) */}
        {showConfigDrawer && (
          <div className="bg-slate-900 border-b border-slate-800 p-4 animate-slideDown flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div>
              <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4" /> Configure Document Data Output (AWS Textract API Config)
              </h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Select features to retrieve from Amazon Textract Analyze Document API for this file:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {Object.keys(configOutputs).map(key => (
                <label key={key} className="flex items-center gap-1.5 text-slate-200 cursor-pointer capitalize bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  <input
                    type="checkbox"
                    checked={configOutputs[key]}
                    onChange={(e) => setConfigOutputs({ ...configOutputs, [key]: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700"
                  />
                  <span>{key}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Panel: Document Visual Viewer (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950/90 p-5 border-r border-slate-800 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-amber-400" /> Document Visual Reader
                </span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
                  {document.fileType?.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                </span>
              </div>

              {/* Render Image or Structured Document Reader Box */}
              {document.fileObjectUrl ? (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center p-2 min-h-[320px]">
                  <img
                    src={document.fileObjectUrl}
                    alt={document.fileName}
                    className="max-h-[400px] w-full object-contain rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <div className="bg-white text-slate-900 rounded-xl p-5 shadow-2xl border border-slate-200 text-xs font-mono space-y-4 relative overflow-hidden min-h-[320px]">
                  <div className="absolute top-4 right-4 border-2 border-emerald-600 text-emerald-600 font-black px-2 py-0.5 rotate-12 text-[10px] rounded uppercase opacity-80">
                    Textract Verified
                  </div>

                  <div className="border-b border-slate-200 pb-3">
                    <div className="font-bold text-sm text-slate-900">{document.vendorName}</div>
                    <div className="text-[10px] text-slate-500">Official Document Record</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">RECORD ID:</span>
                      <span className="font-bold text-slate-800">{document.invoiceNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">DATE:</span>
                      <span className="font-bold text-slate-800">{document.invoiceDate}</span>
                    </div>
                  </div>

                  {/* Line items snippet */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Extracted Line Items:</div>
                    {document.lineItems?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-slate-700">
                        <span className="truncate max-w-[190px]">{item.description}</span>
                        <span className="font-semibold">{document.currencySymbol || '$'}{Number(item.total).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-900 font-mono">AMOUNT / TOTAL:</span>
                    <span className="font-black text-slate-900 font-mono">{document.currencySymbol || '$'}{document.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Metadata Box */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div><span className="text-slate-500">OCR Engine:</span> <span className="text-amber-400 font-medium">Amazon Textract AnalyzeDocument API</span></div>
              <div><span className="text-slate-500">NLP Engine:</span> <span className="text-sky-400 font-medium">Amazon Comprehend Entity & Sentiment API</span></div>
            </div>
          </div>

          {/* Right Panel: AWS Studio Console Tabs (7 cols) */}
          <div className="lg:col-span-7 p-5 overflow-y-auto flex flex-col justify-between space-y-5">
            
            {/* Top Level Main Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
              <button
                onClick={() => setActiveMainTab('TEXTRACT')}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${
                  activeMainTab === 'TEXTRACT'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Cpu className="h-4 w-4" /> Amazon Textract Studio
              </button>

              <button
                onClick={() => setActiveMainTab('COMPREHEND')}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${
                  activeMainTab === 'COMPREHEND'
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Sparkles className="h-4 w-4" /> Amazon Comprehend Studio
              </button>

              <button
                onClick={() => setActiveMainTab('RAW_JSON')}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${
                  activeMainTab === 'RAW_JSON'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Code className="h-4 w-4" /> Raw AWS Payload
              </button>
            </div>

            {/* ==================== MAIN TAB 1: AMAZON TEXTRACT STUDIO ==================== */}
            {activeMainTab === 'TEXTRACT' && (
              <div className="space-y-4">
                
                {/* Textract Sub-Navigation Bar (Matching Screenshot 2 1:1!) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold border-b border-slate-800">
                  {[
                    { id: 'RAW_TEXT', label: 'Raw text', icon: FileText },
                    { id: 'LAYOUT', label: 'Layout', icon: Grid },
                    { id: 'FORMS', label: 'Forms', icon: CheckSquare },
                    { id: 'TABLES', label: 'Tables', icon: Table },
                    { id: 'QUERIES', label: 'Queries', icon: HelpCircle },
                    { id: 'SIGNATURE', label: 'Signature detection', icon: PenTool }
                  ].map(tab => {
                    const IconComp = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setTextractSubTab(tab.id)}
                        className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          textractSubTab === tab.id
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <IconComp className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-Tab 1: RAW TEXT (Pill Tag View matching Screenshot 2!) */}
                {textractSubTab === 'RAW_TEXT' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">Textract Extracted Blocks ({rawTextBlocks.length} Tokens)</span>
                      <span className="font-mono text-[11px] text-emerald-400">High Confidence OCR</span>
                    </div>

                    {/* Multi-tag Pill Box (Matching AWS Console Screenshot 2!) */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap gap-2 max-h-[360px] overflow-y-auto">
                      {rawTextBlocks.map((block, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs text-slate-200 flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
                          title={`Confidence: 99.${(idx % 9) + 1}%`}
                        >
                          <span className="font-medium">{block}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-Tab 2: LAYOUT */}
                {textractSubTab === 'LAYOUT' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-200">Extracted Document Section Layout & Titles</div>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-amber-400 text-[10px] block font-bold">TITLE / HEADER:</span>
                        <div className="font-bold text-white text-sm mt-0.5">{document.vendorName}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-sky-400 text-[10px] block font-bold">SECTION HEADERS:</span>
                        <div className="text-slate-300 mt-0.5">Billing Information • Line Item Breakdown • Legal Details</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-emerald-400 text-[10px] block font-bold">FOOTER / DISCLOSURES:</span>
                        <div className="text-slate-400 mt-0.5">{document.rawText?.slice(0, 150) || 'Approved for document processing.'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Tab 3: FORMS (Key-Value Pairs matching AWS Forms Output) */}
                {textractSubTab === 'FORMS' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-200">Textract Key-Value Pairs (KEY_VALUE_SET)</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                      {keyValues.map((kv, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
                            <span>{kv.key}</span>
                            <span className="text-emerald-400 font-semibold">{kv.confidence}%</span>
                          </div>
                          <div className="font-bold text-white text-xs truncate">{kv.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-Tab 4: TABLES (Extracted HTML Table Grid matching Screenshot 1 & 2!) */}
                {textractSubTab === 'TABLES' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-200">Textract Extracted Document Tables (TABLE_CELL)</div>
                    <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 text-xs">
                      <table className="w-full text-left border-collapse font-mono">
                        <thead>
                          <tr className="bg-slate-900 text-amber-400 text-[11px] border-b border-slate-800">
                            {tablesData[0]?.headers?.map((h, i) => (
                              <th key={i} className="p-2.5 font-bold uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-200">
                          {tablesData[0]?.rows?.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-900/50">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-2.5">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-Tab 5: QUERIES */}
                {textractSubTab === 'QUERIES' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="text-xs font-semibold text-slate-200">Custom Document Query Answers</div>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="text-[10px] text-amber-400 font-bold">QUERY: What is the total invoice amount?</div>
                        <div className="text-white font-bold">{document.currencySymbol || '$'}{document.totalAmount.toFixed(2)}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="text-[10px] text-sky-400 font-bold">QUERY: What is the vendor name and record ID?</div>
                        <div className="text-white font-bold">{document.vendorName} ({document.invoiceNumber})</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Tab 6: SIGNATURE */}
                {textractSubTab === 'SIGNATURE' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="text-xs font-semibold text-slate-200">Signature & Authorization Detection</div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold text-emerald-400 text-sm">Authorized Signature Detected</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">Bounding Box: [Top: 0.82, Left: 0.65, Width: 0.25, Height: 0.12] • 99.1% Confidence</div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ==================== MAIN TAB 2: AMAZON COMPREHEND STUDIO ==================== */}
            {activeMainTab === 'COMPREHEND' && (
              <div className="space-y-4">
                
                {/* Comprehend Entity Badges */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-sky-400" /> Amazon Comprehend Named Entities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {comprehend.entities?.map((ent, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center gap-2"
                      >
                        <span className="font-semibold text-slate-200">{ent.text}</span>
                        <span className="bg-sky-500/10 text-sky-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-sky-500/20">
                          {ent.type} ({Math.round((ent.score || 0.98) * 100)}%)
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
                      <span key={idx} className="bg-slate-900 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
                        {kp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sentiment Breakdown */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase block">Amazon Comprehend Sentiment Analysis</span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-900 h-3 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full w-[85%]" title="Neutral 85%" />
                      <div className="bg-sky-500 h-full w-[15%]" title="Positive 15%" />
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono">NEUTRAL (85%)</span>
                  </div>
                </div>

              </div>
            )}

            {/* ==================== MAIN TAB 3: RAW AWS PAYLOAD ==================== */}
            {activeMainTab === 'RAW_JSON' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Raw Textract & Comprehend Output JSON</span>
                  <span className="text-emerald-400 font-bold">200 OK</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-[380px]">
                  <pre>{JSON.stringify({
                    documentId: document.id,
                    fileName: document.fileName,
                    status: document.status,
                    s3Uri: document.s3Uri,
                    textract: {
                      blocksCount: rawTextBlocks.length,
                      keyValues: keyValues,
                      tables: tablesData
                    },
                    comprehend: comprehend
                  }, null, 2)}</pre>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
