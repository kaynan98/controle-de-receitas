import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Index } from '@/pages/Index';
import { BlankPage } from '@/pages/BlankPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
