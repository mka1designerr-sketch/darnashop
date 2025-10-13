"use client";
import Link from "next/link";
import { useCategories } from "@/contexts/CategoriesContext";

export default function AdminCategoriesList() {
  const { categories, remove } = useCategories();
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link href="/admin/categories/new" className="rounded-lg bg-[var(--color-primary)] px-4 py-2 font-semibold text-white hover:bg-[var(--color-primary)]/90">+ New Category</Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow">
            <div className="h-20 w-32 flex-shrink-0 rounded bg-cover bg-center" style={{ backgroundImage: `url('${c.cover}')` }} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{c.name}</h3>
              <p className="text-xs text-slate-500">slug: {c.id}</p>
            </div>
            <Link href={`/admin/categories/${encodeURIComponent(c.id)}/edit`} className="rounded border px-3 py-2 text-sm mr-2">Edit</Link>
            <button onClick={() => remove(c.id)} className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">Remove</button>
          </div>
        ))}
        {categories.length === 0 && <p className="text-slate-600">No categories yet.</p>}
      </div>
    </main>
  );
}
