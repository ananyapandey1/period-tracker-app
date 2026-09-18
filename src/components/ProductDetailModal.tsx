import React from 'react'
import { useApp } from '../context/AppContext'

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useApp()

  if (!selectedProduct) return null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(45, 24, 32, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
      onClick={() => setSelectedProduct(null)}
      role="dialog"
      aria-modal="true"
      aria-label="Product Details"
    >
      <div
        style={{
          background: '#FDF6F0',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '20px 24px 28px',
          borderTop: '1px solid #E8D0C8',
          boxShadow: '0 -12px 32px rgba(45, 24, 32, 0.25)',
          maxHeight: '80%',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ width: 36, height: 4, background: '#E8D0C8', borderRadius: 2, margin: '0 auto 14px' }} />

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: selectedProduct.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
            }}
          >
            {selectedProduct.emoji}
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            aria-label="Close details"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#F7EDE8',
              border: '1px solid #E8D0C8',
              fontSize: 16,
              color: '#7A4F5C',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Title & Category */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, background: '#F2D5D0', color: '#7A4F5C', padding: '2px 8px', borderRadius: 12, textTransform: 'uppercase' }}>
              {selectedProduct.category}
            </span>
            <span style={{ fontSize: 11, color: '#E8B87A', fontWeight: 600 }}>⭐ {selectedProduct.rating} / 5</span>
          </div>
          <h2 style={{ margin: 0, fontSize: 20, fontFamily: 'Fraunces, Georgia, serif', color: '#2D1820' }}>
            {selectedProduct.name}
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#7A4F5C' }}>{selectedProduct.sub}</p>
        </div>

        {/* Description */}
        <div style={{ background: '#F7EDE8', borderRadius: 16, padding: '14px', border: '1px solid #E8D0C8', marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#e75650', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Product details
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#7A4F5C', lineHeight: 1.5 }}>
            {selectedProduct.description}
          </p>
        </div>

        {/* Price & Add button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontSize: 22, fontFamily: 'Fraunces, Georgia, serif', color: '#2D1820' }}>
              {selectedProduct.priceFormatted}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#B89AA8' }}>{selectedProduct.unit}</p>
          </div>
          <button
            onClick={() => {
              addToCart(selectedProduct)
              setSelectedProduct(null)
            }}
            style={{
              padding: '12px 20px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #e75650, #c43a35)',
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(231, 86, 80, 0.3)',
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
