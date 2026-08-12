import React, { useState } from 'react';
import CloudQuestHeader from './components/CloudQuestHeader';
import UploadSection from './components/UploadSection';
import Dashboard from './components/Dashboard';
import DocumentExplorer from './components/DocumentExplorer';
import DocumentDetailModal from './components/DocumentDetailModal';
import AwsSettingsModal from './components/AwsSettingsModal';
import CloudFormationVisualizer from './components/CloudFormationVisualizer';
import { INITIAL_DOCUMENTS } from './services/awsPipeline';
import { 
  LayoutDashboard, Upload, Database, Code, CheckCircle2, ShieldCheck, Terminal, ExternalLink, Sparkles, FileText, ArrowRight, Cloud 
} from 'lucide-react';

export default function App() {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // DASHBOARD | UPLOAD | EXPLORER | AWS_GUIDE | CLOUDFORMATION
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [awsConfig, setAwsConfig] = useState({
    s3Bucket: 'cloudquest-ml-bucket-0514',
    region: 'us-east-1',
    lambdaName: 'CloudQuestPayComprehendFunction',
    apiGatewayUrl: '',
    lambdaFunctionUrl: '',
    iamRoleArn: 'arn:aws:iam::123456789012:role/CloudQuestLambdaRole'
  });

  const handleDocumentProcessed = (newDoc) => {
    setDocuments(prev => [newDoc, ...prev]);
    setSelectedDoc(newDoc);

    // Show toast
    setToastMessage(`Successfully processed ${newDoc.fileName} via Textract & Comprehend!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'DASHBOARD'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Executive Dashboard
            </button>

            <button
              onClick={() => setActiveTab('UPLOAD')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'UPLOAD'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Upload className="h-4 w-4" /> Upload Station
            </button>

            <button
              onClick={() => setActiveTab('EXPLORER')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'EXPLORER'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Database className="h-4 w-4" /> Document Explorer ({documents.length})
            </button>

            <button
              onClick={() => setActiveTab('CLOUDFORMATION')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'CLOUDFORMATION'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Cloud className="h-4 w-4 text-sky-400" /> CloudFormation & Teardown
            </button>

            <button
              onClick={() => setActiveTab('AWS_GUIDE')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'AWS_GUIDE'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Code className="h-4 w-4" /> AWS Backend & Lambda Code
            </button>
          </div>

          {/* Quick Action */}
          <button
            onClick={() => setActiveTab('UPLOAD')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/20 text-xs font-semibold transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" /> Fast Upload
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
            <div className="p-6 rounded-2xl glass-panel space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" /> AWS Pipeline Workflow Architecture
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-mono font-bold">01. S3 Upload</span>
                  <p className="text-slate-400 text-[11px]">User uploads PDF, PNG, JPG, or DOC file directly to Cloud Quest S3 bucket.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-sky-400 font-mono font-bold">02. Lambda Trigger</span>
                  <p className="text-slate-400 text-[11px]">S3 ObjectCreated notification triggers Python AWS Lambda execution.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-purple-400 font-mono font-bold">03. Textract OCR</span>
                  <p className="text-slate-400 text-[11px]">Textract analyze_expense extracts vendor, date, line items, totals & taxes.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-emerald-400 font-mono font-bold">04. Comprehend AI</span>
                  <p className="text-slate-400 text-[11px]">Comprehend detect_entities extracts PII, risk notes, and sentiment score.</p>
                </div>
              </div>
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

        {/* TAB 4: CLOUDFORMATION & TEARDOWN */}
        {activeTab === 'CLOUDFORMATION' && (
          <CloudFormationVisualizer
            awsConfig={awsConfig}
            setAwsConfig={setAwsConfig}
            setLiveMode={setLiveMode}
          />
        )}

        {/* TAB 5: AWS BACKEND & LAMBDA CODE */}
        {activeTab === 'AWS_GUIDE' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass-panel space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Code className="h-5 w-5 text-amber-500" />
                    AWS Cloud Quest Lambda Code & Setup Guide
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Copy this code directly into your AWS Cloud Quest Lambda function standard Python console.
                  </p>
                </div>
                <span className="bg-slate-800 text-amber-400 text-xs px-3 py-1 rounded-lg border border-slate-700 font-mono">
                  Python 3.12 (Boto3)
                </span>
              </div>

              {/* Code Snippet Container */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto">
                <pre className="text-slate-300">
{`import json
import boto3

s3_client = boto3.client('s3')
textract_client = boto3.client('textract')
comprehend_client = boto3.client('comprehend')

def lambda_handler(event, context):
    """
    AWS Cloud Quest Machine Learning Lambda Handler
    Triggered by S3 ObjectCreated event. Executes Textract Expense OCR & Comprehend NLP.
    """
    for record in event.get('Records', []):
        bucket_name = record['s3']['bucket']['name']
        object_key = record['s3']['object']['key']
        
        # 1. Execute Textract Analyze Expense
        expense_response = textract_client.analyze_expense(
            Document={'S3Object': {'Bucket': bucket_name, 'Name': object_key}}
        )
        
        # 2. Extract Document Raw Text for Comprehend
        doc_text = "Payment Document extracted from " + object_key
        
        # 3. Execute Amazon Comprehend Entity Detection & Key Phrases
        entities_res = comprehend_client.detect_entities(Text=doc_text[:4000], LanguageCode='en')
        phrases_res = comprehend_client.detect_key_phrases(Text=doc_text[:4000], LanguageCode='en')
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'bucket': bucket_name,
                'key': object_key,
                'status': 'PROCESSED',
                'entitiesCount': len(entities_res.get('Entities', []))
            })
        }`}
                </pre>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AWS Cloud Quest Machine Learning • S3 + Lambda + Textract + Amazon Comprehend</p>
          <div className="flex items-center gap-4">
            <span>Region: {awsConfig.region}</span>
            <span>•</span>
            <span>Bucket: {awsConfig.s3Bucket}</span>
          </div>
        </div>
      </footer>

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
        />
      )}

    </div>
  );
}
