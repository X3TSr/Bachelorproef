import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './general-css/styles.css'
import './general-js/scripts.js'

import App from './App.jsx'

// Create the root of the React app (this is so we can add classes or id if needed)
const htmlRoot = document.getElementById('root');
const root = createRoot(htmlRoot);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
