import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Moon, Coffee, Activity, Brain, Flame, ShieldCheck, Heart, AlertCircle,
  Zap, Smile, ArrowRight, Check, Phone, Star, Truck, Lock, RefreshCw,
  ShoppingBag, Sparkles, Award, Users, Play, Clock, ChevronLeft, ChevronRight,
  User, LogOut, ShieldAlert, DollarSign, Package, TrendingUp, BarChart2, Edit, Menu, Settings,
  Mail
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ─── CONFIG ─────────────────────────────── */
const CONTACT_EMAIL = 'support@apasya.in';
const CONTACT_LINK  = 'mailto:support@apasya.in';
const SELLER_NAME   = 'Amit Kumar';
const SELLER_TOWN   = 'Satpuraa Range';


// Local Node.js Backend Server URL
const BACKEND_API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;
// Enable Sandbox / Simulated Payment mode for testing
const SIMULATE_PAYMENT = false;

/* ─── PAIN CARDS DATA (3x3 Grid) ──────────── */
const PAINS = [
  { 
    icon: <Moon size={28} color="#b87333" />, 
    title: 'Wake Up Exhausted', 
    desc: 'Wake up exhausted, no matter how long you slept', 
    image: '/images/Wake_up.png' 
  },
  { 
    icon: <Coffee size={28} color="#b87333" />, 
    title: 'Energy Crashes', 
    desc: 'Energy crashes after one hour of work', 
    image: '/images/Energy_Crash (2).png' 
  },
  { 
    icon: <Activity size={28} color="#b87333" />, 
    title: 'Plateaued Performance', 
    desc: 'Gym performance has plateaued for months', 
    image: '/images/Gym_perf.png' 
  },
  { 
    icon: <Brain size={28} color="#b87333" />, 
    title: 'Mid-Day Brain Fog', 
    desc: 'Brain fog sets in by mid-afternoon', 
    image: '/images/Brain_fog (2).png' 
  },
  { 
    icon: <Flame size={28} color="#b87333" />, 
    title: 'Broken Sleep', 
    desc: 'Sleep is broken, shallow and not refreshing', 
    image: '/images/Sleep_is_broken.png' 
  },
  { 
    icon: <ShieldCheck size={28} color="#b87333" />, 
    title: 'Weak Immunity', 
    desc: 'Falling sick repeatedly: weak immunity', 
    image: '/images/FallingSick.png' 
  },
  { 
    icon: <Heart size={28} color="#b87333" />, 
    title: 'Joint Aches', 
    desc: 'Joints ache after basic activity or workouts', 
    image: '/images/Joint_ache.png' 
  },
  { 
    icon: <AlertCircle size={28} color="#b87333" />, 
    title: 'No Results', 
    desc: "Supplements you've tried didn't deliver", 
    image: '/images/Supplement.png' 
  },
  { 
    icon: <Clock size={28} color="#b87333" />, 
    title: 'Premature Aging', 
    desc: 'Feel like your body is aging faster than it should', 
    image: '/images/aging_faster.png' 
  },
];

/* ─── BENEFITS DATA ───────────────────────── */
const BENEFITS = [
  { icon: <Zap size={40} color="#b87333" />,        title: 'All-Day Energy',       desc: 'No crash. No caffeine. Real cellular energy from minerals your body actually absorbs.', image: '/images/benefits/energy.png' },
  { icon: <Brain size={40} color="#b87333" />,       title: 'Mental Clarity',       desc: 'Fulvic acid helps nutrients reach your brain. Clearer thinking, faster recall, better focus.', image: '/images/benefits/clarity.png' },
  { icon: <ShieldCheck size={40} color="#b87333" />, title: 'Stronger Immunity',    desc: '85+ trace minerals rebuild your immune system from the ground up.', image: '/images/benefits/immunity_male.png', hoverImage: '/images/benefits/immunity_female.png' },
  { icon: <Activity size={40} color="#b87333" />,    title: 'Faster Recovery',      desc: 'Athletes use it to recover between sessions. Wake up ready to train again.', image: '/images/benefits/recovery.png' },
  { icon: <Moon size={40} color="#b87333" />,        title: 'Deep Sleep',           desc: 'Minerals regulate your sleep cycle. You\'ll notice the difference within 1 week.', image: '/images/benefits/sleep.png' },
  { icon: <Flame size={40} color="#b87333" />,       title: 'Hormonal Balance',     desc: 'Works for both men and women. Naturally supports the hormones that affect energy and mood.', image: '/images/benefits/hormones_male.png', hoverImage: '/images/benefits/hormones_female.png' },
  { icon: <Smile size={40} color="#b87333" />,       title: 'Gut Health',           desc: 'Ancient digestive support. Reduces bloating, improves nutrient absorption.', image: '/images/benefits/gut_male.png', hoverImage: '/images/benefits/gut_female.png' },
  { icon: <Heart size={40} color="#b87333" />,       title: 'Joint & Bone Strength',desc: 'Calcium and magnesium in bioavailable form. Your joints thank you within 2–3 weeks.', image: '/images/benefits/strength_male.png', hoverImage: '/images/benefits/strength_female.png' },
];


/* ─── REVIEWS DATA (GRID FROM IMAGE 2) ────── */
const REVIEWS = [
  {
    name: 'Mohd Fahad',
    verified: true,
    date: '03/05/2026',
    rating: 5,
    title: 'Good services',
    text: 'Highly recommend best product'
  },
  {
    name: 'Anonymous',
    verified: false,
    date: '27/05/2025',
    rating: 5,
    title: 'Seeing better results',
    text: 'Felt like I had hit a plateau, started seeing better results mainly in my recovery'
  },
  {
    name: 'Anonymous',
    verified: false,
    date: '24/04/2025',
    rating: 4,
    title: 'Stamina next level ho gaya hai',
    text: 'Stamina kaafi badh gaya hai. Din bhar active rehta hoon'
  },
  {
    name: 'Hasibur Rahoman',
    verified: false,
    date: '10/07/2025',
    rating: 5,
    title: 'Shilajit Gold Resin',
    text: 'Great product!'
  },
  {
    name: 'Anonymous',
    verified: false,
    date: '20/05/2025',
    rating: 4,
    title: 'Soreness pehle se kaafi kam hai',
    text: 'Protein ke saath yeh resin liya stamina improve ho gaya. Ab zyada weight lift karta hoon aur gym ke baad bhi active feel karta hoon.'
  },
  {
    name: 'Anonymous',
    verified: false,
    date: '17/04/2025',
    rating: 5,
    title: 'Muscle recovery fast ho gaya hai',
    text: 'Seeing better gains, after 3 months of use. Sahi hai'
  },
  {
    name: 'Anonymous',
    verified: false,
    date: '13/06/2025',
    rating: 5,
    title: 'Heavy lifts ab easily ho jaate hai',
    text: 'Recovery fast ho gayi. Heavy weights uthata hoon aur gym ke baad bhi active feel karta hoon.'
  },
  {
    name: 'Anonymous',
    verified: false,
    date: '11/05/2025',
    rating: 4,
    title: 'Achha product hai, feel energetic post workout',
    text: '2 mahine se use kar raha hoon stamina improve ho gaya hai.'
  },
  {
    name: 'Anonymous',
    verified: false,
    date: '11/04/2025',
    rating: 5,
    title: 'Bahut badhiya shilajit hai',
    text: 'Din bhar thakan nahi hoti. Energy levels high rehte hain aur deep sleep aati hai.'
  }
];

/* ─── VS TABLE DATA ───────────────────────── */
const VS_ROWS = [
  ['Fillers added to bind the tablet',           'Zero additives: only shilajit'],
  ['Heat processing destroys some minerals',     'Sun-dried only, minerals intact'],
  ['10–30% actual shilajit content',             '100% raw resin: nothing else'],
  ['Shelf life = 2 years with preservatives',    'Naturally stable, no preservatives needed'],
  ['Mass factory batch: no traceability',       'Known source: you know where it comes from'],
];

/* --- FAQ DATA --- */
const FAQ_ITEMS = [
  {
    cat: 'product',
    question: 'What exactly is raw Shilajit resin?',
    answer: <>Shilajit is a <strong>natural mineral resin</strong> that oozes from Himalayan rock cracks during warmer months. It forms over thousands of years as plant matter and microbial activity compress between geological layers. Our resin is collected in its <strong>original tar-like form</strong> - no tablets, no gummies, no fillers - exactly as it exists in nature.</>
  },
  {
    cat: 'sourcing',
    question: 'Where is your Shilajit sourced from?',
    answer: <>We source directly from <strong>high-altitude Himalayan regions (above 16,000 ft)</strong> - areas untouched by industrial pollution. Our collectors are local to the mountains and have generations of experience identifying premium-grade resin. No middlemen. No bulk resellers. <strong>Direct from source to you.</strong></>
  },
  {
    cat: 'product',
    question: 'How is your Shilajit different from tablets or capsules?',
    answer: <>Tablets and capsules are processed forms that often contain <strong>fillers, binders, and significantly diluted Shilajit</strong>. The heating and processing required to make them destroys many of the naturally occurring fulvic acid and trace mineral compounds. Raw resin is the <strong>most potent and bioavailable</strong> form - it dissolves instantly in warm liquids and is absorbed directly without any extra steps.</>
  },
  {
    cat: 'usage',
    question: 'How do I use it? How much should I take?',
    answer: <>Take a <strong>pea-sized amount (roughly 300-500mg)</strong> and dissolve it in warm water, milk, or herbal tea. Do not use boiling water. Stir gently until fully dissolved. Best taken in the <strong>morning on an empty stomach</strong> for optimal absorption. Beginners should start with a smaller amount for the first week and gradually increase. Most people notice results within 2-4 weeks of consistent use.</>
  },
  {
    cat: 'usage',
    question: 'What are the benefits of taking Shilajit regularly?',
    answer: <>Shilajit has been used in Ayurveda for over 3,000 years. Modern research supports benefits including <strong>improved energy and mitochondrial function</strong>, enhanced testosterone and hormonal balance, better cognitive clarity, iron absorption, and anti-inflammatory effects. The high <strong>fulvic acid content</strong> acts as a carrier molecule that helps other nutrients penetrate cell walls more effectively.</>
  },
  {
    cat: 'safety',
    question: 'Is it safe? Are there any side effects?',
    answer: <>Pure, authentic Shilajit is considered safe for most healthy adults at recommended doses. However, <strong>raw/unprocessed Shilajit from unknown sources can contain heavy metals or fungi</strong> - this is why sourcing matters. Our resin is tested for heavy metals, microbial contamination, and purity. If you are pregnant, nursing, have a medical condition, or take medications, consult a physician first. Some people experience mild digestive adjustment in the first few days - this is normal and temporary.</>
  },
  {
    cat: 'product',
    question: "How do I know it's authentic and not fake?",
    answer: <>Genuine Shilajit resin has a <strong>bitter, earthy taste</strong> and a tar-like consistency that softens when warmed. It dissolves completely in warm water without leaving residue. It should never be brittle or powdery at room temperature. Our resin comes with <strong>lab test documentation</strong> for fulvic acid content and heavy metal screening. The market is flooded with diluted or counterfeit products - we publish our sourcing chain so you can verify at every step.</>
  },
  {
    cat: 'shipping',
    question: 'Do you offer Cash on Delivery (COD)?',
    answer: <>Yes. <strong>COD is available across India.</strong> We know trust is earned, not assumed - especially with wellness products online. Pay only when you receive the package, inspect it, and are satisfied. No prepayment required.</>
  },
  {
    cat: 'shipping',
    question: 'How long does delivery take? Is shipping free?',
    answer: <>Orders are dispatched within <strong>24-48 hours</strong> and typically delivered in 4-7 business days depending on your location. <strong>Free shipping on all 2-pack orders.</strong> Single orders may carry a nominal shipping charge. All packages are discreetly packaged and tracked - you'll receive an SMS with a tracking link once your order ships.</>
  },
  {
    cat: 'usage',
    question: 'How should I store Shilajit resin?',
    answer: <>Store in a <strong>cool, dry place away from direct sunlight</strong>. The resin may become harder in cold temperatures - simply warm the jar in your hands for a minute and it softens. Do not refrigerate. Keep the lid tightly closed after each use to prevent moisture contact. Properly stored, it has a <strong>shelf life of several years</strong> - Shilajit is naturally self-preserving.</>
  },
  {
    cat: 'safety',
    question: 'Can women take Shilajit?',
    answer: <>Yes. While Shilajit is often marketed toward men, its core benefits - <strong>energy, mineral replenishment, cognitive clarity, and anti-fatigue effects</strong> - apply equally to women. Many women report improvements in iron levels, skin quality, and stamina. Avoid during <strong>pregnancy and breastfeeding</strong> unless specifically advised by a doctor. Women with hormonal conditions (PCOS, thyroid issues) should consult a healthcare provider before use.</>
  },
  {
    cat: 'shipping',
    question: 'What is your return and refund policy?',
    answer: <>If your order arrives damaged or tampered, <strong>we'll replace it at no cost</strong>. For COD orders, you can verify the package before accepting it. Due to the nature of the product (wellness consumable), returns of opened products aren't accepted. However, if you're genuinely unsatisfied with quality, reach out to us - we take our reputation seriously and resolve every concern personally.</>
  }
];

/* ═══════════════════════════════════════════ */
export default function App() {
  const [scrolledPast, setScrolledPast] = useState(false);
  const [hoveredBenefit, setHoveredBenefit] = useState(null);
  const [showFullHeroDesc, setShowFullHeroDesc] = useState(false);
  const heroRef   = useRef(null);
  const videoRef  = useRef(null);

  const [reviewIndex, setReviewIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Hero section customizable states
  const [heroSelectedId, setHeroSelectedId] = useState('default_starter');
  const [heroQty, setHeroQty] = useState(1);
  const [heroActiveImgIndex, setHeroActiveImgIndex] = useState(0);
  const [activePricingId, setActivePricingId] = useState('default_starter');
  const heroImages = ['/images/product/product_front.png' , '/images/product/we_provide_vs_others.png', '/images/why_choose_pahadi.png'];


  const [formFields, setFormFields] = useState({
    name: '',
    phone1: '',
    phone2: '',
    address: '',
    pincode: '',
    state: '',
    country: 'India'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null); // 'success' | 'failed' | 'verifying'
  const [verifyingTxnId, setVerifyingTxnId] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('home'); // 'home' | 'orders' | 'admin'

  // Cart State & Helper Functions
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // FAQ State
  const [activeFaqCat, setActiveFaqCat] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const updateCartQuantity = (productId, amount) => {
    setCart(prev => prev.map(item => {
      if (item._id === productId) {
        const newQty = item.quantity + amount;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  useEffect(() => {
    if (location.pathname === '/admin') {
      setActiveView('admin');
    } else if (location.pathname === '/orders') {
      setActiveView('orders');
    } else {
      setActiveView('home');
    }
  }, [location]);

  // Auto-play slider for Hero Images (interval of 4 seconds, resets on user action)
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroActiveImgIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [heroActiveImgIndex, heroImages.length]);


  const handleNavigate = (view) => {
    if (view === 'home') navigate('/');
    if (view === 'orders') navigate('/orders');
    if (view === 'admin') navigate('/admin');
  };

  const [authToken, setAuthToken] = useState(localStorage.getItem('shilajit_token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup'
  const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Dynamic Products List
  const [products, setProducts] = useState([
    {
      _id: 'default_starter',
      name: 'Starter Pack',
      price: 999,
      oldPrice: 1499,
      grams: '10g jar',
      supply: '15-day supply',
      imageUrl: '/images/product/product_front.png',
      videoUrl: '/Home.mp4',
      features: ['10g pure rock resin', 'COD available', '15-day money-back guarantee'],
      featured: false
    },
    {
      _id: 'default_best',
      name: 'Best Value Pack',
      price: 1999,
      oldPrice: 2999,
      grams: '25g jar',
      supply: '1.5 months supply',
      imageUrl: '/images/product/product_front.png',
      videoUrl: '/Home.mp4',
      features: ['25g pure shilajit rock', 'Free fast home shipping', 'COD: Pay when it arrives', '15-day money-back guarantee'],
      featured: true
    }
  ]);

  // Orders History State
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Admin CMS State
  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'products'
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductForm, setEditProductForm] = useState({
    name: '', price: 0, oldPrice: 0, grams: '', supply: '', imageUrl: '', videoUrl: '', features: ''
  });

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_API_URL}/products`);
      const data = await res.json();
      if (data.success && data.products && data.products.length > 0) {
        const mappedProducts = data.products.map(p => {
          if (p.imageUrl === '/shilajit_jar_mockup.png' || !p.imageUrl) {
            return { ...p, imageUrl: '/images/product/product_front.png' };
          }
          return p;
        });
        setProducts(mappedProducts);
      }
    } catch (err) {
      console.error("Error fetching products from server:", err);
    }
  };

  // Fetch current user details
  const fetchUserProfile = async (token) => {
    try {
      const res = await fetch(`${BACKEND_API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
      } else {
        // Clear expired token
        setAuthToken('');
        localStorage.removeItem('shilajit_token');
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
    }
  };

  // Fetch orders of current logged in user or guest transactions
  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      if (authToken) {
        const res = await fetch(`${BACKEND_API_URL}/orders/my-orders`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        if (data.success) {
          setMyOrders(data.orders);
        }
      } else {
        // Fetch guest orders
        try {
          const guestTxns = JSON.parse(localStorage.getItem('shilajit_guest_txns') || '[]');
          if (guestTxns.length > 0) {
            const res = await fetch(`${BACKEND_API_URL}/orders/guest-orders`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ txnIds: guestTxns })
            });
            const data = await res.json();
            if (data.success) {
              setMyOrders(data.orders);
            }
          } else {
            setMyOrders([]);
          }
        } catch (e) {
          console.error("Error loading guest txns from localStorage:", e);
          setMyOrders([]);
        }
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch Admin Stats and Orders
  const fetchAdminData = async () => {
    if (!authToken || currentUser?.role !== 'admin') return;
    setLoadingAdmin(true);
    try {
      // Stats
      const statsRes = await fetch(`${BACKEND_API_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setAdminStats(statsData.stats);
      }

      // Orders
      const ordersRes = await fetch(`${BACKEND_API_URL}/admin/orders`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setAdminOrders(ordersData.orders);
      }
    } catch (err) {
      console.error("Error fetching admin dashboard details:", err);
    } finally {
      setLoadingAdmin(false);
    }
  };

  // Run on mount
  useEffect(() => {
    fetchProducts();
    if (authToken) {
      fetchUserProfile(authToken);
    }
  }, []);

  // Sync token changes
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('shilajit_token', authToken);
      fetchUserProfile(authToken);
    } else {
      localStorage.removeItem('shilajit_token');
      setCurrentUser(null);
    }
  }, [authToken]);

  // Load orders history when clicking My Orders view
  useEffect(() => {
    if (activeView === 'orders' && authToken) {
      fetchMyOrders();
    } else if (activeView === 'admin') {
      fetchAdminData();
    }
  }, [activeView, authToken, currentUser]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const txnId = urlParams.get('txnId');
    const status = urlParams.get('status');

    if (txnId && status === 'check') {
      window.history.replaceState({}, document.title, window.location.pathname);
      verifyTransaction(txnId);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formFields.name.trim()) errors.name = 'Name is required';
    if (!formFields.phone1.trim()) {
      errors.phone1 = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formFields.phone1.trim())) {
      errors.phone1 = 'Enter a 10-digit phone number';
    }
    if (formFields.phone2.trim() && !/^\d{10}$/.test(formFields.phone2.trim())) {
      errors.phone2 = 'Enter a valid 10-digit number';
    }
    if (!formFields.address.trim()) errors.address = 'Address is required';
    if (!formFields.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formFields.pincode.trim())) {
      errors.pincode = 'Enter a valid 6-digit pincode';
    }
    if (!formFields.state.trim()) errors.state = 'State is required';
    if (!formFields.country.trim()) errors.country = 'Country is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openCheckout = (product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
    setPaymentResult(null);

    // If logged in, prepopulate name and phone
    if (currentUser) {
      setFormFields(prev => ({
        ...prev,
        name: currentUser.name,
        phone1: currentUser.phone
      }));
    }
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedProduct(null);
    setFormFields({
      name: '',
      phone1: '',
      phone2: '',
      address: '',
      pincode: '',
      state: '',
      country: 'India'
    });
    setFormErrors({});
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const orderData = {
      userId: currentUser ? currentUser._id : null,
      name: formFields.name.trim(),
      phone1: formFields.phone1.trim(),
      phone2: formFields.phone2.trim(),
      address: formFields.address.trim(),
      pincode: formFields.pincode.trim(),
      state: formFields.state.trim(),
      country: formFields.country.trim(),
      productName: selectedProduct.name,
      price: selectedProduct.price
    };
    
    try {
      if (SIMULATE_PAYMENT) {
        // Save order directly in simulated mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setPaymentResult('success');
      } else {
        // Production PhonePe payment initiation
        localStorage.setItem('pending_order', JSON.stringify(orderData));
        
        const response = await fetch(`${BACKEND_API_URL}/initiate-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order: orderData,
            redirectOrigin: window.location.origin + window.location.pathname
          })
        });
        
        const resJson = await response.json();
        
        if (resJson.success && resJson.redirectUrl) {
          window.location.href = resJson.redirectUrl;
        } else {
          const detailMsg = resJson.details && resJson.details.message 
            ? ` (${resJson.details.message})` 
            : (resJson.details && resJson.details.code ? ` [${resJson.details.code}]` : '');
          alert('Failed to initiate PhonePe payment: ' + (resJson.error || 'Unknown error') + detailMsg);
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend: ' + err.message);
      setIsSubmitting(false);
    }
  };

  const verifyTransaction = async (txnId) => {
    setVerifyingTxnId(txnId);
    setPaymentResult('verifying');
    setIsCheckoutOpen(true);
    
    try {
      const pendingOrder = JSON.parse(localStorage.getItem('pending_order'));
      if (!pendingOrder) {
        setPaymentResult('failed');
        return;
      }
      
      const response = await fetch(`${BACKEND_API_URL}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionId: txnId,
          order: pendingOrder
        })
      });
      
      const resJson = await response.json();
      
      if (resJson.success) {
        localStorage.removeItem('pending_order');
        
        // Store guest transaction ID locally for direct view on orders dashboard
        try {
          const guestTxns = JSON.parse(localStorage.getItem('shilajit_guest_txns') || '[]');
          if (!guestTxns.includes(txnId)) {
            guestTxns.push(txnId);
            localStorage.setItem('shilajit_guest_txns', JSON.stringify(guestTxns));
          }
        } catch (e) {
          console.error('Error saving guest transaction ID locally:', e);
        }

        setPaymentResult('success');
        
        // Dynamic switch to My Orders Dashboard after 3 seconds showing success
        setTimeout(() => {
          setIsCheckoutOpen(false);
          setPaymentResult(null);
          handleNavigate('orders');
        }, 3000);
      } else {
        setPaymentResult('failed');
      }
    } catch (err) {
      console.error(err);
      setPaymentResult('failed');
    }
  };

  /* ─── AUTHENTICATION FORM HANDLERS ─── */
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = authTab === 'login' ? 'signin' : 'signup';
    const body = authTab === 'login'
      ? { email: authForm.email, password: authForm.password }
      : authForm;

    try {
      const res = await fetch(`${BACKEND_API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        setAuthToken(data.token);
        setIsAuthOpen(false);
        setAuthForm({ name: '', email: '', phone: '', password: '' });
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error("Auth submit error:", err);
      setAuthError('Connection error to authentication server');
    }
  };

  const [showGoogleInstructions, setShowGoogleInstructions] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '730097644292-pj8uei33i2s4uh3c8q2d8gg3ve7valsj.apps.googleusercontent.com';
    if (clientId) {
      setGoogleLoading(true);
      try {
        if (!window.google) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              const payload = JSON.parse(atob(response.credential.split('.')[1]));
              const res = await fetch(`${BACKEND_API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: payload.email,
                  name: payload.name,
                  token: response.credential
                })
              });
              const data = await res.json();
              if (data.success) {
                setAuthToken(data.token);
                setIsAuthOpen(false);
                setShowGoogleInstructions(false);
              } else {
                setAuthError(data.error || 'Google Authentication failed');
              }
            } catch (err) {
              console.error("Google Auth Backend error:", err);
              setAuthError('Error communicating with backend during Google authentication');
            } finally {
              setGoogleLoading(false);
            }
          }
        });
        
        window.google.accounts.id.prompt();
      } catch (err) {
        console.error("GIS load error:", err);
        setGoogleLoading(false);
        setShowGoogleInstructions(true);
      }
    } else {
      setShowGoogleInstructions(prev => !prev);
    }
  };

  const handleGoogleSandboxLogin = async () => {
    setGoogleLoading(true);
    try {
      const simulatedPayload = {
        email: 'sandbox_google_user@gmail.com',
        name: 'Sandbox Google User'
      };

      const res = await fetch(`${BACKEND_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simulatedPayload)
      });
      const data = await res.json();
      if (data.success) {
        setAuthToken(data.token);
        setIsAuthOpen(false);
        setShowGoogleInstructions(false);
      } else {
        setAuthError(data.error || 'Google Sandbox login failed');
      }
    } catch (err) {
      console.error("Google Sandbox auth error:", err);
      setAuthError('Connection error to authentication server during Google sandbox sign-in');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken('');
    setCurrentUser(null);
    localStorage.removeItem('shilajit_token');
    setIsProfileDropdownOpen(false);
    handleNavigate('home');
  };

  /* ─── ADMIN EDIT PRODUCT FORMS ─── */
  const startEditProduct = (prod) => {
    setEditingProduct(prod);
    setEditProductForm({
      name: prod.name,
      price: prod.price,
      oldPrice: prod.oldPrice || 0,
      grams: prod.grams,
      supply: prod.supply,
      imageUrl: prod.imageUrl,
      videoUrl: prod.videoUrl,
      features: prod.features.join(', ')
    });
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const featuresArray = editProductForm.features.split(',').map(f => f.trim()).filter(Boolean);
      const res = await fetch(`${BACKEND_API_URL}/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ...editProductForm,
          price: Number(editProductForm.price),
          oldPrice: Number(editProductForm.oldPrice),
          features: featuresArray
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Product details updated successfully');
        setEditingProduct(null);
        fetchProducts();
        fetchAdminData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating product info');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${BACKEND_API_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ deliveryStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setAdminOrders(prev => prev.map(o => o._id === orderId ? { ...o, deliveryStatus: newStatus } : o));
        fetchAdminData(); // Refresh stats too
      } else {
        alert('Failed to update: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  /* ── Resize handles ── */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, REVIEWS.length - visibleCount);
  const clampedIndex = Math.min(reviewIndex, maxIndex);

  const handlePrevReview = () => {
    setReviewIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextReview = () => {
    setReviewIndex(prev => Math.min(maxIndex, prev + 1));
  };

  /* ── Sticky bar trigger ── */
  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        setScrolledPast(window.scrollY > heroRef.current.offsetHeight - 80);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── GSAP animations (re-triggers on home view activation) ── */
  useEffect(() => {
    if (activeView !== 'home') return;
    const ctx = gsap.context(() => {
      /* Hero stagger */
      gsap.fromTo('.hero-item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.13, duration: 0.75, ease: 'power3.out', delay: 0.2 }
      );

      /* Scroll reveals */
      gsap.utils.toArray('.reveal').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 36 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none none' }
          }
        );
      });
    });
    return () => ctx.revert();
  }, [activeView]);

  // Amazon shipment stages dictionary helper
  const getDeliveryStatusProgress = (status) => {
    const stages = ['Processing', 'Packing', 'Shipping', 'Out for Delivery', 'Delivered'];
    const idx = stages.indexOf(status);
    if (idx === -1) return 0;
    return (idx / (stages.length - 1)) * 100;
  };

  const getStageClass = (status, currentStage) => {
    const stages = ['Processing', 'Packing', 'Shipping', 'Out for Delivery', 'Delivered'];
    const idx = stages.indexOf(status);
    const targetIdx = stages.indexOf(currentStage);
    
    if (idx >= targetIdx) {
      return idx === targetIdx ? 'order-tracker__step--active' : 'order-tracker__step--completed';
    }
    return '';
  };

  /* ─── RENDER ──────────────────────────────── */
  return (
    <div style={{ background: 'var(--cream)', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════
          HEADER & REDESIGNED NAVBAR
      ══════════════════════════════════════ */}
      <header className="navbar">
        <div className="navbar__container">
          {/* Logo */}
          <div className="navbar__logo-group" onClick={() => handleNavigate('home')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="APASYA" className="navbar__logo-img" />
          </div>
          
          {/* Nav Actions */}
          <div className="navbar__actions">
            {/* Buy Now Button (Original Cart Button renamed) */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="navbar__cart-btn"
            >
              <ShoppingBag size={16} /> BUY NOW
              {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                <span className="cart-badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              )}
            </button>

            {/* Rounded LOGIN/LOGOUT Button (Image 2 style) */}
            {currentUser ? (
              <button 
                className="navbar__login-btn" 
                onClick={handleLogout}
              >
                LOGOUT
              </button>
            ) : (
              <button 
                className="navbar__login-btn" 
                onClick={() => { setAuthTab('login'); setIsAuthOpen(true); }}
              >
                LOGIN
              </button>
            )}

            {/* Delivery Truck Icon - My Orders (Image 2 style) */}
            <button 
              className="navbar__icon-btn" 
              onClick={() => {
                if (currentUser) {
                  handleNavigate('orders');
                } else {
                  setAuthTab('login');
                  setIsAuthOpen(true);
                }
              }}
              title="My Orders"
            >
              <Truck size={20} />
            </button>

            {/* Shopping Bag Icon - Cart with Badge (Image 2 style) */}
            <button 
              className="navbar__icon-btn" 
              style={{ position: 'relative' }}
              onClick={() => setIsCartOpen(true)}
              title="Cart"
            >
              <ShoppingBag size={20} />
              {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                <span className="cart-icon-badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              )}
            </button>
            
            {/* Custom Premium Profile Menu dropdown (Hamburger Trigger) */}
            <div className="profile-menu">
              <button 
                className="profile-menu__trigger" 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gold2)' }}
                aria-label="Menu"
              >
                <Menu size={24} />
              </button>
              
              {isProfileDropdownOpen && (
                <div className="profile-menu__dropdown">
                  {currentUser ? (
                    <>
                      <div className="profile-menu__header">
                        Logged in as: <strong>{currentUser.email}</strong>
                      </div>
                      <button 
                        className="profile-menu__item" 
                        onClick={() => { setIsProfileDropdownOpen(false); setIsProfileOpen(true); }}
                      >
                        <User size={14} /> My Profile
                      </button>
                      <button 
                        className="profile-menu__item" 
                        onClick={() => { setIsProfileDropdownOpen(false); handleNavigate('orders'); }}
                      >
                        <ShoppingBag size={14} /> My Orders
                      </button>
                      
                      {currentUser.role === 'admin' && (
                        <>
                          <div className="profile-menu__divider" />
                          <button 
                            className="profile-menu__item" 
                            style={{ color: 'var(--gold2)' }}
                            onClick={() => { setIsProfileDropdownOpen(false); handleNavigate('admin'); }}
                          >
                            <ShieldAlert size={14} /> Admin Portal
                          </button>
                        </>
                      )}
                      
                      <div className="profile-menu__divider" />
                      <button className="profile-menu__item" onClick={handleLogout} style={{ color: '#ef4444' }}>
                        <LogOut size={14} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="profile-menu__header">Welcome Guest</div>
                      <button 
                        className="profile-menu__item" 
                        onClick={() => { setIsProfileDropdownOpen(false); setAuthTab('login'); setIsAuthOpen(true); }}
                      >
                        <User size={14} /> Sign In
                      </button>
                      <button 
                        className="profile-menu__item" 
                        onClick={() => { setIsProfileDropdownOpen(false); setAuthTab('signup'); setIsAuthOpen(true); }}
                      >
                        <Sparkles size={14} /> Sign Up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          VIEW 1: LANDING PAGE (HOME)
      ══════════════════════════════════════ */}
      {activeView === 'home' && (
        <>
          {/* 01 · HERO SECTION */}
          <section ref={heroRef} className="hero" style={{ alignItems: 'flex-start' }}>
            <div className="hero__left" style={{ paddingTop: '16px' }}>
              <div className="hero-item hero__tag" style={{ fontSize: '13px', padding: '8px 16px' }}>
                Direct from Satpura Range Source (Since 2024)
              </div>
              <h1 className="hero-item hero__headline" style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', lineHeight: 1.15, marginBottom: '8px' }}>
                Pahadi Shilajit.<br />
                <em>As nature formed it.</em><br />
                Not processed into tablets.
              </h1>
              <p className="hero-item hero__sub" style={{ marginBottom: '12px', fontSize: '16px', lineHeight: 1.45 }}>
                {showFullHeroDesc ? (
                  <>
                    Pure Satpura Range mineral resin. 85+ minerals. Zero fillers. Zero processing. The same form healers have used for 5,000 years, now available direct from source.
                    <span 
                      onClick={() => setShowFullHeroDesc(false)} 
                      style={{ color: 'var(--gold)', cursor: 'pointer', fontWeight: 700, marginLeft: '6px', textDecoration: 'underline' }}
                    >
                      Read Less
                    </span>
                  </>
                ) : (
                  <>
                    Pure Satpura Range mineral resin. 85+ minerals. Zero fillers. Zero processing.
                    <span 
                      onClick={() => setShowFullHeroDesc(true)} 
                      style={{ color: 'var(--gold)', cursor: 'pointer', fontWeight: 700, marginLeft: '6px', textDecoration: 'underline' }}
                    >
                      Read More...
                    </span>
                  </>
                )}
              </p>

              {/* Dynamic Price Box (Pic 1 Style) */}
              {(() => {
                const currentHeroProduct = products.find(p => p._id === heroSelectedId) || products[0];
                const heroDiscountPercent = currentHeroProduct?.oldPrice ? Math.round(((currentHeroProduct.oldPrice - currentHeroProduct.price) / currentHeroProduct.oldPrice) * 100) : 33;
                return (
                  <div style={{
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(16px)',
                    border: '1.5px solid rgba(184, 115, 51, 0.22)',
                    borderRadius: '24px',
                    padding: '32px 28px',
                    marginTop: '20px',
                    maxWidth: '1060px',
                    minHeight: '350px',
                    boxShadow: '0 20px 48px rgba(13,36,23,0.08)',
                    overflow: 'hidden',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch', flex: 1 }}>
                      {/* Left Column: Price Info Box + Radio options */}
                      <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
                        {/* Price Info Box */}
                        <div style={{
                          background: 'rgba(238, 242, 235, 0.85)',
                          border: '1px solid rgba(13,36,23,0.08)',
                          borderRadius: '12px',
                          padding: '16px 18px',
                          boxShadow: '0 4px 12px rgba(13,36,23,0.02)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '16px', textDecoration: 'line-through', color: '#8C9C8F', fontWeight: 500 }}>₹{currentHeroProduct?.oldPrice}</span>
                            <span style={{ fontSize: '32px', fontWeight: 800, color: '#0D2417', fontFamily: 'Cormorant Garamond, serif' }}>₹{currentHeroProduct?.price}</span>
                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#B87333' }}>({heroDiscountPercent}% OFF)</span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#8C9C8F', marginTop: '4px', fontWeight: 500 }}>MRP (incl. of all taxes)</div>
                        </div>

                        {/* Radio buttons for 10g and 25g selection */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {products.slice(0, 2).map((p) => {
                            const isSelected = p._id === heroSelectedId;
                            const offPercent = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 33;
                            return (
                              <label key={p._id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: isSelected ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',
                                border: isSelected ? '2px solid #B87333' : '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '12px 14px',
                                cursor: 'pointer',
                                boxShadow: isSelected ? '0 6px 18px rgba(184,115,51,0.08)' : 'none',
                                transition: 'all 0.2s ease'
                              }}>
                                <input
                                  type="radio"
                                  name="hero-product-select"
                                  checked={isSelected}
                                  onChange={() => {
                                    setHeroSelectedId(p._id);
                                    setHeroActiveImgIndex(p._id === 'default_best' ? 1 : 0);
                                  }}
                                  style={{
                                    accentColor: '#B87333',
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer'
                                  }}
                                />
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>{p.grams.includes('10') ? '10g Starter Pack' : '25g Best Value Pack'}</span>
                                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#B87333' }}>₹{p.price}</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px', fontSize: '11px', color: 'var(--muted)' }}>
                                    <span>{p.supply}</span>
                                    <span style={{ fontWeight: 600, color: '#4ade80' }}>@{offPercent}% OFF</span>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Column: Quantity selector + stacked buttons */}
                      <div style={{ flex: 0.9, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
                        {/* Quantity Selector */}
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: '6px' }}>Quantity</div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.95)',
                            border: '1px solid var(--border)',
                            borderRadius: '10px',
                            width: '100%',
                            height: '42px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                          }}>
                            <button
                              onClick={() => setHeroQty(prev => Math.max(1, prev - 1))}
                              style={{
                                width: '40px',
                                height: '100%',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '16px',
                                fontWeight: 600,
                                color: 'var(--ink)',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={e => e.target.style.background = '#f9fafb'}
                              onMouseLeave={e => e.target.style.background = 'transparent'}
                            >-</button>
                            <span style={{
                              flex: 1,
                              textAlign: 'center',
                              fontSize: '14px',
                              fontWeight: 700,
                              color: 'var(--ink)'
                            }}>{heroQty}</span>
                            <button
                              onClick={() => setHeroQty(prev => prev + 1)}
                              style={{
                                width: '40px',
                                height: '100%',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '16px',
                                fontWeight: 600,
                                color: 'var(--ink)',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={e => e.target.style.background = '#f9fafb'}
                              onMouseLeave={e => e.target.style.background = 'transparent'}
                            >+</button>
                          </div>
                        </div>

                        {/* Stacked CTA Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                          <button
                            onClick={() => addToCart({ ...currentHeroProduct, quantity: heroQty })}
                            style={{
                              width: '100%',
                              height: '44px',
                              borderRadius: '10px',
                              background: 'rgba(255,255,255,0.95)',
                              border: '2px solid #B87333',
                              color: '#B87333',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={e => { e.target.style.background = 'rgba(184,115,51,0.08)' }}
                            onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.95)' }}
                          >
                            <ShoppingBag size={15} /> Add to Cart
                          </button>
                          <button
                            onClick={() => openCheckout({
                              _id: currentHeroProduct._id,
                              name: `${currentHeroProduct.name} (x${heroQty})`,
                              price: currentHeroProduct.price * heroQty,
                              grams: currentHeroProduct.grams,
                              supply: currentHeroProduct.supply,
                              imageUrl: currentHeroProduct.imageUrl
                            })}
                            style={{
                              width: '100%',
                              height: '44px',
                              borderRadius: '10px',
                              background: '#B87333',
                              border: 'none',
                              color: 'white',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => { e.target.style.background = '#995a22' }}
                            onMouseLeave={e => { e.target.style.background = '#B87333' }}
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
    </div>

          {/* Right side product image carousel */}
          <div className="hero__right" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-start', 
            alignItems: 'center', 
            padding: '16px 16px 32px', 
            gap: '16px',
            height: 'auto',
            minHeight: '100%',
            background: '#FAF6F0'
          }}>
            <div style={{
              position: 'relative',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(13,36,23,0.15), 0 0 0 2px rgba(184,115,51,0.25)',
              maxWidth: '640px', width: '100%',
              aspectRatio: '1/1',
              background: '#FAF6F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={heroImages[heroActiveImgIndex]}
                alt="Original Pahadi Shilajit"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />


              <button
                onClick={() => setHeroActiveImgIndex(prev => prev === 0 ? heroImages.length - 1 : prev - 1)}
                style={{
                  position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                  width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.85)',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#0D2417', zIndex: 10, transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = '#ffffff'}
                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.85)'}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => setHeroActiveImgIndex(prev => prev === heroImages.length - 1 ? 0 : prev + 1)}
                style={{
                  position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                  width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.85)',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#0D2417', zIndex: 10, transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = '#ffffff'}
                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.85)'}
              >
                <ChevronRight size={20} />
              </button>

              <div style={{
                position: 'absolute', top: 16, left: 16, zIndex: 5,
                background: 'rgba(13,36,23,0.9)', border: '1px solid rgba(184,115,51,0.5)',
                borderRadius: 8, padding: '5px 12px', fontSize: 11, fontWeight: 700,
                color: 'var(--gold)', letterSpacing: '0.06em', backdropFilter: 'blur(4px)'
              }}>✨ 85+ Minerals</div>

              <div style={{
                position: 'absolute', bottom: 16, right: 16, zIndex: 5,
                background: 'rgba(13,36,23,0.9)', border: '1px solid rgba(184,115,51,0.6)',
                borderRadius: 8, padding: '5px 12px', fontSize: 11, fontWeight: 700,
                color: '#4ade80', backdropFilter: 'blur(4px)'
              }}>✓ Pure resin</div>
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', width: '100%', flexWrap: 'wrap' }}>
              {heroImages.map((img, idx) => {
                const isActive = idx === heroActiveImgIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setHeroActiveImgIndex(idx)}
                    style={{
                      padding: 0,
                      width: '76px',
                      height: '76px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isActive ? '2.5px solid #B87333' : '1px solid rgba(13,36,23,0.1)',
                      boxShadow: isActive ? '0 4px 8px rgba(184,115,51,0.15)' : 'none',
                      background: '#FFF',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img src={img} alt={`thumbnail-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                );
              })}
            </div>
          </div>
          </section>

          {/* Full-width single-row trust badges to remove gap at left side (Image 1 Row Style Redesign) */}
          <div style={{
            background: 'var(--cream)',
            padding: '32px 24px 48px 24px',
            borderBottom: '1px solid rgba(13,36,23,0.06)'
          }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div className="hero-trust-row-grid">
                {/* Box 1: COD Available */}
                <div style={{
                  background: 'var(--white)',
                  border: '1.5px solid rgba(13,36,23,0.06)',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.015)'
                }} className="hero-trust-box">
                  <div style={{ color: 'var(--earth)', marginBottom: '8px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M6 14h.01M10 14h.01M14 14h.01M18 14h.01"/></svg>
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--earth)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>COD Available</h4>
                  <div style={{ width: '24px', height: '1px', background: 'rgba(13,36,23,0.12)', margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4, margin: 0 }}>Pay in cash when your package arrives safely.</p>
                </div>

                {/* Box 2: Ships in 24 hrs */}
                <div style={{
                  background: 'var(--white)',
                  border: '1.5px solid rgba(13,36,23,0.06)',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.015)'
                }} className="hero-trust-box">
                  <div style={{ color: 'var(--earth)', marginBottom: '8px' }}>
                    <Truck size={24} strokeWidth={1.5} />
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--earth)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Ships in 24 hrs</h4>
                  <div style={{ width: '24px', height: '1px', background: 'rgba(13,36,23,0.12)', margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4, margin: 0 }}>Dispatched within 24 hours via express delivery.</p>
                </div>

                {/* Box 3: 15-day Guarantee */}
                <div style={{
                  background: 'var(--white)',
                  border: '1.5px solid rgba(13,36,23,0.06)',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.015)'
                }} className="hero-trust-box">
                  <div style={{ color: 'var(--earth)', marginBottom: '8px' }}>
                    <ShieldCheck size={24} strokeWidth={1.5} />
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--earth)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>15-day Guarantee</h4>
                  <div style={{ width: '24px', height: '1px', background: 'rgba(13,36,23,0.12)', margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4, margin: 0 }}>Try it at home. Satisfied or full money-back refund.</p>
                </div>

                {/* Box 4: 500+ Customers */}
                <div style={{
                  background: 'var(--white)',
                  border: '1.5px solid rgba(13,36,23,0.06)',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.015)'
                }} className="hero-trust-box">
                  <div style={{ color: 'var(--earth)', marginBottom: '8px' }}>
                    <Users size={24} strokeWidth={1.5} />
                  </div>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--earth)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>500+ Customers</h4>
                  <div style={{ width: '24px', height: '1px', background: 'rgba(13,36,23,0.12)', margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4, margin: 0 }}>Trusted by hundreds of healthy individuals in India.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 02 · TRUST BAR / TICKER */}
          <div className="ticker">
            <div className="ticker__track">
              <div className="ticker__item">🌿 Direct from Satpura Range source<span className="ticker__sep"></span></div>
              <div className="ticker__item">✓ No additives, no fillers<span className="ticker__sep"></span></div>
              <div className="ticker__item">⭐ 500+ happy customers<span className="ticker__sep"></span></div>
              <div className="ticker__item">🚚 Ships in 24 hours (COD available)<span className="ticker__sep"></span></div>
              <div className="ticker__item">↩ 15-day money-back guarantee<span className="ticker__sep"></span></div>
              <div className="ticker__item">🌿 Direct from Satpura Range source<span className="ticker__sep"></span></div>
              <div className="ticker__item">✓ No additives, no fillers<span className="ticker__sep"></span></div>
              <div className="ticker__item">⭐ 500+ happy customers<span className="ticker__sep"></span></div>
              <div className="ticker__item">🚚 Ships in 24 hours (COD available)<span className="ticker__sep"></span></div>
              <div className="ticker__item">↩ 15-day money-back guarantee<span className="ticker__sep"></span></div>
            </div>
          </div>


          {/* 03 · PAIN / PROBLEM SECTION */}
          <section className="problem" id="problem" style={{ background: '#ffffff', padding: '96px 0' }}>
            <div className="container">
              <div className="reveal">
                <p className="label" style={{ marginBottom: 12, color: '#B87333' }}>Sound familiar?</p>
                <h2 className="h2" style={{ marginBottom: 16, color: '#000000' }}>Your body is telling you something.</h2>
                <p className="body-text" style={{ maxWidth: 640, marginBottom: 24, fontSize: 18, lineHeight: 1.6, color: '#000000' }}>
                  These are not signs of aging. They are signs of missing minerals, minerals that every tablet and gummy brand has processed out.
                </p>
              </div>

              {/* Pain Cards 3x3 Grid Redesigned to match Image 1 Style */}
              <div className="problem__grid reveal" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '40px 32px', 
                marginTop: '56px' 
              }}>
                {PAINS.map((card, index) => {
                  return (
                    <div 
                      key={index} 
                      style={{
                        background: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '16px',
                        border: 'none',
                        boxShadow: 'none'
                      }}
                    >
                      <div style={{
                        width: '100%',
                        height: '240px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '20px',
                        overflow: 'hidden',
                        borderRadius: '12px',
                        background: 'transparent'
                      }}>
                        <img 
                          src={card.image} 
                          alt={card.title} 
                          style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain'
                          }} 
                        />
                      </div>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: '#000000',
                        marginBottom: '8px',
                        fontFamily: 'Jost, sans-serif'
                      }}>
                        {card.title}
                      </h3>
                      <p style={{
                        fontSize: '14.5px',
                        color: '#374151',
                        lineHeight: '1.5',
                        margin: 0,
                        fontWeight: 400,
                        fontFamily: 'Jost, sans-serif',
                        maxWidth: '280px'
                      }}>
                        {card.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Bridge line */}
              <div className="problem__bridge reveal" style={{
                background: '#FAF6F0',
                color: '#0d2417',
                border: '1px solid rgba(13,36,23,0.06)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.015)'
              }}>
                "There's a reason none of those supplements worked. They were all processed. Diluted. Artificial. The real answer has been in the mountains for 5,000 years."
              </div>
            </div>
          </section>

          {/* 04 · EDUCATION — WHAT IS SHILAJIT? */}
          <section className="education" id="what-is-it">
            <div className="container">
              <div className="education__grid">
                <div className="reveal">
                  <p className="label">What you're actually getting</p>
                  <h2 className="h2">Pahadi Shilajit, exactly as it forms in the mountain.</h2>
                  <div className="education__copy">
                    <p className="body-text">
                      For thousands of years, people in the Satpura Range used one thing for strength, stamina, and healing: a dark resin that slowly seeps out of rocks above 15,000 feet during the summer months. This is Shilajit. It takes hundreds of years of organic matter and minerals to form. When you find the real thing, it looks like a piece of dark tar. It smells like the earth. It dissolves completely in warm water.
                    </p>
                    <p className="body-text">
                      What you are buying from most brands is not this. It is this material: compressed, processed, mixed with fillers, and pressed into a tablet so it can sit on a shelf for 2 years. By the time it reaches you, it has lost most of what made it powerful.
                    </p>
                    <p className="body-text" style={{ color: 'var(--gold)', fontWeight: 500 }}>
                      We sell only authentic, sun-dried Satpura Range rock form. Nothing else.
                    </p>
                  </div>

                  {/* VS Table */}
                  <div className="vs">
                    <div className="vs__head">
                      <div className="vs__head-cell">❌ Processed Form</div>
                      <div className="vs__head-cell vs__head-cell--good">✓ Raw Rock Resin</div>
                    </div>
                    {VS_ROWS.map(([bad, good], i) => (
                      <div key={i} className="vs__row">
                        <div className="vs__cell">
                          <span style={{ color: '#ef4444', marginRight: 8 }}>✕</span>{bad}
                        </div>
                        <div className="vs__cell vs__cell--good">
                          <span style={{ color: 'var(--gold)', marginRight: 8 }}>✓</span>{good}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="reveal">
                  <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 48px var(--shadow)', border: '1px solid var(--border)' }}>
                    <img src={products[1]?.imageUrl || "/shilajit_jar_mockup.png"} alt="Pure Satpura Range Shilajit Resin Jar" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', aspectRatio: '3/4' }} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 05 · BENEFITS GRID */}
          <section className="benefits" id="benefits">
            <div className="container">
              <div className="benefits__intro reveal">
                <p className="label">Full Body Transformation</p>
                <h2 className="h2">8 ways your body changes when you start taking real Shilajit</h2>
                <p className="body-text">Most brands market only one benefit. Real Shilajit works on all of these at the same time.</p>
              </div>
              <div className="benefits__grid reveal">
                {BENEFITS.map(({ icon, title, desc, image, hoverImage }) => {
                  const isHovered = hoveredBenefit === title;
                  const currentImage = (isHovered && hoverImage) ? hoverImage : image;
                  return (
                    <div 
                      key={title} 
                      className="benefit" 
                      onMouseEnter={() => setHoveredBenefit(title)}
                      onMouseLeave={() => setHoveredBenefit(null)}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        textAlign: 'center', 
                        background: 'var(--white)', 
                        padding: '24px', 
                        borderRadius: '16px', 
                        border: '1px solid var(--border)', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.01)', 
                        transition: 'all 0.3s ease',
                        cursor: hoverImage ? 'pointer' : 'default'
                      }}
                    >
                      <div style={{ 
                        width: '100%', 
                        height: '200px', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        marginBottom: '16px', 
                        overflow: 'hidden', 
                        borderRadius: '12px', 
                        background: 'transparent',
                        position: 'relative'
                      }}>
                        <img 
                          src={currentImage} 
                          alt={title} 
                          style={{ 
                            height: '100%', 
                            width: '100%',
                            objectFit: hoverImage ? 'cover' : 'contain', 
                            transition: 'all 0.5s ease',
                            transform: isHovered && hoverImage ? 'scale(1.05)' : 'scale(1)'
                          }} 
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', justifyContent: 'center' }}>
                        {icon}
                        <div className="benefit__title" style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{title}</div>
                      </div>
                      <div className="benefit__text" style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>

          {/* KEY INGREDIENTS SECTION (Below 8 Benefits) */}
          <section className="key-ingredients" style={{ background: 'var(--cream)', padding: '80px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                <p className="label" style={{ letterSpacing: '0.12em', color: '#B87333', marginBottom: '12px' }}>VITAL FORMULATION</p>
                <h2 className="serif" style={{ fontSize: 'clamp(36px, 4vw, 48px)', color: '#0D2417', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 300 }}>
                  <strong style={{ fontWeight: 800 }}>KEY</strong> INGREDIENTS
                </h2>
                <div style={{ width: '60px', height: '3px', background: '#B87333', margin: '20px auto 0' }} />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '32px 40px',
                maxWidth: '960px',
                margin: '0 auto'
              }}>
                {[
                  {
                    name: 'Shilajit',
                    desc: 'Clinically tested Shilajit rich in Fulvic acid (>60%)',
                    img: '/images/ingredients/shilajit.png'
                  },
                  {
                    name: 'Swarna Bhasma',
                    desc: 'Contains 24 Karat Gold made with special Ayurvedic Marana Process',
                    img: '/images/ingredients/swarna_bhasma.png'
                  },
                  {
                    name: 'Gokshura',
                    desc: 'Potent Ayurvedic herb for men\'s health & wellness',
                    img: '/images/ingredients/gokshura.png'
                  },
                  {
                    name: 'Black Musli',
                    desc: 'Potent Ayurvedic herb for men\'s health & wellness',
                    img: '/images/ingredients/black_musli.png'
                  },
                  {
                    name: 'Nagori Ashwagandha',
                    desc: '183rd day harvested with withanolide content',
                    img: '/images/ingredients/ashwagandha.png'
                  }
                ].map((ing, i) => (
                  <div key={ing.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    background: 'var(--white)',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(13,36,23,0.02)',
                    border: '1px solid var(--border)',
                    gridColumn: i === 4 ? 'span 2' : 'auto',
                    maxWidth: i === 4 ? '460px' : 'none',
                    justifySelf: i === 4 ? 'center' : 'auto',
                    width: '100%',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(13,36,23,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(13,36,23,0.02)';
                  }}
                  >
                    <div style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '2px solid var(--border)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                      <img src={ing.img} alt={ing.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)', marginBottom: '6px' }}>{ing.name}</h3>
                      <p style={{ fontSize: '14.5px', color: 'var(--muted)', lineHeight: 1.45, fontWeight: 400, margin: 0 }}>{ing.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 06 · HOW TO USE + VIDEO */}
          <section className="howto" id="how-to-use">
            <div className="container">
              <div className="howto__grid" style={{ alignItems: 'stretch' }}>
                <div style={{
                  background: '#FDF8F4',
                  padding: '40px',
                  borderRadius: '24px',
                  border: '1.5px solid var(--border)',
                  boxShadow: '0 12px 32px var(--shadow)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div className="reveal">
                    <p className="label">Daily Ritual</p>
                    <h2 className="h2">It's simpler than you think: 30 seconds every morning</h2>
                    <p className="body-text">People hesitate because they don't know how to use Pahadi Shilajit. It's the simplest supplement you'll ever use.</p>
                  </div>
                  <div className="howto__steps reveal" style={{ marginTop: '32px' }}>
                    {[
                      ['Take a piece', 'Pinch a chickpea-sized piece (300–500mg) from the jar.'],
                      ['Drop in liquid', 'Drop it into a glass of warm water, warm milk, or your morning chai.'],
                      ['Stir & Dissolve', 'Stir for 20 seconds, it dissolves completely. No powder. No residue.'],
                      ['Drink empty stomach', 'Drink it 30 minutes before food, first thing in the morning.'],
                      ['See the shift', 'Results begin in 7–10 days. Full benefits in 4–6 weeks.'],
                    ].map(([step, desc], i) => (
                      <div key={step} className="step" style={{ borderColor: 'rgba(184,115,51,0.15)' }}>
                        <div className="step__num" style={{ background: 'var(--gold)', color: 'white', border: 'none' }}>{i + 1}</div>
                        <div>
                          <div className="step__title" style={{ fontWeight: 700, color: 'var(--ink)' }}>{step}</div>
                          <div className="step__text" style={{ color: 'var(--muted)', fontWeight: 400 }}>{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{
                    borderRadius: 24,
                    overflow: 'hidden',
                    border: '1.5px solid var(--border)',
                    boxShadow: '0 24px 64px var(--shadow)',
                    background: '#ffffff',
                    position: 'relative',
                    width: '100%',
                    maxWidth: '580px',
                    height: '520px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <video 
                      src="/Home.mp4" 
                      controls 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} 
                    />
                  </div>
                  <p style={{
                    fontSize: 13, color: 'var(--muted)', textAlign: 'center', fontStyle: 'italic', marginTop: 16, fontWeight: 500, marginBottom: 0
                  }}>Purity in practice: simple, clean, and highly absorbable. Follow these 4 easy steps daily.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 07 · PURITY TEST */}
          <section className="purity" id="purity">
            <div className="container">
              <div className="purity__grid">
                <div className="reveal">
                  <p className="label">Nothing to hide</p>
                  <h2 className="h2">Test it at home. Any Time</h2>
                  <p className="body-text">We give you this test because we are confident in what we sell. The moment your order arrives, try this:</p>
                  <div className="purity__steps">
                    <div className="purity__step">
                      <div className="purity__step-num">1</div>
                      <div className="purity__step-text">Take a piece the size of a lentil from the jar.</div>
                    </div>
                    <div className="purity__step">
                      <div className="purity__step-num">2</div>
                      <div className="purity__step-text">Drop it into a glass of warm water.</div>
                    </div>
                    <div className="purity__step">
                      <div className="purity__step-num">3</div>
                      <div className="purity__step-text">Watch it dissolve at Any Time.</div>
                    </div>
                    <div className="purity__step">
                      <div className="purity__step-num">4</div>
                      <div className="purity__step-text">Water turns golden-brown. No sediment. No chemical smell.</div>
                    </div>
                    <div className="purity__step">
                      <div className="purity__step-num">5</div>
                      <div className="purity__step-text"><strong>That is real Shilajit.</strong> Fake products leave powder at the bottom.</div>
                    </div>
                  </div>
                </div>

                <div className="reveal">
                  <div className="purity__visual">
                    {/* BEFORE Card */}
                    <div className="purity__card">
                      <img src="/raw_shilajit_rocks.png" alt="BEFORE - Raw rock piece" className="purity__card-image" />
                      <div className="purity__card-content">
                        <p className="purity__card-title">BEFORE · Raw rock piece</p>
                        <p className="purity__card-desc">Dark, solid, earthy smell. Like compressed mountain rock.</p>
                      </div>
                    </div>

                    {/* AFTER Card */}
                    <div className="purity__card">
                      <img src="/shilajit_dissolve.png" alt="AFTER - Golden dissolve" className="purity__card-image" />
                      <div className="purity__card-content">
                        <p className="purity__card-title purity__card-title--gold">AFTER · Golden dissolve ✅</p>
                        <p className="purity__card-desc">Water turns amber-gold. No powder. No sediment. No chemical smell.</p>
                      </div>
                    </div>

                    <hr className="purity__quote-divider" />

                    <div className="purity__quote-text">
                      "We are giving you the test because we have nothing to hide. Try it the moment your order arrives. If it doesn't pass, email us at {CONTACT_EMAIL}. Full refund. Same day."
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 08 · REVIEWS / SOCIAL PROOF */}
          <section className="reviews" id="reviews" style={{ paddingBottom: '40px' }}>
            <div className="container">
              <div>
                <p className="label">Real customers, real results</p>
                <h2 className="h2">What people are saying</h2>
                <p className="body-text" style={{ maxWidth: 500, marginBottom: 40 }}>Real customer experiences. No fake reviews.</p>
              </div>

              <div className="reviews-grid">
                {REVIEWS.map((rev, index) => (
                  <div key={index} className="new-review-card">
                    <div className="new-review-card__header">
                      <div className="new-review-card__name-row">
                        <span className="new-review-card__name">{rev.name}</span>
                        {rev.verified && (
                          <span className="new-review-card__verified-badge">VERIFIED</span>
                        )}
                      </div>
                      <span className="new-review-card__date">{rev.date}</span>
                    </div>
                    
                    <div className="new-review-card__stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="new-review-card__star" style={{ color: i < rev.rating ? 'var(--gold)' : '#d1d5db' }}>
                          ★
                        </span>
                      ))}
                    </div>
                    
                    <h4 className="new-review-card__title">{rev.title}</h4>
                    <p className="new-review-card__text">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* WHY APASYA SHILAJITH */}
          <section id="why-apasya" className="why-apasya" style={{ background: '#FAF6F0', paddingTop: '40px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <p className="label" style={{ letterSpacing: '0.12em', color: '#B87333', marginBottom: '12px' }}>THE APASYA DIFFERENCE</p>
                <h2 className="h2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px, 3.5vw, 42px)', color: '#0D2417', margin: 0 }}>WHY APASYA SHILAJITH?</h2>
                <div style={{ width: '60px', height: '3px', background: '#B87333', margin: '16px auto 0' }} />
              </div>

              <div className="why-apasya__grid">
                {/* Pillar 1: Direct from Satpura */}
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    marginBottom: '20px', 
                    width: '90px', 
                    height: '90px', 
                    borderRadius: '50%', 
                    border: '2px solid rgba(184, 115, 51, 0.35)', 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#FFFFFF',
                    transition: 'all 0.3s ease'
                  }}>
                    <img src="/images/apasya_satpura.png" alt="Direct from Satpura" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--earth)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Direct from Satpura</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.5, maxWidth: '240px', margin: 0 }}>Sourced directly from Satpura Range rock formations. No middleman, direct since 2024.</p>
                </div>

                {/* Pillar 2: Raw Rock Resin */}
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    marginBottom: '20px', 
                    width: '90px', 
                    height: '90px', 
                    borderRadius: '50%', 
                    border: '2px solid rgba(184, 115, 51, 0.35)', 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#FFFFFF',
                    transition: 'all 0.3s ease'
                  }}>
                    <img src="/images/apasya_resin.png" alt="Raw Rock Resin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--earth)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Raw Rock Resin</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.5, maxWidth: '240px', margin: 0 }}>Sun-dried raw mineral resin in its natural, unprocessed form. Zero fillers, zero processing.</p>
                </div>

                {/* Pillar 3: 85+ Trace Minerals */}
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    marginBottom: '20px', 
                    width: '90px', 
                    height: '90px', 
                    borderRadius: '50%', 
                    border: '2px solid rgba(184, 115, 51, 0.35)', 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#FFFFFF',
                    transition: 'all 0.3s ease'
                  }}>
                    <img src="/images/apasya_minerals.png" alt="85+ Minerals" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--earth)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>85+ Minerals</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.5, maxWidth: '240px', margin: 0 }}>High concentration of active fulvic acid and trace minerals for maximum cellular absorption.</p>
                </div>

                {/* Pillar 4: Lab Certified */}
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    marginBottom: '20px', 
                    width: '90px', 
                    height: '90px', 
                    borderRadius: '50%', 
                    border: '2px solid rgba(184, 115, 51, 0.35)', 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#FFFFFF',
                    transition: 'all 0.3s ease'
                  }}>
                    <img src="/images/apasya_lab.png" alt="Lab Certified" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--earth)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lab Certified</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.5, maxWidth: '240px', margin: 0 }}>Rigorous laboratory testing for safety. 100% free from heavy metals or artificial chemicals.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 10 · PRICING (DYNAMICALLY RENDERED FROM STATE) */}
          <section id="pricing" className="pricing" style={{ paddingTop: '40px' }}>
            <div className="container">
              <div className="pricing__intro reveal">
                <p className="label">Honest Pricing · Direct from Source</p>
                <h2 className="h2">Choose your pack: the best value ships today</h2>
              </div>
              <div className="pricing__chai reveal">
                Less than ₹50 a day (the cost of one cup of chai) for energy that lasts all day
              </div>

              <div className="pricing__grid reveal" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '32px', 
                maxWidth: '820px', 
                margin: '0 auto 36px',
                alignItems: 'stretch'
              }}>
                {products.map((p, idx) => {
                  const isBestValue = p.featured || p.name.toLowerCase().includes('best') || idx === 1;
                  const offPercent = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 33;
                  const stockLeft = Math.max(0, (p.receivedQty !== undefined ? p.receivedQty : 100) - (p.soldQty !== undefined ? p.soldQty : 0));
                  
                  // Card specific styles matching Image 3
                  const cardBg = '#FFFFFF';
                  const cardBorder = isBestValue ? '2.5px solid #1B3D2B' : '1.5px solid rgba(13,36,23,0.1)';
                  const cardPadding = '40px 28px 32px';
                  const cardBorderRadius = '24px';
                  const cardShadow = isBestValue ? '0 16px 40px rgba(27,61,43,0.08)' : '0 12px 24px rgba(13,36,23,0.03)';
                  
                  // Label & Headings
                  const packLabel = isBestValue ? 'BEST VALUE' : 'STARTER PACK';
                  const packHeading = isBestValue ? 'Commit to Health' : 'Try It';
                  const packSub = isBestValue ? '25g jar · 1.5 months supply' : '10g jar · 15-day supply';
                  const packFeatures = isBestValue 
                    ? ['25g pure shilajit rock', 'Free fast home shipping', 'COD: Pay when it arrives', '15-day money-back guarantee']
                    : ['10g pure rock resin', 'COD available', '15-day money-back guarantee'];
                  
                  return (
                    <div 
                      key={p._id || idx} 
                      style={{
                        background: cardBg,
                        border: cardBorder,
                        borderRadius: cardBorderRadius,
                        padding: cardPadding,
                        boxShadow: cardShadow,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.3s ease',
                        cursor: 'default'
                      }}
                    >
                      {/* Top Badge for Best Value Card */}
                      {isBestValue && (
                        <div style={{
                          position: 'absolute',
                          top: '-14px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#1B3D2B',
                          color: '#FFFFFF',
                          padding: '5px 16px',
                          borderRadius: '100px',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          whiteSpace: 'nowrap',
                          zIndex: 10,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 4px 10px rgba(27,61,43,0.2)'
                        }}>
                          ⭐ MOST ORDERED PACK
                        </div>
                      )}

                      <div>
                        {/* Tier Label */}
                        <div style={{ 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          letterSpacing: '0.12em', 
                          color: isBestValue ? '#1B3D2B' : 'rgba(13,36,23,0.5)',
                          textTransform: 'uppercase', 
                          marginBottom: '8px',
                          textAlign: 'left'
                        }}>
                          {packLabel}
                        </div>

                        {/* Heading */}
                        <h3 style={{ 
                          fontFamily: 'Cormorant Garamond, serif', 
                          fontSize: '32px', 
                          fontWeight: 700, 
                          color: '#0D2417', 
                          margin: '0 0 6px 0',
                          textAlign: 'left',
                          lineHeight: 1.15
                        }}>
                          {packHeading}
                        </h3>

                        {/* Grams & Supply */}
                        <p style={{ 
                          fontSize: '13.5px', 
                          color: 'var(--muted)', 
                          margin: '0 0 16px 0',
                          textAlign: 'left',
                          fontWeight: 400
                        }}>
                          {packSub}
                        </p>

                        {/* Stock Left Notification */}
                        <div style={{ 
                          fontSize: '13px', 
                          color: '#D97706', 
                          fontWeight: 600, 
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          margin: '0 0 20px 0',
                          textAlign: 'left'
                        }}>
                          ⚡ Only {stockLeft} packs left today!
                        </div>

                        {/* Pricing Box */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '0 0 20px 0' }}>
                          <span style={{ 
                            fontSize: '15px', 
                            textDecoration: 'line-through', 
                            color: 'rgba(13,36,23,0.4)', 
                            fontWeight: 500,
                            marginBottom: '4px'
                          }}>
                            ₹{p.oldPrice}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ 
                              fontFamily: 'Cormorant Garamond, serif', 
                              fontSize: '52px', 
                              fontWeight: 700, 
                              color: '#B87333', 
                              lineHeight: 1 
                            }}>
                              ₹{p.price}
                            </span>
                          </div>
                          <span style={{ 
                            fontSize: '12.5px', 
                            color: 'rgba(13,36,23,0.5)', 
                            marginTop: '2px' 
                          }}>
                            / one-time
                          </span>
                        </div>

                        {/* Discount Save Badge */}
                        <div style={{ textAlign: 'left', margin: '0 0 28px 0' }}>
                          <span style={{ 
                            background: isBestValue ? '#E6F4EA' : '#FEF3C7', 
                            color: isBestValue ? '#137333' : '#B45309', 
                            padding: '6px 14px', 
                            borderRadius: '100px', 
                            fontSize: '12px', 
                            fontWeight: 700, 
                            display: 'inline-block' 
                          }}>
                            Save {offPercent}% (₹{p.oldPrice - p.price} Off)
                          </span>
                        </div>

                        {/* Divider Line */}
                        <div style={{ borderBottom: '1px solid rgba(13,36,23,0.08)', margin: '0 0 24px 0' }} />

                        {/* Features Checklist */}
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '14px', 
                          marginBottom: '32px',
                          textAlign: 'left'
                        }}>
                          {packFeatures.map(f => (
                            <div key={f} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '10px',
                              fontSize: '14px',
                              color: 'var(--ink)',
                              fontWeight: f.includes('rock') || f.includes('shilajit') ? 600 : 400
                            }}>
                              <span style={{ 
                                color: isBestValue ? '#1B3D2B' : '#B87333', 
                                fontWeight: 700,
                                fontSize: '15px'
                              }}>
                                ✓
                              </span>
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button always visible at the bottom */}
                      <div>
                        <button 
                          onClick={() => addToCart(p)} 
                          style={{ 
                            width: '100%', 
                            height: '48px', 
                            borderRadius: '8px',
                            background: isBestValue ? '#1B3D2B' : 'transparent',
                            border: isBestValue ? 'none' : '2px solid #B87333',
                            color: isBestValue ? '#FFFFFF' : '#B87333',
                            fontWeight: 700,
                            fontSize: '13px',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                            boxShadow: isBestValue ? '0 4px 14px rgba(27,61,43,0.15)' : 'none'
                          }}
                          onMouseEnter={e => {
                            if (isBestValue) {
                              e.currentTarget.style.background = '#12291d';
                              e.currentTarget.style.boxShadow = '0 6px 18px rgba(27,61,43,0.25)';
                            } else {
                              e.currentTarget.style.background = 'rgba(184,115,51,0.08)';
                            }
                          }}
                          onMouseLeave={e => {
                            if (isBestValue) {
                              e.currentTarget.style.background = '#1B3D2B';
                              e.currentTarget.style.boxShadow = '0 4px 14px rgba(27,61,43,0.15)';
                            } else {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <ShoppingBag size={15} /> ADD TO CART
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Urgency */}
              <div className="pricing__urgency reveal" style={{ maxWidth: 640, margin: '0 auto 36px', textAlign: 'center' }}>
                <strong>⚠️ Only 60 units available in this batch.</strong> Next batch ships in 3 weeks. Once this is gone, it's gone till the next harvest.
              </div>

              {/* Trust info row - Redesigned into 4 premium boxes (Image 1 Style Row) */}
              <div className="reveal" style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', marginTop: '16px' }}>
                <div className="hero-trust-row-grid">
                  {/* Card 1: 100% Secure */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(13,36,23,0.06)',
                    borderRadius: '16px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.015)'
                  }}>
                    <div style={{ color: '#1B3D2B', marginBottom: '8px' }}>
                      <Lock size={24} strokeWidth={1.5} />
                    </div>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1B3D2B', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>100% Secure</h4>
                    <div style={{ width: '24px', height: '1px', background: 'rgba(13,36,23,0.12)', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4, margin: 0 }}>Secure transactions with cash-on-delivery options.</p>
                  </div>

                  {/* Card 2: Ships in 24 hrs */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(13,36,23,0.06)',
                    borderRadius: '16px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.015)'
                  }}>
                    <div style={{ color: '#1B3D2B', marginBottom: '8px' }}>
                      <Truck size={24} strokeWidth={1.5} />
                    </div>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1B3D2B', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Express Shipping</h4>
                    <div style={{ width: '24px', height: '1px', background: 'rgba(13,36,23,0.12)', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4, margin: 0 }}>Dispatched within 24 hours via Shiprocket express.</p>
                  </div>

                  {/* Card 3: 15-day Guarantee */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(13,36,23,0.06)',
                    borderRadius: '16px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.015)'
                  }}>
                    <div style={{ color: '#1B3D2B', marginBottom: '8px' }}>
                      <ShieldCheck size={24} strokeWidth={1.5} />
                    </div>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1B3D2B', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>15-Day Return</h4>
                    <div style={{ width: '24px', height: '1px', background: 'rgba(13,36,23,0.12)', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4, margin: 0 }}>Satisfied or receive a hassle-free money-back refund.</p>
                  </div>

                  {/* Card 4: Support */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(13,36,23,0.06)',
                    borderRadius: '16px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.015)'
                  }}>
                    <div style={{ color: '#1B3D2B', marginBottom: '8px' }}>
                      <Mail size={24} strokeWidth={1.5} />
                    </div>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1B3D2B', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Contact Support</h4>
                    <div style={{ width: '24px', height: '1px', background: 'rgba(13,36,23,0.12)', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4, margin: 0 }}>Reach out directly to support@apasya.in any time.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 11 · GUARANTEE */}
          <section className="guarantee" id="guarantee">
            <div className="container--narrow">
              <div className="reveal shield-pulse guarantee__shield">🛡️</div>
              <h2 className="reveal h2">Try it for 15 days, or your money back</h2>
              <p className="reveal body-text">
                If you don't feel a difference in your energy, focus, or sleep within 15 days, email me at {CONTACT_EMAIL}. I will refund you fully. No questions asked. No forms to fill. No waiting.
              </p>
              <p className="reveal" style={{ fontSize: 15, fontStyle: 'italic', fontWeight: 600, color: 'var(--gold2)', marginBottom: 32 }}>
                "I would rather you trust me completely than keep any money. That is my promise to you."
              </p>
              <div className="reveal">
                <a href="#pricing" className="btn btn--gold" style={{ display: 'inline-flex', width: 'auto', minWidth: 260, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  Try Risk-Free Today <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </section>

          {/* 12 · FINAL CTA */}
          <section className="final-cta">
            <div className="container--narrow">
              <div className="reveal">
                <p className="label">Ready to feel the difference?</p>
                <h2 className="h2" style={{ color: 'var(--ink)' }}>Your order ships today.</h2>
                <p className="body-text">
                  Reclaim the energy, clarity, and vitality you had years ago. Pure mountain Shilajit. Straight to your door.
                </p>
              </div>
              <div className="final-cta__stack reveal">
                <a href="#pricing" className="btn btn--gold">
                  Yes, I Want Original Rock Shilajit →
                </a>
                <a href={CONTACT_LINK} className="btn btn--phone">
                  ✉️ Order via Email: {CONTACT_EMAIL}
                </a>
              </div>
              <div className="final-cta__trust reveal">
                <div>✓ COD available: pay only when it arrives</div>
                <div>✓ Free shipping on 2-pack and above</div>
                <div>✓ Contact us anytime: {CONTACT_EMAIL}</div>
              </div>
              <div className="scarcity reveal">
                <div className="scarcity__dot"></div>
                <div>This batch: 60 units · 23 already ordered this week</div>
              </div>
            </div>
          </section>

          {/* FAQ Accordion Section */}
          <section className="faq-section" id="faq">
            <div className="faq-eyebrow">Questions &amp; Answers</div>
            <h2 className="faq-title">Everything about<br /><em>Raw Shilajit</em></h2>
            <p className="faq-subtitle">Straight answers about sourcing, quality, usage, and what makes our resin different from everything else on the market.</p>

            {/* Category Tabs */}
            <div className="faq-tabs">
              {[
                { id: 'all', label: 'All' },
                { id: 'product', label: 'Product' },
                { id: 'usage', label: 'Usage' },
                { id: 'sourcing', label: 'Sourcing' },
                { id: 'shipping', label: 'Shipping' },
                { id: 'safety', label: 'Safety' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeFaqCat === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFaqCat(tab.id);
                    setOpenFaqIndex(null);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="faq-list">
              {FAQ_ITEMS.filter(item => activeFaqCat === 'all' || item.cat === activeFaqCat).map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                    <button
                      className="faq-question"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    >
                      {item.question}
                      <span className="faq-icon">
                        <svg viewBox="0 0 12 12" fill="none" strokeWidth="1.8">
                          <line x1="6" y1="1" x2="6" y2="11" />
                          <line x1="1" y1="6" x2="11" y2="6" />
                        </svg>
                      </span>
                    </button>
                    <div className="faq-body">
                      <div className="faq-body-inner">
                        <p className="faq-answer">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Strip */}
            <div className="faq-cta">
              <div className="faq-cta-text">
                <h3>Still have questions?</h3>
                <p>We're a small team. You'll always reach a real person.</p>
              </div>
              <a href={CONTACT_LINK} className="cta-btn" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                Contact Us
              </a>
            </div>
          </section>

          {/* 12 · CONTACT US SECTION */}
          <section id="contact-us" className="contact-section" style={{
            background: '#FAF6F0',
            padding: '80px 24px',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'Inter, sans-serif'
          }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="label" style={{ letterSpacing: '0.12em', color: '#B87333', marginBottom: '12px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 700 }}>GET IN TOUCH</p>
                <h2 className="h2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px, 3.5vw, 42px)', color: '#0D2417', margin: 0, fontWeight: 700 }}>Contact Our Healers</h2>
                <div style={{ width: '60px', height: '3px', background: '#B87333', margin: '16px auto 0' }} />
                <p style={{ fontSize: '15px', color: 'var(--muted)', marginTop: '16px', maxWidth: '580px', margin: '16px auto 0', lineHeight: 1.6 }}>
                  Whether you have questions about raw Shilajit dosing, order shipping, or bulk inquiries, our dedicated support team is ready to assist you.
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
              }}>
                {/* Contact Card 1: Email */}
                <div style={{
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(13,36,23,0.06)',
                  borderRadius: '24px',
                  padding: '40px 32px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.015)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  maxWidth: '460px',
                  width: '100%'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(184,115,51,0.08)',
                    color: '#B87333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px'
                  }}>
                    <Mail size={28} strokeWidth={1.5} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0D2417', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Support</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 20px 0', maxWidth: '260px' }}>
                    Send us an email at any time. We respond to all customer support inquiries within 12–24 hours.
                  </p>
                  <a href={`mailto:${CONTACT_EMAIL}`} style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#B87333',
                    textDecoration: 'none',
                    borderBottom: '2px solid #B87333',
                    paddingBottom: '2px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#0D2417'}
                  onMouseLeave={e => e.currentTarget.style.color = '#B87333'}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ══════════════════════════════════════
          POLICY VIEWS (PRIVACY, TERMS, SHIPPING, CANCELLATION)
      ══════════════════════════════════════ */}
      {['privacy', 'terms', 'shipping', 'cancellation'].includes(activeView) && (
        <section className="dashboard-view" style={{ minHeight: '80vh', padding: '60px 20px', background: 'var(--cream)' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--white)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <button className="dashboard-back-btn" onClick={() => setActiveView('home')} style={{ marginBottom: '32px' }}>
              ← Back to Homepage
            </button>
            
            {activeView === 'privacy' && (
              <div style={{ textAlign: 'left' }}>
                <h1 className="h2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', color: '#0D2417', marginBottom: '24px' }}>Privacy Policy</h1>
                <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>Last updated: May 28, 2026</p>
                <div className="policy-content" style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <p>At <strong>Apasya</strong> (registered under Apasya Natural Products), accessible from <a href="https://apasya.in" style={{ color: '#B87333', textDecoration: 'none' }}>apasya.in</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Apasya and how we use it.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>1. Consent</h3>
                  <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>2. Information We Collect</h3>
                  <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
                  <p>If you purchase products from us, we collect shipping details (name, delivery address, phone numbers) to successfully fulfill your order. Payments are processed securely via our trusted payment gateway partner PhonePe, and we do not store your credit card or raw banking credentials on our servers.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>3. How We Use Your Information</h3>
                  <p>We use the information we collect in various ways, including to:</p>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>Provide, operate, and maintain our website and e-commerce services.</li>
                    <li>Process transactions, track and fulfill shipments of Apasya Shilajit.</li>
                    <li>Communicate with you regarding order confirmations, live delivery timelines, and customer support.</li>
                    <li>Prevent fraudulent transactions and secure our systems.</li>
                  </ul>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>4. Log Files</h3>
                  <p>Apasya follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>5. Third Party Privacy Policies</h3>
                  <p>Apasya's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party servers like Google (for OAuth) and PhonePe (for payment gateways) for more detailed information.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>6. Contact Us</h3>
                  <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#B87333', textDecoration: 'none', fontWeight: 600 }}>{CONTACT_EMAIL}</a>.</p>
                </div>
              </div>
            )}

            {activeView === 'terms' && (
              <div style={{ textAlign: 'left' }}>
                <h1 className="h2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', color: '#0D2417', marginBottom: '24px' }}>Terms &amp; Conditions</h1>
                <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>Last updated: May 28, 2026</p>
                <div className="policy-content" style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <p>Welcome to <strong>Apasya</strong>! These terms and conditions outline the rules and regulations for the use of Apasya Natural Products' Website, located at <a href="https://apasya.in" style={{ color: '#B87333', textDecoration: 'none' }}>apasya.in</a>.</p>
                  <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use Apasya if you do not agree to take all of the terms and conditions stated on this page.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>1. E-Commerce Purchases</h3>
                  <p>By placing an order for Starter Pack (10g) or Best Value Pack (25g), you warrant that you are at least 18 years of age and are capable of entering into legally binding agreements. You agree to provide accurate, complete, and current information for all purchases.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>2. Pricing and Availability</h3>
                  <p>All prices listed on the site are in Indian Rupees (INR) and are inclusive of applicable taxes unless specified otherwise. We reserve the right to modify prices or adjust daily inventory limit caps without prior notice. If a product becomes unavailable after order placement, we will contact you to issue a complete refund.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>3. Disclaimer &amp; Wellness Use</h3>
                  <p>Apasya Shilajit is a raw mineral resin. Sourced directly from Satpura Range formations, it is 100% natural and free from chemical additives. However, the descriptions and dietary claims on this website have not been evaluated by the Food and Drug Administration (FDA) or equivalent local authorities. The product is not intended to diagnose, treat, cure, or prevent any disease. Results may vary between individuals.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>4. Limitation of Liability</h3>
                  <p>In no event shall Apasya, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website or consumption of the products, whether such liability is under contract or tort.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>5. Contact</h3>
                  <p>If you have any queries regarding our terms, please reach out to us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#B87333', textDecoration: 'none', fontWeight: 600 }}>{CONTACT_EMAIL}</a>.</p>
                </div>
              </div>
            )}

            {activeView === 'shipping' && (
              <div style={{ textAlign: 'left' }}>
                <h1 className="h2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', color: '#0D2417', marginBottom: '24px' }}>Shipping Policy</h1>
                <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>Last updated: May 28, 2026</p>
                <div className="policy-content" style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <p>Thank you for choosing <strong>Apasya</strong>. We want to deliver your fresh mountain-sourced Shilajit pack as quickly and safely as possible. Below are the terms and conditions that constitute our Shipping Policy.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>1. Shipment Processing Time</h3>
                  <p>All orders are processed and handed over to our shipping courier partners within <strong>24 hours</strong> of transaction confirmation. Orders are not packed or shipped on Sundays or national holidays.</p>
                  <p>If we are experiencing a high volume of orders or if daily inventory limits are reached, shipments may be slightly delayed. In case of significant delay, we will reach out to you via SMS or email immediately.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>2. Shipping Rates &amp; Delivery Estimates</h3>
                  <p>Shipping charges for your order will be calculated and displayed during checkout. Currently, we offer free shipping across India for our Best Value Pack (25g jar) or standard cart checkouts. Standard shipping rates may apply on single Starter Pack orders.</p>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li><strong>Standard Express Shipping:</strong> Delivery typically takes 3-5 business days from dispatch for metro cities, and 4-7 business days for regional areas.</li>
                    <li><strong>Cash on Delivery (COD):</strong> Available throughout major pincodes in India at no additional convenience fee. Pay in cash or UPI at your doorstep when the package is delivered.</li>
                  </ul>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>3. Shipment Confirmation &amp; Order Tracking</h3>
                  <p>You will receive a shipment confirmation notification once your order is dispatched. You can track your shipment status live on our <strong>My Orders</strong> dashboard page at any time by entering your transaction ID.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>4. Damages &amp; Lost Packages</h3>
                  <p>If your package arrives in a damaged or tampered state, please do not accept it from the courier. If it is already received, take a photo and contact us immediately at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#B87333', textDecoration: 'none', fontWeight: 600 }}>{CONTACT_EMAIL}</a>. We will dispatch a fresh replacement package at no additional cost.</p>
                </div>
              </div>
            )}

            {activeView === 'cancellation' && (
              <div style={{ textAlign: 'left' }}>
                <h1 className="h2" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', color: '#0D2417', marginBottom: '24px' }}>Cancellation &amp; Refund Policy</h1>
                <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>Last updated: May 28, 2026</p>
                <div className="policy-content" style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <p>At <strong>Apasya</strong>, we believe in the absolute quality of our pure Satpura Range Shilajit. We want you to feel entirely secure in your purchase decision.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>1. Order Cancellation</h3>
                  <p>You may request to cancel your order within <strong>2 hours</strong> of placing it, as long as it has not been packed or handed over to our shipping couriers. To cancel, please email us directly at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#B87333', textDecoration: 'none', fontWeight: 600 }}>{CONTACT_EMAIL}</a> with your transaction details. Once shipped, cancellations cannot be processed.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>2. 15-Day Money-Back Guarantee</h3>
                  <p>We offer a hassle-free <strong>15-Day Money-Back Guarantee</strong>. If you are genuinely unsatisfied with the quality of our Shilajit, or if it does not meet your expectations, you can request a refund within 15 days of receiving the delivery.</p>
                  <p>To initiate a refund under this guarantee, please contact our support team at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#B87333', textDecoration: 'none', fontWeight: 600 }}>{CONTACT_EMAIL}</a> explaining your experience. Our direct-from-source model means we handle every customer query personally.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>3. Damaged or Faulty Items</h3>
                  <p>If you receive a package that is damaged or tampered, contact us within 48 hours of delivery. We will issue a 100% refund or ship a replacement jar at no extra cost.</p>
                  
                  <h3 style={{ fontSize: '18px', color: 'var(--earth)', fontWeight: 700, marginTop: '12px' }}>4. Refund Fulfillments</h3>
                  <p>Approved refunds will be processed and credited back to your original source of payment (for online payments) or bank account (for COD orders) within <strong>5-7 business days</strong>. A confirmation email will be sent once the refund transaction is initiated from our side.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          VIEW 2: MY ORDERS SCREEN (CUSTOMER DASHBOARD)
      ══════════════════════════════════════ */}
      {activeView === 'orders' && (
        <section className="dashboard-view">
          <div className="container">
            <button className="dashboard-back-btn" onClick={() => setActiveView('home')}>
              ← Back to Homepage
            </button>
            
            <div style={{ marginBottom: 40 }}>
              <h2 className="h2" style={{ margin: 0 }}>My Orders</h2>
              <p className="body-text">Track your shipment status and review invoices</p>
            </div>

            {loadingOrders ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0' }}>
                <div className="spinner"></div>
                <p className="body-text">Loading your order history...</p>
              </div>
            ) : myOrders.length === 0 ? (
              <div style={{ textAlign: 'center', background: 'var(--white)', border: '1px solid var(--border)', padding: 60, borderRadius: 16 }}>
                <ShoppingBag size={48} color="var(--gold)" style={{ marginBottom: 16, margin: '0 auto' }} />
                <h3 className="h3">No Orders Found</h3>
                <p className="body-text" style={{ maxWidth: 450, margin: '8px auto 24px' }}>
                  {!authToken 
                    ? "You are not logged in. If you recently placed an order, please sign in or register with your email to track your live shipment timeline." 
                    : "You haven't placed any paid orders yet. Order a Satpura Range Shilajit pack to begin your health transformation!"
                  }
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {!authToken ? (
                    <>
                      <button className="btn btn--gold" style={{ display: 'inline-block', width: 'auto', border: 'none', cursor: 'pointer' }} onClick={() => { setAuthTab('login'); setIsAuthOpen(true); }}>
                        Sign In to Account
                      </button>
                      <button className="btn btn--outline" style={{ display: 'inline-block', width: 'auto', border: '1.5px solid var(--gold)', cursor: 'pointer' }} onClick={() => { setAuthTab('signup'); setIsAuthOpen(true); }}>
                        Create Account
                      </button>
                    </>
                  ) : (
                    <button className="btn btn--gold" style={{ display: 'inline-block', width: 'auto', border: 'none', cursor: 'pointer' }} onClick={() => setActiveView('home')}>
                      Browse Products
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {myOrders.map(order => {
                  const matchingProd = products.find(p => p.name === order.productName);
                  const imageSrc = matchingProd?.imageUrl || '/shilajit_jar_mockup.png';
                  const grams = matchingProd?.grams || '25g jar';
                  
                  return (
                    <div key={order._id} className="order-card">
                      {/* Order Header */}
                      <div className="order-card__header">
                        <div className="order-card__meta-item">
                          <span className="order-card__meta-label">Order Placed</span>
                          <span className="order-card__meta-value">
                            {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="order-card__meta-item">
                          <span className="order-card__meta-label">Total Amount</span>
                          <span className="order-card__meta-value">₹{order.price}</span>
                        </div>
                        <div className="order-card__meta-item">
                          <span className="order-card__meta-label">Ship To</span>
                          <span className="order-card__meta-value">{order.name}</span>
                        </div>
                        <div className="order-card__meta-item" style={{ marginLeft: 'auto' }}>
                          <span className="order-card__meta-label">Transaction ID</span>
                          <span className="order-card__meta-value" style={{ fontFamily: 'monospace', fontSize: 13 }}>{order.txnId}</span>
                        </div>
                      </div>

                      {/* Order Body */}
                      <div className="order-card__body">
                        <div className="order-card__grid">
                          {/* Left: Product & Tracker */}
                          <div>
                            <div className="order-card__product-info">
                              <img src={imageSrc} alt={order.productName} className="order-card__product-img" />
                              <div className="order-card__product-details">
                                <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>{order.productName}</h4>
                                <p style={{ fontSize: 13, color: 'var(--muted)' }}>Quantity: {order.quantity} · Pack size: {grams}</p>
                                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                  <span style={{ fontSize: 11, background: 'var(--earth)', color: 'white', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                                    PAYMENT: {order.paymentStatus}
                                  </span>
                                  <span style={{ fontSize: 11, background: 'var(--gold)', color: 'white', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                                    STATUS: {order.deliveryStatus}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Shipment Status Progress Line */}
                            <div style={{ marginTop: 32 }}>
                              <h5 className="form-label" style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'left', marginBottom: 12 }}>
                                Shipment Tracking Timeline
                              </h5>
                              <div className="order-tracker">
                                <div 
                                  className="order-tracker__progress-line"
                                  style={{ width: `${getDeliveryStatusProgress(order.deliveryStatus)}%` }}
                                />
                                {['Processing', 'Packing', 'Shipping', 'Out for Delivery', 'Delivered'].map((stage, sIdx) => (
                                  <div key={stage} className={`order-tracker__step ${getStageClass(order.deliveryStatus, stage)}`}>
                                    <div className="order-tracker__node">
                                      {sIdx + 1}
                                    </div>
                                    <span className="order-tracker__label">{stage}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right: Bill details */}
                          <div>
                            <div className="order-card__bill-summary">
                              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 4 }}>
                                Bill Details
                              </h4>
                              
                              <div className="order-card__bill-row">
                                <span>Item Subtotal ({order.productName})</span>
                                <span>₹{Math.round(order.price * 0.82)}</span>
                              </div>
                              <div className="order-card__bill-row">
                                <span>GST (18% Integrated)</span>
                                <span>₹{Math.round(order.price * 0.18)}</span>
                              </div>
                              <div className="order-card__bill-row">
                                <span>Express Delivery Shipping</span>
                                <span style={{ color: 'var(--green2)', fontWeight: 600 }}>FREE</span>
                              </div>
                              
                              <div className="order-card__bill-row order-card__bill-row--total">
                                <span>Total Paid</span>
                                <span>₹{order.price}</span>
                              </div>
                              
                              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, fontStyle: 'italic', textAlign: 'left' }}>
                                📍 Delivery address: <br />
                                {order.address}, {order.pincode}, {order.state}, {order.country}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          VIEW 3: ADMIN CMS PORTAL (ADMIN OVERVIEW)
      ══════════════════════════════════════ */}
      {/* Admin Login Panel when user is not admin */}
      {activeView === 'admin' && (!currentUser || currentUser?.role !== 'admin') && (
        <section className="admin-login-view" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 40, maxWidth: 450, width: '100%', boxShadow: '0 20px 48px var(--shadow)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>🔐</div>
              <h2 className="h2" style={{ margin: '0 0 8px' }}>Admin Access Only</h2>
              <p className="body-text">Please sign in with your administrator credentials to manage products and orders.</p>
            </div>
            
            {authError && <div className="auth-error-banner" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{authError}</div>}
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              setAuthError('');
              try {
                const res = await fetch(`${BACKEND_API_URL}/auth/signin`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: authForm.email, password: authForm.password })
                });
                const data = await res.json();
                if (data.success) {
                  if (data.user.role === 'admin') {
                    setAuthToken(data.token);
                    setAuthForm({ name: '', email: '', phone: '', password: '' });
                  } else {
                    setAuthError('Access denied: You are not authorized as an administrator.');
                  }
                } else {
                  setAuthError(data.error || 'Authentication failed');
                }
              } catch (err) {
                console.error(err);
                setAuthError('Connection error to authentication server');
              }
            }} className="checkout-form">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-email">Admin Email Address</label>
                <input 
                  type="email" 
                  id="admin-email" 
                  className="form-input" 
                  placeholder="admin@shilajit.com"
                  value={authForm.email}
                  onChange={e => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-password">Password</label>
                <input 
                  type="password" 
                  id="admin-password" 
                  className="form-input" 
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={e => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <button type="submit" className="btn btn--gold" style={{ width: '100%', marginTop: 12, border: 'none', cursor: 'pointer' }}>
                Secure Admin Login
              </button>
            </form>
          </div>
        </section>
      )}

      {activeView === 'admin' && currentUser?.role === 'admin' && (
        <section className="admin-view">
          <div className="container">
            <div className="admin-header">
              <div>
                <button className="dashboard-back-btn" onClick={() => setActiveView('home')} style={{ marginBottom: 8 }}>
                  ← Back to Store
                </button>
                <h2 className="h2" style={{ margin: 0 }}>Admin CMS Portal</h2>
                <p className="body-text">Configure products, track dynamic analytics, and update order fulfillment statuses</p>
              </div>

              {/* Admin Tabs Toggle */}
              <div className="admin-tabs">
                <button 
                  className={`admin-tab-btn ${adminTab === 'dashboard' ? 'admin-tab-btn--active' : ''}`}
                  onClick={() => setAdminTab('dashboard')}
                >
                  <BarChart2 size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> Dashboard Stats
                </button>
                <button 
                  className={`admin-tab-btn ${adminTab === 'orders' ? 'admin-tab-btn--active' : ''}`}
                  onClick={() => setAdminTab('orders')}
                >
                  <Package size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> Orders Manager
                </button>
                <button 
                  className={`admin-tab-btn ${adminTab === 'products' ? 'admin-tab-btn--active' : ''}`}
                  onClick={() => setAdminTab('products')}
                >
                  <Settings size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> Product Customizer
                </button>
                <button 
                  className={`admin-tab-btn ${adminTab === 'inventory' ? 'admin-tab-btn--active' : ''}`}
                  onClick={() => setAdminTab('inventory')}
                >
                  <TrendingUp size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> Inventory Control
                </button>
              </div>
            </div>

            {loadingAdmin ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0' }}>
                <div className="spinner"></div>
                <p className="body-text">Fetching CMS Portal details...</p>
              </div>
            ) : (
              <>
                {/* SUBTAB 1: ANALYTICS & STATS DASHBOARD */}
                {adminTab === 'dashboard' && adminStats && (
                  <div>
                    <div className="admin-stats-grid">
                      <div className="admin-stat-card">
                        <div className="admin-stat-card__label">💰 Total Payments Received</div>
                        <div className="admin-stat-card__value">₹{adminStats.totalRevenue}</div>
                        <span style={{ fontSize: 11, color: 'var(--green2)' }}>✓ 100% verified via PhonePe</span>
                      </div>
                      <div className="admin-stat-card">
                        <div className="admin-stat-card__label">📦 Paid Orders Count</div>
                        <div className="admin-stat-card__value">{adminStats.paidOrdersCount}</div>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>Out of {adminStats.totalOrders} total inquiries</span>
                      </div>
                      <div className="admin-stat-card">
                        <div className="admin-stat-card__label">👥 Registered Users</div>
                        <div className="admin-stat-card__value">{adminStats.totalUsers}</div>
                        <span style={{ fontSize: 11, color: 'var(--gold2)' }}>Customer accounts active</span>
                      </div>
                    </div>

                    {/* Dynamic visual graph summary */}
                    <div className="admin-visuals">
                      <h3 className="h3" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                        Product Distribution Analytics
                      </h3>
                      <div className="progress-bar-group">
                        {products.map(p => {
                          const count = adminStats.distribution[p.name] || 0;
                          const percent = adminStats.paidOrdersCount > 0 
                            ? Math.round((count / adminStats.paidOrdersCount) * 100) 
                            : 0;
                            
                          return (
                            <div key={p._id} style={{ marginBottom: 16 }}>
                              <div className="progress-bar-label">
                                <span>{p.name} ({p.grams})</span>
                                <strong>{count} sold ({percent}%)</strong>
                              </div>
                              <div className="progress-bar-track">
                                <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBTAB 2: ORDERS FULFILLMENT MANAGER */}
                {adminTab === 'orders' && (
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Customer Details</th>
                          <th>Product details</th>
                          <th>Amount</th>
                          <th>Payment</th>
                          <th>Delivery Status (Click to Change)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminOrders.map(order => (
                          <tr key={order._id}>
                            <td style={{ fontSize: 13, color: 'var(--muted)' }}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <strong>{order.name}</strong><br />
                              <span style={{ fontSize: 12, color: 'var(--muted)' }}>📞 {order.phone1}</span><br />
                              <span style={{ fontSize: 11, color: 'var(--muted)' }}>📍 {order.address}, {order.pincode}</span>
                            </td>
                            <td>
                              <strong>{order.productName}</strong><br />
                              <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--muted)' }}>TXN: {order.txnId}</span>
                            </td>
                            <td style={{ fontWeight: 600, color: 'var(--ink)' }}>₹{order.price}</td>
                            <td>
                              <span style={{ 
                                fontSize: 11, 
                                fontWeight: 700,
                                padding: '3px 8px', 
                                borderRadius: 4, 
                                background: order.paymentStatus === 'PAID' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: order.paymentStatus === 'PAID' ? 'var(--green2)' : '#ef4444' 
                              }}>
                                {order.paymentStatus}
                              </span>
                            </td>
                            <td>
                              {order.paymentStatus === 'PAID' ? (
                                <select 
                                  value={order.deliveryStatus} 
                                  className="status-select"
                                  onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                >
                                  <option value="Processing">Processing</option>
                                  <option value="Packing">Packing</option>
                                  <option value="Shipping">Shipping</option>
                                  <option value="Out for Delivery">Out for Delivery</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              ) : (
                                <span style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Pending Payment</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {adminOrders.length === 0 && (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                              No orders exist in the database.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* SUBTAB 3: PRODUCT CUSTOMIZER */}
                {adminTab === 'products' && (
                  <div>
                    {editingProduct ? (
                      /* Product Edit Form */
                      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: 32, maxWidth: 600, margin: '0 auto' }}>
                        <h3 className="h3" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
                          Edit Pack: {editingProduct.name}
                        </h3>
                        
                        <form onSubmit={handleEditProductSubmit} className="checkout-form">
                          <div className="form-group">
                            <label className="form-label" htmlFor="edit-name">Display Name</label>
                            <input 
                              type="text" 
                              id="edit-name" 
                              className="form-input"
                              value={editProductForm.name}
                              onChange={(e) => setEditProductForm(prev => ({ ...prev, name: e.target.value }))}
                              required
                            />
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label" htmlFor="edit-price">Current Price (₹)</label>
                              <input 
                                type="number" 
                                id="edit-price" 
                                className="form-input"
                                value={editProductForm.price}
                                onChange={(e) => setEditProductForm(prev => ({ ...prev, price: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label" htmlFor="edit-old-price">Original Price (₹)</label>
                              <input 
                                type="number" 
                                id="edit-old-price" 
                                className="form-input"
                                value={editProductForm.oldPrice}
                                onChange={(e) => setEditProductForm(prev => ({ ...prev, oldPrice: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label" htmlFor="edit-grams">Jar Grams</label>
                              <input 
                                type="text" 
                                id="edit-grams" 
                                className="form-input"
                                value={editProductForm.grams}
                                onChange={(e) => setEditProductForm(prev => ({ ...prev, grams: e.target.value }))}
                                placeholder="e.g. 10g jar"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label" htmlFor="edit-supply">Supply Duration</label>
                              <input 
                                type="text" 
                                id="edit-supply" 
                                className="form-input"
                                value={editProductForm.supply}
                                onChange={(e) => setEditProductForm(prev => ({ ...prev, supply: e.target.value }))}
                                placeholder="e.g. 15-day supply"
                                required
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label" htmlFor="edit-image">Product Image URL</label>
                            <input 
                              type="text" 
                              id="edit-image" 
                              className="form-input"
                              value={editProductForm.imageUrl}
                              onChange={(e) => setEditProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                              placeholder="e.g. /shilajit_jar_mockup.png"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" htmlFor="edit-video">Fulfillment Video Demo URL</label>
                            <input 
                              type="text" 
                              id="edit-video" 
                              className="form-input"
                              value={editProductForm.videoUrl}
                              onChange={(e) => setEditProductForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                              placeholder="e.g. /Home.mp4"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" htmlFor="edit-features">Package Features (Comma Separated)</label>
                            <textarea 
                              id="edit-features" 
                              rows="3"
                              className="form-input"
                              value={editProductForm.features}
                              onChange={(e) => setEditProductForm(prev => ({ ...prev, features: e.target.value }))}
                              placeholder="Feature 1, Feature 2, Feature 3"
                              required
                            />
                          </div>

                          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                            <button type="submit" className="btn btn--gold" style={{ flex: 1, border: 'none' }}>
                              Save Catalog Updates
                            </button>
                            <button 
                              type="button" 
                              className="btn btn--outline" 
                              style={{ flex: 1, border: '1.5px solid var(--gold)' }}
                              onClick={() => setEditingProduct(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      /* Product List */
                      <div className="admin-product-list">
                        {products.map(p => (
                          <div key={p._id} className="admin-product-card">
                            <img src={p.imageUrl || '/shilajit_jar_mockup.png'} alt={p.name} className="admin-product-card__img" />
                            <div className="admin-product-card__content">
                              <div>
                                <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{p.name}</h4>
                                <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 6px' }}>{p.grams} · {p.supply}</p>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gold2)' }}>
                                  ₹{p.price} {p.oldPrice && <span style={{ fontSize: 12, textDecoration: 'line-through', color: 'var(--muted)', marginLeft: 6 }}>₹{p.oldPrice}</span>}
                                </div>
                              </div>
                              <button 
                                className="btn btn--outline" 
                                style={{ 
                                  padding: '8px 16px', 
                                  fontSize: 12, 
                                  marginTop: 12,
                                  width: 'auto',
                                  alignSelf: 'flex-start',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  border: '1.5px solid var(--gold)'
                                }}
                                onClick={() => startEditProduct(p)}
                              >
                                <Edit size={12} /> Edit Catalog Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* SUBTAB 4: INVENTORY CONTROL (12-MONTH CALENDAR) */}
                {adminTab === 'inventory' && (
                  <div>
                    <h3 className="h3" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 24 }}>
                      12-Month Multi-Product Inventory Calendar &amp; Pricing Manager
                    </h3>
                    
                    {products.slice(0, 2).map((p) => {
                      const totalAvailable = p.monthlyInventory ? p.monthlyInventory.reduce((sum, m) => sum + m.available, 0) : 1200;
                      const totalBookings = p.monthlyInventory ? p.monthlyInventory.reduce((sum, m) => sum + m.bookings, 0) : 0;
                      const totalDeliverablesLeft = Math.max(0, totalAvailable - totalBookings);

                      return (
                        <div key={p._id} className="admin-calendar-card">
                          <div className="admin-calendar-title">
                            <div>
                              <span>📅 {p.name} ({p.grams})</span>
                              <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 400, marginLeft: '12px' }}>
                                (Overall: {totalDeliverablesLeft} deliverables left of {totalAvailable})
                              </span>
                            </div>
                            <span style={{ fontSize: '12px', background: 'rgba(184, 115, 51, 0.08)', color: 'var(--gold)', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              ACTIVE BATCH
                            </span>
                          </div>

                          <div className="calendar-table-wrapper" style={{ marginBottom: '20px' }}>
                            <table className="calendar-table">
                              <thead>
                                <tr>
                                  <th className="calendar-row-label">Metric / Month</th>
                                  {p.monthlyInventory && p.monthlyInventory.map((m) => (
                                    <th key={m.monthIndex}>{m.monthName.substring(0, 3)}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {/* Row 1: Available */}
                                <tr>
                                  <td className="calendar-row-label">📦 Available</td>
                                  {p.monthlyInventory && p.monthlyInventory.map((m) => (
                                    <td key={m.monthIndex}>
                                      <input 
                                        type="number" 
                                        className="calendar-input"
                                        defaultValue={m.available}
                                        id={`avail-${p._id}-${m.monthIndex}`}
                                      />
                                    </td>
                                  ))}
                                </tr>
                                
                                {/* Row 2: Bookings */}
                                <tr>
                                  <td className="calendar-row-label">🛒 Bookings</td>
                                  {p.monthlyInventory && p.monthlyInventory.map((m) => (
                                    <td key={m.monthIndex} style={{ fontWeight: 600, color: 'var(--muted)' }}>
                                      {m.bookings}
                                    </td>
                                  ))}
                                </tr>

                                {/* Row 3: Price */}
                                <tr>
                                  <td className="calendar-row-label">₹ Price (INR)</td>
                                  {p.monthlyInventory && p.monthlyInventory.map((m) => (
                                    <td key={m.monthIndex}>
                                      <input 
                                        type="number" 
                                        className="calendar-input"
                                        defaultValue={m.price}
                                        id={`price-${p._id}-${m.monthIndex}`}
                                      />
                                    </td>
                                  ))}
                                </tr>

                                {/* Row 4: Deliverables Left */}
                                <tr>
                                  <td className="calendar-row-label">🚚 Leftover</td>
                                  {p.monthlyInventory && p.monthlyInventory.map((m) => {
                                    const left = Math.max(0, m.available - m.bookings);
                                    return (
                                      <td key={m.monthIndex} style={{ fontWeight: 700, color: left <= 10 ? '#ef4444' : 'var(--green2)' }}>
                                        {left}
                                      </td>
                                    );
                                  })}
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn--gold"
                              style={{ width: 'auto', padding: '12px 24px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}
                              onClick={async () => {
                                const updatedInventory = p.monthlyInventory.map(m => {
                                  const availVal = parseInt(document.getElementById(`avail-${p._id}-${m.monthIndex}`).value) || 0;
                                  const priceVal = parseInt(document.getElementById(`price-${p._id}-${m.monthIndex}`).value) || 0;
                                  return {
                                    ...m,
                                    available: availVal,
                                    price: priceVal
                                  };
                                });

                                try {
                                  const res = await fetch(`${BACKEND_API_URL}/products/${p._id}`, {
                                    method: 'PUT',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${authToken}`
                                    },
                                    body: JSON.stringify({
                                      name: p.name,
                                      price: p.price,
                                      oldPrice: p.oldPrice,
                                      grams: p.grams,
                                      supply: p.supply,
                                      imageUrl: p.imageUrl,
                                      videoUrl: p.videoUrl,
                                      features: p.features,
                                      monthlyInventory: updatedInventory
                                    })
                                  });
                                  const data = await res.json();
                                  if (data.success) {
                                    alert('Inventory Calendar successfully updated and saved for ' + p.name);
                                    fetchProducts();
                                  } else {
                                    alert('Error saving calendar: ' + data.error);
                                  }
                                } catch (err) {
                                  alert('Network connection error: ' + err.message);
                                }
                              }}
                            >
                              💾 Save Inventory Calendar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}</>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          FOOTER (RENDERS ON ALL VIEWS)
      ══════════════════════════════════════ */}
      <footer style={{ background: '#ffffff', color: '#0D2417', padding: '64px 24px 32px', borderTop: '1px solid rgba(13,36,23,0.08)', fontFamily: 'Inter, sans-serif' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
          
          {/* Main Footer Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            
            {/* Column 1: Logo & Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <img src="/logo.png" alt="APASYA" style={{ height: '48px', width: 'auto', alignSelf: 'flex-start' }} />
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(13,36,23,0.7)', margin: 0 }}>
                No 16-1 and 17-2, Vaishnavi Tech Park,<br />
                Ambalipura Village, Varthur Hobli, Varthur,<br />
                Bengaluru, Karnataka 560103
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#B87333', textDecoration: 'none', fontWeight: 600 }}>✉️ {CONTACT_EMAIL}</a>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', margin: 0, textTransform: 'uppercase', color: '#0D2417' }}>QUICK NAVIGATION</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
                <a href="#my-account" onClick={(e) => { e.preventDefault(); setAuthTab('login'); setIsAuthOpen(true); }} style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(13,36,23,0.7)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#B87333'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(13,36,23,0.7)'}>MY ACCOUNT</a>
                <a href="#why-apasya" onClick={(e) => { e.preventDefault(); setActiveView('home'); setTimeout(() => document.getElementById('why-apasya')?.scrollIntoView({ behavior: 'smooth' }), 100); }} style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(13,36,23,0.7)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#B87333'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(13,36,23,0.7)'}>ABOUT US (THE DIFFERENCE)</a>
                <a href="#faq" onClick={(e) => { e.preventDefault(); setActiveView('home'); setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 100); }} style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(13,36,23,0.7)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#B87333'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(13,36,23,0.7)'}>FAQS & ANSWERS</a>
                <a href="#contact-us" onClick={(e) => { e.preventDefault(); setActiveView('home'); setTimeout(() => document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth' }), 100); }} style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(13,36,23,0.7)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#B87333'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(13,36,23,0.7)'}>CONTACT US</a>
              </div>
            </div>

            {/* Column 3: Newsletter & Social */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', margin: 0, textTransform: 'uppercase', color: '#0D2417' }}>JOIN OUR MAILING LIST</h4>
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(13,36,23,0.15)', paddingBottom: '8px' }}>
                  <input type="email" placeholder="Enter Email" style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0D2417', fontSize: '14px', width: '100%', padding: '4px 0' }} />
                  <button style={{ background: 'transparent', border: 'none', color: '#B87333', cursor: 'pointer', padding: '0 8px' }}>→</button>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', margin: 0, textTransform: 'uppercase', color: '#0D2417' }}>FOLLOW US</h4>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {['instagram', 'facebook'].map(platform => (
                    <a key={platform} href={platform === 'instagram' ? 'https://www.instagram.com/apasya_pahadi_shilajit?igsh=Yjd0ajJmNmdiMmRv&utm_source=qr' : `https://${platform}.com`} target="_blank" rel="noreferrer" style={{ color: 'rgba(13,36,23,0.6)', transition: 'color 0.2s' }}>
                      {platform === 'instagram' && (
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      )}
                      {platform === 'facebook' && (
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Policy Links */}
          <div style={{ borderTop: '1px solid rgba(13,36,23,0.08)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px', fontSize: '12px', color: 'rgba(13,36,23,0.5)' }}>
            <div>© {new Date().getFullYear()} APASYA Pure Satpura Shilajit. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <button onClick={() => { setActiveView('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'transparent', border: 'none', color: 'rgba(13,36,23,0.6)', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#B87333'} onMouseLeave={e => e.target.style.color = 'rgba(13,36,23,0.6)'}>Privacy Policy</button>
              <button onClick={() => { setActiveView('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'transparent', border: 'none', color: 'rgba(13,36,23,0.6)', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#B87333'} onMouseLeave={e => e.target.style.color = 'rgba(13,36,23,0.6)'}>Terms & Conditions</button>
              <button onClick={() => { setActiveView('shipping'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'transparent', border: 'none', color: 'rgba(13,36,23,0.6)', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#B87333'} onMouseLeave={e => e.target.style.color = 'rgba(13,36,23,0.6)'}>Shipping Policy</button>
              <button onClick={() => { setActiveView('cancellation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'transparent', border: 'none', color: 'rgba(13,36,23,0.6)', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#B87333'} onMouseLeave={e => e.target.style.color = 'rgba(13,36,23,0.6)'}>Cancellation Policy</button>
            </div>
          </div>

        </div>
      </footer>


      {/* ══════════════════════════════════════
          STICKY MOBILE CTA BAR (RENDERS ONLY ON HOME)
      ══════════════════════════════════════ */}
      {activeView === 'home' && (
        <div 
          className="sticky-cta"
          style={{
            transform: scrolledPast ? 'translateY(0)' : 'translateY(100%)',
            opacity: scrolledPast ? 1 : 0,
            pointerEvents: scrolledPast ? 'auto' : 'none',
            transition: 'transform 0.35s ease, opacity 0.35s ease'
          }}
        >
          <div className="sticky-cta__inner">
            <div style={{ flexShrink: 0 }}>
              <div className="sticky-cta__price">₹{products[0]?.price || '999'}</div>
              <div className="sticky-cta__sub">Starter · COD Available</div>
            </div>
            <button 
              onClick={() => addToCart(products[0])}
              className="btn btn--gold" 
              style={{ flex: 1, fontSize: 14, padding: '10px 16px', textTransform: 'uppercase', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Add to Cart: COD Available
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          CHECKOUT MODAL
      ══════════════════════════════════════ */}
      {isCheckoutOpen && (
        <div className="modal-backdrop">
          <div className="checkout-modal">
            <button className="checkout-modal__close-btn" onClick={closeCheckout} aria-label="Close modal">×</button>
            
            {paymentResult === 'verifying' && (
              <div className="payment-status-card">
                <div className="spinner"></div>
                <h3 className="h3" style={{ margin: '12px 0 6px' }}>Verifying Payment</h3>
                <p className="body-text" style={{ textAlign: 'center' }}>
                  Please wait while we verify your transaction status with PhonePe. Do not refresh or close this window.
                </p>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10 }}>Transaction ID: {verifyingTxnId}</p>
              </div>
            )}

            {paymentResult === 'success' && (
              <div className="payment-status-card">
                <div className="status-icon status-icon--success">✓</div>
                <h3 className="h3" style={{ color: 'var(--green2)', margin: '12px 0 6px' }}>Order Confirmed! 🎉</h3>
                <p className="body-text" style={{ textAlign: 'center', marginBottom: 20 }}>
                  Thank you! Your payment for <strong>{selectedProduct?.name || 'Pahadi Shilajit'}</strong> was processed successfully. 
                  Redirecting to your orders dashboard to track fulfillment live...
                </p>
              </div>
            )}

            {paymentResult === 'failed' && (
              <div className="payment-status-card">
                <div className="status-icon status-icon--failed">✕</div>
                <h3 className="h3" style={{ color: '#ef4444', margin: '12px 0 6px' }}>Payment Failed</h3>
                <p className="body-text" style={{ textAlign: 'center', marginBottom: 20 }}>
                  We couldn't verify your payment. If your account was debited, the amount will be refunded automatically by your bank within 3-5 business days. Please try placing your order again.
                </p>
                <button className="btn btn--outline" onClick={() => setPaymentResult(null)} style={{ width: '100%', marginBottom: 12 }}>
                  Retry Checkout
                </button>
                <a href={CONTACT_LINK} className="btn btn--phone" style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  Order via Email Instead
                </a>
              </div>
            )}

            {!paymentResult && selectedProduct && (
              <div>
                <div className="checkout-modal__header">
                  <h3 className="h3" style={{ marginBottom: 4 }}>Secure Checkout</h3>
                  <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                    Complete your order Any Time
                  </p>
                </div>

                <div className="checkout-modal__summary" style={{ maxHeight: '180px', overflowY: 'auto', padding: '12px', background: 'var(--warm)', borderRadius: '8px', marginBottom: '16px' }}>
                  {cart.length > 0 && selectedProduct._id === 'cart_checkout' ? (
                    cart.map(item => (
                      <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 13, borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: 6 }}>
                        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{item.name} ({item.grams}) <span style={{ color: 'var(--gold)', marginLeft: 4 }}>x{item.quantity}</span></span>
                        <span style={{ fontWeight: 700, color: 'var(--gold2)' }}>₹{item.price * item.quantity}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{selectedProduct.name} ({selectedProduct.grams})</span>
                      <span style={{ fontWeight: 700, color: 'var(--gold2)' }}>₹{selectedProduct.price}</span>
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>🚚 Includes Free Express Shipping & GST</span>
                    <span style={{ color: 'var(--gold)', fontSize: 14 }}>Total: ₹{selectedProduct.price}</span>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="checkout-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-input ${formErrors.name ? 'form-input--error' : ''}`}
                      placeholder="Enter your full name"
                      value={formFields.name}
                      onChange={handleInputChange}
                    />
                    {formErrors.name && <span className="form-error-msg">{formErrors.name}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone1">Phone Number</label>
                      <input
                        type="tel"
                        id="phone1"
                        name="phone1"
                        className={`form-input ${formErrors.phone1 ? 'form-input--error' : ''}`}
                        placeholder="10-digit mobile number"
                        value={formFields.phone1}
                        onChange={handleInputChange}
                      />
                      {formErrors.phone1 && <span className="form-error-msg">{formErrors.phone1}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="phone2">Alternate Phone (Optional)</label>
                      <input
                        type="tel"
                        id="phone2"
                        name="phone2"
                        className={`form-input ${formErrors.phone2 ? 'form-input--error' : ''}`}
                        placeholder="Backup number"
                        value={formFields.phone2}
                        onChange={handleInputChange}
                      />
                      {formErrors.phone2 && <span className="form-error-msg">{formErrors.phone2}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="address">Full Shipping Address</label>
                    <textarea
                      id="address"
                      name="address"
                      rows="2"
                      className={`form-input ${formErrors.address ? 'form-input--error' : ''}`}
                      placeholder="House No, Street Name, Area, Landmark"
                      value={formFields.address}
                      onChange={handleInputChange}
                    ></textarea>
                    {formErrors.address && <span className="form-error-msg">{formErrors.address}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="pincode">Pincode</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        className={`form-input ${formErrors.pincode ? 'form-input--error' : ''}`}
                        placeholder="6-digit pincode"
                        value={formFields.pincode}
                        onChange={handleInputChange}
                      />
                      {formErrors.pincode && <span className="form-error-msg">{formErrors.pincode}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="state">State</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        className={`form-input ${formErrors.state ? 'form-input--error' : ''}`}
                        placeholder="State"
                        value={formFields.state}
                        onChange={handleInputChange}
                      />
                      {formErrors.state && <span className="form-error-msg">{formErrors.state}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      className={`form-input ${formErrors.country ? 'form-input--error' : ''}`}
                      placeholder="Country"
                      value={formFields.country}
                      onChange={handleInputChange}
                    />
                    {formErrors.country && <span className="form-error-msg">{formErrors.country}</span>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn--gold"
                    style={{ width: '100%', marginTop: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, border: 'none', cursor: 'pointer' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mini-spinner"></span>
                        Initiating Payment...
                      </>
                    ) : (
                      <>
                        Pay ₹{selectedProduct.price} via PhonePe
                      </>
                    )}
                  </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: 'var(--muted)', marginTop: 16 }}>
                  <span>🔒 Secure SSL Encrypted Gateway</span>
                  <span style={{ color: 'var(--border)' }}>|</span>
                  <span>Powered by PhonePe</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          AUTHENTICATION MODAL
      ══════════════════════════════════════ */}
      {isAuthOpen && (
        <div className="modal-backdrop">
          <div className="auth-modal">
            <button className="checkout-modal__close-btn" onClick={() => setIsAuthOpen(false)} aria-label="Close modal">×</button>
            <div className="auth-modal__tabs">
              <button 
                className={`auth-modal__tab ${authTab === 'login' ? 'auth-modal__tab--active' : ''}`}
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
              >
                Sign In
              </button>
              <button 
                className={`auth-modal__tab ${authTab === 'signup' ? 'auth-modal__tab--active' : ''}`}
                onClick={() => { setAuthTab('signup'); setAuthError(''); }}
              >
                Sign Up
              </button>
            </div>
            
            {authError && <div className="auth-error-banner">{authError}</div>}
            
            <form onSubmit={handleAuthSubmit} className="checkout-form">
              {authTab === 'signup' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-name">Full Name</label>
                  <input
                    type="text"
                    id="auth-name"
                    className="form-input"
                    placeholder="Enter your name"
                    value={authForm.name}
                    onChange={e => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label" htmlFor="auth-email">Email Address</label>
                <input
                  type="email"
                  id="auth-email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={authForm.email}
                  onChange={e => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              {authTab === 'signup' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-phone">Phone Number</label>
                  <input
                    type="tel"
                    id="auth-phone"
                    className="form-input"
                    placeholder="10-digit phone number"
                    value={authForm.phone}
                    onChange={e => setAuthForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label" htmlFor="auth-password">Password</label>
                <input
                  type="password"
                  id="auth-password"
                  className="form-input"
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={e => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              
              <button type="submit" className="btn btn--gold" style={{ width: '100%', marginTop: 12, border: 'none', cursor: 'pointer' }}>
                {authTab === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0 16px', gap: '8px' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = '#f9fafb'}
                onMouseLeave={e => e.target.style.background = 'var(--white)'}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" style={{ display: 'block' }}>
                  <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 15.01 1 12 1 7.35 1 3.39 3.67 1.4 7.56l3.88 3C6.22 7.76 8.87 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2 3.7-5.01 3.7-8.62z" />
                  <path fill="#FBBC05" d="M5.28 14.56c-.25-.76-.39-1.57-.39-2.4 0-.83.14-1.64.39-2.4l-3.88-3C.54 8.24 0 10.06 0 12s.54 3.76 1.4 5.44l3.88-3z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.1.74-2.52 1.18-4.23 1.18-3.13 0-5.78-2.72-6.72-5.52l-3.88 3C3.39 20.33 7.35 23 12 23z" />
                </svg>
                {googleLoading ? 'Connecting...' : 'Continue with Google'}
              </button>

              {showGoogleInstructions && (
                <div style={{ marginTop: '20px', background: '#F5EDE0', border: '1px solid rgba(184,115,51,0.3)', borderRadius: '12px', padding: '16px', animation: 'fadeIn 0.3s ease' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 700, color: 'var(--gold2)' }}>Google OAuth Setup Guide</h4>
                  <p style={{ margin: '0 0 12px', fontSize: '12px', lineHeight: '1.5', color: 'var(--text)' }}>
                    To configure real Google Login in your project, complete these developer credentials steps:
                  </p>
                  <ol style={{ margin: '0 0 16px', paddingLeft: '20px', fontSize: '11px', lineHeight: '1.6', color: 'var(--text)' }}>
                    <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--gold2)', fontWeight: 600 }}>Google Cloud Console</a>.</li>
                    <li>Create a project, navigate to <strong>APIs & Services &gt; Credentials</strong>.</li>
                    <li>Click <strong>Create Credentials &gt; OAuth Client ID</strong> (Web Application).</li>
                    <li>Add <code>http://localhost:5173</code> to <strong>Authorized JavaScript origins</strong>.</li>
                    <li>Copy your <strong>Client ID</strong>.</li>
                    <li>Create a <code>.env</code> file in the <code>frontend/</code> root folder and add:<br />
                      <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: '4px', fontSize: '10px', wordBreak: 'break-all', display: 'inline-block', marginTop: '4px' }}>VITE_GOOGLE_CLIENT_ID=your_copied_client_id</code>
                    </li>
                    <li>In <code>backend/.env</code>, add:<br />
                      <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: '4px', fontSize: '10px', wordBreak: 'break-all', display: 'inline-block', marginTop: '4px' }}>GOOGLE_CLIENT_ID=your_copied_client_id</code>
                    </li>
                  </ol>
                  <button
                    type="button"
                    onClick={handleGoogleSandboxLogin}
                    style={{
                      width: '100%',
                      background: 'var(--gold)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.background = 'var(--gold2)'}
                    onMouseLeave={e => e.target.style.background = 'var(--gold)'}
                  >
                    Proceed with Sandbox Demo Login
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

      )}

      {/* ══════════════════════════════════════
          PROFILE DETAILS MODAL
      ══════════════════════════════════════ */}
      {isProfileOpen && currentUser && (
        <div className="modal-backdrop">
          <div className="auth-modal" style={{ maxWidth: 450 }}>
            <button className="checkout-modal__close-btn" onClick={() => setIsProfileOpen(false)} aria-label="Close modal">×</button>
            <div className="checkout-modal__header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 20 }}>
              <h3 className="h3" style={{ marginBottom: 4 }}>My Profile</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>Your registered account details</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--warm)', padding: 16, borderRadius: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'white', fontWeight: 600 }}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>{currentUser.name}</h4>
                  <span style={{ fontSize: 10, background: 'var(--gold)', color: 'white', padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase', fontWeight: 600, display: 'inline-block', marginTop: 4 }}>
                    {currentUser.role} Account
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px 16px', fontSize: 14, color: 'var(--text)' }}>
                <strong style={{ color: 'var(--muted)' }}>Email:</strong>
                <span>{currentUser.email}</span>
                
                <strong style={{ color: 'var(--muted)' }}>Phone:</strong>
                <span>{currentUser.phone}</span>
                
                <strong style={{ color: 'var(--muted)' }}>Joined:</strong>
                <span>{new Date(currentUser.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          SHOPPING CART SIDE PANEL
      ══════════════════════════════════════ */}
      <div className={`cart-panel__backdrop ${isCartOpen ? 'cart-panel__backdrop--open' : ''}`} onClick={() => setIsCartOpen(false)} />
      <div className={`cart-panel ${isCartOpen ? 'cart-panel--open' : ''}`}>
        <div className="cart-panel__header">
          <h3 className="h3" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--gold)" /> Your Cart
          </h3>
          <button className="cart-panel__close-btn" onClick={() => setIsCartOpen(false)}>×</button>
        </div>
        
        <div className="cart-panel__body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={48} color="var(--border)" />
              <p style={{ fontSize: 16, fontWeight: 500 }}>Your cart is empty</p>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>Add some original Pahadi Shilajit to begin your health transformation!</p>
              <button className="btn btn--gold" style={{ display: 'inline-block', width: 'auto', marginTop: 12, border: 'none', cursor: 'pointer' }} onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.imageUrl || '/shilajit_jar_mockup.png'} alt={item.name} className="cart-item__img" />
                <div className="cart-item__details">
                  <div>
                    <div className="cart-item__name">{item.name}</div>
                    <div className="cart-item__meta">{item.grams} · {item.supply}</div>
                  </div>
                  
                  <div className="cart-item__actions">
                    <div className="cart-qty-selector">
                      <button className="cart-qty-btn" onClick={() => updateCartQuantity(item._id, -1)}>-</button>
                      <span className="cart-qty-val">{item.quantity}</span>
                      <button className="cart-qty-btn" onClick={() => updateCartQuantity(item._id, 1)}>+</button>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="cart-item__price">₹{item.price * item.quantity}</span>
                      <button className="cart-item__remove" onClick={() => removeFromCart(item._id)}>Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cart-panel__footer">
            <div className="cart-summary-row">
              <span>Items Subtotal</span>
              <span>₹{getCartTotal()}</span>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>Grand Total</span>
              <span>₹{getCartTotal()}</span>
            </div>
            
            <button 
              onClick={() => {
                setIsCartOpen(false);
                // Open checkout with combined cart data
                openCheckout({
                  _id: 'cart_checkout',
                  name: cart.map(item => `${item.name} x${item.quantity}`).join(' + '),
                  price: getCartTotal(),
                  grams: cart.map(item => `${item.grams} (x${item.quantity})`).join(', '),
                  supply: cart.map(item => `${item.supply} (x${item.quantity})`).join(', ')
                });
              }}
              className="btn btn--gold" 
              style={{ width: '100%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
