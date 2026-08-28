export type SupportedLanguage = 'en' | 'hi' | 'es' | 'pa' | 'te' | 'sw';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'sw', label: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' }
];

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
    es: string;
    pa: string;
    te: string;
    sw: string;
  };
}

export const translations: TranslationDictionary = {
  // Navigation & Core UI
  dashboard: {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    es: 'Panel de Control',
    pa: 'ਡੈਸ਼ਬੋਰਡ',
    te: 'డ్యాష్‌బోర్డ్',
    sw: 'Dashibodi'
  },
  scan_leaf: {
    en: 'Scan Leaf',
    hi: 'पत्ती स्कैन करें',
    es: 'Escanear Hoja',
    pa: 'ਪੱਤਾ ਸਕੈਨ ਕਰੋ',
    te: 'ఆకును స్కాన్ చేయండి',
    sw: 'Changanua Jani'
  },
  history: {
    en: 'History',
    hi: 'इतिहास',
    es: 'Historial',
    pa: 'ਇਤਿਹਾਸ',
    te: 'చరిత్ర',
    sw: 'Historia'
  },
  analytics: {
    en: 'Analytics',
    hi: 'विश्लेषण',
    es: 'Analítica',
    pa: 'ਵਿਸ਼ਲੇਸ਼ਣ',
    te: 'విశ్లేషణలు',
    sw: 'Takwimu'
  },
  bulk_analysis: {
    en: 'Bulk Analysis',
    hi: 'थोक विश्लेषण',
    es: 'Análisis Masivo',
    pa: 'ਸਮੂਹਿਕ ਵਿਸ਼ਲੇਸ਼ਣ',
    te: 'బల్క్ విశ్లేషణ',
    sw: 'Uchambuzi wa Wingi'
  },
  grower_mode: {
    en: 'Grower Mode',
    hi: 'उत्पादक मोड',
    es: 'Modo Cultivador',
    pa: 'ਕਾਸ਼ਤਕਾਰ ਮੋਡ',
    te: 'రైతు మోడ్',
    sw: 'Hali ya Mkulima'
  },
  farmer_mode: {
    en: 'Farmer Mode',
    hi: 'व्यावसायिक किसान मोड',
    es: 'Modo Finca',
    pa: 'ਵੱਡੇ ਕਿਸਾਨ ਮੋਡ',
    te: 'వాణిజ్య రైతు మోడ్',
    sw: 'Hali ya Mkulima Mkubwa'
  },
  login: {
    en: 'Login',
    hi: 'लॉग इन',
    es: 'Iniciar Sesión',
    pa: 'ਲਾਗ ਇਨ',
    te: 'లాగిన్',
    sw: 'Ingia'
  },
  get_started: {
    en: 'Get Started',
    hi: 'शुरू करें',
    es: 'Empezar',
    pa: 'ਸ਼ੁਰੂ ਕਰੋ',
    te: 'ప్రారంభించండి',
    sw: 'Anza Sasa'
  },
  sign_out: {
    en: 'Sign Out',
    hi: 'साइन आउट',
    es: 'Cerrar Sesión',
    pa: 'ਸਾਈਨ ਆਊਟ',
    te: 'లాగౌట్',
    sw: 'Toka'
  },

  // Plant Health Console (User Dashboard)
  personal_diagnostics: {
    en: 'Personal Foliar Diagnostics',
    hi: 'व्यक्तिगत पर्ण निदान',
    es: 'Diagnóstico Foliar Personal',
    pa: 'ਨਿੱਜੀ ਪੱਤਿਆਂ ਦੀ ਜਾਂਚ',
    te: 'వ్యక్తిగత పత్ర రోగనిర్ధారణ',
    sw: 'Uchunguzi wa Kibinafsi wa Majani'
  },
  plant_health_console: {
    en: 'Plant Health Console',
    hi: 'पादप स्वास्थ्य कंसोल',
    es: 'Consola de Salud Vegetal',
    pa: 'ਪੌਦਿਆਂ ਦੀ ਸਿਹਤ ਕੰਸੋਲ',
    te: 'మొక్కల ఆరోగ్య కన్సోల్',
    sw: 'Dashibodi ya Afya ya Mimea'
  },
  plant_health_subtitle: {
    en: 'Capture or upload a single leaf for instant AI disease identification, U-Net lesion segmentation, and continuous severity index.',
    hi: 'तत्काल एआई रोग पहचान, यू-नेट घाव विभाजन और निरंतर गंभीरता सूचकांक के लिए एक पत्ती की तस्वीर लें या अपलोड करें।',
    es: 'Capture o cargue una sola hoja para la identificación instantánea de enfermedades por IA, segmentación de lesiones U-Net e índice de severidad.',
    pa: 'ਤੁਰੰਤ ਏਆਈ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ, ਯੂ-ਨੈੱਟ ਨਿਸ਼ਾਨ ਵਿਭਾਜਨ ਅਤੇ ਗੰਭੀਰਤਾ ਸੂਚਕਾਂਕ ਲਈ ਇੱਕ ਪੱਤੇ ਦੀ ਫੋਟੋ ਲਓ ਜਾਂ ਅੱਪਲੋਡ ਕਰੋ।',
    te: 'తక్షణ AI వ్యాధి గుర్తింపు, యు-నెట్ గాయం సెగ్మెంటేషన్ మరియు తీవ్రత సూచిక కోసం ఒకే ఆకును ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి.',
    sw: 'Piga picha au pakia jani moja kwa utambuzi wa papo hapo wa magonjwa kwa AI, mgawanyo wa vidonda vya U-Net na kipimo cha ukali.'
  },
  take_leaf_photo: {
    en: 'Take Leaf Photo',
    hi: 'पत्ती की तस्वीर लें',
    es: 'Tomar Foto de la Hoja',
    pa: 'ਪੱਤੇ ਦੀ ਫੋਟੋ ਲਓ',
    te: 'ఆకు ఫోటో తీయండి',
    sw: 'Piga Picha ya Jani'
  },
  take_photo_desc: {
    en: 'Launch device camera with front/back lens switching and instant in-situ capture.',
    hi: 'फ्रंट/बैक लेंस स्विचिंग और त्वरित इन-सीटू कैप्चर के साथ डिवाइस कैमरा लॉन्च करें।',
    es: 'Inicie la cámara con cambio de lente frontal/trasera y captura instantánea en campo.',
    pa: 'ਫਰੰਟ/ਬੈਕ ਕੈਮਰਾ ਸਵਿਚਿੰਗ ਅਤੇ ਤੁਰੰਤ ਫੋਟੋ ਕੈਪਚਰ ਨਾਲ ਡਿਵਾਈਸ ਕੈਮਰਾ ਚਾਲੂ ਕਰੋ।',
    te: 'ముందు/వెనుక లెన్స్ మార్పు మరియు తక్షణ క్యాప్చర్‌తో పరికర కెమెరాను ప్రారంభించండి.',
    sw: 'Fungua kamera ya kifaa na ubadilishaji wa lenzi ya mbele/nyuma na upigaji picha papo hapo.'
  },
  launch_live_scanner: {
    en: 'Launch Live Scanner',
    hi: 'लाइव स्कैनर लॉन्च करें',
    es: 'Iniciar Escáner en Vivo',
    pa: 'ਲਾਈਵ ਸਕੈਨਰ ਚਾਲੂ ਕਰੋ',
    te: 'లైవ్ స్కానర్‌ను ప్రారంభించండి',
    sw: 'Fungua Skana ya Moja kwa Moja'
  },
  upload_leaf_image: {
    en: 'Upload Leaf Image',
    hi: 'पत्ती की छवि अपलोड करें',
    es: 'Subir Imagen de Hoja',
    pa: 'ਪੱਤੇ ਦੀ ਤਸਵੀਰ ਅੱਪਲੋਡ ਕਰੋ',
    te: 'ఆకు చిత్రాన్ని అప్‌లోడ్ చేయండి',
    sw: 'Pakia Picha ya Jani'
  },
  upload_leaf_desc: {
    en: 'Drag & drop or select existing JPG, PNG, or WEBP leaf photos from local storage.',
    hi: 'लोकल स्टोरेज से मौजूदा JPG, PNG, या WEBP पत्ती की तस्वीरें ड्रैग और ड्रॉप करें या चुनें।',
    es: 'Arrastre y suelte o seleccione fotos JPG, PNG o WEBP de hoja desde el almacenamiento.',
    pa: 'ਆਪਣੀ ਡਿਵਾਈਸ ਤੋਂ ਮੌਜੂਦਾ JPG, PNG ਜਾਂ WEBP ਪੱਤੇ ਦੀਆਂ ਫੋਟੋਆਂ ਚੁਣੋ।',
    te: 'స్థానిక నిల్వ నుండి JPG, PNG లేదా WEBP ఆకు ఫోటోలను ఎంచుకోండి.',
    sw: 'Buruta na uweke au chagua picha za JPG, PNG au WEBP za majani kutoka kwenye kifaa.'
  },
  select_leaf_image: {
    en: 'Select Leaf Image',
    hi: 'पत्ती छवि चुनें',
    es: 'Seleccionar Imagen de Hoja',
    pa: 'ਪੱਤੇ ਦੀ ਤਸਵੀਰ ਚੁਣੋ',
    te: 'ఆకు చిత్రాన్ని ఎంచుకోండి',
    sw: 'Chagua Picha ya Jani'
  },

  // KPI Metrics
  total_scans: {
    en: 'Total Scans',
    hi: 'कुल स्कैन',
    es: 'Total de Escaneos',
    pa: 'ਕੁੱਲ ਸਕੈਨ',
    te: 'మొత్తం స్కాన్‌లు',
    sw: 'Jumla ya Skana'
  },
  healthy_leaves: {
    en: 'Healthy Leaves',
    hi: 'स्वस्थ पत्तियां',
    es: 'Hojas Sanas',
    pa: 'ਤੰਦਰੁਸਤ ਪੱਤੇ',
    te: 'ఆరోగ్యకరమైన ఆకులు',
    sw: 'Majani Yenye Afya'
  },
  diseases_found: {
    en: 'Diseases Found',
    hi: 'पाए गए रोग',
    es: 'Enfermedades Detectadas',
    pa: 'ਲੱਭੀਆਂ ਗਈਆਂ ਬਿਮਾਰੀਆਂ',
    te: 'కనుగొనబడిన వ్యాధులు',
    sw: 'Magonjwa Yaliyopatikana'
  },
  avg_severity: {
    en: 'Avg Severity',
    hi: 'औसत गंभीरता',
    es: 'Severidad Promedio',
    pa: 'ਔਸਤ ਗੰਭੀਰਤਾ',
    te: 'సగటు తీవ్రత',
    sw: 'Wastani wa Ukali'
  },
  recent_diagnoses: {
    en: 'Recent Diagnoses',
    hi: 'हालिया निदान',
    es: 'Diagnósticos Recientes',
    pa: 'ਹਾਲੀਆ ਜਾਂਚਾਂ',
    te: 'ఇటీవలి రోగనిర్ధారణలు',
    sw: 'Uchunguzi wa Hivi Karibuni'
  },
  recent_diagnoses_desc: {
    en: 'Your latest AI plant pathology evaluations',
    hi: 'आपके नवीनतम एआई पादप विकृति मूल्यांकन',
    es: 'Sus últimas evaluaciones de patología vegetal por IA',
    pa: 'ਤੁਹਾਡੇ ਤਾਜ਼ਾ ਏਆਈ ਪੌਦਿਆਂ ਦੇ ਰੋਗ ਮੁਲਾਂਕਣ',
    te: 'మీ తాజా AI మొక్కల పాథాలజీ మూల్యాంకనాలు',
    sw: 'Tathmini zako za hivi karibuni za magonjwa ya mimea kwa AI'
  },
  view_all: {
    en: 'View All',
    hi: 'सभी देखें',
    es: 'Ver Todos',
    pa: 'ਸਾਰੇ ਵੇਖੋ',
    te: 'అన్నీ చూడండి',
    sw: 'Tazama Yote'
  },
  no_scans_yet: {
    en: 'No Scans Recorded Yet',
    hi: 'अभी तक कोई स्कैन दर्ज नहीं किया गया',
    es: 'Aún No Hay Escaneos Registrados',
    pa: 'ਅਜੇ ਤੱਕ ਕੋਈ ਸਕੈਨ ਦਰਜ ਨਹੀਂ ਹੋਇਆ',
    te: 'ఇంకా ఎటువంటి స్కాన్‌లు నమోదు కాలేదు',
    sw: 'Bado Hakuna Skana Zilizorekodiwa'
  },
  inspect: {
    en: 'Inspect',
    hi: 'निरीक्षण करें',
    es: 'Inspeccionar',
    pa: 'ਜਾਂਚ ਕਰੋ',
    te: 'పరిశీలించండి',
    sw: 'Chunguza'
  },

  // Microclimate & Weather & GPS
  pathogen_risk_alert: {
    en: 'Pathogen Risk Alert',
    hi: 'रोगजनक जोखिम चेतावनी',
    es: 'Alerta de Riesgo de Patógenos',
    pa: 'ਰੋਗ ਜੋਖਮ ਚੇਤਾਵਨੀ',
    te: 'వ్యాధికారక ప్రమాద హెచ్చరిక',
    sw: 'Tahadhari ya Hatari ya Magonjwa'
  },
  microclimate_radar: {
    en: 'Microclimate & Pathogen Inoculum Radar',
    hi: 'माइक्रॉक्लाइमेट और रोगजनक रडार',
    es: 'Radar de Microclima e Inóculo de Patógenos',
    pa: 'ਮੌਸਮ ਅਤੇ ਰੋਗ ਸੰਭਾਵਨਾ ਰਾਡਾਰ',
    te: 'మైక్రోక్లైమేట్ & వ్యాధికారక రాడార్',
    sw: 'Rada ya Hali ya Hewa na Magonjwa'
  },
  microclimate_desc: {
    en: 'Agricultural microclimate telemetry & 48h foliar moisture forecast',
    hi: 'कृषि सूक्ष्मजलवायु टेलीमेट्री और 48 घंटे की पर्ण नमी का पूर्वानुमान',
    es: 'Telemetría de microclima agrícola y pronóstico de humedad foliar a 48h',
    pa: 'ਖੇਤੀਬਾੜੀ ਮੌਸਮ ਟੈਲੀਮੈਟਰੀ ਅਤੇ 48 ਘੰਟੇ ਦੀ ਨਮੀ ਦੀ ਭਵਿੱਖਬਾਣੀ',
    te: 'వ్యవసాయ మైక్రోక్లైమేట్ టెలిమెట్రీ & 48 గంటల ఆకు తేమ సూచన',
    sw: 'Takwimu za hali ya hewa ya kilimo na utabiri wa unyevu wa majani kwa saa 48'
  },
  temperature: {
    en: 'Temperature',
    hi: 'तापमान',
    es: 'Temperatura',
    pa: 'ਤਾਪਮਾਨ',
    te: 'ఉష్ణోగ్రత',
    sw: 'Joto'
  },
  humidity: {
    en: 'Relative Humidity',
    hi: 'सापेक्ष आर्द्रता',
    es: 'Humedad Relativa',
    pa: 'ਹਵਾ ਵਿੱਚ ਨਮੀ',
    te: 'సాపేక్ష తేమ',
    sw: 'Unyevu wa Hewa'
  },
  wind_speed: {
    en: 'Wind Speed',
    hi: 'हवा की गति',
    es: 'Velocidad del Viento',
    pa: 'ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ',
    te: 'గాలి వేగం',
    sw: 'Kasi ya Upepo'
  },
  my_gps: {
    en: 'MY GPS',
    hi: 'मेरा जीपीएस',
    es: 'MI GPS',
    pa: 'ਮੇਰਾ ਜੀਪੀਐਸ',
    te: 'నా జీపీఎస్',
    sw: 'GPS YANGU'
  },
  gps_tracking_active: {
    en: 'GPS Coordinates Locked',
    hi: 'जीपीएस निर्देशांक लॉक किए गए',
    es: 'Coordenadas GPS Fijadas',
    pa: 'ਜੀਪੀਐਸ ਨਿਰਦੇਸ਼ਾਂਕ ਲਾਕ ਕੀਤੇ',
    te: 'జీపీఎస్ కోఆర్డినేట్స్ లాక్ చేయబడ్డాయి',
    sw: 'Viwianishi vya GPS Vimefungwa'
  },
  gps_telemetry: {
    en: 'Native GPS Telemetry',
    hi: 'मूल जीपीएस टेलीमेट्री',
    es: 'Telemetría GPS Nativa',
    pa: 'ਮੂਲ ਜੀਪੀਐਸ ਟੈਲੀਮੈਟਰੀ',
    te: 'నేటివ్ జీపీఎస్ టెలిమెట్రీ',
    sw: 'Takwimu Asilia za GPS'
  },
  high_humidity_warning: {
    en: 'CRITICAL FUNGAL INCUBATION ALERT: Ambient humidity exceeds 85%. Spore germination conditions for Early/Late Blight are optimal. Suspend overhead irrigation immediately and apply protective copper or bio-fungicide sprays.',
    hi: 'गंभीर फफूंद संक्रमण चेतावनी: वायुमंडलीय आर्द्रता 85% से अधिक है। अगेती/पछेती झुलसा के बीजाणु अंकुरण की स्थितियां चरम पर हैं। फव्वारा सिंचाई तुरंत रोकें और सुरक्षात्मक कवकनाशी का छिड़काव करें।',
    es: 'ALERTA CRÍTICA DE INCUBACIÓN FÚNGICA: La humedad ambiental supera el 85%. Las condiciones de germinación de esporas para el Tizón son óptimas. Suspenda el riego por aspersión y aplique fungicidas protectores.',
    pa: 'ਗੰਭੀਰ ਉੱਲੀ ਚੇਤਾਵਨੀ: ਹਵਾ ਵਿੱਚ ਨਮੀ 85% ਤੋਂ ਵੱਧ ਹੈ। ਝੁਲਸ ਰੋਗ ਦੇ ਵਾਧੇ ਲਈ ਅਨੁਕੂਲ ਹਾਲਾਤ ਹਨ। ਫੁਹਾਰਾ ਸਿੰਚਾਈ ਤੁਰੰਤ ਬੰਦ ਕਰੋ ਅਤੇ ਉੱਲੀਨਾਸ਼ਕ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।',
    te: 'తీవ్రమైన ఫంగస్ హెచ్చరిక: గాలిలో తేమ 85% మించిపోయింది. ఎండు తెగులు/లేట్ బ్లైట్ వ్యాప్తికి అనుకూల వాతావరణం. వెంటనే తుంపర సేద్యాన్ని ఆపి రక్షిత శిలీంద్ర సంహారిణిని పిచికారీ చేయండి.',
    sw: 'TAHADHARI YA UKUBAJI WA UKUNDU: Unyevu wa hewa unazidi 85%. Mazingira yanafaa sana kwa uotaji wa vimelea vya ukungu. Sitisha umwagiliaji wa juu na tumia dawa ya kinga mara moja.'
  },
  moderate_humidity_warning: {
    en: 'MODERATE PATHOGEN RISK: Elevated humidity supports potential powdery mildew and bacterial spot spread. Ensure canopy ventilation.',
    hi: 'मध्यम रोगजनक जोखिम: बढ़ी हुई आर्द्रता पाउडरी मिल्ड्यू और जीवाणु धब्बा फैलने का समर्थन करती है। कैनोपी वेंटिलेशन सुनिश्चित करें।',
    es: 'RIESGO MODERADO DE PATÓGENOS: La humedad elevada favorece la propagación de mildiú polvoriento y mancha bacteriana. Asegure ventilación del dosel.',
    pa: 'ਦਰਮਿਆਨਾ ਜੋਖਮ: ਵਧੀ ਹੋਈ ਨਮੀ ਕਾਰਨ ਉੱਲੀ ਅਤੇ ਬੈਕਟੀਰੀਆ ਫੈਲਣ ਦਾ ਖ਼ਤਰਾ ਹੈ। ਹਵਾ ਦੀ ਆਵਾਜਾਈ ਯਕੀਨੀ ਬਣਾਓ।',
    te: 'మధ్యస్థ ప్రమాదం: అధిక తేమ బూజు తెగులు వ్యాప్తికి దారితీయవచ్చు. తగినంత గాలి ప్రసరణను నిర్ధారించండి.',
    sw: 'HATARI YA WASTANI: Unyevu wa juu unaweza kusababisha ukungu na madoa ya bakteria. Hakikisha mtiririko mzuri wa hewa.'
  },
  low_humidity_status: {
    en: 'LOW FOLIAR RISK: Ambient conditions are dry. Spore germination probability is low. Maintain regular monitoring.',
    hi: 'कम पर्ण जोखिम: वायुमंडलीय स्थितियां शुष्क हैं। बीजाणु अंकुरण की संभावना कम है। नियमित निगरानी बनाए रखें।',
    es: 'BAJO RIESGO FOLIAR: Condiciones secas. Baja probabilidad de germinación de esporas. Mantenga monitoreo regular.',
    pa: 'ਘੱਟ ਜੋਖਮ: ਮੌਸਮ ਖੁਸ਼ਕ ਹੈ। ਬਿਮਾਰੀ ਫੈਲਣ ਦੀ ਸੰਭਾਵਨਾ ਘੱਟ ਹੈ। ਨਿਯਮਤ ਨਿਗਰਾਨੀ ਜਾਰੀ ਰੱਖੋ।',
    te: 'తక్కువ ప్రమాదం: పొడి వాతావరణం. బీజాంశాలు మొలకెత్తే అవకాశం తక్కువ. సాధారణ పర్యవేక్షణ కొనసాగించండి.',
    sw: 'HATARI NDOGO: Hali ya hewa ni kavu. Uwezekano wa kuenea kwa magonjwa ni mdogo. Endelea kufuatilia.'
  },

  // Spatial Hotspots & Agronomic Advisory
  spatial_map_title: {
    en: 'Field Spatial Hotspot & Canopy GPS Mapping',
    hi: 'खेत का स्थानिक हॉटस्पॉट और जीपीएस मैपिंग',
    es: 'Mapeo Espacial de Puntos Críticos y GPS de Campo',
    pa: 'ਖੇਤ ਦਾ ਸਥਾਨਕ ਹੌਟਸਪੌਟ ਅਤੇ ਜੀਪੀਐਸ ਨਕਸ਼ਾ',
    te: 'ఫీల్డ్ ప్రాదేశిక హాట్‌స్పాట్ & జీపీఎస్ మ్యాపింగ్',
    sw: 'Ramani ya Maeneo Yenye Magonjwa Shambani'
  },
  smart_advisory_title: {
    en: 'Localized Smart Agronomic Advisory',
    hi: 'स्थानीय स्मार्ट कृषि सलाह',
    es: 'Asesoría Agronómica Inteligente Localizada',
    pa: 'ਸਥਾਨਕ ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ ਸਲਾਹ',
    te: 'స్థానిక స్మార్ట్ వ్యవసాయ సలహా',
    sw: 'Ushauri wa Kilimo wa Kisasa wa Kienyeji'
  },
  immediate_actions: {
    en: 'Immediate Action Protocols',
    hi: 'तत्काल कार्रवाई प्रोटोकॉल',
    es: 'Protocolos de Acción Inmediata',
    pa: 'ਤੁਰੰਤ ਕਾਰਵਾਈ ਪ੍ਰੋਟੋਕੋਲ',
    te: 'తక్షణ చర్య మార్గదర్శకాలు',
    sw: 'Hatua za Haraka za Kuchukua'
  },
  biological_control: {
    en: 'Biological & Organic Treatments',
    hi: 'जैविक और प्राकृतिक उपचार',
    es: 'Tratamientos Biológicos y Orgánicos',
    pa: 'ਜੈਵਿਕ ਅਤੇ ਕੁਦਰਤੀ ਇਲਾਜ',
    te: 'జీవ మరియు సేంద్రీయ నివారణలు',
    sw: 'Tiba za Asili na Kibiolojia'
  },
  chemical_control: {
    en: 'Targeted Fungicide Regimen',
    hi: 'लक्षित कवकनाशी व्यवस्था',
    es: 'Régimen de Fungicidas Dirigidos',
    pa: 'ਲੋੜੀਂਦੇ ਉੱਲੀਨਾਸ਼ਕ ਨਿਯਮ',
    te: 'లక్షిత శిలీంద్ర సంహారిణి విధానం',
    sw: 'Mpango wa Dawa za Kuvu'
  },
  cultural_practices: {
    en: 'Cultural & Field Management',
    hi: 'कृषि पद्धतियाँ और खेत प्रबंधन',
    es: 'Prácticas Culturales y Manejo de Campo',
    pa: 'ਖੇਤ ਪ੍ਰਬੰਧਨ ਅਤੇ ਸਾਵਧਾਨੀਆਂ',
    te: 'సాగు పద్ధతులు & క్షేత్ర నిర్వహణ',
    sw: 'Usimamizi wa Shamba na Kilimo'
  },

  // Farmer Dashboard
  commercial_operations: {
    en: 'Commercial Grower Operations',
    hi: 'व्यावसायिक किसान संचालन',
    es: 'Operaciones de Cultivo Comercial',
    pa: 'ਵਪਾਰਕ ਕਿਸਾਨੀ ਕਾਰਜ',
    te: 'వాణిజ్య వ్యవసాయ కార్యకలాపాలు',
    sw: 'Shughuli za Kilimo cha Biashara'
  },
  farmer_console: {
    en: 'Farmer Crop Health Console',
    hi: 'किसान फसल स्वास्थ्य कंसोल',
    es: 'Consola de Salud de Cultivos Agrícolas',
    pa: 'ਕਿਸਾਨ ਫਸਲ ਸਿਹਤ ਕੰਸੋਲ',
    te: 'రైతు పంట ఆరోగ్య కన్సోల్',
    sw: 'Dashibodi ya Afya ya Mazao ya Mkulima'
  },
  farmer_subtitle: {
    en: 'Bulk leaf survey analysis, U-Net continuous severity mapping, epidemiology analytics, and PDF compliance certifications.',
    hi: 'थोक पत्ती सर्वेक्षण विश्लेषण, यू-नेट निरंतर गंभीरता मैपिंग, महामारी विज्ञान विश्लेषण, और पीडीएफ अनुपालन प्रमाणपत्र।',
    es: 'Análisis masivo de hojas, mapeo de severidad U-Net, analítica epidemiológica y certificaciones de cumplimiento en PDF.',
    pa: 'ਵੱਡੇ ਪੱਧਰ ਤੇ ਪੱਤਿਆਂ ਦਾ ਸਰਵੇਖਣ, ਯੂ-ਨੈੱਟ ਗੰਭੀਰਤਾ ਨਕਸ਼ਾ, ਮਹਾਂਮਾਰੀ ਵਿਗਿਆਨ ਅਤੇ ਪੀਡੀਐਫ ਸਰਟੀਫਿਕੇਟ।',
    te: 'బల్క్ ఆకు సర్వే విశ్లేషణ, యు-నెట్ తీవ్రత మ్యాపింగ్, ఎపిడెమియాలజీ విశ్లేషణలు మరియు PDF ధృవీకరణలు.',
    sw: 'Uchambuzi wa majani kwa wingi, ramani ya ukali ya U-Net, takwimu za magonjwa, na vyeti vya PDF.'
  },
  new_bulk_ingestion: {
    en: 'New Bulk Ingestion',
    hi: 'नया बल्क इन्जेशन',
    es: 'Nueva Ingesta Masiva',
    pa: 'ਨਵਾਂ ਬਲਕ ਅੱਪਲੋਡ',
    te: 'కొత్త బల్క్ ఇన్‌జెషన్',
    sw: 'Upakiaji Mpya wa Wingi'
  },
  field_surveys: {
    en: 'Field Surveys',
    hi: 'खेत सर्वेक्षण',
    es: 'Encuestas de Campo',
    pa: 'ਖੇਤ ਸਰਵੇਖਣ',
    te: 'ఫీల్డ్ సర్వేలు',
    sw: 'Tathmini za Shambani'
  },
  total_foliar_samples: {
    en: 'Total Foliar Samples',
    hi: 'कुल पर्ण नमूने',
    es: 'Total de Muestras Foliares',
    pa: 'ਕੁੱਲ ਪੱਤਿਆਂ ਦੇ ਨਮੂਨੇ',
    te: 'మొత్తం పత్ర నమూనాలు',
    sw: 'Jumla ya Sampuli za Majani'
  },
  infection_rate: {
    en: 'Infection Rate',
    hi: 'संक्रमण दर',
    es: 'Tasa de Infección',
    pa: 'ਬਿਮਾਰੀ ਦੀ ਦਰ',
    te: 'ఇన్‌ఫెక్షన్ రేటు',
    sw: 'Kiwango cha Maambukizi'
  },
  mean_severity: {
    en: 'Mean Severity',
    hi: 'औसत गंभीरता',
    es: 'Severidad Media',
    pa: 'ਔਸਤ ਗੰਭੀਰਤਾ',
    te: 'సగటు తీవ్రత',
    sw: 'Wastani wa Ukali'
  }
};

/**
 * Helper translation function
 */
export function t(key: string, lang: SupportedLanguage = 'en'): string {
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  if (translations[key] && translations[key]['en']) {
    return translations[key]['en'];
  }
  return key.replace(/_/g, ' ');
}
