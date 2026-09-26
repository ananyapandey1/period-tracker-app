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

export type ProductCategory =
  | 'Period Care'
  | 'Cramp Relief'
  | 'Intimate Hygiene'
  | 'Maternity'
  | 'Skin Care'
  | 'Bundles & Kits'

export interface ProductItem {
  id: number
  category: ProductCategory
  categorySlug: 'period-care' | 'cramp-relief' | 'intimate-hygiene' | 'maternity' | 'skincare' | 'bundles'
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
  isRewardsOpen: boolean
  setIsRewardsOpen: (open: boolean) => void
  isProfileOpen: boolean
  setIsProfileOpen: (open: boolean) => void
  selectedArticle: ArticleItem | null
  setSelectedArticle: (article: ArticleItem | null) => void
  lastPeriodStartDate: Date
  setLastPeriodStartDate: (date: Date) => void
  restartOnboarding: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const PRODUCTS: ProductItem[] = [
  // --- Category 1: Period Care & Flow Management (period-care) ---
  {
    id: 1,
    category: 'Period Care',
    categorySlug: 'period-care',
    name: 'Complete Comfort Sanitary Pads',
    sub: 'Customizable sizes: L, XL, XXL / XL+ with individual disposal covers',
    price: 349,
    priceFormatted: '₹349',
    unit: 'pack of 12',
    badge: 'Customizable Sizes • Rash-Free',
    badgeColor: '#e75650',
    color: '#F2D5D0',
    emoji: '🌸',
    description: 'Ultra-thin, wider back design with 100% organic cotton top sheet. Choose your mix of Heavy, Medium, and Light pads with individual biodegradable disposal covers.',
    rating: 4.9,
  },
  {
    id: 2,
    category: 'Period Care',
    categorySlug: 'period-care',
    name: 'All Night Comfort Pads',
    sub: 'Overnight coverage / XXXL 400 mm',
    price: 379,
    priceFormatted: '₹379',
    unit: 'pack of 10',
    badge: 'Heavy Flow / Night',
    badgeColor: '#c43a35',
    color: '#E8D0C8',
    emoji: '🌙',
    description: 'Extra-long 400 mm night pads with double absorbent core and extra-wide back wing to prevent side and back staining in any sleeping position.',
    rating: 4.9,
  },
  {
    id: 3,
    category: 'Period Care',
    categorySlug: 'period-care',
    name: 'Comfort Period Panties',
    sub: '360° leak-proof disposable panties (Sizes XS to XXL)',
    price: 399,
    priceFormatted: '₹399',
    unit: 'pack of 2',
    badge: '360° Protection',
    badgeColor: '#e75650',
    color: '#FDF0E8',
    emoji: '🩲',
    description: 'Seamless 360-degree super absorbent disposable period underwear. Feels just like regular cotton underwear with full front-to-back leak-proof containment.',
    rating: 4.8,
  },
  {
    id: 4,
    category: 'Period Care',
    categorySlug: 'period-care',
    name: 'Everyday Comfort Panty Liners',
    sub: 'Ultra-thin daily discharge protection (Regular & Large)',
    price: 249,
    priceFormatted: '₹249',
    unit: 'pack of 30',
    badge: 'Daily Freshness',
    badgeColor: '#A8C5B5',
    color: '#EDF5F0',
    emoji: '☁️',
    description: 'Breathable, ultra-soft cottony panty liners crafted for everyday freshness, spotting, and ovulatory cervical fluid protection.',
    rating: 4.7,
  },
  {
    id: 5,
    category: 'Period Care',
    categorySlug: 'period-care',
    name: 'Ultra-Safe Menstrual Cup',
    sub: 'Medical-grade platinum silicone with antibacterial pouch (Sizes S, M, L)',
    price: 599,
    priceFormatted: '₹599',
    unit: '1 cup + pouch',
    badge: 'Reusable • Up to 8 Hours',
    badgeColor: '#2A9D8F',
    color: '#E8F0EC',
    emoji: '🍷',
    description: '100% medical-grade platinum cured silicone cup designed with velvety-soft texture, leak-proof rim, and breathable cotton storage pouch.',
    rating: 4.9,
  },

  // --- Category 2: Cramp Relief & Wellness (cramp-relief) ---
  {
    id: 6,
    category: 'Cramp Relief',
    categorySlug: 'cramp-relief',
    name: 'Cramp Comfort Heat Patches',
    sub: '100% natural, air-activated self-heating patches for up to 8 hours of relief',
    price: 299,
    priceFormatted: '₹299',
    unit: 'pack of 3',
    badge: 'Air-Activated • Up to 8h',
    badgeColor: '#e75650',
    color: '#FDF0E8',
    emoji: '🔥',
    description: 'Air-activated warm patches that soothe uterine contractions and lower-back cramps with sustained ~40°C therapeutic warmth for up to 8 hours.',
    rating: 4.9,
  },
  {
    id: 7,
    category: 'Cramp Relief',
    categorySlug: 'cramp-relief',
    name: 'Cramp Relief Roll-On',
    sub: '100% natural essential-oil herbal pain-relief blend',
    price: 349,
    priceFormatted: '₹349',
    unit: '10 ml',
    badge: 'Fast Acting • Herbal',
    badgeColor: '#A8C5B5',
    color: '#EDF5F0',
    emoji: '✨',
    description: 'Fast-absorbing botanical roll-on infused with eucalyptus, lavender, rosemary, and wintergreen oils for instant cooling and anti-spasmodic comfort.',
    rating: 4.8,
  },
  {
    id: 8,
    category: 'Cramp Relief',
    categorySlug: 'cramp-relief',
    name: 'Period Pain Relief Drink Mix / Uplift',
    sub: 'Lemon-flavoured drink mix formulated to ease period fatigue and cramps',
    price: 449,
    priceFormatted: '₹449',
    unit: 'pack of 10 sachets',
    badge: 'Hydration & Relief',
    badgeColor: '#D97706',
    color: '#FFF8E8',
    emoji: '🍋',
    description: 'Refreshing lemon drink mix powered by magnesium glycinate, ginger extract, vitamin B6, and electrolytes to combat menstrual lethargy and muscular cramps.',
    rating: 4.8,
  },
  {
    id: 9,
    category: 'Cramp Relief',
    categorySlug: 'cramp-relief',
    name: 'Balance Essential Oil Roll-On',
    sub: 'Aromatherapy blend for PMS mood shifts and relaxation',
    price: 349,
    priceFormatted: '₹349',
    unit: '10 ml',
    badge: 'Aromatherapy • PMS Calm',
    badgeColor: '#C4A5C8',
    color: '#F9EFFA',
    emoji: '🌿',
    description: 'Therapeutic pulse-point aromatherapy blend of clary sage, bergamot, and Roman chamomile to calm luteal mood swings, restlessness, and anxiety.',
    rating: 4.7,
  },

  // --- Category 3: Intimate Hygiene (intimate-hygiene) ---
  {
    id: 10,
    category: 'Intimate Hygiene',
    categorySlug: 'intimate-hygiene',
    name: 'Foaming Intimate Wash',
    sub: 'pH 3.5 balanced, gentle daily intimate cleansing',
    price: 349,
    priceFormatted: '₹349',
    unit: '150 ml',
    badge: 'pH 3.5 Balanced',
    badgeColor: '#2A9D8F',
    color: '#F0F9F5',
    emoji: '🫧',
    description: 'Formulated with lactic acid and soothing chamomile to maintain natural vaginal microflora, prevent odor, and protect against irritation.',
    rating: 4.9,
  },
  {
    id: 11,
    category: 'Intimate Hygiene',
    categorySlug: 'intimate-hygiene',
    name: 'Gentle Intimate Wipes',
    sub: 'Biodegradable, soothing on-the-go cleansing wipes',
    price: 199,
    priceFormatted: '₹199',
    unit: 'pack of 20',
    badge: 'Biodegradable • Soothing',
    badgeColor: '#A8C5B5',
    color: '#EAF3ED',
    emoji: '🌱',
    description: '100% biodegradable natural viscose wipes infused with aloe vera and tea tree oil for instant on-the-go freshness during periods and workouts.',
    rating: 4.7,
  },

  // --- Category 4: Maternity & Postpartum Care (maternity) ---
  {
    id: 12,
    category: 'Maternity',
    categorySlug: 'maternity',
    name: 'Maternity Comfort Pads',
    sub: 'Heavy-flow XXXL 400 mm postpartum pads',
    price: 449,
    priceFormatted: '₹449',
    unit: 'pack of 10',
    badge: 'Postpartum Care',
    badgeColor: '#c43a35',
    color: '#F8EAE7',
    emoji: '👶',
    description: 'Extra-cushioned postpartum lochia pads with rapid lock core and ultra-absorbent capacity tailored specifically for new mothers after delivery.',
    rating: 4.9,
  },
  {
    id: 13,
    category: 'Maternity',
    categorySlug: 'maternity',
    name: 'Comfort Maternity Panties',
    sub: 'Disposable postpartum underwear designed for post-delivery recovery',
    price: 499,
    priceFormatted: '₹499',
    unit: 'pack of 3',
    badge: 'Recovery Comfort',
    badgeColor: '#D97706',
    color: '#FFF3E8',
    emoji: '🤰',
    description: 'High-waisted, stretchable postpartum disposable underwear designed to provide gentle abdominal support without aggravating C-section incisions.',
    rating: 4.9,
  },
  {
    id: 14,
    category: 'Maternity',
    categorySlug: 'maternity',
    name: 'New Mom Essentials Kit',
    sub: 'Curated combination of maternity pads, disposable panties, and hygiene items',
    price: 1299,
    priceFormatted: '₹1,299',
    unit: 'complete kit',
    badge: 'Complete Care Kit',
    badgeColor: '#e75650',
    color: '#FDEAE4',
    emoji: '🎁',
    description: 'A thoughtfully curated hospital bag bundle: Maternity pads, disposable underwear, foaming wash, and gentle bamboo wipes to ensure seamless postpartum recovery.',
    rating: 5.0,
  },

  // --- Category 5: Acne & Skin Care (skincare) ---
  {
    id: 15,
    category: 'Skin Care',
    categorySlug: 'skincare',
    name: 'Pore Cleansing Face Wash',
    sub: 'Salicylic acid + Glycolic acid + Prebiotics foaming cleanser',
    price: 399,
    priceFormatted: '₹399',
    unit: '120 ml',
    badge: 'AHA + BHA Cleanser',
    badgeColor: '#2A9D8F',
    color: '#E8F5F0',
    emoji: '🧼',
    description: 'Gentle exfoliating foaming cleanser targeting hormonal sebum buildup, clogged pores, and blackheads without stripping natural moisture.',
    rating: 4.8,
  },
  {
    id: 16,
    category: 'Skin Care',
    categorySlug: 'skincare',
    name: 'Oil-Free Gel Moisturizer',
    sub: 'Hydrating formula with Niacinamide + Ceramides',
    price: 449,
    priceFormatted: '₹449',
    unit: '50 g',
    badge: 'Barrier Support',
    badgeColor: '#A8C5B5',
    color: '#EDF7F2',
    emoji: '💧',
    description: 'Weightless water-gel cream with 2% Niacinamide and 5 essential ceramides to repair the skin barrier and balance post-ovulation oiliness.',
    rating: 4.8,
  },
  {
    id: 17,
    category: 'Skin Care',
    categorySlug: 'skincare',
    name: 'Acne Healing / Pimple Patch',
    sub: 'Hydrocolloid patches for active acne and blemish treatment',
    price: 299,
    priceFormatted: '₹299',
    unit: 'pack of 24',
    badge: 'Hydrocolloid • Invisible',
    badgeColor: '#D97706',
    color: '#FEF6E8',
    emoji: '🩹',
    description: 'Ultra-thin, nearly invisible hydrocolloid patches that absorb pus and impurities overnight while shielding hormonal breakouts from bacteria and picking.',
    rating: 4.9,
  },
  {
    id: 18,
    category: 'Skin Care',
    categorySlug: 'skincare',
    name: 'Dark Spot Corrector Serum',
    sub: 'Niacinamide + Tranexamic acid brightening serum',
    price: 549,
    priceFormatted: '₹549',
    unit: '30 ml',
    badge: 'Brightening Formula',
    badgeColor: '#C4A5C8',
    color: '#F9EFFA',
    emoji: '✨',
    description: 'Targeted serum with 3% Tranexamic acid and 5% Niacinamide to fade stubborn post-acne dark marks, hyperpigmentation, and sun spots.',
    rating: 4.8,
  },

  // --- Category 6: Popular Bundles & Kits (bundles) ---
  {
    id: 19,
    category: 'Bundles & Kits',
    categorySlug: 'bundles',
    name: 'Day & Night Sanitary Pads Combo',
    sub: 'Complete 24-hour protection set with daytime and overnight pads',
    price: 649,
    priceFormatted: '₹649',
    unit: 'pack of 22 pads',
    badge: 'Value Pack',
    badgeColor: '#e75650',
    color: '#F2D5D0',
    emoji: '📦',
    description: '12 Regular Day Pads + 10 XXXL Overnight Pads for complete round-the-clock comfort and security throughout your heaviest days.',
    rating: 4.9,
  },
  {
    id: 20,
    category: 'Bundles & Kits',
    categorySlug: 'bundles',
    name: 'Period Essentials Combo',
    sub: 'Sanitary Pads + Cramp Patches + Pimple Patches',
    price: 799,
    priceFormatted: '₹799',
    unit: '3-in-1 combo',
    badge: 'Bestseller Kit',
    badgeColor: '#c43a35',
    color: '#FADED9',
    emoji: '🌸',
    description: 'Our #1 rated period survival set: 12 Ultra-Thin Pads, 3 Cramp Comfort heat patches, and 24 Acne Healing patches for complete period wellness.',
    rating: 5.0,
  },
  {
    id: 21,
    category: 'Bundles & Kits',
    categorySlug: 'bundles',
    name: 'Comfort & Care Duo',
    sub: 'Sanitary Pads + Cramp Comfort Heat Patch',
    price: 599,
    priceFormatted: '₹599',
    unit: 'duo pack',
    badge: 'Everyday Duo',
    badgeColor: '#D97706',
    color: '#FEEFE6',
    emoji: '💖',
    description: 'The classic soothing pair: Rash-free organic cotton pads accompanied by instant air-activated soothing warmth for cramp relief.',
    rating: 4.8,
  },
  {
    id: 22,
    category: 'Bundles & Kits',
    categorySlug: 'bundles',
    name: 'Ultimate Cramp Relief Combo',
    sub: 'Cramp Comfort Heat Patches + Cramp Relief Roll-On',
    price: 599,
    priceFormatted: '₹599',
    unit: 'pain relief duo',
    badge: 'Max Relief',
    badgeColor: '#c43a35',
    color: '#FCE7E4',
    emoji: '🔥',
    description: 'Double-action cramp relief: Use the cooling herbal roll-on for instant anti-spasmodic action, and follow with heat patches for 8 hours of warmth.',
    rating: 4.9,
  },
  {
    id: 23,
    category: 'Bundles & Kits',
    categorySlug: 'bundles',
    name: 'Daily Clear Skin Essentials Kit',
    sub: 'Pore Cleansing Face Wash + Oil-Free Gel Moisturizer',
    price: 749,
    priceFormatted: '₹749',
    unit: '2-step regimen',
    badge: 'Daily Glow Set',
    badgeColor: '#2A9D8F',
    color: '#E6F4EE',
    emoji: '✨',
    description: 'A 2-step barrier-friendly daily regimen formulated to cleanse congested pores and hydrate with ceramides without triggering hormonal breakouts.',
    rating: 4.9,
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
  const [isRewardsOpen, setIsRewardsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null)
  const [lastPeriodStartDate, setLastPeriodStartDate] = useState<Date>(new Date(2026, 8, 1))

  const restartOnboarding = () => {
    setIsProfileOpen(true)
  }

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
        isRewardsOpen,
        setIsRewardsOpen,
        isProfileOpen,
        setIsProfileOpen,
        selectedArticle,
        setSelectedArticle,
        lastPeriodStartDate,
        setLastPeriodStartDate,
        restartOnboarding,
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
