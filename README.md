# 7 Vagas - Portal de Oportunidades

Um sistema moderno e responsivo para exibir e filtrar vagas de emprego, desenvolvido com HTML vanilla, CSS puro e JavaScript.

## 📋 Características

✅ **Interface Moderna**: Design limpo e profissional com gradientes e animações
✅ **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
✅ **Filtros Avançados**: Busque por cargo, empresa e tipo de salário
✅ **Modal Detalhado**: Visualize todas as informações da vaga em um modal elegante
✅ **Contato Direto**: Botões de WhatsApp e Email integrados
✅ **Sem Dependências**: Apenas HTML, CSS e JavaScript vanilla
✅ **Performance**: Carregamento rápido e otimizado

## 🗂️ Estrutura do Projeto

```
7vagas/
├── index.html      # Arquivo principal com a estrutura HTML
├── styles.css      # Estilos CSS completos
├── script.js       # Lógica JavaScript
└── vagas.json      # Dados das vagas em formato JSON
```

## 🚀 Como Usar

### 1. Abrir o Site
Abra o arquivo `index.html` em seu navegador:
```bash
# Opção 1: Clique duplo no arquivo
# Opção 2: Use um servidor local (recomendado)
python -m http.server 8000
# Depois acesse: http://localhost:8000
```

### 2. Estrutura do JSON
O arquivo `vagas.json` contém um array de objetos com a seguinte estrutura:

```json
[
  {
    "id": 1,
    "cargo": "Nome do Cargo",
    "empresa": "Nome da Empresa",
    "local_trabalho": {
      "rua": "Rua",
      "bairro": "Bairro",
      "cidade": "Cidade",
      "estado": "Estado"
    },
    "salario": "R$ XXXX ou 'Não especificado'",
    "beneficios": ["Benefício 1", "Benefício 2"],
    "requisitos": ["Requisito 1", "Requisito 2"],
    "habilidades_desejadas": ["Habilidade 1"],
    "diferencial": ["Diferencial 1"],
    "horario": {
      "segunda_a_sexta": "HH:MM às HH:MM",
      "sabado": "HH:MM às HH:MM",
      "diario": "HH:MM às HH:MM",
      "tipo": "Tipo de horário",
      "observacao": "Observações"
    },
    "escala": "Segunda a sábado",
    "contato": {
      "email": "email@exemplo.com",
      "whatsapp": "(XX) XXXXX-XXXX"
    },
    "descricao_vaga": "Descrição detalhada da vaga",
    "divulgacao": "@usuario_instagram",
    "fonte_imagem": "nome_imagem.jpg"
  }
]
```

### 3. Adicionar Novas Vagas
Edite o arquivo `vagas.json` e adicione novos objetos de vaga seguindo a estrutura acima.

## 🎨 Funcionalidades Principais

### Filtros
- **Busca por Texto**: Procure por cargo ou empresa
- **Filtro de Salário**: Veja apenas vagas com salário especificado, não especificado ou comissionadas
- **Filtro por Empresa**: Selecione uma empresa específica
- **Limpar Filtros**: Resete todos os filtros com um clique

### Cartão de Vaga
Cada vaga exibe:
- Cargo e empresa
- Localização
- Salário
- Escala de trabalho
- Descrição breve
- Botões: "Detalhes" e "Contato"

### Modal de Detalhes
Ao clicar em "Detalhes", abra um modal com:
- Descrição completa
- Endereço completo
- Salário
- Horários de trabalho
- Benefícios
- Requisitos
- Habilidades desejadas
- Diferenciais
- Botões de contato (WhatsApp e Email)

### Contato
Clique em "Contato" ou nos botões do modal para:
- Abrir WhatsApp com mensagem pré-formatada
- Abrir cliente de email com assunto preenchido

## 🎨 Customização

### Cores
Edite as variáveis CSS no `styles.css`:
```css
:root {
    --primary-color: #2563eb;      /* Azul principal */
    --secondary-color: #10b981;    /* Verde secundário */
    --text-dark: #1f2937;          /* Texto escuro */
    --text-light: #6b7280;         /* Texto claro */
    --bg-light: #f3f4f6;           /* Fundo claro */
    --bg-white: #ffffff;           /* Fundo branco */
}
```

### Fontes
As fontes padrão do sistema são usadas. Para mudar:
```css
body {
    font-family: 'Sua Fonte', sans-serif;
}
```

## 📱 Responsividade

O site é totalmente responsivo:
- **Desktop**: Layout em grid (até 4 colunas)
- **Tablet**: Layout adaptado (2-3 colunas)
- **Mobile**: Layout em uma coluna

## ⚙️ Requisitos Técnicos

- Navegador moderno com suporte a:
  - ES6 JavaScript
  - CSS Grid e Flexbox
  - Fetch API
  - Array Methods

## 🔍 Dicas de Uso

1. **Para melhor performance**: Use um servidor HTTP local em vez de abrir o arquivo diretamente
2. **WhatsApp**: O link de WhatsApp funciona melhor em dispositivos com WhatsApp instalado
3. **Email**: Certifique-se de que o cliente de email está configurado no sistema
4. **Dados**: Mantenha o `vagas.json` bem formatado e válido

## 📝 Exemplo Mínimo de Vaga

```json
{
  "id": 1,
  "cargo": "Desenvolvedor",
  "empresa": "Tech Company",
  "local_trabalho": {
    "cidade": "Sete Lagoas",
    "estado": "MG"
  },
  "salario": "R$ 3.000,00",
  "descricao_vaga": "Procuramos um desenvolvedor experiente",
  "escala": "Segunda a sexta",
  "contato": {
    "email": "vagas@empresa.com"
  },
  "divulgacao": "@empresa",
  "requisitos": []
}
```

## 🚀 Melhorias Futuras

- Integração com backend
- Sistema de candidatura
- Dashboard administrativo
- Paginação
- Ordenação por relevância
- Sistema de favoritos

## 📄 Licença

Livre para uso pessoal e comercial.

---

**Desenvolvido com ❤️ usando HTML, CSS e JavaScript vanilla**
# 7vagas
