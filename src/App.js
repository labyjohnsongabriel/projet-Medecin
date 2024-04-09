import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser';
import ListUser from './components/ListUser';

function App() {
  return (
    <div className="App">
      <h5>Projet React.js gestion Medecin</h5>

      <BrowserRouter>
        <nav>
          <ul className='nav nav-tabnav'>
            <li className='nav-item dropdown'>
            <button className='btn btn-primary'>
                  <Link to='/' style={{ color: 'white', textDecoration: 'none' }}>
                      Liste Medecin
                  </Link>
              </button>
            </li>
            <li className='nav-item dropdown'>
            <button className='btn btn-success'>
                  <Link to='/user/create' style={{ color: 'white', textDecoration: 'none' }}>
                      Create Medecin
                  </Link>
              </button>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route index element={<ListUser />} />
          <Route path="user/create" element={<CreateUser />} />
          <Route path="user/:id/edit" element={<EditUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
