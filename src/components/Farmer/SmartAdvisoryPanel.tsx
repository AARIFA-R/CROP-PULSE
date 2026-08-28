import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Leaf, 
  FlaskConical, 
  Calendar, 
  HelpCircle, 
  Sprout, 
  Languages,
  ChevronDown
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, t } from '../../lib/i18n';
import { DiagnosisResult } from '../../types';

interface SmartAdvisoryPanelProps {
  dominantDisease?: string;
  diagnoses: DiagnosisResult[];
  lang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const SmartAdvisoryPanel: React.FC<SmartAdvisoryPanelProps> = ({
  dominantDisease = 'Early Blight (Alternaria solani)',
  diagnoses,
  lang,
  onLanguageChange
}) => {
  const [activeTab, setActiveTab] = useState<'immediate' | 'organic' | 'chemical' | 'cultural'>('immediate');

  // Aggregated recommendations from all diseased samples
  const diseasedSamples = diagnoses.filter(d => d.severityPercentage > 10);
  const sampleWithRec = diseasedSamples[0] || diagnoses[0];

  // Multilingual advisory content dictionary for common agronomic conditions
  const ADVISORY_CONTENT = {
    immediate: {
      en: [
        'Prune lower canopy leaves (0-18 inches) showing concentric target spot rings and incinerate off-field.',
        'Halt all overhead sprinkler irrigation immediately to starve conidia spores of free moisture.',
        'Sterilize pruning shears with 70% isopropyl alcohol between rows to prevent mechanical vectoring.',
        'Establish 24-hour quarantine perimeter around identified disease hotspots.'
      ],
      es: [
        'Podar las hojas del dosel inferior (0-45 cm) con anillos concéntricos e incinerarlas fuera del campo.',
        'Suspender el riego por aspersión inmediatamente para privar de humedad libre a las esporas.',
        'Esterilizar las tijeras de podar con alcohol al 70% entre hileras para evitar propagación mecánica.',
        'Establecer un perímetro de cuarentena de 24 horas alrededor de los focos identificados.'
      ],
      hi: [
        'संवैधानिक रिंग वाले निचले पत्तों (0-45 सेमी) की छंटाई करें और उन्हें खेत से बाहर नष्ट करें।',
        'बीजाणुओं को नमी से वंचित करने के लिए फव्वारा सिंचाई तुरंत बंद कर दें।',
        'पौधों के बीच कतरनी को 70% अल्कोहल से साफ करें ताकि संक्रमण न फैले।',
        'पहचाने गए हॉटस्पॉट के चारों ओर 24 घंटे का संगरोध क्षेत्र स्थापित करें।'
      ],
      pa: [
        'ਹੇਠਲੇ ਰੋਗੀ ਪੱਤਿਆਂ ਦੀ ਕਟਾਈ ਕਰੋ ਅਤੇ ਖੇਤ ਤੋਂ ਬਾਹਰ ਨਸ਼ਟ ਕਰੋ।',
        'ਉੱਲੀ ਦੇ ਵਾਧੇ ਨੂੰ ਰੋਕਣ ਲਈ ਫੁਹਾਰਾ ਸਿੰਚਾਈ ਤੁਰੰਤ ਬੰਦ ਕਰੋ।',
        'ਇੱਕ ਪੌਦੇ ਤੋਂ ਦੂਜੇ ਪੌਦੇ ਵਿੱਚ ਬਿਮਾਰੀ ਫੈਲਣ ਤੋਂ ਰੋਕਣ ਲਈ ਕੈਂਚੀ ਨੂੰ ਅਲਕੋਹਲ ਨਾਲ ਸਾਫ਼ ਕਰੋ।',
        'ਪ੍ਰਭਾਵਿਤ ਖੇਤਰਾਂ ਦੁਆਲੇ ਨਿਗਰਾਨੀ ਘੇਰਾ ਬਣਾਓ।'
      ],
      te: [
        'మచ్చలు ఉన్న దిగువ ఆకులను తొలగించి పొలం బయట కాల్చివేయండి.',
        'శిలీంధ్రాల వ్యాప్తిని అరికట్టడానికి వెంటనే తుంపర సేద్యాన్ని నిలిపివేయండి.',
        'కత్తిరింపు పరికరాలను ఆల్కహాల్‌తో శుభ్రం చేసి మాత్రమే ఉపయోగించండి.',
        'వ్యాధి సోకిన ప్రాంతాల చుట్టూ ప్రత్యేక రక్షణ వలయాన్ని ఏర్పాటు చేయండి.'
      ],
      sw: [
        'Pogoa majani ya chini yenye madoa na uyachome moto mbali na shamba.',
        'Sitisha umwagiliaji wa juu mara moja ili kuzuia unyevu unaostawisha ukungu.',
        'Safisha mikasi ya kupogoa kwa dawa ya kuua vijidudu ili kuzuia maambukizi.',
        'Tenga eneo lenye maambukizi kwa uangalifu maalum.'
      ]
    },
    organic: {
      en: [
        'Foliar spray of Bacillus subtilis (Bio-fungicide) at 5g/L applied at early dawn.',
        'Apply cold-pressed Neem Oil (Azadirachtin 1%) at 3-5ml/L every 7 days as an antifungal film.',
        'Spray Copper Octanoate (Copper soap) compliant with organic certification standards.',
        'Apply compost tea enriched with Trichoderma harzianum to colonize leaf phyllosphere.'
      ],
      es: [
        'Pulverización foliar de Bacillus subtilis (Biofungicida) a 5g/L aplicada al amanecer.',
        'Aplicar aceite de Neem prensado en frío (Azadiractina 1%) a 3-5ml/L cada 7 días.',
        'Aplicar Octanoato de Cobre compatible con normas de certificación orgánica.',
        'Aplicar té de compost enriquecido con Trichoderma harzianum para proteger la filosfera.'
      ],
      hi: [
        'सुबह के समय बैसिलस सबटिलिस (जैव-कवकनाशी) 5 ग्राम/लीटर का पर्ण छिड़काव करें।',
        'एंटीफंगल फिल्म के रूप में हर 7 दिनों में 3-5 मिली/लीटर नीम का तेल (1%) लगाएं।',
        'जैविक मानकों के अनुसार कॉपर ऑक्टानोएट का छिड़काव करें।',
        'पत्तियों की सुरक्षा के लिए ट्राइकोडर्मा हर्ज़ियानम युक्त कम्पोस्ट चाय का प्रयोग करें।'
      ],
      pa: [
        'ਸਵੇਰ ਵੇਲੇ ਬੈਸੀਲਸ ਸਬਟਿਲਿਸ (ਜੈਵਿਕ ਉੱਲੀਨਾਸ਼ਕ) 5 ਗ੍ਰਾਮ/ਲਿਟਰ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।',
        'ਹਰ 7 ਦਿਨਾਂ ਬਾਅਦ ਨਿੰਮ ਦਾ ਤੇਲ 3-5 ਮਿਲੀ/ਲਿਟਰ ਲਗਾਓ।',
        'ਜੈਵਿਕ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਤਾਂਬਾ ਯੁਕਤ ਸੁਰੱਖਿਆ ਘੋਲ ਵਰਤੋ।',
        'ਟ੍ਰਾਈਕੋਡਰਮਾ ਵਾਲੀ ਜੈਵਿਕ ਖਾਦ ਦਾ ਘੋਲ ਪੱਤਿਆਂ ਤੇ ਛਿੜਕੋ।'
      ],
      te: [
        'ఉదయాన్నే బాసిల్లస్ సబ్టిలిస్ (జీవ శిలీంద్ర సంహారిణి) 5 గ్రా/లీ చొప్పున పిచికారీ చేయండి.',
        'ప్రతి 7 రోజులకు ఒకసారి వేప నూనె (3-5 మి.లీ/లీ) పిచికారీ చేయండి.',
        'సేంద్రీయ ప్రమాణాలకు అనుగుణంగా కాపర్ సబ్బు ద్రావణాన్ని వాడండి.',
        'ఆకుల రక్షణ కోసం ట్రైకోడెర్మాతో కూడిన కంపోస్ట్ టీని పిచికారీ చేయండి.'
      ],
      sw: [
        'Nyunyizia Bacillus subtilis asubuhi na mapema kwa 5g kwa lita moja ya maji.',
        'Tumia Mafuta ya Mwarobaini (Neem Oil) 3-5ml/L kila baada ya siku 7 kama kinga.',
        'Tumia dawa ya asili ya shaba kulingana na miongozo ya kilimo hai.',
        'Nyunyizia mboji iliyo na vijidudu rafiki vya Trichoderma kulinda majani.'
      ]
    },
    chemical: {
      en: [
        'Preventative: Chlorothalonil 75 WP at 2.0g/L or Mancozeb 75 WG at 2.5g/L foliar spray.',
        'Curative: Azoxystrobin 18.2% + Difenoconazole 11.4% SC at 1.0ml/L for systemic translaminar control.',
        'Alternate active modes of action (FRAC Group 11 with FRAC Group 3) to prevent resistance.',
        'Adhere strictly to 7-day Pre-Harvest Interval (PHI) and mandatory personal protective equipment.'
      ],
      es: [
        'Preventivo: Clorotalonil 75 WP a 2.0g/L o Mancozeb 75 WG a 2.5g/L en pulverización foliar.',
        'Curativo: Azoxistrobina 18.2% + Difenoconazol 11.4% SC a 1.0ml/L para control sistémico.',
        'Alternar modos de acción (Grupo FRAC 11 con FRAC 3) para evitar resistencia.',
        'Respetar el intervalo de 7 días antes de la cosecha (PHI) y usar equipo de protección.'
      ],
      hi: [
        'निवारक: क्लोरोथैलोनिल 75 WP 2.0 ग्राम/लीटर या मैंकोजेब 75 WG 2.5 ग्राम/लीटर का छिड़काव।',
        'उपचारात्मक: एज़ोक्सिस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC 1.0 मिली/लीटर।',
        'प्रतिरोध को रोकने के लिए विभिन्न कवकनाशी समूहों (FRAC 11 और FRAC 3) को बारी-बारी से बदलें।',
        'कटाई से पहले 7 दिन की प्रतीक्षा अवधि (PHI) का कड़ाई से पालन करें।'
      ],
      pa: [
        'ਬਚਾਅ ਲਈ: ਕਲੋਰੋਥੈਲੋਨਿਲ 2.0 ਗ੍ਰਾਮ/ਲਿਟਰ ਜਾਂ ਮੈਨਕੋਜ਼ੇਬ 2.5 ਗ੍ਰਾਮ/ਲਿਟਰ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।',
        'ਇਲਾਜ ਲਈ: ਅਜ਼ੌਕਸੀਸਟ੍ਰੋਬਿਨ + ਡਿਫੇਨੋਕੋਨਾਜ਼ੋਲ 1.0 ਮਿਲੀ/ਲਿਟਰ ਵਰਤੋ।',
        'ਉੱਲੀਨਾਸ਼ਕ ਦਵਾਈਆਂ ਬਦਲ-ਬਦਲ ਕੇ ਵਰਤੋ ਤਾਂ ਜੋ ਕੀੜੇ ਪ੍ਰਤੀਰੋਧੀ ਨਾ ਬਣਨ।',
        'ਵਾਢੀ ਤੋਂ ਪਹਿਲਾਂ 7 ਦਿਨਾਂ ਦੇ ਵਕਫ਼ੇ ਦਾ ਧਿਆਨ ਰੱਖੋ ਅਤੇ ਸੁਰੱਖਿਆ ਕਿੱਟ ਪਾਓ।'
      ],
      te: [
        'నివారణకు: క్లోరోథలోనిల్ 2.0 గ్రా/లీ లేదా మాంకోజెబ్ 2.5 గ్రా/లీ పిచికారీ చేయండి.',
        'వ్యాధి తీవ్రతకు: అజోక్సిస్ట్రోబిన్ + డైఫెనోకోనజోల్ 1.0 మి.లీ/లీ వాడండి.',
        'మందులను మార్చి మార్చి వాడటం ద్వారా శిలీంధ్రాల నిరోధకతను నివారించండి.',
        'కోతకు ముందు 7 రోజుల వ్యవధి పాటించండి మరియు రక్షణ దుస్తులు ధరించండి.'
      ],
      sw: [
        'Kinga: Nyunyizia Chlorothalonil 2.0g/L au Mancozeb 2.5g/L kwenye majani yote.',
        'Tiba: Tumia Azoxystrobin + Difenoconazole 1.0ml/L kwa udhibiti wa kina.',
        'Badilisha aina za dawa za kuua ukungu mara kwa mara kuzuia usugu wa ugonjwa.',
        'Zingatia muda wa kusubiri kabla ya kuvuna (siku 7) na vaa mavazi ya kujikinga.'
      ]
    },
    cultural: {
      en: [
        'Enforce 3-year crop rotation with non-host species (corn, sorghum, beans, brassicas).',
        'Install 2-inch organic straw mulch layer to stop soil-borne spore rain splash.',
        'Increase inter-plant spacing to 30-36 inches for rapid morning canopy drying.',
        'Soil test and maintain calcium/boron balance to strengthen plant cell wall lignification.'
      ],
      es: [
        'Implementar rotación de cultivos de 3 años con especies no hospedantes (maíz, frijol).',
        'Instalar una capa de mantillo de paja de 5 cm para evitar salpicaduras de esporas del suelo.',
        'Aumentar la distancia entre plantas a 75-90 cm para secado rápido del follaje.',
        'Mantener equilibrio de calcio y boro en el suelo para fortalecer las paredes celulares.'
      ],
      hi: [
        'गैर-पोषक फसलों (मक्का, ज्वार, फलियां) के साथ 3 साल का फसल चक्र अपनाएं।',
        'मिट्टी से बीजाणुओं के छींटे रोकने के लिए 2 इंच पुआल की मल्चिंग लगाएं।',
        'सुबह की धूप में पत्तियों को जल्दी सुखाने के लिए पौधों के बीच 30-36 इंच की दूरी रखें।',
        'कोशिका भित्ति को मजबूत करने के लिए मिट्टी में कैल्शियम और बोरॉन का संतुलन बनाए रखें।'
      ],
      pa: [
        'ਮੱਕੀ ਜਾਂ ਦਾਲਾਂ ਨਾਲ 3 ਸਾਲਾਂ ਦਾ ਫਸਲ ਚੱਕਰ ਅਪਣਾਓ।',
        'ਜ਼ਮੀਨ ਤੋਂ ਉੱਲੀ ਦੇ ਛਿੱਟੇ ਰੋਕਣ ਲਈ ਪਰਾਲੀ ਦੀ ਮਲਚਿੰਗ ਕਰੋ।',
        'ਪੌਦਿਆਂ ਵਿਚਕਾਰ ਫਾਸਲਾ ਵਧਾਓ ਤਾਂ ਜੋ ਹਵਾ ਅਤੇ ਧੁੱਪ ਚੰਗੀ ਤਰ੍ਹਾਂ ਲੱਗ ਸਕੇ।',
        'ਮਿੱਟੀ ਵਿੱਚ ਕੈਲਸ਼ੀਅਮ ਅਤੇ ਬੋਰਾਨ ਦੀ ਸਹੀ ਮਾਤਰਾ ਬਣਾਈ ਰੱਖੋ।'
      ],
      te: [
        'మొక్కజొన్న లేదా చిక్కుడు పంటలతో 3 సంవత్సరాల పంట మార్పిడి విధానాన్ని పాటించండి.',
        'మట్టి నుండి తెగుళ్లు వ్యాపించకుండా 2 అంగుళాల గడ్డి కప్పడం (మల్చింగ్) చేయండి.',
        'ఆకులు త్వరగా ఆరడానికి మొక్కల మధ్య 30-36 అంగుళాల దూరం ఉంచండి.',
        'మొక్కల రోగనిరోధక శక్తిని పెంచడానికి కాల్షియం మరియు బోరాన్ సమతుల్యతను పాటించండి.'
      ],
      sw: [
        'Zungusha mazao kwa miaka 3 ukitumia mahindi au jamii ya mikunde.',
        'Weka matandazo ya majani makavu ya inchi 2 kuzuia mchanga wenye vijidudu kurukia majani.',
        'Ongeza nafasi kati ya miche hadi inchi 30-36 ili kuruhusu upepo na mwanga wa jua.',
        'Boresha udongo kwa madini ya calcium na boron ili kuimarisha kuta za seli za mmea.'
      ]
    }
  };

  const currentList = ADVISORY_CONTENT[activeTab][lang] || ADVISORY_CONTENT[activeTab].en;

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-6 space-y-6 font-sans">
      
      {/* Header & Language Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
              {t('smart_advisory_title', lang)}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight mt-0.5 flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-600" />
            {dominantDisease} Mitigation Strategy
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            AI agronomy advisory localized for regional farm practices
          </p>
        </div>

        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="pl-3 pr-8 py-2 text-xs font-black rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none shadow-xs"
            >
              {SUPPORTED_LANGUAGES.map(item => (
                <option key={item.code} value={item.code}>
                  {item.flag} {item.nativeName} ({item.label})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-700 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Advisory Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'immediate', label: t('immediate_actions', lang), icon: ShieldAlert, color: 'rose' },
          { id: 'organic', label: t('biological_control', lang), icon: Leaf, color: 'emerald' },
          { id: 'chemical', label: t('chemical_control', lang), icon: FlaskConical, color: 'purple' },
          { id: 'cultural', label: t('cultural_practices', lang), icon: Calendar, color: 'amber' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition ${
                isActive
                  ? 'bg-emerald-950 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Advisory Items List */}
      <div className="bg-emerald-50/40 rounded-3xl p-5 border border-emerald-100 space-y-3">
        <ul className="space-y-2.5">
          {currentList.map((advice, idx) => (
            <li 
              key={idx} 
              className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                {advice}
              </p>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};
