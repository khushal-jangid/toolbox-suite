import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#fff', color: '#000', minHeight: '100vh' }}>
          <h2 style={{ color: '#dc2626' }}>Application Render Error:</h2>
          <pre style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontSize: '13px' }}>
            {this.state.error?.toString()}
          </pre>
          <p style={{ marginTop: '16px', fontSize: '14px', color: '#475569' }}>
            Stack trace:
          </p>
          <pre style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontSize: '11px', color: '#64748b' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Reset Storage & Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
