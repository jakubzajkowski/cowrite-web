import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/router';
import { initializeAuth } from '@/lib/api';

function App() {
  useEffect(() => {
    // Initialize auth token from localStorage on app start
    initializeAuth();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
