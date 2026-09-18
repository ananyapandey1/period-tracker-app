import React, { createContext, useContext, useState } from 'react'

export interface LogEntry {
  date: string // e.g. "2026-09-17"
  flow: string | null
  pain: string | null
  physical: string[]
  emotional: string[]
  energy: string | null
  sleep: string | null
  notes: string
}

export interface ProductItem {
  id: number
  category: 'Sanitary Pads' | 'Cramps & Pain Management' | 'Intimate Care' | 'Skincare & Wellness'
  name: string
  sub: string
  price: number // numeric in INR
  priceFormatted: string
  unit: string
  badge: string | null
  badgeColor: string
  color: string
  emoji: string
  imageUrl?: string
  description: string
  rating: number
}

export interface CartItem {
  product: ProductItem
  quantity: number
}

export interface ArticleItem {
  id: string
  title: string
  category: 'Menstrual Health' | 'Sexual Wellness' | 'Menstrual Care Products'
  readTime: string
  author: string
  subtitle: string
  imageBg: string
  emoji: string
  summary: string
  content: string[]
  takeaways: string[]
}

interface AppContextType {
  activeTab: 'home' | 'calendar' | 'log' | 'insights' | 'shop'
  setActiveTab: (tab: 'home' | 'calendar' | 'log' | 'insights' | 'shop') => void
  selectedDate: string
  setSelectedDate: (date: string) => void
  logEntries: Record<string, LogEntry>
  saveLogEntry: (entry: LogEntry) => void
  cart: CartItem[]
  addToCart: (product: ProductItem) => void
  removeFromCart: (productId: number) => void
  updateCartQuantity: (productId: number, delta: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  toastMessage: string | null
  showToast: (msg: string) => void
  selectedProduct: ProductItem | null
  setSelectedProduct: (product: ProductItem | null) => void
  isChatOpen: boolean
  setIsChatOpen: (open: boolean) => void
  selectedArticle: ArticleItem | null
  setSelectedArticle: (article: ArticleItem | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const PRODUCTS: ProductItem[] = [
  {
    id: 1,
    category: 'Sanitary Pads',
    name: 'Nua Ultra-Thin Pads',
    sub: 'Heavy flow day & night protection',
    price: 349,
    priceFormatted: '₹349',
    unit: 'pack of 12',
    badge: 'Best seller',
    badgeColor: '#e75650',
    color: '#F2D5D0',
    emoji: '🌸',
    description: 'Ultra-thin, wider back design with 100% organic cotton top sheet. Free of toxic chemicals and synthetic perfume.',
    rating: 4.9,
  },
  {
    id: 2,
    category: 'Sanitary Pads',
    name: 'Nua Cottony Soft Day Pads',
    sub: 'Rash-free regular flow comfort',
    price: 299,
    priceFormatted: '₹299',
    unit: 'pack of 12',
    badge: 'Soft touch',
    badgeColor: '#A8C5B5',
    color: '#E8F0EC',
    emoji: '🌿',
    description: 'Made with extra soft non-woven top sheet to prevent period rashes and chafing during active days.',
    rating: 4.8,
  },
  {
    id: 3,
    category: 'Cramps & Pain Management',
    name: 'Nua Cramp Comfort Patches',
    sub: 'Air-activated self-heating patch',
    price: 299,
    priceFormatted: '₹299',
    unit: 'pack of 3',
    badge: 'Nua pick',
    badgeColor: '#e75650',
    color: '#FDF0E8',
    emoji: '🔥',
    description: 'Provides 8+ hours of continuous 100% natural heat for fast relief from period cramps and lower back pain.',
    rating: 4.9,
  },
  {
    id: 4,
    category: 'Cramps & Pain Management',
    name: 'Nua Uplifting Cramp Roll-On',
    sub: 'Essential oil herbal blend',
    price: 399,
    priceFormatted: '₹399',
    unit: '10 ml',
    badge: 'Natural',
    badgeColor: '#A8C5B5',
    color: '#EDF5F0',
    emoji: '✨',
    description: 'Infused with lavender, peppermint, and eucalyptus oils to soothe abdominal tension and boost mood.',
    rating: 4.8,
  },
  {
    id: 5,
    category: 'Intimate Care',
    name: 'Nua Foaming Intimate Wash',
    sub: 'pH 4.5 balanced vulva wash',
    price: 349,
    priceFormatted: '₹349',
    unit: '150 ml',
    badge: 'pH 4.5',
    badgeColor: '#E8B87A',
    color: '#F5EDE8',
    emoji: '🫧',
    description: 'Lactic acid and tea tree oil formulation maintaining healthy vaginal microflora without harsh sulfates.',
    rating: 4.9,
  },
  {
    id: 6,
    category: 'Intimate Care',
    name: 'Nua Ultra-Soft Panty Liners',
    sub: 'Daily freshness & discharge protection',
    price: 249,
    priceFormatted: '₹249',
    unit: 'pack of 30',
    badge: 'Daily care',
    badgeColor: '#C4A5C8',
    color: '#F9EFFA',
    emoji: '☁️',
    description: 'Breathable, ultra-thin liners designed to keep you dry and comfortable between periods.',
    rating: 4.7,
  },
  {
    id: 7,
    category: 'Skincare & Wellness',
    name: 'Nua Balance Acne Gel',
    sub: 'Hormonal breakout spot treatment',
    price: 449,
    priceFormatted: '₹449',
    unit: '30 g',
    badge: 'New',
    badgeColor: '#e75650',
    color: '#FDF6E8',
    emoji: '💧',
    description: 'Salicylic acid + Niacinamide formula specifically targets luteal-phase hormonal acne and inflammation.',
    rating: 4.8,
  },
  {
    id: 8,
    category: 'Skincare & Wellness',
    name: 'Nua Multi-Nutrient Gummies',
    sub: 'Iron, B-Complex & Vitamin D3',
    price: 499,
    priceFormatted: '₹499',
    unit: '30 gummies',
    badge: 'Essential',
    badgeColor: '#A8C5B5',
    color: '#E8F5EE',
    emoji: '🍓',
    description: 'Delicious strawberry gummies formulated to replenish essential nutrients and reduce PMS fatigue.',
    rating: 4.8,
  },
]

export const ARTICLES: ArticleItem[] = [
  {
    id: 'luteal-phase-guide',
    title: 'Understanding Your Luteal Phase: Energy, Body & Mood',
    category: 'Menstrual Health',
    readTime: '4 min read',
    author: 'Dr. Ananya Sharma, Gynaecologist',
    subtitle: 'Why your energy shifts after ovulation and how to tune into your body’s signals.',
    imageBg: 'linear-gradient(135deg, #C4A5C8, #9D6DA3)',
    emoji: '🌙',
    summary: 'The luteal phase lasts roughly 12 to 14 days between ovulation and your next period. Progesterone takes center stage, prompting your body to slow down, build heat, and prepare for potential pregnancy.',
    content: [
      'During the luteal phase, the follicle that released your egg turns into the corpus luteum, which secretes progesterone. Progesterone increases your resting metabolic rate and body temperature, while also having a calming, sedative effect on the brain.',
      'As progesterone peaks around mid-phase and then drops right before your period, you may experience mood swings, food cravings, and mild fluid retention. This hormonal transition is completely natural.',
      'To support your body: focus on magnesium-rich foods (dark chocolate, leafy greens), stay hydrated to reduce bloating, and engage in gentle movement like yoga or slow strength training rather than high-intensity cardio.'
    ],
    takeaways: [
      'Prioritize 8+ hours of restful sleep as body temperature rises.',
      'Incorporate complex carbs (sweet potatoes, oats) to stabilize mood and energy.',
      'Use gentle heat therapy like Nua Cramp Comfort patches if pre-period backaches begin.'
    ]
  },
  {
    id: 'cramp-relief-methods',
    title: 'Managing Severe Period Cramps: Natural vs Targeted Relief',
    category: 'Menstrual Health',
    readTime: '5 min read',
    author: 'Nua Medical Advisory Board',
    subtitle: 'The science behind dysmenorrhea and effective ways to soothe uterine contractions.',
    imageBg: 'linear-gradient(135deg, #D4807A, #E75650)',
    emoji: '🔥',
    summary: 'Menstrual cramps occur when prostaglandins trigger uterine wall contractions to shed the endometrium. Higher levels of prostaglandins lead to more intense cramping.',
    content: [
      'Continuous heat application at 40°C is proven to relax uterine smooth muscle as effectively as OTC pain relievers. Air-activated heat patches stimulate cutaneous thermal receptors, blocking pain signals to the brain.',
      'Herbal topicals containing peppermint, eucalyptus, and lavender essential oils help increase local microcirculation when massaged gently into the lower abdomen.',
      'A light diet low in refined sugars and high in omega-3 fatty acids reduces overall systemic inflammation during period days.'
    ],
    takeaways: [
      'Apply heat patches directly to clothing over the lower abdomen.',
      'Stay consistent with hydration to reduce vascular constriction.',
      'Try pelvic tilt stretches to relieve lumbar spine pressure.'
    ]
  },
  {
    id: 'hormonal-libido-wellness',
    title: 'Hormonal Libido & Sexual Wellness Across Your Cycle',
    category: 'Sexual Wellness',
    readTime: '3 min read',
    author: 'Dr. Riya Sen, Sexual Health Specialist',
    subtitle: 'How estrogen and testosterone shape your desire from follicular phase to ovulation.',
    imageBg: 'linear-gradient(135deg, #E8B87A, #D97706)',
    emoji: '✨',
    summary: 'Your sex drive is not static — it naturally waxes and wanes along with shifting hormone levels across your 28-day cycle.',
    content: [
      'During the fertile ovulation window, high estrogen levels combined with a subtle peak in testosterone boost libido, natural lubrication, and overall stamina.',
      'In contrast, during the late luteal and menstrual phases, lower hormone levels may reduce spontaneous desire, making warm intimacy, relaxation, and pH-balanced self-care essential.',
      'Using pH 4.5 vulvar washes preserves natural protective lactobacilli, ensuring comfort and preventing post-intimacy irritation.'
    ],
    takeaways: [
      'Track your ovulation window to understand natural libido surges.',
      'Prioritize pH-balanced vulvar hygiene before and after intimacy.',
      'Communicate open body needs with your partner as hormones fluctuate.'
    ]
  },
  {
    id: 'pads-vs-cups-guide',
    title: 'Pads, Cups & Tampons: Finding Your Safe Period Match',
    category: 'Menstrual Care Products',
    readTime: '6 min read',
    author: 'Nua Product Research Team',
    subtitle: 'A breakdown of absorbency, organic materials, and toxic-free hygiene choices.',
    imageBg: 'linear-gradient(135deg, #A8C5B5, #2A9D8F)',
    emoji: '🌿',
    summary: 'Choosing the right period care product comes down to flow intensity, skin sensitivity, and personal lifestyle convenience.',
    content: [
      'Conventional pads often contain synthetic plastic top-sheets that trap moisture and cause heat-rashes. Organic cotton top-sheet pads offer high breathability and hypoallergenic soft protection.',
      'Menstrual cups made of 100% medical-grade silicone offer up to 12 hours of zero-waste protection, making them ideal for heavy flow days and active sports.',
      'Changing pads every 4 to 6 hours and using ultra-soft panty liners on light spotting days ensures optimal vulvar skin health.'
    ],
    takeaways: [
      'Look for toxin-free, bleach-free organic cotton pads for sensitive skin.',
      'Pair heavy pads with cramp relief patches for maximum period comfort.',
      'Clean reusable products thoroughly with warm water and fragrance-free soap.'
    ]
  }
]

const INITIAL_LOGS: Record<string, LogEntry> = {
  '2026-09-17': {
    date: '2026-09-17',
    flow: 'None',
    pain: 'Mild',
    physical: ['bloating', 'tired'],
    emotional: ['calm', 'sensitive'],
    energy: 'Moderate',
    sleep: '7-8 hrs',
    notes: 'Felt a bit bloated in the afternoon. Drank warm chamomile tea.',
  },
  '2026-09-01': {
    date: '2026-09-01',
    flow: 'Heavy',
    pain: 'Moderate',
    physical: ['cramps', 'backpain', 'tired'],
    emotional: ['sensitive'],
    energy: 'Low',
    sleep: '6-7 hrs',
    notes: 'First day of period. Used Nua heat patch.',
  },
}

import { getTodayDateString } from '../utils/dateUtils'

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'log' | 'insights' | 'shop'>('home')
  const [selectedDate, setSelectedDate] = useState(getTodayDateString())
  const [logEntries, setLogEntries] = useState<Record<string, LogEntry>>(INITIAL_LOGS)
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 1 },
    { product: PRODUCTS[2], quantity: 1 },
  ])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev))
    }, 3000)
  }

  const saveLogEntry = (entry: LogEntry) => {
    setLogEntries(prev => ({
      ...prev,
      [entry.date]: entry,
    }))
    showToast(`Saved log for ${entry.date}`)
  }

  const addToCart = (product: ProductItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    showToast(`Added ${product.name} to cart`)
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateCartQuantity = (productId: number, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        logEntries,
        saveLogEntry,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
        showToast,
        selectedProduct,
        setSelectedProduct,
        isChatOpen,
        setIsChatOpen,
        selectedArticle,
        setSelectedArticle,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
