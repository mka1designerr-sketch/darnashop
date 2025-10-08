"use client";
import { useState } from "react";
import { useCategories } from "@/contexts/CategoriesContext";
import Link from "next/link";

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function NewCategoryPage() {
  const { add } = useCategories();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [cover, setCover] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const slugify = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await readFileAsDataURL(f);
    setCover(url);
  }

  async function save() {
    if (!name || !cover) return alert("Nom et image requis");
    setSaving(true);
    const finalId = id || slugify(name) || `cat-${Date.now()}`;
    add({ id: finalId, name, cover });
    setSaving(false);
    window.location.href = "/admin/categories";
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/categories" className="text-sm text-[var(--color-primary)] hover:underline">← Back to Categories</Link>
        <h1 className="text-2xl font-bold">New Category</h1>
      </div>
      <div className="space-y-6 rounded-xl border bg-white p-6 shadow">
        <div>
          <label className="block text-sm font-medium">Category ID (slug)</label>
          <input className="mt-1 w-full rounded border p-2" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. vetements" />
        </div>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input className="mt-1 w-full rounded border p-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Cover Image</label>
          <input className="mt-1" type="file" accept="image/*" onChange={uploadCover} />
          {cover && <div className="mt-3 h-40 w-full rounded bg-cover bg-center" style={{ backgroundImage: `url('${cover}')` }} />}
        </div>
        <div className="flex justify-end">
          <button disabled={saving} onClick={save} className="rounded-lg bg-[var(--color-primary)] px-6 py-2 font-bold text-white disabled:opacity-50">
            {saving ? "Saving..." : "Create Category"}
          </button>
        </div>
      </div>
    </main>
  );
}
