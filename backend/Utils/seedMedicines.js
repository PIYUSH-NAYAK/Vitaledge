require('dotenv').config();
const mongoose = require('mongoose');
const Medicine = require('../Models/Medicine');

const sampleMedicines = [
  {
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    manufacturer: "ABC Pharmaceuticals",
    description: "Paracetamol is a pain reliever and fever reducer. It is used to treat mild to moderate pain and reduce fever. It works by blocking certain chemicals in the brain that cause pain and fever.",
    category: "Tablet",
    dosage: {
      strength: "500mg",
      form: "Tablet"
    },
    price: {
      mrp: 50,
      discountedPrice: 42,
    },
    images: {
      primary: {
        url: "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Paracetamol+500mg",
        publicId: "placeholder_paracetamol_500mg"
      },
      gallery: []
    },
    stock: {
      quantity: 100,
      unit: "pieces"
    },
    prescriptionRequired: false,
    activeIngredients: [
      { name: "Paracetamol", quantity: "500mg" }
    ],
    sideEffects: ["Nausea", "Skin rash (rare)", "Allergic reactions (rare)"],
    contraindications: ["Severe liver disease", "Allergy to paracetamol"],
    usage: {
      dosageInstructions: "Take 1-2 tablets every 4-6 hours as needed",
      frequency: "Up to 4 times daily",
      duration: "As needed, not more than 7 days without medical advice"
    },
    storage: {
      temperature: "Store below 30°C",
      conditions: "Keep in a dry place, away from direct sunlight"
    },
    expiryDate: new Date('2026-12-31'),
    batchNumber: "PAR001",
    tags: ["painkiller", "fever reducer", "headache", "common cold"]
  },
  {
    name: "Amoxicillin 250mg Capsules",
    genericName: "Amoxicillin",
    manufacturer: "MediCore Ltd",
    description: "Amoxicillin is a penicillin antibiotic that fights bacteria. It is used to treat many different types of bacterial infections, such as ear infections, bladder infections, pneumonia, gonorrhea, and E. coli.",
    category: "Capsule",
    dosage: {
      strength: "250mg",
      form: "Capsule"
    },
    price: {
      mrp: 120,
      discountedPrice: 95,
    },
    images: {
      primary: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=Amoxicillin+250mg",
      gallery: []
    },
    stock: {
      quantity: 50,
      unit: "pieces"
    },
    prescriptionRequired: true,
    activeIngredients: [
      { name: "Amoxicillin", quantity: "250mg" }
    ],
    sideEffects: ["Diarrhea", "Nausea", "Vomiting", "Stomach pain", "Skin rash"],
    contraindications: ["Allergy to penicillin", "History of severe allergic reactions"],
    usage: {
      dosageInstructions: "Take 1 capsule three times daily with food",
      frequency: "Three times daily",
      duration: "Complete the full course as prescribed (usually 7-10 days)"
    },
    storage: {
      temperature: "Store below 25°C",
      conditions: "Keep in original container, protect from moisture"
    },
    expiryDate: new Date('2025-08-30'),
    batchNumber: "AMX002",
    tags: ["antibiotic", "bacterial infection", "penicillin"]
  },
  {
    name: "Cetirizine Hydrochloride 10mg",
    genericName: "Cetirizine",
    manufacturer: "AllerFree Pharma",
    description: "Cetirizine is an antihistamine that reduces the effects of natural chemical histamine in the body. It is used to treat cold or allergy symptoms such as sneezing, itching, watery eyes, or runny nose.",
    category: "Tablet",
    dosage: {
      strength: "10mg",
      form: "Tablet"
    },
    price: {
      mrp: 80,
      discountedPrice: 65,
    },
    images: {
      primary: "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Cetirizine+10mg",
      gallery: []
    },
    stock: {
      quantity: 75,
      unit: "pieces"
    },
    prescriptionRequired: false,
    activeIngredients: [
      { name: "Cetirizine Hydrochloride", quantity: "10mg" }
    ],
    sideEffects: ["Drowsiness", "Dry mouth", "Headache", "Fatigue"],
    contraindications: ["Severe kidney disease", "End-stage kidney disease"],
    usage: {
      dosageInstructions: "Take 1 tablet once daily, preferably in the evening",
      frequency: "Once daily",
      duration: "As needed for allergy symptoms"
    },
    storage: {
      temperature: "Store at room temperature (15-30°C)",
      conditions: "Keep away from moisture and heat"
    },
    expiryDate: new Date('2026-06-15'),
    batchNumber: "CET003",
    tags: ["antihistamine", "allergy", "cold symptoms", "sneezing"]
  },
  {
    name: "Ibuprofen 400mg Tablets",
    genericName: "Ibuprofen",
    manufacturer: "PainRelief Co.",
    description: "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) that reduces hormones that cause inflammation and pain in the body. It is used to reduce fever and treat pain or inflammation.",
    category: "Tablet",
    dosage: {
      strength: "400mg",
      form: "Tablet"
    },
    price: {
      mrp: 90,
      discountedPrice: 75,
    },
    images: {
      primary: "https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Ibuprofen+400mg",
      gallery: []
    },
    stock: {
      quantity: 80,
      unit: "pieces"
    },
    prescriptionRequired: false,
    activeIngredients: [
      { name: "Ibuprofen", quantity: "400mg" }
    ],
    sideEffects: ["Stomach upset", "Heartburn", "Dizziness", "Headache"],
    contraindications: ["History of stomach ulcers", "Severe heart failure", "Severe kidney disease"],
    usage: {
      dosageInstructions: "Take 1 tablet every 6-8 hours with food",
      frequency: "Up to 3 times daily",
      duration: "Not more than 10 days without medical advice"
    },
    storage: {
      temperature: "Store below 30°C",
      conditions: "Keep in a cool, dry place"
    },
    expiryDate: new Date('2026-03-20'),
    batchNumber: "IBU004",
    tags: ["anti-inflammatory", "pain relief", "fever reducer", "NSAID"]
  },
  {
    name: "Cough Syrup with Honey",
    genericName: "Dextromethorphan + Honey",
    manufacturer: "NaturCure Ltd",
    description: "A soothing cough syrup that combines the cough suppressant properties of dextromethorphan with the natural healing benefits of honey. Effective for dry, irritating coughs.",
    category: "Syrup",
    dosage: {
      strength: "100ml",
      form: "Syrup"
    },
    price: {
      mrp: 150,
      discountedPrice: 125,
    },
    images: {
      primary: "https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Cough+Syrup",
      gallery: []
    },
    stock: {
      quantity: 30,
      unit: "bottles"
    },
    prescriptionRequired: false,
    activeIngredients: [
      { name: "Dextromethorphan", quantity: "15mg/5ml" },
      { name: "Honey", quantity: "2g/5ml" }
    ],
    sideEffects: ["Drowsiness", "Dizziness", "Nausea"],
    contraindications: ["Children under 2 years", "Chronic cough due to smoking"],
    usage: {
      dosageInstructions: "Adults: 10ml every 4-6 hours. Children 6-12 years: 5ml every 4-6 hours",
      frequency: "Every 4-6 hours as needed",
      duration: "Not more than 7 days"
    },
    storage: {
      temperature: "Store below 25°C",
      conditions: "Do not refrigerate. Shake well before use"
    },
    expiryDate: new Date('2025-12-10'),
    batchNumber: "SYR005",
    tags: ["cough suppressant", "dry cough", "honey", "syrup"]
  }
];

const seedMedicines = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.URI);
    console.log('Connected to MongoDB');

    // Clear existing medicines
    await Medicine.deleteMany({});
    console.log('Cleared existing medicines');

    // Insert sample medicines
    const insertedMedicines = await Medicine.insertMany(sampleMedicines);
    console.log(`Inserted ${insertedMedicines.length} sample medicines`);

    // Log the inserted medicines
    insertedMedicines.forEach(medicine => {
      console.log(`- ${medicine.name} (${medicine.slug})`);
    });

    console.log('✅ Sample medicines seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding medicines:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeder
seedMedicines();
