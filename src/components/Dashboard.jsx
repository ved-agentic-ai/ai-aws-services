import React from 'react';
import { 
  DollarSign, FileCheck, Building2, ShieldAlert, Sparkles, TrendingUp, CreditCard, PieChart as PieIcon, CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';

export default function Dashboard({ documents, onSelectDocument }) {
  // Aggregate Metrics
  const totalSpent = documents.reduce((sum, doc) => sum + (doc.totalAmount || 0), 0);
  const totalCount = documents.length;
  const avgConfidence = (
    documents.reduce((sum, doc) => sum + (doc.confidenceScore || 90), 0) / (totalCount || 1)
  ).toFixed(1);

  // Vendor Aggregation
  const vendorMap = {};
  documents.forEach(doc => {
    const v = doc.vendorName || 'Unknown Vendor';
    vendorMap[v] = (vendorMap[v] || 0) + doc.totalAmount;
  });
  
  const topVendor = Object.keys(vendorMap).reduce((a, b) => vendorMap[a] > vendorMap[b] ? a : b, 'N/A');
  const topVendorAmount = vendorMap[topVendor] || 0;

  // Category Distribution for Chart
  const categoryMap = {};
  documents.forEach(doc => {
    const cat = doc.category || 'General';
    categoryMap[cat] = (categoryMap[cat] || 0) + doc.totalAmount;
  });

  const categoryChartData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: Number(categoryMap[key].toFixed(2))
  }));

  const COLORS = ['#FF9900', '#38BDF8', '#10B981', '#F43F5E', '#A855F7', '#F59E0B'];

  // Vendor Bar Chart Data
  const vendorChartData = Object.keys(vendorMap).map(key => ({
    name: key.length > 18 ? key.substring(0, 18) + '...' : key,
    amount: Number(vendorMap[key].toFixed(2))
  })).sort((a, b) => b.amount - a.amount).slice(0, 5);

  // Timeline Area Chart Data
  const timelineData = documents.map(doc => ({
    date: doc.invoiceDate || doc.uploadDate.split('T')[0],
    amount: doc.totalAmount,
    vendor: doc.vendorName
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Risk Flagged Documents
  const riskDocs = documents.filter(doc => doc.comprehendInsights?.riskFlag || doc.status === 'NEEDS_REVIEW');

  return (
    <div className="space-y-6">
      
      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        
        {/* Metric 1: Total Spending */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Processed</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-amber-400/90 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="h-3.5 w-3.5" /> Across {totalCount} payment files
            </p>
          </div>
        </div>

        {/* Metric 2: Document Count */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden group hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Analyzed Files</span>
            <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <FileCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{totalCount}</h3>
            <p className="text-xs text-slate-400 mt-1">PDFs, Images & Word Docs</p>
          </div>
        </div>

        {/* Metric 3: Top Vendor */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Spend Vendor</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-bold text-white truncate" title={topVendor}>{topVendor}</h3>
            <p className="text-xs text-emerald-400 font-semibold mt-1">
              ${topVendorAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Metric 4: Textract Confidence */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">OCR Confidence</span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{avgConfidence}%</h3>
            <p className="text-xs text-slate-400 mt-1">Textract Expense Engine</p>
          </div>
        </div>

        {/* Metric 5: Risk Flags */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden group hover:border-rose-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Comprehend Alerts</span>
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
              riskDocs.length > 0 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{riskDocs.length}</h3>
            <p className="text-xs text-rose-400 mt-1 font-medium">
              {riskDocs.length > 0 ? 'Needs manual review' : 'No risk flags detected'}
            </p>
          </div>
        </div>

      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area Chart: Spending Timeline */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                Payment Expense Timeline
              </h3>
              <p className="text-xs text-slate-400">Expenditure flow calculated from extracted document dates</p>
            </div>
            <span className="text-xs font-mono bg-slate-800 text-amber-400 px-2.5 py-1 rounded-lg border border-slate-700">
              USD ($)
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="amberGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF9900" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FF9900" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`$${val.toFixed(2)}`, 'Total Amount']}
                />
                <Area type="monotone" dataKey="amount" stroke="#FF9900" strokeWidth={3} fillOpacity={1} fill="url(#amberGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Spending by Category */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-sky-400" />
              Expense Category Breakdown
            </h3>
            <p className="text-xs text-slate-400">Categorized by Amazon Comprehend NLP</p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`$${val.toFixed(2)}`, 'Spend']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend list */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {categoryChartData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center gap-2 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate">{cat.name}:</span>
                <span className="font-semibold text-white ml-auto">${cat.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Vendor Spend Bar Chart & Recent Risk Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart: Top Vendors */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-400" />
            Top Vendors by Spend Amount
          </h3>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorChartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v}`} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`$${val.toFixed(2)}`, 'Total Vendor Spend']}
                />
                <Bar dataKey="amount" fill="#38BDF8" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comprehend NLP Insights Alert List */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Comprehend AI Highlights
            </h3>
            <span className="text-xs text-slate-400">Live Scans</span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {documents.slice(0, 4).map(doc => (
              <div 
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-200 truncate flex-1" title={doc.vendorName}>
                    {doc.vendorName}
                  </span>
                  <span className="text-amber-400 font-bold flex-shrink-0 font-mono">
                    {doc.currencySymbol || '$'}{doc.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[10px]">
                    {doc.comprehendInsights?.sentiment || 'NEUTRAL'}
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] font-semibold">
                    {doc.ucRiskEngine?.riskClassLabel || 'Riskklass 5 (Guld)'}
                  </span>
                </div>
                {doc.comprehendInsights?.riskFlag && (
                  <p className="text-[11px] text-rose-400 font-medium bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
                    ⚠️ {doc.comprehendInsights.riskNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
