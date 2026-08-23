import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  ShoppingBag,
  ShoppingCart,
  Tag,
  Search,
  CheckCircle2,
  Package,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Truck,
  Leaf,
  Star,
  Plus,
  Minus,
  Trash2,
  X,
  ArrowRight,
  Clock,
  Gift
} from 'lucide-react';

interface D2CProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Eco Living' | 'Clean Energy' | 'Fair Trade Goods' | 'Educational Kits' | 'Artisan Crafts';
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  image: string;
  inStock: boolean;
  sustainabilityBadge: string;
  subscriptionAvailable: boolean;
}

interface CartItem {
  product: D2CProduct;
  quantity: number;
}

interface D2COrder {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  createdAt: string;
}

interface D2CSubscription {
  id: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  frequency: string;
  pricePerCycle: number;
  status: string;
  nextDeliveryDate: string;
  createdAt: string;
}

const DTCStorePage = () => {
  const [activeTab, setActiveTab] = useState<'store' | 'subscriptions' | 'cart' | 'orders'>('store');
  const [products, setProducts] = useState<D2CProduct[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<D2COrder[]>([]);
  const [subscriptions, setSubscriptions] = useState<D2CSubscription[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');

  // Checkout modal & form state
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
    paymentMethod: 'Credit Card'
  });
  const [orderSuccess, setOrderSuccess] = useState<D2COrder | null>(null);

  // Subscription modal & form state
  const [showSubModal, setShowSubModal] = useState<boolean>(false);
  const [subForm, setSubForm] = useState({
    customerName: '',
    customerEmail: '',
    planName: 'Monthly Artisan Coffee & Eco-Living Box',
    frequency: 'Monthly'
  });
  const [subSuccess, setSubSuccess] = useState<boolean>(false);

  // Load products & cart from backend
  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchSubscriptions();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/dtc/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      } else {
        fallbackProducts();
      }
    } catch (err) {
      console.warn('Backend offline, using fallback products', err);
      fallbackProducts();
    } finally {
      setLoading(false);
    }
  };

  const fallbackProducts = () => {
    setProducts([
      {
        id: 'dtc-1',
        name: 'Portable Solar Power Bank & Lantern',
        brand: 'Mawaba EcoTech',
        category: 'Clean Energy',
        price: 49.99,
        rating: 4.8,
        reviewsCount: 124,
        description: 'Foldable 20,000mAh solar charging unit with dual USB-C ports and ultra-bright LED emergency lantern.',
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        sustainabilityBadge: '100% Recycled Plastic Housing',
        subscriptionAvailable: false
      },
      {
        id: 'dtc-2',
        name: 'Organic Fair-Trade Micro-Lot Coffee',
        brand: 'Andean Heritage Co-op',
        category: 'Fair Trade Goods',
        price: 18.50,
        rating: 4.9,
        reviewsCount: 89,
        description: 'Shade-grown organic arabica coffee beans directly sourced from smallholder farming families in Peru.',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        sustainabilityBadge: 'Direct Trade Certified & Zero Waste Bag',
        subscriptionAvailable: true
      },
      {
        id: 'dtc-3',
        name: 'Hands-On Quantum Physics & Robotics Experiment Kit',
        brand: 'Mawaba STEM Labs',
        category: 'Educational Kits',
        price: 64.00,
        rating: 4.7,
        reviewsCount: 56,
        description: 'Interactive DIY electronics & optics laboratory kit designed for high school and university science enthusiasts.',
        image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        sustainabilityBadge: 'Biodegradable Components & Open-Source Code',
        subscriptionAvailable: false
      },
      {
        id: 'dtc-4',
        name: 'Handwoven Natural Sisal & Baobab Fibre Tote',
        brand: 'Kikuyu Women Artisans',
        category: 'Artisan Crafts',
        price: 36.00,
        rating: 5.0,
        reviewsCount: 42,
        description: 'Durable, hand-dyed cultural shoulder bag crafted using centuries-old East African basketry techniques.',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        sustainabilityBadge: 'Ethically Handcrafted & Micro-Loan Backed',
        subscriptionAvailable: false
      },
      {
        id: 'dtc-5',
        name: 'Zero-Waste Bamboo & Solid Shampoo Care Set',
        brand: 'BioLiving',
        category: 'Eco Living',
        price: 24.99,
        rating: 4.6,
        reviewsCount: 78,
        description: 'Plastic-free personal hygiene kit featuring organic botanical shampoo bars and compostable bamboo toothbrushes.',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        sustainabilityBadge: 'Ocean Safe & Carbon Neutral Shipping',
        subscriptionAvailable: true
      }
    ]);
  };

  const fetchCart = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/dtc/cart');
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
      }
    } catch (err) {
      console.warn('Cart fetch error', err);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/dtc/subscriptions');
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data || []);
      }
    } catch (err) {
      console.warn('Subscriptions fetch error', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/dtc/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data || []);
      }
    } catch (err) {
      console.warn('Orders fetch error', err);
    }
  };

  const addToCart = async (product: D2CProduct) => {
    try {
      const res = await fetch('http://localhost:3001/api/dtc/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items);
      } else {
        // Fallback local state update
        setCartItems(prev => {
          const exists = prev.find(i => i.product.id === product.id);
          if (exists) {
            return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
          }
          return [...prev, { product, quantity: 1 }];
        });
      }
    } catch (err) {
      setCartItems(prev => {
        const exists = prev.find(i => i.product.id === product.id);
        if (exists) {
          return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { product, quantity: 1 }];
      });
    }
  };

  const updateQuantity = async (productId: string, change: number) => {
    const existing = cartItems.find(i => i.product.id === productId);
    if (!existing) return;

    if (existing.quantity + change <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/dtc/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: change })
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items);
      }
    } catch (err) {
      setCartItems(prev =>
        prev.map(i => i.product.id === productId ? { ...i, quantity: i.quantity + change } : i)
      );
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/dtc/cart/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items);
      } else {
        setCartItems(prev => prev.filter(i => i.product.id !== productId));
      }
    } catch (err) {
      setCartItems(prev => prev.filter(i => i.product.id !== productId));
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'MAWABA10') {
      setAppliedDiscount(0.10);
      setPromoMessage('10% discount code MAWABA10 applied!');
    } else if (promoCode.trim()) {
      setAppliedDiscount(0);
      setPromoMessage('Invalid promo code. Try MAWABA10 for 10% off.');
    }
  };

  const cartSubtotal = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const discountAmount = cartSubtotal * appliedDiscount;
  const shippingFee = cartSubtotal > 50 || cartItems.length === 0 ? 0 : 5.00;
  const cartTotal = cartSubtotal - discountAmount + shippingFee;
  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/dtc/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...checkoutForm,
          promoCode: appliedDiscount > 0 ? 'MAWABA10' : ''
        })
      });

      if (res.ok) {
        const data = await res.json();
        setOrderSuccess(data.order);
        setCartItems([]);
        setShowCheckoutModal(false);
        fetchOrders();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Checkout failed');
      }
    } catch (err) {
      // Local fallback simulation
      const mockOrder: D2COrder = {
        id: 'ord-' + Math.random().toString(36).substr(2, 6),
        customerName: checkoutForm.customerName,
        customerEmail: checkoutForm.customerEmail,
        shippingAddress: checkoutForm.shippingAddress,
        items: [...cartItems],
        subtotal: cartSubtotal,
        shippingFee,
        discount: discountAmount,
        total: cartTotal,
        status: 'Processing',
        paymentMethod: checkoutForm.paymentMethod,
        createdAt: new Date().toISOString()
      };
      setOrderSuccess(mockOrder);
      setOrders(prev => [mockOrder, ...prev]);
      setCartItems([]);
      setShowCheckoutModal(false);
    }
  };

  const handleSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/dtc/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subForm)
      });
      if (res.ok) {
        setSubSuccess(true);
        fetchSubscriptions();
        setTimeout(() => {
          setSubSuccess(false);
          setShowSubModal(false);
        }, 2000);
      }
    } catch (err) {
      setSubSuccess(true);
      setTimeout(() => {
        setSubSuccess(false);
        setShowSubModal(false);
      }, 2000);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Clean Energy', 'Eco Living', 'Fair Trade Goods', 'Educational Kits', 'Artisan Crafts'];

  return (
    <Layout>
      <Head>
        <title>Direct-to-Consumer (D2C) Goods Hub - Mawaba</title>
        <meta
          name="description"
          content="Connect directly with eco-conscious producers, fair-trade artisans, clean energy innovators, and educational craft makers worldwide."
        />
      </Head>

      <div className="bg-gray-50 min-h-screen pb-16">
        {/* Banner / Hero Section */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  Direct-to-Consumer Platform
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Sustainable D2C Goods & Global Artisans
                </h1>
                <p className="text-gray-300 text-base sm:text-lg">
                  Empowering local producers, clean energy innovators, and micro-entrepreneurs. Buy directly from creators with carbon-neutral shipping and zero middleman markups.
                </p>
                <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" /> Verified Fair Trade
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur">
                    <Truck className="h-4 w-4 text-blue-400" /> Carbon-Neutral Shipping
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur">
                    <Leaf className="h-4 w-4 text-green-400" /> 100% Sustainable
                  </div>
                </div>
              </div>

              {/* Cart Banner Preview Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl w-full md:w-80 space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold text-gray-200">
                  <span>Your Shopping Cart</span>
                  <span className="bg-blue-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {totalCartCount} items
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xl font-extrabold text-white">
                    <span>Subtotal:</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    {cartSubtotal > 50 ? '🎉 You qualify for FREE shipping!' : `Add $${(50 - cartSubtotal).toFixed(2)} more for free shipping`}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('cart')}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50"
                >
                  <ShoppingCart className="h-4 w-4" /> View Cart & Checkout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('store')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'store'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ShoppingBag className="h-4 w-4" /> Marketplace
              </button>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'subscriptions'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <RefreshCw className="h-4 w-4" /> Eco Subscriptions
              </button>
              <button
                onClick={() => setActiveTab('cart')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'cart'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ShoppingCart className="h-4 w-4" /> Cart ({totalCartCount})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'orders'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="h-4 w-4" /> My Orders ({orders.length})
              </button>
            </div>

            {/* Search Input */}
            {activeTab === 'store' && (
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products or artisans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* TAB 1: MARKETPLACE */}
        {activeTab === 'store' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="text-center py-16">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Loading D2C Products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-md mx-auto my-8">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                <p className="text-sm text-gray-500 mt-1">Try clearing search keywords or selecting another category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative h-56 bg-gray-100 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-blue-900/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                        {p.category}
                      </div>
                      {p.sustainabilityBadge && (
                        <div className="absolute bottom-3 left-3 right-3 bg-emerald-950/80 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5">
                          <Leaf className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{p.sustainabilityBadge}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="font-bold text-blue-600">{p.brand}</span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span>{p.rating}</span>
                            <span className="text-gray-400 font-normal">({p.reviewsCount})</span>
                          </div>
                        </div>
                        <h3 className="font-extrabold text-gray-900 text-lg leading-snug group-hover:text-blue-600 transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-2xl font-black text-gray-900">${p.price.toFixed(2)}</span>
                          <span className="text-xs text-gray-400 block">Direct Producer Price</span>
                        </div>
                        <button
                          onClick={() => addToCart(p)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-100 hover:shadow-lg hover:shadow-blue-200"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ECO SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold">
                  <Gift className="h-4 w-4" /> Monthly D2C Eco Box
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold">Curated Artisanal & Clean Tech Deliveries</h2>
                <p className="text-emerald-100 text-sm">
                  Receive recurring monthly packages featuring fresh fair-trade micro-lot coffee beans, organic hygiene bars, solar mini-tech gadgets, and hand-woven indigenous crafts directly at your doorstep.
                </p>
              </div>
              <button
                onClick={() => setShowSubModal(true)}
                className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black px-6 py-3.5 rounded-2xl transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
              >
                <RefreshCw className="h-5 w-5" /> Subscribe Now ($29.99/mo)
              </button>
            </div>

            {/* Active Subscriptions List */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" /> Active Customer Subscriptions
              </h3>
              {subscriptions.length === 0 ? (
                <p className="text-sm text-gray-500">No active subscriptions yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subscriptions.map((s) => (
                    <div key={s.id} className="border border-gray-200 p-4 rounded-xl flex items-center justify-between bg-gray-50/50">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{s.planName}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Subscriber: {s.customerName} ({s.customerEmail})</p>
                        <span className="inline-block mt-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Status: {s.status} • Next Delivery: {s.nextDeliveryDate}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-gray-900 text-base">${s.pricePerCycle.toFixed(2)}</span>
                        <span className="text-[10px] text-gray-400 block">/{s.frequency.toLowerCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SHOPPING CART & CHECKOUT */}
        {activeTab === 'cart' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                  <ShoppingCart className="h-6 w-6 text-blue-600" /> Your Shopping Cart
                </h2>
                <span className="text-sm text-gray-500 font-semibold">{totalCartCount} item(s)</span>
              </div>

              {cartItems.length === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto" />
                  <h3 className="text-lg font-bold text-gray-900">Your cart is currently empty</h3>
                  <p className="text-sm text-gray-500">Explore our direct-to-consumer marketplace to support local creators.</p>
                  <button
                    onClick={() => setActiveTab('store')}
                    className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
                  >
                    Browse Marketplace
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="divide-y divide-gray-100">
                    {cartItems.map(({ product, quantity }) => (
                      <div key={product.id} className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                          />
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{product.name}</h4>
                            <p className="text-xs text-blue-600 font-semibold">{product.brand}</p>
                            <span className="text-xs font-bold text-gray-700">${product.price.toFixed(2)} each</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold text-gray-800">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <span className="font-extrabold text-gray-900 text-base w-20 text-right">
                            ${(product.price * quantity).toFixed(2)}
                          </span>

                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code & Summary */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-blue-600" />
                      <input
                        type="text"
                        placeholder="Promo Code (Try MAWABA10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="bg-gray-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all"
                      >
                        Apply
                      </button>
                    </div>
                    {promoMessage && (
                      <p className={`text-xs font-semibold ${appliedDiscount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {promoMessage}
                      </p>
                    )}

                    <div className="space-y-2 border-t border-gray-200 pt-3 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Items Subtotal:</span>
                        <span>${cartSubtotal.toFixed(2)}</span>
                      </div>
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Discount (10% MAWABA10):</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-600">
                        <span>Estimated Shipping:</span>
                        <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-200">
                        <span>Grand Total:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowCheckoutModal(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-base transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-5 w-5" /> Proceed to Direct Checkout (${cartTotal.toFixed(2)})
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
              <Package className="h-6 w-6 text-blue-600" /> Direct Order History
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900">No past orders found</h3>
                <p className="text-sm text-gray-500 mt-1">Place your first order on the D2C Marketplace!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <span className="font-extrabold text-gray-900 text-sm">Order ID: {o.id}</span>
                        <span className="text-xs text-gray-400 block">{new Date(o.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                          {o.status}
                        </span>
                        <span className="text-lg font-black text-gray-900">${o.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <span className="font-bold text-gray-800 block">Customer Info:</span>
                        <p>{o.customerName} ({o.customerEmail})</p>
                        <p>Shipping Address: {o.shippingAddress}</p>
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block">Payment & Logistics:</span>
                        <p>Method: {o.paymentMethod}</p>
                        <p>Items Count: {o.items.reduce((acc, i) => acc + i.quantity, 0)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHECKOUT MODAL */}
        {showCheckoutModal && (
          <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <h3 className="text-xl font-extrabold text-gray-900">Direct Producer Checkout</h3>
                <p className="text-xs text-gray-500 mt-1">Complete your delivery and shipping parameters.</p>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marie Curie"
                    value={checkoutForm.customerName}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, customerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. marie@curie.org"
                    value={checkoutForm.customerEmail}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, customerEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Shipping Street Address</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Full street address, city, country..."
                    value={checkoutForm.shippingAddress}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, shippingAddress: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={checkoutForm.paymentMethod}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Credit Card">Credit / Debit Card</option>
                    <option value="Mobile Money">Mobile Money (M-Pesa / MTN)</option>
                    <option value="PayPal">PayPal Instant</option>
                    <option value="Crypto">Crypto (USDC / BTC)</option>
                  </select>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl space-y-1 text-blue-900 font-medium">
                  <div className="flex justify-between font-bold text-sm">
                    <span>Order Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-blue-700">Includes carbon-neutral shipment and direct producer payouts.</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-sm transition-all shadow-md"
                >
                  Confirm & Place Order
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ORDER SUCCESS MODAL */}
        {orderSuccess && (
          <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl relative">
              <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Order Placed Successfully!</h3>
              <p className="text-xs text-gray-600">
                Thank you, <span className="font-bold">{orderSuccess.customerName}</span>. Your order confirmation receipt <span className="font-mono font-bold text-blue-600">{orderSuccess.id}</span> has been issued.
              </p>
              <div className="bg-gray-50 p-4 rounded-xl text-xs text-left space-y-1 text-gray-700">
                <p><span className="font-bold">Total Paid:</span> ${orderSuccess.total.toFixed(2)}</p>
                <p><span className="font-bold">Shipping Address:</span> {orderSuccess.shippingAddress}</p>
                <p><span className="font-bold">Status:</span> {orderSuccess.status}</p>
              </div>
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  setActiveTab('orders');
                }}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition-all"
              >
                View Order History
              </button>
            </div>
          </div>
        )}

        {/* SUBSCRIPTION MODAL */}
        {showSubModal && (
          <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setShowSubModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <h3 className="text-xl font-extrabold text-gray-900">Subscribe to Monthly D2C Eco Box</h3>
                <p className="text-xs text-gray-500 mt-1">Get curated artisanal fair-trade goods every month.</p>
              </div>

              {subSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                  <h4 className="font-extrabold text-gray-900 text-lg">Subscription Activated!</h4>
                  <p className="text-xs text-gray-500">Your first delivery box will arrive soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marie Curie"
                      value={subForm.customerName}
                      onChange={(e) => setSubForm({ ...subForm, customerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. marie@curie.org"
                      value={subForm.customerEmail}
                      onChange={(e) => setSubForm({ ...subForm, customerEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Subscription Frequency</label>
                    <select
                      value={subForm.frequency}
                      onChange={(e) => setSubForm({ ...subForm, frequency: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Monthly">Monthly ($29.99/mo)</option>
                      <option value="Quarterly">Quarterly ($79.99/quarter)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-sm transition-all shadow-md"
                  >
                    Confirm Subscription
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DTCStorePage;
