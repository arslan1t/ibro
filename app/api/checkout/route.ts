import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ORDERS_PATH = join(process.cwd(), 'orders.json')

/* ─── Stripe setup ──────────────────────────────────────────────── */
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || key.includes('YOUR_SECRET_KEY')) return null
  return new Stripe(key, { apiVersion: '2026-04-22.dahlia' })
}

/* ─── Save order locally as backup ─────────────────────────────── */
function saveOrder(order: object) {
  const orders = existsSync(ORDERS_PATH)
    ? JSON.parse(readFileSync(ORDERS_PATH, 'utf-8'))
    : []
  orders.unshift({ ...order, id: `ORD-${Date.now()}`, createdAt: new Date().toISOString() })
  writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2), 'utf-8')
}

/* ─── Product catalog ───────────────────────────────────────────── */
const CATALOG: Record<string, { name: string; price: number; currency: string }> = {
  hoodie:   { name: 'THE CEILING — Premium Hoodie',         price: 14900, currency: 'usd' },
  tee:      { name: 'VERTICAL PIONEER — Training Tee',      price: 7900,  currency: 'usd' },
  ball:     { name: '110CM SIGNATURE — Basketball',         price: 19900, currency: 'usd' },
  jersey:   { name: 'PIONEER JERSEY — Game Jersey',         price: 8900,  currency: 'usd' },
  shoes:    { name: 'VERTICAL BOOST — Training Shoe',       price: 24900, currency: 'usd' },
  shorts:   { name: 'APEX SHORTS — Training Shorts',        price: 6500,  currency: 'usd' },
  protocol: { name: 'IBRO PROTOCOL — Full 110CM Program',   price: 4900,  currency: 'usd' },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, size, quantity = 1, customerEmail, customerName } = body

    const item = CATALOG[productId]
    if (!item) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3031'
    const successUrl = productId === 'protocol'
      ? `${siteUrl}/protocol/success?session_id={CHECKOUT_SESSION_ID}`
      : `${siteUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}&product=${productId}`
    const cancelUrl = productId === 'protocol'
      ? `${siteUrl}/protocol`
      : `${siteUrl}/shop`

    const stripe = getStripe()

    /* ── Stripe not configured → save order + return demo success ── */
    if (!stripe) {
      saveOrder({
        productId,
        productName: item.name,
        amount: item.price,
        size: size || null,
        quantity,
        customerEmail: customerEmail || '',
        customerName: customerName || '',
        status: 'pending_payment',
        note: 'Stripe not configured — manual payment required',
      })
      return NextResponse.json({
        mode: 'demo',
        successUrl: successUrl.replace('{CHECKOUT_SESSION_ID}', 'demo'),
      })
    }

    /* ── Stripe configured → create real checkout session ────────── */
    const description = size ? `Size: ${size} | Qty: ${quantity}` : `Qty: ${quantity}`
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: item.currency,
          product_data: {
            name: item.name,
            description,
            metadata: { productId, size: size || 'N/A' },
          },
          unit_amount: item.price,
        },
        quantity,
      }],
      customer_email: customerEmail || undefined,
      metadata: {
        productId,
        size: size || 'N/A',
        customerName: customerName || '',
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    /* Save pending order */
    saveOrder({
      productId,
      productName: item.name,
      amount: item.price,
      size: size || null,
      quantity,
      customerEmail: customerEmail || '',
      customerName: customerName || '',
      stripeSessionId: session.id,
      status: 'pending',
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('Checkout error:', e)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
