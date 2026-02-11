# Backend URL Update Summary

## New Backend URL
**Production URL**: `https://web-production-ecd63.up.railway.app`

## Files Updated

### 1. `.env.example`
- **Old**: `VITE_API_URL=http://localhost:8080/api/v1`
- **New**: `VITE_API_URL=https://web-production-ecd63.up.railway.app/api/v1`

### 2. `src/services/api.ts`
- **Old**: `const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';`
- **New**: `const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-production-ecd63.up.railway.app/api/v1';`
- **Note**: This was already updated by you

### 3. `src/pages/Upload.tsx`
- **Line 80**
- **Old**: `http://127.0.0.1:8080/api/v1/ocr/upload?nic=${NIC}`
- **New**: `https://web-production-ecd63.up.railway.app/api/v1/ocr/upload?nic=${NIC}`

### 4. `src/pages/Reports.tsx`
Two endpoints updated:
- **Line 36**
  - **Old**: `http://127.0.0.1:8080/api/v1/ocr/reports/nic/${nic}`
  - **New**: `https://web-production-ecd63.up.railway.app/api/v1/ocr/reports/nic/${nic}`
  
- **Line 47**
  - **Old**: `http://127.0.0.1:8080/api/v1/ocr/report/${nic}/${report.file_id}/normalized`
  - **New**: `https://web-production-ecd63.up.railway.app/api/v1/ocr/report/${nic}/${report.file_id}/normalized`

## Next Steps

### If you don't have a `.env` file yet:
Create a `.env` file in the root directory with:
```
VITE_API_URL=https://web-production-ecd63.up.railway.app/api/v1
```

### If you already have a `.env` file:
Update the `VITE_API_URL` value to:
```
VITE_API_URL=https://web-production-ecd63.up.railway.app/api/v1
```

### Restart the development server:
Since environment variables are loaded at build time, you need to restart your dev server:
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## Verification
All hardcoded localhost URLs have been replaced. The application will now connect to your Railway production backend.
