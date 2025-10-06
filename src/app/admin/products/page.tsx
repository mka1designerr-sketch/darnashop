"use client";
import Link from "next/link";
import { useProducts } from "@/contexts/ProductsContext";

export default function AdminProductsList() {
  const { products, remove } = useProducts();
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Link href="/admin/products/new" className="rounded-lg bg-[var(--color-primary)] px-4 py-2 font-semibold text-white hover:bg-[var(--color-primary)]/90">
          + Add New Product
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-600">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Variants</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2 font-medium">{p.name}</td>
                  <td className="px-4 py-2">{p.categories.join(", ")}</td>
                  <td className="px-4 py-2">{p.variants.length}</td>
                  <td className="px-4 py-2">{p.qty}</td>
                  <td className="px-4 py-2">{p.price.toLocaleString("fr-DZ")} DZD</td>
                  <td className="px-4 py-2">
                    <Link href={`/admin/products/${encodeURIComponent(p.id)}/edit`} className="text-[var(--color-primary)] hover:underline">Edit</Link>
                    <span className="mx-2 text-slate-300">|</span>
                    <button className="text-red-600 hover:underline" onClick={() => remove(p.id)}>Remove</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-500" colSpan={6}>No products yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
