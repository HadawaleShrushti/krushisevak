import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
}

const translations: Translations = {
  // Common
  login: { en: 'Login', hi: 'लॉगिन', mr: 'लॉगिन' },
  register: { en: 'Register', hi: 'पंजीकरण करें', mr: 'नोंदणी करा' },
  email: { en: 'Email / Phone', hi: 'ईमेल / फोन', mr: 'ईमेल / फोन' },
  password: { en: 'Password', hi: 'पासवर्ड', mr: 'पासवर्ड' },
  otp: { en: 'OTP', hi: 'ओटीपी', mr: 'ओटीपी' },
  logout: { en: 'Logout', hi: 'लॉगआउट', mr: 'लॉगआउट' },
  profile: { en: 'Profile', hi: 'प्रोफाइल', mr: 'प्रोफाईल' },
  
  // App Name
  appName: { en: 'KrushiSevak', hi: 'कृषिसेवक', mr: 'कृषीसेवक' },
  appTagline: { en: 'Connecting Farmers & Retailers', hi: 'किसानों और खुदरा विक्रेताओं को जोड़ना', mr: 'शेतकरी आणि किरकोळ विक्रेते जोडणे' },
  
  // Login Screen
  farmerLogin: { en: 'Farmer Login', hi: 'किसान लॉगिन', mr: 'शेतकरी लॉगिन' },
  retailerLogin: { en: 'Retailer Login', hi: 'खुदरा विक्रेता लॉगिन', mr: 'किरकोळ विक्रेता लॉगिन' },
  selectRole: { en: 'Select Your Role', hi: 'अपनी भूमिका चुनें', mr: 'तुमची भूमिका निवडा' },
  continueAsFarmer: { en: 'Continue as Farmer', hi: 'किसान के रूप में जारी रखें', mr: 'शेतकरी म्हणून सुरू ठेवा' },
  continueAsRetailer: { en: 'Continue as Retailer', hi: 'खुदरा विक्रेता के रूप में जारी रखें', mr: 'किरकोळ विक्रेता म्हणून सुरू ठेवा' },
  
  // Farmer Dashboard
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
  myCrops: { en: 'My Crops', hi: 'मेरी फसलें', mr: 'माझी पिके' },
  sellCrop: { en: 'Sell Crop', hi: 'फसल बेचें', mr: 'पीक विक्री' },
  orders: { en: 'Orders', hi: 'आदेश', mr: 'ऑर्डर' },
  cropName: { en: 'Crop Name', hi: 'फसल का नाम', mr: 'पिकाचे नाव' },
  quantity: { en: 'Quantity (kg)', hi: 'मात्रा (किलो)', mr: 'प्रमाण (किलो)' },
  price: { en: 'Price per kg', hi: 'प्रति किलो मूल्य', mr: 'प्रति किलो किंमत' },
  location: { en: 'Location', hi: 'स्थान', mr: 'स्थान' },
  uploadImage: { en: 'Upload Image', hi: 'छवि अपलोड करें', mr: 'प्रतिमा अपलोड करा' },
  submit: { en: 'Submit', hi: 'जमा करें', mr: 'सबमिट करा' },
  available: { en: 'Available', hi: 'उपलब्ध', mr: 'उपलब्ध' },
  sold: { en: 'Sold', hi: 'बिक गया', mr: 'विकले' },
  pending: { en: 'Pending', hi: 'लंबित', mr: 'प्रलंबित' },
  
  // Retailer Dashboard
  browseCrops: { en: 'Browse Crops', hi: 'फसलें ब्राउज़ करें', mr: 'पिके ब्राउज करा' },
  availableCrops: { en: 'Available Crops', hi: 'उपलब्ध फसलें', mr: 'उपलब्ध पिके' },
  chat: { en: 'Chat', hi: 'चैट', mr: 'चॅट' },
  filters: { en: 'Filters', hi: 'फ़िल्टर', mr: 'फिल्टर' },
  priceRange: { en: 'Price Range', hi: 'मूल्य सीमा', mr: 'किंमत श्रेणी' },
  cropType: { en: 'Crop Type', hi: 'फसल का प्रकार', mr: 'पिकाचा प्रकार' },
  buy: { en: 'Buy', hi: 'खरीदें', mr: 'खरेदी करा' },
  perKg: { en: 'per kg', hi: 'प्रति किलो', mr: 'प्रति किलो' },
  farmer: { en: 'Farmer', hi: 'किसान', mr: 'शेतकरी' },
  
  // Chat
  typeMessage: { en: 'Type a message...', hi: 'एक संदेश लिखें...', mr: 'संदेश टाइप करा...' },
  send: { en: 'Send', hi: 'भेजें', mr: 'पाठवा' },
  
  // Order Tracking
  orderTracking: { en: 'Order Tracking', hi: 'आदेश ट्रैकिंग', mr: 'ऑर्डर ट्रॅकिंग' },
  accepted: { en: 'Accepted', hi: 'स्वीकृत', mr: 'स्वीकृत' },
  inTransit: { en: 'In Transit', hi: 'मार्ग में', mr: 'मार्गस्थ' },
  delivered: { en: 'Delivered', hi: 'वितरित', mr: 'वितरित' },
  orderDetails: { en: 'Order Details', hi: 'आदेश विवरण', mr: 'ऑर्डर तपशील' },
  
  // Actions
  markSold: { en: 'Mark Sold', hi: 'बेचा गया', mr: 'विकले म्हणून चिन्हांकित करा' },
  delete: { en: 'Delete', hi: 'हटाएं', mr: 'हटवा' },
  
  // Registration
  register: { en: 'Register', hi: 'पंजीकरण करें', mr: 'नोंदणी करा' },
  name: { en: 'Name', hi: 'नाम', mr: 'नाव' },
  email: { en: 'Email', hi: 'ईमेल', mr: 'ईमेल' },
  
  // Bidding
  placeBid: { en: 'Place Bid', hi: 'बोली लगाएं', mr: 'बिड लावा' },
  viewBids: { en: 'View Bids', hi: 'बोली देखें', mr: 'बिड पहा' },
  acceptBid: { en: 'Accept Bid', hi: 'बोली स्वीकार करें', mr: 'बिड स्वीकार करा' },
  rejectBid: { en: 'Reject Bid', hi: 'बोली अस्वीकार करें', mr: 'बिड नाकारा' },
  enableBidding: { en: 'Enable Bidding', hi: 'बोली सक्षम करें', mr: 'बिडिंग सक्षम करा' },
  biddingActive: { en: 'Bidding Active', hi: 'बोली सक्रिय', mr: 'बिडिंग सक्रिय' },
  highestBid: { en: 'Highest Bid', hi: 'सर्वोच्च बोली', mr: 'सर्वोच्च बिड' },
  timeRemaining: { en: 'Time Remaining', hi: 'शेष समय', mr: 'उर्वरित वेळ' },
  bidding: { en: 'Bidding', hi: 'बोली', mr: 'बिडिंग' },
  noBids: { en: 'No bids yet', hi: 'अभी तक कोई बोली नहीं', mr: 'अद्याप कोणतीही बिड नाही' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}