import { ProductItem, LogEntry, CartItem, PRODUCTS } from '../context/AppContext'
import { CyclePhase } from './cycleEngine'

export interface RecommendedItem {
  product: ProductItem
  reasonBadge: string
}

export interface RecommendationParams {
  currentPhase: CyclePhase
  cycleDay: number
  todayLogs?: LogEntry | null
  cartItems: CartItem[]
}

function findProduct(nameQuery: string): ProductItem | undefined {
  const q = nameQuery.toLowerCase()
  return PRODUCTS.find(p => p.name.toLowerCase().includes(q))
}

export function getShopRecommendations(params: RecommendationParams): RecommendedItem[] {
  const { currentPhase, cycleDay, todayLogs, cartItems } = params
  const list: RecommendedItem[] = []

  const inCartIds = new Set(cartItems.map(c => c.product.id))

  // 1. Base phase recommendations
  if (currentPhase === 'Menstrual') {
    if (cycleDay <= 2) {
      // Days 1 to 2: Heavy flow & cramp relief focus
      const p1 = findProduct('All Night Comfort Pads')
      const p2 = findProduct('Comfort Period Panties')
      const p3 = findProduct('Cramp Comfort Heat Patches')
      const p4 = findProduct('Cramp Relief Roll-On')

      if (p1) list.push({ product: p1, reasonBadge: 'For Heavy Flow Days' })
      if (p2) list.push({ product: p2, reasonBadge: 'For Heavy Flow Days' })
      if (p3) list.push({ product: p3, reasonBadge: 'Cramp Relief' })
      if (p4) list.push({ product: p4, reasonBadge: 'Cramp Relief' })
    } else {
      // Days 3+: Daily protection & freshness focus
      const p1 = findProduct('Complete Comfort Sanitary Pads')
      const p2 = findProduct('Everyday Comfort Panty Liners')
      const p3 = findProduct('Foaming Intimate Wash')
      const p4 = findProduct('Comfort Period Panties')

      if (p1) list.push({ product: p1, reasonBadge: 'Daily Protection' })
      if (p2) list.push({ product: p2, reasonBadge: 'Freshness Care' })
      if (p3) list.push({ product: p3, reasonBadge: 'Freshness Care' })
      if (p4) list.push({ product: p4, reasonBadge: 'Daily Protection' })
    }
  } else if (currentPhase === 'Follicular') {
    // Follicular: Skin recovery & everyday wellness
    const p1 = findProduct('Daily Clear Skin Essentials Kit')
    const p2 = findProduct('Ultra-Safe Menstrual Cup')
    const p3 = findProduct('Pore Cleansing Face Wash')
    const p4 = findProduct('Everyday Comfort Panty Liners')

    if (p1) list.push({ product: p1, reasonBadge: 'Skin Recovery' })
    if (p2) list.push({ product: p2, reasonBadge: 'Everyday Wellness' })
    if (p3) list.push({ product: p3, reasonBadge: 'Skin Recovery' })
    if (p4) list.push({ product: p4, reasonBadge: 'Everyday Wellness' })
  } else if (currentPhase === 'Ovulation') {
    // Ovulatory: Daily freshness & mood harmony
    const p1 = findProduct('Everyday Comfort Panty Liners')
    const p2 = findProduct('Balance Essential Oil Roll-On')
    const p3 = findProduct('Ultra-Safe Menstrual Cup')
    const p4 = findProduct('Foaming Intimate Wash')

    if (p1) list.push({ product: p1, reasonBadge: 'Daily Freshness' })
    if (p2) list.push({ product: p2, reasonBadge: 'Mood Harmony' })
    if (p3) list.push({ product: p3, reasonBadge: 'Daily Freshness' })
    if (p4) list.push({ product: p4, reasonBadge: 'Freshness Care' })
  } else {
    // Luteal: PMS breakouts & calming care
    const p1 = findProduct('Acne Healing / Pimple Patch')
    const p2 = findProduct('Dark Spot Corrector Serum')
    const p3 = findProduct('Balance Essential Oil Roll-On')
    const p4 = findProduct('Cramp Comfort Heat Patches')

    if (p1) list.push({ product: p1, reasonBadge: 'For PMS Breakouts' })
    if (p2) list.push({ product: p2, reasonBadge: 'For PMS Breakouts' })
    if (p3) list.push({ product: p3, reasonBadge: 'Calming Care' })
    if (p4) list.push({ product: p4, reasonBadge: 'Calming Care' })
  }

  // 2. Symptom Boost: Cramps
  const physicalSymptoms = todayLogs?.physical || []
  const hasCramps =
    physicalSymptoms.includes('cramps') ||
    todayLogs?.pain === 'Mild' ||
    todayLogs?.pain === 'Moderate' ||
    todayLogs?.pain === 'Severe' ||
    (todayLogs?.notes && todayLogs.notes.toLowerCase().includes('cramp'))

  if (hasCramps) {
    const patchProduct = findProduct('Cramp Comfort Heat Patches')
    if (patchProduct) {
      // Remove if already in list to avoid duplicates
      const existingIdx = list.findIndex(item => item.product.id === patchProduct.id)
      if (existingIdx !== -1) {
        list.splice(existingIdx, 1)
      }
      // Insert at the very front
      list.unshift({ product: patchProduct, reasonBadge: 'For Logged Cramps' })
    }
  }

  // 3. Symptom Boost: Bloating or Tired
  const hasBloatOrTired =
    physicalSymptoms.includes('bloating') ||
    physicalSymptoms.includes('tired') ||
    todayLogs?.energy === 'Low' ||
    todayLogs?.energy === 'Exhausted' ||
    (todayLogs?.notes && (todayLogs.notes.toLowerCase().includes('bloat') || todayLogs.notes.toLowerCase().includes('tired')))

  if (hasBloatOrTired) {
    const drinkMix = findProduct('Period Pain Relief Drink Mix / Uplift')
    if (drinkMix) {
      const existingIdx = list.findIndex(item => item.product.id === drinkMix.id)
      if (existingIdx !== -1) {
        list.splice(existingIdx, 1)
      }
      // Insert near top (position 1 if cramps was unshifted, else 0)
      const insertPos = hasCramps ? 1 : 0
      list.splice(insertPos, 0, { product: drinkMix, reasonBadge: 'For Fatigue & Bloating' })
    }
  }

  // 4. History Boost: If in cart/history and not already marked with symptom boost
  list.forEach(item => {
    if (inCartIds.has(item.product.id) && item.reasonBadge !== 'For Logged Cramps') {
      item.reasonBadge = 'Your Go-to'
    }
  })

  // 5. Deduplicate and ensure at least 4 items
  const seenIds = new Set<number>()
  const result: RecommendedItem[] = []

  for (const item of list) {
    if (!seenIds.has(item.product.id)) {
      seenIds.add(item.product.id)
      result.push(item)
    }
  }

  // Fallbacks if fewer than 4 items
  const fallbacks = [
    { name: 'Complete Comfort Sanitary Pads', badge: 'Bestseller' },
    { name: 'Cramp Comfort Heat Patches', badge: 'Daily Relief' },
    { name: 'Everyday Comfort Panty Liners', badge: 'Daily Freshness' },
    { name: 'Foaming Intimate Wash', badge: 'Gentle Care' },
  ]

  for (const fb of fallbacks) {
    if (result.length >= 5) break
    const p = findProduct(fb.name)
    if (p && !seenIds.has(p.id)) {
      seenIds.add(p.id)
      result.push({ product: p, reasonBadge: fb.badge })
    }
  }

  return result
}
