import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("UI crash captured by ErrorBoundary", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="mx-auto mt-10 max-w-xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm">
            The UI crashed unexpectedly. Please refresh the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
