import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#2c3e50', color: '#ecf0f1', paddingTop: '40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
        <div>
          <h3 style={{ color: 'white', marginTop: 0, borderBottom: '2px solid #e67e22', display: 'inline-block', paddingBottom: '10px' }}>BookStore</h3>
          <p style={{ lineHeight: '1.6', color: '#bdc3c7' }}>
            Ваш надійний провідник у світ літератури. Ми пропонуємо найкращі книги з усього світу з швидкою доставкою та приємними цінами.
          </p>
        </div>
        <div>
          <h4 style={{ color: 'white', marginTop: 0 }}>Навігація</h4>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
            <li><Link to="/" style={{ color: '#bdc3c7', textDecoration: 'none', transition: 'color 0.3s' }}>Головна</Link></li>
            <li><Link to="/cart" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Кошик</Link></li>
            <li><Link to="/profile" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Особистий кабінет</Link></li>
            <li><Link to="/login" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Вхід / Реєстрація</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'white', marginTop: 0 }}>Контакти</h4>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2', color: '#bdc3c7' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={18} color="#e67e22"/> Одеса, вул. Дерибасівська, 1</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={18} color="#e67e22"/> +38 (044) 123-45-67</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={18} color="#e67e22"/> info@bookstore.com</li>
          </ul>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #34495e', marginTop: '40px', padding: '20px 0', textAlign: 'center', color: '#7f8c8d' }}>
        <p style={{ margin: 0 }}>&copy; 2025 BookStore. Всі права захищено.</p>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Facebook size={20} style={{ cursor: 'pointer' }} />
            <Twitter size={20} style={{ cursor: 'pointer' }} />
            <Instagram size={20} style={{ cursor: 'pointer' }} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;