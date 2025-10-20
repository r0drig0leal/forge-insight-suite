# Configuração CORS - Desenvolvimento = Produção

## 🎯 **Configuração Atual**

### **Sem Proxy - URL Absoluta em Todos os Ambientes**
```typescript
// src/lib/env.ts
BASE_URL: 'http://192.168.0.105:3000' // Sempre URL absoluta
```

### **Requisições Diretas:**
- **Desenvolvimento**: `http://192.168.0.105:8080` → `http://192.168.0.105:3000/api/address`
- **Produção**: `http://192.168.0.105:8080` → `http://192.168.0.105:3000/api/address`

## ⚠️ **CORS Precisa Ser Configurado no Backend**

Para que funcione, seu backend na porta 3000 deve ter CORS configurado:

### **Node.js/Express:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://192.168.0.105:8080',
    'http://localhost:8080',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-api-key'
  ]
}));
```

### **FastAPI (Python):**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://192.168.0.105:8080",
        "http://localhost:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Headers Manuais:**
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://192.168.0.105:8080');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  next();
});
```

## 🔄 **Status Atual**

### ✅ **Frontend (Implementado):**
- Proxy configurado no Vite
- URLs relativas em desenvolvimento
- Headers de autenticação mantidos

### 🔧 **Backend (Precisa Configurar):**
- Adicionar headers CORS
- Permitir origem: `http://192.168.0.105:8080`
- Permitir headers: `Authorization`, `x-api-key`

## 🚀 **Para Testar:**

1. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Teste o autocomplete** - agora deve funcionar via proxy

3. **Configure CORS no seu backend** para a solução definitiva

## 📝 **Logs de Debug**
O proxy está configurado com logs para debug:
- ✅ Requisições enviadas
- ✅ Respostas recebidas  
- ❌ Erros de conexão

## 🎯 **Próximos Passos**
1. **Implementar CORS no backend** (solução definitiva)
2. **Remover proxy** quando CORS estiver configurado
3. **Testar em produção** com URLs absolutas