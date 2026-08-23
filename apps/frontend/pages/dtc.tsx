import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Package,
  BarChart3,
  Search,
  Filter,
  Plus,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  PlusCircle
} from 'lucide-react';

interface DtcProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image?: string;
  rating: number;
  createdAt: string;
}

interface DtcOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface DtcOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: DtcOrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  createdAt: string;
}

interface DtcAnalytics {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalProductsSold: number;
    conversionRate: string;
    repeatCustomerRate: string;
  };
  topProducts: DtcProduct[];
  recentOrders: DtcOrder[];
}

const DtcHubPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'analytics'>('catalog');

  // Catalog State
  const [products, setProducts] = useState<DtcProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // New Product Form State
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Sustainable Living');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  // Checkout / New Order State
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<DtcProduct | null>(null);
  const [orderCustName, setOrderCustName] = useState('');
  const [orderCustEmail, setOrderCustEmail] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderQty, setOrderQty] = useState(1);
  const [orderPaymentMethod, setOrderPaymentMethod] = useState('Direct Digital Wallet');
  const [orderSuccessMsg, setOrderSuccessMsg] = useState('');

  // Orders State
  const [orders, setOrders] = useState<DtcOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

  // Analytics State
  const [analytics, setAnalytics] = useState<DtcAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(true);

  const categories = ['All', 'Sustainable Living', 'Clean Tech & Electronics', 'Food & Gourmet'];

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchAnalytics();
  }, [selectedCategory, searchQuery, statusFilter]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      let url = 'http://localhost:3001/api/dtc/products?';
      if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Error fetching DTC products', e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      let url = 'http://localhost:3001/api/dtc/orders?';
      if (statusFilter !== 'All') url += `status=${encodeURIComponent(statusFilter)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Error fetching DTC orders', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch('http://localhost:3001/api/dtc/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error('Error fetching DTC analytics', e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdStock || !newProdDesc) return;

    try {
      const res = await fetch('http://localhost:3001/api/dtc/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          category: newProdCategory,
          price: parseFloat(newProdPrice),
          stock: parseInt(newProdStock, 10),
          description: newProdDesc,
          image: newProdImage || undefined
        })
      });

      if (res.ok) {
        setShowAddProductModal(false);
        setNewProdName('');
        setNewProdPrice('');
        setNewProdStock('');
        setNewProdDesc('');
        setNewProdImage('');
        fetchProducts();
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Failed to create DTC product', err);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForOrder || !orderCustName || !orderCustEmail || !orderAddress) return;

    try {
      const res = await fetch('http://localhost:3001/api/dtc/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: orderCustName,
          customerEmail: orderCustEmail,
          shippingAddress: orderAddress,
          paymentMethod: orderPaymentMethod,
          items: [
            {
              productId: selectedProductForOrder.id,
              productName: selectedProductForOrder.name,
              quantity: orderQty,
              price: selectedProductForOrder.price
            }
          ]
        })
      });

      if (res.ok) {
        const createdOrder = await res.json();
        setOrderSuccessMsg(`Order #${createdOrder.id} placed successfully!`);
        setTimeout(() => {
          setOrderSuccessMsg('');
          setShowOrderModal(false);
          setSelectedProductForOrder(null);
          setOrderCustName('');
          setOrderCustEmail('');
          setOrderAddress('');
          setOrderQty(1);
          fetchProducts();
          fetchOrders();
          fetchAnalytics();
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to place order', err);
    }
  };

  return (
    <>
      <Head>
        <title>DTC Commerce Tools & Direct Sales Hub | Mawaba</title>
        <meta name="description" content="Direct-to-Consumer (DTC) tools for global brand publishing, order fulfillment, and direct revenue analytics." />
      </Head>

      <div className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-blue-400/30">
                <Sparkles className="h-4 w-4 text-blue-300" />
                Direct-To-Consumer (DTC) Commerce Suite
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Global Direct Brand & Sales Hub
              </h1>
              <p className="text-lg text-blue-100 max-w-3xl leading-relaxed">
                Connect directly with consumer markets worldwide. Showcase eco-conscious goods, manage real-time global orders, and scale conversion analytics with Mawaba DTC Tools.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-8">
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'catalog'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                Product Catalog
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'orders'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Package className="h-4 w-4" />
                Order Management
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                DTC Analytics
              </button>
            </div>

            {activeTab === 'catalog' && (
              <button
                onClick={() => setShowAddProductModal(true)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-100"
              >
                <PlusCircle className="h-4 w-4" />
                Publish DTC Product
              </button>
            )}
          </div>

          {/* TAB 1: PRODUCT CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              {/* Search & Filter Bar */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search DTC catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                  <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-gray-500 uppercase">Category:</span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              {loadingProducts ? (
                <div className="text-center py-16 text-gray-500">Loading DTC Products...</div>
              ) : products.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl text-center border border-gray-200">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-semibold">No products found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((prod) => (
                    <div key={prod.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between">
                      <div>
                        {prod.image ? (
                          <img src={prod.image} alt={prod.name} className="w-full h-48 object-cover" />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                            <ShoppingBag className="h-16 w-16 text-blue-300" />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                              {prod.category}
                            </span>
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                              ★ {prod.rating}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{prod.name}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{prod.description}</p>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between pt-4">
                        <div>
                          <p className="text-2xl font-black text-gray-900">${prod.price.toFixed(2)}</p>
                          <p className="text-xs font-semibold text-gray-500">{prod.stock} in stock</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedProductForOrder(prod);
                            setShowOrderModal(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-100"
                        >
                          Direct Buy
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase">Status:</span>
                  {['All', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        statusFilter === st
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {loadingOrders ? (
                <div className="text-center py-16 text-gray-500">Loading DTC Orders...</div>
              ) : orders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl text-center border border-gray-200">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-semibold">No orders found.</p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs">
                        <tr>
                          <th className="px-6 py-4 font-bold">Order ID</th>
                          <th className="px-6 py-4 font-bold">Customer</th>
                          <th className="px-6 py-4 font-bold">Items</th>
                          <th className="px-6 py-4 font-bold">Total</th>
                          <th className="px-6 py-4 font-bold">Status</th>
                          <th className="px-6 py-4 font-bold">Payment</th>
                          <th className="px-6 py-4 font-bold">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 font-bold text-blue-600">{order.id}</td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900">{order.customerName}</p>
                              <p className="text-xs text-gray-500">{order.customerEmail}</p>
                            </td>
                            <td className="px-6 py-4">
                              {order.items.map((item, idx) => (
                                <p key={idx} className="text-xs text-gray-700 font-medium">
                                  {item.quantity}x {item.productName}
                                </p>
                              ))}
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-900">${order.totalAmount.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700' :
                                order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-gray-600">{order.paymentMethod}</td>
                            <td className="px-6 py-4 text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DTC ANALYTICS */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-8">
              {/* Metrics Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Total Direct Sales</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">${analytics.metrics.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Total Orders</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">{analytics.metrics.totalOrders}</p>
                  </div>
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                    <Package className="h-6 w-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Avg Order Value</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">${analytics.metrics.averageOrderValue.toFixed(2)}</p>
                  </div>
                  <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">DTC Conversion</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">{analytics.metrics.conversionRate}</p>
                  </div>
                  <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Analytics Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Top Performing Products
                  </h3>
                  <div className="space-y-4">
                    {analytics.topProducts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.category} • {p.stock} units left</p>
                        </div>
                        <span className="font-extrabold text-blue-600 text-sm">${p.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Recent Direct Purchases
                  </h3>
                  <div className="space-y-4">
                    {analytics.recentOrders.map((o) => (
                      <div key={o.id} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{o.customerName}</p>
                          <p className="text-xs text-gray-500">{o.items.length} items • {o.paymentMethod}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-gray-900 text-sm">${o.totalAmount.toFixed(2)}</p>
                          <span className="text-xs font-semibold text-emerald-600">{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL: Add New Product */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-4">Publish New DTC Product</h2>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Power Bank 10000mAh"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Sustainable Living">Sustainable Living</option>
                    <option value="Clean Tech & Electronics">Clean Tech & Electronics</option>
                    <option value="Food & Gourmet">Food & Gourmet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="29.99"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your DTC product..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-sm font-bold rounded-xl shadow-md"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Direct Checkout */}
      {showOrderModal && selectedProductForOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-1">Direct Checkout</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedProductForOrder.name}</p>

            {orderSuccessMsg ? (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <p className="font-bold text-sm">{orderSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={orderCustName}
                    onChange={(e) => setOrderCustName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={orderCustEmail}
                    onChange={(e) => setOrderCustEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Shipping Address</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Main St, City, Country"
                    value={orderAddress}
                    onChange={(e) => setOrderAddress(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedProductForOrder.stock}
                      value={orderQty}
                      onChange={(e) => setOrderQty(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Total</label>
                    <p className="px-3.5 py-2 bg-gray-100 rounded-xl text-sm font-black text-gray-900">
                      ${(selectedProductForOrder.price * orderQty).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOrderModal(false);
                      setSelectedProductForOrder(null);
                    }}
                    className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-bold rounded-xl shadow-md"
                  >
                    Confirm Purchase
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DtcHubPage;
