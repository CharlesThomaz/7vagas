# Gerenciamento de Anúncios (/public/anuncios)

Esta pasta é reservada exclusivamente para o armazenamento de imagens e mídias de anúncios exibidos na plataforma.

## Como adicionar um novo anúncio:

1. Coloque a imagem ou mídia do anúncio dentro desta pasta (`public/anuncios/`).
   - Exemplo: `meu_novo_anuncio.png`, `promocao_banner.jpg`

2. Abra o arquivo `public/script.js`.

3. Adicione o nome do arquivo no array `ANUNCIOS_PASTA`:
   ```javascript
   const ANUNCIOS_PASTA = [
       'anuncioExemplo.png',
       'meu_novo_anuncio.png' // <-- Adicione seu novo arquivo aqui
   ];
   ```

4. O sistema escolherá os anúncios dessa lista de forma **aleatória** sempre que um usuário tentar acessar uma vaga ou funcionalidade restrita.
