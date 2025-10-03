"use client"

import type { Sale, Product } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, User } from "lucide-react"

interface SalesTableProps {
  sales: Sale[]
  onEdit: (sale: Sale) => void
  onDelete: (id: string) => void
  onViewCustomer: (customerName: string) => void
}

export function SalesTable({ sales, onEdit, onDelete, onViewCustomer }: SalesTableProps) {
  const getAppliedPrice = (product: Product) => {
    if (product.quantity >= 15) return product.price15Plus
    if (product.quantity >= 6) return product.price6to14
    return product.price2to5
  }

  const getSaleTotal = (sale: Sale) => {
    return sale.products.reduce((sum, product) => {
      return sum + getAppliedPrice(product) * product.quantity
    }, 0)
  }

  const getTotalUnits = (sale: Sale) => {
    return sale.products.reduce((sum, product) => sum + product.quantity, 0)
  }

  if (sales.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">No hay ventas registradas aún</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {sales.map((sale) => (
        <Card key={sale.id} className="border-border/50 hover:border-border transition-colors">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <button
                      onClick={() => onViewCustomer(sale.customerName)}
                      className="font-semibold text-lg hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      {sale.customerName}
                    </button>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(sale.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">${getSaleTotal(sale).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{getTotalUnits(sale)} unidades</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {sale.products.map((product, index) => (
                    <div key={index} className="border border-border/30 rounded-lg p-3 bg-muted/20">
                      <div className="grid gap-3 md:grid-cols-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Producto</p>
                          <p className="font-medium">{product.product}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">SKU</p>
                          <p className="font-medium">{product.sku}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Cantidad</p>
                          <p className="font-medium">{product.quantity} unidades</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Subtotal</p>
                          <p className="font-medium">${(getAppliedPrice(product) * product.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {sale.observations && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">Observaciones:</p>
                    <p className="text-sm mt-1">{sale.observations}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 md:flex-col">
                <Button variant="outline" size="sm" onClick={() => onEdit(sale)} className="flex-1 md:flex-none">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(sale.id)}
                  className="flex-1 md:flex-none text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
