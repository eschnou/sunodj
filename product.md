# SunoRooms - Product Vision

## Vision

SunoRooms est une application web de streaming musical collaboratif qui permet à un DJ de créer une room et de partager 
une expérience d'écoute synchronisée avec ses amis en temps réel.

Inspiré par turntable.fm, SunoRooms permet de recréer l'ambiance d'une soirée musicale partagée, où tout le monde écoute 
la même musique au même moment, peu importe où ils se trouvent.

## Concept

Un DJ crée une room, upload sa playlist de MP3, et partage le lien avec ses amis. Les spectateurs rejoignent la room et
écoutent la musique en parfaite synchronisation avec le DJ et les autres participants.

## Features Clés (POC/MVP)

### 1. Gestion des Rooms
- **Création de room** : Un DJ peut créer une nouvelle room
- **Partage de lien** : Génération d'un lien unique partageable pour inviter des amis
- **Accès direct** : Les spectateurs rejoignent la room via le lien sans authentification

### 2. Rôles Utilisateurs
- **DJ (hôte)** : Créateur de la room, contrôle la playlist
- **Spectateur** : Rejoint la room, écoute la musique

### 3. Upload & Playlist
- **Upload MP3** : Le DJ peut uploader des fichiers MP3 (drag & drop)
- **Queue de lecture** : Les MP3 sont ajoutés à une queue visible
- **Gestion de la queue** : Le DJ peut réorganiser l'ordre des morceaux (drag & drop)

### 4. Lecture Synchronisée
- **Playback synchronisé** : Tous les utilisateurs entendent la même musique au même moment
- **Contrôles DJ** : Play, pause, skip (uniquement pour le DJ)
- **État partagé** : Progression de lecture visible pour tous

### 5. Interface Temps Réel
- **Liste des participants** : Voir qui est dans la room (DJ + spectateurs)
- **Now playing** : Affichage du morceau en cours
- **Queue visible** : Tous peuvent voir la playlist à venir

## User Stories (POC)

### En tant que DJ
- Je peux créer une room et obtenir un lien partageable
- Je peux uploader des MP3 en drag & drop
- Je peux organiser ma playlist
- Je peux contrôler la lecture (play/pause/skip)
- Je vois la liste des spectateurs dans ma room

### En tant que Spectateur
- Je peux rejoindre une room via un lien
- J'entends la musique en synchronisation avec le DJ
- Je vois le morceau en cours et la queue à venir
- Je vois les autres participants dans la room

## Contraintes Techniques (POC)

### Scope Limité
- Pas d'authentification utilisateur (accès anonyme)
- Pas de persistance long terme (les rooms existent le temps de la session)
- Upload MP3 uniquement (pas de streaming externe)
- Une seule room active par DJ à la fois

### Simplicité
- Interface minimaliste et fonctionnelle
- Pas de chat (focus sur la musique)
- Pas de système de vote ou de réactions
- Pas d'historique de lecture

## Prochaines Étapes (Hors POC)

- Système de chat textuel
- Réactions en temps réel (emoji, likes)
- Historique de lecture
- Playlists sauvegardées
- Support Spotify/SoundCloud/YouTube
- Authentification utilisateurs
- Rooms persistantes
- Système de DJ tournant (plusieurs DJs dans une room)
