# Arquitetura de Configuração

## 📋 Fluxo de Configuração

### 1. **Fonte Central** (`src/lib/env.ts`)
```typescript
export const ENV_CONFIG = {
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.0.105:3000',
    // ... outras configurações
  }
}
```

### 2. **Consumo pela API** (`src/lib/api.ts`)
```typescript
import { ENV_CONFIG } from '@/lib/env';

export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API.BASE_URL,  // ← Lê da configuração central
  // ... outros configs
}
```

### 3. **Uso nos Hooks** (`src/hooks/useAddressAutocomplete.ts`)
```typescript
import { ENV_CONFIG } from '@/lib/env';

// Usa diretamente as configurações centrais
minSearchLength = ENV_CONFIG.AUTOCOMPLETE.MIN_SEARCH_LENGTH,
```

## ✅ **Configuração Centralizada Confirmada**

### **IP/URL Configurado Apenas Em:**
1. **`src/lib/env.ts`** - Configuração padrão como fallback
2. **`.env.example`** - Template de exemplo
3. **`docs/AUTOCOMPLETE.md`** - Documentação (atualizada)

### **Todos os Outros Arquivos Leem Da Configuração:**
- ✅ `src/lib/api.ts` → Lê de `ENV_CONFIG.API.BASE_URL`
- ✅ `src/hooks/useAddressAutocomplete.ts` → Lê de `ENV_CONFIG.AUTOCOMPLETE.*`
- ✅ Componentes → Usam hooks que leem da configuração

## 🔧 **Para Alterar o IP:**

### **Opção 1: Variável de Ambiente** (Recomendado)
```bash
# .env.local
VITE_API_BASE_URL=http://192.168.0.105:3000
```

### **Opção 2: Alterar Fallback**
```typescript
// src/lib/env.ts
BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://SEU_IP:3000',
```

## 🎯 **Arquitetura Correta**
```
.env.local → env.ts → api.ts → hooks → components
     ↑         ↑        ↑        ↑         ↑
 Variáveis   Config   API    Lógica   Interface
```

**✅ Sim, está configurado corretamente! O IP é definido centralmente e todos os outros arquivos leem dele.**