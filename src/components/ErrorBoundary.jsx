import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/40 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center text-xl font-bold">
              ⚠️
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Document Detail Render Notice</h3>
              <p className="text-xs text-slate-400 mt-1">
                {this.state.error?.message || 'An unexpected rendering error occurred while loading this document.'}
              </p>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onReset) this.props.onReset();
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
            >
              Close & Return
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
