# Configuração CORS Obrigatória no Backend

## 🎯 **Configuração Necessária**

Seu backend na porta **3000** deve permitir requisições da porta **8080**.

## 🔧 **Configurações por Tecnologia**

### **Node.js + Express**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://192.168.0.105:8080',
    'http://localhost:8080'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization', 
    'x-api-key'
  ],
  credentials: true
}));
```

### **Node.js + Fastify**
```javascript
await fastify.register(require('@fastify/cors'), {
  origin: ['http://192.168.0.105:8080', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
});
```

### **Python + FastAPI**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://192.168.0.105:8080",
        "http://localhost:8080"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "x-api-key"],
)
```

### **Python + Flask**
```python
from flask_cors import CORS

CORS(app, origins=[
    "http://192.168.0.105:8080",
    "http://localhost:8080"
], allow_headers=["Content-Type", "Authorization", "x-api-key"])
```

### **Headers Manuais (Qualquer Framework)**
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://192.168.0.105:8080');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

## 🚨 **Headers Obrigatórios**

Seu backend deve enviar estes headers:
```
Access-Control-Allow-Origin: http://192.168.0.105:8080
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, x-api-key
```

## ✅ **Teste**

Após configurar CORS no backend:
1. Reinicie seu servidor backend (porta 3000)
2. Reinicie o frontend: `npm run dev`
3. Teste o autocomplete no navegador

## 🔍 **Debug**

Para verificar se CORS está funcionando:
```bash
curl -X OPTIONS http://192.168.0.105:3000/api/address \
  -H "Origin: http://192.168.0.105:8080" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization, x-api-key" \
  -v
```

Deve retornar os headers CORS corretos.

## 📋 **Checklist**

- [ ] CORS configurado no backend
- [ ] Origem `http://192.168.0.105:8080` permitida
- [ ] Headers `Authorization` e `x-api-key` permitidos  
- [ ] Métodos `GET`, `OPTIONS` permitidos
- [ ] Backend reiniciado
- [ ] Frontend testado