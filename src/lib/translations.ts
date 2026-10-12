export type Locale = 'en' | 'te' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    te: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    te: 'హోమ్',
    hi: 'होम',
  },
  'nav.shop': {
    en: 'Shop',
    te: 'షాప్',
    hi: 'शॉप',
  },
  'nav.about': {
    en: 'About Us',
    te: 'మా గురించి',
    hi: 'हमारे बारे में',
  },
  'nav.track_order': {
    en: 'Track Order',
    te: 'ఆర్డర్ ట్రాకింగ్',
    hi: 'ऑर्डर ट्रैक करें',
  },
  'nav.contact': {
    en: 'Contact Us',
    te: 'సంప్రదించండి',
    hi: 'संपर्क करें',
  },
  'nav.search': {
    en: 'Search products',
    te: 'ఉత్పత్తులను వెతకండి',
    hi: 'उत्पाद खोजें',
  },
  'nav.search_placeholder': {
    en: 'Search road cycles, mountain cycles, standard cycles, spares...',
    te: 'రోడ్ సైకిళ్ళు, మౌంటెన్ సైకిళ్ళు, స్టాండర్డ్ సైకిళ్ళు, స్పేర్స్ కోసం వెతకండి...',
    hi: 'रोड साइकिल, माउंटेन साइकिल, स्टैंडर्ड साइकिल, स्पेयर पार्ट्स खोजें...',
  },
  'nav.search_btn': {
    en: 'Search',
    te: 'వెతకండి',
    hi: 'खोजें',
  },
  'nav.account': {
    en: 'Account',
    te: 'ఖాతా',
    hi: 'खाता',
  },
  'nav.my_orders': {
    en: 'My Orders',
    te: 'నా ఆర్డర్లు',
    hi: 'मेरे ऑर्डर',
  },
  'nav.account_settings': {
    en: 'Account Settings',
    te: 'ఖాతా సెట్టింగులు',
    hi: 'खाता सेटिंग्स',
  },
  'nav.sign_in': {
    en: 'Sign In',
    te: 'లాగిన్',
    hi: 'साइन इन',
  },
  'nav.register': {
    en: 'Register',
    te: 'రిజిస్టర్',
    hi: 'रजिस्टर करें',
  },
  'nav.sign_out': {
    en: 'Sign Out',
    te: 'లాగ్ అవుట్',
    hi: 'साइन आउट',
  },
  'nav.support': {
    en: 'Support',
    te: 'సపోర్ట్',
    hi: 'सपोर्ट',
  },
  'nav.whatsapp_support': {
    en: 'Chat on WhatsApp',
    te: 'వాట్సాప్‌లో మాట్లాడండి',
    hi: 'व्हाट्सएप सहायता',
  },
  'nav.cart': {
    en: 'Shopping Cart',
    te: 'షాపింగ్ కార్ట్',
    hi: 'शॉपिंग कार्ट',
  },
  'nav.wishlist': {
    en: 'Wishlist',
    te: 'విష్‌లిస్ట్',
    hi: 'विशलिस्ट',
  },
  'nav.theme': {
    en: 'Theme',
    te: 'థీమ్',
    hi: 'थीम',
  },
  'nav.language': {
    en: 'Language',
    te: 'భాష',
    hi: 'भाषा',
  },
  'nav.light_mode': {
    en: 'Light Mode',
    te: 'లైట్ మోడ్',
    hi: 'लाइट मोड',
  },
  'nav.dark_mode': {
    en: 'Dark Mode',
    te: 'డార్క్ మోడ్',
    hi: 'डार्क मोड',
  },

  // Hero Section
  'hero.slide1_badge': {
    en: '✨ 2026 Pro Series',
    te: '✨ 2026 ప్రో సిరీస్',
    hi: '✨ 2026 प्रो सीरीज़',
  },
  'hero.slide1_title': {
    en: 'Ride with Passion.',
    te: 'మక్కువతో సైక్లింగ్ చేయండి.',
    hi: 'जुनून के साथ राइड करें।',
  },
  'hero.slide1_highlight': {
    en: 'Engineered for Pure Speed.',
    te: 'వేగం మరియు సామర్థ్యంతో రూపొందించబడింది.',
    hi: 'असाधारण गति के लिए निर्मित।',
  },
  'hero.slide1_subtitle': {
    en: 'Ultra-light carbon frames, Shimano 105 gearing, and aerodynamic precision for riders who demand excellence.',
    te: 'అల్ట్రా-లైట్ కార్బన్ ఫ్రేమ్‌లు, షిమనో 105 గేరింగ్ మరియు రైడర్‌ల కోసం అత్యుత్తమ ఏరోడైనమిక్ డిజైన్.',
    hi: 'अल्ट्रा-लाइट कार्बन फ्रेम, शिमानो 105 गियरिंग, और बेहतरीन राइडर्स के लिए सटीक एरोडायनामिक डिज़ाइन।',
  },
  'hero.slide1_cta': {
    en: 'Explore Road Cycles',
    te: 'రోడ్ సైకిళ్లను చూడండి',
    hi: 'रोड साइकिल देखें',
  },
  'hero.slide1_secondary': {
    en: 'Shop All Cycles',
    te: 'అన్ని సైకిళ్లు చూడండి',
    hi: 'सभी साइकिलें देखें',
  },
  'hero.slide1_price': {
    en: 'Starting from ₹19,999',
    te: 'ప్రారంభ ధర ₹19,999',
    hi: 'शुरुआती कीमत ₹19,999',
  },

  'hero.slide2_badge': {
    en: '🏔️ Trail Dominance',
    te: '🏔️ ట్రైల్ అడ్వెంచర్',
    hi: '🏔️ ट्रेल एडवेंचर',
  },
  'hero.slide2_title': {
    en: 'Conquer the Rough.',
    te: 'కఠినమైన మార్గాలను జయించండి.',
    hi: 'कठिन रास्तों पर विजय पाएं।',
  },
  'hero.slide2_highlight': {
    en: 'Built for Untamed Adventures.',
    te: 'కొండలు, గుట్టలపై సాహసయాత్రల కోసం.',
    hi: 'रोमांचक यात्राओं के लिए तैयार।',
  },
  'hero.slide2_subtitle': {
    en: 'Heavy-duty RockShox suspension, hydraulic disc brakes, and rugged geometry ready for every mountain trail.',
    te: 'హెవీ-డ్యూటీ సస్పెన్షన్, హైడ్రాలిక్ డిస్క్ బ్రేకులు మరియు కొండ ప్రాంతాల కోసం దృఢమైన జామెట్రీ.',
    hi: 'हैवी-ड्यूटी सस्पेंशन, हाइड्रोलिक डिस्क ब्रेक, और हर पहाड़ी रास्ते के लिए मजबूत फ्रेम।',
  },
  'hero.slide2_cta': {
    en: 'Shop Mountain Cycles',
    te: 'మౌంటెన్ సైకిళ్లు కొనండి',
    hi: 'माउंटेन साइकिल खरीदें',
  },
  'hero.slide2_secondary': {
    en: 'Explore Gear',
    te: 'స్పేర్స్ చూడండి',
    hi: 'गियर और स्पेयर देखें',
  },
  'hero.slide2_price': {
    en: 'Mountain Cycles from ₹5,525',
    te: 'మౌంటెన్ సైకిళ్ళు ₹5,525 నుండి',
    hi: 'माउंटेन साइकिल ₹5,525 से',
  },

  'hero.slide3_badge': {
    en: '🚲 Premium Range',
    te: '🚲 ప్రీమియం శ్రేణి',
    hi: '🚲 प्रीमियम रेंज',
  },
  'hero.slide3_title': {
    en: 'Ladies & Disc Brake Cycles.',
    te: 'లేడీస్ & డిస్క్ బ్రేక్ సైకిళ్ళు.',
    hi: 'लेडीज और डिस्क ब्रेक साइकिलें।',
  },
  'hero.slide3_highlight': {
    en: 'Comfort, Elegance & Safety.',
    te: 'సౌకర్యం, అందం మరియు భద్రత.',
    hi: 'आराम, सुंदरता और सुरक्षा।',
  },
  'hero.slide3_subtitle': {
    en: 'Step-through frames, dual mechanical disc brakes, ergonomic saddles, and smooth gearing for daily convenience.',
    te: 'స్టెప్-త్రూ ఫ్రేమ్‌లు, డ్యూయల్ డిస్క్ బ్రేకులు, సౌకర్యవంతమైన సీట్లు మరియు సులభమైన గేరింగ్.',
    hi: 'स्टेप-थ्रू फ्रेम, डुअल डिस्क ब्रेक, आरामदायक सीट और दैनिक उपयोग के लिए स्मूथ गियर।',
  },
  'hero.slide3_cta': {
    en: 'Shop Ladies Cycles',
    te: 'లేడీస్ సైకిళ్ళు కొనండి',
    hi: 'लेडीज साइकिल खरीदें',
  },
  'hero.slide3_secondary': {
    en: 'Disc Brake Range',
    te: 'డిస్క్ బ్రేక్ శ్రేణి',
    hi: 'डिस्क ब्रेक रेंज',
  },
  'hero.slide3_price': {
    en: 'Disc Brake from ₹4,999',
    te: 'డిస్క్ బ్రేక్ ₹4,999 నుండి',
    hi: 'डिस्क ब्रेक ₹4,999 से',
  },

  'hero.trust_assembled': {
    en: '95% Pre-Assembled',
    te: '95% ప్రీ-అసెంబుల్డ్',
    hi: '95% प्री-असेम्बल्ड',
  },
  'hero.trust_genuine': {
    en: '100% Genuine Parts',
    te: '100% అసలైన స్పేర్ పార్ట్స్',
    hi: '100% असली पार्ट्स',
  },
  'hero.trust_showroom': {
    en: 'Kazipet Showroom',
    te: 'కాజీపేట్ షోరూమ్',
    hi: 'काजीपेट शोरूम',
  },

  // Trust Badges / Footer features
  'trust.delivery_title': {
    en: 'Doorstep Delivery',
    te: 'డోర్‌స్టెప్ డెలివరీ',
    hi: 'डोरस्टेप डिलीवरी',
  },
  'trust.delivery_desc': {
    en: 'Charges applicable on orders',
    te: 'ఆర్డర్లపై వర్తించే ఛార్జీలు',
    hi: 'ऑर्डर पर लागू शुल्क',
  },
  'trust.assembled_title': {
    en: '95% Pre-Assembled',
    te: '95% ప్రీ-అసెంబుల్డ్',
    hi: '95% प्री-असेम्बल्ड',
  },
  'trust.assembled_desc': {
    en: 'Ready to ride with free toolkit',
    te: 'ఉచిత టూల్‌కిట్‌తో వెంటనే నడపవచ్చు',
    hi: 'फ्री टूलकिट के साथ राइड के लिए तैयार',
  },
  'trust.genuine_title': {
    en: '100% Genuine Guarantee',
    te: '100% అసలైన ఉత్పత్తుల హామీ',
    hi: '100% असली होने की गारंटी',
  },
  'trust.genuine_desc': {
    en: 'Original cycle & auto spare parts',
    te: 'ఒరిజినల్ సైకిల్ & ఆటో స్పేర్ పార్ట్స్',
    hi: 'ओरिजिनल साइकिल और ऑटो स्पेयर पार्ट्स',
  },
  'trust.support_title': {
    en: '7-Day Easy Support',
    te: '7-రోజుల సులభమైన మద్దతు',
    hi: '7-दिवसीय आसान सपोर्ट',
  },
  'trust.support_desc': {
    en: 'Hassle-free exchange & service',
    te: 'సులభమైన ఎక్స్ఛేంజ్ & సర్వీస్',
    hi: 'आसान एक्सचेंज और सर्विसिंग',
  },

  // Categories
  'cat.curated_title': {
    en: 'Curated Collections',
    te: 'ప్రత్యేక కలెక్షన్స్',
    hi: 'विशेष कलेक्शंस',
  },
  'cat.explore_heading': {
    en: 'Explore By Category',
    te: 'కేటగిరీల ప్రకారం అన్వేషించండి',
    hi: 'श्रेणी के अनुसार देखें',
  },
  'cat.explore_subtitle': {
    en: 'Engineered cycles for daily city commutes, mountain trails, and family rides.',
    te: 'రోజువారీ ప్రయాణాలు, కొండ మార్గాలు మరియు కుటుంబ ప్రయాణాల కోసం రూపొందించిన సైకిళ్ళు.',
    hi: 'दैनिक यात्रा, पहाड़ी ट्रेल्स और परिवार के लिए विशेष रूप से निर्मित साइकिलें।',
  },
  'cat.all': {
    en: 'All Cycles & Spares',
    te: 'అన్ని సైకిళ్ళు & స్పేర్స్',
    hi: 'सभी साइकिलें और स्पेयर',
  },
  'cat.road_bikes': {
    en: 'Road & Racing Cycles',
    te: 'రోడ్ & రేసింగ్ సైకిళ్ళు',
    hi: 'रोड और रेसिंग साइकिलें',
  },
  'cat.mountain_bikes': {
    en: 'Mountain Cycles (MTB)',
    te: 'మౌంటెన్ సైకిళ్ళు (MTB)',
    hi: 'माउंटेन साइकिल (MTB)',
  },
  'cat.ladies_bicycles': {
    en: 'Ladies Cycles',
    te: 'లేడీస్ సైకిళ్ళు',
    hi: 'लेडीज साइकिलें',
  },
  'cat.junior_bikes': {
    en: 'Junior Cycles',
    te: 'జూనియర్ సైకిళ్ళు',
    hi: 'जूनियर साइकिलें',
  },
  'cat.kids_bikes': {
    en: 'Kids Cycles',
    te: 'పిల్లల సైకిళ్ళు',
    hi: 'बच्चों की साइकिलें',
  },
  'cat.disc_brake_cycles': {
    en: 'Disc Brake Cycles',
    te: 'డిస్క్ బ్రేక్ సైకిళ్ళు',
    hi: 'डिस्क ब्रेक साइकिलें',
  },
  'cat.standard_cycles': {
    en: 'Standard Cycles',
    te: 'స్టాండర్డ్ సైకిళ్ళు',
    hi: 'स्टैंडर्ड साइकिलें',
  },
  'cat.accessories': {
    en: 'All Spare Items Available',
    te: 'అన్ని స్పేర్ పార్ట్స్ లభ్యం',
    hi: 'सभी स्पेयर पार्ट्स उपलब्ध',
  },

  // Featured Products Section
  'featured.badge': {
    en: 'Performance Fleet',
    te: 'పెర్ఫార్మెన్స్ ఫ్లీట్',
    hi: 'परफॉर्मेंस फ्लीट',
  },
  'featured.title': {
    en: 'Featured Bicycles & Gear',
    te: 'ప్రత్యేక సైకిళ్ళు & ఉపకరణాలు',
    hi: 'प्रमुख साइकिलें और गियर',
  },
  'featured.subtitle': {
    en: 'Handpicked for high endurance, precision handling, and speed',
    te: 'ఎక్కువ మన్నిక, ఖచ్చితమైన నియంత్రణ మరియు వేగం కోసం ప్రత్యేకంగా ఎంపిక చేయబడింది',
    hi: 'उच्च सहनशक्ति, सटीक नियंत्रण और गति के लिए विशेष रूप से चयनित',
  },
  'featured.view_all_btn': {
    en: 'View All Featured Cycles',
    te: 'అన్ని ప్రత్యేక సైకిళ్లను చూడండి',
    hi: 'सभी प्रमुख साइकिलें देखें',
  },
  'featured.explore_models': {
    en: 'Explore Models',
    te: 'మోడల్స్ చూడండి',
    hi: 'मॉडल देखें',
  },

  // Why Choose Us Section
  'why.badge': {
    en: 'The Sri Rama Advantage',
    te: 'శ్రీ రామ ప్రత్యేకత',
    hi: 'श्री रामा का भरोसा',
  },
  'why.title': {
    en: 'Why Cyclists Choose Sri Rama Cycles',
    te: 'రైడర్స్ శ్రీ రామ సైకిల్స్‌ను ఎందుకు ఎంచుకుంటారు',
    hi: 'साइकिल चालक श्री रामा साइकिल्स क्यों चुनते हैं',
  },
  'why.subtitle': {
    en: 'Engineered for longevity, safety, and ultimate riding comfort on city roads and wild trails.',
    te: 'నగర రోడ్లు మరియు కఠినమైన మార్గాలలో దీర్ఘకాల మన్నిక, భద్రత మరియు అద్భుతమైన ప్రయాణ సౌకర్యం.',
    hi: 'शहर की सड़कों और कठिन रास्तों पर दीर्घायु, सुरक्षा और बेहतरीन सवारी के लिए तैयार।',
  },
  'why.f1_title': {
    en: '1 Year Store Frame Warranty',
    te: '1 సంవత్సరం స్టోర్ ఫ్రేమ్ వారంటీ',
    hi: '1 वर्ष की स्टोर फ्रेम वारंटी',
  },
  'why.f1_desc': {
    en: 'We stand behind every frame, carbon weave, and alloy structure with official 1-year store warranty coverage in Kazipet.',
    te: 'కాజీపేట్‌లో అధికారిక 1-సంవత్సరం స్టోర్ వారంటీతో ప్రతి ఫ్రేమ్ మరియు అల్లాయ్ నిర్మాణానికి పూర్తి రక్షణ.',
    hi: 'काजीपेट में आधिकारिक 1-वर्षीय स्टोर वारंटी के साथ हर फ्रेम और अलॉय संरचना पर पूर्ण सुरक्षा।',
  },
  'why.f2_title': {
    en: '95% Assembled & Ready',
    te: '95% అసెంబుల్డ్ & రెడీ',
    hi: '95% असेम्बल्ड और तैयार',
  },
  'why.f2_desc': {
    en: 'Every cycle arrives 95% pre-assembled in heavy-duty impact boxes with complimentary high-grade hex multitool.',
    te: 'ప్రతి సైకిల్ 95% ముందుగానే అమర్చబడి, ఉచిత హెగ్స్ మల్టీటూల్‌తో సురక్షితమైన బాక్స్‌లలో అందుతుంది.',
    hi: 'हर साइकिल 95% प्री-असेम्बल्ड होकर फ्री हेक्स टूलकिट के साथ सुरक्षित बॉक्स में पहुंचती है।',
  },
  'why.f3_title': {
    en: 'Doorstep Delivery Available',
    te: 'డోర్‌స్టెప్ డెలివరీ అందుబాటులో ఉంది',
    hi: 'डोरस्टेप डिलीवरी उपलब्ध',
  },
  'why.f3_desc': {
    en: 'Swift and safe insured transport straight to your doorstep. Delivery charges applicable based on your pincode.',
    te: 'మీ పిన్‌కోడ్ ఆధారంగా నిర్ణయించిన నామమాత్రపు ఛార్జీలతో మీ ఇంటి వద్దకే సురక్షితమైన డెలివరీ.',
    hi: 'आपके पिनकोड के अनुसार नाममात्र शुल्क पर सीधे आपके घर तक सुरक्षित और त्वरित डिलीवरी।',
  },
  'why.f4_title': {
    en: '100% Genuine Components',
    te: '100% అసలైన విడిభాగాలు',
    hi: '100% असली पार्ट्स',
  },
  'why.f4_desc': {
    en: 'Factory authentic Shimano, SRAM, RockShox, Tektro, and Kenda parts sourced directly from authorized distributors.',
    te: 'అధికారిక పంపిణీదారుల నుండి నేరుగా సేకరించిన అసలైన షిమనో, రాక్‌షాక్స్ మరియు కెండా విడిభాగాలు.',
    hi: 'अधिकृत वितरकों से सीधे प्राप्त ओरिजिनल शिमानो, रॉकशॉक्स, टेक्ट्रो और केंडा पार्ट्स।',
  },
  'why.f5_title': {
    en: 'Flexible & Secure Payment',
    te: 'సురక్షితమైన & సులభమైన చెల్లింపు',
    hi: 'सुरक्षित और आसान भुगतान',
  },
  'why.f5_desc': {
    en: 'Multiple payment avenues: PhonePe, GPay UPI QR, Credit/Debit cards, Net Banking, and Cash on Delivery.',
    te: 'ఫోన్‌పే, గూగుల్‌పే UPI, క్రెడిట్/డెబిట్ కార్డులు మరియు క్యాష్ ఆన్ డెలివరీ ద్వారా సులభంగా చెల్లించండి.',
    hi: 'PhonePe, GPay UPI QR, क्रेडिट/डेबिट कार्ड, नेट बैंकिंग और कैश ऑन डिलीवरी द्वारा आसान भुगतान।',
  },
  'why.f6_title': {
    en: 'Master Technician Support',
    te: 'నిపుణులైన మెకానిక్ సేవలు',
    hi: 'मास्टर तकनीशियन सहायता',
  },
  'why.f6_desc': {
    en: 'Dedicated cycling specialists ready to assist with sizing, gear tuning, and maintenance advice 7 days a week.',
    te: 'సైజు ఎంపిక, గేర్ ట్యూనింగ్ మరియు సర్వీసింగ్ సలహాల కోసం వారంలో 7 రోజులు నిపుణులు అందుబాటులో ఉంటారు.',
    hi: 'साइकिल साइजिंग, गियर ट्यूनिंग और मेंटेनेंस सलाह के लिए सप्ताह के सातों दिन विशेषज्ञ उपलब्ध।',
  },

  // Promo Banner Section
  'promo.special_offer': {
    en: 'Special Store Offer',
    te: 'ప్రత్యేక స్టోర్ ఆఫర్',
    hi: 'विशेष स्टोर ऑफर',
  },
  'promo.get_discount': {
    en: 'Get Up To',
    te: 'వరకు పొందండి',
    hi: 'तक पाएं',
  },
  'promo.selected_cycles': {
    en: 'on Selected Cycles',
    te: 'ఎంపిక చేసిన సైకిళ్లపై',
    hi: 'चयनित साइकिलों पर',
  },
  'promo.default_desc': {
    en: 'Upgrade your ride today. Use promo code',
    te: 'ఈరోజే మీ ప్రయాణాన్ని అప్‌గ్రేడ్ చేసుకోండి. ప్రోమో కోడ్ ఉపయోగించండి',
    hi: 'आज ही अपनी राइड अपग्रेड करें। प्रोमो कोड का उपयोग करें',
  },
  'promo.checkout_instant': {
    en: 'at checkout for instant savings.',
    te: 'చెక్‌అవుట్ వద్ద తక్షణ తగ్గింపు పొందండి.',
    hi: 'चेकआउट पर तुरंत बचत पाएं।',
  },
  'promo.shop_code_btn': {
    en: 'Shop Now & Apply Code',
    te: 'ఇప్పుడే షాపింగ్ చేసి కోడ్ వర్తింపజేయండి',
    hi: 'अभी खरीदें और कोड लगाएं',
  },

  // Newsletter Section
  'news.community': {
    en: 'The Srirama Cycling Community',
    te: 'శ్రీ రామ సైక్లింగ్ కమ్యూనిటీ',
    hi: 'श्री रामा साइकिलिंग कम्युनिटी',
  },
  'news.title': {
    en: 'Get 10% Off Your First Ride & Exclusive Community Perks',
    te: 'మీ మొదటి ఆర్డర్‌పై 10% తగ్గింపు మరియు ప్రత్యేక ప్రయోజనాలు పొందండి',
    hi: 'अपनी पहली राइड पर 10% छूट और विशेष कम्युनिटी लाभ पाएं',
  },
  'news.desc': {
    en: 'Subscribe for early bird access to new cycle drops, maintenance tips, and cycling route guides.',
    te: 'కొత్త సైకిల్ మోడల్స్, నిర్వహణ చిట్కాలు మరియు సైక్లింగ్ మార్గదర్శకాల సమాచారం కోసం సభ్యత్వాన్ని పొందండి.',
    hi: 'नए साइकिल लॉन्च, रखरखाव टिप्स और राइड गाइड की पहली जानकारी के लिए सब्सक्राइब करें।',
  },
  'news.placeholder': {
    en: 'Enter your email address...',
    te: 'మీ ఇమెయిల్ చిరునామాను నమోదు చేయండి...',
    hi: 'अपना ईमेल पता दर्ज करें...',
  },
  'news.subscribe_btn': {
    en: 'Subscribe',
    te: 'సబ్‌స్క్రయిబ్',
    hi: 'सब्सक्राइब करें',
  },
  'news.success': {
    en: 'Thank you for subscribing! Your discount coupon is RIDE10.',
    te: 'సబ్‌స్క్రయిబ్ చేసినందుకు ధన్యవాదాలు! మీ డిస్కౌంట్ కూపన్ RIDE10.',
    hi: 'सब्सक्राइब करने के लिए धन्यवाद! आपका डिस्काउंट कूपन RIDE10 है।',
  },

  // Customer Reviews
  'reviews.badge': {
    en: 'Rider Testimonials',
    te: 'రైడర్స్ అభిప్రాయాలు',
    hi: 'साइकिल चालकों की समीक्षाएं',
  },
  'reviews.title': {
    en: 'Loved by Thousands of Cyclists in Telangana',
    te: 'తెలంగాణలోని వేలాది మంది సైక్లిస్టుల ఆదరణ',
    hi: 'तेलंगाना के हजारों साइकिल चालकों का पसंदीदा',
  },
  'reviews.subtitle': {
    en: 'Real stories from everyday commuters, weekend trail-blazers, and fitness enthusiasts in Kazipet & Hanumakonda.',
    te: 'కాజీపేట్ & హనుమకొండలోని సాధారణ ప్రయాణికులు మరియు ఫిట్‌నెస్ ప్రేమికుల నిజమైన అనుభవాలు.',
    hi: 'काजीपेट और हनुमकोंडा के दैनिक यात्रियों और फिटनेस प्रेमियों के वास्तविक अनुभव।',
  },

  // Store & Footer sections
  'footer.cycle_categories': {
    en: 'Cycle Categories',
    te: 'సైకిల్ విభాగాలు',
    hi: 'साइकिल श्रेणियां',
  },
  'footer.customer_care': {
    en: 'Customer Care',
    te: 'కస్టమర్ కేర్',
    hi: 'ग्राहक सेवा',
  },
  'footer.store_contact': {
    en: 'Store Contact & Timings',
    te: 'స్టోర్ సంప్రదింపు & సమయాలు',
    hi: 'स्टोर संपर्क और समय',
  },
  'footer.about_desc': {
    en: "Hanumakonda's leading showroom for premium bicycles, road cycles, MTBs, standard & geared cycles, genuine auto spares, and precision tuning.",
    te: 'హనుమకొండలోని ప్రముఖ సైకిల్ షోరూమ్ - ప్రీమియం సైకిళ్ళు, రోడ్ సైకిళ్ళు, MTBs, గేర్ సైకిళ్ళు, ఒరిజినల్ ఆటో స్పేర్స్ మరియు సర్వీసింగ్.',
    hi: 'हनुमकोंडा का प्रमुख शोरूम - प्रीमियम साइकिलें, रोड साइकिलें, MTBs, गियर वाली साइकिलें, असली ऑटो पार्ट्स और सर्विसिंग।',
  },
  'footer.timings_weekday': {
    en: 'Mon – Sat: 9:00 AM – 8:30 PM',
    te: 'సోమ – శని: 9:00 AM – 8:30 PM',
    hi: 'सोम – शनि: सुबह 9:00 – रात 8:30',
  },
  'footer.timings_sunday': {
    en: 'Sunday: 9:00 AM – 1:00 PM only',
    te: 'ఆదివారం: 9:00 AM – 1:00 PM మాత్రమే',
    hi: 'रविवार: सुबह 9:00 – दोपहर 1:00 केवल',
  },
  'footer.rights_reserved': {
    en: 'All rights reserved.',
    te: 'సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.',
    hi: 'सर्वाधिकार सुरक्षित।',
  },
  'footer.developed_by': {
    en: 'Developed by',
    te: 'రూపొందించినది',
    hi: 'द्वारा विकसित',
  },

  // Buttons & Common Actions
  'btn.add_to_cart': {
    en: 'Add to Cart',
    te: 'కార్ట్‌కు జోడించు',
    hi: 'कार्ट में जोड़ें',
  },
  'btn.buy_now': {
    en: 'Buy Now',
    te: 'ఇప్పుడే కొనండి',
    hi: 'अभी खरीदें',
  },
  'btn.view_details': {
    en: 'View Details',
    te: 'వివరాలు చూడండి',
    hi: 'विवरण देखें',
  },
  'btn.shop_now': {
    en: 'Shop Now',
    te: 'ఇప్పుడే షాపింగ్ చేయండి',
    hi: 'अभी खरीदें',
  },
  'btn.explore_more': {
    en: 'Explore More',
    te: 'మరిన్ని చూడండి',
    hi: 'और देखें',
  },
  'btn.view_all': {
    en: 'View All',
    te: 'అన్నీ చూడండి',
    hi: 'सभी देखें',
  },
  'btn.checkout': {
    en: 'Proceed to Checkout',
    te: 'చెక్‌అవుట్‌కు వెళ్ళండి',
    hi: 'चेकआउट करें',
  },
  'btn.continue_shopping': {
    en: 'Continue Shopping',
    te: 'షాపింగ్ కొనసాగించండి',
    hi: 'खरीदारी जारी रखें',
  },
  'btn.track_order': {
    en: 'Track Order',
    te: 'ట్రాక్ చేయండి',
    hi: 'ट्रैक करें',
  },
  'btn.apply': {
    en: 'Apply',
    te: 'వర్తింపజేయి',
    hi: 'लागू करें',
  },

  // Product Details & Status
  'product.in_stock': {
    en: 'In Stock',
    te: 'స్టాక్‌లో ఉంది',
    hi: 'स्टॉक में उपलब्ध',
  },
  'product.out_of_stock': {
    en: 'Out of Stock',
    te: 'స్టాక్ అయిపోయింది',
    hi: 'आउट ऑफ स्टॉक',
  },
  'product.price': {
    en: 'Price',
    te: 'ధర',
    hi: 'कीमत',
  },
  'product.rating': {
    en: 'Rating',
    te: 'రేటింగ్',
    hi: 'रेटिंग',
  },
  'product.reviews': {
    en: 'Reviews',
    te: 'రివ్యూలు',
    hi: 'समीक्षाएं',
  },
  'product.specifications': {
    en: 'Specifications',
    te: 'స్పెసిఫికేషన్లు',
    hi: 'विशिष्टताएं',
  },
  'product.features': {
    en: 'Key Features',
    te: 'ప్రధాన ఫీచర్లు',
    hi: 'मुख्य विशेषताएं',
  },
  'product.description': {
    en: 'Description',
    te: 'వివరణ',
    hi: 'विवरण',
  },

  // About Page Translations
  'about.serving_since': {
    en: 'Serving Hanumakonda & Telangana Since 1976',
    te: '1976 నుండి హనుమకొండ & తెలంగాణ ప్రజలకు సేవలో',
    hi: '1976 से हनुमकोंडा और तेलंगाना की सेवा में',
  },
  'about.proprietor_label': {
    en: 'Proprietor:',
    te: 'యజమాని:',
    hi: 'स्वामी (प्रोपराइटर):',
  },
  'about.hero_subtitle': {
    en: "Kazipet's premier landmark store for high-performance bicycles, mountain MTBs, classic roadsters, and genuine auto spare parts.",
    te: 'హై-పెర్ఫార్మెన్స్ రోడ్ సైకిళ్ళు, మౌంటెన్ MTBs, క్లాసిక్ సైకిళ్ళు మరియు అసలైన ఆటో స్పేర్ పార్ట్స్ కోసం కాజీపేట్ ప్రముఖ ల్యాండ్‌మార్క్ షోరూమ్.',
    hi: 'हाई-परफॉर्मेंस साइकिलें, माउंटेन MTBs, क्लासिक साइकिलें और असली ऑटो पार्ट्स के लिए काजीपेट का प्रमुख लैंडमार्क शोरूम।',
  },
  'about.50_years': {
    en: '50 Years of Excellence',
    te: '50 సంవత్సరాల విశిష్ట సేవలు',
    hi: '50 वर्षों की उत्कृष्टता',
  },
  'about.trusted_quality_title': {
    en: 'Trusted Quality & Genuine Spares',
    te: 'విశ్వసనీయ నాణ్యత & అసలైన విడిభాగాలు',
    hi: 'विश्वसनीय गुणवत्ता और असली स्पेयर पार्ट्स',
  },
  'about.trusted_quality_p1': {
    en: 'Located in Kazipet, Sri Rama Cycle & Auto Spare Parts has been the backbone of reliable transportation in Hanumakonda for nearly five decades.',
    te: 'కాజీపేట్‌లో ఉన్న శ్రీ రామ సైకిల్ & ఆటో స్పేర్ పార్ట్స్ దాదాపు ఐదు దశాబ్దాలుగా హనుమకొండలో నమ్మకమైన ప్రయాణానికి వెన్నెముకగా నిలిచింది.',
    hi: 'काजीपेट में स्थित, श्री रामा साइकिल एंड ऑटो स्पेयर पार्ट्स लगभग पांच दशकों से हनुमकोंडा में विश्वसनीय यात्रा का मुख्य आधार रहा है।',
  },
  'about.trusted_quality_p2': {
    en: 'We offer a curated lineup of premium carbon road racers, durable mountain MTBs, ladies cycles, and factory-authentic auto spare parts.',
    te: 'మేము ప్రీమియం కార్బన్ రోడ్ సైకిళ్ళు, మన్నికైన మౌంటెన్ MTBs, లేడీస్ సైకిళ్ళు మరియు ఫ్యాక్టరీ-ఒరిజినల్ ఆటో స్పేర్ పార్ట్స్‌ను అందిస్తున్నాము.',
    hi: 'हम प्रीमियम कार्बन रोड रेसर्स, मजबूत माउंटेन MTBs, लेडीज साइकिलें और फैक्ट्री-असली ऑटो स्पेयर पार्ट्स की विस्तृत श्रृंखला प्रदान करते हैं।',
  },
  'about.store_location': {
    en: 'Store Location',
    te: 'స్టోర్ స్థానం',
    hi: 'स्टोर का पता',
  },
  'about.direct_phone': {
    en: 'Direct Store Phone',
    te: 'స్టోర్ ఫోన్ నంబర్',
    hi: 'सीधा स्टोर फोन',
  },
  'about.stats_cyclists': {
    en: 'Satisfied Cyclists',
    te: 'సంతృప్తి చెందిన సైక్లిస్టులు',
    hi: 'संतुष्ट साइकिल चालक',
  },
  'about.stats_spares': {
    en: 'Genuine Spare Parts',
    te: 'అసలైన విడిభాగాలు',
    hi: 'असली स्पेयर पार्ट्स',
  },
  'about.stats_warranty': {
    en: 'Frame Warranty',
    te: 'ఫ్రేమ్ వారంటీ',
    hi: 'फ्रेम वारंटी',
  },
  'about.stats_year': {
    en: 'Established Year',
    te: 'స్థాపించిన సంవత్సరం',
    hi: 'स्थापना वर्ष',
  },
  'about.generational_trust_badge': {
    en: '50 Years of Excellence & Generational Trust',
    te: '50 సంవత్సరాల అనుబంధం & తరతరాల విశ్వసనీయత',
    hi: '50 वर्षों की उत्कृष्टता और पीढ़ियों का विश्वास',
  },
  'about.generational_heading_1': {
    en: 'Cycles Built to Last Decades.',
    te: 'దశాబ్దాల పాటు మన్నే సైకిళ్ళు.',
    hi: 'दशकों तक चलने वाली साइकिलें।',
  },
  'about.generational_heading_2': {
    en: 'Trust That Spans Generations.',
    te: 'తరతరాలుగా కొనసాగే విశ్వాసం.',
    hi: 'पीढ़ियों का अटूट विश्वास।',
  },
  'about.story_p1': {
    en: 'Since 1976, Sri Rama Cycle & Auto Spare Parts has been anchored on an uncompromising standard: delivering genuine build quality, honest advice, and bicycles engineered to outlast generations. Every cycle assembled in our Kazipet workshop receives rigorous technical checks, ensuring lifelong safety, performance, and riding comfort.',
    te: '1976 నుండి, శ్రీ రామ సైకిల్ & ఆటో స్పేర్ పార్ట్స్ అసలైన నాణ్యత, నిజాయితీతో కూడిన సలహాలు మరియు తరతరాలుగా మన్నే సైకిళ్లను అందించడంలో రాజీలేని ప్రమాణాలను పాటిస్తోంది. మా కాజీపేట్ వర్క్‌షాప్‌లో అసెంబుల్ చేయబడిన ప్రతి సైకిల్ ఖచ్చితమైన సాంకేతిక తనిఖీలను పొందుతుంది.',
    hi: '1976 से, श्री रामा साइकिल एंड ऑटो स्पेयर पार्ट्स असली गुणवत्ता, ईमानदार सलाह और पीढ़ियों तक चलने वाली साइकिलें प्रदान करने में अडिग रहा है। हमारी काजीपेट वर्कशॉप में तैयार हर साइकिल की गहन तकनीकी जांच होती है।',
  },
  'about.story_p2': {
    en: 'For five decades, countless families across Telangana have built their cycling memories with us. Parents who bought their first roadster cycle at our Station Road store in the 1970s and 1980s continue returning today with their children and grandchildren, knowing that our commitment to authentic parts and heartfelt service never wavers.',
    te: 'ఐదు దశాబ్దాలుగా, తెలంగాణ అంతటా అసంఖ్యాక కుటుంబాలు మాతో తమ సైక్లింగ్ జ్ఞాపకాలను నిర్మించుకున్నాయి. 1970లు మరియు 1980లలో మా స్టేషన్ రోడ్ స్టోర్‌లో మొదటి సైకిల్ కొన్న తల్లిదండ్రులు నేడు తమ పిల్లలు మరియు మనవళ్లతో మళ్లీ మా వద్దకే వస్తున్నారు.',
    hi: 'पाँच दशकों से, तेलंगाना भर के अनगिनत परिवारों ने हमारे साथ अपनी साइकिलिंग यादें बनाई हैं। 1970 और 1980 के दशक में हमारे स्टेशन रोड स्टोर से अपनी पहली साइकिल खरीदने वाले माता-पिता आज अपने बच्चों और पोते-पोतियों के साथ लौटते हैं।',
  },
  'about.story_p3': {
    en: 'A tangible testament to this enduring excellence was recently celebrated when a customer who originally received a cycle under our scheme in 1980 returned in 2026 — traveling 140+ km all the way from Hyderabad to purchase his family\'s next bicycle. He brought his preserved 46-year-old receipt alongside his new invoice — one authentic proof of the thousands of generational bonds forged at Sri Rama Cycles.',
    te: 'ఈ శాశ్వతమైన విశ్వసనీయతకు ప్రత్యక్ష నిదర్శనం ఏమిటంటే, 1980లో మా స్కీమ్ కింద సైకిల్ కొనుగోలు చేసిన ఒక గౌరవనీయ కస్టమర్, 2026లో తన కుటుంబం కోసం తదుపరి సైకిల్ కొనడానికి హైదరాబాద్ నుండి 140+ కి.మీ ప్రయాణించి వచ్చారు. ఆయన తన 46 సంవత్సరాల నాటి ఒరిజినల్ రసీదును భద్రపరిచి తీసుకువచ్చారు.',
    hi: 'इस अटूट विश्वास का जीवंत प्रमाण हाल ही में देखने को मिला जब 1980 में हमारी स्कीम के तहत साइकिल लेने वाले एक ग्राहक 2026 में अपने परिवार की अगली साइकिल खरीदने के लिए हैदराबाद से 140+ किमी की यात्रा करके पहुंचे। उन्होंने अपनी 46 साल पुरानी रसीद सहेज कर रखी थी।',
  },
  'about.quote_text': {
    en: 'A bicycle is more than transport — it is a milestone in every family\'s life. When customers who rode our cycles in the 1980s bring their grandchildren back to our store decades later, it is the ultimate affirmation of our honesty, craftsmanship, and service.',
    te: 'సైకిల్ అనేది కేవలం రవాణా మాత్రమే కాదు - ఇది ప్రతి కుటుంబ జీవితంలో ఒక మైలురాయి. 1980లలో మా సైకిళ్లను తొక్కిన కస్టమర్లు దశాబ్దాల తర్వాత తమ మనవళ్లను మా స్టోర్‌కు తీసుకువచ్చినప్పుడు, అది మా నిజాయితీకి మరియు సేవకు దక్కిన అతిపెద్ద పురస్కారం.',
    hi: 'साइकिल केवल परिवहन का साधन नहीं है - यह हर परिवार के जीवन का एक मील का पत्थर है। जब 1980 के दशक में साइकिल चलाने वाले ग्राहक दशकों बाद अपने पोते-पोतियों को हमारे पास लाते हैं, तो यह हमारी ईमानदारी और सेवा का सबसे बड़ा प्रमाण है।',
  },
  'about.quote_author': {
    en: 'The Sri Rama Cycles Legacy',
    te: 'శ్రీ రామ సైకిల్స్ ఘన వారసత్వం',
    hi: 'श्री रामा साइकिल्स की गौरवशाली विरासत',
  },
  'about.quote_badge': {
    en: 'Serving Cyclists with Honesty Since 1976',
    te: '1976 నుండి నిజాయితీతో కూడిన సేవలు',
    hi: '1976 से ईमानदारी के साथ सेवारत',
  },
  'about.pillar1': {
    en: '46+ Yrs Family Loyalty',
    te: '46+ సం. కుటుంబ విశ్వాసం',
    hi: '46+ वर्षों की पारिवारिक निष्ठा',
  },
  'about.pillar2': {
    en: '100% Genuine Spares',
    te: '100% అసలైన విడిభాగాలు',
    hi: '100% असली स्पेयर पार्ट्स',
  },
  'about.pillar3': {
    en: 'Archival Customer Proof',
    te: 'చారిత్రక కస్టమర్ రికార్డులు',
    hi: 'ऐतिहासिक ग्राहक प्रमाण',
  },
  'about.archival_badge': {
    en: 'Archival Living Proof • 1980 vs. 2026',
    te: 'సజీవ సాక్ష్యం • 1980 vs. 2026',
    hi: 'जीवंत प्रमाण • 1980 vs. 2026',
  },
  'about.archival_desc': {
    en: 'One preserved real-world story among thousands of families who remain loyal over 4+ decades.',
    te: '4 దశాబ్దాలకు పైగా మాతో కొనసాగుతున్న వేలాది నమ్మకమైన కుటుంబాల నిజమైన కథలలో ఒకటి.',
    hi: '4 से अधिक दशकों से जुड़े हजारों वफादार परिवारों की वास्तविक कहानियों में से एक।',
  },
  'about.bill_1980_title': {
    en: 'Preserved 1980 Scheme Receipt',
    te: 'భద్రపరిచిన 1980 స్కీమ్ రసీదు',
    hi: 'सुरक्षित 1980 स्कीम रसीद',
  },
  'about.bill_1980_sub': {
    en: 'First Cycle Purchased in 1980 • ₹425',
    te: '1980లో కొనుగోలు చేసిన మొదటి సైకిల్ • ₹425',
    hi: '1980 में खरीदी पहली साइकिल • ₹425',
  },
  'about.bill_2026_title': {
    en: 'Returned Decades Later in 2026',
    te: '2026లో తిరిగి వచ్చిన కస్టమర్',
    hi: 'दशकों बाद 2026 में वापसी',
  },
  'about.bill_2026_sub': {
    en: 'Traveled from Hyderabad • ₹3,200',
    te: 'హైదరాబాద్ నుండి వచ్చి కొనుగోలు • ₹3,200',
    hi: 'हैदराबाद से आकर खरीदारी • ₹3,200',
  },
  'about.inspect_bills_btn': {
    en: 'Inspect Archival Proof of Loyalty (1980 vs. 2026)',
    te: 'చారిత్రక రసీదుల ఆధారాలను చూడండి (1980 vs. 2026)',
    hi: 'निष्ठा का ऐतिहासिक प्रमाण देखें (1980 vs. 2026)',
  },
  'about.timeline_badge': {
    en: 'Milestones of Excellence',
    te: 'విజయాల ప్రయాణం',
    hi: 'सफलता के मील के पत्थर',
  },
  'about.timeline_title': {
    en: 'Five Decades of Pedaling Progress',
    te: 'ఐదు దశాబ్దాల సైక్లింగ్ ప్రస్థానం',
    hi: 'पाँच दशकों का प्रगतिशील सफर',
  },
  'about.m1976_title': {
    en: 'Store Inception in Kazipet',
    te: 'కాజీపేట్‌లో స్టోర్ ప్రారంభం',
    hi: 'काजीपेट में स्टोर की शुरुआत',
  },
  'about.m1976_desc': {
    en: 'Established by the Ravula family in Kazipet, Hanumakonda, bringing reliable bicycles & genuine spare parts to local commuters.',
    te: 'రావుల కుటుంబం ద్వారా కాజీపేట్, హనుమకొండలో స్థాపించబడింది; స్థానిక ప్రయాణికులకు నమ్మకమైన సైకిళ్ళు మరియు అసలైన విడిభాగాలను అందించింది.',
    hi: 'रावुला परिवार द्वारा काजीपेट, हनुमकोंडा में स्थापित; स्थानीय यात्रियों के लिए विश्वसनीय साइकिलें और असली स्पेयर पार्ट्स उपलब्ध कराए।',
  },
  'about.m1980_title': {
    en: 'Era of Unbroken Generational Trust',
    te: 'తరతరాల విశ్వసనీయత యుగం',
    hi: 'अटूट पीढ़ीगत विश्वास का दौर',
  },
  'about.m1980_desc': {
    en: 'Equipping local families with lifelong fitted cycles through the historic Sri Rama Scheme—proven by loyal customers who preserve their original 1980 bills to this day.',
    te: 'చారిత్రక శ్రీ రామ స్కీమ్ ద్వారా స్థానిక కుటుంబాలకు జీవితకాల మన్నే సైకిళ్లను అందించడం - నేటికీ 1980 రసీదులను భద్రపరుచుకున్న కస్టమర్లే ఇందుకు నిదర్శనం.',
    hi: 'ऐतिहासिक श्री रामा स्कीम के माध्यम से स्थानीय परिवारों को आजीवन साइकिलें प्रदान की गईं - आज भी 1980 की रसीदें सहेजे ग्राहक इसका प्रमाण हैं।',
  },
  'about.m2015_title': {
    en: 'Performance & Multi-Speed Cycles',
    te: 'పెర్ఫార్మెన్స్ & మల్టీ-స్పీడ్ సైకిళ్ళు',
    hi: 'परफॉर्मेंस और मल्टी-स्पीड साइकिलें',
  },
  'about.m2015_desc': {
    en: 'Introduced precision road racers, hydraulic mountain cycles, and multi-speed geared bicycles.',
    te: 'రోడ్ రేసర్లు, హైడ్రాలిక్ మౌంటెన్ సైకిళ్ళు మరియు మల్టీ-స్పీడ్ గేర్ సైకిళ్లను ప్రవేశపెట్టడం.',
    hi: 'सटीक रोड रेसर्स, हाइड्रोलिक माउंटेन साइकिलें और मल्टी-स्पीड गियर साइकिलों की शुरुआत।',
  },
  'about.m2026_title': {
    en: 'Digital E-Commerce & Doorstep Delivery',
    te: 'డిజిటల్ ఇ-కామర్స్ & డోర్‌స్టెప్ డెలివరీ',
    hi: 'डिजिटल ई-कॉमर्स और डोरस्टेप डिलीवरी',
  },
  'about.m2026_desc': {
    en: 'Launched direct online booking and doorstep delivery with 95% pre-assembly and 1-Year Frame Warranty.',
    te: '95% ప్రీ-అసెంబ్లింగ్ మరియు 1-సంవత్సరం ఫ్రేమ్ వారంటీతో ఆన్‌లైన్ బుకింగ్ మరియు డోర్‌స్టెప్ డెలివరీ ప్రారంభం.',
    hi: '95% प्री-असेम्बल्ड और 1-वर्षीय फ्रेम वारंटी के साथ ऑनलाइन बुकिंग और डोरस्टेप डिलीवरी की शुरुआत।',
  },
  'about.values_badge': {
    en: 'Our Core Commitments',
    te: 'మా ప్రాథమిక విలువలు',
    hi: 'हमारी मुख्य प्रतिबद्धताएं',
  },
  'about.values_title': {
    en: 'The Pillars of Sri Rama Excellence',
    te: 'శ్రీ రామ విశిష్టతకు మూలస్తంభాలు',
    hi: 'श्री रामा उत्कृष्टता के आधारस्तंभ',
  },
  'about.v1_title': {
    en: '100% Factory Authentic',
    te: '100% ఫ్యాక్టరీ ఒరిజినల్',
    hi: '100% फैक्ट्री ओरिजिनल',
  },
  'about.v1_desc': {
    en: 'Direct sourcing from certified makers including Shimano, SRAM, RockShox, Tektro, and Kenda with zero counterfeit parts.',
    te: 'షిమనో, SRAM, రాక్‌షాక్స్, టెక్ట్రో, కెండాలతో సహా సర్టిఫైడ్ తయారీదారుల నుండి నేరుగా సేకరించిన నకిలీ లేని అసలైన భాగాలు.',
    hi: 'शिमानो, SRAM, रॉकशॉक्स, टेक्ट्रो और केंडा सहित प्रमाणित निर्माताओं से सीधे प्राप्त शून्य-नकली असली पार्ट्स।',
  },
  'about.v2_title': {
    en: 'Master Technician Tuning',
    te: 'నిపుణులైన మెకానిక్ ట్యూనింగ్',
    hi: 'मास्टर तकनीशियन ट्यूनिंग',
  },
  'about.v2_desc': {
    en: 'On-site certified mechanics for precision derailleur tuning, hydraulic line bleeding, wheel truing, and custom cycle builds.',
    te: 'గేర్ ట్యూనింగ్, హైడ్రాలిక్ బ్రేక్ సర్వీసింగ్, వీల్ ట్రూయింగ్ మరియు కస్టమ్ సైకిల్ బిల్డ్‌ల కోసం నిపుణులైన మెకానిక్స్.',
    hi: 'सटीक गियर ट्यूनिंग, हाइड्रोलिक लाइन ब्लीडिंग, व्हील ट्रूइंग और कस्टम साइकिल निर्माण के लिए ऑन-साइट प्रमाणित मैकेनिक।',
  },
  'about.v3_title': {
    en: 'Personalized Consultation',
    te: 'వ్యక్తిగత మార్గదర్శకత్వం',
    hi: 'व्यक्तिगत परामर्श',
  },
  'about.v3_desc': {
    en: 'Led by Ravula Rakesh Kumar, we provide transparent sizing recommendations and honest advice tailored to your budget.',
    te: 'రావుల రాకేష్ కుమార్ గారి నేతృత్వంలో మీ బడ్జెట్‌కు అనుగుణంగా స్పష్టమైన సైజు సిఫార్సులు మరియు నిజాయితీతో కూడిన సలహాలు.',
    hi: 'रावुला राकेश कुमार के नेतृत्व में आपके बजट के अनुकूल पारदर्शी साइजिंग सुझाव और ईमानदार सलाह।',
  },
  'about.cta_title': {
    en: 'Visit Our Kazipet Showroom Today',
    te: 'ఈరోజే మా కాజీపేట్ షోరూమ్‌ను సందర్శించండి',
    hi: 'आज ही हमारे काजीपेट शोरूम में पधारें',
  },
  'about.cta_desc': {
    en: 'Explore the collection in person, test ride your dream cycle, and experience personalized service from our bicycle specialists.',
    te: 'మా షోరూమ్‌లో సైకిళ్లను ప్రత్యక్షంగా చూడండి, టెస్ట్ రైడ్ చేయండి మరియు మా నిపుణుల నుండి వ్యక్తిగత సేవలను అనుభవించండి.',
    hi: 'शोरूम में साइकिलों को स्वयं देखें, टेस्ट राइड करें और हमारे साइकिल विशेषज्ञों से व्यक्तिगत सेवा प्राप्त करें।',
  },
  'about.cta_btn': {
    en: 'Explore Cycles Online',
    te: 'ఆన్‌లైన్‌లో సైకిళ్లను చూడండి',
    hi: 'ऑनलाइन साइकिलें देखें',
  },
  'about.cta_contact': {
    en: 'Contact Showroom',
    te: 'షోరూమ్‌ను సంప్రదించండి',
    hi: 'शोरूम से संपर्क करें',
  },

  // Contact Page Translations
  'contact.badge': {
    en: 'Get In Touch',
    te: 'సంప్రదించండి',
    hi: 'संपर्क करें',
  },
  'contact.title': {
    en: "We'd Love to Hear From You",
    te: 'మీతో మాట్లాడటానికి మేము సిద్ధంగా ఉన్నాము',
    hi: 'हम आपकी सहायता के लिए तैयार हैं',
  },
  'contact.subtitle': {
    en: 'Have a question about frame sizing, spare parts, order tracking, or wholesale supply? Our specialists in Kazipet are here to assist.',
    te: 'ఫ్రేమ్ సైజింగ్, విడిభాగాలు, ఆర్డర్ ట్రాకింగ్ లేదా హోల్‌సేల్ గురించి ఏవైనా సందేహాలు ఉన్నాయా? కాజీపేట్‌లోని మా నిపుణులు మీకు సహాయం చేయడానికి సిద్ధంగా ఉన్నారు.',
    hi: 'फ्रेम साइजिंग, स्पेयर पार्ट्स, ऑर्डर ट्रैकिंग या थोक आपूर्ति के बारे में कोई प्रश्न है? काजीपेट में हमारे विशेषज्ञ आपकी सहायता के लिए उपलब्ध हैं।',
  },
  'contact.form_title': {
    en: 'Send Us a Message',
    te: 'మాకు సందేశం పంపండి',
    hi: 'हमें संदेश भेजें',
  },
  'contact.name_label': {
    en: 'Your Name',
    te: 'మీ పూర్తి పేరు',
    hi: 'आपका नाम',
  },
  'contact.email_label': {
    en: 'Email Address',
    te: 'ఇమెయిల్ చిరునామా',
    hi: 'ईमेल पता',
  },
  'contact.phone_label': {
    en: 'Phone Number',
    te: 'ఫోన్ నంబర్',
    hi: 'फोन नंबर',
  },
  'contact.subject_label': {
    en: 'Subject / Enquiry Type',
    te: 'విషయం / విచారణ రకం',
    hi: 'विषय / पूछताछ प्रकार',
  },
  'contact.message_label': {
    en: 'Your Message',
    te: 'మీ సందేశం',
    hi: 'आपका संदेश',
  },
  'contact.send_btn': {
    en: 'Send Message',
    te: 'సందేశం పంపండి',
    hi: 'संदेश भेजें',
  },
  'contact.sending_btn': {
    en: 'Sending...',
    te: 'పంపుతోంది...',
    hi: 'भेजा जा रहा है...',
  },
  'contact.success_title': {
    en: 'Message Sent Successfully!',
    te: 'సందేశం విజయవంతంగా పంపబడింది!',
    hi: 'संदेश सफलतापूर्वक भेजा गया!',
  },
  'contact.success_desc': {
    en: 'Thank you for reaching out. Our team in Kazipet will contact you shortly.',
    te: 'మమ్మల్ని సంప్రదించినందుకు ధన్యవాదాలు. కాజీపేట్‌లోని మా బృందం త్వరలోనే మిమ్మల్ని సంప్రదిస్తుంది.',
    hi: 'हमसे संपर्क करने के लिए धन्यवाद। काजीपेट की हमारी टीम जल्द ही आपसे संपर्क करेगी।',
  },
  'contact.send_another': {
    en: 'Send Another Message',
    te: 'మరొక సందేశం పంపండి',
    hi: 'दूसरा संदेश भेजें',
  },
  'contact.direct_info_title': {
    en: 'Store Contact Information',
    te: 'స్టోర్ సంప్రదింపు సమాచారం',
    hi: 'स्टोर संपर्क विवरण',
  },
  'contact.call_us': {
    en: 'Call Store Directly',
    te: 'స్టోర్‌కు నేరుగా కాల్ చేయండి',
    hi: 'स्टोर को सीधे कॉल करें',
  },
  'contact.email_us': {
    en: 'Email Support',
    te: 'ఇమెయిల్ మద్దతు',
    hi: 'ईमेल सपोर्ट',
  },
  'contact.hours_label': {
    en: 'Store Working Hours',
    te: 'స్టోర్ పనివేళలు',
    hi: 'स्टोर का कार्य समय',
  },
  'contact.whatsapp_btn': {
    en: 'Chat on WhatsApp',
    te: 'వాట్సాప్‌లో చాట్ చేయండి',
    hi: 'व्हाट्सएप पर चैट करें',
  },
  'contact.whatsapp_speed_reply': {
    en: 'Want an Instant Reply? Connect on WhatsApp',
    te: 'తక్షణ సమాధానం కావాలా? వాట్సాప్‌లో సంప్రదించండి',
    hi: 'तुरंत उत्तर चाहते हैं? व्हाट्सएप पर संपर्क करें',
  },
  'contact.whatsapp_continue': {
    en: 'Send Copy via WhatsApp',
    te: 'వాట్సాప్ ద్వారా కాపీ పంపండి',
    hi: 'व्हाट्सएप पर कॉपी भेजें',
  },
  'contact.location_title': {
    en: 'Visit Our Landmark Store',
    te: 'మా ప్రముఖ స్టోర్‌ను సందర్శించండి',
    hi: 'हमारे प्रमुख शोरूम पर आएं',
  },
  'contact.maps_btn': {
    en: 'Open in Google Maps',
    te: 'గూగుల్ మ్యాప్స్‌లో తెరవండి',
    hi: 'गूगल मैप्स में खोलें',
  },

  // Track Order Translations
  'track.badge': {
    en: 'Live Logistics Tracker',
    te: 'లైవ్ ఆర్డర్ ట్రాకర్',
    hi: 'लाइव ऑर्डर ट्रैकर',
  },
  'track.title': {
    en: 'Track Your Bicycle Order',
    te: 'మీ సైకిల్ ఆర్డర్‌ను ట్రాక్ చేయండి',
    hi: 'अपना साइकिल ऑर्डर ट्रैक करें',
  },
  'track.subtitle': {
    en: 'Enter your Order ID and contact number to monitor precision assembly, packing, and courier transit.',
    te: 'అసెంబ్లింగ్, ప్యాకింగ్ మరియు కొరియర్ రవాణాను పర్యవేక్షించడానికి మీ ఆర్డర్ ఐడి మరియు మొబైల్ నంబర్‌ను నమోదు చేయండి.',
    hi: 'असेम्बलिंग, पैकिंग और कूरियर ट्रांजिट देखने के लिए अपनी ऑर्डर आईडी और संपर्क नंबर दर्ज करें।',
  },
  'track.order_id_label': {
    en: 'Order ID / Number',
    te: 'ఆర్డర్ ఐడి / నంబర్',
    hi: 'ऑर्डर आईडी / नंबर',
  },
  'track.contact_label': {
    en: 'Mobile Number / Email (Optional)',
    te: 'మొబైల్ నంబర్ / ఇమెయిల్ (ఐచ్ఛికం)',
    hi: 'मोबाइल नंबर / ईमेल (वैकल्पिक)',
  },
  'track.btn': {
    en: 'Track Order',
    te: 'ఆర్డర్ ట్రాక్ చేయండి',
    hi: 'ऑर्डर ट्रैक करें',
  },
  'track.tracking_btn': {
    en: 'Locating Order...',
    te: 'ఆర్డర్ వివరాలు వెతుకుతోంది...',
    hi: 'ऑर्डर खोजा जा रहा है...',
  },
  'track.steps_placed': {
    en: 'Order Placed',
    te: 'ఆర్డర్ చేయబడింది',
    hi: 'ऑर्डर प्राप्त हुआ',
  },
  'track.steps_placed_desc': {
    en: 'Order received and logged in system',
    te: 'ఆర్డర్ సిస్టమ్‌లో నమోదైంది',
    hi: 'ऑर्डर सिस्टम में दर्ज हुआ',
  },
  'track.steps_confirmed': {
    en: 'Order Confirmed',
    te: 'ఆర్డర్ నిర్ధారించబడింది',
    hi: 'ऑर्डर कन्फर्म हुआ',
  },
  'track.steps_confirmed_desc': {
    en: 'Order verified & payment validated',
    te: 'ఆర్డర్ మరియు చెల్లింపు నిర్ధారించబడ్డాయి',
    hi: 'ऑर्डर और भुगतान सत्यापित हुआ',
  },
  'track.steps_processing': {
    en: 'Precision Assembly',
    te: 'ఖచ్చితమైన అసెంబ్లింగ్',
    hi: 'विशेष असेम्बलिंग',
  },
  'track.steps_processing_desc': {
    en: 'Technician tuning and brake check',
    te: 'మెకానిక్ ట్యూనింగ్ మరియు బ్రేక్ టెస్టింగ్',
    hi: 'मैकेनिक ट्यूनिंग और ब्रेक टेस्टिंग',
  },
  'track.steps_packed': {
    en: 'Packed & Crated',
    te: 'ప్యాకింగ్ చేయబడింది',
    hi: 'पैक और सील किया गया',
  },
  'track.steps_packed_desc': {
    en: 'Impact-foam sealed in heavy carton',
    te: 'సురక్షితమైన బాక్స్‌లో ప్యాక్ చేయబడింది',
    hi: 'मजबूत बॉक्स में सुरक्षित पैक किया गया',
  },
  'track.steps_shipped': {
    en: 'Shipped',
    te: 'రవాణాలో ఉంది',
    hi: 'डिस्पैच किया गया',
  },
  'track.steps_shipped_desc': {
    en: 'Handed over to express courier carrier',
    te: 'కొరియర్ సర్వీస్‌కు అప్పగించబడింది',
    hi: 'एक्सप्रेस कूरियर को सौंपा गया',
  },
  'track.steps_out': {
    en: 'Out for Delivery',
    te: 'డెలివరీకి బయలుదేరింది',
    hi: 'डिलीवरी के लिए निकला',
  },
  'track.steps_out_desc': {
    en: 'Courier partner is arriving today',
    te: 'ఈరోజే మీ ఇంటి వద్దకు చేరుకుంటుంది',
    hi: 'कूरियर आज आपके पते पर पहुंचेगा',
  },
  'track.steps_delivered': {
    en: 'Delivered',
    te: 'డెలివరీ పూర్తయింది',
    hi: 'सफलतापूर्वक डिलीवर हुआ',
  },
  'track.steps_delivered_desc': {
    en: 'Delivered to your doorstep',
    te: 'మీ ఇంటి వద్దకు డెలివరీ చేయబడింది',
    hi: 'आपके पते पर डिलीवर हुआ',
  },
  'track.order_details': {
    en: 'Order Details',
    te: 'ఆర్డర్ వివరాలు',
    hi: 'ऑर्डर विवरण',
  },
  'track.delivery_address': {
    en: 'Delivery Address',
    te: 'డెలివరీ చిరునామా',
    hi: 'डिलीवरी का पता',
  },
  'track.payment_summary': {
    en: 'Payment Summary',
    te: 'చెల్లింపు సారాంశం',
    hi: 'भुगतान सारांश',
  },

  // Shop Page Translations
  'shop.title': {
    en: 'Explore Bicycles & Genuine Spares',
    te: 'సైకిళ్ళు & జెన్యూన్ విడిభాగాలు',
    hi: 'साइकिलें और असली स्पेयर पार्ट्स',
  },
  'shop.subtitle': {
    en: 'Discover high-performance MTBs, carbon racers, city hybrids, and authentic spare parts.',
    te: 'అధిక సామర్థ్యం గల MTBలు, కార్బన్ రేసర్లు, సిటీ హైబ్రిడ్‌లు మరియు విడిభాగాలను కనుగొనండి.',
    hi: 'उच्च प्रदर्शन वाले एमटीबी, कार्बन रेसर, हाइब्रिड और असली स्पेयर पार्ट्स खोजें।',
  },
  'shop.filters': {
    en: 'Filters',
    te: 'ఫిల్టర్లు',
    hi: 'फ़िल्टर',
  },
  'shop.reset_filters': {
    en: 'Reset All',
    te: 'అన్నీ రీసెట్ చేయండి',
    hi: 'सभी रीसेट करें',
  },
  'shop.categories': {
    en: 'Categories',
    te: 'కేటగిరీలు',
    hi: 'श्रेणियाँ',
  },
  'shop.all_categories': {
    en: 'All Categories',
    te: 'అన్ని కేటగిరీలు',
    hi: 'सभी श्रेणियाँ',
  },
  'shop.max_price': {
    en: 'Max Price',
    te: 'గరిష్ట ధర',
    hi: 'अधिकतम मूल्य',
  },
  'shop.brands': {
    en: 'Brands',
    te: 'బ్రాండ్లు',
    hi: 'ब्रांड्स',
  },
  'shop.all_brands': {
    en: 'All Brands',
    te: 'అన్ని బ్రాండ్లు',
    hi: 'सभी ब्रांड्स',
  },
  'shop.in_stock_only': {
    en: 'In Stock Only',
    te: 'స్టాక్‌లో ఉన్నవి మాత్రమే',
    hi: 'केवल स्टॉक में उपलब्ध',
  },
  'shop.sort_by': {
    en: 'Sort By',
    te: 'క్రమబద్ధీకరించు',
    hi: 'क्रमबद्ध करें',
  },
  'shop.sort_newest': {
    en: 'Newest Arrivals',
    te: 'కొత్తవి',
    hi: 'नए आगमन',
  },
  'shop.sort_price_asc': {
    en: 'Price: Low to High',
    te: 'ధర: తక్కువ నుండి ఎక్కువ',
    hi: 'कीमत: कम से अधिक',
  },
  'shop.sort_price_desc': {
    en: 'Price: High to Low',
    te: 'ధర: ఎక్కువ నుండి తక్కువ',
    hi: 'कीमत: अधिक से कम',
  },
  'shop.sort_popular': {
    en: 'Most Popular',
    te: 'అత్యంత ప్రజాదరణ పొందినవి',
    hi: 'सर्वाधिक लोकप्रिय',
  },
  'shop.showing_results': {
    en: 'Showing',
    te: 'చూపిస్తున్నవి',
    hi: 'दिखाए जा रहे हैं',
  },
  'shop.products_count': {
    en: 'products',
    te: 'ఉత్పత్తులు',
    hi: 'उत्पाद',
  },
  'shop.no_products_found': {
    en: 'No products match your criteria',
    te: 'మీ శోధనకు సరిపోలే ఉత్పత్తులు లేవు',
    hi: 'आपकी खोज से मेल खाने वाले उत्पाद नहीं मिले',
  },
  'shop.clear_filters': {
    en: 'Clear All Filters',
    te: 'అన్ని ఫిల్టర్‌లను తీసివేయండి',
    hi: 'सभी फ़िल्टर साफ़ करें',
  },
  'shop.quick_view': {
    en: 'Quick View',
    te: 'త్వరిత వీక్షణ',
    hi: 'त्वरित झलक',
  },
  'shop.add_to_cart': {
    en: 'Add to Cart',
    te: 'కార్ట్‌కు జోడించండి',
    hi: 'कार्ट में जोड़ें',
  },
  'shop.buy_now': {
    en: 'Buy Now',
    te: 'ఇప్పుడే కొనండి',
    hi: 'अभी खरीदें',
  },
  'shop.out_of_stock': {
    en: 'Out of Stock',
    te: 'స్టాక్ అయిపోయింది',
    hi: 'स्टॉक में नहीं है',
  },
  'shop.in_stock': {
    en: 'In Stock',
    te: 'స్టాక్‌లో ఉంది',
    hi: 'स्टॉक में उपलब्ध',
  },
  'shop.specifications': {
    en: 'Specifications',
    te: 'స్పెసిఫికేషన్లు',
    hi: 'विशिष्टताएँ',
  },
  'shop.features': {
    en: 'Key Features',
    te: 'ముఖ్య లక్షణాలు',
    hi: 'मुख्य विशेषताएं',
  },
  'shop.view_details': {
    en: 'View Full Details',
    te: 'పూర్తి వివరాలు చూడండి',
    hi: 'पूरी जानकारी देखें',
  },

  // Cart Page Translations
  'cart.title': {
    en: 'Shopping Cart',
    te: 'షాపింగ్ కార్ట్',
    hi: 'शॉपिंग कार्ट',
  },
  'cart.items': {
    en: 'items',
    te: 'వస్తువులు',
    hi: 'वस्तुएं',
  },
  'cart.subtitle': {
    en: 'Review your items and proceed to secure checkout',
    te: 'మీ వస్తువులను సమీక్షించండి మరియు సురక్షిత చెక్అవుట్‌కు వెళ్లండి',
    hi: 'अपने सामान की समीक्षा करें और सुरक्षित चेकआउट करें',
  },
  'cart.empty_title': {
    en: 'Your Shopping Cart is Empty',
    te: 'మీ షాపింగ్ కార్ట్ ఖాళీగా ఉంది',
    hi: 'आपकी शॉपिंग कार्ट खाली है',
  },
  'cart.empty_desc': {
    en: 'Explore our premium range of road cycles, mountain cycles, standard cycles, and accessories to start your adventure.',
    te: 'మీ ప్రయాణాన్ని ప్రారంభించడానికి రోడ్ సైకిళ్ళు, మౌంటెన్ సైకిళ్ళు, స్టాండర్డ్ సైకిళ్ళు మరియు ఉపకరణాలను అన్వేషించండి.',
    hi: 'रोड साइकिल, माउंटेन साइकिल, स्टैंडर्ड साइकिल और एक्सेसरीज़ देखकर खरीदारी शुरू करें।',
  },
  'cart.explore_shop': {
    en: 'Explore Srirama Shop',
    te: 'శ్రీరామ షాప్‌ని అన్వేషించండి',
    hi: 'श्रीराम शॉप देखें',
  },
  'cart.clear_cart': {
    en: 'Clear Cart',
    te: 'కార్ట్ ఖాళీ చేయండి',
    hi: 'कार्ट खाली करें',
  },
  'cart.product': {
    en: 'Product',
    te: 'ఉత్పత్తి',
    hi: 'उत्पाद',
  },
  'cart.price': {
    en: 'Price',
    te: 'ధర',
    hi: 'मूल्य',
  },
  'cart.quantity': {
    en: 'Quantity',
    te: 'పరిమాణం',
    hi: 'मात्रा',
  },
  'cart.total': {
    en: 'Total',
    te: 'మొత్తం',
    hi: 'कुल',
  },
  'cart.order_summary': {
    en: 'Order Summary',
    te: 'ఆర్డర్ సారాంశం',
    hi: 'ऑर्डर सारांश',
  },
  'cart.subtotal': {
    en: 'Subtotal',
    te: 'ఉపమొత్తం',
    hi: 'उप-योग',
  },
  'cart.shipping': {
    en: 'Shipping',
    te: 'షిప్పింగ్',
    hi: 'शिपिंग',
  },
  'cart.free_shipping': {
    en: 'FREE',
    te: 'ఉచితం',
    hi: 'मुफ़्त',
  },
  'cart.discount': {
    en: 'Discount',
    te: 'రాయితీ',
    hi: 'छूट',
  },
  'cart.estimated_total': {
    en: 'Estimated Total',
    te: 'అంచనా మొత్తం',
    hi: 'कुल देय राशि',
  },
  'cart.checkout_btn': {
    en: 'Proceed to Checkout',
    te: 'చెక్అవుట్‌కు వెళ్లండి',
    hi: 'चेकआउट करें',
  },
  'cart.continue_shopping': {
    en: 'Continue Shopping',
    te: 'షాపింగ్ కొనసాగించండి',
    hi: 'खरीदारी जारी रखें',
  },
  'cart.coupon_placeholder': {
    en: 'Enter Coupon Code',
    te: 'కూపన్ కోడ్ నమోదు చేయండి',
    hi: 'कूपन कोड दर्ज करें',
  },
  'cart.apply_coupon': {
    en: 'Apply',
    te: 'వర్తించు',
    hi: 'लागू करें',
  },
  'cart.free_shipping_unlocked': {
    en: '🎉 You qualify for FREE doorstep delivery!',
    te: '🎉 మీరు ఉచిత డోర్‌స్టెప్ డెలివరీకి అర్హులు!',
    hi: '🎉 आपको मुफ़्त डिलीवरी मिल रही है!',
  },
  'cart.free_shipping_needed': {
    en: 'Add more to unlock FREE delivery',
    te: 'ఉచిత డెలివరీ కోసం మరికొంత జోడించండి',
    hi: 'मुफ़्त डिलीवरी के लिए और जोड़ें',
  },

  // Wishlist Page Translations
  'wishlist.title': {
    en: 'My Saved Wishlist',
    te: 'నా విష్‌లిస్ట్',
    hi: 'मेरी विशलिस्ट',
  },
  'wishlist.subtitle': {
    en: 'Products you have marked to purchase or track',
    te: 'మీరు భవిష్యత్తు కోసం దాచుకున్న ఉత్పత్తులు',
    hi: 'आपके द्वारा पसंद किए गए उत्पाद',
  },
  'wishlist.empty_title': {
    en: 'Your Wishlist is Empty',
    te: 'మీ విష్‌లిస్ట్ ఖాళీగా ఉంది',
    hi: 'आपकी विशलिस्ट खाली है',
  },
  'wishlist.empty_desc': {
    en: "You haven't saved any cycles or gear yet. Explore the shop and tap the heart icon on products you love.",
    te: 'మీరు ఇంకా ఏ సైకిల్‌ను లేదా వస్తువును సేవ్ చేయలేదు. మీకు నచ్చిన ఉత్పత్తులపై గుండె గుర్తును నొక్కండి.',
    hi: 'आपने अभी तक कोई साइकिल या सामान सेव नहीं किया है। अपनी पसंदीदा वस्तु पर दिल का निशान दबाएं।',
  },
  'wishlist.clear_btn': {
    en: 'Clear Wishlist',
    te: 'విష్‌లిస్ట్ క్లియర్ చేయండి',
    hi: 'विशलिस्ट खाली करें',
  },
  'wishlist.discover_btn': {
    en: 'Discover Bicycles',
    te: 'సైకిళ్లను చూడండి',
    hi: 'साइकिलें खोजें',
  },

  // Checkout Page Translations
  'checkout.title': {
    en: 'Secure Express Checkout',
    te: 'సురక్షిత ఎక్స్‌ప్రెస్ చెక్అవుట్',
    hi: 'सुरक्षित एक्सप्रेस चेकआउट',
  },
  'checkout.subtitle': {
    en: 'Complete your bicycle order with authentic Sri Rama warranty',
    te: 'అధికారిక శ్రీరామ వారంటీతో మీ సైకిల్ ఆర్డర్‌ను పూర్తి చేయండి',
    hi: 'प्रामाणिक श्रीराम वारंटी के साथ अपना साइकिल ऑर्डर पूरा करें',
  },
  'checkout.step_phone': {
    en: 'Mobile Verification',
    te: 'మొబైల్ ధృవీకరణ',
    hi: 'मोबाइल सत्यापन',
  },
  'checkout.step_address': {
    en: 'Delivery Address',
    te: 'డెలివరీ చిరునామా',
    hi: 'डिलीवरी का पता',
  },
  'checkout.step_payment': {
    en: 'Payment Method',
    te: 'చెల్లింపు పద్ధతి',
    hi: 'भुगतान का तरीका',
  },
  'checkout.order_summary': {
    en: 'Order Summary',
    te: 'ఆర్డర్ సారాంశం',
    hi: 'ऑर्डर सारांश',
  },
  'checkout.place_order': {
    en: 'Place Order Now',
    te: 'ఇప్పుడే ఆర్డర్ చేయండి',
    hi: 'अभी ऑर्डर करें',
  },
  'checkout.cod': {
    en: 'Cash on Delivery (COD)',
    te: 'క్యాష్ ఆన్ డెలివరీ (COD)',
    hi: 'कैश ऑन डिलीवरी (सीओडी)',
  },
  'checkout.online_upi': {
    en: 'UPI / Cards / Net Banking',
    te: 'UPI / కార్డులు / నెట్ బ్యాంకింగ్',
    hi: 'यूपीआई / कार्ड्स / नेट बैंकिंग',
  },
  'checkout.security_badge': {
    en: '100% Secure Checkout Guaranteed',
    te: '100% సురక్షిత చెక్అవుట్ గ్యారెంటీ',
    hi: '100% सुरक्षित चेकआउट गारंटी',
  },

  // Auth (Login & Register) Translations
  'auth.login_title': {
    en: 'Customer Sign In',
    te: 'ఖాతాదారుల లాగిన్',
    hi: 'ग्राहक साइन इन',
  },
  'auth.login_subtitle': {
    en: 'Access your orders, saved addresses & profile dashboard',
    te: 'మీ ఆర్డర్లు, చిరునామాలు మరియు ప్రొఫైల్‌ను యాక్సెస్ చేయండి',
    hi: 'अपने ऑर्डर, पते और प्रोफ़ाइल देखें',
  },
  'auth.email_or_phone': {
    en: 'Email Address or Mobile Number',
    te: 'ఇమెయిల్ లేదా మొబైల్ నంబర్',
    hi: 'ईमेल पता या मोबाइल नंबर',
  },
  'auth.password': {
    en: 'Password',
    te: 'పాస్‌వర్డ్',
    hi: 'पासवर्ड',
  },
  'auth.forgot_password': {
    en: 'Forgot Password?',
    te: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    hi: 'पासवर्ड भूल गए?',
  },
  'auth.sign_in_btn': {
    en: 'Sign In',
    te: 'లాగిన్ అవ్వండి',
    hi: 'साइन इन करें',
  },
  'auth.no_account': {
    en: "Don't have an account?",
    te: 'ఖాతా లేదా?',
    hi: 'खाता नहीं है?',
  },
  'auth.create_account': {
    en: 'Create an Account',
    te: 'కొత్త ఖాతాను సృష్టించండి',
    hi: 'नया खाता बनाएं',
  },
  'auth.register_title': {
    en: 'Create New Account',
    te: 'కొత్త ఖాతా సృష్టించండి',
    hi: 'नया खाता बनाएं',
  },
  'auth.register_subtitle': {
    en: 'Join Sri Rama Cycles for faster checkout and warranty tracking',
    te: 'వేగవంతమైన చెక్అవుట్ మరియు వారంటీ కోసం శ్రీరామ సైకిల్స్‌లో చేరండి',
    hi: 'तेज़ चेकआउट और वारंटी के लिए श्रीराम साइकिल से जुड़ें',
  },
  'auth.full_name': {
    en: 'Full Name',
    te: 'పూర్తి పేరు',
    hi: 'पूरा नाम',
  },
  'auth.mobile_number': {
    en: 'Mobile Number',
    te: 'మొబైల్ నంబర్',
    hi: 'मोबाइल नंबर',
  },
  'auth.email': {
    en: 'Email Address',
    te: 'ఇమెయిల్ చిరునామా',
    hi: 'ईमेल पता',
  },
  'auth.confirm_password': {
    en: 'Confirm Password',
    te: 'పాస్‌వర్డ్ నిర్ధారించండి',
    hi: 'पासवर्ड की पुष्टि करें',
  },
  'auth.register_btn': {
    en: 'Create Account',
    te: 'ఖాతా సృష్టించండి',
    hi: 'खाता बनाएं',
  },
  'auth.have_account': {
    en: 'Already have an account?',
    te: 'ఇప్పటికే ఖాతా ఉందా?',
    hi: 'पहले से खाता है?',
  },

  // Floating Social & Support Dock Translations
  'dock.whatsapp': {
    en: 'Chat on WhatsApp',
    te: 'వాట్సాప్‌లో చాట్ చేయండి',
    hi: 'व्हाट्सएप पर चैट करें',
  },
  'dock.instagram': {
    en: 'Follow on Instagram',
    te: 'ఇన్‌స్టాగ్రామ్‌లో ఫాలో అవ్వండి',
    hi: 'इंस्टाग्राम पर फॉलो करें',
  },
  'dock.youtube': {
    en: 'Watch on YouTube',
    te: 'యూట్యూబ్‌లో చూడండి',
    hi: 'यूट्यूब पर देखें',
  },
  'dock.support': {
    en: 'Store Support & Direct Call',
    te: 'స్టోర్ సపోర్ట్ & డైరెక్ట్ కాల్',
    hi: 'स्टोर सहायता और डायरेक्ट कॉल',
  },
  'dock.support_online': {
    en: 'Online Now • Kazipet Store',
    te: 'ఇప్పుడు ఆన్‌లైన్‌లో • కాజీపేట స్టోర్',
    hi: 'अभी ऑनलाइन • काजीपेट स्टोर',
  },
  'dock.call_now': {
    en: 'Call Store Directly',
    te: 'స్టోర్‌కు నేరుగా కాల్ చేయండి',
    hi: 'स्टोर पर सीधे कॉल करें',
  },
  'dock.chat_owner': {
    en: 'Chat on WhatsApp',
    te: 'వాట్సాప్‌లో మాట్లాడండి',
    hi: 'व्हाट्सएप पर बात करें',
  },
  'dock.proprietor_title': {
    en: 'Proprietor: Ravula Rakesh Kumar',
    te: 'ప్రొప్రైటర్: రావుల రాకేష్ కుమార్',
    hi: 'मालिक: रावुला राकेश कुमार',
  },
  'dock.quick_help': {
    en: 'Have questions about cycles or spare parts? Connect with us directly!',
    te: 'సైకిళ్ళు లేదా స్పేర్ పార్ట్స్ గురించి సందేహాలు ఉన్నాయా? నేరుగా మమ్మల్ని సంప్రదించండి!',
    hi: 'साइकिल या स्पेयर पार्ट्स को लेकर कोई सवाल है? सीधे हमसे संपर्क करें!',
  },
};

