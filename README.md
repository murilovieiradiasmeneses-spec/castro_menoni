# Castro & Menoni Advogados — Vercel

Exportação do site publicado, preservando o visual, as imagens e as animações originais.

## Publicação

Importe esta pasta na Vercel ou publique com a Vercel CLI autenticada:

```bash
npx vercel --prod
```

Configuração: Framework **Other**, sem instalação ou build e Output Directory **dist**. O arquivo `vercel.json` já define esses valores.

Não são necessárias variáveis de ambiente ou banco de dados.

## Arquivos

`dist/` contém o HTML, CSS, JavaScript, biblioteca Three.js e imagens do site.

O formulário mantém o comportamento atual: prepara e copia uma mensagem no dispositivo. Não envia dados automaticamente e não está vinculado a um número de WhatsApp.

As fontes são carregadas pelo Google Fonts.

Fonte original: commit `732325e328f87faf858cee2062f82af4d5e78ff1`.
