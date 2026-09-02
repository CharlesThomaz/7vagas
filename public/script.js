// ==================== VARIÁVEIS GLOBAIS ====================

let todasAsVagas = [];
let vagasFiltradas = [];


// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', () => {
    carregarVagas();
    inicializarEventos();
});


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

    vagas.forEach(vaga => {

        const card = criarCartaoVaga(vaga);

        container.appendChild(card);
    });
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
                    onclick="abrirModal(${Number(vaga.id)})"
                >
                    Detalhes
                </button>


                <button
                    type="button"
                    class="btn-contato"
                    onclick="abrirContato(${Number(vaga.id)})"
                >
                    Contato
                </button>

            </div>

        </div>
    `;

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