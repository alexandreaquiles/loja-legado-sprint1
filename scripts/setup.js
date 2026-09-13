// Prepara a máquina: .env a partir do .env.example e o banco SQLite a partir do seed.
// Roda em qualquer sistema (só Node). Não apaga nada que já exista.
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');
const passo = (msg) => console.log(`setup: ${msg}`);

if (!fs.existsSync(path.join(raiz, 'node_modules', '@vendure', 'core'))) {
  console.error('setup: node_modules não encontrado. Rode `npm install` primeiro (leva uns 2 minutos e ocupa ~800 MB).');
  process.exit(1);
}
if (!fs.existsSync(path.join(raiz, '.env'))) {
  fs.copyFileSync(path.join(raiz, '.env.example'), path.join(raiz, '.env'));
  passo('.env criado a partir do .env.example (segredos falsos, só para o exercício)');
} else {
  passo('.env já existe');
}
if (!fs.existsSync(path.join(raiz, 'vendure.sqlite'))) {
  fs.copyFileSync(path.join(raiz, 'seed', 'vendure.sqlite'), path.join(raiz, 'vendure.sqlite'));
  passo('vendure.sqlite criado a partir de seed/vendure.sqlite (54 produtos de exemplo)');
} else {
  passo('vendure.sqlite já existe (apague-o e rode de novo para voltar ao seed)');
}
passo('pronto. npm test | npm run dev (http://localhost:3000/dashboard, superadmin/superadmin) | claude');
