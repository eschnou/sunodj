# SunoRooms - Plan d'Implémentation POC

## Phase 0: Setup Projet

### Tâches
- [ ] Créer projet Vite + React
- [ ] Installer dépendances: `@supabase/supabase-js`
- [ ] Créer compte Supabase + nouveau projet
- [ ] Récupérer `SUPABASE_URL` et `SUPABASE_ANON_KEY`
- [ ] Créer fichier `.env.local` avec credentials
- [ ] Créer `src/utils/supabase.js` avec client configuré
- [ ] Setup routing de base (React Router)
- [ ] Créer structure dossiers: `components/`, `hooks/`, `utils/`

### Délivrable
Application Vite qui démarre, routing fonctionne, client Supabase initialisé.

### Test
```bash
npm run dev
# → App démarre sur localhost:5173
# → Console: aucune erreur Supabase
# → Navigation vers / fonctionne
```

---

## Phase 1: Création Room + Presence Basique

### Tâches
- [ ] Créer `utils/slugGenerator.js` (génération slug aléatoire)
- [ ] Créer `utils/userUtils.js` (getUserId, generateNickname avec localStorage)
- [ ] Créer `hooks/useRealtimeRoom.js`:
  - Subscribe au channel avec slug
  - Track presence avec userId + nickname + isDJ
  - Return channel, participants list, isConnected
- [ ] Créer `components/CreateRoom.jsx`:
  - Bouton "Create Room"
  - Génère slug
  - Navigate vers `/room/:slug?dj=true`
- [ ] Créer `components/RoomView.jsx`:
  - Parse slug depuis URL params
  - Detect isDJ depuis query param `?dj=true`
  - Utilise `useRealtimeRoom(slug, isDJ)`
  - Affiche slug + lien partageable
  - Affiche liste participants avec Presence
- [ ] Créer `components/Participants.jsx`:
  - Affiche liste participants
  - Icône 🎧 pour DJ, 👤 pour spectateurs
- [ ] Créer page home avec bouton "Create Room"
- [ ] Setup routing: `/` et `/room/:slug`

### Délivrable
UI qui permet de créer une room, affiche le lien, et track les participants via Presence.

### Test
```
1. Ouvrir app: http://localhost:5173
2. Clic "Create Room"
3. → Redirect vers /room/funky-tiger-42?dj=true
4. → Affiche "Room: funky-tiger-42"
5. → Affiche "🎧 User_1234 (DJ)" dans participants
6. Copier lien sans ?dj=true
7. Ouvrir lien dans nouvel onglet/navigateur incognito
8. → Affiche "👤 User_5678" dans participants
9. → Les deux onglets voient les 2 participants en temps réel
10. Fermer un onglet → participant disparaît de la liste
```

---

## Phase 2: Upload MP3 + Broadcast Métadonnées

### Tâches
- [ ] Créer `utils/audioUtils.js`:
  - `arrayBufferToBase64(buffer)`: encode ArrayBuffer → base64
  - `base64ToArrayBuffer(base64)`: decode base64 → ArrayBuffer
  - `getAudioDuration(arrayBuffer)`: retourne durée MP3 en secondes
- [ ] Créer `hooks/usePlaylist.js`:
  - State: playlist (array de tracks)
  - State: tracksCache (Map<trackId, {arrayBuffer, audioBuffer}>)
  - Function: addTrack(track)
  - Function: removeTrack(trackId)
  - Return: playlist, tracksCache, addTrack, removeTrack
- [ ] Créer `components/TrackUploader.jsx` (DJ only):
  - Input file ou drag-drop zone
  - On file select:
    - Lire fichier avec FileReader
    - Convertir en ArrayBuffer
    - Générer trackId avec `crypto.randomUUID()`
    - Calculer durée avec getAudioDuration
    - Broadcast event 'track-added' avec métadonnées: {id, name, size, duration}
    - Stocker dans tracksCache local (DJ)
  - Afficher loading pendant process
- [ ] Créer `components/Playlist.jsx`:
  - Affiche liste des tracks
  - Format: "1. Song.mp3 (3:45)"
  - Si DJ: bouton × pour supprimer track
- [ ] Dans `useRealtimeRoom.js`:
  - Écouter broadcast event 'track-added'
  - Callback: ajouter track à playlist
  - Return: sendBroadcast function
- [ ] Dans `RoomView.jsx`:
  - Afficher `<TrackUploader />` si isDJ
  - Afficher `<Playlist />`

### Délivrable
DJ peut uploader MP3, métadonnées sont broadcastées, tous les clients voient la playlist se remplir.

### Test
```
1. DJ: Ouvrir room en mode DJ
2. DJ: Drag & Drop un MP3 (ex: song.mp3, ~3MB)
3. → Affiche "Loading..." puis track apparaît dans playlist
4. → Playlist affiche: "1. song.mp3 (3:45)"
5. Spectateur: Ouvrir room (autre onglet)
6. → Spectateur voit aussi "1. song.mp3 (3:45)" dans playlist
7. DJ: Upload 2ème track
8. → Spectateur voit mise à jour en temps réel
9. Console: vérifier event 'track-added' reçu avec bon payload
```

**Note**: À ce stade, les fichiers MP3 ne sont PAS encore broadcastés (juste métadonnées).

---

## Phase 3: Broadcast MP3 Data + Reconstruction Spectateurs

### Tâches
- [ ] Dans `TrackUploader.jsx`, après broadcast 'track-added':
  - Si file.size < 5MB:
    - Encoder ArrayBuffer en base64
    - Broadcast event 'track-data' avec {trackId, data: base64}
  - Si file.size >= 5MB:
    - Split ArrayBuffer en chunks de 256KB
    - Pour chaque chunk:
      - Encoder chunk en base64
      - Broadcast event 'track-chunk' avec {trackId, index, total, data}
- [ ] Dans `useRealtimeRoom.js`:
  - Écouter broadcast event 'track-data'
  - Callback: décoder base64 → ArrayBuffer, stocker dans tracksCache
  - Écouter broadcast event 'track-chunk'
  - Callback: collecter chunks, réassembler quand tous reçus
- [ ] Dans `utils/audioUtils.js`:
  - `decodeMP3ToAudioBuffer(arrayBuffer, audioContext)`: retourne AudioBuffer décodé
- [ ] Créer `hooks/useAudioPlayer.js`:
  - State: audioContext (AudioContext)
  - State: currentSource (AudioBufferSourceNode)
  - Function: loadTrack(trackId, arrayBuffer) → decode et store AudioBuffer
  - Return: loadTrack, audioContext
- [ ] Dans `RoomView.jsx`:
  - Utiliser useAudioPlayer
  - Quand track-data reçu: appeler loadTrack pour décoder
- [ ] Afficher indicateur de chargement des tracks:
  - "Song.mp3 (downloading...)"
  - "Song.mp3 (ready)"

### Délivrable
DJ upload MP3 → données encodées base64 broadcastées → spectateurs reçoivent et décodent → tracks prêts à jouer.

### Test
```
1. DJ: Upload petit MP3 (<5MB)
2. → DJ: track apparaît "song.mp3 (ready)"
3. → Spectateur: voit "song.mp3 (downloading...)" puis "song.mp3 (ready)"
4. → Console spectateur: vérifier event 'track-data' reçu
5. → Console spectateur: vérifier ArrayBuffer décodé en AudioBuffer
6. DJ: Upload gros MP3 (>5MB si possible)
7. → Spectateur: voit chunks arriver progressivement
8. → Spectateur: track devient "ready" une fois tous chunks reçus
```

**Vérification technique**:
- Ouvrir DevTools → Application → LocalStorage
- Vérifier userId + nickname présents
- Console: `tracksCache.size` devrait être > 0

---

## Phase 4: Playback Audio Synchronisé

### Tâches
- [ ] Créer `components/NowPlaying.jsx`:
  - Affiche track en cours: nom + position / durée
  - Progress bar visuelle (optional, sinon juste texte)
  - Format: "▶ Song.mp3 [1:23 / 3:45]"
- [ ] Dans `useAudioPlayer.js`:
  - State: isPlaying, currentTrackId, playbackStartTime
  - Function: `playTrack(trackId, startPosition, timestamp)`:
    - Récupérer AudioBuffer depuis tracksCache
    - Calculer offset sync: `(Date.now() - timestamp) / 1000`
    - Créer BufferSource, connect, start à position syncedPosition
    - Set playbackStartTime
  - Function: `pauseTrack()`: stop current source
  - Function: `getCurrentPosition()`: retourne position actuelle
  - Return: playTrack, pauseTrack, getCurrentPosition, isPlaying, currentTrackId
- [ ] Créer `components/DJControls.jsx` (DJ only):
  - Boutons: [▶ Play] [⏸ Pause] [⏭ Skip]
  - Play:
    - Broadcast 'playback-state' avec {action: 'play', trackId, position: 0, timestamp: Date.now()}
    - Appeler playTrack local
  - Pause:
    - Broadcast 'playback-state' avec {action: 'pause', trackId, position: getCurrentPosition(), timestamp}
    - Appeler pauseTrack local
  - Skip:
    - Broadcast 'playback-state' avec {action: 'skip', nextTrackId, position: 0, timestamp}
    - Appeler playTrack avec next track
- [ ] Dans `useRealtimeRoom.js`:
  - Écouter broadcast event 'playback-state'
  - Callback: extraire {action, trackId, position, timestamp}
  - Appeler playTrack ou pauseTrack selon action
- [ ] Dans `RoomView.jsx`:
  - Afficher `<NowPlaying />`
  - Afficher `<DJControls />` si isDJ
  - Wire playback state entre components
- [ ] Implémenter re-sync périodique (DJ):
  - Toutes les 10s, broadcast position actuelle
  - Spectateurs ajustent si drift > 1s

### Délivrable
DJ peut play/pause/skip, tous les spectateurs écoutent en sync, audio joue via Web Audio API.

### Test
```
1. DJ: Upload un MP3, attendre "ready"
2. DJ: Clic [Play]
3. → DJ: audio démarre, affiche "▶ Song.mp3 [0:05 / 3:45]"
4. → Spectateur (autre onglet): audio démarre aussi
5. → Vérifier sync: les deux jouent au même moment (±1s tolérable)
6. DJ: Clic [Pause] après 10s
7. → DJ + Spectateur: audio stop, affiche position pause "0:10"
8. DJ: Clic [Play] à nouveau
9. → Les deux reprennent à la position correcte
10. DJ: Upload 2ème track, clic [Skip]
11. → Les deux passent au track 2
12. Mesurer désync:
    - Ouvrir DevTools → Console
    - DJ: noter position exacte (ex: 1:23.5)
    - Spectateur: noter position exacte
    - Différence devrait être < 1s
```

**Test sync avancé**:
```
1. DJ: Play track
2. Attendre 30s
3. Spectateur: rejoindre room après 30s
4. → Spectateur devrait démarrer audio à ~30s (position actuelle)
5. → Vérifier que spectateur est en sync avec DJ
```

---

## Phase 5: Late Joiners Support

### Tâches
- [ ] Dans `useRealtimeRoom.js`:
  - Écouter presence event 'join'
  - Si isDJ + nouveau participant:
    - Re-broadcast 'playlist-sync' avec liste complète tracks
    - Re-broadcast 'playback-state' actuel
- [ ] Dans `TrackUploader.jsx`:
  - Garder référence des tracks uploadés en state DJ
  - Function: `broadcastPlaylistToNewJoiner()`
    - Pour chaque track dans playlist:
      - Re-broadcast 'track-added'
      - Re-broadcast 'track-data' ou 'track-chunk'
- [ ] Dans `useRealtimeRoom.js`:
  - Écouter broadcast 'playlist-sync'
  - Callback: recevoir liste tracks, request data manquantes
- [ ] Dans `RoomView.jsx`:
  - Wire late joiner logic

### Délivrable
Spectateur rejoignant après upload de tracks reçoit automatiquement la playlist + les données audio.

### Test
```
1. DJ: Upload 2 tracks, play le premier
2. DJ: Laisser jouer 20s
3. Spectateur: rejoindre room APRÈS les uploads
4. → Spectateur voit playlist complète (2 tracks)
5. → Spectateur reçoit données MP3 automatiquement
6. → Spectateur entend audio en cours à la position ~20s
7. → Vérifier sync correcte malgré late join
```

---

## Phase 6: UI Polish + Error Handling

### Tâches
- [ ] Gestion erreurs:
  - Si Supabase connection échoue: afficher message
  - Si upload MP3 échoue: toast erreur
  - Si fichier > 10MB: refuser upload + message
  - Si format non-MP3: refuser upload
  - Si track décodage échoue: afficher erreur dans playlist
- [ ] UX improvements:
  - Bouton "Copy Link" pour partager room
  - Afficher nombre participants: "Participants: 3"
  - Afficher statut connection: "Connected" / "Disconnected"
  - Loading states: "Connecting...", "Loading track..."
  - Disable controls si pas de tracks ou track pas ready
- [ ] Dans `RoomView.jsx`:
  - Afficher lien partageable avec bouton copy
  - Gérer cas room vide (pas de DJ)
- [ ] CSS minimal:
  - Layout en flexbox
  - Zones délimitées (participants, playlist, controls)
  - Boutons stylisés basiques
  - Responsive (mobile OK)
- [ ] Cleanup on unmount:
  - Unsubscribe channel
  - Stop audio
  - Clear timers

### Délivrable
UI polie, gestion erreurs, copy link, UX fluide, pas de bugs évidents.

### Test
```
1. Test erreurs:
   - Upload fichier .txt → erreur "Invalid format"
   - Upload MP3 > 10MB → erreur "File too large"
   - Disconnect internet, reload → "Connection failed"

2. Test UX:
   - Clic "Copy Link" → lien copié dans clipboard
   - Paste lien dans nouvel onglet → join room OK
   - Affichage mobile (resize browser) → layout OK

3. Test edge cases:
   - DJ quitte room → spectateurs voient "DJ left"
   - Tous quittent room → room disparaît (Presence vide)
   - Refresh page spectateur → reconnect OK, sync OK

4. Test cleanup:
   - Play track, navigate away → audio stop
   - Rejoindre room → pas de leak mémoire (check DevTools Memory)
```

---

## Phase 7: Final Testing + Deploy

### Tâches
- [ ] Test full flow end-to-end:
  - Créer room → Upload 3 tracks → Play → Invite 2 spectateurs → Vérifier sync
- [ ] Test latence réseau:
  - Chrome DevTools → Network → Throttle "Fast 3G"
  - Vérifier sync avec latence
- [ ] Test multi-spectateurs:
  - Ouvrir 5+ onglets
  - Vérifier performance + sync
- [ ] Fix bugs trouvés
- [ ] Créer README.md avec:
  - Instructions setup
  - Comment run local
  - Comment créer Supabase project
  - Captures d'écran (optional)
- [ ] Setup Vercel:
  - Connecter repo GitHub
  - Configurer env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
  - Deploy
- [ ] Test en production:
  - URL Vercel
  - Inviter quelqu'un sur réseau différent
  - Vérifier sync avec vraie latence internet

### Délivrable
Application déployée, testée, fonctionnelle, accessible via URL publique.

### Test Final
```
1. Ouvrir URL Vercel
2. Créer room
3. Partager lien à ami sur téléphone/autre réseau
4. Upload MP3, play
5. → Ami entend musique en sync
6. → Désync < 2s acceptable
7. → No crashes, no console errors
8. → POC validé ✓
```

---

## Notes d'Implémentation

### Ordre des phases
Les phases doivent être faites **dans l'ordre**, car chacune dépend de la précédente.

### Checkpoints
À la fin de chaque phase, **commiter le code** avec message descriptif:
```
git add .
git commit -m "Phase 1: Create room + Presence"
```

### Debugging
Si stuck sur une phase:
1. Vérifier console browser (errors)
2. Vérifier Network tab (WebSocket frames)
3. Vérifier Supabase Dashboard (Realtime logs)
4. Simplifier: tester avec console.log les events Broadcast/Presence

### Priorités POC
- **P0 (must have)**: Phases 1-4 (create room, upload, playback sync)
- **P1 (should have)**: Phase 5 (late joiners)
- **P2 (nice to have)**: Phases 6-7 (polish, deploy)

Si temps limité (hackathon), focus sur P0 d'abord.

### Estimations
- Phase 0: 30min
- Phase 1: 1-2h
- Phase 2: 1-2h
- Phase 3: 2-3h (complexe: encoding/chunking)
- Phase 4: 2-3h (complexe: Web Audio sync)
- Phase 5: 1h
- Phase 6: 1-2h
- Phase 7: 1h

**Total: 10-15h** pour POC complet.

Pour hackathon 24h: largement faisable avec temps pour itération/bugs.
