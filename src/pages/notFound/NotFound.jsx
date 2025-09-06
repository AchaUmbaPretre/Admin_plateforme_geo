import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '100px' }}>
    <h1>404</h1>
    <p>Oups ! La page que vous cherchez n'existe pas.</p>
    <Link to="/" style={{ color: '#007bff' }}>Retour à l'accueil</Link>
  </div>
);

export default NotFound;
