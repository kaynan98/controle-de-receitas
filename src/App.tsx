import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Index } from '@/pages/Index';
import { BlankPage } from '@/pages/BlankPage';
import { Pacientes } from '@/pages/Pacientes';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blank" element={<BlankPage />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
