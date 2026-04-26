"use client";

import Script from "next/script";
import { FormEvent, useState } from "react";
import useSearch from "../hooks/useSearch";
import SuggestionOptionSelector from "./SuggestionOptionSelector";

function SugestionsForResources() {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const fieldBaseClass =
    "mt-1.5 block w-full rounded-xl border border-border/70 bg-primaryColor/60 px-4 py-2.5 text-sm text-textPrimary placeholder:text-textSecondary/70 outline-none transition-all focus:border-buttonColor/80 focus:shadow-[0_0_0_3px_rgba(191,0,255,0.2)]";
  const labelClass = "text-xs font-semibold uppercase tracking-[0.08em] text-textSecondary";

  const {
    categories,
    tags,
    selectedCategoryId,
    selectedTagIds,
    selectCategory,
    toggleTag,
    clearCategory,
    isLoadingFilters,
    filtersError,
  } = useSearch({
    fetchCategories: true,
    fetchTags: true,
  });

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [url, setUrl] = useState("");
  const [categoriaSugerida, setCategoriaSugerida] = useState("");
  const [emailContacto, setEmailContacto] = useState("");
  const [website, setWebsite] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [hoveredCategoryDescription, setHoveredCategoryDescription] = useState<string | null>(null);
  const [hoveredTagDescription, setHoveredTagDescription] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const normalizedCategorySearch = categorySearchTerm.trim().toLowerCase();
  const filteredCategories =
    normalizedCategorySearch.length === 0
      ? categories
      : categories.filter(
          (category) =>
            category.label.toLowerCase().includes(normalizedCategorySearch) ||
            String(category.id).includes(normalizedCategorySearch),
        );

  const normalizedTagSearch = tagSearchTerm.trim().toLowerCase();
  const filteredTags =
    normalizedTagSearch.length === 0
      ? tags
      : tags.filter(
          (tag) =>
            tag.label.toLowerCase().includes(normalizedTagSearch) ||
            String(tag.id).includes(normalizedTagSearch),
        );

  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ?? null;
  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));

  function syncSelectedTags(nextSelectedTagIds: number[]) {
    const nextSet = new Set(nextSelectedTagIds);
    const currentSet = new Set(selectedTagIds);

    tags.forEach((tag) => {
      const shouldBeSelected = nextSet.has(tag.id);
      const isSelected = currentSet.has(tag.id);

      if (shouldBeSelected !== isSelected) {
        toggleTag(tag);
      }
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const turnstileToken = String(formData.get("cf-turnstile-response") ?? "").trim();

      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          url,
          categoriaId: selectedCategoryId ?? undefined,
          categoriaSugerida: categoriaSugerida || undefined,
          emailContacto: emailContacto || undefined,
          turnstileToken: turnstileToken || undefined,
          website,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "No se pudo enviar la sugerencia.");
      }

      setSubmitSuccess("Gracias. Tu sugerencia fue enviada y quedo en estado pendiente.");
      setTitulo("");
      setDescripcion("");
      setUrl("");
      setCategoriaSugerida("");
      setEmailContacto("");
      setWebsite("");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No se pudo enviar la sugerencia.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="sugerir-recurso" className="my-16 mx-auto max-w-3xl px-4 sm:px-0">
      <article className="relative overflow-hidden rounded-2xl border border-border/60 bg-cardBackground/75 p-6 shadow-[0_0_40px_rgba(124,58,237,0.2)] backdrop-blur-sm sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-buttonColor/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-accent/15 blur-3xl" />

        <header className="relative mb-6 space-y-2">
          <h2 className="text-2xl font-bold">Sugiere tus recursos</h2>
          <p className="text-sm text-textSecondary">
            Comparte enlaces que te hayan ayudado y ayúdanos a ampliar el catálogo de recursos para
            la comunidad.
          </p>
        </header>

        {turnstileSiteKey ? (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="afterInteractive"
          />
        ) : null}

        <form onSubmit={handleSubmit} className="relative space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="resource-name" className="sm:col-span-2">
              <span className={labelClass}>Título del recurso</span>
              <input
                type="text"
                id="resource-name"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
                placeholder="Ej. Curso avanzado de React"
                required
                className={fieldBaseClass}
              />
            </label>

            <label htmlFor="resource-url" className="sm:col-span-2">
              <span className={labelClass}>URL del recurso</span>
              <input
                type="url"
                id="resource-url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://ejemplo.com/recurso"
                className={fieldBaseClass}
              />
            </label>

            <label htmlFor="resource-description" className="sm:col-span-2">
              <span className={labelClass}>Descripción</span>
              <textarea
                id="resource-description"
                rows={4}
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
                placeholder="¿Qué aporta este recurso y por qué lo recomiendas?"
                className={`${fieldBaseClass} resize-none`}
              ></textarea>
            </label>

            <div className="sm:col-span-2 grid items-start gap-4 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <span className={labelClass}>Categoría existente</span>
                  <SuggestionOptionSelector
                    searchTerm={categorySearchTerm}
                    onSearchTermChange={setCategorySearchTerm}
                    onClear={() => {
                      clearCategory();
                      setCategorySearchTerm("");
                    }}
                    selectedOptions={selectedCategory ? [selectedCategory] : []}
                    filteredOptions={filteredCategories}
                    onOptionClick={(category) => {
                      if (selectedCategoryId === category.id) {
                        clearCategory();
                        return;
                      }

                      selectCategory(category);
                    }}
                    isOptionSelected={(category) => selectedCategoryId === category.id}
                    hoveredDescription={hoveredCategoryDescription}
                    setHoveredDescription={setHoveredCategoryDescription}
                    hoverHintText="Pasa el cursor por una categoría para ver su descripción."
                  />
                </div>

                <label htmlFor="resource-contact-email">
                  <span className={labelClass}>Email de contacto (opcional)</span>
                  <input
                    type="email"
                    id="resource-contact-email"
                    value={emailContacto}
                    onChange={(event) => setEmailContacto(event.target.value)}
                    placeholder="tu@email.com"
                    className={fieldBaseClass}
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label htmlFor="resource-suggested-category">
                  <span className={labelClass}>Sugerir nueva categoría</span>
                  <input
                    type="text"
                    id="resource-suggested-category"
                    value={categoriaSugerida}
                    onChange={(event) => setCategoriaSugerida(event.target.value)}
                    placeholder="Ej. Arquitectura de Software"
                    className={fieldBaseClass}
                  />
                </label>

                <div className="rounded-xl border border-border/60 bg-primaryColor/30 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-textSecondary">
                    Etiquetas relacionadas
                  </p>

                  <SuggestionOptionSelector
                    searchTerm={tagSearchTerm}
                    onSearchTermChange={setTagSearchTerm}
                    onClear={() => {
                      setTagSearchTerm("");
                      syncSelectedTags([]);
                    }}
                    selectedOptions={selectedTags}
                    filteredOptions={filteredTags}
                    onOptionClick={(tag) => toggleTag(tag)}
                    isOptionSelected={(tag) => selectedTagIds.includes(tag.id)}
                    hoveredDescription={hoveredTagDescription}
                    setHoveredDescription={setHoveredTagDescription}
                    hoverHintText="Pasa el cursor por una etiqueta para ver su descripción."
                  />
                </div>
              </div>
            </div>
          </div>

          <input
            type="text"
            name="website"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden
          />

          {isLoadingFilters ? (
            <p className="mt-3 text-sm text-textSecondary">Cargando categorías y etiquetas...</p>
          ) : null}

          {filtersError ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {filtersError}
            </p>
          ) : null}

          {submitError ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {submitError}
            </p>
          ) : null}
          {submitSuccess ? (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              {submitSuccess}
            </p>
          ) : null}

          {turnstileSiteKey ? (
            <div className="rounded-xl border border-border/60 bg-primaryColor/30 p-3">
              <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="dark" />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl border border-buttonColor bg-buttonColor/70 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] hover:bg-buttonColor disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Enviando..." : "Enviar sugerencia"}
          </button>
        </form>
      </article>
    </section>
  );
}

export default SugestionsForResources;
