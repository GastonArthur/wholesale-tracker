"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Sale, Product } from "@/lib/storage"
import { Plus, Trash2 } from "lucide-react"

interface SaleFormProps {
  onSubmit: (sale: Omit<Sale, "id" | "createdAt">) => void
  onCancel?: () => void
  initialData?: Sale
  submitLabel?: string
}

export function SaleForm({ onSubmit, onCancel, initialData, submitLabel = "Guardar Venta" }: SaleFormProps) {
  const [customerName, setCustomerName] = useState(initialData?.customerName || "")
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0])
  const [observations, setObservations] = useState(initialData?.observations || "")
  const [products, setProducts] = useState<Product[]>(
    initialData?.products || [
      {
        product: "",
        quantity: 0,
        price15Plus: 0,
        price6to14: 0,
        price2to5: 0,
        sku: "",
      },
    ],
  )

  const addProduct = () => {
    setProducts([
      ...products,
      {
        product: "",
        quantity: 0,
        price15Plus: 0,
        price6to14: 0,
        price2to5: 0,
        sku: "",
      },
    ])
  }

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index))
    }
  }

  const updateProduct = (index: number, field: keyof Product, value: string | number) => {
    const newProducts = [...products]
    newProducts[index] = { ...newProducts[index], [field]: value }
    setProducts(newProducts)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      customerName,
      products,
      date,
      observations,
    })
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-xl">{initialData ? "Editar Venta" : "Nueva Venta"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nombre del Cliente</Label>
              <Input
                id="customerName"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-muted-foreground">Productos</h3>
              <Button type="button" variant="outline" size="sm" onClick={addProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </div>

            {products.map((product, index) => (
              <Card key={index} className="border-border/30 bg-muted/20">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Producto {index + 1}</h4>
                    {products.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`product-${index}`}>Nombre del Producto</Label>
                      <Input
                        id={`product-${index}`}
                        required
                        value={product.product}
                        onChange={(e) => updateProduct(index, "product", e.target.value)}
                        placeholder="Ej: Camiseta Básica"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`sku-${index}`}>SKU</Label>
                      <Input
                        id={`sku-${index}`}
                        required
                        value={product.sku}
                        onChange={(e) => updateProduct(index, "sku", e.target.value)}
                        placeholder="Ej: CAM-001"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${index}`}>Cantidad</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        required
                        min="1"
                        value={product.quantity}
                        onChange={(e) => updateProduct(index, "quantity", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Precios por Volumen</Label>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`price15Plus-${index}`} className="text-xs">
                          15+ unidades
                        </Label>
                        <Input
                          id={`price15Plus-${index}`}
                          type="number"
                          step="0.01"
                          required
                          min="0"
                          value={product.price15Plus}
                          onChange={(e) => updateProduct(index, "price15Plus", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`price6to14-${index}`} className="text-xs">
                          6-14 unidades
                        </Label>
                        <Input
                          id={`price6to14-${index}`}
                          type="number"
                          step="0.01"
                          required
                          min="0"
                          value={product.price6to14}
                          onChange={(e) => updateProduct(index, "price6to14", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`price2to5-${index}`} className="text-xs">
                          2-5 unidades
                        </Label>
                        <Input
                          id={`price2to5-${index}`}
                          type="number"
                          step="0.01"
                          required
                          min="0"
                          value={product.price2to5}
                          onChange={(e) => updateProduct(index, "price2to5", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Notas adicionales sobre la venta..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
