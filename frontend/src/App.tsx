import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import BaseLayout from './layout/BaseLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import MedicationPage from './pages/MedicationPage';

import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/medications', element: <MedicationPage /> },
      //{ path: '/medication/:name', element: <MedicationDetailPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;