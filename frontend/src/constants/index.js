import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  
  chromecast,
  disc02,
  file02,
  homeSmile,
  plusSquare,
  recording01,
  recording03,
  searchMd,
  sliders04,
} from "../assets";

export const navigation = [
  {
    id: "0",
    title: "Home",
    url: "/",
  },
  {
    id: "1",
    title: "Medicines",
    url: "/medicines",
  },
  {
    id: "3",
    title: "Orders",
    url: "/orders",
    requiresAuth: true,
  },
  {
    id: "4",
    title: "About Us",
    url: "/aboutus",
  },
  {
    id: "5",
    title: "Contact Us",
    url: "/contact",
  },
  {
    id: "6",
    title: "Admin",
    url: "/admin",
    adminOnly: true,
  },
  // {
  //   id: "4",
  //   title: "New account",
  //   url: "#signup",
  //   onlyMobile: true,
  // },
  // {
  //   id: "5",
  //   title: "Sign in",
  //   url: "#login",
  //   onlyMobile: true,
  // },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const healthServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
];

export const pricing = [
  {
    id: "0",
    title: "Basic",
    description: "Medical consultations, prescription management",
    price: "0",
    features: [
      "Online platform for basic medical consultations",
      "Prescription tracking and medication reminders",
      "Access to health articles and wellness tips",
    ],
  },
  {
    id: "1",
    title: "Premium",
    description: "Advanced health monitoring, priority support, health dashboard",
    price: "9.99",
    features: [
      "Advanced health monitoring and tracking tools",
      "24/7 medical support and telemedicine consultations",
      "Personalized health insights and analytics dashboard",
    ],
  },
  {
    id: "2",
    title: "Enterprise",
    description: "Custom health solutions, advanced analytics, dedicated account",
    price: null,
    features: [
      "Custom healthcare solutions for organizations",
      "Enterprise-grade security and compliance",
      "Dedicated account manager and priority support",
    ],
  },
];

export const benefits = [
  {
    "id": "0",
    "title": "Medicine Made Easy",
    "text": "Provides fast access to reliable medicine information without searching multiple sources.",
    "backgroundUrl": "./src/assets/benefits/card-1.svg",
    "iconUrl": benefitIcon1,
    "imageUrl": "./m2.webp"
  },
  {
    "id": "1",
    "title": "Enhance Your Health Daily",
    "text": "Leverages advanced technology to offer precise information for your medicine and healthcare needs.",
    "backgroundUrl": "./src/assets/benefits/card-2.svg",
    "iconUrl": benefitIcon2,
    "imageUrl": "./m2.webp",
    "light": true
  },
  {
    "id": "2",
    "title": "Access Medicine Anytime",
    "text": "Get reliable medicine information from anywhere, on any device, for ultimate convenience.",
    "backgroundUrl": "./src/assets/benefits/card-3.svg",
    "iconUrl": benefitIcon3,
    "imageUrl": "./m2.webp"
  },
  {
    "id": "3",
    "title": "Quick Medicine Insights",
    "text": "Provides fast and accurate medicine information without the hassle of extensive searching.",
    "backgroundUrl": "./src/assets/benefits/card-4.svg",
    "iconUrl": benefitIcon4,
    "imageUrl": "./m2.webp",
    "light": true
  },
  {
    "id": "4",
    "title": "Comprehensive Medicine Info",
    "text": "Find answers to all your medicine-related questions effortlessly in one place.",
    "backgroundUrl": "./src/assets/benefits/card-5.svg",
    "iconUrl": benefitIcon1,
    "imageUrl": "./m2.webp"
  },
  {
    "id": "5",
    "title": "Better Health Daily",
    "text": "Uses smart technology to deliver accurate medicine information for informed health decisions.",
    "backgroundUrl": "./src/assets/benefits/card-6.svg",
    "iconUrl": benefitIcon2,
    "imageUrl": "./m2.webp"
  }
];
