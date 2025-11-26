import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { CartContext } from '../context/CartContext';

const CatalogPage = () => {
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const searchFromHeader = searchParams.get('search');
    const [books, setBooks] = useState([]);
    const { addToCart } = useContext(CartContext);
    const [sortType, setSortType] = useState('newest');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const params = new URLSearchParams();
                params.append('sort', sortType);
                if (minPrice) params.append('min_price', minPrice);
                if (maxPrice) params.append('max_price', maxPrice);
                if (category) params.append('category', category);
                if (searchFromHeader) params.append('search', searchFromHeader);

                params.append('limit', 50);

                const response = await api.get(`/books?${params.toString()}`);
                setBooks(response.data || []);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchBooks();
    }, [category, searchFromHeader, sortType, minPrice, maxPrice]);

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }} className="fade-in">
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2.5rem' }}>
                    {category ? `Категорія: ${category}` : searchFromHeader ? `Пошук: "${searchFromHeader}"` : 'Усі книги'}
                </h1>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'end' }}>
                <div style={{ flex: '0 1 120px' }}>
                    <label style={{fontSize: '0.9em', fontWeight: 'bold'}}>Ціна від</label>
                    <input className="input-field" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0" />
                </div>
                <div style={{ flex: '0 1 120px' }}>
                    <label style={{fontSize: '0.9em', fontWeight: 'bold'}}>Ціна до</label>
                    <input className="input-field" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="10000" />
                </div>
                <div style={{ flex: '0 1 200px' }}>
                    <label style={{fontSize: '0.9em', fontWeight: 'bold'}}>Сортування</label>
                    <select className="input-field" value={sortType} onChange={e => setSortType(e.target.value)}>
                        <option value="newest">Новинки</option>
                        <option value="price_asc">Дешеві</option>
                        <option value="price_desc">Дорогі</option>
                    </select>
                </div>
            </div>
            {books.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>Книг не знайдено</div>
            ) : (
                <div className="books-grid">
                    {books.map((book) => (
                        <div key={book.id} className="book-card">
                            <Link to={`/book/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="book-image-container">
                                    <img src={book.image_url} alt={book.title} className="book-image" />
                                </div>
                            </Link>
                            <div className="book-info">
                                <div>
                                    <h3 className="book-title">{book.title}</h3>
                                    <p className="book-author">{book.author}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                    <span className="book-price">{book.price} грн</span>
                                    <button onClick={() => addToCart(book)} className="btn btn-primary">В кошик</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CatalogPage;