import NavBar from '@/components/NavBar';
import { LooksProvider } from '@/contexts/LooksContext';
import { ProductsProvider } from '@/contexts/ProductsContext';
import { MoodBoardProvider } from '@/contexts/MoodBoardContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LooksProvider>
      <ProductsProvider>
        <MoodBoardProvider>
          <NavBar />
          {children}
        </MoodBoardProvider>
      </ProductsProvider>
    </LooksProvider>
  );
}
