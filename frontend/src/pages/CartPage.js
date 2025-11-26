import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, ArrowRight, ShoppingBag } from 'lucide-react';

const CartPage = () => {
    const { cartItems, removeFromCart, addToCart, getCartTotal } = useContext(CartContext);
    const navigate = useNavigate();
    const subTotal = getCartTotal();
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    let discount = 0;
    if (totalQuantity >= 3) {
        discount = subTotal * 0.05;
    }
    const finalTotal = subTotal - discount;

    if (cartItems.length === 0) {
        return (
            <div className="fade-in" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <div style={{ color: '#bdc3c7', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                    <ShoppingBag size={80} />
                </div>
                <h2>Ваш кошик порожній</h2>
                <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>Схоже, ви ще не обрали жодної книги.</p>
                <Link to="/" className="btn btn-primary">
                    Перейти до каталогу
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }} className="fade-in">
            <h1 style={{ marginBottom: '30px' }}>Мій кошик ({totalQuantity})</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {cartItems.map((item) => (
                        <div key={item.id} style={{ 
                            background: 'white', padding: '20px', borderRadius: '12px', 
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', gap: '20px', alignItems: 'center' 
                        }}>
                            <Link to={`/book/${item.id}`} style={{ flexShrink: 0 }}>
                                <img src={item.image_url} alt={item.title} style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '6px' }} />
                            </Link>
                            <div style={{ flexGrow: 1 }}>
                                <Link to={`/book/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 5px 0' }}>{item.title}</h3>
                                </Link>
                                <p style={{ color: '#7f8c8d', fontSize: '0.9rem', margin: 0 }}>{item.author}</p>
                                <p style={{ fontWeight: 'bold', color: '#2c3e50', marginTop: '10px' }}>{item.price} грн</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f9fa', padding: '5px 10px', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Кількість:</span>
                                    <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                                    <button 
                                        onClick={() => addToCart(item)}
                                        title="Додати ще одну"
                                        style={{ 
                                            background: 'white', border: '1px solid #ddd', borderRadius: '4px', 
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px',
                                            color: '#27ae60'
                                        }}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}
                                >
                                    <Trash2 size={18} /> Видалити
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ 
                    background: 'white', padding: '30px', borderRadius: '12px', 
                    boxShadow: '0 5px 20px rgba(0,0,0,0.1)', position: 'sticky', top: '100px' 
                }}>
                    <h3 style={{ marginTop: 0 }}>Підсумок</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#7f8c8d' }}>
                        <span>Вартість товарів:</span>
                        <span>{subTotal.toFixed(2)} грн</span>
                    </div>
                    {discount > 0 ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#27ae60', fontWeight: '600' }}>
                            <span>Знижка (5%):</span>
                            <span>-{discount.toFixed(2)} грн</span>
                        </div>
                    ) : (
                        <div style={{ background: '#e3f2fd', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', color: '#0d47a1', marginBottom: '15px', textAlign: 'center' }}>
                            Додайте ще <strong>{Math.max(0, 3 - totalQuantity)}</strong> книги для знижки 5%!
                        </div>
                    )}
                    <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '1.4rem', fontWeight: '700', color: '#2c3e50' }}>
                        <span>Разом:</span>
                        <span>{finalTotal.toFixed(2)} грн</span>
                    </div>
                    <button 
                        onClick={() => navigate('/checkout')}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '15px', fontSize: '1.1rem', justifyContent: 'center' }}
                    >
                        Оформити замовлення <ArrowRight size={20} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CartPage;