import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';
import { CreditCard, MapPin, User, Phone, ShoppingBag, Truck, CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const subTotal = getCartTotal();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  let discount = 0;
  if (totalQuantity >= 3) {
      discount = subTotal * 0.05;
  }
  const finalTotal = subTotal - discount;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const savedFirstName = localStorage.getItem('first_name');
      const savedLastName = localStorage.getItem('last_name');

      if (savedFirstName && savedLastName) {
          setFormData(prev => ({
              ...prev,
              firstName: savedFirstName,
              lastName: savedLastName
          }));
      }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Будь ласка, авторизуйтесь");
      navigate('/login');
      return;
    }

    const orderPayload = {
      items: cartItems.map(item => ({
        book_id: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await axios.post('http://localhost:8080/api/orders', orderPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        clearCart();
        toast.success(`Замовлення №${response.data.order_id} успішно створено!`);
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Виникла помилка при оформленні");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
        <div className="fade-in" style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2>Ваш кошик порожній</h2>
            <button onClick={() => navigate('/')} className="btn btn-primary" style={{marginTop: '20px'}}>
                Повернутися до покупок
            </button>
        </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }} className="fade-in">
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Оформлення замовлення</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', alignItems: 'start' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <Truck size={24} color="#2c3e50" /> Деталі доставки
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9em', color: '#555' }}>Ім'я</label>
                <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: '#aaa' }} />
                    <input 
                        className="input-field"
                        name="firstName" 
                        value={formData.firstName} onChange={handleChange} required 
                        style={{ paddingLeft: '40px' }} 
                    />
                </div>
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9em', color: '#555' }}>Прізвище</label>
                <input 
                    className="input-field"
                    name="lastName" 
                    value={formData.lastName} onChange={handleChange} required 
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9em', color: '#555' }}>Адреса</label>
                <div style={{ position: 'relative' }}>
                    <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: '#aaa' }} />
                    <input 
                        className="input-field"
                        name="address" 
                        value={formData.address} onChange={handleChange} required 
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9em', color: '#555' }}>Місто</label>
                <input 
                    className="input-field"
                    name="city" 
                    value={formData.city} onChange={handleChange} required 
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9em', color: '#555' }}>Телефон</label>
                <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: '#aaa' }} />
                    <input 
                        className="input-field"
                        name="phone" 
                        value={formData.phone} onChange={handleChange} required 
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
            </div>
            <div style={{ marginTop: '10px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'start' }}>
                <CreditCard size={24} color="#555" style={{ marginTop: '2px' }} />
                <div style={{ fontSize: '0.9em', color: '#555' }}>
                    <strong style={{display: 'block', marginBottom: '5px', color: '#333'}}>Оплата при отриманні</strong>
                    Ви зможете оплатити замовлення карткою або готівкою кур'єру.
                </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '15px', fontSize: '1.1rem', marginTop: '10px', justifyContent: 'center' }}
            >
              {loading ? 'Обробка...' : 'Підтвердити замовлення'}
            </button>
          </form>
        </div>
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', position: 'sticky', top: '100px' }}>
          <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <ShoppingBag size={24} color="#2c3e50" /> Ваше замовлення
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', paddingRight: '5px' }}>
            {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
                    <img src={item.image_url} alt="" style={{ width: '50px', height: '75px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }} />
                    <div style={{ flexGrow: 1 }}>
                        <div style={{ fontSize: '0.95em', fontWeight: '600', lineHeight: '1.2', marginBottom: '4px' }}>{item.title}</div>
                        <div style={{ fontSize: '0.85em', color: '#7f8c8d' }}>
                            {item.price} грн x {item.quantity} шт.
                        </div>
                    </div>
                    <div style={{ fontWeight: '600' }}>{(item.price * item.quantity).toFixed(0)} ₴</div>
                </div>
            ))}
          </div>
          <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95em', color: '#555' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Сума товарів:</span>
                <span>{subTotal.toFixed(2)} грн</span>
            </div>
            {discount > 0 ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#27ae60', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={14}/> Знижка (5%):</span>
                    <span>-{discount.toFixed(2)} грн</span>
                </div>
            ) : (
                <div style={{ fontSize: '0.85em', color: '#007bff', background: '#e3f2fd', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                    Додайте ще товарів до 3-х одиниць для знижки!
                </div>
            )}
          </div>
          <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.4em', color: '#2c3e50' }}>
            <span>До сплати:</span>
            <span>{finalTotal.toFixed(2)} грн</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;