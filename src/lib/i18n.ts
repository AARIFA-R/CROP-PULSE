export type SupportedLanguage = 'en' | 'es' | 'hi' | 'pa' | 'te' | 'sw';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'sw', label: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' }
];

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    es: string;
    hi: string;
    pa: string;
    te: string;
    sw: string;
  };
}

export const TRANSLATIONS: TranslationDictionary = {
  // Navigation & Headers
  dashboard_title: {
    en: 'Crop Health Analytics & Epidemiology',
    es: 'Análisis de Salud de Cultivos y Epidemiología',
    hi: 'फसल स्वास्थ्य विश्लेषण और महामारी विज्ञान',
    pa: 'ਫਸਲ ਸਿਹਤ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਮਹਾਂਮਾਰੀ ਵਿਗਿਆਨ',
    te: 'పంట ఆరోగ్య విశ్లేషణ & ఎపిడెమియాలజీ',
    sw: 'Uchambuzi wa Afya ya Mazao na Magonjwa'
  },
  dashboard_subtitle: {
    en: 'Real-time computed foliar telemetry, microclimate disease risks, and spatial pathogen mapping',
    es: 'Telemetría foliar calculada en tiempo real, riesgos climáticos y mapeo espacial de patógenos',
    hi: 'वास्तविक समय में गणना की गई पर्ण टेलीमेट्री, माइक्रॉक्लाइमेट रोग जोखिम और स्थानिक रोगजनक मैपिंग',
    pa: 'ਰੀਅਲ-ਟਾਈਮ ਪੱਤਿਆਂ ਦੀ ਟੈਲੀਮੈਟਰੀ, ਮੌਸਮੀ ਬਿਮਾਰੀ ਦੇ ਜੋਖਮ ਅਤੇ ਸਥਾਨਕ ਨਕਸ਼ਾ',
    te: 'రియల్-టైమ్ పత్ర టెలిమెట్రీ, వాతావరణ వ్యాధి ప్రమాదాలు మరియు ప్రాదేశిక వ్యాధికారక మ్యాపింగ్',
    sw: 'Takwimu za majani kwa wakati halisi, hatari za hali ya hewa, na ramani ya magonjwa shambani'
  },
  filter_dataset: {
    en: 'Dataset Scope',
    es: 'Alcance del Conjunto de Datos',
    hi: 'डेटासेट का दायरा',
    pa: 'ਡੇਟਾਸੈੱਟ ਦਾ ਘੇਰਾ',
    te: 'డేటాసెట్ పరిధి',
    sw: 'Upeo wa Data'
  },
  all_records: {
    en: 'All Database Records (Batches + Scans)',
    es: 'Todos los Registros (Lotes + Escaneos)',
    hi: 'सभी डेटाबेस रिकॉर्ड (बैच + स्कैन)',
    pa: 'ਸਾਰੇ ਡਾਟਾਬੇਸ ਰਿਕਾਰਡ (ਬੈਚ + ਸਕੈਨ)',
    te: 'అన్ని డేటాబేస్ రికార్డులు (బ్యాచ్‌లు + స్కాన్‌లు)',
    sw: 'Rekodi Zote za Hifadhidata (Makundi + Skana)'
  },
  
  // KPI Metrics
  total_samples: {
    en: 'Total Foliar Samples',
    es: 'Total de Muestras Foliares',
    hi: 'कुल पर्ण नमूने',
    pa: 'ਕੁੱਲ ਪੱਤਿਆਂ ਦੇ ਨਮੂਨੇ',
    te: 'మొత్తం పత్ర నమూనాలు',
    sw: 'Jumla ya Sampuli za Majani'
  },
  healthy_samples: {
    en: 'Healthy Samples',
    es: 'Muestras Sanas',
    hi: 'स्वस्थ नमूने',
    pa: 'ਤੰਦਰੁਸਤ ਨਮੂਨੇ',
    te: 'ఆరోగ్యకరమైన నమూనాలు',
    sw: 'Sampuli Zenye Afya'
  },
  infected_samples: {
    en: 'Infected Samples',
    es: 'Muestras Infectadas',
    hi: 'संक्रमित नमूने',
    pa: 'ਬਿਮਾਰੀ ਵਾਲੇ ਨਮੂਨੇ',
    te: 'వ్యాధి సోకిన నమూనాలు',
    sw: 'Sampuli Zilizoshambuliwa'
  },
  average_severity: {
    en: 'Average Severity',
    es: 'Severidad Promedio',
    hi: 'औसत गंभीरता',
    pa: 'ਔਸਤ ਗੰਭੀਰਤਾ',
    te: 'సగటు తీవ్రత',
    sw: 'Wastani wa Ukali'
  },
  dominant_pathogen: {
    en: 'Dominant Pathogen',
    es: 'Patógeno Dominante',
    hi: 'प्रमुख रोगजनक',
    pa: 'ਮੁੱਖ ਰੋਗਕਾਰੀ',
    te: 'ప్రధాన వ్యాధికారకం',
    sw: 'Ugonjwa Mkuu'
  },

  // Chart Titles
  disease_distribution: {
    en: 'Disease Distribution (% of Canopy)',
    es: 'Distribución de Enfermedades (% de Dosel)',
    hi: 'रोग वितरण (कैनोपी का %)',
    pa: 'ਬਿਮਾਰੀ ਦੀ ਵੰਡ (% ਖੇਤਰ)',
    te: 'వ్యాధి వ్యాప్తి (% పంట ఆవరణ)',
    sw: 'Mgawanyo wa Magonjwa (% ya Majani)'
  },
  severity_breakdown: {
    en: 'Severity Categorization (Sample Count)',
    es: 'Categorización de Severidad (Conteo de Muestras)',
    hi: 'गंभीरता वर्गीकरण (नमूना गणना)',
    pa: 'ਗੰਭੀਰਤਾ ਵਰਗੀਕਰਨ (ਨਮੂਨਾ ਗਿਣਤੀ)',
    te: 'తీవ్రత వర్గీకరణ (నమూనాల సంఖ్య)',
    sw: 'Mgawanyo wa Ukali (Idadi ya Sampuli)'
  },
  species_breakdown: {
    en: 'Plant Species Breakdown',
    es: 'Desglose de Especies de Plantas',
    hi: 'पौधों की प्रजातियों का विवरण',
    pa: 'ਪੌਦਿਆਂ ਦੀਆਂ ਕਿਸਮਾਂ ਦਾ ਵੇਰਵਾ',
    te: 'మొక్కల జాతుల విభజన',
    sw: 'Aina za Mimea Iliyochunguzwa'
  },
  pathogen_severity: {
    en: 'Mean Severity % by Pathology',
    es: 'Severidad Media % por Patología',
    hi: 'रोग अनुसार औसत गंभीरता %',
    pa: 'ਬਿਮਾਰੀ ਅਨੁਸਾਰ ਔਸਤ ਗੰਭੀਰਤਾ %',
    te: 'వ్యాధి ప్రకారం సగటు తీవ్రత %',
    sw: 'Wastani wa Ukali % kwa Kila Ugonjwa'
  },

  // Weather & Climate
  weather_title: {
    en: 'Microclimate & Pathogen Inoculum Radar',
    es: 'Microclima y Radar de Inóculo de Patógenos',
    hi: 'माइक्रॉक्लाइमेट और रोगजनक रडार',
    pa: 'ਮੌਸਮ ਅਤੇ ਰੋਗ ਸੰਭਾਵਨਾ ਰਾਡਾਰ',
    te: 'మైక్రోక్లైమేట్ & వ్యాధికారక రాడార్',
    sw: 'Hali ya Hewa na Rada ya Hatari ya Magonjwa'
  },
  humidity: {
    en: 'Relative Humidity',
    es: 'Humedad Relativa',
    hi: 'सापेक्ष आर्द्रता',
    pa: 'ਨਮੀ',
    te: 'సాపేక్ష తేమ',
    sw: 'Unyevu wa Hewa'
  },
  temperature: {
    en: 'Temperature',
    es: 'Temperatura',
    hi: 'तापमान',
    pa: 'ਤਾਪਮਾਨ',
    te: 'ఉష్ణోగ్రత',
    sw: 'Joto'
  },
  wind_speed: {
    en: 'Wind Speed',
    es: 'Velocidad del Viento',
    hi: 'हवा की गति',
    pa: 'ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ',
    te: 'గాలి వేగం',
    sw: 'Kasi ya Upepo'
  },
  precip_48h: {
    en: '48-Hour Precipitation & Moisture Forecast',
    es: 'Pronóstico de Precipitación y Humedad a 48 Horas',
    hi: '48 घंटे की वर्षा और नमी का पूर्वानुमान',
    pa: '48 ਘੰਟੇ ਦੀ ਬਾਰਿਸ਼ ਅਤੇ ਨਮੀ ਦੀ ਭਵਿੱਖਬਾਣੀ',
    te: '48 గంటల వర్షపాతం & తేమ సూచన',
    sw: 'Utabiri wa Mvua na Unyevu wa Saa 48'
  },
  high_humidity_warning: {
    en: 'CRITICAL FUNGAL INCUBATION ALERT: Ambient humidity exceeds 85%. Spore germination conditions for Early/Late Blight are optimal. Suspend overhead irrigation immediately and apply protective copper or bio-fungicide sprays.',
    es: 'ALERTA CRÍTICA DE INCUBACIÓN FÚNGICA: La humedad ambiental supera el 85%. Las condiciones de germinación de esporas para el Tizón son óptimas. Suspenda el riego por aspersión y aplique fungicidas protectores.',
    hi: 'गंभीर फफूंद संक्रमण चेतावनी: वायुमंडलीय आर्द्रता 85% से अधिक है। अगेती/पछेती झुलसा के बीजाणु अंकुरण की स्थितियां चरम पर हैं। फव्वारा सिंचाई तुरंत रोकें और सुरक्षात्मक कवकनाशी का छिड़काव करें।',
    pa: 'ਗੰਭੀਰ ਉੱਲੀ ਚੇਤਾਵਨੀ: ਹਵਾ ਵਿੱਚ ਨਮੀ 85% ਤੋਂ ਵੱਧ ਹੈ। ਝੁਲਸ ਰੋਗ ਦੇ ਵਾਧੇ ਲਈ ਅਨੁਕੂਲ ਹਾਲਾਤ ਹਨ। ਫੁਹਾਰਾ ਸਿੰਚਾਈ ਤੁਰੰਤ ਬੰਦ ਕਰੋ ਅਤੇ ਉੱਲੀਨਾਸ਼ਕ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।',
    te: 'తీవ్రమైన ఫంగస్ హెచ్చరిక: గాలిలో తేమ 85% మించిపోయింది. ఎండు తెగులు/లేట్ బ్లైట్ వ్యాప్తికి అనుకూల వాతావరణం. వెంటనే తుంపర సేద్యాన్ని ఆపి రక్షిత శిలీంద్ర సంహారిణిని పిచికారీ చేయండి.',
    sw: 'TAHADHARI YA UKUBAJI WA UKUNDU: Unyevu wa hewa unazidi 85%. Mazingira yanafaa sana kwa uotaji wa vimelea vya ukungu. Sitisha umwagiliaji wa juu na tumia dawa ya kinga mara moja.'
  },

  // Spatial Mapping
  spatial_map_title: {
    en: 'Field Spatial Hotspot & Canopy GPS Mapping',
    es: 'Mapeo Espacial de Puntos Críticos y GPS de Campo',
    hi: 'खेत का स्थानिक हॉटस्पॉट और जीपीएस मैपिंग',
    pa: 'ਖੇਤ ਦਾ ਸਥਾਨਕ ਹੌਟਸਪੌਟ ਅਤੇ ਜੀਪੀਐਸ ਨਕਸ਼ਾ',
    te: 'ఫీల్డ్ ప్రాదేశిక హాట్‌స్పాట్ & జీపీఎస్ మ్యాపింగ్',
    sw: 'Ramani ya Maeneo Yenye Magonjwa Shambani'
  },
  hotspot_overlay: {
    en: 'Epidemic Hotspot Heatmap',
    es: 'Mapa de Calor de Puntos Críticos',
    hi: 'महामारी हॉटस्पॉट हीटमैप',
    pa: 'ਬਿਮਾਰੀ ਹੌਟਸਪੌਟ ਹੀਟਮੈਪ',
    te: 'వ్యాధి హాట్‌స్పాట్ హీట్‌మ్యాప్',
    sw: 'Ramani ya Joto ya Mlipuko'
  },
  filter_all: {
    en: 'All Locations',
    es: 'Todas las Ubicaciones',
    hi: 'सभी स्थान',
    pa: 'ਸਾਰੇ ਸਥਾਨ',
    te: 'అన్ని స్థానాలు',
    sw: 'Maeneo Yote'
  },
  filter_infected: {
    en: 'Infected Only (>0%)',
    es: 'Solo Infectados (>0%)',
    hi: 'केवल संक्रमित (>0%)',
    pa: 'ਸਿਰਫ਼ ਬਿਮਾਰੀ ਵਾਲੇ (>0%)',
    te: 'వ్యాధి సోకినవి మాత్రమే (>0%)',
    sw: 'Yaliyoathirika Tu (>0%)'
  },
  filter_severe: {
    en: 'Severe Foci (>60%)',
    es: 'Focos Severos (>60%)',
    hi: 'गंभीर केंद्र (>60%)',
    pa: 'ਗੰਭੀਰ ਖੇਤਰ (>60%)',
    te: 'తీవ్రమైన కేంద్రాలు (>60%)',
    sw: 'Maeneo Hatari Sana (>60%)'
  },

  // Smart Advisory
  smart_advisory_title: {
    en: 'Localized Smart Agronomic Advisory',
    es: 'Asesoría Agronómica Inteligente Localizada',
    hi: 'स्थानीय स्मार्ट कृषि सलाह',
    pa: 'ਸਥਾਨਕ ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ ਸਲਾਹ',
    te: 'స్థానిక స్మార్ట్ వ్యవసాయ సలహా',
    sw: 'Ushauri wa Kilimo wa Kisasa wa Kienyeji'
  },
  immediate_actions: {
    en: 'Immediate Action Protocols',
    es: 'Protocolos de Acción Inmediata',
    hi: 'तत्काल कार्रवाई प्रोटोकॉल',
    pa: 'ਤੁਰੰਤ ਕਾਰਵਾਈ ਪ੍ਰੋਟੋਕੋਲ',
    te: 'తక్షణ చర్య మార్గదర్శకాలు',
    sw: 'Hatua za Haraka za Kuchukua'
  },
  biological_control: {
    en: 'Biological & Organic Treatments',
    es: 'Tratamientos Biológicos y Orgánicos',
    hi: 'जैविक और प्राकृतिक उपचार',
    pa: 'ਜੈਵਿਕ ਅਤੇ ਕੁਦਰਤੀ ਇਲਾਜ',
    te: 'జీవ మరియు సేంద్రీయ నివారణలు',
    sw: 'Tiba za Asili na Kibiolojia'
  },
  chemical_control: {
    en: 'Targeted Fungicide Regimen',
    es: 'Régimen de Fungicidas Dirigidos',
    hi: 'लक्षित कवकनाशी व्यवस्था',
    pa: 'ਲੋੜੀਂਦੇ ਉੱਲੀਨਾਸ਼ਕ ਨਿਯਮ',
    te: 'లక్షిత శిలీంద్ర సంహారిణి విధానం',
    sw: 'Mpango wa Dawa za Kuvu'
  },
  cultural_practices: {
    en: 'Cultural & Field Management',
    es: 'Prácticas Culturales y Manejo de Campo',
    hi: 'कृषि पद्धतियाँ और खेत प्रबंधन',
    pa: 'ਖੇਤ ਪ੍ਰਬੰਧਨ ਅਤੇ ਸਾਵਧਾਨੀਆਂ',
    te: 'సాగు పద్ధతులు & క్షేత్ర నిర్వహణ',
    sw: 'Usimamizi wa Shamba na Kilimo'
  },

  // Diagnosis History & Global Dashboard Control Panel
  history_title_grower: {
    en: 'Diagnosis Archive & History',
    es: 'Archivo e Historial de Diagnósticos',
    hi: 'निदान पुरालेख और इतिहास',
    pa: 'ਨਿਦਾਨ ਪੁਰਾਲੇਖ ਅਤੇ ਇਤਿਹਾਸ',
    te: 'రోగనిర్ధారణ చరిత్ర & ఆర్కైవ్',
    sw: 'Kumbukumbu ya Uchunguzi wa Magonjwa'
  },
  history_title_farmer: {
    en: 'Foliar Surveillance & Pathology Archive',
    es: 'Vigilancia Foliar y Archivo de Patología',
    hi: 'पर्ण निगरानी और विकृति विज्ञान पुरालेख',
    pa: 'ਪੱਤਿਆਂ ਦੀ ਨਿਗਰਾਨੀ ਅਤੇ ਪੈਥੋਲੋਜੀ ਪੁਰਾਲੇਖ',
    te: 'పత్ర నిఘా & పాథాలజీ ఆర్కైవ్',
    sw: 'Ufuatiliaji wa Majani na Hifadhi ya Magonjwa'
  },
  history_subtitle_grower: {
    en: 'Archived single-leaf pathology records, U-Net lesion segmentations, and mitigation schedules.',
    es: 'Registros de patología foliar, segmentación de lesiones U-Net y calendarios de mitigación.',
    hi: 'संग्रहीत एकल-पत्ती रोग रिकॉर्ड, यू-नेट घाव विभाजन और शमन कार्यक्रम।',
    pa: 'ਸੰਭਾਲੇ ਗਏ ਪੱਤੇ ਦੇ ਰੋਗ ਰਿਕਾਰਡ, ਯੂ-ਨੈੱਟ ਨਿਸ਼ਾਨ ਵਿਭਾਜਨ ਅਤੇ ਇਲਾਜ ਸਮਾਂ-ਸਾਰਣੀ।',
    te: 'భద్రపరచబడిన ఆకు వ్యాధి రికార్డులు, యు-నెట్ సెగ్మెంటేషన్ మరియు నివారణ ప్రణాళికలు.',
    sw: 'Kumbukumbu za magonjwa ya majani, vipimo vya U-Net, na ratiba za matibabu.'
  },
  history_subtitle_farmer: {
    en: 'Field-scale geo-tagged canopy surveillance, continuous severity scores, and localized crop protections.',
    es: 'Vigilancia de campo geolocalizada, puntuaciones de severidad continuas y protección de cultivos.',
    hi: 'खेत-स्तरीय भू-टैग की गई कैनोपी निगरानी, निरंतर गंभीरता स्कोर और स्थानीय फसल सुरक्षा।',
    pa: 'ਖੇਤ ਪੱਧਰੀ ਜੀਓ-ਟੈਗਡ ਨਿਗਰਾਨੀ, ਗੰਭੀਰਤਾ ਸਕੋਰ ਅਤੇ ਸਥਾਨਕ ਫਸਲ ਸੁਰੱਖਿਆ।',
    te: 'క్షేత్ర స్థాయి జియో-ట్యాగ్డ్ నిఘా, నిరంతర తీవ్రత స్కోర్లు మరియు స్థానిక పంట రక్షణ.',
    sw: 'Ufuatiliaji wa shamba zima kwa GPS, vipimo vya ukali wa magonjwa, na kinga ya mazao.'
  },
  dashboard_settings: {
    en: 'Dashboard Settings',
    es: 'Configuración del Panel',
    hi: 'डैशबोर्ड सेटिंग्स',
    pa: 'ਡੈਸ਼ਬੋਰਡ ਸੈਟਿੰਗਾਂ',
    te: 'డ్యాష్‌బోర్డ్ సెట్టింగ్‌లు',
    sw: 'Mipangilio ya Dashibodi'
  },
  lang_advisory: {
    en: 'Language / Advisory',
    es: 'Idioma / Asesoría',
    hi: 'भाषा / कृषि सलाह',
    pa: 'ਭਾਸ਼ਾ / ਸਲਾਹ',
    te: 'భాష / సలహాలు',
    sw: 'Lugha / Ushauri'
  },
  grower_mode: {
    en: 'Grower Mode',
    es: 'Modo Cultivador',
    hi: 'उत्पादक मोड',
    pa: 'ਕਾਸ਼ਤਕਾਰ ਮੋਡ',
    te: 'రైతు మోడ్',
    sw: 'Hali ya Mkulima Mdogo'
  },
  farmer_mode: {
    en: 'Farmer Mode',
    es: 'Modo Agrónomo / Finca',
    hi: 'व्यावसायिक किसान मोड',
    pa: 'ਵੱਡੇ ਕਿਸਾਨ ਮੋਡ',
    te: 'వాణిజ్య రైతు మోడ్',
    sw: 'Hali ya Mkulima Mkubwa'
  },
  scan_new_leaf: {
    en: 'Scan New Leaf',
    es: 'Escanear Nueva Hoja',
    hi: 'नई पत्ती स्कैन करें',
    pa: 'ਨਵਾਂ ਪੱਤਾ ਸਕੈਨ ਕਰੋ',
    te: 'కొత్త ఆకును స్కాన్ చేయండి',
    sw: 'Changanua Jani Jipya'
  },
  search_placeholder: {
    en: 'Search plant, disease, or specimen filename...',
    es: 'Buscar planta, enfermedad o nombre de archivo...',
    hi: 'पौधा, रोग या नमूना फ़ाइल नाम खोजें...',
    pa: 'ਪੌਦਾ, ਬਿਮਾਰੀ ਜਾਂ ਫਾਈਲ ਦਾ ਨਾਮ ਖੋਜੋ...',
    te: 'మొక్క, వ్యాధి లేదా ఫైల్ పేరును శోధించండి...',
    sw: 'Tafuta mmea, ugonjwa au jina la picha...'
  },
  sort_newest: {
    en: 'Newest First',
    es: 'Más Reciente Primero',
    hi: 'नवीनतम पहले',
    pa: 'ਨਵੇਂ ਪਹਿਲਾਂ',
    te: 'సరికొత్తవి ముందు',
    sw: 'Mpya Zaidi Kwanza'
  },
  sort_oldest: {
    en: 'Oldest First',
    es: 'Más Antiguo Primero',
    hi: 'पुरातन पहले',
    pa: 'ਪੁਰਾਣੇ ਪਹਿਲਾਂ',
    te: 'పాతవి ముందు',
    sw: 'Za Zamani Kwanza'
  },
  sort_highest: {
    en: 'Highest Severity',
    es: 'Mayor Severidad',
    hi: 'उच्चतम गंभीरता',
    pa: 'ਸਭ ਤੋਂ ਵੱਧ ਗੰਭੀਰਤਾ',
    te: 'అత్యధిక తీవ్రత',
    sw: 'Ukali wa Juu Zaidi'
  },
  sort_lowest: {
    en: 'Lowest Severity',
    es: 'Menor Severidad',
    hi: 'न्यूनतम गंभीरता',
    pa: 'ਸਭ ਤੋਂ ਘੱਟ ਗੰਭੀਰਤਾ',
    te: 'అత్యల్ప తీవ్రత',
    sw: 'Ukali wa Chini Zaidi'
  },
  filter_severity: {
    en: 'Severity',
    es: 'Severidad',
    hi: 'गंभीरता',
    pa: 'ਗੰਭੀਰਤਾ',
    te: 'తీవ్రత',
    sw: 'Ukali'
  },
  pill_all_scans: {
    en: 'All Scans',
    es: 'Todos los Escaneos',
    hi: 'सभी स्कैन',
    pa: 'ਸਾਰੇ ਸਕੈਨ',
    te: 'అన్ని స్కాన్‌లు',
    sw: 'Skana Zote'
  },
  pill_healthy: {
    en: 'Healthy',
    es: 'Sano',
    hi: 'स्वस्थ',
    pa: 'ਤੰਦਰੁਸਤ',
    te: 'ఆరోగ్యకరమైనవి',
    sw: 'Yenye Afya'
  },
  pill_mild: {
    en: 'Mild',
    es: 'Leve',
    hi: 'हल्का',
    pa: 'ਹਲਕਾ',
    te: 'స్వల్పం',
    sw: 'Kiasi Kidogo'
  },
  pill_moderate: {
    en: 'Moderate',
    es: 'Moderado',
    hi: 'मध्यम',
    pa: 'ਦਰਮਿਆਨਾ',
    te: 'మధ్యస్థం',
    sw: 'Kati na Kati'
  },
  pill_severe: {
    en: 'Severe',
    es: 'Severo',
    hi: 'गंभीर',
    pa: 'ਗੰਭੀਰ',
    te: 'తీవ్రం',
    sw: 'Kali Sana'
  },
  pill_critical: {
    en: 'Critical',
    es: 'Crítico',
    hi: 'अत्यंत गंभीर',
    pa: 'ਨਾਜ਼ੁਕ',
    te: 'అత్యంత తీవ్రం',
    sw: 'Hatari Kubwa'
  },
  view_grid: {
    en: 'Grid View',
    es: 'Vista en Cuadrícula',
    hi: 'ग्रिड दृश्य',
    pa: 'ਗਰਿੱਡ ਦ੍ਰਿਸ਼',
    te: 'గ్రిడ్ వీక్షణ',
    sw: 'Mtazamo wa Gridi'
  },
  view_list: {
    en: 'List View',
    es: 'Vista de Lista',
    hi: 'सूची दृश्य',
    pa: 'ਸੂਚੀ ਦ੍ਰਿਸ਼',
    te: 'జాబితా వీక్షణ',
    sw: 'Mtazamo wa Orodha'
  },
  view_map: {
    en: 'Hotspot Map View',
    es: 'Mapa de Puntos Críticos',
    hi: 'हॉटस्पॉट मैप दृश्य',
    pa: 'ਹੌਟਸਪੌਟ ਨਕਸ਼ਾ ਦ੍ਰਿਸ਼',
    te: 'హాట్‌స్పాట్ మ్యాప్ వీక్షణ',
    sw: 'Mtazamo wa Ramani ya Hatari'
  },
  no_diagnoses_found: {
    en: 'No Diagnoses Found',
    es: 'No se Encontraron Diagnósticos',
    hi: 'कोई निदान नहीं मिला',
    pa: 'ਕੋਈ ਨਿਦਾਨ ਨਹੀਂ ਮਿਲਿਆ',
    te: 'ఎలాంటి రికార్డులు కనుగొనబడలేదు',
    sw: 'Hakuna Kumbukumbu Zilizopatikana'
  },
  no_diagnoses_empty_db: {
    en: 'You have not scanned any plant leaves yet. Take your first scan to generate an AI diagnosis report!',
    es: 'Aún no ha escaneado hojas de plantas. ¡Realice su primer escaneo para generar un informe!',
    hi: 'आपने अभी तक किसी भी पौधे की पत्ती को स्कैन नहीं किया है। रिपोर्ट बनाने के लिए पहला स्कैन करें!',
    pa: 'ਤੁਸੀਂ ਅਜੇ ਤੱਕ ਕਿਸੇ ਪੱਤੇ ਨੂੰ ਸਕੈਨ ਨਹੀਂ ਕੀਤਾ ਹੈ। ਰਿਪੋਰਟ ਲਈ ਪਹਿਲਾ ਸਕੈਨ ਕਰੋ!',
    te: 'మీరు ఇంకా ఏ మొక్క ఆకును స్కాన్ చేయలేదు. మొదటి రిపోర్ట్ కోసం ఇప్పుడే స్కాన్ చేయండి!',
    sw: 'Hujachanganua jani lolote bado. Fanya uchunguzi wa kwanza kupata ripoti!'
  },
  no_diagnoses_filtered: {
    en: 'No scanned records match your current search and severity filters.',
    es: 'Ningún registro coincide con los filtros de búsqueda y severidad seleccionados.',
    hi: 'कोई भी स्कैन किया गया रिकॉर्ड आपकी खोज और गंभीरता फ़िल्टर से मेल नहीं खाता है।',
    pa: 'ਕੋਈ ਵੀ ਰਿਕਾਰਡ ਤੁਹਾਡੀ ਖੋਜ ਅਤੇ ਫਿਲਟਰ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ।',
    te: 'మీ శోధన మరియు ఫిల్టర్‌లకు సరిపోయే రికార్డులు ఏవీ లేవు.',
    sw: 'Hakuna ripoti inayolingana na vichujio ulivyochagua.'
  },
  scan_a_leaf_now: {
    en: 'Scan a Leaf Now',
    es: 'Escanear una Hoja Ahora',
    hi: 'अब पत्ती स्कैन करें',
    pa: 'ਹੁਣੇ ਪੱਤਾ ਸਕੈਨ ਕਰੋ',
    te: 'ఇప్పుడే ఆకును స్కాన్ చేయండి',
    sw: 'Changanua Jani Sasa'
  },
  full_details: {
    en: 'Full Details',
    es: 'Detalles Completos',
    hi: 'पूरा विवरण',
    pa: 'ਪੂਰਾ ਵੇਰਵਾ',
    te: 'పూర్తి వివరాలు',
    sw: 'Maelezo Kamili'
  },
  pdf_report: {
    en: 'PDF Report',
    es: 'Informe PDF',
    hi: 'पीडीएफ रिपोर्ट',
    pa: 'ਪੀਡੀਐਫ ਰਿਪੋਰਟ',
    te: 'పీడీఎఫ్ నివేదిక',
    sw: 'Ripoti ya PDF'
  },
  quick_view: {
    en: 'Quick View',
    es: 'Vista Rápida',
    hi: 'त्वरित दृश्य',
    pa: 'ਤੁਰੰਤ ਦ੍ਰਿਸ਼',
    te: 'త్వరిత వీక్షణ',
    sw: 'Mtazamo wa Haraka'
  },
  telemetry_banner_title: {
    en: 'Field Microclimate Telemetry',
    es: 'Telemetría de Microclima de Campo',
    hi: 'खेत माइक्रॉक्लाइमेट टेलीमेट्री',
    pa: 'ਖੇਤ ਮੌਸਮੀ ਟੈਲੀਮੈਟਰੀ',
    te: 'క్షేత్ర వాతావరణ టెలిమెట్రీ',
    sw: 'Takwimu za Hali ya Hewa Shambani'
  },
  fungal_risk_index: {
    en: 'Pathogen Inoculum Risk',
    es: 'Riesgo de Inóculo de Patógenos',
    hi: 'रोगजनक संक्रमण जोखिम',
    pa: 'ਰੋਗ ਲਾਗ ਦਾ ਖ਼ਤਰਾ',
    te: 'వ్యాధి ప్రమాద సూచిక',
    sw: 'Kiwango cha Hatari ya Magonjwa'
  }
};

export function t(key: string, lang: string = 'en'): string {
  const item = TRANSLATIONS[key];
  if (!item) return key;
  const langKey = lang as SupportedLanguage;
  return item[langKey] || item.en || key;
}
