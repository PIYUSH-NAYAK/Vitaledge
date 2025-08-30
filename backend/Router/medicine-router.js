const express = require('express');
const router = express.Router();
const medicineController = require('./medicine-controller');
const firebaseAuthMiddleware = require('../Middleware/firebaseAuthMiddleware');
const checkAdminPermission = require('../Middleware/adminMiddleware');

// Public routes (no authentication required)
router.get('/medicines', medicineController.getMedicines);
router.get('/medicines/search', medicineController.searchMedicines);
router.get('/medicines/categories', medicineController.getCategories);
router.get('/medicines/:identifier', medicineController.getMedicineDetails);

// Protected routes (authentication required)
router.use(firebaseAuthMiddleware);

// Admin only routes for medicine management
router.post('/medicines', checkAdminPermission, medicineController.addMedicine);
router.put('/medicines/:id', checkAdminPermission, medicineController.updateMedicine);
router.delete('/medicines/:id', checkAdminPermission, medicineController.deleteMedicine);

// Image upload routes (admin only)
router.post('/medicines/upload', 
    checkAdminPermission,
    medicineController.uploadMiddleware.array('images', 5), // Max 5 images
    medicineController.addMedicineWithImages
);

router.put('/medicines/:id/images', 
    checkAdminPermission,
    medicineController.uploadMiddleware.array('images', 3), // Max 3 images for update
    medicineController.updateMedicineImages
);

router.delete('/medicines/:id/images/:imageId', 
    checkAdminPermission,
    medicineController.deleteMedicineImage
);

// Stock management route (admin only)
router.put('/medicines/:id/stock', 
    checkAdminPermission,
    medicineController.updateMedicineStock
);

module.exports = router;
