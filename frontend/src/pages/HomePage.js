import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, ChevronRight } from 'lucide-react';

const HomePage = () => {
    const { addToCart } = useContext(CartContext);
    const showcaseCategories = ["Computers", "Fiction", "Philosophy", "Psychology", "Medical"];
    const [categorizedBooks, setCategorizedBooks] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = {};
            for (const cat of showcaseCategories) {
                try {
                    const response = await api.get(`/books?category=${cat}&limit=6`);
                    if (response.data && response.data.length > 0) {
                        data[cat] = response.data;
                    }
                } catch (e) { console.error(e); }
            }
            setCategorizedBooks(data);
        };
        fetchData();
    }, []);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }} className="fade-in">
            <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '40px', borderRadius: '8px', marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ color: 'white', margin: 0 }}>BookStore</h1>
                <p>Найкращі книги для твого розвитку та відпочинку</p>
            </div>
            {Object.keys(categorizedBooks).map(cat => (
                <div key={cat} className="category-section">
                    <div className="section-header">
                        <h2 className="section-title">{cat}</h2>
                        <Link to={`/catalog/${cat}`} style={{ display: 'flex', alignItems: 'center', color: '#2c3e50', fontWeight: '600' }}>
                            Всі у категорії <ChevronRight size={18} />
                        </Link>
                    </div>
                    <div className="books-slider">
                        {categorizedBooks[cat].map(book => (
                            <div key={book.id} className="book-slide-card">
                                <Link to={`/book/${book.id}`} style={{ textDecoration: 'none' }}>
                                    <div className="book-slide-img-container">
                                        <span className="badge-new">New</span>
                                        <img src={book.image_url} alt={book.title} className="book-slide-img" />
                                    </div>
                                    <h3 className="book-slide-title">{book.title}</h3>
                                    <p className="book-slide-author">{book.author}</p>
                                </Link>
                                <div className="book-slide-footer">
                                    <span className="book-slide-price">{book.price} ₴</span>
                                    <button 
                                        onClick={() => addToCart(book)} 
                                        className="btn-cart-icon"
                                        title="В кошик"
                                    >
                                        <ShoppingCart size={24} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HomePage;