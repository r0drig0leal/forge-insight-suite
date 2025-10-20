# Estrutura de Resposta da API

## ✅ **Estrutura Corrigida - Backend Response**

### **Endpoint:** `GET /api/address?search={query}`

### **Estrutura de Resposta Esperada:**
```json
{
  "suggestions": [
    {
      "id": "string",
      "address": "string",
      "city": "string",
      "state": "string", 
      "zipCode": "string",
      "country": "string",
      "formattedAddress": "string"
    }
  ]
}
```

### **Exemplo de Resposta:**
```json
{
  "suggestions": [
    {
      "id": "1",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "formattedAddress": "123 Main Street, New York, NY 10001"
    },
    {
      "id": "2", 
      "address": "456 Oak Avenue",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90210",
      "country": "USA",
      "formattedAddress": "456 Oak Avenue, Los Angeles, CA 90210"
    }
  ]
}
```

## 🔧 **Correção Aplicada no Frontend**

### **Antes (Causava Erro):**
```typescript
// ❌ Esperava array direto
return this.request<AddressSearchResult[]>(endpoint);
```

### **Depois (Correto):**
```typescript
// ✅ Lida com estrutura { suggestions: [...] }
const response = await this.request<AddressSearchResponse>(endpoint);

if (response.success && response.data?.suggestions) {
  return {
    success: true,
    data: response.data.suggestions, // ← Extrai o array suggestions
  };
}
```

## 🎯 **Validação**

### **Cenários de Teste:**
1. **Query vazia** → `{ "suggestions": [] }`
2. **Query com resultados** → `{ "suggestions": [obj1, obj2, ...] }`
3. **Query sem resultados** → `{ "suggestions": [] }`
4. **Erro no servidor** → Status HTTP != 200

### **Debug Habilitado:**
- ✅ Logs detalhados da resposta da API
- ✅ Status HTTP e estrutura de dados
- ✅ Identificação de problemas de estrutura

## 📋 **Campos Obrigatórios vs Opcionais**

### **Obrigatórios:**
- `id` - Identificador único
- `address` - Endereço principal

### **Opcionais:**
- `city` - Cidade
- `state` - Estado/Província
- `zipCode` - CEP/Código Postal
- `country` - País
- `formattedAddress` - Endereço formatado para exibição

## 🚀 **Status da Correção**

- ✅ **Estrutura de tipos atualizada**
- ✅ **Parsing da resposta corrigido**
- ✅ **Debug habilitado para verificação**
- ✅ **Tratamento de erros mantido**

**Agora o frontend está preparado para a estrutura `{ "suggestions": [...] }` do backend! 🎉**