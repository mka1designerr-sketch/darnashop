"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCategories } from "@/contexts/CategoriesContext";

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditCategoryPage() {
  const { categories, update, remove } = useCategories();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = decodeURIComponent(params.id);
  const base = categories.find((c) => c.id === id);
  const [name, setName] = useState(base?.name || "");
  const [cover, setCover] = useState<string>(base?.cover || "");

  useEffect(() => {
    if (!base) return;
    setName(base.name);
    setCover(base.cover);
  }, [id]);

  if (!base) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p>Catégorie introuvable.</p>
      </main>
    );
  }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await readFileAsDataURL(f);
    setCover(url);
  }

  const save = async () => {
    update(id, { name, cover });
    router.push("/admin/categories");
  };

  const removeCategory = async () => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    remove(id);
    router.push("/admin/categories");
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/categories" className="text-sm text-[var(--color-primary)] hover:underline">← Retour</Link>
        <h1 className="text-2xl font-bold">Modifier la catégorie</h1>
      </div>
      <div className="space-y-6 rounded-xl border bg-white p-6 shadow">
        <div>
          <label className="block text-sm font-medium">ID (slug)</label>
          <input className="mt-1 w-full rounded border p-2" value={id} disabled />
        </div>
        <div>
          <label className="block text-sm font-medium">Nom</label>
          <input className="mt-1 w-full rounded border p-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Image</label>
          <input className="mt-1" type="file" accept="image/*" onChange={uploadCover} />
          {cover && <div className="mt-3 h-40 w-full rounded bg-cover bg-center" style={{ backgroundImage: `url('${cover}')` }} />}
        </div>
        <div className="flex justify-between">
          <button onClick={removeCategory} className="rounded border border-red-300 bg-red-50 px-6 py-2 font-bold text-red-700">Supprimer</button>
          <button onClick={save} className="rounded-lg bg-[var(--color-primary)] px-6 py-2 font-bold text-white">Enregistrer</button>
        </div>
      </div>
    </main>
  );
}
