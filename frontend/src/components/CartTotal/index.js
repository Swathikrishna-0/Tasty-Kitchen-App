import {FaRupeeSign} from 'react-icons/fa'
import React from 'react'
import CartContext from '../../context/CartContext'
import './index.css'

// Add Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

const CartTotal = props => {
  const {orderPlaced} = props

  return (
    <CartContext.Consumer>
      {value => {
        const {cartList} = value

        let totalOrderCost = 0
        cartList.forEach(eachCartItem => {
          totalOrderCost += eachCartItem.cost * eachCartItem.quantity
        })

        const onClickPlaceOrder = async () => {
          const res = await loadRazorpayScript()

          if (!res) {
            alert('Razorpay SDK failed to load. Are you online?')
            return
          }

          // Create order on the backend
          const data = await fetch('http://localhost:5000/create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: totalOrderCost }),
          }).then((t) => t.json())

          const options = {
            key: process.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
            amount: data.amount.toString(),
            currency: data.currency,
            name: 'Tasty Kitchen',
            description: 'Test Transaction',
            order_id: data.id,
            handler: function (response) {
              // alert(response.razorpay_payment_id)
              // alert(response.razorpay_order_id)
              // alert(response.razorpay_signature)
              orderPlaced()
            },
            prefill: {
              name: 'Your Name',
              email: 'your.email@example.com',
              contact: '9999999999',
            },
            notes: {
              address: 'Tasty Kitchen Corporate Office',
            },
            theme: {
              color: '#F37254',
            },
          }

          const paymentObject = new window.Razorpay(options)
          paymentObject.open()
        }

        return (
          <>
            <hr className="cart-hr-line" />
            <div className="cart-total-container">
              <h1 className="total-text">Order Total:</h1>
              <div className="total-container" testid="total-price">
                <p testid="total-price" className="total-price">
                  <FaRupeeSign size={18} /> {totalOrderCost}
                </p>
                <button
                  type="button"
                  className="order-button"
                  onClick={onClickPlaceOrder}
                >
                  Place Order
                </button>
              </div>
            </div>
          </>
        )
      }}
    </CartContext.Consumer>
  )
}

export default CartTotal
