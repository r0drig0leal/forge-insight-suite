# 🔧 Configuração do Endpoint de Parcel ID

## ❌ **Problema Atual:**
```
GET http://192.168.0.105:3000/api/parcel-id-by-address?address=... 404 (Not Found)
```

## ✅ **Endpoint Específico Necessário:**

### **Frontend chama exatamente:**
```
GET /api/parcel-id-by-address?address=15223 Book Club Rd, Winter Garden, 34787
```

### **Backend deve retornar:**
```json
{
  "parcel_id": "ID_REAL_DO_BANCO"
}
```

## 🚀 **Implementação no Backend:**

### **Opção 1: Query Simples**
```javascript
app.get('/api/parcel-id-by-address', async (req, res) => {
  try {
    const { address } = req.query;
    console.log('🔍 Searching for address:', address);
    
    // Query para encontrar parcel_id baseado no endereço
    const query = `
      SELECT DISTINCT p.parcel_id 
      FROM property p 
      WHERE p.property_address LIKE ? 
      LIMIT 1
    `;
    
    const result = await db.query(query, [`%${address}%`]);
    
    if (result.length > 0) {
      console.log('✅ Found parcel_id:', result[0].parcel_id);
      res.json({ parcel_id: result[0].parcel_id });
    } else {
      console.log('❌ No parcel found for address:', address);
      res.status(404).json({ error: 'Parcel ID not found for this address' });
    }
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### **Opção 2: Query com Orange County Address**
```javascript
app.get('/api/parcel-id-by-address', async (req, res) => {
  try {
    const { address } = req.query;
    
    // Busca primeiro na tabela orange_county_address
    const query = `
      SELECT DISTINCT 
        p.parcel_id,
        p.property_address,
        oca.full_address
      FROM orange_county_address oca
      LEFT JOIN property p ON (
        p.property_address LIKE CONCAT('%', oca.number, '%', oca.stname, '%')
        OR p.street_number = oca.number AND p.street_name LIKE CONCAT('%', oca.stname, '%')
      )
      WHERE oca.full_address LIKE ?
      OR CONCAT(oca.number, ' ', oca.stname, ' ', IFNULL(oca.stsuffix, '')) LIKE ?
      LIMIT 1
    `;
    
    const searchTerm = `%${address}%`;
    const result = await db.query(query, [searchTerm, searchTerm]);
    
    if (result.length > 0 && result[0].parcel_id) {
      res.json({ 
        parcel_id: result[0].parcel_id,
        matched_address: result[0].property_address 
      });
    } else {
      res.status(404).json({ error: 'Parcel ID not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### **Opção 3: Query Mais Específica**
```javascript
app.get('/api/parcel-id-by-address', async (req, res) => {
  try {
    const { address } = req.query;
    
    // Quebra o endereço em partes
    const parts = address.split(',').map(part => part.trim());
    const streetPart = parts[0]; // "15223 Book Club Rd"
    const cityPart = parts[1];   // "Winter Garden"
    const zipPart = parts[2];    // "34787"
    
    let query = `
      SELECT DISTINCT p.parcel_id, p.property_address
      FROM property p 
      WHERE 1=1
    `;
    const params = [];
    
    if (streetPart) {
      query += ` AND p.property_address LIKE ?`;
      params.push(`%${streetPart}%`);
    }
    
    if (cityPart) {
      query += ` AND p.property_city LIKE ?`;
      params.push(`%${cityPart}%`);
    }
    
    if (zipPart) {
      query += ` AND p.property_zip LIKE ?`;
      params.push(`%${zipPart}%`);
    }
    
    query += ` LIMIT 1`;
    
    const result = await db.query(query, params);
    
    if (result.length > 0) {
      res.json({ 
        parcel_id: result[0].parcel_id,
        matched_address: result[0].property_address 
      });
    } else {
      res.status(404).json({ error: 'Parcel ID not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔧 **Headers CORS:**
```javascript
app.use(cors({
  origin: ['http://192.168.0.105:8082', 'http://localhost:8082'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
```

## 📋 **Teste:**
```bash
curl "http://192.168.0.105:3000/api/parcel-id-by-address?address=15223%20Book%20Club%20Rd%2C%20Winter%20Garden%2C%2034787"
```

## ⚡ **Status:**
- ✅ Frontend configurado para `/api/parcel-id-by-address`
- ⚠️ Backend precisa implementar este endpoint específico
- ✅ Fallback para usar endereço se API falhar

**Implemente qualquer uma das opções acima e o sistema funcionará!**