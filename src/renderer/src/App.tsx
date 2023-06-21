import './styles/global.css'

import { Routes } from './routes'
import { queryClient } from './services/react-query'

import { QueryClientProvider } from '@tanstack/react-query'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  )
}
