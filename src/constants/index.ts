import { ProductCategory, VisualContext, AspectRatio } from "@/types";

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
  {
    value: "1:1",
    label: "Carré",
    description: "Instagram, Facebook",
    disabledInVideo: true,
  },
  {
    value: "4:5",
    label: "Portrait",
    description: "Instagram Feed",
    disabledInVideo: true,
  },
  { value: "16:9", label: "Paysage", description: "YouTube, Website" },
  { value: "9:16", label: "Story / Reel", description: "Instagram, TikTok" },
];

export const GAME_CONTEXTS: VisualContext[] = [
  {
    id: "g1",
    label: "Table Bois (Catalogue)",
    description: "Jeu posé sur une table en bois clair, lumière naturelle.",
    promptModifier:
      "Educational game placed on a clean light wood table (oak or birch). Top-down or slightly angled view (15-25 degrees from above). Soft natural side light from a window, casting gentle shadows to the right. Neutral warm background, slightly out of focus. Premium catalog photography style. Clean, calm composition with generous negative space around the product. No text overlay. No surrounding clutter.",
    icon: "🪑",
  },
  {
    id: "g2",
    label: "En Situation",
    description: "Mains d'enfants ou d'adultes jouant avec le jeu.",
    promptModifier:
      "Close-up of the educational game being played naturally. Hands of children or adults interacting with the pieces — picking up, placing, or exploring them. Adapt the interaction style to the specific game: stacking, sorting, matching, building, or reading. Shallow depth of field with the product and hands in sharp focus. Warm indoor light. The surface and background should feel natural and slightly varied — a wooden table, a play mat, or a soft rug. No recognizable faces. Candid, authentic feel. No text overlay.",
    icon: "🙌",
  },
  {
    id: "g3",
    label: "Salle de Classe",
    description: "Tables d'école, arrière-plan flou.",
    promptModifier:
      "Educational game placed on a school desk in a modern European classroom. Light wood or white laminate desk surface. Blurred classroom background: whiteboard, shelves, other desks, educational posters. A few pencils or notebooks subtly visible near the product, not competing with it. Natural daylight from large windows mixed with soft overhead light. Eye-level or slightly above angle. Professional, institutional atmosphere. No text overlay.",
    icon: "🏫",
  },
  {
    id: "g4",
    label: "Coin Lecture",
    description: "Tapis, coussins, ambiance chaleureuse.",
    promptModifier:
      "Educational game placed in a cozy reading corner. Soft rug or fabric play mat as surface. Surrounding elements: cushions, a low bookshelf, a plush toy partially visible. Warm golden hour light from a side window creating inviting shadows. Low camera angle (near ground level), intimate perspective. The overall arrangement can vary slightly — different cushion colors, book spines, or fabric textures — but always maintains a warm, safe, hygge feeling. No text overlay.",
    icon: "🧸",
  },
  {
    id: "g5",
    label: "Mise en Scène Créative",
    description: "Décor adapté au thème du jeu.",
    promptModifier:
      "Creative editorial flat-lay or styled composition of the educational game. CRITICAL: Read the product details (name, theme, colors, features) provided below and choose 3-5 small decorative props that directly relate to the game's specific educational subject — for example: miniature wooden numbers for a counting game, colored pencils for a drawing game, small figurines for a storytelling game, letter blocks for a literacy game, fabric swatches for a color game. Props must visually echo the game's theme, NOT default to generic nature elements (no leaves, pebbles, or flowers unless the game is specifically about nature). Match prop colors to complement the product's own palette. Keep props small and secondary — the game is always the central hero. Top-down flat-lay or 45-degree styled angle on a clean surface (linen, light wood, or colored paper — pick what best suits the product's colors). Balanced editorial layout with intentional negative space. Vary the arrangement each time. No text overlay.",
    icon: "🎨",
  },
  {
    id: "g6",
    label: "Hero Shot (Social)",
    description: "Fond propre, esthétique pour réseaux sociaux.",
    promptModifier:
      "Hero shot of the educational game on a seamless solid background using one of the Sola Didact brand tones — choose between soft white (#f5f5f0), muted green (#5dac3e at low saturation, like a sage or soft olive wash), or dark charcoal (#3a383e). Pick the background color that best contrasts with and complements the product's own colors. Product centered with high aesthetic value. Soft key light from upper left, gentle fill from right, creating a clean defined shadow beneath the product. Sharp focus throughout. Perfect composition for Instagram cover or social media thumbnail. Minimalist, premium brand feel. No text overlay. No props.",
    icon: "📸",
  },
  {
    id: "g7",
    label: "Extérieur / Nature",
    description: "Plein air, jardin, nature suisse.",
    promptModifier:
      "Educational game photographed outdoors in a natural Swiss/European setting. Choose an appropriate outdoor surface: a weathered wooden garden table, a stone bench, a blanket on grass, or a tree stump. Surrounding nature elements vary naturally: green foliage, wildflowers, dappled sunlight through leaves, distant meadow or garden. Bright, soft natural daylight. Slightly elevated or eye-level angle. The specific outdoor setting should feel different each time while always conveying fresh air, nature, and a connection to the outdoors. Authentic, not staged. No text overlay.",
    icon: "🌿",
  },
  {
    id: "g8",
    label: "Fournitures Scolaires",
    description: "Crayons, cahiers, ambiance studieuse.",
    promptModifier:
      "Educational game placed among school supplies on a light wood desk. Surrounding items: colored pencils, notebooks, ruler, pencil case — arranged naturally, not competing with the product. Bright, organized atmosphere. Natural daylight. European school setting. The specific arrangement of supplies can vary but the overall feeling is fresh, motivating, and studious. No text overlay.",
    icon: "📚",
  },
  {
    id: "g9",
    label: "Ambiance Boutique",
    description: "Étagères, magasin de jouets.",
    promptModifier:
      "Educational game displayed on a wooden shelf in a charming European toy shop. Other games and educational materials visible on surrounding shelves, slightly out of focus. Warm, inviting retail atmosphere with soft ambient lighting. The shop details can vary — different shelf styles, neighboring products, background elements — but always convey a curated, quality boutique feel (not a large chain store). No text overlay.",
    icon: "🏪",
  },
];

export const FURNITURE_CONTEXTS: VisualContext[] = [
  {
    id: "f1",
    label: "Classe Moderne",
    description: "Environnement scolaire réaliste.",
    promptModifier:
      "Furniture piece (mobilier scolaire) placed in a modern European classroom. Surrounding school furniture: desks, chairs, storage units. Educational materials on shelves, whiteboard on wall. Large windows with natural light combined with soft overhead lighting. Eye-level or slightly above (20 degrees), three-quarter view showing furniture dimensions. Show furniture at realistic scale relative to standard classroom elements. Professional, institutional, modern. No text overlay.",
    icon: "🏫",
  },
  {
    id: "f2",
    label: "Salle de Jeux",
    description: "Couleurs douces, design enfantin.",
    promptModifier:
      "Furniture piece in a children's playroom. Soft pastel walls with fresh green accents in decor. Playful but design-oriented environment. Camera at child's eye-level (60-80cm height). The specific toys, cushions, and playful elements surrounding the furniture can vary naturally based on the furniture type — storage furniture might show organized toys, a table might show craft materials, seating might show cushions. Bright warm natural light. Child-friendly, safe atmosphere. No text overlay.",
    icon: "🎲",
  },
  {
    id: "f3",
    label: "Coin Calme",
    description: "Poufs, lumière chaude, atmosphère apaisante.",
    promptModifier:
      "Furniture piece as the anchor of a quiet corner. Bean bags, floor cushions, low shelves with books, and an indoor plant nearby. Warm golden hour window light creating long, inviting shadows. Low camera angle (ground level to 30 degrees), intimate and inviting. Carpet or soft flooring. Shallow depth of field with furniture sharp and cozy surroundings gently blurred. The exact arrangement of comfort elements may vary while keeping the overall relaxing, nurturing atmosphere. No text overlay.",
    icon: "🤫",
  },
  {
    id: "f4",
    label: "Bureau Enseignant",
    description: "Espace de travail adulte, fonctionnel.",
    promptModifier:
      "Furniture piece in a teacher's workspace or school office. Professional context: filing cabinet or bookshelf in background, desk organizer, notebook or laptop nearby, coffee mug. Office window light combined with desk lamp warmth. Eye-level adult height, straight-on or slight three-quarter angle. Include adult-sized references for correct proportions. Functional, organized, professional. No text overlay.",
    icon: "💼",
  },
  {
    id: "f5",
    label: "Crèche",
    description: "Douceur, sécurité, nature.",
    promptModifier:
      "Furniture piece in a nursery or daycare setting. Very soft, diffused natural light with no harsh contrasts. Pastel walls, natural wood elements, safe and welcoming design. Camera at toddler height (30-50cm). Soft, safe flooring visible (cork, play mat, carpet). Wooden toys, cotton items, and small plants as contextual elements — vary these based on the specific furniture piece. Show rounded edges and stable base clearly. Gentle, nurturing atmosphere. No text overlay.",
    icon: "👶",
  },
  {
    id: "f6",
    label: "Minimaliste",
    description: "Fond épuré, focus design.",
    promptModifier:
      "Minimalist studio shot of the furniture piece. Seamless solid background using one of the Sola Didact brand tones — choose between soft white (#f5f5f0), muted green (#5dac3e at low saturation, like a sage or soft olive wash), or dark charcoal (#3a383e). Pick the background color that best contrasts with and complements the furniture's own materials and colors. Three-quarter view at eye-level showing depth and proportions clearly. Studio lighting: key light from 45 degrees left, fill from right, rim light for edge definition. Clean defined shadow beneath for grounding. Sharp focus throughout, showcasing every design detail. Furniture centered with generous negative space. No props. No text overlay.",
    icon: "✨",
  },
  {
    id: "f7",
    label: "Classe Flexible",
    description: "Aménagement modulable, îlots collaboratifs.",
    promptModifier:
      "Furniture piece shown in a flexible classroom layout with modular learning islands. Multiple configurations visible — collaborative arrangement, individual work zones, or group clusters. Active learning environment. Bright natural light from large windows. Other complementary furniture pieces visible to suggest modularity. Show how the piece integrates into a dynamic, reconfigurable educational space. No text overlay.",
    icon: "🔄",
  },
  {
    id: "f8",
    label: "Extérieur",
    description: "Cour, terrasse, espace vert.",
    promptModifier:
      "Furniture piece placed outdoors in a school courtyard, garden terrace, or covered outdoor learning area. Natural greenery around — trees, grass, planters. Bright natural daylight with soft shadows. European outdoor educational setting. The specific outdoor context can vary: a paved schoolyard, a wooden deck, a garden path, or under a pergola. Choose the setting that best suits the specific furniture piece. No text overlay.",
    icon: "🌿",
  },
  {
    id: "f9",
    label: "Mise en Situation",
    description: "Mobilier en cours d'utilisation, adapté au produit.",
    promptModifier:
      "Furniture piece shown actively being used in its natural educational context. Adapt the scene to the specific piece: a chair is placed at a desk where someone just was (open notebook, pushed-back angle); a table shows an activity in progress (art materials, educational games spread out); a shelf displays organized materials with some items being reached for; storage shows neatly arranged school supplies with one drawer or door ajar. Include subtle human presence clues (a jacket on a chair, a bag nearby, blurred silhouettes in the background) without showing recognizable faces. The setting should match the furniture's intended use: primary school, nursery, office, or common area. Warm natural light. Each generation should feel like a candid moment captured during a real school day. No text overlay.",
    icon: "📷",
  },
];
