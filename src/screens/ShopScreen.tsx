import { useState } from 'react'
import { useApp, PRODUCTS, ProductCategory } from '../context/AppContext'
import { getCycleState } from '../utils/cycleEngine'
import { getTodayDateString } from '../utils/dateUtils'
import { getShopRecommendations } from '../utils/shopRecommendations'

const NUA_CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Period Care',
  'Cramp Relief',
  'Intimate Hygiene',
  'Maternity',
  'Skin Care',
  'Bundles & Kits',
]

export default function ShopScreen() {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    setIsCartOpen,
    setSelectedProduct,
    lastPeriodStartDate,
    logEntries,
    selectedDate,
  } = useApp()

  const [activeCategory, setActiveCategory] = useState<'All' | ProductCategory>('All')

  // Dynamic cycle and symptom inputs for Just for you rail
  const cycleState = getCycleState(lastPeriodStartDate)
  const currentPhase = cycleState.phase.name
  const cycleDay = cycleState.currentCycleDay
  const todayKey = getTodayDateString()
  const todayLogs = logEntries[todayKey] || logEntries[selectedDate] || null

  const recommendations = getShopRecommendations({
    currentPhase,
    cycleDay,
    todayLogs,
    cartItems: cart,
  })

  const filtered = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#FDF6F0' }}>
      
      {/* Header */}
      <div style={{ padding: '8px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: '#B89AA8' }}>Nua Wellness Catalog</p>
          <h2 style={{ margin: '2px 0 0', fontSize: 22, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400, color: '#2D1820' }}>
            Nua Shop
          </h2>
        </div>

        {/* Cart Icon Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          aria-label="View shopping cart"
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            marginBottom: 4,
            minWidth: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 2L3 6V20C3 20.55 3.45 21 4 21H20C20.55 21 21 20.55 21 20V6L18 2H6Z" stroke="#2D1820" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M3 6H21" stroke="#2D1820" strokeWidth="1.5" />
            <path d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10" stroke="#2D1820" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {totalCartCount > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#e75650',
                color: 'white',
                fontSize: 10,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(231,86,80,0.4)',
              }}
            >
              {totalCartCount}
            </div>
          )}
        </button>
      </div>

      {/* Nua Brand Banner */}
      <div style={{ padding: '14px 24px 0' }}>
        <div
          onClick={() => setIsCartOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #F7E7E2, #F2DCD5)',
            borderRadius: 18,
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            border: '1px solid #EAD2CA',
            boxShadow: '0 4px 16px rgba(45,24,32,0.04)',
          }}
        >
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 10, color: '#7A4F5C', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              NUA EXCLUSIVE
            </p>
            <p style={{ margin: '0 0 8px', fontSize: 16, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, color: '#2D2327', lineHeight: 1.25 }}>
              Free shipping on<br />orders over ₹499
            </p>
            <div
              style={{
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid #DFCCC5',
                borderRadius: 20,
                padding: '4px 12px',
                display: 'inline-block',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <span style={{ fontSize: 11, color: '#2D2327', fontWeight: 600 }}>View cart →</span>
            </div>
          </div>
          <span style={{ fontSize: 36, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }}>🌸</span>
        </div>
      </div>

      {/* "Just for you" Curated Horizontal Rail (Directly below Promo Banner) */}
      <div style={{ padding: '18px 24px 0' }}>
        <div style={{ marginBottom: 10 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 700,
              color: '#2D2327',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Just for you
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#6E5A63' }}>
            Based on your current phase and daily logs
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          role="region"
          aria-label="Personalized recommendations"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 12,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: 6,
            paddingTop: 2,
          }}
        >
          {recommendations.map(({ product: p, reasonBadge }) => {
            const cartItem = cart.find(item => item.product.id === p.id)
            const cartQty = cartItem?.quantity || 0

            return (
              <div
                key={`rec-${p.id}`}
                onClick={() => setSelectedProduct(p)}
                style={{
                  minWidth: 150,
                  maxWidth: 150,
                  background: '#FFFFFF',
                  borderRadius: 14,
                  padding: 10,
                  border: '1px solid #F0E5DF',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                }}
              >
                {/* Reason Chip */}
                <div style={{ minHeight: 18, marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: '#B85048',
                      background: '#FDF0EE',
                      padding: '2px 6px',
                      borderRadius: 12,
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                    }}
                  >
                    {reasonBadge}
                  </span>
                </div>

                {/* Product Image / Icon placeholder box */}
                <div
                  style={{
                    width: '100%',
                    height: 80,
                    borderRadius: 8,
                    background: p.color || '#FAF5F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 6,
                    fontSize: 30,
                    userSelect: 'none',
                  }}
                >
                  {p.emoji}
                </div>

                {/* Product Title */}
                <p
                  style={{
                    margin: '0 0 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#2D2327',
                    lineHeight: 1.25,
                    minHeight: 28,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {p.name}
                </p>

                {/* Footer with Price and Compact Stepper or ADD */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: 6,
                    borderTop: '1px solid #F5EBE6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#2D2327',
                      fontFamily: 'Fraunces, Georgia, serif',
                    }}
                  >
                    {p.priceFormatted}
                  </span>

                  {cartQty > 0 ? (
                    <div
                      onClick={e => e.stopPropagation()}
                      role="group"
                      aria-label={`Quantity stepper for ${p.name}`}
                      style={{
                        height: 26,
                        minWidth: 54,
                        borderRadius: 6,
                        background: '#2D2327',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 4px',
                        flexShrink: 0,
                      }}
                    >
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          if (cartQty <= 1) {
                            removeFromCart(p.id)
                          } else {
                            updateCartQuantity(p.id, -1)
                          }
                        }}
                        aria-label={`Decrease quantity of ${p.name}`}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'white',
                          fontSize: 13,
                          fontWeight: 700,
                          width: 14,
                          height: 22,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          lineHeight: 1,
                        }}
                      >
                        -
                      </button>

                      <span
                        style={{
                          color: 'white',
                          fontSize: 11,
                          fontWeight: 600,
                          minWidth: 14,
                          textAlign: 'center',
                          userSelect: 'none',
                        }}
                      >
                        {cartQty}
                      </span>

                      <button
                        onClick={e => {
                          e.stopPropagation()
                          updateCartQuantity(p.id, 1)
                        }}
                        aria-label={`Increase quantity of ${p.name}`}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'white',
                          fontSize: 13,
                          fontWeight: 700,
                          width: 14,
                          height: 22,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          lineHeight: 1,
                        }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        addToCart(p)
                      }}
                      aria-label={`Add ${p.name} to cart`}
                      style={{
                        height: 26,
                        minWidth: 46,
                        padding: '0 8px',
                        borderRadius: 6,
                        background: '#FFFFFF',
                        border: '1.5px solid #2D2327',
                        color: '#2D2327',
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: 0.3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Horizontally Scrollable Category Filter Chips */}
      <div
        role="tablist"
        aria-label="Product categories"
        style={{
          padding: '14px 24px 0',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {NUA_CATEGORIES.map(c => {
          const isActive = activeCategory === c
          return (
            <button
              key={c}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(c)}
              style={{
                padding: '7px 14px',
                borderRadius: 20,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: isActive ? '#e75650' : '#F7EDE8',
                border: `1px solid ${isActive ? '#b03e3a' : '#E8D0C8'}`,
                fontSize: 11.5,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'white' : '#7A4F5C',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              {c}
            </button>
          )
        })}
        <div style={{ width: 16, flexShrink: 0 }} />
      </div>

      {/* Products Count Indicator */}
      <div style={{ padding: '10px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#7A4F5C', fontWeight: 500 }}>
          Showing {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
        </span>
        {activeCategory !== 'All' && (
          <button
            onClick={() => setActiveCategory('All')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 11,
              color: '#9B3856',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Clear filter
          </button>
        )}
      </div>

      {/* 2-Column Product Grid */}
      <div style={{ padding: '12px 16px 112px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        {filtered.map(p => {
          const cartItem = cart.find(item => item.product.id === p.id)
          const cartQty = cartItem?.quantity || 0
          return (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              style={{
                background: '#FFFFFF',
                borderRadius: 16,
                padding: 12,
                border: '1px solid #F0E5DF',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                cursor: 'pointer',
                boxSizing: 'border-box',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              {/* Top Media Box with fixed 4:3 aspect ratio */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  borderRadius: 12,
                  background: p.color || '#FAF5F2',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  marginBottom: 10,
                  flexShrink: 0,
                }}
              >
                {/* Floating Rating Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    background: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(4px)',
                    padding: '2px 6px',
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#2D2327',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <span style={{ fontSize: 9 }}>★</span>
                  <span>{p.rating}</span>
                </div>

                {/* Product Emoji Illustration */}
                <div style={{ fontSize: 34, lineHeight: 1, userSelect: 'none' }}>
                  {p.emoji}
                </div>
              </div>

              {/* Content Section (Middle) */}
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* Single Compact Benefit Chip */}
                <div style={{ minHeight: 20, display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                  {p.badge && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#B85048',
                        background: '#FDF0EE',
                        border: '1px solid rgba(184, 80, 72, 0.15)',
                        borderRadius: 12,
                        padding: '2px 8px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* Product Title clamped to 2 lines with fixed min-height for uniform baseline */}
                <p
                  style={{
                    margin: '0 0 4px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: '#2D2327',
                    lineHeight: 1.3,
                    minHeight: 33,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {p.name}
                </p>

                {/* Subtitle / Pack Info truncated to 1 line */}
                <p
                  style={{
                    margin: '0 0 8px',
                    fontSize: 11,
                    color: '#6E5A63',
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {p.sub}
                </p>
              </div>

              {/* Footer Action Area (Bottom Anchored) */}
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: 8,
                  borderTop: '1px solid #F5EBE6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 6,
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, color: '#2D2327' }}>
                    {p.priceFormatted}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: '#8C7A82' }}>{p.unit}</p>
                </div>

                {/* Quick-Commerce Stepper or ADD Pill */}
                {cartQty > 0 ? (
                  <div
                    onClick={e => e.stopPropagation()}
                    role="group"
                    aria-label={`Quantity stepper for ${p.name}`}
                    style={{
                      height: 32,
                      minWidth: 68,
                      borderRadius: 8,
                      background: '#2D2327',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 6px',
                      flexShrink: 0,
                    }}
                  >
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        if (cartQty <= 1) {
                          removeFromCart(p.id)
                        } else {
                          updateCartQuantity(p.id, -1)
                        }
                      }}
                      aria-label={`Decrease quantity of ${p.name}`}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: 15,
                        fontWeight: 700,
                        width: 18,
                        height: 28,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      -
                    </button>

                    <span
                      style={{
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 600,
                        minWidth: 16,
                        textAlign: 'center',
                        userSelect: 'none',
                      }}
                    >
                      {cartQty}
                    </span>

                    <button
                      onClick={e => {
                        e.stopPropagation()
                        updateCartQuantity(p.id, 1)
                      }}
                      aria-label={`Increase quantity of ${p.name}`}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: 15,
                        fontWeight: 700,
                        width: 18,
                        height: 28,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      addToCart(p)
                    }}
                    aria-label={`Add ${p.name} to cart`}
                    style={{
                      height: 32,
                      minWidth: 64,
                      padding: '0 12px',
                      borderRadius: 8,
                      background: '#FFFFFF',
                      border: '1.5px solid #2D2327',
                      color: '#2D2327',
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'background 0.15s ease',
                    }}
                  >
                    ADD
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
