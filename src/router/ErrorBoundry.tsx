


// ErrorBoundary.tsx
import React from 'react';
import ErrorPage from '../Pages/ErrorPage';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error loading module:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage 
          status="500" 
          message="Erreur de chargement de la page"
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;