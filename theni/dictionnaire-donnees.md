# Dictionnaire de Données — Application de Gestion de Formation (STEG)

Base de données relationnelle (MySQL / PostgreSQL / SQL Server) composée de **12 tables principales**.

---

## 1. roles

**Rôle principal :** référence les différents profils d'accès à l'application (Admin, Formateur, Participant, Manager, Superviseur) et y associe les permissions.

| Champ | Type SQL | Rôle | Description |
|---|---|---|---|
| id | INT | PK | Identifiant unique du rôle (auto-incrémenté) |
| nom | VARCHAR(50) | NN, UQ | Libellé du rôle (ADMIN, TRAINER, PARTICIPANT, MANAGER) |
| description | VARCHAR(255) | NULL | Description textuelle du rôle |
| permissions | JSON / TEXT | NULL | Liste des droits accordés (créer formations, gérer participants, accès finance...) |
| created_at | DATETIME | NN | Date de création |
| updated_at | DATETIME | NULL | Date de dernière modification |

**Relations :** Un rôle est associé à plusieurs `utilisateurs` (1 → N).

---

## 2. utilisateurs

**Rôle principal :** compte d'accès et fiche identité des personnes (administrateurs, formateurs, participants, managers).

| Champ | Type SQL | Rôle | Description |
|---|---|---|---|
| id | INT | PK | Identifiant unique |
| matricule | VARCHAR(20) | NN, UQ | Matricule STEG (ex : STEG-2024-001) |
| nom | VARCHAR(100) | NN | Nom et prénom |
| email | VARCHAR(150) | NN, UQ | Adresse e-mail (utilisée pour la connexion) |
| mot_de_passe | VARCHAR(255) | NN | Mot de passe (hashé) |
| genre | ENUM('M','F') | NULL | Genre du stagiaire |
| departement | VARCHAR(100) | NULL | Département (Distribution, Production, RH...) |
| role_id | INT | **FK → roles.id** | Rôle de l'utilisateur |
| status | ENUM('ACTIF','INACTIF') | NN | Actif ou désactivé |
| avatar | VARCHAR(255) | NULL | URL de l'avatar |
| created_at / updated_at | DATETIME | NN / NULL | Horodatage |

**Relations :**
- Appartient à un `role` (N → 1).
- Peut être décrit par une fiche `formateurs` (1 → 0..1).
- Peut occuper plusieurs `inscriptions`, `presences`, `evaluations`, `reclamations`, `certifications`.

---

## 3. formateurs

**Rôle principal :** profil détaillé des formateurs (spécialités, qualifications, disponibilités).

| Champ | Type SQL | Rôle | Description |
|---|---|---|---|
| id | INT | PK | Identifiant unique |
| utilisateur_id | INT | **FK → utilisateurs.id** | Lien vers le compte utilisateur du formateur |
| specialites | VARCHAR(255) | NN | Domaines d'expertise (Habilité Électrique, Sécurité Incendie...) |
| qualifications | VARCHAR(255) | NULL | Diplômes, certifications, titres |
| disponibilites | JSON | NULL | Créneaux de disponibilité (jours, horaires) |
| tarif_horaire | DECIMAL(10,2) | NULL | Rémunération horaire éventuelle |

**Relations :**
- Chaque formateur correspond à un `utilisateur` (1 → 1).
- Anime plusieurs `sessions` (1 → N).

---

## 4. formations (catalogue)

**Rôle principal :** catalogue des formations (titre, objectifs, prérequis, durée, prix).

| Champ | Type SQL | Rôle | Description |
|---|---|---|---|
| id | INT | PK | Identifiant unique |
| titre | VARCHAR(150) | NN | Intitulé de la formation (ex : Habilitation Électrique BR) |
| reference | VARCHAR(30) | NN, UQ | Référence interne (REF-HVS-2024) |
| categorie | VARCHAR(60) | NN | Sécurité, Technique, Management, IT & Logiciel |
| objectifs | TEXT | NULL | Objectifs pédagogiques (OBJECTIVES) |
| prerequis | TEXT | NULL | Prérequis exigés |
| modules | JSON / TEXT | NULL | Liste des modules du programme |
| duree | VARCHAR(20) | NN | Durée (ex : 40h) |
| prix | DECIMAL(10,2) | NULL | Prix du stage (pour la facturation) |
| max_participants | INT | NN | Capacité maximale |
| statut | ENUM('PLANNED','ACTIVE','IN_PROGRESS','COMPLETED','CANCELLED') | NN | État du catalogue |

**Relations :** Une formation donne lieu à plusieurs `sessions` (1 → N).

---

## 5. sessions

**Rôle principal :** occurrences planifiées d'une formation (dates, lieu, type intra/inter, formateur).

| Champ | Type SQL | Rôle | Description |
|---|---|---|---|
| id | INT | PK | Identifiant unique |
| formation_id | INT | **FK → formations.id** | Formation concernée |
| formateur_id | INT | **FK → formateurs.id** | Formateur qui anime |
| date_debut | DATE | NN | Date de début |
| date_fin | DATE | NN | Date de fin |
| heure | TIME | NULL | Heure de début (pratique STEG) |
| lieu | VARCHAR(150) | NN | Centre de formation / salle (Radès, Tunis...) |
| type | ENUM('INTER','INTRA') | NN | Stage inter-entreprises ou intra-entreprises |
| statut | ENUM('PENDING','CONFIRMED','ONGOING','COMPLETED','CANCELLED') | NN | État de la session |
| max_participants | INT | NULL | Capacité de la session |

**Relations :**
- Appartient à une `formation` (N → 1).
- Animée par un `formateur` (N → 1) qui est un `utilisateur`.
- Reçoit des `inscriptions`, des `presences`, des `evaluations` et des `supports_formation`.

---

## 6. inscriptions

**Rôle principal :** table de liaison entre participants et sessions + statut d'inscription.

| Champ | Type SQL | Rôle | Description |
|---|---|---|---|
| id | INT | PK | Identifiant unique |
| session_id | INT | **FK → sessions.id** | Session choisie |
| participant_id | INT | **FK → utilisateurs.id** | Participant (rol participant) |
| date_inscription | DATE | NN | Date d'inscription |
| statut | ENUM('ENROLLED','CONFIRMED','ATTENDED','CANCELLED','WAITLIST') | NN | État de l'inscription |

**Relations :**
- Un participant peut avoir plusieurs inscriptions (N → N entre `utilisateurs` et `sessions`, résolu par cette table).
- Sert de référence pour les `presences` et `evaluations` par session.

---

## 7. presences

**Rôle principal :** suivi jour par jour des présences aux sessions (et à la cantine).

| Champ | Type SQL | Rôle | Description |
|---|---|---|---|
| id | INT | PK | Identifiant unique |
| session_id | INT | **FK → sessions.id** | Session concernée |
| participant_id | INT | **FK → utilisateurs.id** | Participant |
| date | DATE | NN | Jour de présence |
| statut | ENUM('PRESENT','ABSENT','JUSTIFIED') | NN | Présent, absent ou absent justifié |
| note | VARCHAR(255) | NULL | Justification / remarque |
| cantine | BOOLEAN | NULL | Présence à la cantine (si applicable) |

**Relations :**
- Un participant a plusieurs lignes de `presences` par session (N → 1 vers `sessions` et `utilisateurs`).
- Construit les indicateurs de taux de présence.

---

## 8. evaluations

**Rôle principal :** notes des examens pré/post-formation et rapports de satisfaction.

| Champ | Type SQL | Rôle | Description |
|---|---|---|---|
| id | INT | PK | Identifiant unique |
| session_id | INT | **FK → sessions.id** | Session évaluée |
| participant_id | INT | **FK → utilisateurs.id** | Participant évalué |
| type | ENUM('PRE','POST','SATISFACTION') | NN | Examen avant, après ou enquête de satisfaction |
| score | DECIMAL(4,2) | NULL | Note sur 5 ou 20 (ex : 5.0) |
| commentaire | TEXT | NULL | Avis du participant |
| date | DATE | NN | Date de l'évaluation |
| statut | ENUM('OPEN','SUBMITTED','VALIDATED') | NULL | État de la campagne / réponse |

**Relations :** Une session donne lieu à plusieurs `evaluations` (1 → N). Un participant (utilisateur) peut en avoir plusieurs.

---

## 9. reclamations

**Rôle principal :** gestion des non-conformités et litiges (logistique, pédagogie, restauration...).

| Champ | Type SQL | Rôle | Description |
|---|---|---|---|
| id | VARCHAR(20) | PK | Numéro de réclamation (ex : RCL-2023-089) |
| participant_id | INT | **FK → utilisateurs.id** | Auteur de la réclamation |
| formation_id | INT | **FK → formations.id** | Formation concernée |
| session_id | INT | **FK → sessions.id** | Session concernée (optionnelle) |
| type | ENUM('LOGISTIQUE','PEDAGOGIE','RESTAURATION','AUTRE') | NN | Catégorie de la réclamation |
| priorite | ENUM('HAUTE','MOYENNE','BASSE') | NN | Niveau de priorité |
| titre | VARCHAR(150) | NULL | Objet de la réclamation |
| description | TEXT | NN | Détail du litige |
| centre | VARCHAR(100) | NULL | Centre concerné |
| date | DATE | NN | Date de dépôt |
| statut | ENUM('OUVERT','EN_COURS','RESOLU','CLOS') | NN | Suivi du traitement |

**Relations :** Déposée par un `utilisateur` (N → 1), liée à une `formation` et éventuellement à une `session`.

---

## 10. certifications

**Rôle principal :** suivi des certificats délivrés, date de renouvellement et QR code.

| Champ | Type SQL | Rôle | Description |
|---|---|---|---|
| id | INT | PK | Identifiant unique |
| reference | VARCHAR(30) | NN, UQ | Réf. certificat (CERT-2023-001) |
| participant_id | INT | **FK → utilisateurs.id** | Participant certifié |
| formation_id | INT | **FK → formations.id** | Formation validée |
| session_id | INT | **FK → sessions.id** | Session d'origine |
| date_emission | DATE | NN | Date d'émission |
| date_expiration | DATE | NULL | Date d'échéance (renouvellement) |
| statut | ENUM('VALIDE','EXPIRE','RENOUVELLEMENT') | NN | État du certificat |
| qr_code | VARCHAR(255) | NULL | Lien/URL du QR code de vérification |

**Relations :** Un participant peut détenir plusieurs `certifications` (N → 1 vers `utilisateurs` et `formations`).

---

## 11. factures (finance)

**Rôle principal :** suivi des coûts, revenus, marges et paiements.

| Champ | Type SQL | Rôle | Description |
|---|---|---|---|
| id | VARCHAR(20) | PK | Numéro de facture (ex : FAC-2023-0142) |
| client | VARCHAR(150) | NN | Client / entité (Direction Régionale, Ministère...) |
| formation_id | INT | **FK → formations.id** | Formation facturée |
| session_id | INT | **FK → sessions.id** | Session facturée |
| montant | DECIMAL(12,2) | NN | Montant total (HT) |
| tva | DECIMAL(5,2) | NULL | Taux de TVA |
| date | DATE | NN | Date de facturation |
| statut | ENUM('PAYEE','EN_ATTENTE','EN_RETARD','ANNULEE') | NN | État du paiement |
| date_paiement | DATE | NULL | Date effective du paiement |

**Relations :** Une facture concerne une `formation` (N → 1) et éventuellement une `session` ; calcul des indicateurs budget `Indicateurs.jsx`.

---

## 12. supports_formation

**Rôle principal :** archivage des documents et supports pédagogiques par session.

| Champ | Type SQL | Rôle | Description |
|---|---|---|---|
| id | INT | PK | Identifiant unique |
| session_id | INT | **FK → sessions.id** | Session associée |
| nom | VARCHAR(255) | NN | Nom du document |
| chemin | VARCHAR(255) | NN | Chemin / URL du fichier |
| categorie | VARCHAR(60) | NULL | Sous-dossier (Cours, TD, Attestations...) |
| type | VARCHAR(20) | NULL | Extension (PDF, PPTX...) |
| taille | VARCHAR(20) | NULL | Taille du fichier |
| statut | ENUM('VALIDE','EN_ATTENTE') | NN | Validation du document |
| uploader_id | INT | **FK → utilisateurs.id** | Personne ayant déposé |

**Relations :** Plusieurs supports par `session` (N → 1). Alimente les pages `GestionDocumentaire` et `PrevisualisationDocument`.

---

## Récapitulatif des relations

```
roles ──1─< utilisateurs ──1─< formateurs
                  │
                  ├──< inscriptions >── sessions ──>── formations
                  │                        │  │  │        │
                  │                        │  │  │        └──> factures
                  │                        │  │  └──> supports_formation
                  │                        │  └──> presences
                  │                        └──> evaluations
                  ├──< reclamations >── formation/session
                  └──< certifications >── formation/session
```

- **clés étrangères sortantes (FK)** : chaque table porte `id` en PK ; les FK pointent toujours vers une PK d'une autre table.
- **tables de liaison** : `inscriptions` (utilisateurs ↔ sessions) ; les relations N→N sont toutes résolues par une table pivot.