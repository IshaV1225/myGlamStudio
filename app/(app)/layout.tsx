import NavBar from '@/components/NavBar';
import { LooksProvider } from '@/contexts/LooksContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LooksProvider>
      <NavBar />
      {children}
    </LooksProvider>
  );
}
