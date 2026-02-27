import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import BaseLayout from './layout/BaseLayout';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import MedicationPage from './pages/MedicationPage';
import MedicationDetailPage from './pages/MedicationDetailPage';
import { ENABLE_LOGIN } from './utils/constants';

import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { 
        path: '/dashboard', 
        element: ENABLE_LOGIN ? <ProtectedRoute><DashboardPage /></ProtectedRoute> : <DashboardPage />
      },
      { 
        path: '/medications', 
        element: ENABLE_LOGIN ? <ProtectedRoute><MedicationPage /></ProtectedRoute> : <MedicationPage />
      },
      { 
        path: '/medication/:name', 
        element: ENABLE_LOGIN ? <ProtectedRoute><MedicationDetailPage /></ProtectedRoute> : <MedicationDetailPage />
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;