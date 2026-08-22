# Architecture Full-Stack STEG Formation

## 📋 Parcours complet d'une donnée (Exemple: Table Role)

### 1. 🗄️ Source de vérité : Base de données MySQL

**Schéma Prisma** (`steg-formation-backend/prisma/schema.prisma`) :
```prisma
model Role {
  id          Int      @id @default(autoincrement())
  nomRole     String   @unique @map("nom_role")
  description String?  @db.Text
  utilisateurs Utilisateur[]
  
  @@map("roles")
}
```

**Génération client** : `prisma generate` → permet `prisma.role.findMany()`

---

### 2. 🔧 Backend : Chaîne de requête Express

**Flux de requête** : `GET /api/roles`
```
Vite Proxy → Express → Routes → Controller → Prisma → MySQL
```

#### **2.1 Serveur principal**
```javascript
// src/server.js
app.use('/api/roles', require('./routes/role.routes'))
```

#### **2.2 Routage + Middleware**
```javascript
// src/routes/role.routes.js
router.get('/', 
  authMiddleware,           // Vérification JWT
  rbacMiddleware('admin'),  // Contrôle rôle admin
  getRoles                 // Controller
);
```

#### **2.3 Controller + Base de données**
```javascript
// src/controllers/role.controller.js
const roles = await prisma.role.findMany({
  select: {
    id: true,
    nomRole: true,
    description: true,
    _count: {
      select: { utilisateurs: true }
    }
  }
});

res.json({ 
  success: true, 
  count: roles.length, 
  roles 
});
```

---

### 3. 🌉 Le pont : Vite Proxy + Axios

#### **3.1 Configuration Vite**
```javascript
// theni/vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000'  // Redirection backend
    }
  }
}
```
**Évite les problèmes CORS en développement**

#### **3.2 Client Axios configuré**
```javascript
// theni/src/services/config/api.js
const api = axios.create({
  baseURL: '/api',  // Utilise le proxy Vite
  headers: { 'Content-Type': 'application/json' }
});

// Intercepteur : JWT automatique
api.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur : gestion erreurs 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);
```

---

### 4. 🎨 Frontend : Page React consommatrice

#### **4.1 Service API**
```javascript
// theni/src/services/auth/roleService.js
class RoleService {
  async getAllRoles() {
    const { data } = await api.get('/roles');
    return data; // { success, count, roles }
  }

  async createRole(roleData) {
    const { data } = await api.post('/roles', roleData);
    return data; // { success, role }
  }
}
```

#### **4.2 Composant React**
```javascript
// theni/src/pages/admin/GestionDesRoles.jsx
const [roles, setRoles] = useState([]);

useEffect(() => {
  const fetchRoles = async () => {
    try {
      const response = await roleService.getAllRoles();
      setRoles(response.roles || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  fetchRoles();
}, []);

// Affichage JSX
{roles.map(role => (
  <div key={role.id}>
    <h3>{role.nomRole}</h3>
    <p>{role.description}</p>
    <span>Utilisateurs: {role._count.utilisateurs}</span>
  </div>
))}
```

---

### 5. 📊 Schéma de communication résumé

```
[Frontend React]              [Backend Express]           [MySQL]
                                                             │
GestionDesRoles.jsx           role.routes.js               │
│  api.get('/roles')          │  authMiddleware (JWT)      │
▼                             │  rbacMiddleware (admin)    │
axios (config/api.js)         ▼                           │
│  baseURL: '/api'           role.controller.js           │
│  Authorization: Bearer      │  prisma.role.findMany()   │
▼                             ▼                           ▼
Vite Proxy                   Prisma Client              roles table
│  /api/* → :5000            │  SELECT * FROM roles      │  id, nom_role,
▼                             ▼                           │  description
Express Server               JSON Response               │
│  PORT=5000                 │  { success, roles }        │
▼                             ▼                           │
Route Handler                React State Update          │
```

---

### 6. 🔐 Sécurité et Authentification

#### **6.1 Flux d'authentification**
```
1. Login → Backend génère JWT
2. JWT stocké dans localStorage  
3. Axios ajoute automatiquement le token
4. Backend vérifie JWT + permissions RBAC
5. Si 401 → Redirection /connexion
```

#### **6.2 Contrôle d'accès par rôle**
```javascript
// Backend middleware
rbacMiddleware('admin') // Seuls les admins
rbacMiddleware(['admin', 'formateur']) // Admin ou formateur
```

---

### 7. 🚀 Avantages de cette architecture

✅ **Séparation claire** : Frontend/Backend découplés  
✅ **Sécurité** : JWT + RBAC intégrés  
✅ **Développement** : Proxy Vite évite CORS  
✅ **Type-safety** : Prisma génère les types  
✅ **Maintenabilité** : Services organisés par domaine  
✅ **Scalabilité** : Architecture modulaire  

---

### 8. 📝 Convention de nommage

| Élément | Backend | Frontend |
|---------|---------|----------|
| **Tables** | `roles`, `utilisateurs` | - |
| **Models** | `Role`, `Utilisateur` | - |
| **Routes** | `/api/roles` | `api.get('/roles')` |
| **Controllers** | `getRoles()` | `roleService.getAllRoles()` |
| **Réponses** | `{ success, roles }` | `response.roles` |

Cette architecture garantit une communication fluide et sécurisée entre le frontend React et le backend Express/Prisma. 🎯