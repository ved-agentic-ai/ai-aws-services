import React, { useState } from 'react';
import CloudQuestHeader from './components/CloudQuestHeader';
import UploadSection from './components/UploadSection';
import Dashboard from './components/Dashboard';
import DocumentExplorer from './components/DocumentExplorer';
import DocumentDetailModal from './components/DocumentDetailModal';
import AwsSettingsModal from './components/AwsSettingsModal';
import CloudFormationVisualizer from './components/CloudFormationVisualizer';
import AwsBackendCodeGuide from './components/AwsBackendCodeGuide';
import ArchitectureView from './components/ArchitectureView';
import PaidServicesModal from './components/PaidServicesModal';
import StandbyHeroView from './components/StandbyHeroView';
import { INITIAL_DOCUMENTS } from './services/awsPipeline';
import { 
  LayoutDashboard, Upload, Database, Code, CheckCircle2, ShieldCheck, Terminal, ExternalLink, Sparkles, FileText, ArrowRight, Cloud, Layers, DollarSign, ChevronDown, ChevronRight
} from 'lucide-react';

export default function App() {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // DASHBOARD | UPLOAD | EXPLORER | ARCHITECTURE | AWS_GUIDE | CLOUDFORMATION
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPaidServicesModalOpen, setIsPaidServicesModalOpen] = useState(false);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false); // CLOSED BY DEFAULT
  const [enabledServices, setEnabledServices] = useState({
    bedrockGenAi: true,
    sageMakerMl: false,
    fraudDetector: false,
    kendraSearch: false
  });
  const [liveMode, setLiveModeState] = useState(() => {
    try {
      const savedMode = localStorage.getItem('cloudquest_live_mode');
      if (savedMode !== null) return savedMode === 'true';
    } catch (e) {}
    return true;
  });

  const [toastMessage, setToastMessage] = useState(null);

  const [awsConfig, setAwsConfigState] = useState(() => {
    try {
      const saved = localStorage.getItem('cloudquest_aws_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      s3Bucket: 'payment-ai-stack-paymentdocumentbucket-yjxtkpxjyr63',
      region: 'us-east-1',
      lambdaName: 'PaymentDocProcessorFunction-dev',
      apiGatewayUrl: 'https://v0hkwd2dj4.execute-api.us-east-1.amazonaws.com/analyze-document',
      lambdaFunctionUrl: '',
      iamRoleArn: 'arn:aws:iam::639154179334:role/PaymentDocProcessorRole'
    };
  });

  const setAwsConfig = (newConfig) => {
    setAwsConfigState(newConfig);
    try {
      localStorage.setItem('cloudquest_aws_config', JSON.stringify(newConfig));
    } catch (e) {}
  };

  const setLiveMode = (mode) => {
    setLiveModeState(mode);
    try {
      localStorage.setItem('cloudquest_live_mode', String(mode));
    } catch (e) {}
  };

  const handleResetAwsConfig = () => {
    try {
      localStorage.removeItem('cloudquest_aws_config');
      localStorage.removeItem('cloudquest_live_mode');
    } catch (e) {}
    setAwsConfigState({
      s3Bucket: '',
      region: 'us-east-1',
      lambdaName: '',
      apiGatewayUrl: '',
      lambdaFunctionUrl: '',
      accessKeyId: '',
      secretAccessKey: ''
    });
    setLiveModeState(false);
  };

  const handleDocumentProcessed = (newDoc) => {
    setDocuments(prev => [newDoc, ...prev]);
    setSelectedDoc(newDoc);

    // Show toast
    setToastMessage(`Successfully processed ${newDoc.fileName} via Textract & Comprehend!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(prevTab => prevTab === tabName ? null : tabName);
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header */}
      <CloudQuestHeader
        awsConfig={awsConfig}
        setAwsConfig={setAwsConfig}
        openSettings={() => setIsSettingsOpen(true)}
        liveMode={liveMode}
        setLiveMode={setLiveMode}
        documentCount={documents.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6 overflow-x-hidden">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800">
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => handleTabClick('DASHBOARD')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'DASHBOARD'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </button>

            <button
              onClick={() => handleTabClick('UPLOAD')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'UPLOAD'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Upload className="h-4 w-4" /> Upload
            </button>

            <button
              onClick={() => handleTabClick('EXPLORER')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'EXPLORER'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Database className="h-4 w-4" /> Explorer ({documents.length})
            </button>

            <button
              onClick={() => handleTabClick('ARCHITECTURE')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ARCHITECTURE'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Layers className="h-4 w-4 text-amber-400" /> Architecture & ROI
            </button>

            <button
              onClick={() => handleTabClick('CLOUDFORMATION')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'CLOUDFORMATION'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Cloud className="h-4 w-4 text-sky-400" /> CloudFormation
            </button>

            <button
              onClick={() => handleTabClick('AWS_GUIDE')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'AWS_GUIDE'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Code className="h-4 w-4" /> Lambda Code
            </button>
          </div>

          {/* Heavy Services Safeguard Action Button */}
          <button
            onClick={() => setIsPaidServicesModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer flex-shrink-0"
          >
            <DollarSign className="h-3.5 w-3.5" /> Heavy Services Safeguard
          </button>
        </div>

        {/* Toast Alert Banner */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-xl animate-fadeIn">
            <div className="flex items-center gap-2.5 font-medium">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className="text-amber-400 hover:underline font-bold flex items-center gap-1"
            >
              View Analytics <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            <UploadSection
              onDocumentProcessed={handleDocumentProcessed}
              awsConfig={awsConfig}
              liveMode={liveMode}
            />
            <Dashboard
              documents={documents}
              onSelectDocument={setSelectedDoc}
            />
          </div>
        )}

        {/* TAB 2: UPLOAD STATION */}
        {activeTab === 'UPLOAD' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <UploadSection
              onDocumentProcessed={handleDocumentProcessed}
              awsConfig={awsConfig}
              liveMode={liveMode}
            />
            {/* Collapsible Workflow Panel */}
            <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden transition-all">
              <button
                onClick={() => setIsWorkflowOpen(!isWorkflowOpen)}
                className="w-full p-4 bg-slate-900/90 hover:bg-slate-900 flex items-center justify-between transition-colors text-left cursor-pointer"
              >
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-400" /> AWS Pipeline Workflow Architecture
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-normal">
                    {isWorkflowOpen ? 'Click to Collapse' : 'Click to View 4-Step Pipeline Flow'}
                  </span>
                </h3>
                <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                  {isWorkflowOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </button>

              {isWorkflowOpen && (
                <div className="p-5 border-t border-slate-800 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-amber-400 font-mono font-bold">01. S3 Upload</span>
                      <p className="text-slate-400 text-[11px]">User uploads PDF, PNG, JPG, or DOC file directly to Cloud Quest S3 bucket.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-sky-400 font-mono font-bold">02. Lambda Trigger</span>
                      <p className="text-slate-400 text-[11px]">S3 ObjectCreated notification triggers Python AWS Lambda execution.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-purple-400 font-mono font-bold">03. Textract OCR</span>
                      <p className="text-slate-400 text-[11px]">Textract analyze_expense extracts vendor, date, line items, totals & taxes.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-emerald-400 font-mono font-bold">04. Comprehend AI</span>
                      <p className="text-slate-400 text-[11px]">Comprehend detect_entities extracts PII, risk notes, and sentiment score.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENT EXPLORER */}
        {activeTab === 'EXPLORER' && (
          <DocumentExplorer
            documents={documents}
            onSelectDocument={setSelectedDoc}
          />
        )}

        {/* TAB 4: ARCHITECTURE & ROI SPEC */}
        {activeTab === 'ARCHITECTURE' && (
          <ArchitectureView
            onOpenPaidServicesModal={() => setIsPaidServicesModalOpen(true)}
            enabledServices={enabledServices}
          />
        )}

        {/* TAB 5: CLOUDFORMATION & TEARDOWN */}
        {activeTab === 'CLOUDFORMATION' && (
          <CloudFormationVisualizer
            awsConfig={awsConfig}
            setAwsConfig={setAwsConfig}
            setLiveMode={setLiveMode}
          />
        )}

        {/* TAB 6: AWS BACKEND & LAMBDA CODE */}
        {activeTab === 'AWS_GUIDE' && (
          <AwsBackendCodeGuide />
        )}

        {/* STANDBY HERO COMMAND CENTER VIEW (WHEN ALL TABS ARE COLLAPSED) */}
        {!activeTab && (
          <StandbyHeroView
            onSelectTab={(tab) => setActiveTab(tab)}
            onOpenPaidServicesModal={() => setIsPaidServicesModalOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AWS Cloud Quest Machine Learning • S3 + Lambda + Textract + Amazon Comprehend + Bedrock</p>
          <div className="flex items-center gap-4">
            <span>Region: {awsConfig.region}</span>
            <span>•</span>
            <span>Bucket: {awsConfig.s3Bucket}</span>
          </div>
        </div>
      </footer>

      {/* Heavy Services Cost & Confirmation Safeguard Modal */}
      <PaidServicesModal
        isOpen={isPaidServicesModalOpen}
        onClose={() => setIsPaidServicesModalOpen(false)}
        onConfirm={(services) => setEnabledServices(services)}
        enabledServices={enabledServices}
        setEnabledServices={setEnabledServices}
      />

      {/* Document Detail Modal */}
      {selectedDoc && (
        <DocumentDetailModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}

      {/* AWS Settings Modal */}
      {isSettingsOpen && (
        <AwsSettingsModal
          awsConfig={awsConfig}
          setAwsConfig={setAwsConfig}
          onClose={() => setIsSettingsOpen(false)}
          liveMode={liveMode}
          setLiveMode={setLiveMode}
          onResetConfig={handleResetAwsConfig}
        />
      )}

    </div>
  );
}
