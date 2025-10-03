"use client"

import { useState, useEffect } from "react"
import { type Sale, getSales, saveSale, updateSale, deleteSale, getSalesByCustomer } from "@/lib/storage"
import { SaleForm } from "@/components/sale-form"
import { SalesTable } from "@/components/sales-table"
import { CustomerHistory } from "@/components/customer-history"
import { Button } from "@/components/ui/button"
import { Plus, Package } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type View = "list" | "customer"

export default function Home() {
  const [sales, setSales] = useState<Sale[]>([])
  const [view, setView] = useState<View>("list")
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [showForm, setShowForm] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)

  useEffect(() => {
    setSales(getSales())
  }, [])

  const handleSaveSale = (saleData: Omit<Sale, "id" | "createdAt">) => {
    if (editingSale) {
      updateSale(editingSale.id, saleData)
    } else {
      saveSale(saleData)
    }
    setSales(getSales())
    setShowForm(false)
    setEditingSale(null)
  }

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta venta?")) {
      deleteSale(id)
      setSales(getSales())
    }
  }

  const handleViewCustomer = (customerName: string) => {
    setSelectedCustomer(customerName)
    setView("customer")
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingSale(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Ventas Mayoristas</h1>
                <p className="text-sm text-muted-foreground">Sistema de gestión de ventas</p>
              </div>
            </div>
            {view === "list" && (
              <Button onClick={() => setShowForm(true)} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Nueva Venta
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {view === "list" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Todas las Ventas ({sales.length})</h2>
            </div>
            <SalesTable sales={sales} onEdit={handleEdit} onDelete={handleDelete} onViewCustomer={handleViewCustomer} />
          </div>
        ) : (
          <CustomerHistory
            customerName={selectedCustomer}
            sales={getSalesByCustomer(selectedCustomer)}
            onBack={() => setView("list")}
          />
        )}
      </main>

      <Dialog open={showForm} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSale ? "Editar Venta" : "Nueva Venta"}</DialogTitle>
          </DialogHeader>
          <SaleForm
            onSubmit={handleSaveSale}
            onCancel={handleCloseForm}
            initialData={editingSale || undefined}
            submitLabel={editingSale ? "Actualizar" : "Guardar Venta"}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
