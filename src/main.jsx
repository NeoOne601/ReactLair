import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { ThemeProvider } from './context/ThemeContext'
import App from './App'
import './index.css'

// This file is the main entry point, as described in your plan
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provides the Redux store to the entire app */}
    <Provider store={store}>
      {/* Provides the Theme (light/dark) to the entire app */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
