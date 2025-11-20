# SunoRooms - Architecture Technique (POC)

## Vue d'ensemble

Architecture ultra-minimaliste utilisant **uniquement Supabase Realtime** (pas de Database, pas de Storage). Tout l'état est géré en mémoire côté clients et synchronisé via WebSocket.

```
┌─────────────────┐         ┌─────────────────┐
│   DJ Client     │         │  Spectator      │
│  (React/Vite)   │         │    Client       │
│  + Web Audio    │         │  + Web Audio    │
└────────┬────────┘         └────────┬────────┘
         │                           │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Supabase Realtime    │
         │  ─────────────────    │
         │  • Channels (rooms)   │
         │  • Broadcast (sync)   │
         │  • Presence (users)   │
         └───────────────────────┘
```

## Stack Technique

### Frontend
- **Framework**: React + Vite
- **Audio**: Web Audio API
- **Supabase**: @supabase/supabase-js (Realtime uniquement)
- **UI**: HTML/CSS minimal (texte brut pour POC)

### Supabase (Realtime Only)
- **Channels**: Une room = un channel unique
- **Broadcast**: Synchronisation état + transfer MP3
- **Presence**: Liste des participants (DJ + spectateurs)
- **Pas de Database, pas de Storage, pas d'Auth**

## Architecture Supabase Realtime

### Channel = Room

Chaque room est un **Supabase Realtime Channel** identifié par un slug:

```javascript
const roomSlug = 'funky-tiger-42';
const channel = supabase.channel(roomSlug);
```

### Presence: Tracking des Participants

Utilise **Presence** pour tracker qui est dans la room:

```javascript
const channel = supabase.channel(roomSlug, {
  config: {
    presence: {
      key: userId, // ID unique généré côté client
    },
  },
});

// Track presence
channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState();
  console.log('Participants:', state);
  // { 'user-123': [{nickname: 'DJ_Alice', isDJ: true}], ... }
});

// Annoncer présence
channel.track({
  nickname: 'DJ_Alice',
  isDJ: true,
  online_at: new Date().toISOString(),
});

channel.subscribe();
```

### Broadcast: Synchronisation des Events

Utilise **Broadcast** pour envoyer des events entre clients:

```javascript
// Écouter les events
channel.on('broadcast', { event: 'playback-state' }, (payload) => {
  console.log('Playback state:', payload);
});

channel.on('broadcast', { event: 'track-added' }, (payload) => {
  console.log('New track:', payload);
});

channel.on('broadcast', { event: 'track-data' }, (payload) => {
  console.log('Track chunk:', payload);
});

// Envoyer un event
channel.send({
  type: 'broadcast',
  event: 'playback-state',
  payload: {
    isPlaying: true,
    currentTrackId: 'track-123',
    position: 42.5,
    timestamp: Date.now(),
  },
});
```

## Structure Frontend

```
src/
├── components/
│   ├── CreateRoom.jsx         # Créer une room (génère slug)
│   ├── JoinRoom.jsx           # Rejoindre via /room/:slug
│   ├── RoomView.jsx           # Vue principale de la room
│   ├── DJControls.jsx         # Play/Pause/Skip
│   ├── TrackUploader.jsx      # Upload MP3
│   ├── Playlist.jsx           # Queue des tracks
│   ├── NowPlaying.jsx         # Track en cours
│   └── Participants.jsx       # Liste DJ + spectateurs
├── hooks/
│   ├── useRealtimeRoom.js     # Gestion channel + presence
│   ├── useAudioPlayer.js      # Web Audio API + sync
│   └── usePlaylist.js         # Gestion queue tracks
├── utils/
│   ├── supabase.js            # Client Supabase config
│   ├── audioUtils.js          # MP3 → ArrayBuffer → base64
│   └── slugGenerator.js       # Génération slug room
└── App.jsx
```

## Flux de Données

### 1. Création de Room

```
1. DJ → Clic "Create Room"
2. Frontend → Génère slug unique: 'funky-tiger-42'
3. Frontend → Créer channel Supabase: supabase.channel('funky-tiger-42')
4. Frontend → Track presence avec isDJ: true
5. Frontend → Subscribe au channel
6. Frontend → Redirect vers /room/funky-tiger-42
7. Frontend → Affiche lien à partager
```

Pas de DB, le channel existe dès qu'un client s'y connecte.

### 2. Rejoindre une Room

```
1. Spectateur → Ouvre lien /room/funky-tiger-42
2. Frontend → Créer channel avec même slug
3. Frontend → Track presence avec isDJ: false
4. Frontend → Subscribe au channel
5. Frontend → Écoute les events broadcast
6. Frontend → Affiche état actuel (via events DJ)
```

### 3. Upload MP3 par le DJ

**Option A: Petit fichier (<5MB) - Base64 Broadcast Direct**

```
1. DJ → Drag & Drop MP3
2. Frontend → Lit fichier avec FileReader
3. Frontend → Convertit en ArrayBuffer
4. Frontend → Encode en base64
5. Frontend → Broadcast event 'track-added' avec métadonnées
6. Frontend → Broadcast event 'track-data' avec base64
7. Tous les clients → Reçoivent et décodent MP3
8. Clients → Stockent en mémoire (Map<trackId, AudioBuffer>)
```

**Option B: Gros fichier (>5MB) - Chunking**

```
1. DJ → Drag & Drop MP3
2. Frontend → Split en chunks de 256KB
3. Frontend → Broadcast 'track-added' avec {id, totalChunks, metadata}
4. Frontend → Broadcast 'track-chunk' pour chaque chunk {trackId, index, data}
5. Clients → Reçoivent et réassemblent chunks
6. Clients → Décodent MP3 complet une fois tous chunks reçus
```

**Limitation Broadcast**: Les payloads Supabase Realtime sont en JSON. Pour données binaires:
- Encoder en base64 (augmente taille de ~33%)
- Limite de payload inconnue (à tester, probablement ~1-2MB par message)

### 4. Lecture Synchronisée

```
1. DJ → Clic "Play" sur Track 1
2. DJ Frontend → Broadcast 'playback-state':
   {
     isPlaying: true,
     currentTrackId: 'track-123',
     startTimestamp: Date.now(),
     startPosition: 0
   }
3. Spectateurs → Reçoivent event via broadcast
4. Spectateurs → Calculent offset:
   currentOffset = (Date.now() - startTimestamp) / 1000
5. Spectateurs → Démarrent Web Audio à position startPosition + currentOffset
6. Tous écoutent en sync (avec ~100-500ms de désync acceptable)
```

**Re-sync périodique**:
- DJ broadcast position toutes les 5-10s
- Spectateurs ajustent si drift > 1s

### 5. Contrôles DJ

**Play/Pause/Skip** → Broadcast immédiat de l'état:

```javascript
// Play
channel.send({
  type: 'broadcast',
  event: 'playback-state',
  payload: {
    action: 'play',
    trackId: currentTrack.id,
    position: 0,
    timestamp: Date.now(),
  },
});

// Pause
channel.send({
  type: 'broadcast',
  event: 'playback-state',
  payload: {
    action: 'pause',
    trackId: currentTrack.id,
    position: audioContext.currentTime,
    timestamp: Date.now(),
  },
});

// Skip
channel.send({
  type: 'broadcast',
  event: 'playback-state',
  payload: {
    action: 'skip',
    nextTrackId: nextTrack.id,
    position: 0,
    timestamp: Date.now(),
  },
});
```

## Gestion MP3 en Mémoire

### Upload & Encoding (DJ)

```javascript
async function handleMP3Upload(file) {
  // Lire fichier
  const arrayBuffer = await file.arrayBuffer();

  // Générer ID unique
  const trackId = crypto.randomUUID();

  // Encoder en base64
  const base64 = arrayBufferToBase64(arrayBuffer);

  // Broadcast métadonnées
  channel.send({
    type: 'broadcast',
    event: 'track-added',
    payload: {
      id: trackId,
      name: file.name,
      size: file.size,
      duration: await getAudioDuration(arrayBuffer),
    },
  });

  // Broadcast données (si petit fichier)
  if (file.size < 5_000_000) {
    channel.send({
      type: 'broadcast',
      event: 'track-data',
      payload: {
        trackId,
        data: base64,
      },
    });
  } else {
    // Chunking pour gros fichiers
    await broadcastTrackChunked(trackId, arrayBuffer);
  }

  // Stocker localement
  await decodeAndStore(trackId, arrayBuffer);
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
```

### Receive & Decode (Spectateurs)

```javascript
channel.on('broadcast', { event: 'track-data' }, async ({ payload }) => {
  const { trackId, data } = payload;

  // Décoder base64 → ArrayBuffer
  const arrayBuffer = base64ToArrayBuffer(data);

  // Décoder MP3 → AudioBuffer
  await decodeAndStore(trackId, arrayBuffer);
});

async function decodeAndStore(trackId, arrayBuffer) {
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Stocker en mémoire
  tracksCache.set(trackId, audioBuffer);
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
```

## Web Audio API - Playback Synchronisé

```javascript
let audioSource = null;
let audioContext = new AudioContext();
let playbackStartTime = null;

function playTrack(trackId, startPosition = 0, timestamp) {
  // Récupérer AudioBuffer du cache
  const audioBuffer = tracksCache.get(trackId);
  if (!audioBuffer) {
    console.error('Track not loaded:', trackId);
    return;
  }

  // Stop track précédent si existe
  if (audioSource) {
    audioSource.stop();
  }

  // Calculer offset de sync
  const now = Date.now();
  const offset = (now - timestamp) / 1000; // secondes écoulées
  const syncedPosition = startPosition + offset;

  // Créer source
  audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  audioSource.connect(audioContext.destination);

  // Démarrer à la position synchronisée
  audioSource.start(0, syncedPosition);
  playbackStartTime = audioContext.currentTime - syncedPosition;

  // Event fin de track
  audioSource.onended = () => {
    // Auto-skip au prochain track
    if (isDJ) {
      playNextTrack();
    }
  };
}

function pauseTrack() {
  if (audioSource) {
    audioSource.stop();
    audioSource = null;
  }
}

function getCurrentPosition() {
  if (!playbackStartTime) return 0;
  return audioContext.currentTime - playbackStartTime;
}
```

## Events Broadcast

### Events DJ → Spectateurs

| Event | Payload | Description |
|-------|---------|-------------|
| `track-added` | `{id, name, size, duration}` | Nouveau track dans queue |
| `track-data` | `{trackId, data: base64}` | Données MP3 (petit fichier) |
| `track-chunk` | `{trackId, index, total, data}` | Chunk MP3 (gros fichier) |
| `playback-state` | `{action, trackId, position, timestamp}` | Play/Pause/Skip |
| `queue-updated` | `{tracks: []}` | Ordre de la queue changé |
| `sync-position` | `{trackId, position, timestamp}` | Re-sync périodique |

### Events Spectateurs → DJ (optionnel)

| Event | Payload | Description |
|-------|---------|-------------|
| `reaction` | `{emoji, userId}` | Réaction spectateur (future) |

## State Management Côté Client

### DJ State

```javascript
const djState = {
  roomSlug: 'funky-tiger-42',
  isDJ: true,
  playlist: [
    { id: 'track-1', name: 'Song1.mp3', duration: 180 },
    { id: 'track-2', name: 'Song2.mp3', duration: 240 },
  ],
  currentTrack: 'track-1',
  isPlaying: false,
  position: 0,
  tracksCache: new Map(), // trackId → AudioBuffer
};
```

### Spectateur State

```javascript
const spectatorState = {
  roomSlug: 'funky-tiger-42',
  isDJ: false,
  playlist: [], // Reçu via broadcast
  currentTrack: null,
  isPlaying: false,
  position: 0,
  tracksCache: new Map(),
};
```

## Gestion des Participants (Presence)

```javascript
// Track presence DJ
channel.track({
  userId: 'dj-alice-123',
  nickname: 'DJ Alice',
  isDJ: true,
  joinedAt: Date.now(),
});

// Track presence Spectateur
channel.track({
  userId: 'user-456',
  nickname: 'User_456',
  isDJ: false,
  joinedAt: Date.now(),
});

// Écouter changements
channel.on('presence', { event: 'sync' }, () => {
  const participants = channel.presenceState();
  updateParticipantsList(participants);
});

channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
  console.log('User joined:', newPresences);
});

channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
  console.log('User left:', leftPresences);
});
```

## UI Minimaliste (POC)

### Structure Visuelle

```
┌─────────────────────────────────────────────┐
│ 🎵 SunoRooms                                │
│                                             │
│ Room: funky-tiger-42                        │
│ Link: http://localhost:5173/r/funky-tiger   │
│ [Copy Link]                                 │
├─────────────────────────────────────────────┤
│ Now Playing:                                │
│ ▶ Song1.mp3                                 │
│ [████████░░░░░] 1:23 / 3:00                 │
├─────────────────────────────────────────────┤
│ DJ Controls:                                │
│ [▶ Play] [⏸ Pause] [⏭ Skip]                 │
├─────────────────────────────────────────────┤
│ Playlist:                                   │
│  1. ▶ Song1.mp3 (3:00)                      │
│  2.   Song2.mp3 (4:00)                      │
│  3.   Song3.mp3 (2:45)                      │
│                                             │
│ [Drop MP3 files here or click to upload]   │
├─────────────────────────────────────────────┤
│ Participants: 3                             │
│  🎧 DJ Alice (DJ)                           │
│  👤 User_1234                               │
│  👤 User_5678                               │
└─────────────────────────────────────────────┘
```

Tout en texte/caractères, aucun sprite/image pour le POC.

## Génération Slug Room

```javascript
// utils/slugGenerator.js
const adjectives = ['funky', 'groovy', 'electric', 'cosmic', 'stellar'];
const animals = ['tiger', 'panda', 'eagle', 'dolphin', 'phoenix'];

export function generateRoomSlug() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}-${animal}-${num}`;
}
```

## Gestion des IDs Anonymes

```javascript
// Générer userId unique et persistant
export function getUserId() {
  let userId = localStorage.getItem('sunorooms_user_id');
  if (!userId) {
    userId = `user_${crypto.randomUUID()}`;
    localStorage.setItem('sunorooms_user_id', userId);
  }
  return userId;
}

// Générer nickname aléatoire
export function generateNickname() {
  const stored = localStorage.getItem('sunorooms_nickname');
  if (stored) return stored;

  const nickname = `User_${Math.floor(Math.random() * 10000)}`;
  localStorage.setItem('sunorooms_nickname', nickname);
  return nickname;
}
```

## Défis & Solutions

### 1. Taille des Payloads Broadcast

**Défi**: Supabase Broadcast utilise JSON, limite de taille inconnue

**Solutions**:
- Petits MP3 (<3MB): encoder base64 et broadcast direct
- Gros MP3 (>3MB): chunking en morceaux de 256KB
- Très gros (>10MB): afficher erreur, limiter upload

**Test à faire**: Déterminer limite max payload Broadcast

### 2. Synchronisation Audio

**Défi**: Latence réseau + clock drift

**Solutions**:
- Timestamp-based sync avec `Date.now()`
- Re-sync toutes les 10s via broadcast DJ
- Tolérance ±500ms acceptable pour POC
- Afficher indicateur si désync > 2s

### 3. Late Joiners

**Défi**: Spectateur rejoint après que tracks soient uploadés

**Solutions**:
- DJ garde tracks en cache local
- Quand nouveau spectateur join (Presence event), DJ re-broadcast métadonnées + data
- Ou: DJ broadcast liste tracks au subscribe, spectateurs demandent data manquante

**Implémentation**:
```javascript
channel.on('presence', { event: 'join' }, ({ newPresences }) => {
  if (isDJ) {
    // Re-broadcast current state
    broadcastCurrentPlaylist();
    broadcastPlaybackState();
  }
});
```

### 4. Disconnections

**Défi**: DJ ou spectateur se déconnecte

**Solutions**:
- Presence détecte déconnexions automatiquement
- Si DJ part: room devient "orphan", premier spectateur peut devenir DJ (future)
- Pour POC: si DJ part, room meurt, spectateurs voient message

### 5. Limite Mémoire Client

**Défi**: 10 tracks × 5MB = 50MB en RAM côté spectateur

**Solutions**:
- Limite 10 tracks max dans queue
- Limite 5MB par fichier
- Décharger tracks non jouées depuis >30min

## Limitations du POC

1. **Pas de persistance**: Room existe tant qu'au moins 1 client connecté
2. **Pas d'historique**: Spectateurs rejoignant après upload ne reçoivent tracks que si DJ les re-broadcast
3. **Taille fichiers**: Limité par payload Broadcast (~3-5MB safe)
4. **Scalabilité**: OK pour 10-20 participants, pas testé au-delà
5. **Désync audio**: ~200-1000ms acceptable, pas de sync parfaite
6. **Pas de fallback**: Si Broadcast échoue, pas de retry automatique

## Configuration Supabase

### Créer Projet Supabase

1. Aller sur https://supabase.com
2. Créer nouveau projet
3. Récupérer:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### Configuration Client

```javascript
// src/utils/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10, // Limite rate pour dev
    },
  },
});
```

### .env.local

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

**Pas besoin de configurer Database, Storage, Auth** - seulement Realtime!

## Déploiement

### Frontend
- **Vercel** (recommandé) ou Netlify
- Build Vite automatique
- Variables d'env Supabase

### Supabase
- Projet gratuit suffit
- Vérifier quotas Realtime (connections, messages/sec)
- Monitoring dans Dashboard Supabase

## Prochaines Étapes d'Implémentation

1. **Setup projet**
   ```bash
   npm create vite@latest sunorooms -- --template react
   cd sunorooms
   npm install @supabase/supabase-js
   ```

2. **Créer composants de base**
   - CreateRoom (génère slug)
   - JoinRoom (via URL param)
   - RoomView (conteneur)

3. **Implémenter Realtime hooks**
   - `useRealtimeRoom(slug)` → channel, presence, broadcast
   - `usePresence(channel)` → participants list
   - `useBroadcast(channel)` → send/receive events

4. **Implémenter Audio**
   - Upload MP3 → base64
   - Broadcast track data
   - Web Audio playback + sync

5. **Tester**
   - Ouvrir 2-3 onglets
   - Créer room dans un, join dans autres
   - Upload MP3, play, vérifier sync

6. **Deploy**
   - Push sur GitHub
   - Deploy Vercel
   - Tester avec vraie latence réseau

## Conclusion

Cette architecture **serverless pure** utilise uniquement Supabase Realtime (Channels + Broadcast + Presence) sans aucune Database ni Storage. Tout l'état est en mémoire côté clients et synchronisé en temps réel via WebSocket.

**Avantages**:
- Ultra simple à implémenter
- Pas de backend à gérer
- Pas de schéma DB à créer
- Coût zéro (tier gratuit Supabase)

**Compromis**:
- Pas de persistance (POC acceptable)
- Limite taille fichiers
- Désync audio ~500ms
- Late joiners nécessitent re-broadcast

Pour un POC/hackathon, ces compromis sont totalement acceptables. L'objectif est de prouver le concept, pas de construire un produit production-ready.
