# 7 Vagas

Portal de oportunidades de trabalho para Sete Lagoas/MG. O projeto é uma aplicação estática, responsiva e sem etapa de compilação, com vagas carregadas de JSON e recursos de autenticação e métricas via Firebase.

## Recursos

- Busca e filtros por cargo, empresa e faixa salarial.
- Cards de vaga, modal com informações completas e contato por WhatsApp ou e-mail.
- Painel de inteligência local com notícias econômicas e ranking de vagas mais acessadas.
- Espaços comerciais para anúncios e formulário de interesse para empresas.
- Cadastro, login por e-mail/senha ou Google, recuperação de senha e perfil do candidato.
- Layout responsivo e paleta visual compartilhada com o Sete Lagoas Política.

## Tecnologias

- HTML, CSS e JavaScript puro (ES Modules).
- Firebase Authentication e Realtime Database, carregados pelo CDN oficial.
- Firebase Hosting para publicação.

## Executar localmente

Como a aplicação usa `fetch`, execute-a por um servidor HTTP — não abra o `index.html` diretamente.

```bash
cd public
python3 -m http.server 5500
```

Depois, acesse [http://localhost:5500](http://localhost:5500). Também é possível usar a extensão Live Server do VS Code.

## Estrutura

```text
.
├── public/
│   ├── index.html                 # Página principal
│   ├── styles.css                 # Design system, componentes e responsividade
│   ├── script.js                  # Renderização, filtros, modais e interações
│   ├── firebase.js                # Autenticação, leads e métricas
│   ├── vagas.json                 # Base de vagas exibida pelo portal
│   ├── vagasModel.json            # Modelo de referência para os dados
│   └── assets/
│       ├── noticias-economicas.json
│       └── relatorio-economico-sete-lagoas.pdf
├── database.rules.json            # Regras do Realtime Database
└── firebase.json                  # Configuração do Firebase Hosting
```

## Dados das vagas

As vagas são lidas de `public/vagas.json`. Use `public/vagasModel.json` como referência ao cadastrar ou importar dados. Cada vaga deve conter, no mínimo, identificador, cargo, empresa, localização, descrição e meios de contato quando disponíveis.

Exemplo reduzido:

```json
{
  "id": "analista-001",
  "cargo": "Analista Administrativo",
  "empresa": "Empresa Exemplo",
  "local_trabalho": {
    "cidade": "Sete Lagoas",
    "estado": "MG"
  },
  "salario": "R$ 2.500,00",
  "descricao_vaga": "Atuação na área administrativa.",
  "contato": {
    "email": "rh@exemplo.com",
    "whatsapp": "5531999999999"
  }
}
```

## Firebase

O arquivo `public/firebase.js` contém a configuração do projeto Firebase e integra:

- `usuarios/{uid}`: perfil do usuário autenticado;
- `leadsAnuncios/{uid}`: contatos de empresas interessadas em anunciar;
- `metricasVagas/{vagaId}/total`: contador público de visualizações usado no ranking.

As permissões do Realtime Database ficam em `database.rules.json`. Antes de usar outro projeto Firebase, atualize a configuração em `firebase.js`, habilite os provedores desejados no Authentication e publique as regras.

## Publicação

Com o Firebase CLI instalado e autenticado:

```bash
firebase deploy
```

O Hosting publica o conteúdo da pasta `public`, conforme definido em `firebase.json`.

## Identidade visual

Os tokens de cor estão no início de `public/styles.css`. A interface usa o vermelho `#DA251D` como cor principal, amarelo `#FFCC00` para destaques e superfícies azul-acinzentadas claras para manter a identidade visual conectada ao Sete Lagoas Política.

## Licença

Este repositório não declara uma licença. Consulte a equipe responsável antes de reutilizar ou redistribuir o código e os dados.
