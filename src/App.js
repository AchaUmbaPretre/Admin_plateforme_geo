import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import NotFound from './pages/notFound/NotFound';
import Donnees from './pages/donnees/Donnees';
import Paiement from './pages/paiement/Paiement';
import Utilisateur from './pages/utilisateur/Utilisateur';

  const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/donnees', element: <Donnees /> },
      { path: '/paiement', element: <Paiement /> },
      { path: '/utilisateurs', element: <Utilisateur /> },
      { path: '*', element: <NotFound /> }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
