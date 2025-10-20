# 🚀 Deploy no GitHub Pages - Guia Completo

## ✅ **O que foi configurado:**

### **1. GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
- ✅ Build automático quando fizer push na branch `main`
- ✅ Deploy automático para GitHub Pages
- ✅ Usa Node.js 18 e npm
- ✅ Gera build na pasta `dist`

## 📋 **Próximos Passos - No GitHub:**

### **1. Fazer Push dos Arquivos**
```bash
git add .
git commit -m "Add GitHub Pages deploy workflow"
git push origin main
```

### **2. Configurar GitHub Pages**
1. **Acesse:** `https://github.com/r0drig0leal/forge-insight-suite/settings/pages`
2. **Source:** Selecione "GitHub Actions"
3. **Branch:** Será configurado automaticamente pelo workflow

### **3. Verificar Deploy**
1. **Vá para:** `https://github.com/r0drig0leal/forge-insight-suite/actions`
2. **Aguarde** o workflow "Deploy to GitHub Pages" executar
3. **Acesse o site:** `https://r0drig0leal.github.io/forge-insight-suite/`

## 🔧 **Configuração CORS para Produção**

⚠️ **IMPORTANTE:** Seu backend precisará permitir requisições do domínio GitHub Pages:

```javascript
// No seu backend (porta 3000)
app.use(cors({
  origin: [
    'http://192.168.0.105:8080',           // Desenvolvimento
    'https://r0drig0leal.github.io'        // Produção GitHub Pages
  ],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
```

## 📝 **Arquivos Criados:**

- ✅ `.github/workflows/deploy.yml` - Workflow de deploy
- ✅ `.env.production` - Variáveis de ambiente para produção

## 🎯 **Comandos Úteis:**

### **Deploy Manual (se necessário):**
```bash
npm run build
```

### **Testar Build Localmente:**
```bash
npm run preview
```

## 🚀 **Resultado Final:**

Após configurar no GitHub, toda vez que você fizer push na branch `main`:
1. ✅ GitHub Actions executará automaticamente
2. ✅ Fará build do projeto
3. ✅ Deploy para `https://r0drig0leal.github.io/forge-insight-suite/`
4. ✅ Site estará disponível online!

## ⚠️ **Lembre-se:**

- **CORS:** Configure no backend para aceitar `https://r0drig0leal.github.io`
- **API:** Certifique-se que a API na porta 3000 está acessível pela internet
- **SSL:** GitHub Pages usa HTTPS, pode precisar ajustar configurações da API

**Pronto! Agora é só fazer push e o deploy será automático! 🎉**