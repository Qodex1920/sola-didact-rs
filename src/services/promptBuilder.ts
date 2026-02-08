import type { ProductCategory, VisualContext, ProductAnalysis } from '@/types';

import brandIdentity from '@/prompts/brand-identity.json';
import negativeConstraints from '@/prompts/negative-constraints.json';
import promptTemplates from '@/prompts/prompt-templates.json';

function buildBrandSection(): string {
  const b = brandIdentity;
  return [
    `Brand: ${b.brand} (${b.origin}).`,
    `Atmosphere: ${b.atmosphere}.`,
    `Lighting: ${b.lighting.type}. Direction: ${b.lighting.direction}. Warmth: ${b.lighting.warmth}. Avoid: ${b.lighting.avoid}.`,
    `Color palette: Primary accent ${b.color_palette.primary_accent}, background ${b.color_palette.background}. Materials: ${b.color_palette.materials.join(', ')}. Tones: ${b.color_palette.tones}. Avoid: ${b.color_palette.avoid}.`,
    `Photography: ${b.photography_style.approach}. ${b.photography_style.realism}. Lens: ${b.photography_style.lens}. DoF: ${b.photography_style.depth_of_field}.`,
    `People: ${b.people_rules.faces}. Allowed: ${b.people_rules.allowed}. ${b.people_rules.focus}.`,
    `Strict constraints: ${b.strict_constraints.join('. ')}.`,
  ].join('\n');
}

function buildContextSection(context: VisualContext): string {
  return `Scene context: ${context.promptModifier}`;
}

function buildProductSection(analysis: ProductAnalysis | null, productDescription?: string): string {
  const lines: string[] = [];

  if (analysis) {
    lines.push(
      `Product: ${analysis.name_suggestion} (${analysis.product_type}).`,
      `Materials: ${analysis.materials}.`,
      `Colors: ${analysis.colors}.`,
      `Proportions: ${analysis.dimensions_estimate}.`,
      `Shape: ${analysis.shape}.`,
      `Key features to preserve: ${analysis.key_features}.`,
      `Texture: ${analysis.texture}.`,
    );
    if (analysis.components) lines.push(`Components: ${analysis.components}.`);
  }

  if (productDescription) {
    lines.push('');
    lines.push(`USER PRODUCT DESCRIPTION (important functional details from the owner):`);
    lines.push(productDescription);
    lines.push(`Use this description to understand how the product works, moves, or is used. This information is critical for accurate representation.`);
  }

  return lines.filter(Boolean).join('\n');
}

function buildNegativeSection(category: ProductCategory): string {
  const nc = negativeConstraints;
  const global = [
    ...nc.global.quality,
    ...nc.global.unwanted_elements,
    ...nc.global.style_issues,
    ...nc.global.people_issues,
    ...nc.global.composition_issues,
  ];
  const fidelity = nc.product_fidelity;
  const specific = category === 'FURNITURE' ? nc.furniture_specific : nc.game_specific;

  return [
    'MUST AVOID:',
    ...global.map(c => `- ${c}`),
    '',
    'PRODUCT FIDELITY RULES:',
    ...fidelity.map(c => `- ${c}`),
    '',
    `${category}-SPECIFIC RULES:`,
    ...specific.map(c => `- ${c}`),
  ].join('\n');
}

export function buildAnalyzePrompt(): string {
  const t = promptTemplates.analyze;
  const formatFields = Object.entries(t.output_format)
    .map(([key, desc]) => `  "${key}": "${desc}"`)
    .join(',\n');

  return [
    t.instruction,
    '',
    'Return your analysis as a valid JSON object with these fields:',
    '{',
    formatFields,
    '}',
    '',
    'Rules:',
    ...t.rules.map((r: string) => `- ${r}`),
  ].join('\n');
}

export function buildEditPrompt(
  context: VisualContext,
  category: ProductCategory,
  productAnalysis: ProductAnalysis | null,
  customContext?: string,
  productDescription?: string
): string {
  const t = promptTemplates.edit;
  const contextSection = customContext
    ? `Custom scene: ${customContext}`
    : buildContextSection(context);

  return [
    t.role,
    '',
    'CRITICAL RULES:',
    ...t.critical_rules.map((r: string) => `- ${r}`),
    '',
    '--- SCENE ---',
    contextSection,
    '',
    '--- BRAND IDENTITY ---',
    buildBrandSection(),
    '',
    (productAnalysis || productDescription) ? '--- PRODUCT TO PRESERVE ---' : '',
    buildProductSection(productAnalysis, productDescription),
    '',
    '--- CONSTRAINTS ---',
    buildNegativeSection(category),
  ].filter(Boolean).join('\n');
}

export function buildGeneratePrompt(
  context: VisualContext,
  category: ProductCategory,
  productAnalysis: ProductAnalysis | null,
  customContext?: string,
  productDescription?: string
): string {
  const t = promptTemplates.generate;
  const contextSection = customContext
    ? `Custom scene: ${customContext}`
    : buildContextSection(context);

  return [
    t.role,
    '',
    'CRITICAL RULES:',
    ...t.critical_rules.map((r: string) => `- ${r}`),
    '',
    '--- SCENE ---',
    contextSection,
    '',
    '--- BRAND IDENTITY ---',
    buildBrandSection(),
    '',
    (productAnalysis || productDescription) ? '--- PRODUCT TO RECREATE ---' : '',
    buildProductSection(productAnalysis, productDescription),
    '',
    '--- CONSTRAINTS ---',
    buildNegativeSection(category),
  ].filter(Boolean).join('\n');
}

export function buildVideoPrompt(
  context: VisualContext,
  category: ProductCategory,
  productAnalysis: ProductAnalysis | null,
  customContext?: string,
  productDescription?: string
): string {
  const t = promptTemplates.video;
  const contextSection = customContext
    ? `Custom scene: ${customContext}`
    : buildContextSection(context);

  return [
    t.role,
    '',
    'CRITICAL RULES:',
    ...t.critical_rules.map((r: string) => `- ${r}`),
    '',
    '--- SCENE ---',
    contextSection,
    '',
    '--- BRAND IDENTITY ---',
    buildBrandSection(),
    '',
    (productAnalysis || productDescription) ? '--- PRODUCT ---' : '',
    buildProductSection(productAnalysis, productDescription),
    '',
    '--- CONSTRAINTS ---',
    buildNegativeSection(category),
    '',
    'Camera: Smooth, slow dolly or orbit movement revealing the product. Cinematic slow motion. Professional product video aesthetic.',
    '',
    'LANGUAGE: All voices, narration, dialogue, and any visible text MUST be in French (français). Never use English.',
  ].filter(Boolean).join('\n');
}
