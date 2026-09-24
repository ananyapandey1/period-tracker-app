import React from 'react'
import { useApp } from '../context/AppContext'

export const CartModal: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateCartQuantity, removeFromCart, clearCart, showToast } = useApp()

  if (!isCartOpen) return null

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const freeShippingThreshold = 499.0
  const freeShippingNeeded = Math.max(0, freeShippingThreshold - subtotal)
  const shippingFee = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 49
  const grandTotal = subtotal + shippingFee

  const handleCheckout = () => {
    if (cart.length === 0) return
    clearCart()
    setIsCartOpen(false)
    showToast('🎉 Order placed successfully! Thank you for shopping with Nua.')
  }

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
      onClick={() => setIsCartOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
    >
      <div
        style={{
          background: '#FDF6F0',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '20px 24px 28px',
          borderTop: '1px solid #E8D0C8',
          boxShadow: '0 -12px 32px rgba(45, 24, 32, 0.25)',
          maxHeight: '85%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: '#E8D0C8', borderRadius: 2, margin: '0 auto 14px' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontFamily: 'Fraunces, Georgia, serif', color: '#2D1820' }}>
              Your Cart ({cart.reduce((a, c) => a + c.quantity, 0)})
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#B89AA8' }}>Nua period & wellness items</p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Go back"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#F7EDE8',
              border: '1px solid #E8D0C8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              color: '#2D1820',
              transition: 'background-color 0.15s ease',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D1820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ background: '#F7EDE8', padding: '10px 14px', borderRadius: 14, border: '1px solid #E8D0C8', marginBottom: 14 }}>
          {freeShippingNeeded > 0 ? (
            <p style={{ margin: 0, fontSize: 11, color: '#7A4F5C' }}>
              Add <strong style={{ color: '#e75650' }}>₹{freeShippingNeeded.toFixed(0)}</strong> more for <strong>FREE delivery</strong>! 🚚
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: 11, color: '#2A9D8F', fontWeight: 600 }}>
              🎉 You've unlocked FREE Nua express delivery!
            </p>
          )}
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 2 }}>
          {cart.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#B89AA8' }}>
              <span style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>🛍️</span>
              <p style={{ margin: 0, fontSize: 14, color: '#7A4F5C' }}>Your cart is empty</p>
              <p style={{ margin: '4px 0 0', fontSize: 12 }}>Add Nua products from the shop to get started.</p>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.product.id}
                style={{
                  background: '#F7EDE8',
                  borderRadius: 14,
                  padding: '10px 12px',
                  border: '1px solid #E8D0C8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: item.product.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {item.product.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#2D1820' }}>{item.product.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#7A4F5C' }}>
                    {item.product.priceFormatted} <span style={{ color: '#B89AA8' }}>/ {item.product.unit}</span>
                  </p>
                </div>

                {/* Quantity Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, -1)}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background: 'white',
                      border: '1px solid #E8D0C8',
                      color: '#e75650',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#2D1820', minWidth: 16, textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, 1)}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background: 'white',
                      border: '1px solid #E8D0C8',
                      color: '#e75650',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #E8D0C8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#7A4F5C', marginBottom: 4 }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#7A4F5C', marginBottom: 8 }}>
              <span>Express Delivery</span>
              <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontFamily: 'Fraunces, Georgia, serif', color: '#2D1820', marginBottom: 14 }}>
              <span>Total</span>
              <span>₹{grandTotal.toFixed(0)}</span>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 16,
                background: 'linear-gradient(135deg, #e75650, #c43a35)',
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(231, 86, 80, 0.3)',
              }}
            >
              Checkout • ₹{grandTotal.toFixed(0)}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
