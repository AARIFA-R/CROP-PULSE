export type UserRole = 'USER' | 'FARMER';

export type SeverityLevel = 
  | 'Healthy' | 'Mild' | 'Moderate' | 'Severe' | 'Critical'
  | 'HEALTHY' | 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';

export type BatchStatus = 'UPLOADING' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'FAILED';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  role: UserRole;
  location?: string;
  district?: string;
  state?: string;
  country?: string;
  profilePhotoUrl?: string;
  preferredLanguage?: string;
  completedOnboarding?: boolean;
  onboardingCompleted?: boolean;
  cameraPermissionGranted?: boolean;
  photoPermissionGranted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LesionCoordinate {
  id?: string;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  radius?: number; // 0 to 100 percentage
  width?: number;
  height?: number;
  severityScore?: number;
  severity?: string;
  type?: string;
}

export interface GradCamPoint {
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  intensity: number; // 0 to 1
  radius?: number;
}

export interface DiseaseMitigation {
  immediate?: string[];
  preventive?: string[];
  cultural?: string[];
  environmental?: string[];
  treatment?: string[];
  monitoring?: string[];
  // Standard extended aliases
  immediateActions?: string[];
  preventiveMeasures?: string[];
  organicTreatments?: string[];
  chemicalTreatments?: string[];
  culturalPractices?: string[];
  monitoringAdvice?: string[];
}

export interface DiagnosisResult {
  id: string;
  userId: string;
  plantName: string;
  plantConfidence: number;
  diseaseName: string;
  diseaseConfidence: number;
  severityPercentage: number;
  severityLevel: SeverityLevel;
  description?: string;
  symptoms?: string;
  causes?: string;
  lesions?: LesionCoordinate[];
  gradCamHotspots?: GradCamPoint[];
  recommendations: DiseaseMitigation;
  originalImageUrl: string;
  imageUrl?: string;
  segmentationImageUrl?: string;
  gradCamImageUrl?: string;
  timestamp: string;
  modelVersion: string;
  fileName?: string;
}

export interface BatchImageItem extends DiagnosisResult {
  status?: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  errorMessage?: string;
  processedAt?: string;
}

export interface BatchAnalysis {
  id: string;
  batchId?: string;
  farmerId: string;
  batchName?: string;
  createdAt: string;
  completedAt?: string;
  totalImages: number;
  processedImages: number;
  failedImages?: number;
  healthyImages?: number;
  healthyCount?: number;
  diseasedImages?: number;
  diseasedCount?: number;
  averageSeverity: number;
  dominantDisease: string;
  status: BatchStatus;
  items?: DiagnosisResult[];
  results?: BatchImageItem[] | DiagnosisResult[];
}

export interface DiseaseKnowledgeItem {
  id: string;
  plant: string;
  disease: string;
  severityBenchmark: number;
  level: SeverityLevel;
  description: string;
  symptoms: string;
  causes: string;
  recommendations: DiseaseMitigation;
}

export interface ModelEndpointConfig {
  provider: 'gemini' | 'custom_pytorch_fastapi' | 'offline_standalone';
  customUrl?: string;
  apiKey?: string;
  modelArchitecture: 'UNet_RegNet_GradCAM' | 'ResNet50_Classifier' | 'EfficientNet_Custom';
  status: 'ready' | 'connecting' | 'error';
}
