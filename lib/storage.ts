// lib/storage.ts
import { supabase } from "./supabase";

export async function addCliente(nombre: string, observaciones?: string) {
  const { data, error } = await supabase
    .from("clientes")
    .insert([{ nombre, observaciones }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function getClientes() {
  const { data, error } = await supabase.from("clientes").select("*");
  if (error) throw error;
  return data;
}

export async function addVenta(venta: any) {
  const { data, error } = await supabase
    .from("ventas")
    .insert([venta])
    .select();
  if (error) throw error;
  return data[0];
}

export async function getVentasByCliente(clienteId: string) {
  const { data, error } = await supabase
    .from("ventas")
    .select("*")
    .eq("cliente_id", clienteId);
  if (error) throw error;
  return data;
}
