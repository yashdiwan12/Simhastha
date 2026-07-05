import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import {
  AlertCircle, Navigation, ShieldAlert, CheckCircle2, TrendingUp,
  CloudRain, Globe, ChevronDown, X, Flame, Users, Zap, Route,
  Bell, MapPin, Info, BarChart3, Activity, Shield, Mic, Send, Bot, Sparkles
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';

const MapWithNoSSR = dynamic(() => import('../components/Map'), { ssr: false });

// ─── TRANSLATIONS ───────────────────────────────────────
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
type LC = string;

const TX: Record<string, Record<string, string>> = {
  navWelcome: { en: 'Welcome', hi: 'स्वागत', sa: 'स्वागतम्', bn: 'স্বাগতম', te: 'స్వాగతం', ta: 'வரவேற்பு', mr: 'स्वागत', gu: 'સ્વાગત', kn: 'ಸ್ವಾಗತ', ml: 'സ്വാഗതം', pa: 'ਸੁਆਗਤ', ur: 'خوش آمدید', ne: 'स्वागत', zh: '欢迎', ja: 'ようこそ', ar: 'مرحبا', es: 'Bienvenido', fr: 'Bienvenue', de: 'Willkommen', ru: 'Добро пожаловать' },
  navOps: { en: 'Live Ops', hi: 'लाइव', sa: 'सजीव', bn: 'লাইভ', te: 'లైవ్', ta: 'நேரடி', mr: 'लाइव्ह', gu: 'લાઇવ', kn: 'ಲೈವ್', ml: 'ലൈവ്', pa: 'ਲਾਈਵ', ur: 'لائیو', ne: 'लाइभ', zh: '实时', ja: 'ライブ', ar: 'مباشر', es: 'En Vivo', fr: 'Direct', de: 'Live', ru: 'Прямой' },
  navSectors: { en: 'Sectors', hi: 'क्षेत्र', sa: 'क्षेत्राणि', bn: 'সেক্টর', te: 'రంగాలు', ta: 'பகுதிகள்', mr: 'क्षेत्रे', gu: 'ક્ષેત્ર', kn: 'ವಲಯ', ml: 'മേഖലകൾ', pa: 'ਸੈਕਟਰ', ur: 'شعبے', ne: 'क्षेत्र', zh: '区域', ja: 'エリア', ar: 'القطاعات', es: 'Sectores', fr: 'Secteurs', de: 'Sektoren', ru: 'Секторы' },
  navRouting: { en: 'Routing', hi: 'मार्गदर्शन', sa: 'मार्गनिर्देशनम्', bn: 'রুটিং', te: 'మార్గం', ta: 'வழிகாட்டல்', mr: 'मार्गदर्शन', gu: 'રૂટિંગ', kn: 'ಮಾರ್ಗ', ml: 'റൂട്ടിങ്', pa: 'ਰੂਟਿੰਗ', ur: 'راستہ', ne: 'मार्ग', zh: '路线', ja: 'ルート', ar: 'التوجيه', es: 'Rutas', fr: 'Itinéraire', de: 'Routing', ru: 'Маршрут' },
  heroTitle1: { en: 'Simhastha', hi: 'सिंहस्थ', sa: 'सिंहस्थ', bn: 'সিংহস্থ', te: 'సింహస్థ', ta: 'சிம்ஹஸ்தா', mr: 'सिंहस्थ', gu: 'સિંહસ્થ', kn: 'ಸಿಂಹಸ್ಥ', ml: 'സിംഹസ്ഥ', pa: 'ਸਿੰਘਸਥ', ur: 'سمہاستھا', ne: 'सिंहस्थ', zh: 'Simhastha', ja: 'シンハスタ', ar: 'سيمهاستا', es: 'Simhastha', fr: 'Simhastha', de: 'Simhastha', ru: 'Симхастха' },
  heroTitle2: { en: 'Command Centre', hi: 'AI नियंत्रण केन्द्र', sa: 'AI नियंत्रणकेन्द्रम्', bn: 'AI নিয়ন্ত্রণ কেন্দ্র', te: 'AI కమాండ్ సెంటర్', ta: 'AI கட்டளை மையம்', mr: 'AI नियंत्रण केंद्र', gu: 'AI કમાન્ડ સેન્ટર', kn: 'AI ಕమాಂಡ್ ಸೆಂಟರ್', ml: 'AI കമാൻഡ് സെന്റർ', pa: 'AI ਕਮਾਂਡ ਸੈਂਟਰ', ur: 'AI کمانڈ سینٹر', ne: 'AI कमाण्ड केन्द्र', zh: 'AI指挥中心', ja: 'AI指揮センター', ar: 'مركز القيادة الذكي', es: 'Centro de Comando IA', fr: 'Centre de Commande IA', de: 'KI-Kommandozentrale', ru: 'ИИ-центр управления' },
  heroDesc: { en: 'Real-time crowd management, pilgrim safety monitoring, and intelligent route planning for the world\'s largest spiritual gathering.', hi: 'विश्व के सबसे बड़े आध्यात्मिक मेले के लिए वास्तविक समय में AI-संचालित भीड़ प्रबंधन और यात्री सुरक्षा।', sa: 'विश्वस्य विशालतमे आध्यात्मिकसमागमे AI-चालितं जनसमूहनियंत्रणम्।', bn: 'বিশ্বের বৃহত্তম আধ্যাত্মিক সমাবেশে রিয়েল-ಟೈম AI ভিড় ব্যবস্থাপনা।', te: 'ప్రపంచంలోనే అతిపెద్ద ఆధ్యాత్మిక సమావేశంలో రియల్-టైమ్ AI జనసమూహ నిర్వహణ.', ta: 'உலகின் மிகப்பெரிய ஆன்மீக கூட்டத்தில் நிகழ்நேர AI கூட்ட மேலாண்மை.', mr: 'जगातील सर्वात मोठ्या आध्यात्मिक संमेलनासाठी रिअल-टाइम AI गर्दी व्यवस्थापन.', gu: 'વિશ્વના સૌથી મોટા આધ્યાત્મિક સમારોહ માટે રીઅલ-ટાઇમ AI ભીડ વ્યવસ્થાપન.', kn: 'ವಿಶ್ವದ ಅತಿದೊಡ್ಡ ಆಧ್ಯಾತ್ಮಿಕ ಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ರಿಯಲ್-ಟೈಮ್ AI ಜನನಿಯಂತ್ರಣ.', ml: 'ലോകത്തിലെ ഏറ്റവും വലിയ ആദ്ധ്യാത്മിക സമ്മേളനത്തിൽ AI ജനക്കൂട്ട് നിയന്ത്രണം.', pa: 'ਦੁਨੀਆ ਦੇ ਸਭ ਤੋਂ ਵੱਡੇ ਆਧਿਆਤਮਿਕ ਮੇਲੇ ਲਈ ਅਸਲ-ਸਮੇਂ AI ਭੀੜ ਪ੍ਰਬੰਧਨ.', ur: 'دنیا کے سب سے بڑے روحانی اجتماع میں ریئل ٹائم AI ہجوم انتظام.', ne: 'विश्वको सबैभन्दा ठूलो आध्यात्मिक समागमको लागि रिअल-टाइम AI भिड व्यवस्थापन.', zh: '为世界上最大的精神聚会提供实时AI人群管理。', ja: '世界最大の宗教的祭典のためのリアルタイムAI群衆管理。', ar: 'إدارة الحشود في الوقت الفعلي بالذكاء الاصطناعي لأكبر تجمع روحي في العالم.', es: 'Gestión de multitudes con IA en tiempo real para el mayor evento espiritual del mundo.', fr: 'Gestion des foules par IA en temps réel pour le plus grand rassemblement spirituel.', de: 'KI-basiertes Echtzeit-Crowd-Management für die größte spirituelle Veranstaltung.', ru: 'Управление толпой с ИИ в реальном времени для крупнейшего духовного собрания.' },
  liveOpsTitle: { en: 'Live Operations Centre', hi: 'लाइव संचालन केन्द्र', sa: 'सजीवसंचालनकेन्द्रम्', bn: 'লাইভ অপারেশন সেন্টার', te: 'లైవ్ ఆపరేషన్స్ సెంటర్', ta: 'நேரடி செயல்பாட்டு மையம்', mr: 'लाइव्ह ऑपरेशन्स सेंटर', gu: 'લાઇવ ઓપરેશन्स સેન્ટર', kn: 'ಲೈವ್ ಕಾರ್ಯಾಚರಣಾ ಕೇಂದ್ರ', ml: 'ലൈവ് ഓപ്പറേഷൻ സെന്റർ', pa: 'ਲਾਈਵ ਓਪਰੇਸ਼ਨ ਸੈਂਟਰ', ur: 'لائیو آپریشن سینٹر', ne: 'लाइभ सञ्चालन केन्द्र', zh: '实时操作中心', ja: 'ライブ運用センター', ar: 'مركز العمليات المباشرة', es: 'Centro de Operaciones en Vivo', fr: 'Centre d\'Opérations en Direct', de: 'Live-Betriebszentrum', ru: 'Центр прямых операций' },
  totalPilgrims: { en: 'TOTAL PILGRIMS', hi: 'कुल यात्री', sa: 'समग्रयात्रिणः', bn: 'মোট তীর্থযাত্রী', te: 'మొత్తం యాత్రికులు', ta: 'மொத்த யாத்ரீகர்கள்', mr: 'एकूण यात्रेकरू', gu: 'કુલ ભક્ત', kn: 'ಒಟ್ಟು ಯಾತ್ರಾರ್ಥಿ', ml: 'ആകെ തീർഥാടകർ', pa: 'ਕੁੱਲ ਯਾਤਰੀ', ur: 'کل حاجی', ne: 'कुल यात्री', zh: '总朝圣者', ja: '巡礼者総数', ar: 'إجمالي الحجاج', es: 'Total Peregrinos', fr: 'Total Pèlerins', de: 'Pilger gesamt', ru: 'Всего паломников' },
  activeAlerts: { en: 'ACTIVE ALERTS', hi: 'सक्रिय अलर्ट', sa: 'सक्रियसूचनाः', bn: 'সক্রিয় সতর্কতা', te: 'సక్రియ హెచ్చరికలు', ta: 'செயலில் எச்சரிக்கை', mr: 'सक्रिय इशारे', gu: 'સક્રિય ચેતવણી', kn: 'ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆ', ml: 'സജീവ അലേർട്ട്', pa: 'ਸਰਗਰਮ ਚੇਤਾਵਨੀ', ur: 'فعال انتباہ', ne: 'सक्रिय सतर्कता', zh: '活跃警报', ja: 'アクティブ警告', ar: 'التنبيهات النشطة', es: 'Alertas Activas', fr: 'Alertes Actives', de: 'Aktive Warnungen', ru: 'Активные предупреждения' },
  safetyIndex: { en: 'AVG SAFETY INDEX', hi: 'औसत सुरक्षा सूचकांक', sa: 'औसतसुरक्षाक्रमः', bn: 'গড় নিরাপত্তা সূচক', te: 'సగటు భద్రతా సూచిక', ta: 'சராசரி பாதுகாப்பு குறியீடு', mr: 'सरासरी सुरक्षा निर्देशांक', gu: 'સરેરાશ સુરક્ષા સૂચકાંક', kn: 'ಸರಾಸರಿ ಸುರಕ್ಷತಾ ಸೂಚ್ಯಂಕ', ml: 'ശരാശരി സുരക്ഷ സൂചകം', pa: 'ਔਸਤ ਸੁਰੱਖਿਆ ਸੂਚकाંક', ur: 'اوسط حفاظتی اشاریہ', ne: 'औसत सुरक्षा सूचकाङ्क', zh: '平均安全指数', ja: '平均安全指数', ar: 'متوسط مؤشر الأمان', es: 'Índice Seguridad Promedio', fr: 'Indice Sécurité Moyen', de: 'Durchschn. Sicherheitsindex', ru: 'Ср. индекс безопасности' },
  secTitle: { en: 'Major Sector Overview', hi: 'प्रमुख क्षेत्र अवलोकन', sa: 'प्रमुखक्षेत्रसमीक्षा', bn: 'প্রধান সেক্টর সারসংক্ষেপ', te: 'ప్రధాన రంగాల అవలోకనం', ta: 'முக்கிய பகுதி கண்ணோட்டம்', mr: 'प्रमुख क्षेत्र विहंगावलोकन', gu: 'મુખ્ય ક્ષેત્ર સિંહાવલોકન', kn: 'ಪ್ರಮುಖ ವಲಯ ಅವಲೋಕನ', ml: 'പ്രധാന മേഖലകളുടെ അവലോകനം', pa: 'ਮੁੱਖ ਸੈਕਟਰ ਸੰਖੇਪ', ur: 'بڑے شعبوں का جائزہ', ne: 'प्रमुख क्षेत्र अवलोकन', zh: '主要区域概览', ja: '主要エリア概要', ar: 'نظرة عامة القطاعات', es: 'Resumen Sectores', fr: 'Vue Secteurs', de: 'Sektoren Überblick', ru: 'Обзор секторов' },
  safetyScore: { en: 'Safety Score', hi: 'सुरक्षा अंक', sa: 'सुरक्षाक्रमः', bn: 'নিরাপত্তা স্কোর', te: 'భద్రతా స్కోరు', ta: 'பாதுகாப்பு மதிப்பு', mr: 'सुरक्षा गुण', gu: 'સુરક્ષા સ્કોર', kn: 'ಸುರಕ್ಷತಾ ಅಂಕ', ml: 'സുരക്ഷ സ്കോർ', pa: 'ਸੁਰੱਖਿਆ ਸਕੋਰ', ur: 'حفاظت اسکور', ne: 'सुरक्षा अंक', zh: '安全评分', ja: '安全スコア', ar: 'درجة الأمان', es: 'Puntuación Seguridad', fr: 'Score Sécurité', de: 'Sicherheitswert', ru: 'Индекс безопасности' },
  routeTitle: { en: 'Diversion Routing', hi: 'मार्ग परिवर्तन', sa: 'मार्गपरिवर्तनम्', bn: 'মার্গ পরিবর্তন', te: 'మళ్ళింపు మార్గం', ta: 'திசைதிருப்பல்', mr: 'मार्ग वळवणी', gu: 'ડાઇવર્ઝન', kn: 'ಮಾರ್ಗ ಬದಲಾವಣೆ', ml: 'ഡൈവേർഷൻ', pa: 'ਡਾਇਵਰਜ਼ਨ', ur: 'راستہ بدلنا', ne: 'मार्ग परिवर्तन', zh: '线路改道', ja: '迂回ルーティング', ar: 'تحويل المسار', es: 'Desvío de Ruta', fr: 'Détour', de: 'Umleitung', ru: 'Перенаправление' },
  sourceNode: { en: 'Select Source Node', hi: 'स्रोत नोड चुनें', sa: 'स्रोतबिन्दुं चिनुत', bn: 'উৎস নোড নির্বাচন', te: 'మూల స్థానం ఎంచుకోండి', ta: 'மூல முனை தேர்வு', mr: 'स्रोत नोड निवडा', gu: 'સ્ત્રોત નોડ', kn: 'ಮೂಲ ನೋಡ್', ml: 'ഉറവിട നോഡ്', pa: 'ਸਰੋਤ ਨੋਡ', ur: 'ماخذ نوڈ', ne: 'स्रोत नोड', zh: '选择出发地', ja: '出発地を選択', ar: 'اختر نقطة البداية', es: 'Nodo Origen', fr: 'Nœud Source', de: 'Quellknoten', ru: 'Исходный узел' },
  targetNode: { en: 'Select Target Node', hi: 'लक्ष्य नोड चुनें', sa: 'लक्ष्यबिन्दुं चिनुत', bn: 'লক্ষ্য নোড নির্বাচন', te: 'లక్ష్య స్థానం ఎంచుకోండి', ta: 'இலக்கு முனை தேர்வு', mr: 'लक्ष्य नोड निवडा', gu: 'લક્ષ્ય નોડ', kn: 'ಗುರಿ ನೋಡ್', ml: 'ലക്ഷ്യ নোഡ്', pa: 'ਟਾਰਗਿਟ ਨੋਡ', ur: 'ہدف نوڈ', ne: 'लक्ष्य नोड', zh: '选择目的地', ja: '目的地を選択', ar: 'اختر نقطة الهدف', es: 'Nodo Destino', fr: 'Nœud Cible', de: 'Zielknoten', ru: 'Целевой узел' },
  calcRoute: { en: '⬡ Calculate Safe Route', hi: '⬡ सुरक्षित मार्ग खोजें', sa: '⬡ सुरक्षितमार्गं गणयतु', bn: '⬡ নিরাপদ পথ', te: '⬡ సుരక్షిత మార్గం', ta: '⬡ பாதுகாப்பான வழி', mr: '⬡ सुरक्षित मार्ग', gu: '⬡ સુરక్షિત માર્ગ', kn: '⬡ ಸುರಕ್ಷಿತ ಮಾರ್ಗ', ml: '⬡ സുരക്ഷിത മാർഗ്ഗം', pa: '⬡ ਸੁਰੱਖਿਅਤ ਰਸਤਾ', ur: '⬡ محفوظ راستہ', ne: '⬡ सुरक्षित मार्ग', zh: '⬡ 计算安全路线', ja: '⬡ 安全ルートを計算', ar: '⬡ احسب المسار الآمن', es: '⬡ Calcular Ruta Segura', fr: '⬡ Itinéraire Sûr', de: '⬡ Sicheren Weg', ru: '⬡ Рассчитать маршрут' },
  calculating: { en: 'Calculating...', hi: 'गणना हो रही है...', sa: 'गण्यते...', bn: 'গণনা হচ্ছে...', te: 'లెక్కిస్తోంది...', ta: 'கணக்கிடுகிறது...', mr: 'गणना...', gu: 'ગણના...', kn: 'ಲೆಕ್ಕಿಸುತ್ತಿದೆ...', ml: 'കണക്കാക്കുന്നു...', pa: 'ਗਣਨਾ...', ur: 'حساب...', ne: 'गणना...', zh: '计算中...', ja: '計算中...', ar: 'جاري الحساب...', es: 'Calculando...', fr: 'Calcul...', de: 'Berechne...', ru: 'Вычисляю...' },
  dismissAlarm: { en: 'Dismiss', hi: 'बंद करें', sa: 'समापयतु', bn: 'বাতিল', te: 'విస్మరించు', ta: 'நிராகரி', mr: 'बंद करा', gu: 'બંધ', kn: 'ತಳ್ಳಿಹಾಕು', ml: 'തള്ളുക', pa: 'ਰੱਦ', ur: 'مسترد', ne: 'खारेज', zh: '忽略', ja: '閉じる', ar: 'تجاهل', es: 'Descartar', fr: 'Ignorer', de: 'Schließen', ru: 'Закрыть' },
  deployNDRF: { en: 'Deploy NDRF Team', hi: 'NDRF टीम भेजें', sa: 'NDRF दलं प्रेषयतु', bn: 'NDRF টিম পাঠান', te: 'NDRF బృందాన్ని మోహరించు', ta: 'NDRF குழு அனுப்பு', mr: 'NDRF टीम पाठवा', gu: 'NDRF ટીમ', kn: 'NDRF ತಂಡ', ml: 'NDRF ടീം', pa: 'NDRF ਟੀਮ', ur: 'NDRF ٹیم', ne: 'NDRF टोली', zh: '部署NDRF', ja: 'NDRF派遣', ar: 'نشر فريق NDRF', es: 'Desplegar NDRF', fr: 'Déployer NDRF', de: 'NDRF einsetzen', ru: 'Развернуть NDRF' },
  assistantTitle: { en: 'Simhastha AI Assistant', hi: 'Simhastha AI', sa: 'Simhastha AI', bn: 'Simhastha AI', te: 'Simhastha AI', ta: 'Simhastha AI', mr: 'Simhastha AI', gu: 'Simhastha AI', kn: 'Simhastha AI', ml: 'Simhastha AI', pa: 'Simhastha AI', ur: 'Simhastha AI', ne: 'Simhastha AI', zh: 'Simhastha AI', ja: 'Simhastha AI', ar: 'Simhastha AI', es: 'Simhastha AI', fr: 'Simhastha AI', de: 'Simhastha AI', ru: 'Simhastha AI' },
  assistantPlaceholder: { en: 'Ask about safety, navigation...', hi: 'सुरक्षा, दिशा आदि के बारे में पूछें...', sa: 'सुरक्षा, दिशा इत्यादेः विषये पृच्छतु...', bn: 'নিরাপত্তা, দিকনির্দেশনা সম্পর্কে জিজ্ঞাসা করুন...', te: 'భద్రతా, దిశల గురించి అడగండి...', ta: 'பாதுகாப்பு, திசைகள் பற்றி கேளுங்கள்...', mr: 'सुरक्षा, दिशा बद्दल विचारा...', gu: 'સુરક્ષા, દિશા વિશે પૂછો...', kn: 'ಸುರಕ್ಷತೆ, ದಿಕ್ಕುಗಳ ಬಗ್ಗೆ ಕೇಳಿ...', ml: 'സുരക്ഷ, ദിശ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...', pa: 'ਸੁਰੱਖਿਆ, ਦਿਸ਼ਾਵਾਂ ਬਾਰੇ ਪੁੱਛੋ...', ur: 'حفاظت، سمت کے بارے میں پوچھیں...', ne: 'सुरक्षा, दिशा बारे सोध्नुहोस्...', zh: '询问安全、导航...', ja: '安全、ナビゲーションについて尋ねる...', ar: 'اسأل عن الأمان، الملاحة...', es: 'Pregunta sobre seguridad, navegación...', fr: 'Demandez sur la sécurité, navigation...', de: 'Fragen Sie nach Sicherheit, Navigation...', ru: 'Спросите о безопасности, навигации...' },
  voiceListening: { en: 'Listening...', hi: 'सुन रहा हूँ...', sa: 'शृणोमि...', bn: 'শুনছি...', te: 'వింటున్నాను...', ta: 'கேட்கிறது...', mr: 'ऐकत आहे...', gu: 'સાંભળી રહ્યો છું...', kn: 'ಆಲಿಸುತ್ತಿದೆ...', ml: 'കേൾക്കുന്നു...', pa: 'ਸੁਣ ਰਿਹਾ ਹੈ...', ur: 'سن رہا ہوں...', ne: 'सुन्दैछु...', zh: '聆听中...', ja: '聞いています...', ar: 'يستمع...', es: 'Escuchando...', fr: 'Écoute...', de: 'Höre zu...', ru: 'Слушаю...' },
  allClear: { en: 'All sectors nominal.', hi: 'सभी क्षेत्र सुरक्षित।', sa: 'सर्वे क्षेत्राः सुरक्षिताः।', bn: 'সমস্ত সেক্টর স্বাভাবিক।', te: 'అన్ని రంగాలు సాధారణం.', ta: 'அனைத்து பகுதிகளும் சரி.', mr: 'सर्व विभाग ठीक आहेत.', gu: 'તમામ ક્ષેત્ર સ્બ ઠીક.', kn: 'ಎಲ್ಲ ವಲಯಗಳು ಸ್ಪಷ್ಟ.', ml: 'എല്ലാ മേഖലകളും ശരി.', pa: 'ਸਾਰੇ ਸੈਕਟਰ ਠੀਕ ਹਨ।', ur: 'تمام شعبے ٹھیک ہیں۔', ne: 'सबै क्षेत्र सामान्य।', zh: '所有区域正常。', ja: '全エリア正常。', ar: 'جميع القطاعات طبيعية.', es: 'Todos los sectores normales.', fr: 'Tous secteurs normaux.', de: 'Alle Sektoren normal.', ru: 'Все секторы в норме.' },
};

function tx(key: string, lang: LC): string {
  return TX[key]?.[lang] ?? TX[key]?.['en'] ?? key;
}

// ─── LANGUAGE SELECTOR ───────────────────────────────────
function LanguageSelector({ lang, setLang }: { lang: LC; setLang: (l: LC) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cur = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="lang-dropdown-wrapper">
      <button className={`lang-badge ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
        <Globe size={12} />
        {cur.flag} {cur.native}
        <ChevronDown size={10} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div className="lang-dropdown">
          <div className="lang-dropdown-header">☸ {tx('navRouting', lang) === 'Routing' ? 'Select Language' : 'Select Language'}</div>
          {LANGUAGES.map(l => (
            <div key={l.code} className={`lang-option ${l.code === lang ? 'selected' : ''}`} onClick={() => { setLang(l.code); setOpen(false); }}>
              <span style={{ fontSize: 16 }}>{l.flag}</span>
              <span style={{ fontWeight: 500 }}>{l.name}</span>
              <span className="lang-native">{l.native}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ALARM TOAST (bottom-right compact) ──────────────────
interface AlarmData {
  id: string; // Ensure we always have an ID for mapping
  type: 'CAPACITY' | 'SAFETY' | 'ROUTE' | 'WEATHER';
  title: string;
  message: string;
  location: string;
  timestamp: Date;
}

const ALARM_TYPE_LABELS: Record<string, string> = {
  CAPACITY: '🚨 CAPACITY BREACH',
  SAFETY: '⚠️ SAFETY CRITICAL',
  ROUTE: '🗺️ ROUTE FOUND',
  WEATHER: '🌩️ WEATHER ALERT',
};

// ─── HELPER: SAFETY COLOR ───────────────────────────────
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
function crowdPct(n: any) {
  return n.max_capacity ? Math.min(100, Math.round((n.current_crowd_count / n.max_capacity) * 100)) : 0;
}
function crowdBarGrad(pct: number) {
  if (pct < 60) return 'linear-gradient(90deg,#27AE60,#2ECC71)';
  if (pct < 85) return 'linear-gradient(90deg,#E67E22,#F39C12)';
  return 'linear-gradient(90deg,#E74C3C,#FF1744)';
}

// ─── MAIN PAGE ────────────────────────────────────────────
export default function SimhasthaPage() {
  const [lang, setLang] = useState<LC>('en');
  const [globalState, setGlobalState] = useState<any>({});
  const [activeRoute, setActiveRoute] = useState<string[]>([]);
  const [routeDetails, setRouteDetails] = useState<any>(null);
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [shownAlarmIds, setShownAlarmIds] = useState<Set<string>>(new Set());
  const [alarmQueue, setAlarmQueue] = useState<AlarmData[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);
  const mapRef = useRef<google.maps.Map | null>(null);

  const [passData, setPassData] = useState({
    name: '', contact: '', blood: 'Select...', camp: '', medical: ''
  });
  const [isPassGenerated, setIsPassGenerated] = useState(false);
  const passRef = useRef<HTMLDivElement>(null);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<{ sender: 'bot' | 'user', text: string }[]>([
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const generateLocalResponse = (msg: string) => {
    const l = msg.toLowerCase();
    if (l.includes('safe') || l.includes('crowd')) return 'Currently, the Simhastha sector density is being actively monitored. Average safety across the network is high. Please follow diversion routes if you see Red Alarms.';
    if (l.includes('medic') || l.includes('hospital') || l.includes('health') || l.includes('doctor')) return 'Medical camps are stationed every 2km. The nearest active medical camp is Sector 4 Triage. For immediate emergency, use the SOS beacon on your Smart Pilgrim ID.';
    if (l.includes('navigat') || l.includes('route') || l.includes('map') || l.includes('go')) return 'You can use the Route Planner tool below to find the safest path between sectors. Active routes are highlighted in green.';
    if (l.includes('lost') || l.includes('found') || l.includes('missing')) return 'If you have lost someone, please report to the nearest Khoya-Paya (Lost & Found) centre. They are integrated with our AI camera network to help locate missing pilgrims.';
    if (l.includes('accomodat') || l.includes('stay') || l.includes('tent')) return 'Tent cities are available in Sectors 1, 3, and 5. Premium bookings are managed via the main portal, and free dormitories are subject to live capacity.';
    if (l.includes('event') || l.includes('snan') || l.includes('bath')) return 'The next major Shahi Snan (Royal Bathing) is scheduled for tomorrow morning. Expect extremely high footfall in the Sangam sector from 3:00 AM onwards.';
    return 'I am an AI Assistant. I am here to ensure your spiritual journey is safe and smooth. Please ask me specifically about safety, navigation, medical camps, or events.';
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse = generateLocalResponse(userMsg);
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);

      // Auto-read if speechSynthesis is available and not speaking
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        const utterance = new SpeechSynthesisUtterance(botResponse);
        // Try to match language voice if possible, fallback to default
        utterance.lang = lang === 'hi' ? 'hi-IN' : (lang === 'en' ? 'en-US' : lang);
        window.speechSynthesis.speak(utterance);
      }
    }, 800);
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : (lang === 'en' ? 'en-US' : lang);
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const downloadPass = async () => {
    if (passRef.current) {
      const htmlToImage = await import('html-to-image');
      htmlToImage.toPng(passRef.current, { backgroundColor: '#F4FAF8', pixelRatio: 2 })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `Simhastha_SafetyPass_${passData.name.replace(/\s/g, '_') || 'Pilgrim'}.png`;
          link.href = dataUrl;
          link.click();
        });
    }
  };

  const nodes = globalState?.nodes || [];
  const alerts = globalState?.alerts || [];
  const totalCrowd = nodes.reduce((a: number, n: any) => a + n.current_crowd_count, 0);
  const avgSafety = nodes.length ? Math.round(nodes.reduce((a: number, n: any) => a + (n.safety_score || 100), 0) / nodes.length) : 100;
  const leaderboard = [...nodes].sort((a, b) => b.max_capacity - a.max_capacity);

  // Watch for critical alerts → queue alarm popups
  useEffect(() => {
    if (!alerts?.length) return;
    const newAlarms: AlarmData[] = [];
    alerts.forEach((a: any) => {
      if (shownAlarmIds.has(a.id)) return;
      const isCritical = a.message?.includes('CRITICAL') || a.message?.includes('breached');
      if (isCritical) {
        const nodeName = nodes.find((n: any) => n.id === a.node_id)?.name || 'Unknown Sector';
        newAlarms.push({
          id: a.id,
          type: 'CAPACITY',
          title: 'Capacity Breach Detected!',
          message: a.message,
          location: nodeName,
          timestamp: new Date()
        });
        setShownAlarmIds(prev => new Set([...prev, a.id]));
      }
    });
    if (newAlarms.length > 0) {
      setAlarmQueue(prev => [...prev, ...newAlarms]);
    }
  }, [alerts]);



  // Watch unsafe nodes → safety alarm
  useEffect(() => {
    nodes.forEach((n: any) => {
      const score = n.safety_score || 100;
      if (score < 25 && !shownAlarmIds.has(`safety-${n.id}`)) {
        setShownAlarmIds(prev => new Set([...prev, `safety-${n.id}`]));
        setAlarmQueue(prev => [{
          id: `safety-${n.id}`,
          type: 'SAFETY',
          title: 'Critical Safety Index!',
          message: `${n.name} has dropped to a safety index of ${Math.round(score)}%. Immediate crowd diversion required.`,
          location: n.name,
          timestamp: new Date()
        }, ...prev]);
      }
    });
  }, [nodes]);

  // Fetch insights
  useEffect(() => {
    let api = process.env.NEXT_PUBLIC_API_URL || 'https://simhastha-backend.onrender.com/api';
    if (api.endsWith('/')) api = api.slice(0, -1);
    if (!api.endsWith('/api')) api = `${api}/api`;
    fetch(`${api}/insights`).then(r => r.json()).then(data => {
      const chartData = data.historical_data.map((d: any) => ({ name: d.Year.toString(), visitors: d.Total_Visitors / 1000000 }));
      chartData.push({ name: '2028 (AI)', visitors: data.prediction_2028 / 1000000 });
      setInsights({ chartData, historical_risks: data.historical_risks || [] });
    }).catch(console.error);
  }, []);

  const calculateRoute = async () => {
    if (!sourceId || !targetId) return;
    setLoadingRoute(true);
    try {
      let api = process.env.NEXT_PUBLIC_API_URL || 'https://simhastha-backend.onrender.com/api';
      if (api.endsWith('/')) api = api.slice(0, -1);
      if (!api.endsWith('/api')) api = `${api}/api`;
      const res = await fetch(`${api}/route?source_id=${sourceId}&target_id=${targetId}`);
      const data = await res.json();
      if (data.path) {
        setActiveRoute(data.path);
        // Trigger route success notification
        setAlarmQueue(prev => [{
          id: `route-${Date.now()}`,
          type: 'ROUTE',
          title: 'Safe Route Calculated',
          message: `Optimal diversion route found with ${data.path.length} waypoints. All NDRF units notified.`,
          location: `${nodes.find((n: any) => n.id === sourceId)?.name || sourceId} → ${nodes.find((n: any) => n.id === targetId)?.name || targetId}`,
          timestamp: new Date()
        }, ...prev]);
      }
    } catch (e) { console.error(e); }
    setLoadingRoute(false);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>ॐ Simhastha — AI Command Centre</title>
        <meta name="description" content="AI-powered crowd management and pilgrim safety for Simhastha" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;700&family=Fira+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      {/* NOTIFICATION PANEL (Bottom Right) */}
      <div className="notif-wrapper">
        {isNotifOpen && (
          <div className="notif-panel">
            <div className="notif-panel-header">
              <div className="notif-panel-title">
                <Bell size={14} color="var(--text-primary)" />
                System Alerts
              </div>
              {alarmQueue.length > 0 && (
                <button className="notif-panel-clear" onClick={() => setAlarmQueue([])}>
                  Clear All
                </button>
              )}
            </div>

            <div className="notif-list">
              {alarmQueue.length === 0 ? (
                <div className="notif-empty">
                  <CheckCircle2 size={32} color="var(--safe)" opacity={0.5} />
                  <div>All systems nominal. No active alerts.</div>
                </div>
              ) : (
                alarmQueue.map((a) => (
                  <div key={a.id} className={`notif-item ${a.type === 'ROUTE' ? 'item-success' : 'item-danger'}`}>
                    <div className="notif-item-inner">
                      <div className="notif-item-header">
                        <span className={`notif-item-type ${a.type === 'ROUTE' ? 'success' : 'danger'}`}>
                          {ALARM_TYPE_LABELS[a.type]}
                        </span>
                        <button className="notif-item-dismiss" onClick={() => setAlarmQueue(prev => prev.filter(x => x.id !== a.id))}>
                          <X size={12} />
                        </button>
                      </div>
                      <div className="notif-item-title">{a.title}</div>
                      <div className="notif-item-msg">{a.message}</div>
                      <div className="notif-item-location">
                        <MapPin size={9} /> {a.location}
                      </div>

                      {a.type !== 'ROUTE' && (
                        <div className="notif-item-actions">
                          <button className="notif-item-btn-dismiss" onClick={() => setAlarmQueue(prev => prev.filter(x => x.id !== a.id))}>
                            Dismiss
                          </button>
                          <button className="notif-item-btn-action" onClick={() => {
                            setAlarmQueue(prev => prev.filter(x => x.id !== a.id));
                            setIsNotifOpen(false);
                            scrollTo('routing');
                          }}>
                            {tx('deployNDRF', lang)}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <button
          className={`notif-bell-btn ${alarmQueue.length > 0 ? 'has-alerts' : ''}`}
          onClick={() => setIsNotifOpen(!isNotifOpen)}
        >
          <Bell size={24} />
          {alarmQueue.length > 0 && (
            <div className="notif-badge">{alarmQueue.length}</div>
          )}
        </button>
      </div>

      {/* ── STICKY NAV ── */}
      <nav className="nav-bar">
        <div className="nav-logo">
          <span className="om">ॐ</span>
          <div>
            <div className="nav-title">Simhastha</div>
            <div className="nav-subtitle">Simhastha</div>
          </div>
        </div>
        <div className="nav-links">
          {[
            { id: 'welcome', label: tx('navWelcome', lang) },
            { id: 'live-ops', label: tx('navOps', lang) },
            { id: 'sectors', label: tx('navSectors', lang) },
            { id: 'routing', label: tx('navRouting', lang) },
          ].map(link => (
            <button key={link.id} className="nav-link" onClick={() => scrollTo(link.id)}>
              {link.label}
            </button>
          ))}
          <LanguageSelector lang={lang} setLang={setLang} />
        </div>
        {/* Mobile: show lang only */}
        <div style={{ display: 'none' }}>
          <LanguageSelector lang={lang} setLang={setLang} />
        </div>
      </nav>

      <div className="page-wrapper">

        {/* ══════════════════════════════════════
            SECTION 1 — WELCOME / HERO
        ══════════════════════════════════════ */}
        <section id="welcome" className="hero-section">
          <div className="hero-bg" />
          <div className="hero-grid-pattern" />

          <div className="hero-content">
            {/* Left — Om Symbol */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <div className="hero-om-display">ॐ</div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  सत्यम् · शिवम् · सुंदरम्
                </p>
              </div>
              <div className="hero-stats-row">
                <div className="hero-stat"><span className="hero-stat-value">45M+</span><span className="hero-stat-label">Expected Pilgrims</span></div>
                <div className="hero-stat"><span className="hero-stat-value">AI</span><span className="hero-stat-label">Real-time Guard</span></div>
                <div className="hero-stat"><span className="hero-stat-value">24/7</span><span className="hero-stat-label">Live Monitoring</span></div>
              </div>
            </div>

            {/* Right — Text */}
            <div>
              <div className="section-label"><Flame size={11} /> Simhastha</div>
              <h1 className="section-title">
                {tx('heroTitle1', lang)}<br />
                <span className="accent">{tx('heroTitle2', lang)}</span>
              </h1>
              <p className="section-desc">{tx('heroDesc', lang)}</p>

              <div className="hero-badge-row">
                {[
                  { icon: '🛡️', label: 'Pilgrim Safety' },
                  { icon: '⚡', label: 'Live Alerts' },
                  { icon: '🌐', label: '20 Languages' },
                ].map(b => (
                  <span key={b.label} className="hero-badge">{b.icon} {b.label}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" style={{ width: 'auto', padding: '13px 28px' }} onClick={() => scrollTo('live-ops')}>
                  View Live Data →
                </button>
                <button className="btn-primary" style={{ width: 'auto', padding: '13px 24px', background: 'rgba(255,184,48,0.1)', border: '1px solid rgba(255,184,48,0.3)', boxShadow: 'none', color: 'var(--gold)' }} onClick={() => scrollTo('routing')}>
                  Route Planner
                </button>
              </div>
            </div>
          </div>

          <div className="scroll-hint">
            <div className="scroll-arrow" />
            <span>scroll</span>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 2 — HISTORICAL PROJECTION
        ══════════════════════════════════════ */}
        <section id="projection" className="section">
          <div className="section-inner">
            <div className="section-label"><TrendingUp size={11} /> Devotion & Influx</div>
            <h2 className="section-title">Simhastha: Devotees over Decades</h2>
            <p className="section-desc">
              To show our deepest appreciation towards the devotees of Simhastha, here is the profound spiritual pull over the decades, projecting the monumental influx for 2028.
            </p>
            <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontWeight: 700, fontSize: '15px' }}>
                <TrendingUp size={16} color="var(--saffron)" /> AI Historical Pilgrim Projection
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Visitor influx (Millions) — Historical + AI 2028 forecast
              </p>
              <div style={{ height: 220 }}>
                {insights ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={insights.chartData}>
                      <defs>
                        <linearGradient id="sacredGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,107,0,0.07)" />
                      <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                      <YAxis stroke="var(--text-muted)" fontSize={11} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#FFFBF7', borderColor: 'var(--saffron-border)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: 'var(--saffron-deep)' }} itemStyle={{ color: 'var(--saffron)' }} />
                      <Area type="monotone" dataKey="visitors" stroke="#FF6B00" strokeWidth={2.5} fill="url(#sacredGrad)" dot={{ fill: '#FF6B00', r: 3 }} activeDot={{ r: 6, fill: '#FFB830' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 13 }}>Loading AI Projection...</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 3 — LIVE OPERATIONS
        ══════════════════════════════════════ */}
        <section id="live-ops" className="section" style={{ background: 'var(--bg-section-alt)' }}>
          <div className="section-inner">
            <div className="section-label"><Activity size={11} /> Real-time · Live Feed</div>
            <h2 className="section-title">{tx('liveOpsTitle', lang)}</h2>
            <p className="section-desc">
              Live crowd density data streamed via WebSocket from all active sectors. Critical thresholds trigger instant alarms.
            </p>

            {/* Metric Cards */}
            <div className="metrics-grid">
              <div className="glass-card metric-card saffron">
                <div className="metric-label"><Users size={13} />{tx('totalPilgrims', lang)}</div>
                <div className="metric-number gold-grad" style={{ color: 'var(--saffron)' }}>{totalCrowd.toLocaleString()}</div>
                <div className="metric-sub">Across all sectors</div>
              </div>
              <div className="glass-card metric-card danger">
                <div className="metric-label"><Zap size={13} style={{ color: 'var(--critical)' }} />{tx('activeAlerts', lang)}</div>
                <div className="metric-number red-grad" style={{ color: 'var(--danger)' }}>{alerts.length}</div>
                <div className="metric-sub">{alerts.length > 0 ? 'Immediate action required' : 'All clear'}</div>
              </div>
              <div className="glass-card metric-card safe">
                <div className="metric-label"><Shield size={13} style={{ color: 'var(--safe)' }} />{tx('safetyIndex', lang)}</div>
                <div className="metric-number" style={{ color: safetyColor(avgSafety) }}>{avgSafety}%</div>
                <div className="metric-sub">Average across network</div>
              </div>
              <div className="glass-card metric-card river">
                <div className="metric-label"><Activity size={13} style={{ color: 'var(--river-light)' }} />ACTIVE SECTORS</div>
                <div className="metric-number" style={{ color: 'var(--river-light)' }}>{nodes.length}</div>
                <div className="metric-sub">Nodes online</div>
              </div>
            </div>

            {/* AI Assistant Chatbot */}
            <div className="glass-card" style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', height: '400px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,184,48,0.05)' }}>
                <Bot size={20} color="var(--saffron)" />
                <strong style={{ fontSize: '15px' }}>Simhastha AI</strong>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '80%', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-line',
                      background: msg.sender === 'user' ? 'var(--saffron)' : 'var(--bg-section-alt)',
                      color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                      border: msg.sender === 'bot' ? '1px solid var(--border-subtle)' : 'none'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              <div style={{ padding: '20px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                  placeholder={isListening ? 'Listening...' : 'Ask your question... (example: nearest ghat, lost family, food help)'}
                  style={{
                    width: '100%',
                    padding: '20px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    outline: 'none',
                    marginBottom: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                  }}
                />
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    onClick={handleChatSubmit}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '12px 24px',
                      background: 'var(--bg-card)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '24px',
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      fontSize: '15px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.05)'
                    }}>
                    <Sparkles size={18} color="#8B5CF6" /> Ask Simhastha
                  </button>
                  <button
                    onClick={toggleVoice}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '12px 24px',
                      background: 'var(--bg-card)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                      borderRadius: '24px',
                      color: isListening ? 'var(--danger)' : 'var(--saffron-deep)',
                      fontWeight: 600,
                      fontSize: '15px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)'
                    }}>
                    <Mic size={18} color={isListening ? 'var(--danger)' : '#64748b'} /> Voice Ask
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 3 — MAJOR SECTORS
        ══════════════════════════════════════ */}
        <section id="sectors" className="section">
          <div className="section-inner">
            <div className="section-label"><ShieldAlert size={11} /> Crowd Density · Sector Health</div>
            <h2 className="section-title">{tx('secTitle', lang)}</h2>
            <p className="section-desc">
              Real-time safety scores and crowd density for each active pilgrimage sector. Sectors shown in critical state trigger automatic alarms.
            </p>

            {/* Educational Insights */}
            {insights?.historical_risks?.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 24 }}>
                {insights.historical_risks.map((risk: any, i: number) => (
                  <div key={i} className="glass-card" style={{ padding: '18px 20px', borderLeft: '3px solid var(--saffron)', animationDelay: `${i * 0.08}s` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <strong style={{ color: 'var(--gold)', fontSize: 13 }}>{risk.event}</strong>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>{risk.date}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', gap: 12 }}>
                      <span>🌤 {risk.weather}</span><span>🛡 {risk.safety_index}%</span>
                    </div>
                    <p style={{ fontSize: 12, lineHeight: 1.55, margin: 0, color: 'var(--text-primary)' }}>{risk.advice}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Sector Cards */}
            <div className="sectors-grid">
              {leaderboard.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--safe)', fontSize: 14 }}>
                    <CheckCircle2 size={18} /> {tx('allClear', lang)}
                  </div>
                </div>
              ) : leaderboard.map((n: any, i: number) => {
                const score = Math.round(n.safety_score || 100);
                const pct = crowdPct(n);
                const cardCls = score >= 70 ? 'safe-card' : score >= 40 ? 'warn-card' : 'danger-card';
                const scoreCls = score >= 70 ? 'score-safe' : score >= 40 ? 'score-warn' : 'score-danger';
                const statusTxt = score >= 70 ? '✓ Safe Space Available' : score >= 40 ? '⚠ Filling Up Fast' : '✗ Avoid - Maximum Capacity';
                const statusColor = score >= 70 ? 'var(--safe)' : score >= 40 ? 'var(--warn)' : 'var(--danger)';
                return (
                  <div key={n.id} className={`glass-card sector-card ${cardCls}`} style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="sector-header">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span className={`status-dot ${safetyClass(score)}`} />
                          <div className="sector-name">{n.name}</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: statusColor }}>{statusTxt}</div>
                      </div>
                      <div className="sector-score">
                        <div className={`sector-score-value ${scoreCls}`}>{score}%</div>
                        <div className="sector-score-label">{tx('safetyScore', lang)}</div>
                      </div>
                    </div>
                    {/* Crowd density bar */}
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: crowdBarGrad(pct) }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>
                      {pct > 50 ? '↑ Crowd increasing' : '↓ Crowd decreasing'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 4 — DIVERSION ROUTING + MAP
        ══════════════════════════════════════ */}
        <section id="routing" className="section" style={{ background: 'var(--bg-section-alt)' }}>
          <div className="section-inner">
            <div className="section-label"><Route size={11} /> Google Maps</div>
            <h2 className="section-title">{tx('routeTitle', lang)}</h2>
            <p className="section-desc">
              Select source and destination sectors to calculate the optimal safe pilgrim diversion route, rendered live on Google Maps.
            </p>

            <div className="routing-layout">
              {/* Left — Form */}
              <div className="glass-card routing-form">
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontWeight: 700, fontSize: 15 }}>
                    <Navigation size={16} color="var(--saffron)" /> Route Calculator
                  </div>
                </div>

                {/* Source */}
                <div className="form-field">
                  <div className="form-label"><span className="dot-icon" /> {tx('sourceNode', lang)}</div>
                  <select className="input-select" value={sourceId} onChange={e => setSourceId(e.target.value)} id="source-select">
                    <option value="">{tx('sourceNode', lang)}...</option>
                    {nodes.map((n: any) => <option key={n.id} value={n.id}>{n.name}</option>)}
                  </select>
                </div>

                {/* Visual connector */}
                <div className="form-connector">
                  <div className="form-connector-line" />
                  <Navigation size={12} color="var(--saffron)" />
                  <div className="form-connector-line" />
                </div>

                {/* Target */}
                <div className="form-field">
                  <div className="form-label"><span className="dot-icon" style={{ background: 'var(--gold)' }} /> {tx('targetNode', lang)}</div>
                  <select className="input-select" value={targetId} onChange={e => setTargetId(e.target.value)} id="target-select">
                    <option value="">{tx('targetNode', lang)}...</option>
                    {nodes.map((n: any) => <option key={n.id} value={n.id}>{n.name}</option>)}
                  </select>
                </div>

                <button className="btn-primary" onClick={calculateRoute} disabled={loadingRoute || !sourceId || !targetId} id="calc-route-btn">
                  {loadingRoute ? tx('calculating', lang) : tx('calcRoute', lang)}
                </button>

                {/* Route result */}
                {routeDetails && (
                  <div className="route-result-card">
                    <div style={{ fontSize: 11, color: 'var(--saffron)', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>
                      ✓ Route Found
                    </div>
                    <div className="route-result-row">
                      <span style={{ color: 'var(--text-secondary)' }}>Safe Distance</span>
                      <strong style={{ color: 'var(--gold)' }}>{routeDetails.distance}</strong>
                    </div>
                    <div className="route-result-row">
                      <span style={{ color: 'var(--text-secondary)' }}>Est. Walking Time</span>
                      <strong style={{ color: 'var(--gold)' }}>{routeDetails.duration}</strong>
                    </div>
                    <div className="route-result-row">
                      <span style={{ color: 'var(--text-secondary)' }}>Waypoints</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{activeRoute.length}</strong>
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>Map Legend</div>
                  {[
                    { color: 'var(--safe)', label: 'Safe Zone (≥70%)' },
                    { color: 'var(--warn)', label: 'Caution (40–70%)' },
                    { color: 'var(--critical)', label: 'Critical (<40%)' },
                    { color: '#00d4ff', label: 'Active Route' },
                  ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, flexShrink: 0, boxShadow: `0 0 6px ${l.color}` }} />
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Google Map Window */}
              <div>
                <div className="map-window">
                  {/* Map header bar */}
                  <div className="map-window-header">
                    <div className="map-window-title">
                      <div className="map-live-dot" />
                      <MapPin size={12} color="var(--saffron)" />
                      Ujjain · Simhastha Zone
                    </div>
                    <div className="map-zoom-controls">
                      <button className="map-zoom-btn" title="Zoom In" onClick={() => { setMapZoom(z => Math.min(z + 1, 18)); }}>+</button>
                      <button className="map-zoom-btn" title="Zoom Out" onClick={() => { setMapZoom(z => Math.max(z - 1, 10)); }}>−</button>
                    </div>
                  </div>

                  {/* Google Map */}
                  <div className="map-container-inner">
                    <MapWithNoSSR
                      onStateUpdate={setGlobalState}
                      activeRoute={activeRoute}
                      onRouteDetailsUpdate={setRouteDetails}
                      zoom={mapZoom}
                    />
                  </div>
                </div>

                {/* Map info strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 12 }}>
                  {[
                    { label: 'Sectors Mapped', value: nodes.length },
                    { label: 'NDRF Bases', value: 4 },
                    { label: 'Medical Camps', value: 3 },
                  ].map(s => (
                    <div key={s.label} className="glass-panel" style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>{s.value}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 5 — SMART PILGRIM ID PASS
        ══════════════════════════════════════ */}
        <section id="id-pass" className="section">
          <div className="section-inner">
            <div className="id-pass-container">
              <div className="id-pass-header">
                <h2 className="id-pass-title">Smart Pilgrim ID Pass</h2>
                <p className="id-pass-desc">
                  Generate a secure, offline-ready ID with a scannable QR code for emergencies.
                </p>
              </div>

              {!isPassGenerated ? (
                <div className="id-form-grid">
                  <div className="id-form-group">
                    <label className="id-label">Pilgrim Full Name *</label>
                    <input className="id-input" placeholder="e.g. Ramesh Kumar" value={passData.name} onChange={e => setPassData({ ...passData, name: e.target.value })} />
                  </div>
                  <div className="id-form-group">
                    <label className="id-label">Emergency Contact *</label>
                    <input className="id-input" placeholder="Relative's Number" value={passData.contact} onChange={e => setPassData({ ...passData, contact: e.target.value })} />
                  </div>
                  <div className="id-form-group">
                    <label className="id-label">Blood Group</label>
                    <select className="id-input" value={passData.blood} onChange={e => setPassData({ ...passData, blood: e.target.value })}>
                      <option>Select...</option>
                      <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                      <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                    </select>
                  </div>
                  <div className="id-form-group">
                    <label className="id-label">Camp Number</label>
                    <input className="id-input" placeholder="e.g. Sector 4, Tent 112" value={passData.camp} onChange={e => setPassData({ ...passData, camp: e.target.value })} />
                  </div>
                  <div className="id-form-group full">
                    <label className="id-label">Medical Conditions / Allergies (If any)</label>
                    <input className="id-input" style={{ borderColor: 'var(--danger)', background: '#FFF4F4' }} placeholder="e.g. Diabetic, Asthma, None" value={passData.medical} onChange={e => setPassData({ ...passData, medical: e.target.value })} />
                  </div>
                  <div className="id-form-group full">
                    <button className="id-generate-btn" onClick={() => { if (passData.name && passData.contact) setIsPassGenerated(true); }}>
                      Generate Pilgrim Pass 🪪
                    </button>
                  </div>
                </div>
              ) : (
                <div className="id-card-wrapper">
                  <div className="id-card" ref={passRef}>
                    <div className="id-card-top">
                      <div className="id-card-hole" />
                      <div className="id-card-top-sub">SIMHASTHA </div>
                      <div className="id-card-top-title">Pilgrim Pass</div>
                    </div>

                    <div className="id-card-body">
                      <div className="id-card-watermark">ॐ</div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                          <div className="id-data-group">
                            <div className="id-data-label">NAME</div>
                            <div className="id-data-value">{passData.name.toUpperCase()}</div>
                          </div>
                          <div className="id-data-group">
                            <div className="id-data-label">EMERGENCY CONTACT</div>
                            <div className="id-data-value small">{passData.contact}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                            <div className="id-qr-box" style={{ padding: '8px 12px' }}>
                              <div className="id-data-label">BLOOD</div>
                              <div className="id-data-value" style={{ color: 'var(--danger)' }}>{passData.blood === 'Select...' ? 'NA' : passData.blood}</div>
                            </div>
                            <div className="id-qr-box" style={{ padding: '8px 12px', flex: 1 }}>
                              <div className="id-data-label">TENT/CAMP</div>
                              <div className="id-data-value small">{passData.camp || 'NA'}</div>
                            </div>
                          </div>
                        </div>

                        <div className="id-qr-box" style={{ width: 100, height: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <QRCodeSVG value={JSON.stringify(passData)} size={80} level="M" fgColor="#0F764F" />
                          <div className="id-qr-text">SCAN TO READ</div>
                        </div>
                      </div>

                      <div className="id-med-alert" style={{ marginTop: 20 }}>
                        <ShieldAlert size={16} className="id-med-alert-icon" />
                        <div>
                          <div className="id-med-title">MEDICAL ALERT</div>
                          <div className="id-med-val">{passData.medical || 'NA'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="id-card-footer">
                      <div className="id-footer-tag"><Shield size={12} /> Secure ID</div>
                      <div className="id-footer-phone">1920 Helpline</div>
                    </div>
                  </div>

                  <button className="id-download-btn" onClick={downloadPass}>
                    Download to Gallery 📥
                  </button>
                  <button className="id-back-btn" onClick={() => setIsPassGenerated(false)}>
                    Edit Details
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: '#FFF3E0', borderTop: '2px solid var(--saffron-border)', padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 10, color: 'var(--saffron)', textShadow: '0 0 16px rgba(249,115,22,0.3)' }}>ॐ</div>
          <div style={{ fontFamily: 'var(--font-sacred)', fontSize: 15, color: 'var(--text-primary)', fontWeight: 700, marginBottom: 6 }}>Simhastha</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '1px' }}>जय महाकाल · Real-time Safety for All Pilgrims</div>
        </footer>
      </div>
    </>
  );
}
