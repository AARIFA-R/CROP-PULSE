import { DiseaseKnowledgeItem } from '../types';

export const DISEASE_KNOWLEDGE_BASE: DiseaseKnowledgeItem[] = [
  {
    id: 'tomato_early_blight',
    plant: 'Tomato (Solanum lycopersicum)',
    disease: 'Early Blight (Alternaria solani)',
    severityBenchmark: 38,
    level: 'Moderate',
    description: 'A pervasive fungal disease characterized by concentric target-like brown spots on foliage, leading to premature defoliation and yield loss.',
    symptoms: 'Brown to black spots with concentric rings on older leaves, surrounded by yellow chlorotic halos. Stems develop dark sunken collar rot.',
    causes: 'Alternaria solani spores surviving in crop residues and soil, accelerated by warm temperatures (24-29°C) and heavy morning dews or frequent rainfall.',
    recommendations: {
      immediate: [
        'Prune and destroy infected lower leaves immediately to interrupt spore production.',
        'Apply an organic copper fungicide or chlorothalonil to suppress lesion expansion.',
        'Cease any overhead sprinkler watering; irrigate exclusively at the root zone.'
      ],
      preventive: [
        'Adopt a minimum 3-year non-solanaceous crop rotation (avoid potatoes, peppers, eggplants).',
        'Apply a 2-inch organic straw or plastic mulch barrier to stop rain splash transmission.',
        'Space plants 60-90 cm apart in well-ventilated, sunny rows.'
      ],
      cultural: [
        'Stake and trellis vines to elevate vegetative canopy above damp soil.',
        'Sanitize all shears, stakes, and cages with 70% alcohol solution.'
      ],
      environmental: [
        'Ensure soil organic matter is maintained and avoid excess nitrogen fertilization which creates soft susceptible foliage.',
        'Promote morning airflow through greenhouse vents or field orienting.'
      ],
      treatment: [
        'Preventative/Early: Mancozeb 75 WP (2g/L) or Copper Oxychloride 50 WP (2.5g/L).',
        'Bio-treatment: Foliar spray of Bacillus subtilis or Trichoderma viride.'
      ],
      monitoring: [
        'Scout bottom leaf canopy twice weekly following rainy weather.',
        'Flag index plants to verify if lesions cease spreading upwards.'
      ]
    }
  },
  {
    id: 'tomato_late_blight',
    plant: 'Tomato (Solanum lycopersicum)',
    disease: 'Late Blight (Phytophthora infestans)',
    severityBenchmark: 75,
    level: 'Severe',
    description: 'An aggressive, destructive water-mold disease capable of destroying entire tomato and potato fields within days under cool, moist conditions.',
    symptoms: 'Irregular water-soaked greasy brown lesions rapidly expanding across leaves. White cottony mold sporulates on leaf undersides during high humidity.',
    causes: 'Phytophthora infestans oomycete active in cool, foggy or rainy weather (15-20°C with >90% humidity).',
    recommendations: {
      immediate: [
        'Immediately rogue (uproot) and destroy heavily infected vines; seal in airtight bags.',
        'Spray high-efficacy systemic translaminar fungicides (Cymoxanil, Dimethomorph, or Metalaxyl).'
      ],
      preventive: [
        'Plant certified blight-resistant hybrids (e.g., Mountain Magic, Defiant, Crimson Crush).',
        'Eliminate volunteer tomato and cull potato piles within 1 km radius.'
      ],
      cultural: [
        'Irrigate only in the early morning hours so leaves dry rapidly.',
        'Maintain wide row spacing to maximize sunlight penetration.'
      ],
      environmental: [
        'Do not plant downwind of potato fields or standing water bodies.',
        'Monitor local plant pathology alerts and weather-based disease forecasting.'
      ],
      treatment: [
        'Chemical: Dimethomorph 50% WP (1g/L) + Mancozeb (2g/L) or Famoxadone + Cymoxanil.',
        'Organic: Fixed copper sprays applied strictly before infection sets in.'
      ],
      monitoring: [
        'Daily field scouting during rainy spells; check leaf undersides for white fuzz.'
      ]
    }
  },
  {
    id: 'apple_scab',
    plant: 'Apple (Malus domestica)',
    disease: 'Apple Scab (Venturia inaequalis)',
    severityBenchmark: 42,
    level: 'Moderate',
    description: 'A major fungal problem in humid temperate apple orchards that causes olive-green to black velvety spots on leaves and corky blemishes on fruit.',
    symptoms: 'Olive-drab or brown spots with irregular margins on young leaves, turning darker and velvet-like. Severe infections cause distorted cupped leaves and defoliation.',
    causes: 'Venturia inaequalis overwintering in fallen leaves on orchard floor, releasing ascospores during spring green-tip and bloom rain events.',
    recommendations: {
      immediate: [
        'Rake and shred or compost all fallen orchard leaves to minimize ascospore load.',
        'Apply kickback curative fungicides (Myclobutanil or Difenoconazole) within 48-72h of rain.'
      ],
      preventive: [
        'Plant scab-resistant cultivars such as Liberty, Honeycrisp, Enterprise, or Prima.',
        'Apply a 5% urea spray in late autumn to accelerate decomposition of leaf litter.'
      ],
      cultural: [
        'Prune orchard trees annually to open the canopy to rapid drying and sun exposure.',
        'Mow grass low between tree alleys to reduce humidity buildup.'
      ],
      environmental: [
        'Calculate Mills infection periods based on hours of leaf wetness and temperature.'
      ],
      treatment: [
        'Protective: Captan 50 WP (2.5g/L) or Mancozeb from bud break to petal fall.',
        'Organic: Wettable sulfur or potassium bicarbonate sprays.'
      ],
      monitoring: [
        'Inspect new cluster leaves weekly from silver tip through 3 weeks post-bloom.'
      ]
    }
  },
  {
    id: 'corn_common_rust',
    plant: 'Corn / Maize (Zea mays)',
    disease: 'Common Rust (Puccinia sorghi)',
    severityBenchmark: 28,
    level: 'Mild',
    description: 'A foliar rust disease forming brick-red to dark brown pustules on both upper and lower leaf surfaces of sweet and field corn.',
    symptoms: 'Oval to elongated powdery golden-brown to cinnamon pustules (uredinia) bursting through the leaf epidermis, turning brownish-black late season.',
    causes: 'Puccinia sorghi fungal spores carried over long distances by northward tropical air currents, thriving in high relative humidity (>95%) and 16-25°C.',
    recommendations: {
      immediate: [
        'Assess economic threshold: if rust pustules cover >5% of leaves at or above the ear before tasseling, fungicide application is warranted.',
        'Maintain balanced fertility with sufficient potassium to strengthen leaf structure.'
      ],
      preventive: [
        'Select hybrid corn varieties with qualitative Rp resistance genes.',
        'Plant early in the optimal planting window to reach maturity before peak spore flights.'
      ],
      cultural: [
        'Maintain uniform crop density and eradicate volunteer corn seedlings.',
        'Rotate with non-host crops (soybeans, pulses, brassicas).'
      ],
      environmental: [
        'Optimize field drainage to prevent localized humidity pockets.'
      ],
      treatment: [
        'Foliar: Azoxystrobin + Difenoconazole or Pyraclostrobin + Fluxapyroxad.',
        'Organic: Neem-based oil or sulfur formulations at early onset.'
      ],
      monitoring: [
        'Check leaves below the ear leaf starting at V6 growth stage through grain fill.'
      ]
    }
  },
  {
    id: 'grape_powdery_mildew',
    plant: 'Grapevine (Vitis vinifera)',
    disease: 'Powdery Mildew (Erysiphe necator)',
    severityBenchmark: 52,
    level: 'Moderate',
    description: 'A widespread vineyard disease creating a fine, flour-like white-grey fungal powdery coating across leaves, shoots, and berry clusters.',
    symptoms: 'Patches of white-grey powdery dust on upper and lower leaf surfaces, leaf crinkling, stunted shoot growth, and fruit splitting.',
    causes: 'Erysiphe necator surviving in dormant bark crevices, favored by shade, warm temperatures (20-27°C), and high humidity without free rainfall.',
    recommendations: {
      immediate: [
        'Apply potassium bicarbonate, micronized wettable sulfur, or systemic DMI fungicides.',
        'Carefully shoot-thin and leaf-pull around grape fruit clusters to enhance airflow.'
      ],
      preventive: [
        'Implement routine preventative sulfur spray schedules starting at 2-3 inch shoot growth.',
        'Establish trellising (e.g., VSP) that facilitates wind movement through the vine canopy.'
      ],
      cultural: [
        'Avoid excessive nitrogen fertilizer which stimulates excessive dense vegetative growth.',
        'Disinfect vineyard shears between rows.'
      ],
      environmental: [
        'Orient vineyard rows parallel to prevailing breezes whenever possible.'
      ],
      treatment: [
        'Sulfur dust (80% WP) or Tebuconazole (1ml/L) or Kresoxim-methyl.',
        'Organic: Potassium bicarbonate (Kaligreen) or Horticultural paraffinic oils.'
      ],
      monitoring: [
        'Inspect shady lower interior leaves and cluster zones on a 5-day cycle.'
      ]
    }
  },
  {
    id: 'healthy_leaf_profile',
    plant: 'Healthy Plant Foliage',
    disease: 'No Disease Detected (Healthy)',
    severityBenchmark: 3,
    level: 'Healthy',
    description: 'Vigorous photosynthetic leaf tissue demonstrating intact chlorophyll pigments, clean cell wall structure, and zero fungal or bacterial lesions.',
    symptoms: 'Uniform vibrant green coloration, crisp margins, clear venation, and absence of chlorosis, necrosis, curling, or fungal sporulation.',
    causes: 'Optimal balance of soil nutrition, adequate light intensity, consistent irrigation, and robust plant immune defenses.',
    recommendations: {
      immediate: [
        'Continue regular irrigation and micro-nutrient feeding schedule.',
        'Keep leaves dry during watering cycles.'
      ],
      preventive: [
        'Maintain preventative soil drench with beneficial mycorrhizal fungi or Trichoderma.',
        'Apply organic compost mulch to maintain root zone moisture and beneficial microbes.'
      ],
      cultural: [
        'Perform gentle sanitization of gardening implements before pruning.',
        'Space crops appropriately for optimal light and airflow.'
      ],
      environmental: [
        'Maintain soil pH between 6.0 and 6.8 for optimal nutrient uptake.',
        'Monitor ambient temperature and soil moisture levels with digital probes.'
      ],
      treatment: [
        'No chemical interventions required. Optional light seaweed extract foliar tonic.'
      ],
      monitoring: [
        'Perform weekly routine photo scans in CROP PULSE to track long-term health baseline.'
      ]
    }
  }
];

export function findDiseaseRecord(query: string): DiseaseKnowledgeItem {
  const q = query.toLowerCase();
  const found = DISEASE_KNOWLEDGE_BASE.find(item => 
    item.disease.toLowerCase().includes(q) || 
    item.plant.toLowerCase().includes(q) ||
    item.id.toLowerCase().includes(q)
  );
  return found || DISEASE_KNOWLEDGE_BASE[0];
}
