import { DiagnosisResult, BatchAnalysis } from '../types';

export const SAMPLE_INITIAL_DIAGNOSES: DiagnosisResult[] = [
  {
    id: 'diag-demo-01',
    userId: 'demo-user',
    plantName: 'Tomato (Solanum lycopersicum)',
    plantConfidence: 98.4,
    diseaseName: 'Early Blight (Alternaria solani)',
    diseaseConfidence: 96.2,
    severityPercentage: 42.5,
    severityLevel: 'Moderate',
    originalImageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a4a?auto=format&fit=crop&w=800&q=80',
    segmentationImageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a4a?auto=format&fit=crop&w=800&q=80',
    gradCamImageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a4a?auto=format&fit=crop&w=800&q=80',
    lesions: [
      { id: 'lesion-1', x: 25, y: 30, width: 20, height: 18, radius: 15, severityScore: 45, severity: 'moderate', type: 'necrosis' },
      { id: 'lesion-2', x: 55, y: 60, width: 22, height: 25, radius: 18, severityScore: 60, severity: 'severe', type: 'chlorosis' }
    ],
    gradCamHotspots: [
      { x: 35, y: 38, radius: 24, intensity: 0.92 },
      { x: 65, y: 70, radius: 28, intensity: 0.85 }
    ],
    recommendations: {
      immediate: [
        'Prune and safely dispose of all lower affected foliage showing concentric ring lesions.',
        'Avoid overhead sprinkler irrigation; switch immediately to root drip lines.'
      ],
      preventive: [
        'Maintain 24-36 inch spacing between tomato plants for optimal air circulation.',
        'Apply 2-inch organic straw mulch around the root zone to stop soil spore splashing.'
      ],
      treatment: [
        'Apply copper octanoate (copper soap fungicide) or Bacillus subtilis every 7 to 10 days.',
        'Chlorothalonil or Mancozeb protective foliar spray according to product label.'
      ],
      cultural: [
        'Implement 3-year crop rotation with non-solanaceous crops (e.g. beans, corn, brassicas).'
      ],
      monitoring: [
        'Inspect lower canopy twice weekly following high-humidity rain events.'
      ]
    },
    symptoms: 'Brown-to-black necrotic lesions with characteristic concentric target rings on older foliage surrounded by chlorotic yellow halos.',
    causes: 'Alternaria solani fungus persisting in crop debris and wet humid microclimates.',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    fileName: 'tomato_early_blight_sample_01.jpg',
    modelVersion: 'CropPulse-UNet-v2.4'
  },
  {
    id: 'diag-demo-02',
    userId: 'demo-user',
    plantName: 'Potato (Solanum tuberosum)',
    plantConfidence: 97.1,
    diseaseName: 'Late Blight (Phytophthora infestans)',
    diseaseConfidence: 94.8,
    severityPercentage: 74.0,
    severityLevel: 'Severe',
    originalImageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    segmentationImageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    gradCamImageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    lesions: [
      { id: 'lesion-3', x: 20, y: 20, width: 50, height: 45, radius: 35, severityScore: 80, severity: 'critical', type: 'necrosis' }
    ],
    gradCamHotspots: [
      { x: 45, y: 42, radius: 40, intensity: 0.98 }
    ],
    recommendations: {
      immediate: [
        'Urgent: Destroy and remove severely infected stems immediately to prevent field-wide epidemic.',
        'Discontinue all irrigation for 48 hours to suppress zoospore motility.'
      ],
      preventive: [
        'Plant certified disease-free seed tubers and resistant cultivars.'
      ],
      treatment: [
        'Copper sulfate / Bordeaux mixture applied prior to forecasted rain periods.',
        'Systemic fungicides such as cymoxanil or mefenoxam under agricultural specialist supervision.'
      ],
      cultural: [
        'Hill potatoes deeply to shield tubers from spore washdown.'
      ],
      monitoring: [
        'Monitor daily during cool, foggy, or wet weather conditions.'
      ]
    },
    symptoms: 'Water-soaked irregular pale green/brown lesions rapidly expanding with white moldy fungal growth on leaf undersides.',
    causes: 'Phytophthora infestans oomycete pathogen thriving under cool moist canopy conditions.',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    fileName: 'potato_late_blight_field_c3.jpg',
    modelVersion: 'CropPulse-UNet-v2.4'
  },
  {
    id: 'diag-demo-03',
    userId: 'demo-user',
    plantName: 'Bell Pepper (Capsicum annuum)',
    plantConfidence: 99.2,
    diseaseName: 'Healthy Foliage (No Disease Detected)',
    diseaseConfidence: 98.9,
    severityPercentage: 2.0,
    severityLevel: 'Healthy',
    originalImageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
    segmentationImageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
    gradCamImageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
    lesions: [],
    gradCamHotspots: [],
    recommendations: {
      immediate: [
        'No corrective action necessary. Plant exhibits optimal chlorophyll density and cellular vigor.'
      ],
      preventive: [
        'Maintain balanced nitrogen and calcium fertility to prevent blossom end rot.'
      ],
      treatment: [
        'Prophylactic seaweed extract or compost tea spray for immune enhancement.'
      ],
      cultural: [
        'Even soil moisture maintenance and adequate trellis staking.'
      ],
      monitoring: [
        'Standard weekly visual crop inspection.'
      ]
    },
    symptoms: 'Vibrant green cuticle with zero necrotic lesions, rust pustules, or chlorotic mottling.',
    causes: 'Optimal nutrition and moisture balance.',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    fileName: 'bell_pepper_healthy_greenhouse.jpg',
    modelVersion: 'CropPulse-UNet-v2.4'
  }
];

export const SAMPLE_INITIAL_BATCHES: BatchAnalysis[] = [
  {
    id: 'batch-demo-01',
    batchId: 'batch-demo-01',
    farmerId: 'demo-farmer',
    batchName: 'Salinas Valley Sector 4 - Tomato Crop Survey',
    totalImages: 12,
    processedImages: 12,
    status: 'COMPLETED',
    healthyCount: 4,
    healthyImages: 4,
    diseasedCount: 8,
    diseasedImages: 8,
    averageSeverity: 36.8,
    dominantDisease: 'Early Blight (Alternaria solani)',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 17.5).toISOString(),
    items: [
      ...SAMPLE_INITIAL_DIAGNOSES,
      {
        id: 'diag-b1-4',
        userId: 'demo-farmer',
        plantName: 'Tomato',
        plantConfidence: 96.5,
        diseaseName: 'Early Blight (Alternaria solani)',
        diseaseConfidence: 92.4,
        severityPercentage: 35.0,
        severityLevel: 'Moderate',
        originalImageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a4a?auto=format&fit=crop&w=800&q=80',
        segmentationImageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a4a?auto=format&fit=crop&w=800&q=80',
        gradCamImageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a4a?auto=format&fit=crop&w=800&q=80',
        lesions: [],
        gradCamHotspots: [],
        recommendations: SAMPLE_INITIAL_DIAGNOSES[0].recommendations,
        symptoms: 'Target-like spots on lower foliage.',
        timestamp: new Date().toISOString(),
        fileName: 'plot4_tomato_row8_04.jpg',
        modelVersion: 'CropPulse-UNet-v2.4'
      },
      {
        id: 'diag-b1-5',
        userId: 'demo-farmer',
        plantName: 'Tomato',
        plantConfidence: 98.1,
        diseaseName: 'Leaf Mold (Passalora fulva)',
        diseaseConfidence: 91.0,
        severityPercentage: 28.0,
        severityLevel: 'Mild',
        originalImageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a4a?auto=format&fit=crop&w=800&q=80',
        segmentationImageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a4a?auto=format&fit=crop&w=800&q=80',
        gradCamImageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a4a?auto=format&fit=crop&w=800&q=80',
        lesions: [],
        gradCamHotspots: [],
        recommendations: SAMPLE_INITIAL_DIAGNOSES[0].recommendations,
        symptoms: 'Pale green spots on upper leaf surfaces, olive mold underneath.',
        timestamp: new Date().toISOString(),
        fileName: 'plot4_tomato_row9_05.jpg',
        modelVersion: 'CropPulse-UNet-v2.4'
      },
      {
        id: 'diag-b1-6',
        userId: 'demo-farmer',
        plantName: 'Tomato',
        plantConfidence: 99.0,
        diseaseName: 'Healthy Foliage',
        diseaseConfidence: 97.4,
        severityPercentage: 0.0,
        severityLevel: 'Healthy',
        originalImageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
        segmentationImageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
        gradCamImageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
        lesions: [],
        gradCamHotspots: [],
        recommendations: SAMPLE_INITIAL_DIAGNOSES[2].recommendations,
        symptoms: 'Clean foliage.',
        timestamp: new Date().toISOString(),
        fileName: 'plot4_tomato_row10_06.jpg',
        modelVersion: 'CropPulse-UNet-v2.4'
      }
    ]
  }
];
