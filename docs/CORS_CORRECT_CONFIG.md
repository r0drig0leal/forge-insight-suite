# CORS - Configuração Correta e Testada

## ✅ **Configuração CORS Correta para Node.js + Express**

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://192.168.0.105:8080',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
```

## 🔧 **Configuração Completa (Recomendada)**

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://192.168.0.105:8080',   // Frontend em produção/desenvolvimento
    'http://localhost:8080'        // Frontend local alternativo
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [               // ✅ Parâmetro correto: allowedHeaders
    'Content-Type',
    'Authorization', 
    'x-api-key'
  ],
  credentials: true
}));
```

## 🎯 **Configuração Mínima Testada**

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// CORS - Configuração mínima funcional
app.use(cors({
  origin: 'http://192.168.0.105:8080',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Seu endpoint de API
app.get('/api/address', (req, res) => {
  const search = req.query.search;
  // Sua lógica aqui
  res.json({ data: [] });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('API rodando na porta 3000');
});
```

## 🚨 **Verificações Importantes**

### **1. IP e Porta Corretos**
- ✅ **Frontend**: `http://192.168.0.105:8080`
- ✅ **Backend**: `http://192.168.0.105:3000`
- ✅ **Endpoint**: `http://192.168.0.105:3000/api/address`

### **2. Headers Obrigatórios**
```javascript
allowedHeaders: [               // ✅ Nome correto do parâmetro
  'Content-Type',               // ✅ Para JSON
  'Authorization',              // ✅ Para 'Bearer 7f2e1c9a-auctions-2025'
  'x-api-key'                   // ✅ Para '7f2e1c9a-auctions-2025'
]
```

### **3. Teste Manual**
```bash
# Teste CORS preflight
curl -X OPTIONS http://192.168.0.105:3000/api/address \
  -H "Origin: http://192.168.0.105:8080" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization, x-api-key" \
  -v

# Deve retornar:
# Access-Control-Allow-Origin: http://192.168.0.105:8080
# Access-Control-Allow-Headers: Content-Type, Authorization, x-api-key
```

## 🔍 **Debug e Troubleshooting**

### **Logs no Backend**
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', req.headers);
  next();
});
```

### **Headers de Resposta Esperados**
```
Access-Control-Allow-Origin: http://192.168.0.105:8080
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
Access-Control-Allow-Headers: Content-Type, Authorization, x-api-key
```

## ✅ **Checklist Final**

- [ ] **allowedHeaders** (não allowedHeaders) ✅
- [ ] Origin: `http://192.168.0.105:8080` ✅
- [ ] Headers: `Content-Type`, `Authorization`, `x-api-key` ✅
- [ ] Backend reiniciado ✅
- [ ] Frontend acessando mesmo IP/porta ✅

## 🚀 **Teste Final**

1. **Configure CORS exatamente como acima**
2. **Reinicie o backend** (porta 3000)
3. **Acesse**: `http://192.168.0.105:8080`
4. **Digite no campo** → Deve funcionar sem erros CORS!