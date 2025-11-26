import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { CartContext } from '../context/CartContext';
import { Download, Package, User, Calendar, LogOut, ShoppingBag } from 'lucide-react';

const ProfilePage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { clearCart } = useContext(CartContext);
    const user = localStorage.getItem('user') || 'Користувач';

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('shopping_cart');
        clearCart();
        navigate('/login');
    }, [clearCart, navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                const sortedOrders = response.data.sort((a, b) => b.id - a.id);
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
                if (error.response && error.response.status === 401) {
                    handleLogout();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [handleLogout, navigate]);

    const downloadPdf = async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `BookStore_Order_${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Не вдалося завантажити чек.");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'New': return 'badge badge-new';
            case 'Shipped': return 'badge badge-shipped';
            case 'Completed': return 'badge badge-completed';
            case 'Cancelled': return 'badge badge-cancelled';
            default: return 'badge';
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#7f8c8d' }}>Завантаження історії...</div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }} className="fade-in">
            <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #eee' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '50%', color: '#007bff' }}>
                        <User size={32} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2rem' }}>Особистий кабінет</h1>
                        <p style={{ margin: 0, color: '#666' }}>Вітаємо, <strong>{user}</strong>!</p>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="btn"
                    style={{ backgroundColor: '#ffebee', color: '#c62828' }}
                >
                    <LogOut size={18} /> Вийти
                </button>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                <Package size={24} /> Історія замовлень
            </h2>
            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <ShoppingBag size={60} color="#ddd" style={{ marginBottom: '20px' }} />
                    <h3>У вас ще немає замовлень</h3>
                    <p style={{ color: '#7f8c8d' }}>Саме час обрати щось цікаве!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {orders.map((order) => (
                        <div key={order.id} style={{ 
                            background: 'white', borderRadius: '12px', padding: '25px', 
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.02)' 
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                                <div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#2c3e50' }}>
                                        Замовлення #{order.id}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#95a5a6', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                                        <Calendar size={14} /> {formatDate(order.created_at)}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span className={getStatusBadgeClass(order.status)}>
                                        {order.status}
                                    </span>
                                    <button 
                                        onClick={() => downloadPdf(order.id)}
                                        title="Завантажити чек"
                                        style={{ 
                                            display: 'flex', alignItems: 'center', gap: '5px',
                                            background: 'white', border: '1px solid #ddd', borderRadius: '6px',
                                            padding: '6px 12px', cursor: 'pointer', color: '#555', fontSize: '0.85rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Download size={16} /> Чек
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {order.items?.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#34495e' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '6px', height: '6px', background: '#bdc3c7', borderRadius: '50%' }}></div>
                                            <span>{item.book?.title || "Товар видалено"}</span>
                                            <span style={{ color: '#95a5a6', fontSize: '0.85rem' }}>x{item.quantity}</span>
                                        </div>
                                        <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{item.price_at_purchase.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: '#7f8c8d' }}>Разом до сплати:</span>
                                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#2c3e50' }}>
                                    {order.total_amount.toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: '400' }}>грн</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;