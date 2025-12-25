
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 手机端调试辅助：捕获并显示初始化错误
window.onerror = function(message, source, lineno, colno, error) {
  const display = document.getElementById('error-display');
  if (display) {
    display.style.display = 'block';
    display.innerHTML = `Error: ${message} at ${lineno}:${colno}`;
  }
  return false;
};

const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    const display = document.getElementById('error-display');
    if (display) {
      display.style.display = 'block';
      display.innerHTML = `Render Error: ${err.message}`;
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
