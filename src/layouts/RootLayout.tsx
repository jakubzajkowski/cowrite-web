import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
