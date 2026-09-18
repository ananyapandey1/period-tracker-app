import { useState } from 'react'
import { useApp, PRODUCTS } from '../context/AppContext'

const NUA_SUBTABS = [
  'All',
  'Sanitary Pads',
  'Cramps & Pain Management',
  'Intimate Care',
  'Skincare & Wellness',
]

export default function ShopScreen() {
  const { cart, addToCart, setIsCartOpen, setSelectedProduct } = useApp()
  const [activeCategory, setActiveCategory] = useState('All')

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
            background: 'linear-gradient(135deg, #e75650, #c43a35)',
            borderRadius: 18,
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(231,86,80,0.25)',
          }}
        >
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              NUA EXCLUSIVE
            </p>
            <p style={{ margin: '0 0 6px', fontSize: 16, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400, color: 'white' }}>
              Free shipping on<br />orders over ₹499
            </p>
            <div style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 20, padding: '4px 12px', display: 'inline-block' }}>
              <span style={{ fontSize: 11, color: 'white', fontWeight: 600 }}>View cart →</span>
            </div>
          </div>
          <span style={{ fontSize: 38 }}>🌸</span>
        </div>
      </div>

      {/* Subtabs Mirroring Nua Woman */}
      <div style={{ padding: '14px 24px 0', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {NUA_SUBTABS.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            style={{
              padding: '7px 14px',
              borderRadius: 20,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeCategory === c ? '#e75650' : '#F7EDE8',
              border: `1px solid ${activeCategory === c ? '#b03e3a' : '#E8D0C8'}`,
              fontSize: 11,
              fontWeight: 500,
              color: activeCategory === c ? 'white' : '#7A4F5C',
              flexShrink: 0,
            }}
          >
            {c}
          </button>
        ))}
        <div style={{ width: 16, flexShrink: 0 }} />
      </div>

      {/* Products Grid */}
      <div style={{ padding: '14px 24px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtered.map(p => {
          const inCart = cart.some(item => item.product.id === p.id)
          return (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              style={{
                background: p.color,
                borderRadius: 18,
                padding: '14px 12px 12px',
                border: '1px solid rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
            >
              {/* Badge & Rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', minHeight: 20 }}>
                {p.badge ? (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      background: p.badgeColor,
                      color: 'white',
                      borderRadius: 20,
                      padding: '2px 8px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {p.badge}
                  </span>
                ) : (
                  <span />
                )}
                <span style={{ fontSize: 10, color: '#7A4F5C', fontWeight: 600 }}>⭐ {p.rating}</span>
              </div>

              {/* Product Visual */}
              <div style={{ fontSize: 32, lineHeight: 1, textAlign: 'center', padding: '6px 0' }}>
                {p.emoji}
              </div>

              {/* Info */}
              <div>
                <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 600, color: '#2D1820', lineHeight: 1.3 }}>{p.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#7A4F5C', lineHeight: 1.3 }}>{p.sub}</p>
              </div>

              {/* Price & Add to Cart */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 4 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, color: '#2D1820' }}>
                    {p.priceFormatted}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: '#B89AA8' }}>{p.unit}</p>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    addToCart(p)
                  }}
                  aria-label={`Add ${p.name} to cart`}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: inCart ? '#e75650' : 'white',
                    border: `1.5px solid ${inCart ? '#b03e3a' : '#E8D0C8'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: inCart ? 'white' : '#e75650',
                    fontSize: 16,
                    fontWeight: 700,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  }}
                >
                  {inCart ? '✓' : '+'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
