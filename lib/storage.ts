export interface Product {
  product: string
  quantity: number
  price15Plus: number
  price6to14: number
  price2to5: number
  sku: string
}

export interface Sale {
  id: string
  customerName: string
  products: Product[] // Updated from single product to array of products
  date: string
  observations: string
  createdAt: number
}

const STORAGE_KEY = "wholesale_sales"

export function getSales(): Sale[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveSale(sale: Omit<Sale, "id" | "createdAt">): Sale {
  const sales = getSales()
  const newSale: Sale = {
    ...sale,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  }
  sales.push(newSale)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales))
  return newSale
}

export function updateSale(id: string, sale: Partial<Sale>): void {
  const sales = getSales()
  const index = sales.findIndex((s) => s.id === id)
  if (index !== -1) {
    sales[index] = { ...sales[index], ...sale }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales))
  }
}

export function deleteSale(id: string): void {
  const sales = getSales()
  const filtered = sales.filter((s) => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function getSalesByCustomer(customerName: string): Sale[] {
  const sales = getSales()
  return sales
    .filter((s) => s.customerName.toLowerCase() === customerName.toLowerCase())
    .sort((a, b) => b.createdAt - a.createdAt)
}

export function getCustomers(): string[] {
  const sales = getSales()
  const customers = new Set(sales.map((s) => s.customerName))
  return Array.from(customers).sort()
}
