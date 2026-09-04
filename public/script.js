// ==================== VARIÁVEIS GLOBAIS ====================

let todasAsVagas = [];
let vagasFiltradas = [];
let acaoAposCadastro = null;
let modoLogin = false;

const CHAVE_NOME_CANDIDATO = '7vagas:nome-candidato';
const ANUNCIOS_DEMONSTRACAO = [
    {
        marca: 'VivaLeve',
        chamada: 'Seu bem-estar merece atenção.',
        texto: 'Conheça uma nova forma de cuidar da sua rotina.',
        tema: 'verde'
    },
    {
        marca: 'Sabor da Vila',
        chamada: 'Almoço caprichado, todos os dias.',
        texto: 'Opções preparadas com sabor de comida caseira.',
        tema: 'laranja'
    },
    {
        marca: 'Evoluir Cursos',
        chamada: 'O próximo passo da sua carreira começa aqui.',
        texto: 'Cursos práticos para transformar seus planos em resultado.',
        tema: 'roxo'
    }
];


// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', () => {
    carregarVagas();
    inicializarEventos();
    sincronizarSessao();
});

window.addEventListener('firebase-auth-ready', sincronizarSessao);


// ==================== CARREGAR VAGAS DO JSON ====================

async function carregarVagas() {

    try {

        const response = await fetch('vagas.json');

        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo de vagas');
        }

        todasAsVagas = await response.json();

        vagasFiltradas = [...todasAsVagas];

        popularFiltroEmpresas();
        exibirVagas(vagasFiltradas);
        atualizarContador();

    } catch (error) {

        console.error('Erro:', error);

        document.getElementById('vagas-container').innerHTML = `
            <div class="no-results">
                <p>
                    Erro ao carregar as vagas.
                    Tente recarregar a página.
                </p>
            </div>
        `;
    }
}


// ==================== POPULAR FILTRO DE EMPRESAS ====================

function popularFiltroEmpresas() {

    const empresas = [
        ...new Set(
            todasAsVagas
                .map(vaga => vaga.empresa)
                .filter(Boolean)
        )
    ];

    const selectEmpresas =
        document.getElementById('company-filter');

    selectEmpresas.innerHTML = `
        <option value="">
            Todas as empresas
        </option>
    `;

    empresas.sort().forEach(empresa => {

        const option = document.createElement('option');

        option.value = empresa;
        option.textContent = empresa;

        selectEmpresas.appendChild(option);
    });
}


// ==================== EXIBIR VAGAS ====================

function exibirVagas(vagas) {

    const container =
        document.getElementById('vagas-container');

    const noResults =
        document.getElementById('no-results');

    container.innerHTML = '';

    if (vagas.length === 0) {

        container.style.display = 'none';
        noResults.style.display = 'block';

        return;
    }

    container.style.display = 'grid';
    noResults.style.display = 'none';

    vagas.forEach((vaga, indice) => {

        const card = criarCartaoVaga(vaga);

        container.appendChild(card);

        if (indice === 2) {
            container.appendChild(criarCartaoAnuncio(ANUNCIOS_DEMONSTRACAO[0]));
        }

        if (indice === 5) {
            container.appendChild(criarCartaoAnuncio(ANUNCIOS_DEMONSTRACAO[1]));
        }
    });

    if (vagas.length < 3) {
        container.appendChild(criarCartaoAnuncio(ANUNCIOS_DEMONSTRACAO[0]));
    }

    container.appendChild(criarCartaoAnuncio(ANUNCIOS_DEMONSTRACAO[2]));
}


// ==================== CRIAR CARTÃO DA VAGA ====================

function criarCartaoVaga(vaga) {

    const card = document.createElement('article');

    card.className = 'vaga-card';

    // ============================
    // LOCALIZAÇÃO
    // ============================

    const localizacao =
        formatarLocalizacao(vaga.local_trabalho);


    // ============================
    // SALÁRIO
    // ============================

    const salario =
        vaga.salario || 'Não especificado';

    const classSalario =
        !vaga.salario ||
        vaga.salario === 'Não especificado'
            ? 'nao-especificado'
            : '';


    // ============================
    // DESCRIÇÃO
    // ============================

    const descricao =
        vaga.descricao_vaga ||
        'Sem descrição disponível';


    // ============================
    // CARD
    // ============================

    card.innerHTML = `

        <!-- Área superior do card -->
        <div class="vaga-image">

            <div class="vaga-initials">
                ${obterIniciais(vaga.empresa)}
            </div>

        </div>


        <!-- Conteúdo -->

        <div class="vaga-content">

            <div class="vaga-cargo">
                ${escaparHTML(vaga.cargo || 'Cargo não informado')}
            </div>


            <div class="vaga-empresa">
                ${escaparHTML(vaga.empresa || 'Empresa não informada')}
            </div>


            <!-- Localização -->

            <div class="vaga-info">

                <div class="vaga-info-item">

                    <span class="vaga-info-icon">
                        📍
                    </span>

                    <div class="vaga-localizacao">
                        ${escaparHTML(localizacao)}
                    </div>

                </div>


                <!-- Salário -->

                <div class="vaga-info-item">

                    <span class="vaga-info-icon">
                        💰
                    </span>

                    <div class="vaga-salario ${classSalario}">
                        ${escaparHTML(salario)}
                    </div>

                </div>


                <!-- Escala -->

                <div class="vaga-info-item">

                    <span class="vaga-info-icon">
                        ⏰
                    </span>

                    <div>
                        ${escaparHTML(
                            vaga.escala ||
                            'Não especificada'
                        )}
                    </div>

                </div>

            </div>


            <!-- Descrição -->

            <div class="vaga-descricao">
                ${escaparHTML(descricao)}
            </div>


            <!-- Rodapé -->

            <div class="vaga-footer">

                <button
                    type="button"
                    class="btn-detalhes"
                    onclick="solicitarAcesso(() => abrirModal(${Number(vaga.id)}))"
                >
                    Detalhes
                </button>


                <button
                    type="button"
                    class="btn-contato"
                    onclick="solicitarAcesso(() => abrirContato(${Number(vaga.id)}))"
                >
                    Contato
                </button>

            </div>

        </div>
    `;

    return card;
}


function criarCartaoAnuncio(anuncio) {
    const card = document.createElement('article');
    card.className = `anuncio-card anuncio-card-${anuncio.tema}`;

    card.innerHTML = `
        <span class="anuncio-identificacao">Publicidade</span>
        <div class="anuncio-marca">${escaparHTML(anuncio.marca)}</div>
        <h3>${escaparHTML(anuncio.chamada)}</h3>
        <p>${escaparHTML(anuncio.texto)}</p>
        <button class="anuncio-cta" type="button">Divulgue sua marca</button>
    `;

    card
        .querySelector('.anuncio-cta')
        .addEventListener('click', () => solicitarAcesso(abrirAnuncio));

    return card;
}


// ==================== OBTER INICIAIS DA EMPRESA ====================

function obterIniciais(nome) {

    if (!nome) {
        return '7V';
    }

    const palavras = nome
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (palavras.length === 1) {

        return palavras[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        palavras[0].charAt(0) +
        palavras[1].charAt(0)
    ).toUpperCase();
}


// ==================== FORMATAR LOCALIZAÇÃO ====================

function formatarLocalizacao(local) {

    if (!local || typeof local !== 'object') {
        return 'Local não especificado';
    }

    const partes = [];

    if (local.rua) {
        partes.push(local.rua);
    }

    if (local.bairro) {
        partes.push(local.bairro);
    }

    if (local.cidade) {
        partes.push(local.cidade);
    }

    if (local.estado) {
        partes.push(local.estado);
    }

    return partes.length > 0
        ? partes.join(', ')
        : 'Local não especificado';
}


// ==================== ABRIR MODAL ====================

function obterNomeCandidato() {
    return obterPerfilCandidato().nome;
}


function obterPerfilCandidato() {
    const cadastroSalvo = localStorage.getItem(CHAVE_NOME_CANDIDATO);

    if (!cadastroSalvo) {
        return { nome: '', email: '' };
    }

    try {
        const perfil = JSON.parse(cadastroSalvo);
        return {
            nome: perfil.nome?.trim() || '',
            email: perfil.email?.trim() || ''
        };
    } catch {
        return { nome: cadastroSalvo.trim(), email: '' };
    }
}


async function solicitarAcesso(acao) {
    const usuario =
        typeof window.obterUsuarioFirebase === 'function' &&
        await window.obterUsuarioFirebase();

    if (usuario) {
        localStorage.setItem(
            CHAVE_NOME_CANDIDATO,
            JSON.stringify({
                nome: usuario.displayName || usuario.email.split('@')[0],
                email: usuario.email
            })
        );
        atualizarBotaoPerfil();
        acao();
        return;
    }

    acaoAposCadastro = acao;
    abrirCadastro();
}


function abrirCadastro() {
    const modal = document.getElementById('cadastro-modal');
    const inputNome = document.getElementById('nome-candidato');
    const inputEmail = document.getElementById('email-candidato');
    const status = document.getElementById('cadastro-status');
    const perfil = obterPerfilCandidato();

    inputNome.value = perfil.nome;
    inputEmail.value = perfil.email;
    status.textContent = '';
    status.classList.remove('sucesso');
    atualizarModoCadastro();
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    window.setTimeout(
        () => (modoLogin ? inputEmail : inputNome).focus(),
        50
    );
}


function fecharCadastro() {
    const modal = document.getElementById('cadastro-modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    acaoAposCadastro = null;
    document.getElementById('senha-candidato').value = '';
}


function abrirAnuncio() {
    const modal = document.getElementById('anuncio-modal');
    const status = document.getElementById('anuncio-status');

    status.textContent = '';
    status.classList.remove('sucesso');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    window.setTimeout(
        () => document.getElementById('empresa-anunciante').focus(),
        50
    );
}


function fecharAnuncio() {
    const modal = document.getElementById('anuncio-modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}


async function enviarLeadAnuncio(event) {
    event.preventDefault();

    const empresa = document.getElementById('empresa-anunciante');
    const whatsapp = document.getElementById('whatsapp-anunciante');
    const interesse = document.getElementById('interesse-anunciante');
    const status = document.getElementById('anuncio-status');
    const botao = event.submitter;
    const usuario = await window.obterUsuarioFirebase();

    if (!empresa.value.trim() || !whatsapp.value.trim() || !interesse.value) {
        status.textContent = 'Preencha empresa, WhatsApp e o tipo de divulgação.';
        status.classList.remove('sucesso');
        return;
    }

    botao.disabled = true;
    botao.textContent = 'Enviando...';
    status.textContent = '';
    status.classList.remove('sucesso');

    try {
        await window.salvarLeadAnuncioFirebase({
            usuario,
            empresa: empresa.value.trim().replace(/\s+/g, ' '),
            whatsapp: whatsapp.value.trim(),
            interesse: interesse.value
        });

        event.target.reset();
        status.textContent = 'Solicitação enviada! Em breve entraremos em contato.';
        status.classList.add('sucesso');
    } catch (error) {
        console.error('Erro ao salvar solicitação de divulgação:', error);
        status.textContent = 'Não foi possível enviar sua solicitação. Tente novamente.';
        status.classList.remove('sucesso');
    } finally {
        botao.disabled = false;
        botao.textContent = 'Enviar solicitação';
    }
}


function atualizarModoCadastro() {
    const grupoNome = document.getElementById('nome-candidato-grupo');
    const inputNome = document.getElementById('nome-candidato');
    const inputSenha = document.getElementById('senha-candidato');
    const labelSenha = document.getElementById('senha-candidato-label');
    const titulo = document.getElementById('cadastro-title');
    const descricao = document.getElementById('cadastro-descricao');
    const botao = document.querySelector('#cadastro-form .btn-cadastro');
    const alternar = document.getElementById('completar-perfil');
    const esqueciSenha = document.getElementById('esqueci-senha');

    grupoNome.hidden = modoLogin;
    inputNome.required = !modoLogin;
    inputSenha.autocomplete = modoLogin ? 'current-password' : 'new-password';
    inputSenha.placeholder = modoLogin ? 'Informe sua senha' : 'Mínimo de 6 caracteres';
    labelSenha.textContent = modoLogin ? 'Sua senha' : 'Crie uma senha';
    titulo.textContent = modoLogin ? 'Entre na sua conta' : 'Crie seu cadastro';
    descricao.textContent = modoLogin
        ? 'Informe seu e-mail e senha para continuar.'
        : 'Crie seu acesso para ver os detalhes e os contatos das vagas.';
    botao.textContent = modoLogin ? 'Entrar' : 'Criar cadastro';
    alternar.textContent = modoLogin ? 'Ainda não tenho cadastro' : 'Já tenho cadastro';
    esqueciSenha.hidden = !modoLogin;
}


async function salvarCadastro(event) {
    event.preventDefault();

    const inputNome = document.getElementById('nome-candidato');
    const inputEmail = document.getElementById('email-candidato');
    const inputSenha = document.getElementById('senha-candidato');
    const status = document.getElementById('cadastro-status');
    const botaoSalvar =
        event.submitter || document.querySelector('#cadastro-form .btn-cadastro');
    const nome = inputNome.value.trim().replace(/\s+/g, ' ');
    const email = inputEmail.value.trim().toLowerCase();
    const senha = inputSenha.value;

    if ((!modoLogin && !nome) || !inputEmail.validity.valid || senha.length < 6) {
        status.textContent = 'Informe nome, e-mail válido e senha de no mínimo 6 caracteres.';
        (!modoLogin && !nome ? inputNome : inputEmail).focus();
        return;
    }

    if (
        typeof window.criarContaFirebase !== 'function' ||
        typeof window.entrarFirebase !== 'function'
    ) {
        status.textContent = 'Não foi possível conectar ao cadastro. Tente novamente.';
        return;
    }

    botaoSalvar.disabled = true;
    botaoSalvar.textContent = 'Salvando...';
    status.textContent = '';
    status.classList.remove('sucesso');

    try {
        const usuario = modoLogin
            ? await window.entrarFirebase({ email, senha })
            : await window.criarContaFirebase({ nome, email, senha });

        await window.salvarPerfilUsuarioFirebase(usuario);

        const nomePerfil = usuario.displayName || nome || email.split('@')[0];

        localStorage.setItem(
            CHAVE_NOME_CANDIDATO,
            JSON.stringify({ nome: nomePerfil, email })
        );
    } catch (error) {
        console.error('Erro de autenticação:', error);
        status.textContent = mensagemErroAutenticacao(error.code);
        status.classList.remove('sucesso');
        botaoSalvar.disabled = false;

        if (error.code === 'auth/email-already-in-use') {
            modoLogin = true;
        }

        atualizarModoCadastro();
        return;
    }

    atualizarBotaoPerfil();

    const acao = acaoAposCadastro;
    fecharCadastro();

    if (acao) {
        acao();
    }
}


async function solicitarRedefinicaoSenha() {
    const inputEmail = document.getElementById('email-candidato');
    const status = document.getElementById('cadastro-status');
    const botao = document.getElementById('esqueci-senha');
    const email = inputEmail.value.trim().toLowerCase();

    if (!inputEmail.validity.valid) {
        status.textContent = 'Informe seu e-mail para receber o link de redefinição.';
        status.classList.remove('sucesso');
        inputEmail.focus();
        return;
    }

    botao.disabled = true;
    botao.textContent = 'Enviando...';
    status.textContent = '';
    status.classList.remove('sucesso');

    try {
        await window.enviarRedefinicaoSenhaFirebase(email);
        status.textContent = 'Enviamos um link para redefinir sua senha. Confira sua caixa de entrada.';
        status.classList.add('sucesso');
    } catch (error) {
        console.error('Erro ao enviar redefinição de senha:', error);
        status.textContent = mensagemErroAutenticacao(error.code);
        status.classList.remove('sucesso');
    } finally {
        botao.disabled = false;
        botao.textContent = 'Esqueci minha senha';
    }
}


async function entrarComGoogle() {
    const status = document.getElementById('cadastro-status');
    const botaoGoogle = document.getElementById('google-login-button');

    if (typeof window.entrarComGoogleFirebase !== 'function') {
        status.textContent = 'Não foi possível conectar ao Google. Tente novamente.';
        return;
    }

    botaoGoogle.disabled = true;
    status.textContent = '';

    try {
        const usuario = await window.entrarComGoogleFirebase();
        const nome = usuario.displayName || usuario.email.split('@')[0];

        await window.salvarPerfilUsuarioFirebase(usuario);

        localStorage.setItem(
            CHAVE_NOME_CANDIDATO,
            JSON.stringify({ nome, email: usuario.email })
        );

        atualizarBotaoPerfil();

        const acao = acaoAposCadastro;
        fecharCadastro();

        if (acao) {
            acao();
        }
    } catch (error) {
        if (error.code !== 'auth/popup-closed-by-user') {
            console.error('Erro de autenticação com Google:', error);
            status.textContent = mensagemErroAutenticacao(error.code);
        }
    } finally {
        botaoGoogle.disabled = false;
    }
}


function mensagemErroAutenticacao(codigo) {
    const mensagens = {
        'auth/email-already-in-use': 'Este e-mail já possui cadastro. Use a opção “Já tenho cadastro”.',
        'auth/invalid-credential': 'E-mail ou senha incorretos.',
        'auth/weak-password': 'Use uma senha com pelo menos 6 caracteres.',
        'auth/invalid-email': 'Informe um e-mail válido.',
        'auth/popup-blocked': 'O navegador bloqueou a janela do Google. Permita pop-ups e tente novamente.',
        'auth/unauthorized-domain': 'Este endereço ainda não está autorizado no Firebase.',
        'auth/account-exists-with-different-credential': 'Este e-mail já está vinculado a outro método de acesso. Entre com ele para continuar.',
        'auth/operation-not-allowed': 'Ative o método E-mail/senha no Firebase Authentication.',
        'auth/configuration-not-found': 'O Firebase Authentication ainda não foi configurado. Tente novamente após ativar E-mail/senha.'
    };

    return mensagens[codigo] || 'Não foi possível concluir. Tente novamente.';
}


function atualizarBotaoPerfil() {
    const botao = document.getElementById('profile-button');
    const botaoSair = document.getElementById('logout-button');
    const nome = obterNomeCandidato();

    if (botao) {
        botao.textContent = nome ? `Olá, ${nome.split(' ')[0]}` : 'Entrar / cadastro';
    }

    if (botaoSair) {
        botaoSair.style.display = nome ? 'inline-flex' : 'none';
    }
}


async function sincronizarSessao() {
    if (typeof window.obterUsuarioFirebase !== 'function') {
        atualizarBotaoPerfil();
        return;
    }

    const usuario = await window.obterUsuarioFirebase();

    if (usuario) {
        localStorage.setItem(
            CHAVE_NOME_CANDIDATO,
            JSON.stringify({
                nome: usuario.displayName || usuario.email.split('@')[0],
                email: usuario.email
            })
        );
    } else {
        localStorage.removeItem(CHAVE_NOME_CANDIDATO);
    }

    atualizarBotaoPerfil();
}


async function sairDaConta() {
    if (typeof window.sairFirebase === 'function') {
        await window.sairFirebase();
    }

    localStorage.removeItem(CHAVE_NOME_CANDIDATO);
    atualizarBotaoPerfil();
}

function abrirModal(vagaId) {

    const vaga = todasAsVagas.find(
        v => Number(v.id) === Number(vagaId)
    );

    if (!vaga) {
        return;
    }


    const modal =
        document.getElementById('modal');

    const modalBody =
        document.getElementById('modal-body');


    // ============================
    // LOCALIZAÇÃO
    // ============================

    const localizacao =
        formatarLocalizacao(vaga.local_trabalho);


    // ============================
    // SALÁRIO
    // ============================

    const salario =
        vaga.salario ||
        'Não especificado';


    // ============================
    // HORÁRIOS
    // ============================

    let horarios = '';

    if (vaga.horario) {

        if (vaga.horario.segunda_a_sexta) {

            horarios += `
                <div>
                    <strong>Segunda a Sexta:</strong>
                    ${escaparHTML(
                        vaga.horario.segunda_a_sexta
                    )}
                </div>
            `;
        }

        if (vaga.horario.sabado) {

            horarios += `
                <div>
                    <strong>Sábado:</strong>
                    ${escaparHTML(
                        vaga.horario.sabado
                    )}
                </div>
            `;
        }

        if (vaga.horario.diario) {

            horarios += `
                <div>
                    <strong>Horário:</strong>
                    ${escaparHTML(
                        vaga.horario.diario
                    )}
                </div>
            `;
        }

        if (vaga.horario.observacao) {

            horarios += `
                <div>
                    <strong>Observação:</strong>
                    ${escaparHTML(
                        vaga.horario.observacao
                    )}
                </div>
            `;
        }

        if (vaga.horario.tipo) {

            horarios += `
                <div>
                    <strong>Tipo:</strong>
                    ${escaparHTML(
                        vaga.horario.tipo
                    )}
                </div>
            `;
        }
    }


    // ============================
    // BENEFÍCIOS
    // ============================

    let beneficiosHTML = '';

    if (
        Array.isArray(vaga.beneficios) &&
        vaga.beneficios.length > 0
    ) {

        beneficiosHTML = `

            <div class="modal-section">

                <div class="modal-section-title">
                    ✨ Benefícios
                </div>

                <ul class="modal-list">

                    ${vaga.beneficios
                        .map(
                            beneficio =>
                                `<li>${escaparHTML(
                                    beneficio
                                )}</li>`
                        )
                        .join('')}

                </ul>

            </div>
        `;
    }


    // ============================
    // REQUISITOS
    // ============================

    let requisitosHTML = '';

    if (
        Array.isArray(vaga.requisitos) &&
        vaga.requisitos.length > 0
    ) {

        requisitosHTML = `

            <div class="modal-section">

                <div class="modal-section-title">
                    📋 Requisitos
                </div>

                <ul class="modal-list">

                    ${vaga.requisitos
                        .map(
                            requisito =>
                                `<li>${escaparHTML(
                                    requisito
                                )}</li>`
                        )
                        .join('')}

                </ul>

            </div>
        `;
    }


    // ============================
    // HABILIDADES
    // ============================

    let habilidadesHTML = '';

    if (
        Array.isArray(vaga.habilidades_desejadas) &&
        vaga.habilidades_desejadas.length > 0
    ) {

        habilidadesHTML = `

            <div class="modal-section">

                <div class="modal-section-title">
                    🎯 Habilidades Desejadas
                </div>

                <ul class="modal-list">

                    ${vaga.habilidades_desejadas
                        .map(
                            habilidade =>
                                `<li>${escaparHTML(
                                    habilidade
                                )}</li>`
                        )
                        .join('')}

                </ul>

            </div>
        `;
    }


    // ============================
    // DIFERENCIAIS
    // ============================

    let diferenciaisHTML = '';

    if (
        Array.isArray(vaga.diferencial) &&
        vaga.diferencial.length > 0
    ) {

        diferenciaisHTML = `

            <div class="modal-section">

                <div class="modal-section-title">
                    ⭐ Diferenciais
                </div>

                <ul class="modal-list">

                    ${vaga.diferencial
                        .map(
                            diferencial =>
                                `<li>${escaparHTML(
                                    diferencial
                                )}</li>`
                        )
                        .join('')}

                </ul>

            </div>
        `;
    }


    // ============================
    // BOTÕES DE CONTATO
    // ============================

    let botoesContato = '';


    if (
        vaga.contato &&
        vaga.contato.whatsapp
    ) {

        const numero =
            vaga.contato.whatsapp
                .toString()
                .replace(/\D/g, '');


        const mensagem =
            `Olá! Tenho interesse na vaga de ${vaga.cargo} na ${vaga.empresa}.`;


        const whatsappLink =
            `https://wa.me/55${numero}?text=${encodeURIComponent(
                mensagem
            )}`;


        botoesContato += `

            <a
                href="${whatsappLink}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-whatsapp"
            >
                📱 WhatsApp
            </a>
        `;
    }


    if (
        vaga.contato &&
        vaga.contato.email
    ) {

        const email =
            vaga.contato.email;


        const assunto =
            `Interesse na vaga de ${vaga.cargo} na ${vaga.empresa}`;


        const emailLink =
            `mailto:${email}?subject=${encodeURIComponent(
                assunto
            )}`;


        botoesContato += `

            <a
                href="${emailLink}"
                class="btn-email"
            >
                📧 Email
            </a>
        `;
    }


    // ============================
    // CONTEÚDO DO MODAL
    // ============================

    modalBody.innerHTML = `

        <!-- Cabeçalho -->

        <div class="modal-header">

            <div class="modal-cargo">
                ${escaparHTML(
                    vaga.cargo ||
                    'Cargo não informado'
                )}
            </div>

            <div class="modal-company">
                ${escaparHTML(
                    vaga.empresa ||
                    'Empresa não informada'
                )}
            </div>

        </div>


        <!-- Descrição -->

        <div class="modal-section">

            <div class="modal-section-title">
                📝 Descrição da Vaga
            </div>

            <div class="modal-section-content">
                ${escaparHTML(
                    vaga.descricao_vaga ||
                    'Sem descrição disponível.'
                )}
            </div>

        </div>


        <!-- Localização e horários -->

        <div class="modal-section">

            <div class="modal-section-title">
                📍 Localização e Horários
            </div>


            <div class="modal-info-grid">

                <div class="modal-info-item">

                    <div class="modal-info-label">
                        Endereço
                    </div>

                    <div class="modal-info-value">
                        ${escaparHTML(localizacao)}
                    </div>

                </div>


                <div class="modal-info-item">

                    <div class="modal-info-label">
                        Salário
                    </div>

                    <div class="modal-info-value">
                        ${escaparHTML(salario)}
                    </div>

                </div>


                <div class="modal-info-item">

                    <div class="modal-info-label">
                        Escala
                    </div>

                    <div class="modal-info-value">
                        ${escaparHTML(
                            vaga.escala ||
                            'Não especificada'
                        )}
                    </div>

                </div>

            </div>


            <!-- Horários -->

            <div class="modal-horarios">

                <div class="modal-info-label">
                    Horários
                </div>

                <div class="modal-section-content">

                    ${
                        horarios ||
                        'Não especificado'
                    }

                </div>

            </div>

        </div>


        ${beneficiosHTML}

        ${requisitosHTML}

        ${habilidadesHTML}

        ${diferenciaisHTML}


        <!-- Contato -->

        <div class="modal-section">

            <div class="modal-section-title">
                📞 Entre em Contato
            </div>


            <div class="modal-contact-buttons">

                ${
                    botoesContato ||
                    `
                    <p class="modal-section-content">
                        Contato não especificado.
                        Consulte a divulgação original.
                    </p>
                    `
                }

            </div>


            <div
                class="modal-section-content modal-divulgacao"
            >

                <strong>Divulgação:</strong>

                ${escaparHTML(
                    vaga.divulgacao ||
                    'Não especificada'
                )}

            </div>

        </div>

    `;


    // ============================
    // ABRIR MODAL
    // ============================

    modal.style.display = 'flex';

    // Impede o fundo de rolar
    document.body.style.overflow = 'hidden';
}


// ==================== FECHAR MODAL ====================

function fecharModal() {

    const modal =
        document.getElementById('modal');

    modal.style.display = 'none';

    document.body.style.overflow = '';
}


// ==================== BOTÃO FECHAR ====================

const botaoFechar =
    document.querySelector('.close-modal');

if (botaoFechar) {

    botaoFechar.addEventListener(
        'click',
        fecharModal
    );
}


// ==================== CLICAR FORA DO MODAL ====================

window.addEventListener('click', event => {

    const modal =
        document.getElementById('modal');

    if (event.target === modal) {
        fecharModal();
    }
});


// ==================== TECLA ESC ====================

document.addEventListener('keydown', event => {

    if (event.key === 'Escape') {

        const cadastroModal =
            document.getElementById('cadastro-modal');

        if (
            cadastroModal &&
            cadastroModal.style.display === 'flex'
        ) {
            fecharCadastro();
            return;
        }

        const anuncioModal = document.getElementById('anuncio-modal');

        if (anuncioModal && anuncioModal.style.display === 'flex') {
            fecharAnuncio();
            return;
        }

        const modal =
            document.getElementById('modal');

        if (
            modal &&
            modal.style.display === 'flex'
        ) {
            fecharModal();
        }
    }
});


// ==================== ABRIR CONTATO ====================

function abrirContato(vagaId) {

    const vaga =
        todasAsVagas.find(
            v => Number(v.id) === Number(vagaId)
        );

    if (!vaga || !vaga.contato) {
        return;
    }


    // WhatsApp

    if (vaga.contato.whatsapp) {

        const numero =
            vaga.contato.whatsapp
                .toString()
                .replace(/\D/g, '');


        const mensagem =
            `Olá! Tenho interesse na vaga de ${vaga.cargo} na ${vaga.empresa}.`;


        const whatsappLink =
            `https://wa.me/55${numero}?text=${encodeURIComponent(
                mensagem
            )}`;


        window.open(
            whatsappLink,
            '_blank',
            'noopener,noreferrer'
        );

        return;
    }


    // Email

    if (vaga.contato.email) {

        const assunto =
            `Interesse na vaga de ${vaga.cargo} na ${vaga.empresa}`;


        const emailLink =
            `mailto:${vaga.contato.email}?subject=${encodeURIComponent(
                assunto
            )}`;


        window.location.href = emailLink;
    }
}


// ==================== INICIALIZAR EVENTOS ====================

function inicializarEventos() {

    document
        .getElementById('profile-button')
        .addEventListener('click', abrirCadastro);

    document
        .getElementById('logout-button')
        .addEventListener('click', sairDaConta);

    document
        .getElementById('cadastro-form')
        .addEventListener('submit', salvarCadastro);

    document
        .getElementById('google-login-button')
        .addEventListener('click', entrarComGoogle);

    document
        .getElementById('mural-principal-cta')
        .addEventListener('click', () => solicitarAcesso(abrirAnuncio));

    document
        .getElementById('mural-secundario-cta')
        .addEventListener('click', () => solicitarAcesso(abrirAnuncio));

    document.querySelectorAll('.anuncio-mini-cta').forEach(botao => {
        botao.addEventListener('click', () => solicitarAcesso(abrirAnuncio));
    });

    const carrosselAnuncios = document.getElementById('carrossel-anuncios');
    const distanciaCarrossel = 244;

    document
        .getElementById('carrossel-anuncios-anterior')
        .addEventListener('click', () => {
            carrosselAnuncios.scrollBy({ left: -distanciaCarrossel, behavior: 'smooth' });
        });

    document
        .getElementById('carrossel-anuncios-proximo')
        .addEventListener('click', () => {
            carrosselAnuncios.scrollBy({ left: distanciaCarrossel, behavior: 'smooth' });
        });

    document
        .getElementById('anuncio-form')
        .addEventListener('submit', enviarLeadAnuncio);

    document
        .getElementById('close-anuncio')
        .addEventListener('click', fecharAnuncio);

    document
        .getElementById('anuncio-modal')
        .addEventListener('click', event => {
            if (event.target.id === 'anuncio-modal') {
                fecharAnuncio();
            }
        });

    document
        .getElementById('close-cadastro')
        .addEventListener('click', fecharCadastro);

    document
        .getElementById('completar-perfil')
        .addEventListener('click', () => {
            modoLogin = !modoLogin;
            document.getElementById('cadastro-status').textContent = '';
            document.getElementById('cadastro-status').classList.remove('sucesso');
            atualizarModoCadastro();
        });

    document
        .getElementById('esqueci-senha')
        .addEventListener('click', solicitarRedefinicaoSenha);

    document
        .getElementById('cadastro-modal')
        .addEventListener('click', event => {
            if (event.target.id === 'cadastro-modal') {
                fecharCadastro();
            }
        });

    // ============================
    // BUSCA
    // ============================

    document
        .getElementById('search-input')
        .addEventListener('input', event => {

            const termo =
                event.target.value
                    .trim()
                    .toLowerCase();


            const salario =
                document.getElementById(
                    'salary-filter'
                ).value;


            const empresa =
                document.getElementById(
                    'company-filter'
                ).value;


            filtrarVagas(
                termo,
                salario,
                empresa
            );
        });


    // ============================
    // SALÁRIO
    // ============================

    document
        .getElementById('salary-filter')
        .addEventListener('change', event => {

            const termo =
                document
                    .getElementById('search-input')
                    .value
                    .trim()
                    .toLowerCase();


            const empresa =
                document
                    .getElementById('company-filter')
                    .value;


            filtrarVagas(
                termo,
                event.target.value,
                empresa
            );
        });


    // ============================
    // EMPRESA
    // ============================

    document
        .getElementById('company-filter')
        .addEventListener('change', event => {

            const termo =
                document
                    .getElementById('search-input')
                    .value
                    .trim()
                    .toLowerCase();


            const salario =
                document
                    .getElementById('salary-filter')
                    .value;


            filtrarVagas(
                termo,
                salario,
                event.target.value
            );
        });


    // ============================
    // RESET
    // ============================

    document
        .getElementById('reset-filters')
        .addEventListener('click', () => {

            document.getElementById(
                'search-input'
            ).value = '';

            document.getElementById(
                'salary-filter'
            ).value = '';

            document.getElementById(
                'company-filter'
            ).value = '';


            vagasFiltradas =
                [...todasAsVagas];


            exibirVagas(
                vagasFiltradas
            );

            atualizarContador();
        });
}


// ==================== FILTRAR VAGAS ====================

function filtrarVagas(
    termo,
    filtroSalario,
    filtroEmpresa
) {

    vagasFiltradas =
        todasAsVagas.filter(vaga => {


            // ============================
            // BUSCA
            // ============================

            const cargo =
                (vaga.cargo || '')
                    .toLowerCase();


            const empresa =
                (vaga.empresa || '')
                    .toLowerCase();


            const matchTermoBusca =
                !termo ||
                cargo.includes(termo) ||
                empresa.includes(termo);


            // ============================
            // SALÁRIO
            // ============================

            let matchSalario = true;


            if (filtroSalario) {

                const salario =
                    vaga.salario
                        ? vaga.salario.toString()
                        : '';


                if (
                    filtroSalario ===
                    'especificado'
                ) {

                    matchSalario =
                        salario !== '' &&
                        salario !==
                            'Não especificado';
                }


                else if (
                    filtroSalario ===
                    'nao-especificado'
                ) {

                    matchSalario =
                        salario === '' ||
                        salario ===
                            'Não especificado';
                }


                else if (
                    filtroSalario ===
                    'comissionado'
                ) {

                    matchSalario =
                        salario
                            .toLowerCase()
                            .includes(
                                'comissionado'
                            );
                }
            }


            // ============================
            // EMPRESA
            // ============================

            const matchEmpresa =
                !filtroEmpresa ||
                vaga.empresa ===
                    filtroEmpresa;


            return (
                matchTermoBusca &&
                matchSalario &&
                matchEmpresa
            );
        });


    exibirVagas(vagasFiltradas);

    atualizarContador();
}


// ==================== ATUALIZAR CONTADOR ====================

function atualizarContador() {

    document.getElementById(
        'vagas-count'
    ).textContent =
        vagasFiltradas.length;
}


// ==================== ESCAPAR HTML ====================
// Evita que textos vindos do JSON quebrem o layout.

function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return '';
    }

    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// =========================================================
// FUNÇÃO PARA ATUALIZAR A DATA DE PUBLICAÇÃO
// =========================================================

function atualizarDataPublicacao() {
    const updateDateElement = document.getElementById('update-date');
    if (!updateDateElement) return;
    
    // Data atual
    const hoje = new Date();
    
    // Opções de formatação
    const opcoes = {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    };
    
    // Formatar data: "02 de setembro de 2026"
    const dataFormatada = hoje.toLocaleDateString('pt-BR', opcoes);
    
    // Atualizar o elemento
    updateDateElement.textContent = dataFormatada;
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    atualizarDataPublicacao();
});

// Também atualizar quando os filtros forem resetados
// ou quando novas vagas forem carregadas
function atualizarTudo() {
    aplicarFiltros();
    atualizarDataPublicacao();
}
