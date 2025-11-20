# SunoRooms - Setup Instructions

## Phase 0 - Complete ✓

### What's Done
- ✓ Vite + React project created
- ✓ Dependencies installed (@supabase/supabase-js, react-router-dom)
- ✓ Folder structure created (components/, hooks/, utils/)
- ✓ Supabase client configured
- ✓ React Router setup
- ✓ Home page created
- ✓ Dev server tested

### Next Steps: Configure Supabase

Before proceeding to Phase 1, you need to set up Supabase:

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Sign up / Log in
   - Click "New Project"
   - Fill in project details
   - Wait for project to initialize (~2 minutes)

2. **Get Your Credentials**
   - Go to Project Settings → API
   - Copy the following:
     - `Project URL` (looks like: https://xxxxx.supabase.co)
     - `anon public` key (long string starting with eyJ...)

3. **Update .env.local**
   - Open `.env.local` in the project root
   - Replace placeholders with your actual credentials:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxx...your-key-here
   ```

4. **Restart Dev Server**
   ```bash
   npm run dev
   ```

5. **Verify Setup**
   - Open http://localhost:5173
   - Open browser console (F12)
   - Should see no Supabase errors
   - Should see "SunoRooms" home page with "Create Room" button

### Project Structure

```
sunorooms/
├── src/
│   ├── components/
│   │   └── Home.jsx          # Home page
│   ├── hooks/                # Custom React hooks (empty for now)
│   ├── utils/
│   │   └── supabase.js       # Supabase client
│   ├── App.jsx               # Main app with routes
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── .env.local                # Supabase credentials (gitignored)
├── package.json
└── vite.config.js
```

### Testing Phase 0

Run these commands to verify everything works:

```bash
# Install dependencies (if not done)
npm install

# Start dev server
npm run dev

# → Should see:
# VITE v7.x.x ready in XXX ms
# ➜ Local: http://localhost:5173/
```

Open browser:
- Navigate to http://localhost:5173
- Should see "🎵 SunoRooms" heading
- Should see "Create Room" button
- Console: No errors (except missing Supabase credentials warning until you configure them)

### Ready for Phase 1?

Once Supabase is configured:
- No console errors about missing env vars
- App loads successfully
- Ready to implement room creation + presence tracking

---

**Phase 0 Status**: ✅ Complete
**Next Phase**: Phase 1 - Création Room + Presence Basique
