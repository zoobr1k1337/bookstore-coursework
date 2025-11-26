import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Trash2, Edit, Save, X, CloudDownload, Search, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPage = () => {
    const [books, setBooks] = useState([]);
    const initialForm = { id: null, title: '', author: '', description: '', price: '', stock_quantity: '', image_url: '' };
    const [formData, setFormData] = useState(initialForm);
    const [googleQuery, setGoogleQuery] = useState('');
    const [importLoading, setImportLoading] = useState(false);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books?sort=newest&limit=100');
            setBooks(response.data || []);
        } catch (error) {
            console.error("Failed to fetch books");
        }
    };

    useEffect(() => { fetchBooks(); }, []);

    const handleGoogleImport = async (e) => {
        e.preventDefault();
        if (!googleQuery.trim()) return;

        setImportLoading(true);
        try {
            const response = await api.post(`/books/populate?q=${googleQuery}`);
            toast.success(response.data.message || "Імпорт успішний!");
            setGoogleQuery('');
            fetchBooks();
        } catch (error) {
            toast.error("Помилка імпорту.");
        } finally {
            setImportLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Видалити цю книгу?")) return;
        try {
            await api.delete(`/books/${id}`);
            fetchBooks();
        } catch (error) {
            toast.error("Помилка видалення");
        }
    };

    const handleEdit = (book) => {
        setFormData(book);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock_quantity)
        };

        try {
            if (formData.id) {
                await api.put(`/books/${formData.id}`, payload);
            } else {
                await api.post('/books', payload);
            }
            setFormData(initialForm);
            fetchBooks();
        } catch (error) {
            toast.error("Помилка збереження.");
        }
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }} className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                <Package size={40} color="#2c3e50" />
                <h1 style={{ margin: 0 }}>Панель Керування</h1>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                <div className="book-card" style={{ padding: '30px' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px' }}>
                        {formData.id ? '✏️ Редагування книги' : '➕ Додати книгу вручну'}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                        <input 
                            className="input-field"
                            placeholder="Назва книги" value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} required 
                        />
                        <input 
                            className="input-field"
                            placeholder="Автор" value={formData.author} 
                            onChange={(e) => setFormData({...formData, author: e.target.value})} required 
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{fontSize: '0.85em', fontWeight: 'bold', color: '#666'}}>Ціна (грн)</label>
                                <input 
                                    className="input-field" type="number" placeholder="0.00" 
                                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required 
                                />
                            </div>
                            <div>
                                <label style={{fontSize: '0.85em', fontWeight: 'bold', color: '#666'}}>Кількість</label>
                                <input 
                                    className="input-field" type="number" placeholder="0" 
                                    value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})} required 
                                />
                            </div>
                        </div>

                        <input 
                            className="input-field"
                            placeholder="URL Обкладинки" value={formData.image_url} 
                            onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
                        />
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                <Save size={18} /> {formData.id ? 'Зберегти зміни' : 'Створити'}
                            </button>
                            {formData.id && (
                                <button 
                                    type="button" 
                                    onClick={() => setFormData(initialForm)} 
                                    className="btn" style={{ background: '#95a5a6', color: 'white' }}
                                >
                                    <X size={18} /> Скасувати
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="book-card" style={{ padding: '30px', height: 'fit-content', background: 'linear-gradient(135deg, #fff 0%, #f3f9ff 100%)' }}>
                    <h3 style={{ marginTop: 0, color: '#0984e3', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CloudDownload size={28} /> 
                        Google Books Import
                    </h3>
                    <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '25px' }}>
                        Швидке наповнення каталогу. Введіть тему (наприклад <em>"JavaScript"</em>, <em>"Space"</em>) або автора, і система автоматично завантажить 20 книг.
                    </p>
                    <form onSubmit={handleGoogleImport} style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ position: 'relative', flexGrow: 1 }}>
                            <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#aaa' }} />
                            <input 
                                className="input-field"
                                placeholder="Пошуковий запит..." 
                                value={googleQuery}
                                onChange={(e) => setGoogleQuery(e.target.value)}
                                required
                                style={{ paddingLeft: '35px' }}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={importLoading}
                            className="btn btn-accent"
                        >
                            {importLoading ? '...' : 'Імпорт'}
                        </button>
                    </form>
                </div>
            </div>
            <div className="admin-table-container" style={{ marginTop: '80px' }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th style={{ width: '40%' }}>Книга</th>
                            <th>Ціна</th>
                            <th>Статус</th>
                            <th style={{ textAlign: 'center' }}>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.id}>
                                <td style={{ color: '#888', fontSize: '0.9em' }}>#{book.id}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <img src={book.image_url} alt="" style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{book.title}</div>
                                            <div style={{ fontSize: '0.85em', color: '#7f8c8d' }}>{book.author}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ fontWeight: '600' }}>{book.price.toFixed(2)} грн</td>
                                <td>
                                    <span className={`stock-badge ${book.stock_quantity < 5 ? 'stock-low' : 'stock-ok'}`}>
                                        {book.stock_quantity} шт.
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button 
                                        onClick={() => handleEdit(book)} 
                                        title="Редагувати"
                                        style={{ marginRight: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#3498db', transition: 'transform 0.2s' }}
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(book.id)} 
                                        title="Видалити"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', transition: 'transform 0.2s' }}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;