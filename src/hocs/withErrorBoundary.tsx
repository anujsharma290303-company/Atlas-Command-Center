import React from "react";

interface ErrorState {
  hasError: boolean;
  error: Error | null;
}

interface WithErrorBoundaryOptions {
  fallback?: (error: Error | null, retry: () => void) => React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

const withErrorBoundary =
  <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options: WithErrorBoundaryOptions = {}
  ) => {
    const { fallback, onError } = options;

    class ErrorBoundary extends React.Component<P, ErrorState> {
      static displayName = `WithErrorBoundary(${
        WrappedComponent.displayName ?? WrappedComponent.name
      })`;

      constructor(props: P) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error: Error): ErrorState {
        return { hasError: true, error };
      }

      componentDidCatch(error: Error, info: React.ErrorInfo) {
        onError?.(error, info);
      }

      handleRetry = () => {
        this.setState({ hasError: false, error: null });
      };

      render() {
        if (this.state.hasError) {
          if (fallback) {
            return fallback(this.state.error, this.handleRetry);
          }

          return (
            <div className="bg-slate-900 border border-red-500/30 rounded-xl p-6 text-white shadow-md flex flex-col items-center justify-center min-h-32 gap-3">
              <p className="text-red-400 text-sm font-medium">
                ⚠️ Something went wrong
              </p>
              {this.state.error && (
                <p className="text-gray-500 text-xs text-center">
                  {this.state.error.message}
                </p>
              )}
              <button
                onClick={this.handleRetry}
                className="px-4 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium transition"
              >
                Retry
              </button>
            </div>
          );
        }

        return <WrappedComponent {...this.props} />;
      }
    }

    return ErrorBoundary;
  };

export default withErrorBoundary;