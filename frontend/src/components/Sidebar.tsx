import React, { useState, useEffect, useRef } from 'react';
import {
  AlertCircle, Navigation, ShieldAlert, CheckCircle2,
  TrendingUp, CloudRain, Map, Globe, ChevronDown, X,
  Flame, Users, Zap, BarChart3, Route, Info
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

// ═══════════════════════════════════════════════
//  MULTILINGUAL TRANSLATIONS
// ═══════════════════════════════════════════════
const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', name: 'English', native: 'English' },
  { code: 'hi', flag: '🇮🇳', name: 'Hindi', native: 'हिन्दी' },
  { code: 'sa', flag: '🕉️', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'bn', flag: '🇧🇩', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', flag: '🇮🇳', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', flag: '🇮🇳', name: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', flag: '🇮🇳', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', flag: '🇮🇳', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', flag: '🇮🇳', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', flag: '🇮🇳', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', flag: '🇮🇳', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ur', flag: '🇵🇰', name: 'Urdu', native: 'اردو' },
  { code: 'ne', flag: '🇳🇵', name: 'Nepali', native: 'नेपाली' },
  { code: 'zh', flag: '🇨🇳', name: 'Chinese', native: '中文' },
  { code: 'ja', flag: '🇯🇵', name: 'Japanese', native: '日本語' },
  { code: 'ar', flag: '🇸🇦', name: 'Arabic', native: 'العربية' },
  { code: 'es', flag: '🇪🇸', name: 'Spanish', native: 'Español' },
  { code: 'fr', flag: '🇫🇷', name: 'French', native: 'Français' },
  { code: 'de', flag: '🇩🇪', name: 'German', native: 'Deutsch' },
  { code: 'ru', flag: '🇷🇺', name: 'Russian', native: 'Русский' },
];

type LangCode = typeof LANGUAGES[number]['code'];

const T: Record<string, Record<LangCode, string>> = {
  appTitle: { en: 'Unified Control Room', hi: 'एकीकृत नियंत्रण कक्ष', sa: 'एकीकृत नियंत्रणकक्षः', bn: 'একীভূত নিয়ন্ত্রণ কক্ষ', te: 'ఏకీకృత నియంత్రణ గది', ta: 'ஒருங்கிணைந்த கட்டுப்பாட்டு அறை', mr: 'एकीकृत नियंत्रण कक्ष', gu: 'એકીકૃત નિયંત્રણ ખંડ', kn: 'ಏಕೀಕೃತ ನಿಯಂತ್ರಣ ಕೊಠಡಿ', ml: 'ഏകീകൃത നിയന്ത്രണ മുറി', pa: 'ਏਕੀਕ੍ਰਿਤ ਕੰਟਰੋਲ ਰੂਮ', ur: 'متحدہ کنٹرول روم', ne: 'एकीकृत नियन्त्रण कक्ष', zh: '统一控制室', ja: '統合制御室', ar: 'غرفة التحكم الموحدة', es: 'Sala de Control Unificada', fr: 'Salle de Contrôle Unifiée', de: 'Einheitlicher Kontrollraum', ru: 'Единый центр управления' },
  appSubtitle: { en: 'SIMHASTHA CROWD ROUTING SYSTEM', hi: 'सिंहस्थ भीड़ मार्गदर्शन प्रणाली', sa: 'सिंहस्थ जनसमूह मार्गदर्शनव्यवस्था', bn: 'সিংহস্থ জনতা রুটিং সিস্টেম', te: 'సింహస్థ జనసమూహ మార్గదర్శక వ్యవస్థ', ta: 'சிம்ஹஸ்தா கூட்ட வழிகாட்டுதல் அமைப்பு', mr: 'सिंहस्थ गर्दी मार्गदर्शन प्रणाली', gu: 'સિંહસ્થ ભીડ રૂટિંગ સિસ્ટમ', kn: 'ಸಿಂಹಸ್ಥ ಜನಜಂಗುಳಿ ಮಾರ್ಗ ವ್ಯವಸ್ಥೆ', ml: 'സിംഹസ്ഥ ജനക്കൂട്ട് ആ route ഒരുക്കൽ', pa: 'ਸਿੰਘਸਥ ਭੀੜ ਰੂਟਿੰਗ ਸਿਸਟਮ', ur: 'سمہاستھا ہجوم روٹنگ سسٹم', ne: 'सिंहस्थ भिड मार्गदर्शन प्रणाली', zh: 'Simhastha 人群路由系统', ja: 'シンハスタ群衆誘導システム', ar: 'نظام توجيه حشود سيمهاستا', es: 'Sistema de Enrutamiento Simhastha', fr: 'Système de Routage Simhastha', de: 'Simhastha Massen-Routing-System', ru: 'Система маршрутизации толп Симхастха' },
  liveOps: { en: 'Live Operations', hi: 'लाइव संचालन', sa: 'सजीवसंचालनम्', bn: 'লাইভ অপারেশন', te: 'లైవ్ ఆపరేషన్స్', ta: 'நேரடி செயல்பாடுகள்', mr: 'लाइव्ह ऑपरेशन्स', gu: 'લાઇવ ઓપરેશન્સ', kn: 'ಲೈವ್ ಕಾರ್ಯಾಚರಣೆ', ml: 'ലൈവ് ഓപ്പറേഷൻ', pa: 'ਲਾਈਵ ਓਪਰੇਸ਼ਨ', ur: 'لائیو آپریشن', ne: 'लाइभ सञ्चालन', zh: '实时操作', ja: 'ライブ運用', ar: 'العمليات المباشرة', es: 'Operaciones en Vivo', fr: 'Opérations en Direct', de: 'Live-Betrieb', ru: 'Прямые операции' },
  insights: { en: 'Historical Insights', hi: 'ऐतिहासिक अंतर्दृष्टि', sa: 'ऐतिहासिकज्ञानम्', bn: 'ঐতিহাসিক অন্তর্দৃষ্টি', te: 'చారిత్రాత్మక అంతర్దృష్టి', ta: 'வரலாற்று நுண்ணறிவு', mr: 'ऐतिहासिक अंतर्दृष्टी', gu: 'ઐતિહાસિક આંતરદૃષ્ટિ', kn: 'ಐತಿಹಾಸಿಕ ಒಳನೋಟ', ml: 'ചരിത്രപരമായ ഉൾക്കാഴ്ചകൾ', pa: 'ਇਤਿਹਾਸਕ ਸੂਝ', ur: 'تاریخی بصیرت', ne: 'ऐतिहासिक अन्तर्दृष्टि', zh: '历史洞察', ja: '歴史的な洞察', ar: 'الرؤى التاريخية', es: 'Perspectivas Históricas', fr: 'Aperçus Historiques', de: 'Historische Einblicke', ru: 'Исторические данные' },
  totalCrowd: { en: 'TOTAL PILGRIMS', hi: 'कुल तीर्थयात्री', sa: 'समग्रतीर्थयात्रिणः', bn: 'মোট তীর্থযাত্রী', te: 'మొత్తం యాత్రికులు', ta: 'மொத்த யாத்ரீகர்கள்', mr: 'एकूण यात्रेकरू', gu: 'કુલ તીર્થયાત્રીઓ', kn: 'ಒಟ್ಟು ಯಾತ್ರಾರ್ಥಿಗಳು', ml: 'ആകെ തീർഥാടകർ', pa: 'ਕੁੱਲ ਤੀਰਥ ਯਾਤਰੀ', ur: 'کل حاجی', ne: 'कुल तीर्थयात्री', zh: '总朝圣者', ja: '巡礼者総数', ar: 'إجمالي الحجاج', es: 'Peregrinos Totales', fr: 'Total des Pèlerins', de: 'Pilger gesamt', ru: 'Всего паломников' },
  bottlenecks: { en: 'ACTIVE ALERTS', hi: 'सक्रिय अलर्ट', sa: 'सक्रियसूचनाः', bn: 'সক্রিয় সতর্কতা', te: 'చురుకైన హెచ్చరికలు', ta: 'செயலில் உள்ள எச்சரிக்கைகள்', mr: 'सक्रिय इशारे', gu: 'સક્રિય ચેતવણીઓ', kn: 'ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು', ml: 'സജീവ അലേർട്ടുകൾ', pa: 'ਸਰਗਰਮ ਚੇਤਾਵਨੀਆਂ', ur: 'فعال انتباہات', ne: 'सक्रिय सतर्कता', zh: '活跃警报', ja: 'アクティブアラート', ar: 'التنبيهات النشطة', es: 'Alertas Activas', fr: 'Alertes Actives', de: 'Aktive Warnungen', ru: 'Активные оголошения' },
  diversionRouting: { en: 'Diversion Routing', hi: 'मार्ग परिवर्तन', sa: 'मार्गपरिवर्तनम्', bn: 'ডাইভার্সন রুটিং', te: 'మళ్ళింపు మార్గం', ta: 'திசைதிருப்பல் வழித்தடம்', mr: 'मार्ग वळवणी', gu: 'ડાઇવર્ઝન રૂટીંગ', kn: 'ಮಾರ್ಗ ಬದಲಾವಣೆ', ml: 'ഡൈവേർഷൻ റൂട്ടിങ്', pa: 'ਡਾਇਵਰਜ਼ਨ ਰੂਟਿੰਗ', ur: 'ڈائیورژن روٹنگ', ne: 'मार्ग परिवर्तन', zh: '路线改道', ja: '迂回ルーティング', ar: 'تحويل المسار', es: 'Desvío de Ruta', fr: 'Détour de Routage', de: 'Umleitungsrouting', ru: 'Перенаправление маршрута' },
  selectSource: { en: 'Select Source Node...', hi: 'स्रोत नोड चुनें...', sa: 'स्रोतबिन्दुं चिनुत...', bn: 'উৎস নোড নির্বাচন করুন...', te: 'మూల స్థానం ఎంచుకోండి...', ta: 'மூல முனையை தேர்ந்தெடுக்கவும்...', mr: 'स्रोत नोड निवडा...', gu: 'સ્ત્રોત નોડ પસંદ કરો...', kn: 'ಮೂಲ ನೋಡ್ ಆಯ್ಕೆ ಮಾಡಿ...', ml: 'ഉറവിട നോഡ് തിരഞ്ഞെടുക്കുക...', pa: 'ਸਰੋਤ ਨੋਡ ਚੁਣੋ...', ur: 'ماخذ نوڈ منتخب کریں...', ne: 'स्रोत नोड छान्नुहोस्...', zh: '选择起始节点...', ja: '出発地を選択...', ar: 'اختر نقطة المصدر...', es: 'Seleccionar Nodo Origen...', fr: 'Choisir le Nœud Source...', de: 'Quellknoten auswählen...', ru: 'Выбрать исходный узел...' },
  selectTarget: { en: 'Select Target Node...', hi: 'लक्ष्य नोड चुनें...', sa: 'लक्ष्यबिन्दुं चिनुत...', bn: 'গন্তব্য নোড নির্বাচন করুন...', te: 'లక్ష్య స్థానం ఎంచుకోండి...', ta: 'இலக்கு முனையை தேர்ந்தெடுக்கவும்...', mr: 'लक्ष्य नोड निवडा...', gu: 'લક્ષ્ય નોડ પસંદ કરો...', kn: 'ಗುರಿ ನೋಡ್ ಆಯ್ಕೆ ಮಾಡಿ...', ml: 'ലക്ഷ്യ നോഡ് തിരഞ്ഞെടുക്കുക...', pa: 'ਟਾਰਗਿਟ ਨੋਡ ਚੁਣੋ...', ur: 'ہدف نوڈ منتخب کریں...', ne: 'लक्ष्य नोड छान्नुहोस्...', zh: '选择目标节点...', ja: '目的地を選択...', ar: 'اختر نقطة الهدف...', es: 'Seleccionar Nodo Destino...', fr: 'Choisir le Nœud Cible...', de: 'Zielknoten auswählen...', ru: 'Выбрать целевой узел...' },
  calcRoute: { en: 'Calculate Safe Route', hi: 'सुरक्षित मार्ग खोजें', sa: 'सुरक्षितमार्गं गणयतु', bn: 'নিরাপদ পথ গণনা করুন', te: 'సురక్షిత మార్గం లెక్కించు', ta: 'பாதுகாப்பான வழியை கணக்கிடு', mr: 'सुरक्षित मार्ग शोधा', gu: 'સુરક્ષિત માર્ગ ગણો', kn: 'ಸುರಕ್ಷಿತ ಮಾರ್ಗ ಲೆಕ್ಕ ಹಾಕಿ', ml: 'സുരക്ഷിത മാർഗ്ഗം കണക്കാക്കുക', pa: 'ਸੁਰੱਖਿਅਤ ਰਸਤਾ ਲੱਭੋ', ur: 'محفوظ راستہ تلاش کریں', ne: 'सुरक्षित मार्ग खोज्नुहोस्', zh: '计算安全路线', ja: '安全ルートを計算', ar: 'احسب المسار الآمن', es: 'Calcular Ruta Segura', fr: 'Calculer Itinéraire Sûr', de: 'Sicheren Route berechnen', ru: 'Рассчитать безопасный маршрут' },
  calculating: { en: 'Calculating...', hi: 'गणना हो रही है...', sa: 'गणयति...', bn: 'গণনা করা হচ্ছে...', te: 'లెక్కిస్తోంది...', ta: 'கணக்கிடுகிறது...', mr: 'गणना होत आहे...', gu: 'ગણના ચાલી રહી છે...', kn: 'ಲೆಕ್ಕಿಸಲಾಗುತ್ತಿದೆ...', ml: 'കണക്കാക്കുന്നു...', pa: 'ਗਣਨਾ ਹੋ ਰਹੀ ਹੈ...', ur: 'حساب لگایا جا رہا ہے...', ne: 'गणना हुँदैछ...', zh: '计算中...', ja: '計算中...', ar: 'جاري الحساب...', es: 'Calculando...', fr: 'Calcul en cours...', de: 'Berechne...', ru: 'Вычисляю...' },
  safeDistance: { en: 'Safe Distance:', hi: 'सुरक्षित दूरी:', sa: 'सुरक्षितदूरी:', bn: 'নিরাপদ দূরত্ব:', te: 'సురక్షిత దూరం:', ta: 'பாதுகாப்பான தூரம்:', mr: 'सुरक्षित अंतर:', gu: 'સુરક્ષિત અંતર:', kn: 'ಸುರಕ್ಷಿತ ದೂರ:', ml: 'സുരക്ഷിത ദൂരം:', pa: 'ਸੁਰੱਖਿਅਤ ਦੂਰੀ:', ur: 'محفوظ فاصلہ:', ne: 'सुरक्षित दूरी:', zh: '安全距离：', ja: '安全距離：', ar: 'المسافة الآمنة:', es: 'Distancia Segura:', fr: 'Distance Sûre:', de: 'Sichere Entfernung:', ru: 'Безопасная дистанция:' },
  estTime: { en: 'Est. Travel Time:', hi: 'अनुमानित यात्रा समय:', sa: 'अनुमितयात्राकालः:', bn: 'আনুমানিক ভ্রমণ সময়:', te: 'అంచనా ప్రయాణ సమయం:', ta: 'மதிப்பிடப்பட்ட பயண நேரம்:', mr: 'अंदाजे प्रवास वेळ:', gu: 'અંદાજિત મુસાફરી સમય:', kn: 'ಅಂದಾಜು ಪ್ರಯಾಣ ಸಮಯ:', ml: 'ഏകദേശ യാത്ര സമയം:', pa: 'ਅਨੁਮਾਨਿਤ ਯਾਤਰਾ ਸਮਾਂ:', ur: 'متوقع سفری وقت:', ne: 'अनुमानित यात्रा समय:', zh: '预计行程时间：', ja: '予想移動時間：', ar: 'وقت السفر المقدر:', es: 'Tiempo Viaje Estimado:', fr: 'Durée de trajet estimée:', de: 'Geschätzte Reisezeit:', ru: 'Расчётное время:' },
  majorSectors: { en: 'Major Sectors Overview', hi: 'प्रमुख क्षेत्र अवलोकन', sa: 'प्रमुखक्षेत्रसमीक्षा', bn: 'প্রধান সেক্টর সারসংক্ষেপ', te: 'ప్రధాన రంగాల అవలోకనం', ta: 'முக்கிய பகுதிகள் கண்ணோட்டம்', mr: 'प्रमुख क्षेत्र विहंगावलोकन', gu: 'મુખ્ય ક્ષેત્ર સિંહાવલોકન', kn: 'ಪ್ರಮುಖ ವಲಯ ಅವಲೋಕನ', ml: 'പ്രധാന മേഖലകളുടെ അവലോകനം', pa: 'ਮੁੱਖ ਸੈਕਟਰ ਸੰਖੇਪ', ur: 'بڑے شعبوں کا جائزہ', ne: 'प्रमुख क्षेत्र अवलोकन', zh: '主要区域概览', ja: '主要エリア概要', ar: 'نظرة عامة على القطاعات الرئيسية', es: 'Resumen de Sectores Principales', fr: 'Vue d\'ensemble des Secteurs', de: 'Überblick Hauptsektoren', ru: 'Обзор основных секторов' },
  safetyScore: { en: 'Safety Score', hi: 'सुरक्षा अंक', sa: 'सुरक्षाक्रमः', bn: 'নিরাপত্তা স্কোর', te: 'భద్రతా స్కోరు', ta: 'பாதுகாப்பு மதிப்பெண்', mr: 'सुरक्षा गुण', gu: 'સલામતી સ્કોર', kn: 'ಸುರಕ್ಷತಾ ಅಂಕ', ml: 'സുരക്ഷാ സ്കോർ', pa: 'ਸੁਰੱਖਿਆ ਸਕੋਰ', ur: 'حفاظتی اسکور', ne: 'सुरक्षा अंक', zh: '安全评分', ja: '安全スコア', ar: 'درجة الأمان', es: 'Puntuación Seguridad', fr: 'Score Sécurité', de: 'Sicherheitswert', ru: 'Оценка безопасности' },
  noNodes: { en: 'No sectors online.', hi: 'कोई क्षेत्र ऑनलाइन नहीं।', sa: 'न किमपि क्षेत्रम् ऑनलाइन।', bn: 'কোনো সেক্টর অনলাইনে নেই।', te: 'ఏ రంగమూ ఆన్‌లైన్లో లేదు.', ta: 'எந்த பகுதியும் ஆன்லைனில் இல்லை.', mr: 'कोणताही विभाग ऑनलाइन नाही.', gu: 'કોઈ વિભાગ ઓનલાઇન નથી.', kn: 'ಯಾವ ವಲಯವೂ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಇಲ್ಲ.', ml: 'ഒരു മേഖലയും ഓൺലൈനിൽ ഇല്ല.', pa: 'ਕੋਈ ਸੈਕਟਰ ਆਨਲਾਈਨ ਨਹੀਂ।', ur: 'کوئی شعبہ آن لائن نہیں۔', ne: 'कोई क्षेत्र अनलाइन छैन।', zh: '没有在线区域。', ja: 'オンラインのエリアなし。', ar: 'لا توجد قطاعات متصلة.', es: 'Sin sectores en línea.', fr: 'Aucun secteur en ligne.', de: 'Keine Sektoren online.', ru: 'Нет онлайн-секторов.' },
  allClear: { en: 'All sectors clear.', hi: 'सभी क्षेत्र सुरक्षित।', sa: 'सर्वे क्षेत्राः सुरक्षिताः।', bn: 'সমস্ত সেক্টর পরিষ্কার।', te: 'అన్ని రంగాలు స్పష్టంగా ఉన్నాయి.', ta: 'அனைத்து பகுதிகளும் தெளிவாக உள்ளன.', mr: 'सर्व विभाग स्पष्ट आहेत.', gu: 'તમામ ક્ષેત્ર સ્પષ્ટ.', kn: 'ಎಲ್ಲ ವಲಯಗಳು ಸ್ಪಷ್ಟ.', ml: 'എല്ലാ മേഖലകളും ക്ലിയർ.', pa: 'ਸਾਰੇ ਸੈਕਟਰ ਸਾਫ਼ ਹਨ।', ur: 'تمام شعبے واضح ہیں۔', ne: 'सबै क्षेत्र स्पष्ट।', zh: '所有区域正常。', ja: '全エリア異常なし。', ar: 'جميع القطاعات واضحة.', es: 'Todos los sectores despejados.', fr: 'Tous les secteurs dégagés.', de: 'Alle Sektoren frei.', ru: 'Все секторы в порядке.' },
  chooseLang: { en: 'Choose Language', hi: 'भाषा चुनें', sa: 'भाषां चिनुत', bn: 'ভাষা বেছে নিন', te: 'భాషను ఎంచుకోండి', ta: 'மொழியை தேர்ந்தெடுக்கவும்', mr: 'भाषा निवडा', gu: 'ભાષા પસંદ કરો', kn: 'ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ', ml: 'ഭാഷ തിരഞ്ഞെടുക്കുക', pa: 'ਭਾਸ਼ਾ ਚੁਣੋ', ur: 'زبان چنیں', ne: 'भाषा छान्नुहोस्', zh: '选择语言', ja: '言語を選択', ar: 'اختر اللغة', es: 'Elegir Idioma', fr: 'Choisir la Langue', de: 'Sprache wählen', ru: 'Выбрать язык' },
  selectLang: { en: 'Select Language', hi: 'भाषा चुनें', sa: 'भाषां चिनुत', bn: 'ভাষা নির্বাচন করুন', te: 'భాష ఎంచుకోండి', ta: 'மொழி தேர்வு', mr: 'भाषा निवडा', gu: 'ભાષા નક્કી કરો', kn: 'ಭಾಷೆ ಆಯ್ಕೆ', ml: 'ഭാഷ തിരഞ്ഞെടുക്കൂ', pa: 'ਭਾਸ਼ਾ ਚੁਣੋ', ur: 'زبان منتخب کریں', ne: 'भाषा चयन गर्नुहोस्', zh: '选择语言', ja: '言語選択', ar: 'اختيار اللغة', es: 'Seleccionar idioma', fr: 'Sélectionner la langue', de: 'Sprache auswählen', ru: 'Выбор языка' },
  visitorInflux: { en: 'Visitor Influx (Millions)', hi: 'श्रद्धालु आगमन (लाखों में)', sa: 'तीर्थयात्रिणः (लक्षेषु)', bn: 'দর্শনার্থী আগমন (মিলিয়নে)', te: 'సందర్శకుల రాక (మిలియన్లలో)', ta: 'பயணிகள் வருகை (மில்லியனில்)', mr: 'भाविक आगमन (दशलक्षांत)', gu: 'ભક્ત આगमन (મિલિયનમાં)', kn: 'ಯಾತ್ರಾರ್ಥಿ ಆಗಮನ (ದಶಲಕ್ಷ)', ml: 'സന്ദർശകർ (ദശലക്ഷ)', pa: 'ਸ਼ਰਧਾਲੂ ਆਗਮਨ (ਲੱਖਾਂ ਵਿੱਚ)', ur: 'زائرین آمد (ملین)', ne: 'तीर्थयात्री आगमन (लाखमा)', zh: '游客人数（百万）', ja: '訪問者数（百万人）', ar: 'تدفق الزوار (بالملايين)', es: 'Afluencia de Visitantes (Millones)', fr: 'Afflux de Visiteurs (Millions)', de: 'Besucherzustrom (Millionen)', ru: 'Поток посетителей (млн)' },
  pax: { en: 'pax', hi: 'यात्री', sa: 'यात्रिणः', bn: 'যাত্রী', te: 'యాత్రికులు', ta: 'பயணர்கள்', mr: 'प्रवासी', gu: 'પ્રવાસીઓ', kn: 'ಯಾತ್ರಿಕರು', ml: 'യാത്രക്കാർ', pa: 'ਯਾਤਰੀ', ur: 'مسافر', ne: 'यात्री', zh: '人次', ja: '人', ar: 'حاج', es: 'pereg.', fr: 'pèl.', de: 'Pilger', ru: 'чел.' },
};

function t(key: string, lang: LangCode): string {
  return T[key]?.[lang] ?? T[key]?.['en'] ?? key;
}

// ═══════════════════════════════════════════════
//  INTERFACES
// ═══════════════════════════════════════════════
interface SidebarProps {
  state: any;
  onRouteCalculated: (path: string[]) => void;
  routeDetails?: any;
}

// ═══════════════════════════════════════════════
//  LANGUAGE SELECTOR COMPONENT
// ═══════════════════════════════════════════════
function LanguageSelector({ lang, setLang }: { lang: LangCode; setLang: (l: LangCode) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="lang-dropdown-wrapper" style={{ display: 'inline-block' }}>
      <button
        className="lang-badge"
        onClick={() => setOpen(o => !o)}
        title={t('chooseLang', lang)}
        style={{ border: 'none', fontFamily: 'var(--font-ui)', cursor: 'pointer' }}
      >
        <Globe size={12} />
        <span>{currentLang.flag} {currentLang.native}</span>
        <ChevronDown size={10} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div className="lang-dropdown" style={{ maxHeight: '320px', overflowY: 'auto' }}>
          <div style={{ padding: '10px 14px 6px', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', borderBottom: '1px solid var(--glass-border)' }}>
            ☸ {t('selectLang', lang)}
          </div>
          {LANGUAGES.map(l => (
            <div
              key={l.code}
              className={`lang-option ${l.code === lang ? 'selected' : ''}`}
              onClick={() => { setLang(l.code); setOpen(false); }}
            >
              <span className="flag">{l.flag}</span>
              <span className="lang-name">{l.name}</span>
              <span className="lang-native">{l.native}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
//  MAIN SIDEBAR COMPONENT
// ═══════════════════════════════════════════════
export default function Sidebar({ state, onRouteCalculated, routeDetails }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'main' | 'insights'>('main');
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lang, setLang] = useState<LangCode>('en');

  const nodes = state?.nodes || [];
  const alerts = state?.alerts || [];
  const totalCrowd = nodes.reduce((acc: number, n: any) => acc + n.current_crowd_count, 0) || 0;
  const bottlenecks = alerts.length || 0;
  const leaderboard = [...nodes].sort((a, b) => b.max_capacity - a.max_capacity).slice(0, 5);

  // Critical alert toast
  useEffect(() => {
    if (alerts?.length > 0) {
      const critical = alerts.find((a: any) => a.message.includes('CRITICAL'));
      if (critical) {
        setToastMessage(critical.message);
        const timer = setTimeout(() => setToastMessage(null), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [alerts]);

  // Fetch insights
  useEffect(() => {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://simhastha-backend.onrender.com/api';
    if (apiUrl.endsWith('/')) apiUrl = apiUrl.slice(0, -1);
    if (!apiUrl.endsWith('/api')) apiUrl = `${apiUrl}/api`;
    fetch(`${apiUrl}/insights`)
      .then(res => res.json())
      .then(data => {
        const chartData = data.historical_data.map((d: any) => ({
          name: d.Year.toString(),
          visitors: d.Total_Visitors / 1000000
        }));
        chartData.push({ name: '2028 (AI)', visitors: data.prediction_2028 / 1000000 });
        setInsights({ chartData, historical_risks: data.historical_risks || [] });
      })
      .catch(console.error);
  }, []);

  const calculateRoute = async () => {
    if (!sourceId || !targetId) return;
    setLoadingRoute(true);
    try {
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://simhastha-backend.onrender.com/api';
      if (apiUrl.endsWith('/')) apiUrl = apiUrl.slice(0, -1);
      if (!apiUrl.endsWith('/api')) apiUrl = `${apiUrl}/api`;
      const res = await fetch(`${apiUrl}/route?source_id=${sourceId}&target_id=${targetId}`);
      const data = await res.json();
      if (data.path) onRouteCalculated(data.path);
    } catch (e) { console.error(e); }
    setLoadingRoute(false);
  };

  // Safety score color helper
  function safetyColor(score: number) {
    if (score >= 70) return 'var(--safe)';
    if (score >= 40) return 'var(--warn)';
    return 'var(--critical)';
  }
  function safetyClass(score: number) {
    if (score >= 70) return 'safe';
    if (score >= 40) return 'warn';
    return 'critical';
  }

  // Crowd density pct
  function crowdPct(n: any) {
    return n.max_capacity ? Math.min(100, Math.round((n.current_crowd_count / n.max_capacity) * 100)) : 0;
  }
  function crowdBarColor(pct: number) {
    if (pct < 60) return 'linear-gradient(90deg, var(--safe), #27ae60)';
    if (pct < 85) return 'linear-gradient(90deg, var(--warn), #e67e22)';
    return 'linear-gradient(90deg, var(--critical), #c0392b)';
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-panel)', fontFamily: 'var(--font-ui)' }}>

      {/* ── Top sacred gradient accent ── */}
      <div className="sidebar-top-accent" />

      {/* ── Header ── */}
      <div style={{ padding: '16px 18px 8px', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <span style={{ fontSize: '22px', lineHeight: 1, color: 'var(--gold)', textShadow: '0 0 10px rgba(255,184,48,0.5)', fontFamily: 'serif' }}>ॐ</span>
              <h1 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sacred)', letterSpacing: '0.3px' }}>
                {t('appTitle', lang)}
              </h1>
            </div>
            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1.2px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              {t('appSubtitle', lang)}
            </p>
          </div>
          <LanguageSelector lang={lang} setLang={setLang} />
        </div>
      </div>

      {/* ── Critical Toast ── */}
      {toastMessage && (
        <div className="toast-critical" style={{ margin: '12px 16px 0' }}>
          <AlertCircle size={22} style={{ flexShrink: 0, color: '#FF6B6B' }} />
          <div style={{ fontWeight: 700, fontSize: '12px', lineHeight: 1.5, color: '#FFE0E0' }}>{toastMessage}</div>
          <button onClick={() => setToastMessage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF6B6B', marginLeft: 'auto', padding: '2px', display: 'flex' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'main' ? 'active' : ''}`}
          onClick={() => setActiveTab('main')}
        >
          <Flame size={14} />
          {t('liveOps', lang)}
        </button>
        <button
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <BarChart3 size={14} />
          {t('insights', lang)}
        </button>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="sidebar-scroll">

        {/* ══════════ LIVE OPERATIONS TAB ══════════ */}
        {activeTab === 'main' && (
          <>
            {/* ── Metric Cards Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Total Crowd */}
              <div className="glass-panel" style={{ padding: '14px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Users size={13} color="var(--saffron)" />
                  <p style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                    {t('totalCrowd', lang)}
                  </p>
                </div>
                <div className="metric-value" style={{ fontSize: '22px' }}>{totalCrowd.toLocaleString()}</div>
              </div>

              {/* Active Bottlenecks */}
              <div className="glass-panel" style={{ padding: '14px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Zap size={13} color={bottlenecks > 0 ? 'var(--critical)' : 'var(--safe)'} />
                  <p style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                    {t('bottlenecks', lang)}
                  </p>
                </div>
                <div className={`metric-value ${bottlenecks > 0 ? 'critical' : ''}`} style={{ fontSize: '22px' }}>
                  {bottlenecks}
                </div>
              </div>
            </div>

            {/* ── Diversion Routing Form ── */}
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div className="section-header">
                <span className="icon-wrap"><Route size={16} /></span>
                {t('diversionRouting', lang)}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Source Node */}
                <div>
                  <label style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    ◎ {t('selectSource', lang).replace('...', '')}
                  </label>
                  <select
                    className="input-select"
                    value={sourceId}
                    onChange={e => setSourceId(e.target.value)}
                    id="source-node-select"
                  >
                    <option value="">{t('selectSource', lang)}</option>
                    {nodes.map((n: any) => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>

                {/* Arrow connector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--glass-border))' }} />
                  <Navigation size={12} color="var(--saffron)" />
                  <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--glass-border), transparent)' }} />
                </div>

                {/* Target Node */}
                <div>
                  <label style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    ◎ {t('selectTarget', lang).replace('...', '')}
                  </label>
                  <select
                    className="input-select"
                    value={targetId}
                    onChange={e => setTargetId(e.target.value)}
                    id="target-node-select"
                  >
                    <option value="">{t('selectTarget', lang)}</option>
                    {nodes.map((n: any) => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>

                {/* Calculate Button */}
                <button
                  className="btn-primary"
                  onClick={calculateRoute}
                  disabled={loadingRoute || !sourceId || !targetId}
                  id="calculate-route-btn"
                >
                  {loadingRoute
                    ? t('calculating', lang)
                    : <><span style={{ marginRight: '6px' }}>⬡</span>{t('calcRoute', lang)}</>
                  }
                </button>

                {/* Route Result */}
                {routeDetails && (
                  <div className="route-result">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{t('safeDistance', lang)}</span>
                      <strong style={{ color: 'var(--gold)' }}>{routeDetails.distance}</strong>
                    </div>
                    <div className="sacred-divider" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{t('estTime', lang)}</span>
                      <strong style={{ color: 'var(--gold)' }}>{routeDetails.duration}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Major Sectors Overview ── */}
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div className="section-header">
                <span className="icon-wrap"><ShieldAlert size={16} /></span>
                {t('majorSectors', lang)}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {leaderboard.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{t('noNodes', lang)}</p>
                ) : leaderboard.map((n: any, i: number) => {
                  const score = Math.round(n.safety_score || 100);
                  const pct = crowdPct(n);
                  const sClass = safetyClass(score);
                  const sColor = safetyColor(score);

                  return (
                    <div key={n.id} className="sector-card">
                      {/* Row 1: Name + Score */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className={`status-dot ${sClass}`} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                              {i + 1}. {n.name}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <CloudRain size={9} />
                              {n.weather_condition || 'Clear'} &nbsp;·&nbsp; {n.current_crowd_count.toLocaleString()} {t('pax', lang)}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: sColor, fontWeight: 700, fontSize: '16px', fontFamily: 'var(--font-mono)' }}>{score}%</div>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>{t('safetyScore', lang)}</div>
                        </div>
                      </div>

                      {/* Row 2: Crowd density bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar-track" style={{ flex: 1 }}>
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${pct}%`, background: crowdBarColor(pct) }}
                          />
                        </div>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', minWidth: '32px', textAlign: 'right' }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ══════════ HISTORICAL INSIGHTS TAB ══════════ */}
        {activeTab === 'insights' && (
          <>
            {/* Chart */}
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div className="section-header">
                <span className="icon-wrap"><TrendingUp size={16} /></span>
                AI Historical Insights
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {t('visitorInflux', lang)}
              </p>
              <div style={{ height: '220px', width: '100%' }}>
                {insights ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={insights.chartData}>
                      <defs>
                        <linearGradient id="sacredGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,107,0,0.08)" />
                      <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                      <YAxis stroke="var(--text-muted)" fontSize={11} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--glass-border)', borderRadius: '8px', fontSize: '12px' }}
                        labelStyle={{ color: 'var(--gold)' }}
                        itemStyle={{ color: 'var(--saffron)' }}
                      />
                      <Area type="monotone" dataKey="visitors" stroke="#FF6B00" strokeWidth={2.5} fill="url(#sacredGrad)" dot={{ fill: '#FF6B00', r: 3 }} activeDot={{ r: 6, fill: '#FFB830' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Loading AI Projection...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Educational Safety Insights */}
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div className="section-header">
                <span className="icon-wrap"><Info size={16} /></span>
                Pilgrim Safety & Educational Insights
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Learn from past historical events to plan your visit safely.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {insights?.historical_risks ? insights.historical_risks.map((risk: any, i: number) => (
                  <div key={i} style={{
                    padding: '14px',
                    background: 'rgba(255, 120, 0, 0.06)',
                    border: '1px solid rgba(255, 120, 0, 0.18)',
                    borderLeft: '3px solid var(--saffron)',
                    borderRadius: '8px',
                    animation: `fadeInUp ${0.2 + i * 0.08}s ease`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-start', gap: '8px' }}>
                      <strong style={{ color: 'var(--gold)', fontSize: '13px', lineHeight: 1.3 }}>{risk.event}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>{risk.date}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', gap: '12px' }}>
                      <span>🌤 <strong>Weather:</strong> {risk.weather}</span>
                      <span>🛡 <strong>Safety:</strong> {risk.safety_index}%</span>
                    </div>
                    <p style={{ fontSize: '12px', lineHeight: 1.55, margin: 0, color: 'var(--text-primary)' }}>
                      {risk.advice}
                    </p>
                  </div>
                )) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Loading educational insights...</p>
                )}
              </div>
            </div>

            {/* System Alerts Log */}
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div className="section-header">
                <span className="icon-wrap"><AlertCircle size={16} /></span>
                System Alerts Log
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {alerts.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--safe)', fontSize: '13px' }}>
                    <CheckCircle2 size={16} />
                    {t('allClear', lang)}
                  </div>
                ) : (
                  alerts.map((a: any) => (
                    <div key={a.id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 12px',
                      background: 'rgba(231,76,60,0.08)',
                      border: '1px solid rgba(231,76,60,0.22)',
                      borderLeft: '3px solid var(--critical)',
                      borderRadius: '8px',
                      color: '#FF6B6B'
                    }}>
                      <AlertCircle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', lineHeight: 1.45, color: 'var(--text-primary)' }}>{a.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
