const checkAdminPermission = async (req, res, next) => {
    try {
        // Get user from Firebase auth middleware
        const user = req.firebaseUser;
        
        console.log('🔍 Admin Check - User:', user ? user.email : 'No user');
        console.log('🔍 Admin Check - Custom Claims:', user ? user.customClaims : 'No claims');
        
        if (!user) {
            console.log('❌ Admin Check - No user found');
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        // Check if user has admin custom claim (same as frontend)
        const hasAdminClaim = user.customClaims?.admin || user.customClaims?.customClaims?.admin;
        
        console.log('🔍 Admin Check - Has admin claim:', hasAdminClaim);
        
        if (!hasAdminClaim) {
            console.log('❌ Admin Check - User lacks admin claim');
            return res.status(403).json({ 
                message: 'Admin access required. You do not have permission to perform this action.' 
            });
        }
        
        console.log('✅ Admin Check - User is admin, proceeding');
        // User is admin, proceed
        next();
    } catch (error) {
        console.error('Error checking admin permission:', error);
        res.status(500).json({ 
            message: 'Error verifying admin permissions', 
            error: error.message 
        });
    }
};

module.exports = checkAdminPermission;
