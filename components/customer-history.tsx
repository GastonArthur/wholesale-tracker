"use client"

import type { Sale, Product } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface CustomerHistoryProps {
  customerName: string
  sales: Sale[]
  onBack: () => void
}

export function CustomerHistory({ customerName, sales, onBack }: CustomerHistoryProps) {
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

  const totalSpent = sales.reduce((sum, sale) => sum + getSaleTotal(sale), 0)
  const totalUnits = sales.reduce((sum, sale) => {
    return sum + sale.products.reduce((productSum, product) => productSum + product.quantity, 0)
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">{customerName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Total de Compras</p>
              <p className="text-3xl font-bold">{sales.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unidades Totales</p>
              <p className="text-3xl font-bold">{totalUnits}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monto Total</p>
              <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Historial de Compras</h3>
        {sales.map((sale) => (
          <Card key={sale.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">
                      {sale.products.length} {sale.products.length === 1 ? "producto" : "productos"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(sale.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${getSaleTotal(sale).toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/50">
                  {sale.products.map((product, index) => (
                    <div key={index} className="border border-border/30 rounded-lg p-3 bg-muted/10">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">{product.product}</p>
                        <p className="font-semibold">${(getAppliedPrice(product) * product.quantity).toFixed(2)}</p>
                      </div>
                      <div className="grid gap-2 md:grid-cols-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">SKU</p>
                          <p className="font-medium">{product.sku}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Cantidad</p>
                          <p className="font-medium">{product.quantity} unidades</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Precio/u</p>
                          <p className="font-medium">${getAppliedPrice(product).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Rango</p>
                          <p className="font-medium">
                            {product.quantity >= 15 ? "15+" : product.quantity >= 6 ? "6-14" : "2-5"}
                          </p>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
