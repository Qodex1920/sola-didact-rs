import { ProductCategory, VisualContext, AspectRatio } from '@/types';

export const SOLA_IDENTITY_PROMPT = `
Style visual identity: Sola Didact — Swiss educational specialist since 40+ years.
Brand essence: Jeu éducatif, qualité, proximité, authenticité.
Atmosphere: Warm, natural, welcoming. European/Swiss environment.
Lighting: Natural light only — soft, warm, realistic.
Materials: Light wood (bois clair), soft textiles, cotton, natural materials.
Colors: Fresh green accents (#5dac3e), dark charcoal (#3a383e). No saturated/neon colors.
Style: Realistic, editorial. Premium catalog for mobilier scolaire or jeux éducatifs.
People: No recognizable faces, natural postures only. Hands, silhouettes, soft blur OK.
Forbidden: Aggressive advertising, text overlays, unrealistic decor, fantasy, excessive saturation.
Goal: Make people want to play (donner envie de jouer) and trust the quality.
`;

export const ASPECT_RATIO_OPTIONS: {
  value: AspectRatio;
  label: string;
  description: string;
  videoOnly?: boolean;
  disabledInVideo?: boolean;
}[] = [
  { value: '1:1', label: 'Carré', description: 'Instagram, Facebook', disabledInVideo: true },
  { value: '4:5', label: 'Portrait', description: 'Instagram Feed', disabledInVideo: true },
  { value: '16:9', label: 'Paysage', description: 'YouTube, Website' },
  { value: '9:16', label: 'Story / Reel', description: 'Instagram, TikTok' },
];

export const GAME_CONTEXTS: VisualContext[] = [
  {
    id: 'g1',
    label: 'Table Bois (Catalogue)',
    description: 'Jeu posé sur une table en bois clair, lumière naturelle.',
    promptModifier:
      'Educational game (jeu éducatif) placed on a light wood table (bois clair). Top-down or slightly angled view. Natural light coming from the side. Neutral warm background. Premium catalog photography style. Calm, inviting ambiance. No text overlay.',
    icon: '🪑',
  },
  {
    id: 'g2',
    label: 'En Situation',
    description: "Mains d'enfants ou d'adultes, interaction naturelle.",
    promptModifier:
      "Close-up of the educational game being used naturally. Visible hands of children or adults interacting with the pieces. Shallow depth of field. No recognizable faces — only hands, natural postures. Authentic play session atmosphere. Bois clair table surface. No text overlay.",
    icon: '🙌',
  },
  {
    id: 'g3',
    label: 'Salle de Classe',
    description: "Tables d'école, arrière-plan flou.",
    promptModifier:
      'Educational game placed on a school desk in a realistic European classroom (mobilier scolaire). Blurred background showing educational materials and light wood furniture. Professional, editorial tone. Natural daylight. No text overlay.',
    icon: '🏫',
  },
  {
    id: 'g4',
    label: 'Coin Lecture',
    description: 'Tapis, coussins, ambiance chaleureuse.',
    promptModifier:
      'Educational game placed on a soft rug near comfortable cushions. Cozy reading corner (coin lecture) atmosphere. Warm natural lighting. Elements of light wood and soft textiles in the background. Welcoming and calm. No text overlay.',
    icon: '🧸',
  },
  {
    id: 'g5',
    label: 'Mise en Scène Créative',
    description: 'Décor léger inspiré du thème.',
    promptModifier:
      "Creative composition of the educational game with light decorative elements related to the game's theme. Educational and credible, not fantasy. Balanced composition. Natural materials (bois clair, cotton, textiles). No text overlay.",
    icon: '🎨',
  },
  {
    id: 'g6',
    label: 'Hero Shot (Social)',
    description: 'Fond propre, esthétique pour Instagram.',
    promptModifier:
      'Hero shot of the educational game. High aesthetic value. Clean, minimalist background (soft warm tone). Perfect composition for Instagram cover or Reel thumbnail. Sharp focus on the product. Natural light. No text overlay.',
    icon: '📸',
  },
  {
    id: 'g7',
    label: 'Noël',
    description: 'Ambiance festive, décor de fêtes.',
    promptModifier:
      'Educational game presented in a warm Christmas atmosphere. Subtle festive decorations: fairy lights, pine branches, wrapped gifts nearby. Warm golden lighting. Cozy European living room. Natural materials. No text overlay. No Santa Claus. Donner envie de jouer.',
    icon: '🎄',
  },
  {
    id: 'g8',
    label: 'Rentrée Scolaire',
    description: 'Fournitures, ambiance septembre.',
    promptModifier:
      'Educational game placed among school supplies (crayons, notebooks, ruler) on a light wood desk. Back-to-school atmosphere. Fresh, organized, motivating. Natural daylight. European school setting. No text overlay.',
    icon: '📚',
  },
  {
    id: 'g9',
    label: 'Saint-Nicolas',
    description: 'Tradition suisse, ambiance douce.',
    promptModifier:
      'Educational game in a Swiss Saint-Nicolas celebration atmosphere. Subtle traditional elements: mandarins, gingerbread, small gifts. Warm candlelight or golden hour lighting. Authentic, not commercial. No text overlay.',
    icon: '🎅',
  },
  {
    id: 'g10',
    label: 'Ambiance Boutique',
    description: 'Étagères, rayon, magasin.',
    promptModifier:
      'Educational game displayed on a wooden shelf in a charming toy shop (boutique de jeux). Surrounding games and educational materials visible. Warm, inviting retail atmosphere. Soft ambient lighting. European boutique style. No text overlay.',
    icon: '🏪',
  },
];

export const FURNITURE_CONTEXTS: VisualContext[] = [
  {
    id: 'f1',
    label: 'Classe Moderne',
    description: 'Environnement scolaire réaliste.',
    promptModifier:
      'Furniture piece (mobilier scolaire) placed in a modern European classroom. Surrounding elements: school tables, chairs, storage units. Realistic school environment. Bright natural lighting. Light wood and clean lines. No text overlay.',
    icon: '🏫',
  },
  {
    id: 'f2',
    label: 'Salle de Jeux',
    description: 'Couleurs douces, design enfantin.',
    promptModifier:
      "Furniture piece in a children's playroom. Soft pastel colors and fresh green accents in decor. Playful but design-oriented environment. Child-friendly atmosphere. Natural materials. No text overlay.",
    icon: '🎲',
  },
  {
    id: 'f3',
    label: 'Coin Calme',
    description: 'Poufs, lumière chaude.',
    promptModifier:
      'Furniture piece in a quiet corner. Surrounded by bean bags, low shelves. Warm, golden hour natural light. Relaxing atmosphere. Soft textiles and light wood. No text overlay.',
    icon: '🤫',
  },
  {
    id: 'f4',
    label: 'Bureau Enseignant',
    description: 'Fonctionnalité adulte.',
    promptModifier:
      "Furniture piece in a teacher's workspace or office. Functional setup. Professional atmosphere. Clean desk organization visible in periphery. Natural light. No text overlay.",
    icon: '💼',
  },
  {
    id: 'f5',
    label: 'Crèche',
    description: 'Douceur, sécurité, nature.',
    promptModifier:
      'Furniture piece in a nursery or daycare setting (crèche). Very soft lighting. Natural materials visible (bois clair, cotton). Safe and welcoming environment. No text overlay.',
    icon: '👶',
  },
  {
    id: 'f6',
    label: 'Minimaliste',
    description: 'Fond épuré, focus design.',
    promptModifier:
      'Minimalist studio shot of the furniture (mobilier). Clean, solid warm background. Focus purely on the shape and design. High contrast, sharp details. Premium catalog style. No text overlay.',
    icon: '✨',
  },
  {
    id: 'f7',
    label: 'Noël',
    description: 'Mobilier en ambiance festive.',
    promptModifier:
      'Furniture piece in a warm Christmas atmosphere. Subtle festive decorations around it. Warm golden lighting. Cozy European interior. Natural materials and textiles. No text overlay.',
    icon: '🎄',
  },
  {
    id: 'f8',
    label: 'Classe Flexible',
    description: 'Aménagement modulable, ilots.',
    promptModifier:
      'Furniture piece shown in a flexible classroom layout (classe flexible). Modular arrangement with learning islands. Active learning environment. Natural light. Multiple configurations visible. No text overlay.',
    icon: '🔄',
  },
  {
    id: 'f9',
    label: 'Extérieur',
    description: 'Cour, terrasse, nature.',
    promptModifier:
      'Furniture piece placed outdoors in a school courtyard or garden terrace. Natural greenery around. Bright natural daylight. European outdoor educational setting. No text overlay.',
    icon: '🌿',
  },
];
