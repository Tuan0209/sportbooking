import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './index.css' // Đảm bảo đã cài Tailwind CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)