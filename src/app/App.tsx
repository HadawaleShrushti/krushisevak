import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CropsProvider } from './contexts/CropsContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CropsProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </CropsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}