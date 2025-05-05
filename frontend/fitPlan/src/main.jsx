document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.bundle"
import "bootstrap-icons/font/bootstrap-icons.css"
/* import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // זה כולל את Popper.js */

import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Modal from "react-modal";
import { ThemeProvider } from './context/themeContext.jsx';
import { AuthProvider } from './context/auth.context.jsx';
import { PlanProvider } from './context/plan.context.jsx';
import { TraineesProvider } from './context/trainee.context.jsx';

Modal.setAppElement('#root');


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter >
        <AuthProvider>
          <TraineesProvider>
            <PlanProvider>

              <App />

            </PlanProvider>
          </TraineesProvider>
        </AuthProvider>
      </BrowserRouter >
    </ThemeProvider>
  </StrictMode>
)
