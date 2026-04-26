"use client";

import CategoryCrudSection from "@/app/admin/_components/crud/sections/CategoryCrudSection";
import TagCrudSection from "@/app/admin/_components/crud/sections/TagCrudSection";
import PriceModelCrudSection from "@/app/admin/_components/crud/sections/PriceModelCrudSection";
import ResourceCrudSection from "@/app/admin/_components/crud/sections/ResourceCrudSection";
import SuggestionCrudSection from "@/app/admin/_components/crud/sections/SuggestionCrudSection";

export default function AdminCrudManager() {
  return (
    <section className="mt-10 space-y-8">
      <div className="rounded-xl border border-border/40 bg-primaryColor/45 px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-buttonColor/75">
          operaciones CRUD
        </p>
        <p className="mt-1 text-sm text-textSecondary">
          Edita entidades con cambios inmediatos y validaciones desde la API.
        </p>
      </div>

      {/* Cada sección maneja su propio estado y recarga local para evitar una recarga global. */}
      <CategoryCrudSection />
      <TagCrudSection />
      <PriceModelCrudSection />
      <ResourceCrudSection />
      <SuggestionCrudSection />
    </section>
  );
}
