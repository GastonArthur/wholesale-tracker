"use client"

import { useState } from "react"
import type { Sale } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Edit, Trash2, ShoppingCart, Package } from "lucide-react"

interface CustomerCardsProps {
  sales: Sale[]
  onEdit: (sale: Sale) => void
  onDelete: (id: string) => void
}

export function CustomerCards({ sales, onEdit, onDelete }: CustomerCardsProps) {
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set())

  // Agrupar ventas por cliente
  const customerGroups = sales.reduce(
    (acc, sale) => {
      if (!acc[sale.customerName]) {
        acc[sale.customerName] = []
      }
      acc[sale.customerName].push(sale)
      return acc
    },
    {} as Record<string, Sale[]>,
  )

  const toggleCustomer = (customerName: string) => {
    const newExpanded = new Set(expandedCustomers)
    if (newExpanded.has(customerName)) {
      newExpanded.delete(customerName)
    } else {
      newExpanded.add(customerName)
    }
    setExpandedCustomers(newExpanded)
  }

  const calculateProductPrice = (product: Sale["products"][0]) => {
    let price = 0

    // Intentar usar el precio del rango correspondiente
    if (product.quantity >= 15 && product.price15Plus > 0) {
      price = product.price15Plus
    } else if (product.quantity >= 6 && product.quantity <= 14 && product.price6to14 > 0) {
      price = product.price6to14
    } else if (product.quantity >= 2 && product.quantity <= 5 && product.price2to5 > 0) {
      price = product.price2to5
    }

    // Si no hay precio en el rango correspondiente, usar cualquier precio disponible
    if (price === 0) {
      price = product.price15Plus || product.price6to14 || product.price2to5 || 0
    }

    return price
  }

  const calculateCustomerTotal = (customerSales: Sale[]) => {
    return customerSales.reduce((total, sale) => {
      const saleTotal = sale.products.reduce((sum, product) => {
        const price = calculateProductPrice(product)
        return sum + price * product.quantity
      }, 0)
      return total + saleTotal
    }, 0)
  }

  const getTotalProducts = (customerSales: Sale[]) => {
    return customerSales.reduce((total, sale) => total + sale.products.length, 0)
  }

  if (Object.keys(customerGroups).length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground text-lg">No hay ventas registradas</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Object.entries(customerGroups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([customerName, customerSales]) => {
          const isExpanded = expandedCustomers.has(customerName)
          const totalAmount = calculateCustomerTotal(customerSales)
          const totalProducts = getTotalProducts(customerSales)

          return (
            <Card key={customerName} className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <CardHeader
                className="cursor-pointer bg-card hover:bg-accent/50 transition-colors"
                onClick={() => toggleCustomer(customerName)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <CardTitle className="text-xl">{customerName}</CardTitle>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="secondary" className="font-normal">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {customerSales.length} {customerSales.length === 1 ? "venta" : "ventas"}
                        </Badge>
                        <Badge variant="secondary" className="font-normal">
                          <Package className="h-3 w-3 mr-1" />
                          {totalProducts} {totalProducts === 1 ? "producto" : "productos"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-6 space-y-4">
                  {customerSales.map((sale) => {
                    const saleTotal = sale.products.reduce((sum, product) => {
                      const price = calculateProductPrice(product)
                      return sum + price * product.quantity
                    }, 0)

                    return (
                      <div key={sale.id} className="border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(sale.date).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            {sale.observations && (
                              <p className="text-sm text-muted-foreground mt-1 italic">{sale.observations}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => onEdit(sale)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onDelete(sale.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {sale.products.map((product, idx) => {
                            const appliedPrice = calculateProductPrice(product)
                            let priceLabel = "2-5u"
                            if (product.quantity >= 15) {
                              priceLabel = "15+u"
                            } else if (product.quantity >= 6) {
                              priceLabel = "6-14u"
                            }
                            const subtotal = appliedPrice * product.quantity

                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between py-2 px-3 bg-background rounded border"
                              >
                                <div className="flex-1">
                                  <p className="font-medium">{product.product}</p>
                                  <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="text-right">
                                    <p className="font-medium">{product.quantity} unidades</p>
                                    <p className="text-muted-foreground">
                                      ${appliedPrice.toFixed(2)} ({priceLabel})
                                    </p>
                                  </div>
                                  <div className="text-right min-w-[100px]">
                                    <p className="font-bold text-lg">${subtotal.toFixed(2)}</p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        <div className="flex justify-end mt-3 pt-3 border-t">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total de la venta</p>
                            <p className="text-xl font-bold text-primary">${saleTotal.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              )}
            </Card>
          )
        })}
    </div>
  )
}
