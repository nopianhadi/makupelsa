import React from 'react';
import Icon from './AppIcon';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="AlertTriangle" size={32} color="var(--color-error)" />
            </div>
            
            <h2 className="text-xl font-heading font-bold text-foreground mb-2">
              Oops! Terjadi Kesalahan
            </h2>
            
            <p className="text-sm text-muted-foreground mb-6">
              Aplikasi mengalami error. Silakan refresh halaman atau hubungi support jika masalah berlanjut.
            </p>

            {this.state.error && (
              <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-lg text-left">
                <p className="text-xs font-mono text-error break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
