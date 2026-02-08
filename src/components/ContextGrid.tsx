import React from 'react';
import type { VisualContext, ProductCategory, CustomContextFields } from '@/types';

interface ContextGridProps {
  contexts: VisualContext[];
  selectedContext: VisualContext;
  onSelect: (ctx: VisualContext) => void;
  category: ProductCategory;
  customContext: CustomContextFields;
  useCustomContext: boolean;
  onCustomContextChange: (fields: CustomContextFields) => void;
  onToggleCustomContext: (value: boolean) => void;
}

const FIELD_CONFIG = [
  {
    key: 'environment' as const,
    label: 'Lieu / Environnement',
    placeholder: 'Ex: Salle de classe maternelle, jardin exterieur, showroom moderne...',
    hint: 'Ou se situe la scene ?',
  },
  {
    key: 'surface' as const,
    label: 'Surface / Support',
    placeholder: 'Ex: Table en bois clair, sol en parquet, herbe verte, beton lisse...',
    hint: 'Sur quoi est pose le produit ?',
  },
  {
    key: 'lighting' as const,
    label: 'Eclairage',
    placeholder: 'Ex: Lumiere naturelle douce, golden hour, studio soft box...',
    hint: 'Type et direction de la lumiere',
  },
  {
    key: 'mood' as const,
    label: 'Ambiance / Mood',
    placeholder: 'Ex: Chaleureux et accueillant, minimaliste et epure, ludique et colore...',
    hint: 'Quelle atmosphere generale ?',
  },
  {
    key: 'props' as const,
    label: 'Elements de decor',
    placeholder: 'Ex: Plantes vertes, livres pour enfants, crayons de couleur, coussins...',
    hint: 'Objets autour du produit (optionnel)',
  },
  {
    key: 'extra' as const,
    label: 'Instructions supplementaires',
    placeholder: 'Ex: Angle en plongee, flou d\'arriere-plan prononce, enfant visible de dos...',
    hint: 'Toute autre precision pour l\'IA',
  },
];

export const ContextGrid: React.FC<ContextGridProps> = ({
  contexts,
  selectedContext,
  onSelect,
  category,
  customContext,
  useCustomContext,
  onCustomContextChange,
  onToggleCustomContext,
}) => {
  // Guard against stale HMR state where customContext might still be a string
  const ctx: CustomContextFields = typeof customContext === 'object' && customContext !== null
    ? customContext
    : { environment: '', surface: '', lighting: '', mood: '', props: '', extra: '' };

  const updateField = (key: keyof CustomContextFields, value: string) => {
    onCustomContextChange({ ...ctx, [key]: value });
  };

  const filledCount = FIELD_CONFIG.filter(f => (ctx[f.key] || '').trim()).length;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Choisir le Contexte</h2>
        <span className="text-sm bg-white px-2 py-1 rounded border text-gray-500">
          {category === 'GAME' ? 'Jeux Educatifs' : 'Mobilier'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {contexts.map((ctx) => {
          const isSelected = selectedContext.id === ctx.id && !useCustomContext;
          return (
            <button
              key={ctx.id}
              onClick={() => onSelect(ctx)}
              className={`relative group p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                isSelected
                  ? 'border-sola-primary bg-white ring-1 ring-sola-primary'
                  : 'border-transparent bg-white hover:border-gray-200'
              }`}
            >
              <div className="text-3xl mb-3">{ctx.icon}</div>
              <h3
                className={`font-bold text-sm ${isSelected ? 'text-sola-primary' : 'text-gray-800'}`}
              >
                {ctx.label}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-snug">{ctx.description}</p>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sola-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Context */}
      <div className="mt-4">
        <button
          onClick={() => onToggleCustomContext(!useCustomContext)}
          className={`w-full p-3 rounded-lg border-2 text-sm font-medium transition-all text-left flex items-center justify-between ${
            useCustomContext
              ? 'border-sola-primary bg-white ring-1 ring-sola-primary text-sola-primary'
              : 'border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'
          }`}
        >
          <span>{useCustomContext ? 'Contexte personnalise (actif)' : '+ Contexte personnalise'}</span>
          {useCustomContext && filledCount > 0 && (
            <span className="text-xs bg-sola-primary/10 text-sola-primary px-2 py-0.5 rounded-full">
              {filledCount}/{FIELD_CONFIG.length} champs
            </span>
          )}
        </button>

        {useCustomContext && (
          <div className="mt-3 bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              Remplis les champs pertinents pour guider l'IA. Seuls les champs remplis seront utilises.
            </p>

            {FIELD_CONFIG.map((field) => (
              <div key={field.key}>
                <div className="flex items-baseline justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    {field.label}
                  </label>
                  <span className="text-[10px] text-gray-300">{field.hint}</span>
                </div>
                <input
                  type="text"
                  value={ctx[field.key] || ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-sola-primary focus:ring-1 focus:ring-sola-primary focus:outline-none placeholder:text-gray-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
