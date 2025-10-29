# Security Notice - Credentials Rotation Required

**IMPORTANT:** The following credentials were accidentally committed to this repository and must be rotated immediately:

## Compromised Credentials

### 1. MongoDB Atlas
- **Location:** `backend/.env` (URI variable)
- **Action Required:**
  1. Change MongoDB Atlas password
  2. Update connection string in production environment
  3. Do NOT commit new credentials to git

### 2. Firebase Admin Private Key
- **Location:** `backend/.env` (FIREBASE_PRIVATE_KEY)
- **Action Required:**
  1. Go to Firebase Console → Project Settings → Service Accounts
  2. Generate new private key
  3. Update FIREBASE_PRIVATE_KEY in production secret manager
  4. Do NOT commit new key to git

### 3. Cloudinary API Credentials
- **Location:** `backend/.env`
- **Action Required:**
  1. Regenerate API secret in Cloudinary dashboard
  2. Update in production environment
  3. Do NOT commit new credentials

### 4. Email Password
- **Location:** `backend/.env` (EMAIL_PASS)
- **Action Required:**
  1. Rotate Gmail app-specific password
  2. Update in production environment

## Immediate Actions Checklist

- [ ] Rotate MongoDB Atlas password and update connection string
- [ ] Generate new Firebase service account key
- [ ] Regenerate Cloudinary API secret
- [ ] Rotate email app password
- [ ] Update all credentials in production (secret manager/env vars)
- [ ] Remove `.env` from git history (see below)
- [ ] Verify `.env` is in `.gitignore`
- [ ] Audit git history for other accidental commits

## Remove .env from Git History

```bash
# Install git-filter-repo (recommended method)
pip install git-filter-repo

# Remove .env from history
git filter-repo --path backend/.env --invert-paths
git filter-repo --path frontend/.env --invert-paths

# Force push (⚠️ WARNING: This rewrites history)
git push origin --force --all
git push origin --force --tags

# Alternative: BFG Repo-Cleaner
# Download from https://reps.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## Best Practices Going Forward

1. **Never commit secrets to git**
   - Use `.env.example` for templates
   - Keep actual `.env` files local only

2. **Use Secret Managers**
   - AWS Secrets Manager
   - Google Cloud Secret Manager
   - Azure Key Vault
   - HashiCorp Vault

3. **Environment-based Configuration**
   - Inject secrets via CI/CD pipeline
   - Use platform environment variables (Vercel, Render, etc.)

4. **Audit Git History**
   - Regularly scan for accidental commits
   - Use pre-commit hooks to prevent secrets

5. **Rotate Regularly**
   - Schedule periodic credential rotation
   - Monitor access logs

## Contact

If you have accessed this repository and these credentials:
- Do NOT use them
- Report any unauthorized access to the repository maintainer immediately

## Date of Discovery
2025-10-29

---
**Status:** 🔴 CRITICAL - Immediate action required
