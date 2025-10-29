const checkAdminPermission = async (req, res, next) => {
    try {
        const user = req.firebaseUser;
        
        if (!user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        const hasAdminClaim = user.customClaims?.admin || user.customClaims?.customClaims?.admin;
        
        if (!hasAdminClaim) {
            return res.status(403).json({ 
                message: 'Admin access required. You do not have permission to perform this action.' 
            });
        }
        
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
