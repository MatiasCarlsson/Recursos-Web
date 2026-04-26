"use client";

type SelectableOption = {
  id: number;
  label: string;
  description?: string;
};

type SuggestionOptionSelectorProps = {
  searchTerm: string;
  onSearchTermChange: (nextValue: string) => void;
  onClear: () => void;
  selectedOptions: SelectableOption[];
  filteredOptions: SelectableOption[];
  onOptionClick: (option: SelectableOption) => void;
  isOptionSelected: (option: SelectableOption) => boolean;
  hoveredDescription: string | null;
  setHoveredDescription: (nextValue: string | null) => void;
  hoverHintText: string;
};

export default function SuggestionOptionSelector({
  searchTerm,
  onSearchTermChange,
  onClear,
  selectedOptions,
  filteredOptions,
  onOptionClick,
  isOptionSelected,
  hoveredDescription,
  setHoveredDescription,
  hoverHintText,
}: SuggestionOptionSelectorProps) {
  const selectedDescription =
    selectedOptions.length > 0
      ? (selectedOptions[selectedOptions.length - 1]?.description ?? null)
      : null;

  return (
    <div className="mt-1.5 space-y-2 rounded-lg border border-border/60 bg-primaryColor/60 p-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Filtrar opciones..."
          className="w-full rounded-md border border-border/70 bg-primaryColor px-2.5 py-1.5 text-xs text-textPrimary placeholder:text-textSecondary/80 outline-none transition-all focus:border-accent/70"
        />
        <button
          type="button"
          className="rounded-md border border-border/70 bg-primaryColor px-2 py-1.5 text-xs text-textSecondary transition hover:border-accent/60 hover:text-textPrimary"
          onClick={onClear}
        >
          Limpiar
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {selectedOptions.length > 0 ? (
          selectedOptions.map((option) => (
            <span
              key={option.id}
              className="rounded-full border border-buttonColor/60 bg-buttonColor/18 px-2.5 py-1 text-xs text-textPrimary"
            >
              {option.label}
            </span>
          ))
        ) : (
          <span className="text-xs text-textSecondary">Sin selección</span>
        )}
      </div>

      <div className="h-36 space-y-1 overflow-y-auto rounded-lg border border-border/70 bg-primaryColor/90 px-2 py-2">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => {
            const isSelected = isOptionSelected(option);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onOptionClick(option)}
                onMouseEnter={() => setHoveredDescription(option.description ?? null)}
                onMouseLeave={() => setHoveredDescription(null)}
                className={`w-full rounded-md px-2 py-1 text-left text-sm transition-all ${
                  isSelected
                    ? "bg-buttonColor/22 text-textPrimary"
                    : "text-textSecondary hover:bg-white/6 hover:text-textPrimary"
                }`}
              >
                {option.label}
              </button>
            );
          })
        ) : (
          <p className="px-2 py-1 text-sm text-textSecondary">Sin resultados.</p>
        )}
      </div>

      <p className="rounded-md border border-border/40 bg-primaryColor/40 px-2.5 py-2 text-xs leading-relaxed text-textPrimary/90 font-semibold">
        {hoveredDescription ?? selectedDescription ?? hoverHintText}
      </p>
    </div>
  );
}
