import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { CartContext } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, Check, XCircle } from 'lucide-react';

const BookPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await api.get(`/books/${id}`);
                setBook(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Завантаження...</div>;
    if (!book) return <div style={{ padding: '50px', textAlign: 'center' }}>Книгу не знайдено</div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }} className="fade-in">
            <button 
                onClick={() => navigate(-1)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', color: '#666', marginBottom: '20px', fontSize: '1rem' }}
            >
                <ArrowLeft size={20} /> Назад до каталогу
            </button>
            <div className="book-details-container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '50px' }}>
                    <div>
                        <img 
                            src={book.image_url} 
                            alt={book.title} 
                            className="book-cover-large"
                        />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginTop: 0, lineHeight: '1.2' }}>{book.title}</h1>
                        <h3 style={{ color: '#7f8c8d', fontWeight: '400', marginTop: '-10px' }}>{book.author}</h3>
                        <div style={{ margin: '30px 0', padding: '20px', background: '#f8f9fa', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '2rem', fontWeight: '700', color: '#2c3e50' }}>
                                {book.price} грн
                            </span>
                            {book.stock_quantity > 0 ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#27ae60', fontWeight: '600' }}>
                                    <Check size={20} /> Є в наявності ({book.stock_quantity})
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#c0392b', fontWeight: '600' }}>
                                    <XCircle size={20} /> Немає в наявності
                                </span>
                            )}
                        </div>
                        <button 
                            onClick={() => addToCart(book)}
                            disabled={book.stock_quantity === 0}
                            className={`btn ${book.stock_quantity > 0 ? 'btn-primary' : ''}`}
                            style={{ 
                                width: '100%', 
                                padding: '15px', 
                                fontSize: '1.1rem',
                                backgroundColor: book.stock_quantity === 0 ? '#bdc3c7' : undefined,
                                cursor: book.stock_quantity === 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <ShoppingCart size={20} /> {book.stock_quantity > 0 ? 'Додати в кошик' : 'Розпродано'}
                        </button>
                        <div style={{ marginTop: '40px' }}>
                            <h3 style={{ fontSize: '1.5rem', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>Про книгу</h3>
                            <p style={{ lineHeight: '1.8', color: '#2c3e50', fontSize: '1.05rem' }}>
                                {book.description || "Опис для цієї книги поки що відсутній, але ми впевнені, що вона чудова!"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookPage;