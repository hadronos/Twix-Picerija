/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  Instagram, 
  Facebook, 
  ShoppingBag, 
  ChevronRight, 
  Plus, 
  Minus, 
  X, 
  Check, 
  Compass, 
  Utensils, 
  Image as ImageIcon, 
  MessageSquare, 
  Menu as MenuIcon,
  Search,
  ArrowRight,
  TrendingUp,
  Award,
  Truck,
  DollarSign,
  Heart,
  Upload,
  Info,
  ChevronDown
} from 'lucide-react';
import { MENU_ITEMS, GALLERY_ITEMS, REVIEWS, WORKING_HOURS } from './data';
import { MenuItem, CartItem, GalleryItem, Review } from './types';

export default function App() {
  // Navigation: 'home' | 'menu' | 'gallery' | 'reviews' | 'contact'
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'gallery' | 'reviews' | 'contact'>('home');
  const [menuFilter, setMenuFilter] = useState<'all' | 'pizze' | 'sendvici' | 'rostilj' | 'palacinke'>('all');
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'pizze' | 'burgeri' | 'rostilj' | 'palacinke' | 'enterijer' | 'dostava'>('all');
  const [menuSearch, setMenuSearch] = useState('');
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedPizzaItem, setSelectedPizzaItem] = useState<MenuItem | null>(null);
  const [selectedPizzaSize, setSelectedPizzaSize] = useState<string>('32cm');
  const [orderNotice, setOrderNotice] = useState<string | null>(null);

  // Gallery interactive lightbox
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<GalleryItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Review state
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  // Live Open/Closed indicator
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [timeUntilClose, setTimeUntilClose] = useState('');

  useEffect(() => {
    // Determine dynamic open status based on 2026-06-17 system date
    // Zrenjanin TWIX is open every day 07:00-03:00 (Friday/Saturday/Sunday has slight adjustments)
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday, 1 is Monday ...
      const hour = now.getHours();
      
      // TWIX works 07:00 AM to 03:00 AM (next day) for weekdays, 08:00 AM to 03:00 AM Sat, 10:00 AM to 02:00 AM Sun
      let openHour = 7;
      let closeHour = 3; // 3 AM next day translates to hour < 3 or hour >= openHour

      if (day === 6) { // Saturday
        openHour = 8;
      } else if (day === 0) { // Sunday
        openHour = 10;
        closeHour = 2; // 2 AM Monday
      }

      const isOpen = hour >= openHour || hour < closeHour;
      setIsOpenNow(isOpen);

      if (isOpen) {
        let remainingHours = 0;
        if (hour < closeHour) {
          remainingHours = closeHour - hour;
        } else {
          remainingHours = (24 - hour) + closeHour;
        }
        setTimeUntilClose(`Još ${remainingHours}h (Zatvaramo u ${closeHour < 10 ? '0' + closeHour : closeHour}:00h)`);
      } else {
        setTimeUntilClose(`Otvaramo u ${openHour < 10 ? '0' + openHour : openHour}:00h`);
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Quick helper to get price of item
  const getItemPrice = (item: MenuItem, size?: string): number => {
    if (typeof item.price === 'number') {
      return item.price;
    }
    const selectedSize = size || item.sizes?.[0] || '32cm';
    return item.price[selectedSize] || 700;
  };

  // Add item to cart
  const addToCart = (item: MenuItem, size?: string) => {
    // If it's a pizza and size is not specified, trigger size modal
    if (item.category === 'pizze' && item.sizes && !size) {
      setSelectedPizzaItem(item);
      setSelectedPizzaSize(item.sizes[0]);
      return;
    }

    const finalSize = item.category === 'pizze' ? size : undefined;
    const price = getItemPrice(item, finalSize);
    const cartItemId = `${item.id}-${finalSize || 'default'}`;

    setCart(prevCart => {
      const existing = prevCart.find(i => i.id === cartItemId);
      if (existing) {
        return prevCart.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevCart, {
        id: cartItemId,
        menuItemId: item.id,
        name: item.name,
        selectedSize: finalSize,
        price,
        quantity: 1,
        category: item.category
      }];
    });

    // Pulse feedback on order button
    setOrderNotice(`Dodato: ${item.name} ${finalSize ? `(${finalSize})` : ''}`);
    setTimeout(() => setOrderNotice(null), 3000);
  };

  // Update cart item quantity
  const updateQuantity = (cartItemId: string, change: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === cartItemId) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  // Remove individual item
  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.id !== cartItemId));
  };

  // Total calculation
  const cartTotal = cart.reduce((add, item) => add + (item.price * item.quantity), 0);

  // Submit mock order
  const handleOrderSubmit = () => {
    if (cart.length === 0) return;

    let orderMessage = `*TWIX Naručivanje*\nZdravo, želeo bih da naručim:\n\n`;
    cart.forEach(item => {
      orderMessage += `- ${item.name} ${item.selectedSize ? `(${item.selectedSize})` : ''} x ${item.quantity} = ${item.price * item.quantity} RSD\n`;
    });
    orderMessage += `\n*Ukupno za plaćanje: ${cartTotal} RSD*\nDodatne napomene: Molimo pripremite toplo.`;
    
    // Copy order to clipboard and prompt user
    navigator.clipboard.writeText(orderMessage);
    
    // Simulate call modal
    alert(`Vaša porudžbina je pripremljena i kopirana na vaš telefon!\n\nUkupno: ${cartTotal} RSD.\n\nSada ćemo vas povezati na brzi poziv za dostavu sa Picerijom TWIX! Kliknite OK da pozovete.`);
    window.location.href = 'tel:0643312105';
  };

  // Review submission
  const submitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;

    const newRevObj: Review = {
      id: `custom-${Date.now()}`,
      author: newReviewName,
      rating: newReviewRating,
      text: newReviewText,
      date: 'Sada'
    };

    setReviewsList([newRevObj, ...reviewsList]);
    setNewReviewName('');
    setNewReviewText('');
    setNewReviewRating(5);
    setShowReviewSuccess(true);
    setTimeout(() => setShowReviewSuccess(false), 400);
  };

  // Image Upload Simulator
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const newImg: GalleryItem = {
        id: `uploaded-${Date.now()}`,
        url: reader.result as string,
        category: 'pizze', // default or custom
        title: file.name.split('.')[0] || 'Moja TWIX hrana'
      };
      setTimeout(() => {
        setUploadedPhotos([newImg, ...uploadedPhotos]);
        setIsUploading(false);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  // Render food stickers based on categories
  const getCategorySticker = (cat: string) => {
    switch (cat) {
      case 'pizze':
        return (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl px-5 py-4 w-full max-w-sm mb-6 animate-pulse">
            <span className="text-4xl">🍕</span>
            <div>
              <p className="font-extrabold text-lg uppercase tracking-wider mb-0 text-red-600">Premium Pice</p>
              <p className="text-xs text-red-600/80 font-medium">Baza od domaćeg pelata i svežeg nadeva</p>
            </div>
          </div>
        );
      case 'sendvici':
        return (
          <div className="flex items-center gap-3 bg-sky-500/10 border border-sky-500/20 text-sky-600 rounded-2xl px-5 py-4 w-full max-w-sm mb-6">
            <span className="text-4xl">🥪</span>
            <div>
              <p className="font-extrabold text-lg uppercase tracking-wider mb-0 text-sky-600">Bogati Sendviči</p>
              <p className="text-xs text-sky-600/80 font-medium">Uvek topli domaci somuni i bogate kifli</p>
            </div>
          </div>
        );
      case 'rostilj':
        return (
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-2xl px-5 py-4 w-full max-w-sm mb-6">
            <span className="text-4xl">🔥</span>
            <div>
              <p className="font-extrabold text-lg uppercase tracking-wider mb-0 text-amber-700">Roštilj sa Ćumura</p>
              <p className="text-xs text-amber-700/80 font-medium">Preko 20 godina tradicije i pravog ukusa</p>
            </div>
          </div>
        );
      case 'palacinke':
        return (
          <div className="flex items-center gap-3 bg-pink-500/10 border border-pink-500/20 text-pink-600 rounded-2xl px-5 py-4 w-full max-w-sm mb-6">
            <span className="text-4xl">🥞</span>
            <div>
              <p className="font-extrabold text-lg uppercase tracking-wider mb-0 text-pink-600">Nezaboravni Deserti</p>
              <p className="text-xs text-pink-600/80 font-medium">Kombinacija prave Nutele, Eurokrema i Plazme</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden selection:bg-red-500 selection:text-white pb-24 md:pb-0">
      
      {/* BRAND COLOR ACCENTS GLOW IN BACKGROUND */}
      <div className="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-red-400/10 blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 rounded-full bg-sky-300/15 blur-3xl pointer-events-none z-0" />
      
      {/* EMERGENCY STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            {/* LOGO DESIGN WITH SKY BLUE, RED, AND WHITE ACCENT */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-sky-400 shadow-md transform hover:rotate-6 transition-transform">
              <span className="text-white font-black text-xl italic tracking-tight">TW</span>
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border border-white"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-slate-900 uppercase">Picerija <span className="text-red-500">TWIX</span></span>
              </div>
              <p className="text-xs text-sky-600 font-bold tracking-widest uppercase">Zrenjanin</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 font-bold text-sm text-slate-600">
            <button 
              onClick={() => setActiveTab('home')} 
              className={`hover:text-red-500 transition-colors uppercase tracking-wider relative py-2 ${activeTab === 'home' ? 'text-red-600 font-extrabold border-b-2 border-red-500' : ''}`}
            >
              Početna
            </button>
            <button 
              onClick={() => setActiveTab('menu')} 
              className={`hover:text-red-500 transition-colors uppercase tracking-wider relative py-2 ${activeTab === 'menu' ? 'text-red-600 font-extrabold border-b-2 border-red-500' : ''}`}
            >
              Meni hrana 🍕
            </button>
            <button 
              onClick={() => setActiveTab('gallery')} 
              className={`hover:text-red-500 transition-colors uppercase tracking-wider relative py-2 ${activeTab === 'gallery' ? 'text-red-600 font-extrabold border-b-2 border-red-500' : ''}`}
            >
              Galerija
            </button>
            <button 
              onClick={() => setActiveTab('reviews')} 
              className={`hover:text-red-500 transition-colors uppercase tracking-wider relative py-2 ${activeTab === 'reviews' ? 'text-red-600 font-extrabold border-b-2 border-red-500' : ''}`}
            >
              Recenzije
            </button>
            <button 
              onClick={() => setActiveTab('contact')} 
              className={`hover:text-red-500 transition-colors uppercase tracking-wider relative py-2 ${activeTab === 'contact' ? 'text-red-600 font-extrabold border-b-2 border-red-500' : ''}`}
            >
              Lokacija & Radno Vreme
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Indicator Badge */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
              isOpenNow 
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
            }`}>
              <span className={`h-2.5 w-2.5 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isOpenNow ? 'OTVORENO DO 03:00' : 'TRENUTNO ZATVORENO'}
            </div>

            {/* QUICK CONTACT DOCK IN ACTIONS */}
            <a 
              href="tel:0643312105" 
              className="bg-red-500 hover:bg-red-600 text-white font-extrabold text-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">064 331 21 05</span>
              <span className="inline sm:hidden">Pozovi</span>
            </a>

            {/* CART FLOATING ACTION BUTTON */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-xl transition-all hover:scale-105 flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-xs h-5 w-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* DYNAMIC HEADER ANNOUNCEMENT */}
      {orderNotice && (
        <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-fade-in-up max-w-sm">
          <div className="bg-emerald-500 rounded-lg p-1 text-white">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-semibold">{orderNotice}</p>
        </div>
      )}

      {/* MAIN CONTAINER VIEW LAYOUT (TAB BASED AS REQUESTED) */}
      <main className="relative z-10">

        {/* ==================== PAGE 1: HOME ==================== */}
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            {/* HERO HERO HERO */}
            <section className="relative overflow-hidden bg-gradient-to-b from-white to-sky-50/50 pt-8 pb-16 px-4">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Hero Words */}
                <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                  
                  {/* Modern Tag */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-sky-400/10 text-slate-800 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-sky-400/10 tracking-wider">
                    <span className="bg-red-500 h-2 w-2 rounded-full animate-ping" />
                    ZRENJANINSKA LEGENDARNA PICERIJA & FAST FOOD BAŠTA
                  </div>
                  
                  <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none">
                    Najpoznatija <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-sky-500 underline decoration-red-500 decoration-wavy">pizza</span> u kraju
                  </h1>
                  
                  <p className="text-lg text-slate-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Pice, burgeri, roštilj, palačinke i dostava. Preko <span className="text-red-500 font-bold border-b border-red-200">800 Google recenzija</span> i hiljade zadovoljnih gostiju koji se uvek iznova vraćaju.
                  </p>

                  {/* QUICK STATS ROW */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-lg mx-auto lg:mx-0">
                    <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm text-center">
                      <p className="text-2xl font-black text-red-500">812+</p>
                      <p className="text-3xl font-extrabold text-slate-800 -mt-1">⭐⭐⭐⭐</p>
                      <p className="text-[11px] font-bold text-slate-500 tracking-wide uppercase">Google recenzija</p>
                    </div>
                    
                    <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-2xl font-black text-slate-800">4.1</span>
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      </div>
                      <p className="text-xs text-amber-500 font-extrabold uppercase mt-1">Visoka Ocena</p>
                      <p className="text-[11px] font-bold text-slate-500 tracking-wide uppercase">Na Google Mapama</p>
                    </div>

                    <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm text-center col-span-1">
                      <p className="text-2xl font-black text-sky-500 flex items-center justify-center gap-0.5">
                        03<span className="text-xs font-bold text-slate-400">h</span>
                      </p>
                      <span className="inline-block bg-emerald-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider mb-1">
                        Svaki Dan
                      </span>
                      <p className="text-[11px] font-bold text-slate-500 tracking-wide uppercase">Otvoreno do kasno</p>
                    </div>

                    <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm text-center col-span-1">
                      <p className="text-xl font-bold text-slate-800 flex justify-center gap-0.5 mt-1">🚀</p>
                      <p className="text-xs text-slate-900 font-extrabold mt-1">Brzi Prevoz</p>
                      <p className="text-[11px] font-bold text-slate-500 tracking-wide uppercase">Ili preuzimanje</p>
                    </div>
                  </div>

                  {/* HERO FOOTER ACTIONS */}
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
                    <button 
                      onClick={() => setActiveTab('menu')}
                      className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-md flex items-center justify-center gap-3 transition-transform hover:-translate-y-0.5"
                    >
                      <ShoppingBag className="w-5 h-5 animate-bounce" />
                      Naruči odmah
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('menu')}
                      className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-bold text-base px-8 py-4 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
                    >
                      <span>Pogledaj meni hrane</span>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Hero Graphic - App Showcase */}
                <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center">
                  <div className="relative w-full max-w-[420px] aspect-square rounded-[40px] bg-sky-200 overflow-hidden shadow-2xl border-4 border-white transform lg:rotate-2">
                    
                    {/* Glassmorphic overlays */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-transparent to-transparent z-10" />
                    
                    <img 
                      src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80" 
                      alt="TWIX Pizza" 
                      className="w-full h-full object-cover"
                    />

                    {/* App Overlay Banner */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-3xl z-20 shadow-lg border border-white/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-500 text-white rounded-xl p-2.5">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-extrabold text-sm text-slate-950 leading-tight">Najbolji ukusi grada</p>
                          <p className="text-xs text-sky-600 font-semibold uppercase tracking-wider">Poruči: 064 331 2105</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('menu')}
                        className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Floating Accent badges on Hero */}
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-black px-3.5 py-1.5 rounded-full z-20 flex items-center gap-1.5 shadow-md">
                      <span className="text-red-500">🔥</span> Banatska Pizza favorite
                    </div>

                    <div className="absolute top-1/2 -right-4 bg-sky-500 text-white text-xs font-black px-4 py-2 rounded-2xl z-20 flex flex-col items-center shadow-lg border border-sky-400 rotate-12">
                      <span className="text-lg">🧇</span> Slatki Greh pačinke!
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTIONS BENTO QUICK TILES */}
            <section className="max-w-7xl mx-auto px-4 py-12">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <p className="text-red-500 font-black text-xs uppercase tracking-wider mb-2">Širok izbor sveže hrane</p>
                <h2 className="text-3xl font-black text-slate-950">Izaberi svoju omiljenu kategoriju</h2>
                <p className="text-sm text-slate-500 mt-2">Svakoga dana spremamo sveže pice iz peći, sočne burgera, tradicionalni roštilj i preukusne palačinke!</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Category Card Pizza */}
                <div 
                  onClick={() => { setActiveTab('menu'); setMenuFilter('pizze'); }}
                  className="group bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 hover:border-red-100 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 block relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-[100px] transition-all group-hover:scale-110" />
                  <div className="h-14 w-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">🍕</div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-red-500 transition-colors">Pice (Pizza)</h3>
                  <p className="text-xs text-slate-500 mt-1">Legendarne pice od 32, 42 i 50cm, napravljene po čuvenom receptu sa bogatim nadevom.</p>
                  <div className="mt-4 flex items-center text-red-500 text-xs font-black gap-1 uppercase tracking-wider">
                    <span>Otvori Meni</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Category Card Sendvici */}
                <div 
                  onClick={() => { setActiveTab('menu'); setMenuFilter('sendvici'); }}
                  className="group bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 hover:border-sky-100 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 block relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-bl-[100px] transition-all group-hover:scale-110" />
                  <div className="h-14 w-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">🥪</div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-sky-500 transition-colors">Sendviči & Hot Dog</h3>
                  <p className="text-xs text-slate-500 mt-1">Uvek sveži topli somuni, originalni TWIX sendvič, ukusni hotdog i legendarne kifle sa prilozima.</p>
                  <div className="mt-4 flex items-center text-sky-500 text-xs font-black gap-1 uppercase tracking-wider">
                    <span>Pogledaj cene</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Category Card Rostilj */}
                <div 
                  onClick={() => { setActiveTab('menu'); setMenuFilter('rostilj'); }}
                  className="group bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 hover:border-amber-100 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 block relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[100px] transition-all group-hover:scale-110" />
                  <div className="h-14 w-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">🔥</div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">Roštilj & Burgers</h3>
                  <p className="text-xs text-slate-500 mt-1">Sveža pljeskavica, punjeno belo meso i batak, gurmanska kobasica, mešano meso i sočni pomfrit.</p>
                  <div className="mt-4 flex items-center text-amber-600 text-xs font-black gap-1 uppercase tracking-wider">
                    <span>Tradicionalni žar</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Category Card Palacinke */}
                <div 
                  onClick={() => { setActiveTab('menu'); setMenuFilter('palacinke'); }}
                  className="group bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 hover:border-pink-100 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 block relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-bl-[100px] transition-all group-hover:scale-110" />
                  <div className="h-14 w-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">🥞</div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-pink-500 transition-colors">Palačinke</h3>
                  <p className="text-xs text-slate-500 mt-1">Palačinke sa Nutelom, Eurokremom i tonom mlevene Plazme, idealne za desert nakon dobre slane hrane.</p>
                  <div className="mt-4 flex items-center text-pink-500 text-xs font-black gap-1 uppercase tracking-wider">
                    <span>Slatki svet</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            </section>

            {/* SECTOR "ZAŠTO TWIX" */}
            <section className="bg-sky-50/50 border-t border-b border-sky-100/40 py-16 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <p className="text-sky-600 font-extrabold text-xs uppercase tracking-widest">Kvalitet i Tradicija</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">Ukus kojem se gosti vraćaju</h2>
                  <p className="text-sm text-slate-500 mt-2">Pogledajte po čemu smo prepoznatljivi u Zrenjaninu i zašto smo omiljeno mesto zaljubljenika u dobru brzu hranu.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  
                  {/* Card 1 */}
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-2xl font-black mb-6">🍕</div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Velike i bogate pice</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Sve naše familijarne i standardne pice dolaze prepune najkvalitetnijeg kačkavalja, šunke i svežih začina. Nema štednje na sastojcima.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="h-12 w-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center text-2xl font-black mb-6">🍔</div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Sočni burgeri & Roštilj</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Pravi juneći i mešani ćevapi i pljeskavice koji se peku na pravom ćumuru daju jedinstvenu aromu svakom zalogaju u lepinji.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl font-black mb-6">🚀</div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Brza i tačna dostava</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Kada vas uhvati kasna glad u gradu ili želite porodični ručak, naša brza dostava stiže do vašeg praga ekstremno brzo.
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="h-12 w-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center text-2xl font-black mb-6">🧇</div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Palačinke i deserti</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Ogromne, slatke i meke palačinke sa nadevom koji curi na sve strane. Moguće je kombinovati džemove, krem, plazmu i voće.
                    </p>
                  </div>

                  {/* Card 5 */}
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-2xl font-black mb-6">💰</div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Pristupačne cene</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Trudimo se da maksimalno zadržimo domaćinske, pristojne i jeftine cene hrane kako bi svako mogao uživati u vrhunskom obroku.
                    </p>
                  </div>

                  {/* Card 6 */}
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-2xl font-black mb-6">🤝</div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Dugogodišnje poverenje</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Sa generacijskim radom i predanosti, ponosni smo na stotine vernih gostiju, dobrih utisaka i preporuka širom Zrenjanina.
                    </p>
                  </div>

                </div>

                {/* Call Out Banner Home */}
                <div className="mt-16 bg-gradient-to-r from-red-500 to-sky-600 rounded-[40px] text-white p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                  <div className="text-center md:text-left space-y-3 relative z-10">
                    <span className="bg-white/20 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-widest">PROBAJTE VEĆ DANAS</span>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">Gladni ste? Naručite najbolju dostavu pre nego što se zatvori!</h3>
                    <p className="text-white/85 text-sm max-w-xl font-medium">Bilo da želite da svratite do naše bašte preko puta 102 marketa ili naručite na kućnu adresu, spremni smo za vas!</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10 shrink-0">
                    <a 
                      href="tel:0643312105"
                      className="bg-white hover:bg-slate-50 text-slate-900 font-extrabold px-8 py-4 rounded-2xl text-center shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
                    >
                      <Phone className="w-5 h-5 text-red-500 animate-pulse" />
                      Pozovite 064 331 2105
                    </a>
                    <button 
                      onClick={() => setActiveTab('menu')}
                      className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-extrabold px-8 py-4 rounded-2xl text-center shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Otputujte u Meni
                    </button>
                  </div>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* ==================== PAGE 2: MENU ==================== */}
        {activeTab === 'menu' && (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            
            {/* Header intro of Meni */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-red-500 font-black text-xs uppercase tracking-widest">Sveže Spremljeno</span>
              <h1 className="text-4xl font-extrabold text-slate-950 mt-1">Domaći TWIX Meni Hrane</h1>
              <p className="text-sm text-slate-500 mt-2">
                Pronađite našu celokupnu ponudu sa tačnim dimenzijama i cenama. Dodajte artikle direktno u korpu i lako pošaljite porudžbinu.
              </p>
            </div>

            {/* SECTIONS BAR AND FILTER SEARCH ROW */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
              
              {/* Category tabs */}
              <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                {[
                  { key: 'all', title: 'Sve kategorije 🍽️' },
                  { key: 'pizze', title: 'Pice 🍕' },
                  { key: 'sendvici', title: 'Sendviči 🥪' },
                  { key: 'rostilj', title: 'Roštilj 🔥' },
                  { key: 'palacinke', title: 'Palačinke 🥞' }
                ].map((tc) => (
                  <button
                    key={tc.key}
                    onClick={() => setMenuFilter(tc.key as any)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shrink-0 transition-all ${
                      menuFilter === tc.key 
                        ? 'bg-red-500 text-white shadow-sm shadow-red-500/25' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tc.title}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Pretraži ponudu hrane..." 
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all placeholder:text-slate-400"
                />
                {menuSearch && (
                  <button 
                    onClick={() => setMenuSearch('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

            {/* DYNAMIC LISTING BY SELECTED FOOD CATEGORY */}
            <div className="space-y-12">
              
              {/* Categories wrapper */}
              {['pizze', 'sendvici', 'rostilj', 'palacinke'].map((cat) => {
                // If filter is set and does not match the looped category, skip
                if (menuFilter !== 'all' && menuFilter !== cat) return null;

                const items = MENU_ITEMS.filter(it => it.category === cat)
                  .filter(it => it.name.toLowerCase().includes(menuSearch.toLowerCase()) || (it.description?.toLowerCase().includes(menuSearch.toLowerCase()) ?? false));

                if (items.length === 0) return null;

                const readableCategoryName = () => {
                  switch (cat) {
                    case 'pizze': return 'Pice (Pizza)';
                    case 'sendvici': return 'Sendviči & Hot Dog';
                    case 'rostilj': return 'Roštilj i Prilozi';
                    case 'palacinke': return 'Palačinke i Slatkiši';
                    default: return '';
                  }
                };

                return (
                  <div key={cat} className="space-y-6">
                    
                    {/* CUSTOM STICKER/BANNER PER SECTION REQUESTED BY USER */}
                    {getCategorySticker(cat)}

                    <div className="border-b border-slate-200 pb-2">
                      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        {readableCategoryName()}
                        <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {items.length} artikala
                        </span>
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((item) => {
                        const isPizza = item.category === 'pizze';
                        const hasSizes = isPizza && item.sizes;

                        return (
                          <div 
                            key={item.id} 
                            id={`item-${item.id}`}
                            className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200/80 transition-all flex flex-col group"
                          >
                            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                              
                              {/* Glowing Badges */}
                              {item.badge && (
                                <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                  {item.badge}
                                </span>
                              )}

                              <span className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md text-sky-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {cat === 'pizze' ? 'Peć na drva' : cat === 'rostilj' ? 'Pravi ćumur' : 'Svež rad'}
                              </span>
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="text-xl font-bold tracking-tight text-slate-950">{item.name}</h3>
                                  
                                  {/* Standard non-pizza price */}
                                  {!hasSizes && (
                                    <span className="text-lg font-black text-slate-900 bg-slate-50 border border-slate-100 px-3 py-1 rounded-xl text-right shrink-0">
                                      {item.price as number} <span className="text-xs font-bold text-slate-500 uppercase">Rsd</span>
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-slate-500 text-xs font-normal leading-relaxed">{item.description}</p>
                                )}
                              </div>

                              {/* Pizza Sizes Showcase Block */}
                              {isPizza && item.sizes && (
                                <div className="mt-4 p-3 bg-red-50/40 border border-red-500/5 rounded-2xl space-y-2">
                                  <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Dostupne Velike Dimenzije:</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {item.sizes.map((sz) => {
                                      const pList = item.price as Record<string, number>;
                                      return (
                                        <div key={sz} className="bg-white border border-slate-100 p-1.5 rounded-xl text-center">
                                          <p className="text-[10px] font-bold text-slate-500">{sz}</p>
                                          <p className="text-xs font-extrabold text-slate-950">{pList[sz]} RSD</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                                
                                {/* Choose Pizza Size direct buttons on listing or standard Add button */}
                                {isPizza && item.sizes ? (
                                  <div className="flex items-center gap-1.5 w-full">
                                    <button
                                      onClick={() => addToCart(item, '32cm')}
                                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[11px] py-2.5 rounded-xl transition-all shadow-sm flex flex-col items-center"
                                    >
                                      <span>32cm</span>
                                      <span className="text-[10px] font-medium opacity-90">Dodaj</span>
                                    </button>
                                    <button
                                      onClick={() => addToCart(item, '42cm')}
                                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] py-2.5 rounded-xl transition-all shadow-sm flex flex-col items-center"
                                    >
                                      <span>42cm</span>
                                      <span className="text-[10px] font-medium opacity-90">Dodaj</span>
                                    </button>
                                    <button
                                      onClick={() => addToCart(item, '50cm')}
                                      className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-[11px] py-2.5 rounded-xl transition-all shadow-sm flex flex-col items-center"
                                    >
                                      <span>50cm</span>
                                      <span className="text-[10px] font-medium opacity-90">Dodaj</span>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => addToCart(item)}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span>Dodaj u porudžbinu</span>
                                  </button>
                                )}

                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            </div>

            {/* Empty search fallback */}
            {MENU_ITEMS.filter(item => {
              if (menuFilter !== 'all' && item.category !== menuFilter) return false;
              return item.name.toLowerCase().includes(menuSearch.toLowerCase()) || (item.description?.toLowerCase().includes(menuSearch.toLowerCase()) ?? false);
            }).length === 0 && (
              <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100 max-w-lg mx-auto">
                <span className="text-5xl">🤷‍♂️</span>
                <h3 className="text-xl font-bold text-slate-800 mt-4">Nema rezultata za pretragu</h3>
                <p className="text-slate-500 text-xs mt-1">Pokušajte sa nekim drugim terminom poput "Kaprićoza", "Batak" ili "Nutela".</p>
                <button 
                  onClick={() => { setMenuSearch(''); setMenuFilter('all'); }} 
                  className="mt-6 bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
                >
                  Prikaži ceo meni
                </button>
              </div>
            )}

            {/* FLOATING QUICK BASKET SUMMARY ON THE BOTTOM BAR */}
            {cart.length > 0 && (
              <div className="fixed bottom-24 left-4 right-4 md:bottom-8 md:left-auto md:right-8 z-40 bg-white hover:bg-slate-50 shadow-2xl rounded-3xl border border-sky-100 p-4 max-w-sm md:w-[350px] animate-bounce-short">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-red-500 rounded-xl text-white">🥗</span>
                    <div>
                      <p className="font-extrabold text-sm text-slate-900">Moja Korpa ({cart.reduce((s, i) => s + i.quantity, 0)} jela)</p>
                      <p className="text-xs text-slate-500 font-semibold">{cartTotal} RSD ukupno</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="bg-sky-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl uppercase tracking-wider shadow-sm hover:bg-sky-600 transition-colors"
                  >
                    Naruči
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================== PAGE 3: GALLERY ==================== */}
        {activeTab === 'gallery' && (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            
            {/* Header intro of Meni */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-red-500 font-black text-xs uppercase tracking-widest">Slike i Ambijent</span>
              <h1 className="text-4xl font-extrabold text-slate-950 mt-1">TWIX Foto Galerija</h1>
              <p className="text-sm text-slate-500 mt-2">
                Pogledajte naše ukusne pizze, burgere, palačinke, porodičnu baštu i proces pripreme hrane na roštilju. Možete dodati i svoju sliku obroka!
              </p>
            </div>

            {/* FILTER CATEGORY ROW */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 bg-white p-3 rounded-2xl border border-slate-100 scrollbar-none">
              {[
                { key: 'all', title: 'Sve slike 🖼️' },
                { key: 'pizze', title: 'Pice 🍕' },
                { key: 'burgeri', title: 'Burgeri 🍔' },
                { key: 'rostilj', title: 'Roštilj 🔥' },
                { key: 'palacinke', title: 'Palačinke 🥞' },
                { key: 'enterijer', title: 'Ambijent 🪵' },
                { key: 'dostava', title: 'Dostava 🚗' }
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setGalleryFilter(cat.key as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all ${
                    galleryFilter === cat.key 
                      ? 'bg-sky-500 text-white shadow-sm' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* IMAGE GRID WITH ZOOM LIGHTBOX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              
              {/* UPLOAD SIMULATOR SQUARE BUTTON */}
              <div className="bg-slate-100/80 border-2 border-dashed border-slate-300 rounded-[32px] p-6 flex flex-col items-center justify-center text-center group cursor-pointer relative hover:bg-sky-50 hover:border-sky-300 transition-colors h-72">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="h-16 w-16 bg-white shadow-sm rounded-full flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform mb-4">
                  {isUploading ? (
                    <span className="block animate-spin text-2xl">⏳</span>
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                <h3 className="font-extrabold text-sm text-slate-800">Podeli svoju TWIX hranu</h3>
                <p className="text-[11px] text-slate-500 mt-1 px-4 leading-relaxed">Klikni ili prevuci sliku ovde da dodaš fotografiju u gostujuću galeriju.</p>
              </div>

              {/* Uploaded User Photos */}
              {uploadedPhotos
                .filter(img => galleryFilter === 'all' || img.category === galleryFilter)
                .map((img) => (
                  <div 
                    key={img.id}
                    onClick={() => setLightboxImage(img)}
                    className="relative rounded-[32px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-md border border-slate-100 h-72 animate-fade-in-up"
                  >
                    <img 
                      src={img.url} 
                      alt={img.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6" />
                    
                    {/* User upload badge */}
                    <span className="absolute top-4 left-4 bg-lime-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                      Uplodovano
                    </span>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-bold text-sm tracking-tight mb-0">{img.title}</p>
                      <p className="text-[10px] text-sky-300 font-semibold tracking-wider uppercase">Gost pizzerije</p>
                    </div>
                  </div>
                ))}

              {/* Standard Gallery Items */}
              {GALLERY_ITEMS
                .filter(img => galleryFilter === 'all' || img.category === galleryFilter)
                .map((img) => (
                  <div 
                    key={img.id}
                    onClick={() => setLightboxImage(img)}
                    className="relative rounded-[32px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-md border border-slate-100 h-72"
                  >
                    <img 
                      src={img.url} 
                      alt={img.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6" />
                    
                    {/* Tag badge */}
                    <span className="absolute top-4 left-4 bg-sky-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {img.category}
                    </span>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-bold text-sm tracking-tight mb-0">{img.title}</p>
                      <p className="text-[10px] text-sky-300 font-semibold tracking-wider uppercase">Picerija TWIX original</p>
                    </div>
                  </div>
                ))}

            </div>

            {/* LIGHTBOX POPUP SCREEN */}
            {lightboxImage && (
              <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
                <button 
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="max-w-4xl w-full flex flex-col items-center">
                  <div className="relative rounded-3xl overflow-hidden bg-slate-900 max-h-[70vh] flex items-center justify-center shadow-2xl border border-white/10">
                    <img 
                      src={lightboxImage.url} 
                      alt={lightboxImage.title} 
                      className="max-w-full max-h-[70vh] object-contain"
                    />
                  </div>
                  <div className="text-center mt-6 text-white space-y-1">
                    <span className="inline-block bg-sky-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">{lightboxImage.category}</span>
                    <h3 className="text-xl font-bold">{lightboxImage.title}</h3>
                    <p className="text-xs text-slate-400">Sveža i uvek topla hrana, Picerija TWIX Zrenjanin</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================== PAGE 4: REVIEWS ==================== */}
        {activeTab === 'reviews' && (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Reviews Aggregator Details */}
              <div className="lg:col-span-5 space-y-8">
                
                <div className="space-y-3">
                  <span className="text-red-500 font-black text-xs uppercase tracking-widest">Utisci Naših Gostiju</span>
                  <h1 className="text-4xl font-extrabold text-slate-950">Hiljade srećnih ljudi i punih stomaka</h1>
                  <p className="text-sm text-slate-500">
                    Naše jelo govore sami za sebe. Ponosni smo na visoku ocenu na Google i Instagram recenzijama gostiju.
                  </p>
                </div>

                {/* Glassmorphic dashboard of average */}
                <div className="bg-sky-500 text-white p-8 rounded-[40px] shadow-lg border border-sky-400 flex flex-col items-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-white text-sky-500 flex items-center justify-center font-black text-3xl">4.1</div>
                  <div>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-5 h-5 fill-amber-300 text-amber-300" />
                      ))}
                    </div>
                    <p className="font-extrabold text-xl mt-2">Visok rejting na Google</p>
                    <p className="text-xs text-sky-100 mt-1">Preko 812 nezavisnih ocena lokalnih posetilaca</p>
                  </div>
                </div>

                {/* New Review Submission Form */}
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                  <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">Napiši svoje utiske</h3>
                  {showReviewSuccess ? (
                    <div className="bg-emerald-500 text-white p-4 rounded-2xl text-xs font-bold text-center">
                      Hvala vam! Vaša recenzija je uspešno objavljena na sajtu! 🎉
                    </div>
                  ) : (
                    <form onSubmit={submitReview} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vaše Ime i Prezime</label>
                        <input 
                          type="text" 
                          required
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          placeholder="npr. Dragan Kovačević" 
                          className="w-full text-xs font-semibold bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-sky-400 focus:bg-white transition-all text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ocena</label>
                        <div className="flex gap-1.5 pt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReviewRating(star)}
                              className="focus:outline-none"
                            >
                              <Star className={`w-6 h-6 ${star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Komentar</label>
                        <textarea 
                          rows={3}
                          required
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          placeholder="Podelite vaše iskustvo sa picom, palačinkama ili brzinom dostave..." 
                          className="w-full text-xs font-semibold bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-sky-400 focus:bg-white transition-all text-slate-800"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs py-2.5 rounded-xl transition-colors"
                      >
                        Ostavi javnu recenziju
                      </button>
                    </form>
                  )}
                </div>

              </div>

              {/* Reviews Feed List */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-xl font-bold text-slate-900 uppercase">Najnovije ocene ({reviewsList.length})</h2>
                  <span className="text-xs text-sky-600 font-extrabold">Filtrirano po datumu</span>
                </div>

                <div className="space-y-4">
                  {reviewsList.map((rev) => (
                    <div 
                      key={rev.id}
                      className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start gap-4"
                    >
                      {/* Avatar initials representation */}
                      <div className="h-12 w-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-black text-lg uppercase shrink-0">
                        {rev.author.substring(0, 2)}
                      </div>
                      <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-extrabold text-sm text-slate-900">{rev.author}</p>
                          <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 font-normal leading-relaxed pt-1.5">"{rev.text}"</p>
                        
                        <div className="pt-2 flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                          <Check className="w-3.5 h-3.5" /> Potvrđen gost (Google Local Guide)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ==================== PAGE 5: CONTACT ==================== */}
        {activeTab === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in space-y-12">
            
            {/* Header intro */}
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-red-500 font-black text-xs uppercase tracking-widest">Sveže ispečeno i na Vašoj Adresi</span>
              <h1 className="text-4xl font-extrabold text-slate-950 mt-1">Kontakt, Radno Vreme & Dostava</h1>
              <p className="text-sm text-slate-500 mt-2">
                Nalazimo se u Stražilovskoj ulici, odmah preko puta 102 Marketa u Zrenjaninu. Svratite ili poručite brzu dostavu.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Working hours & Quick links */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Working hours table card */}
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-base uppercase tracking-wider text-slate-900 border-b pb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-red-500" /> Radno Vreme Picerije TWIX
                  </h3>
                  
                  {/* Highlight box */}
                  <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                    isOpenNow ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                  }`}>
                    <span className="text-2xl">⚡</span>
                    <div>
                      <p className="font-extrabold text-sm">{isOpenNow ? 'Trenutno radimo punom parom!' : 'Trenutno smo zatvoreni.'}</p>
                      <p className="text-xs font-semibold opacity-90">{timeUntilClose}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {WORKING_HOURS.map((wh) => (
                      <div key={wh.day} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2 text-slate-700">
                        <span className="font-bold">{wh.day}</span>
                        <span className="font-mono bg-slate-100 px-2.5 py-0.5 rounded text-slate-800 font-bold">{wh.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact and address quick card */}
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-base uppercase tracking-wider text-slate-900 border-b pb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-sky-500" /> Lokacijski Podaci
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-red-100 text-red-600 rounded-xl shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-950">Adresa Picerije:</p>
                        <p className="text-xs text-slate-500 mt-0.5">Stražilovska, preko puta 102 Marketa, Zrenjanin</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-sky-100 text-sky-600 rounded-xl shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-950">Dostava / Porudžbine telefon:</p>
                        <p className="text-xs text-slate-600 mt-0.5 font-bold">064 331 21 05</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-pink-100 text-pink-600 rounded-xl shrink-0">
                        <Instagram className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-950">Instagram Profil:</p>
                        <a href="https://instagram.com/pizzerijatwix" target="_blank" rel="noreferrer" className="text-xs text-sky-600 font-bold hover:underline">
                          @pizzerijatwix
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl shrink-0">
                        <Facebook className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-950">Facebook Stranica:</p>
                        <span className="text-xs text-slate-500 mt-0.5">TWIX Pizza</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Google Map Embedded */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base uppercase tracking-wider text-slate-900">Interaktivna Google Mapa</h3>
                    <span className="bg-sky-100 text-sky-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Plaža & Bašta Zrenjanin</span>
                  </div>

                  {/* Google maps iFrame with custom pin locator */}
                  <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                    <iframe 
                      title="Google Maps Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2797.9734135541607!2d20.395632!3d45.378931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475b1062ef998e3b%3A0xe9f7cb6cb9a7d3a2!2sStra%C5%BEilovska%2C%20Zrenjanin!5e0!3m2!1sen!2srs!4v1700000000000!5m2!1sen!2srs" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={true}
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  {/* Direct Huge Dial Button for immediate call */}
                  <div className="pt-4">
                    <a 
                      href="tel:0643312105"
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-extrabold text-base py-5 rounded-2xl shadow-md flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]"
                    >
                      <Phone className="w-6 h-6 animate-pulse" />
                      <span>POZOVI ODMAH ZA DOSTAVU: 064 331 21 05</span>
                    </a>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* SHOPPING CART OVERLAY MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-fade-in-left">
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-red-500" />
                  <h2 className="font-extrabold text-lg text-slate-950 uppercase">Korpa za naručivanje</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart List */}
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <span className="text-5xl">🛒</span>
                  <p className="font-bold text-slate-700">Vaša korpa je trenutno prazna</p>
                  <button 
                    onClick={() => { setIsCartOpen(false); setActiveTab('menu'); }}
                    className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-black px-4 py-2 rounded-xl transition-all"
                  >
                    Vidi Meni hrane
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
                    >
                      <div>
                        <p className="font-extrabold text-sm text-slate-950 leading-tight">
                          {item.name}
                        </p>
                        {item.selectedSize && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">
                            Velika {item.selectedSize}
                          </span>
                        )}
                        <p className="text-xs text-slate-500 font-extrabold mt-1">{item.price} RSD / kom</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white border border-slate-150 rounded-xl overflow-hidden shadow-inner">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-2.5 py-1 text-slate-500 hover:bg-slate-50"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-black text-slate-950">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2.5 py-1 text-slate-500 hover:bg-slate-50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total checkout section */}
            {cart.length > 0 && (
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500 uppercase">Ukupno za plaćanje:</span>
                  <span className="text-2xl font-black text-slate-950">{cartTotal} RSD</span>
                </div>
                
                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100/40 text-left">
                  <p className="text-[10px] text-sky-700 font-black uppercase">ℹ️ PORUČIVANJE PREKO TELEFONA</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Nakon što kliknete "Zvrši i Pozovi", vaša cela porudžbina biće kopirana i pokreće se brz poziv za dostavu.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setCart([])}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold text-xs py-3.5 rounded-xl text-center"
                  >
                    Isprazni korpu 🗑️
                  </button>
                  <button 
                    onClick={handleOrderSubmit}
                    className="bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs py-3.5 rounded-xl text-center shadow-md"
                  >
                    Izvrši i Pozovi 📞
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE PREMIUM FLOATING BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-sky-100 shadow-2xl rounded-t-[32px] px-6 py-2 flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('home')} 
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'home' ? 'text-red-500 font-extrabold scale-110' : 'text-slate-400'}`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">Početna</span>
        </button>

        <button 
          onClick={() => setActiveTab('menu')} 
          className={`flex flex-col items-center gap-1 p-2 relative ${activeTab === 'menu' ? 'text-red-500 font-extrabold scale-110' : 'text-slate-400'}`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">Meni</span>
        </button>

        {/* Center CTA button - Call */}
        <a 
          href="tel:0643312105" 
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 h-14 w-14 -mt-8 flex items-center justify-center shadow-lg transform hover:scale-105 transition-all"
        >
          <Phone className="w-6 h-6 animate-pulse" />
        </a>

        <button 
          onClick={() => setActiveTab('gallery')} 
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'gallery' ? 'text-red-500 font-extrabold scale-110' : 'text-slate-400'}`}
        >
          <ImageIcon className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">Galerija</span>
        </button>

        <button 
          onClick={() => setActiveTab('reviews')} 
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'reviews' ? 'text-red-500 font-extrabold scale-110' : 'text-slate-400'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">Utisci</span>
        </button>
      </nav>

      {/* DETAILED FOOTER DISPLAY */}
      <footer className="bg-slate-900 text-white pt-16 pb-32 md:pb-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center font-bold italic">TW</div>
              <span className="text-xl font-extrabold uppercase tracking-wider">Pizzerija TWIX</span>
            </div>
            <p className="text-xs text-slate-400 font-normal leading-relaxed">
              Legendarne pice, bogati mesnati roštilji, sendviči i najslađe palačinke u komšiluku. Otvoreno svakog dana do 03:00 časa ujutru za sve noćne ptice i gurmane.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://instagram.com/pizzerijatwix" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 hover:bg-red-500 hover:text-white rounded-xl transition-all text-slate-300">
                <Instagram className="w-5 h-5" />
              </a>
              <span className="p-2 bg-slate-800 hover:bg-sky-500 hover:text-white rounded-xl transition-all text-slate-300 cursor-pointer">
                <Facebook className="w-5 h-5" />
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-widest text-sky-400">Naš Meni hrane</h3>
            <ul className="text-xs text-slate-300 space-y-2 font-semibold">
              <li className="hover:text-red-500 cursor-pointer transition-colors" onClick={() => { setActiveTab('menu'); setMenuFilter('pizze'); }}>Pice (Familijarne i standardne)</li>
              <li className="hover:text-red-500 cursor-pointer transition-colors" onClick={() => { setActiveTab('menu'); setMenuFilter('sendvici'); }}>Originalni TWIX Sendviči</li>
              <li className="hover:text-red-500 cursor-pointer transition-colors" onClick={() => { setActiveTab('menu'); setMenuFilter('rostilj'); }}>Pljeskavice i meso na ćumuru</li>
              <li className="hover:text-red-500 cursor-pointer transition-colors" onClick={() => { setActiveTab('menu'); setMenuFilter('palacinke'); }}>Slatke palačinke sa Plazmom</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-widest text-sky-400">O nama & Lokacija</h3>
            <div className="text-xs text-slate-300 space-y-2">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Stražilovska, Zrenjanin</p>
              <p className="flex items-center gap-2 text-red-400 font-extrabold"><Phone className="w-4 h-4" /> 064 331 21 05</p>
              <p className="text-slate-400 leading-normal font-sans">Preko puta 102 Marketa, savršeno lokacijski pozicionirano za brzu dostavu ili usputno preuzimanje.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-widest text-sky-400">Potvrda Poverenja</h3>
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                "Prijatan ambijent, hrana je preukusna. Obavezno probati Banatsku pizzu!"
              </p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider text-right">- Google lokalni vodič</p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-slate-800 text-center text-[10px] text-slate-500 uppercase tracking-widest">
          <p>© 2026 Picerija TWIX Zrenjanin. Sva prava zadržana. • Izgrađeno za ljubitelje dobrog zalogaja.</p>
        </div>
      </footer>

    </div>
  );
}
