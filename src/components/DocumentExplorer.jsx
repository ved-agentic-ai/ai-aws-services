import React, { useState } from 'react';
import { Search, Filter, FileText, ArrowUpDown, ChevronRight, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

export default function DocumentExplorer({ documents, onSelectDocument }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  // Categories list
  const categories = ['ALL', ...new Set(documents.map(d => d.category))];

  // Filtered and Sorted Documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || doc.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.invoiceDate) - new Date(a.invoiceDate);
    if (sortBy === 'date-asc') return new Date(a.invoiceDate) - new Date(b.invoiceDate);
    if (sortBy === 'amount-desc') return b.totalAmount - a.totalAmount;
    if (sortBy === 'amount-asc') return a.totalAmount - b.totalAmount;
    return 0;
  });

  return (
    <div className="space-y-4">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by vendor name, invoice number, or file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          
          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-200">{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="PROCESSED" className="bg-slate-900">Processed</option>
              <option value="NEEDS_REVIEW" className="bg-slate-900">Needs Review</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
            <ArrowUpDown className="h-3.5 w-3.5 text-amber-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="date-desc" className="bg-slate-900">Newest Date</option>
              <option value="date-asc" className="bg-slate-900">Oldest Date</option>
              <option value="amount-desc" className="bg-slate-900">Highest Spend</option>
              <option value="amount-asc" className="bg-slate-900">Lowest Spend</option>
            </select>
          </div>

        </div>

      </div>

      {/* Documents Table */}
      <div className="overflow-x-auto rounded-2xl glass-panel border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Document File</th>
              <th className="py-3.5 px-4">Vendor & Invoice #</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Total Amount</th>
              <th className="py-3.5 px-4">Payment Method</th>
              <th className="py-3.5 px-4">OCR Confidence</th>
              <th className="py-3.5 px-4">Status & Risk</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => {
                const isRisk = doc.comprehendInsights?.riskFlag || doc.status === 'NEEDS_REVIEW';

                return (
                  <tr
                    key={doc.id}
                    onClick={() => onSelectDocument(doc)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    {/* File Info */}
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
                            {doc.fileName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{doc.fileSize}</div>
                        </div>
                      </div>
                    </td>

                    {/* Vendor & Invoice */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{doc.vendorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{doc.invoiceNumber}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 font-medium text-[11px]">
                        {doc.category}
                      </span>
                    </td>

                    {/* Invoice Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {doc.invoiceDate}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-amber-400 text-sm">
                        ${doc.totalAmount.toFixed(2)}
                      </span>
                      {doc.taxAmount > 0 && (
                        <div className="text-[10px] text-slate-400">Tax: ${doc.taxAmount.toFixed(2)}</div>
                      )}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                      {doc.paymentMethod}
                    </td>

                    {/* Confidence Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full"
                            style={{ width: `${doc.confidenceScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-300 text-[11px]">{doc.confidenceScore}%</span>
                      </div>
                    </td>

                    {/* Status & Risk */}
                    <td className="py-3.5 px-4">
                      {isRisk ? (
                        <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">
                          <AlertTriangle className="h-3 w-3" /> Needs Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> Processed
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-12 text-slate-400">
                  No payment documents found matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
