import { ProductCategory, VisualContext } from './types';

export const SOLA_IDENTITY_PROMPT = `
Style visual identity: Sola Didact. 
Atmosphere: Educational, warm, natural, professional, Swiss/European vibe. 
Lighting: Soft, realistic, natural light. 
Colors: Accents of Brick Red (#C43333), Light Beige background (#F9F7F4), Light Wood, soft textiles.
Constraints: No excessive saturation, no aggressive advertising style, no artificial rendering. 
If people are present: No recognizable faces, soft blur on people, focus strictly on the product.
`;

export const GAME_CONTEXTS: VisualContext[] = [
  {
    id: 'g1',
    label: 'Table Bois (Catalogue)',
    description: 'Jeu posé sur une table en bois clair, lumière naturelle.',
    promptModifier: 'Educational game placed on a light wood table. Top-down or slightly angled view. Natural light coming from the side. Neutral beige background. Premium catalog photography style. Calm ambiance.',
    icon: '🪑'
  },
  {
    id: 'g2',
    label: 'En Situation',
    description: 'Mains d\'enfants ou d\'adultes, interaction naturelle.',
    promptModifier: 'Close-up of the educational game being used. Visible hands of children or adults interacting naturally with the pieces. Shallow depth of field. No faces visible. Authentic play session atmosphere.',
    icon: '🙌'
  },
  {
    id: 'g3',
    label: 'Salle de Classe',
    description: 'Tables d\'école, arrière-plan flou.',
    promptModifier: 'Educational game placed on a school desk. Blurred background showing a realistic European classroom environment with educational materials. Professional and realistic tone.',
    icon: '🏫'
  },
  {
    id: 'g4',
    label: 'Coin Lecture',
    description: 'Tapis, coussins, ambiance chaleureuse.',
    promptModifier: 'Educational game placed on a soft rug or near comfortable cushions. Cozy reading corner atmosphere. Warm lighting. Elements of light wood and textiles in the background.',
    icon: '🧸'
  },
  {
    id: 'g5',
    label: 'Mise en Scène Créative',
    description: 'Décor léger inspiré du thème.',
    promptModifier: 'Creative composition of the educational game. Light decorative elements related to the game\'s theme arranged around it. Educational and credible, not fantasy. Balanced composition.',
    icon: '🎨'
  },
  {
    id: 'g6',
    label: 'Hero Shot (Social)',
    description: 'Fond propre, esthétique pour Instagram.',
    promptModifier: 'Hero shot of the educational game. High aesthetic value. Clean, minimalist background (soft beige or white). Perfect composition for Instagram cover or Reel thumbnail. Sharp focus.',
    icon: '📸'
  }
];

export const FURNITURE_CONTEXTS: VisualContext[] = [
  {
    id: 'f1',
    label: 'Classe Moderne',
    description: 'Environnement scolaire réaliste.',
    promptModifier: 'Furniture piece placed in a modern classroom. Surrounding elements: school tables, chairs, storage units. Realistic school environment. Bright, natural lighting.',
    icon: '🏫'
  },
  {
    id: 'f2',
    label: 'Salle de Jeux',
    description: 'Couleurs douces, design enfantin.',
    promptModifier: 'Furniture piece in a children\'s playroom. Soft pastel colors and brick red accents in decor. Playful but design-oriented environment. Child-friendly atmosphere.',
    icon: '🎲'
  },
  {
    id: 'f3',
    label: 'Coin Calme',
    description: 'Poufs, lumière chaude.',
    promptModifier: 'Furniture piece in a quiet corner. Surrounded by bean bags, low shelves. Warm, golden hour natural light. Relaxing atmosphere.',
    icon: '🤫'
  },
  {
    id: 'f4',
    label: 'Bureau Enseignant',
    description: 'Fonctionnalité adulte.',
    promptModifier: 'Furniture piece in a teacher\'s workspace or office. Functional setup. Professional atmosphere. Clean desk organization visible in periphery.',
    icon: '💼'
  },
  {
    id: 'f5',
    label: 'Crèche',
    description: 'Douceur, sécurité, nature.',
    promptModifier: 'Furniture piece in a nursery or daycare setting. Very soft lighting. Natural materials visible (wood, cotton). Safe and welcoming environment.',
    icon: '👶'
  },
  {
    id: 'f6',
    label: 'Minimaliste',
    description: 'Fond épuré, focus design.',
    promptModifier: 'Minimalist studio shot of the furniture. Clean, solid color background (Sola beige). Focus purely on the shape and design of the furniture. High contrast, sharp details.',
    icon: '✨'
  }
];