import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Settings, Menu, Search, ChevronRight } from 'lucide-react';
import api from './api/axiosConfig';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import BookPage from './pages/BookPage';
import AdminPage from './pages/AdminPage';
import logo from './logo.png';

const Navigation = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
      const fetchCategories = async () => {
          try {
              const response = await api.get('/categories');
              setCategories(response.data || []);
          } catch (error) {
              console.error("Не вдалося завантажити категорії");
          }
      };
      fetchCategories();
  }, []);

  const menuRef = useRef(null);
  const isLoggedIn = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('role') === 'admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '30px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
        </Link>
        <div style={{ position: 'relative' }} ref={menuRef}>
            <button 
                className="catalog-btn"
                onClick={() => setMenuOpen(!isMenuOpen)}
            >
                <Menu size={20} /> Каталог
            </button>
            {isMenuOpen && (
                <div className="catalog-dropdown">
                    <div className="catalog-header-red">
                        Каталог <ChevronRight size={16}/>
                    </div>
                    <ul className="catalog-list">
                        <li>
                            <Link to="/catalog" onClick={() => setMenuOpen(false)}>
                                📂 <strong>Усі книги</strong>
                            </Link>
                        </li>
                        {categories.length > 0 ? (categories.map(cat => (
                            <li key={cat}>
                                <Link to={`/catalog/${cat}`} onClick={() => setMenuOpen(false)}>
                                    {cat}
                                </Link>
                            </li>
                        ))
                      ) : (
                        <li style={{padding: '15px', color: '#999', fontSize: '0.9rem'}}>
                          Категорії відсутні
                        </li>
                      )}
                    </ul>
                </div>
            )}
        </div>
        <form onSubmit={handleSearch} style={{ flex: 1, position: 'relative' }}>
          <input 
            className="input-field"
            placeholder="Знайти книгу або автора..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: '4px', paddingLeft: '15px', width: '100%' }}
          />
          <button type="submit" style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>
            <Search size={20} />
          </button>
        </form>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
          {isAdmin && <Link to="/admin" title="Адмін"><Settings size={24} color="#d63384"/></Link>}
          <Link to="/cart" title="Кошик" style={{ position: 'relative' }}>
             <ShoppingCart size={26} color="#333"/>
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/profile"><User size={26} color="#333"/></Link>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}><LogOut size={26}/></button>
            </>
          ) : (
            <Link to="/login" style={{ fontWeight: '600', color: '#333' }}>Вхід</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div style={{ minHeight: '90vh', backgroundColor: '#fff' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/catalog/:category" element={<CatalogPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/book/:id" element={<BookPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;