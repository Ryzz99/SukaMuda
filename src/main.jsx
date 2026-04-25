import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // TAMBAHAN BARU
import App from './App.jsx'
import './index.css'
import './utils/axiosConfig.js' 

// TAMBAHAN BARU: SETTINGAN SUPER CEPAT
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data dianggap segar selama 5 menit
      cacheTime: 1000 * 60 * 10, // Disimpan di memori selama 10 menit
      refetchOnWindowFocus: false, // Jangan fetch ulang saat user pindah tab
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BUNGKUS DENGAN INI */}
    <QueryClientProvider client={queryClient}>
      <BrowserRouter> 
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)