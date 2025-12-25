
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Fatal: Could not find root element to mount to");
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// 确保在 DOM 加载完成后运行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
