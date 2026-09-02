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
        document.getElementById('vagas-container').innerHTML = 
            '<div class="no-results"><p>Erro ao carregar as vagas. Tente recarregar a página.</p></div>';
    }
}

// ==================== POPULAR FILTRO DE EMPRESAS ====================
function popularFiltroEmpresas() {
    const empresas = [...new Set(todasAsVagas.map(vaga => vaga.empresa))];
    const selectEmpresas = document.getElementById('company-filter');
    
    empresas.forEach(empresa => {
        const option = document.createElement('option');
        option.value = empresa;
        option.textContent = empresa;
        selectEmpresas.appendChild(option);
    });
}

// ==================== EXIBIR VAGAS ====================
function exibirVagas(vagas) {
    const container = document.getElementById('vagas-container');
    const noResults = document.getElementById('no-results');
    
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
    const card = document.createElement('div');
    card.className = 'vaga-card';
    
    // Formatar localização
    const localizacao = formatarLocalizacao(vaga.local_trabalho);
    
    // Formatar salário
    const salario = vaga.salario || 'Não especificado';
    const classSalario = !vaga.salario || vaga.salario === 'Não especificado' ? 'nao-especificado' : '';
    
    card.innerHTML = `
        <div class="vaga-image">
            <span>💼</span>
        </div>
        <div class="vaga-content">
            <div class="vaga-cargo">${vaga.cargo}</div>
            <div class="vaga-empresa">${vaga.empresa}</div>
            
            <div class="vaga-localizacao">
                <span class="vaga-localizacao-icon">📍</span>
                <div>${localizacao}</div>
            </div>
            
            <div class="vaga-info">
                <span class="vaga-info-icon">💰</span>
                <span>${salario}</span>
            </div>
            
            <div class="vaga-info">
                <span class="vaga-info-icon">⏰</span>
                <span>${vaga.escala || 'Não especificada'}</span>
            </div>
            
            <div class="vaga-descricao">${vaga.descricao_vaga || 'Sem descrição disponível'}</div>
            
            <div class="vaga-tags">
                ${vaga.escala ? `<span class="tag escala">${vaga.escala}</span>` : ''}
                <span class="tag">Ver detalhes</span>
            </div>
            
            <div class="vaga-footer">
                <button class="btn-detalhes" onclick="abrirModal(${vaga.id})">Detalhes</button>
                <button class="btn-contato" onclick="abrirContato(${vaga.id})">Contato</button>
            </div>
        </div>
    `;
    
    return card;
}

// ==================== FORMATAR LOCALIZAÇÃO ====================
function formatarLocalizacao(local) {
    const partes = [];
    
    if (local.rua) partes.push(local.rua);
    if (local.bairro) partes.push(local.bairro);
    if (local.cidade) partes.push(local.cidade);
    if (local.estado) partes.push(local.estado);
    
    return partes.length > 0 ? partes.join(', ') : 'Local não especificado';
}

// ==================== ABRIR MODAL COM DETALHES ====================
function abrirModal(vagaId) {
    const vaga = todasAsVagas.find(v => v.id === vagaId);
    if (!vaga) return;
    
    const modalBody = document.getElementById('modal-body');
    const localizacao = formatarLocalizacao(vaga.local_trabalho);
    const salario = vaga.salario || 'Não especificado';
    
    // Formatar horários
    let horarios = '';
    if (vaga.horario) {
        if (vaga.horario.segunda_a_sexta) {
            horarios += `<strong>Segunda a Sexta:</strong> ${vaga.horario.segunda_a_sexta}<br>`;
        }
        if (vaga.horario.sabado) {
            horarios += `<strong>Sábado:</strong> ${vaga.horario.sabado}<br>`;
        }
        if (vaga.horario.diario) {
            horarios += `<strong>Horário:</strong> ${vaga.horario.diario}<br>`;
        }
        if (vaga.horario.observacao) {
            horarios += `<strong>Observação:</strong> ${vaga.horario.observacao}<br>`;
        }
        if (vaga.horario.tipo) {
            horarios += `<strong>Tipo:</strong> ${vaga.horario.tipo}<br>`;
        }
    }
    
    // Benefícios
    let beneficiosHTML = '';
    if (vaga.beneficios && vaga.beneficios.length > 0) {
        beneficiosHTML = `
            <div class="modal-section">
                <div class="modal-section-title">✨ Benefícios</div>
                <ul class="modal-list">
                    ${vaga.beneficios.map(b => `<li>${b}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Requisitos
    let requisitosHTML = '';
    if (vaga.requisitos && vaga.requisitos.length > 0) {
        requisitosHTML = `
            <div class="modal-section">
                <div class="modal-section-title">📋 Requisitos</div>
                <ul class="modal-list">
                    ${vaga.requisitos.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Habilidades desejadas
    let habilidadesHTML = '';
    if (vaga.habilidades_desejadas && vaga.habilidades_desejadas.length > 0) {
        habilidadesHTML = `
            <div class="modal-section">
                <div class="modal-section-title">🎯 Habilidades Desejadas</div>
                <ul class="modal-list">
                    ${vaga.habilidades_desejadas.map(h => `<li>${h}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Diferenciais
    let diferenciaisHTML = '';
    if (vaga.diferencial && vaga.diferencial.length > 0) {
        diferenciaisHTML = `
            <div class="modal-section">
                <div class="modal-section-title">⭐ Diferenciais</div>
                <ul class="modal-list">
                    ${vaga.diferencial.map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Botões de contato
    let botoesContato = '';
    if (vaga.contato) {
        if (vaga.contato.whatsapp) {
            const whatsappLink = `https://wa.me/55${vaga.contato.whatsapp.replace(/\D/g, '')}?text=Olá! Tenho interesse na vaga de ${vaga.cargo} na ${vaga.empresa}.`;
            botoesContato += `<a href="${whatsappLink}" target="_blank" class="btn-whatsapp">📱 WhatsApp</a>`;
        }
        if (vaga.contato.email) {
            const emailLink = `mailto:${vaga.contato.email}?subject=Interesse na vaga de ${vaga.cargo} na ${vaga.empresa}`;
            botoesContato += `<a href="${emailLink}" class="btn-email">📧 Email</a>`;
        }
    }
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-cargo">${vaga.cargo}</div>
            <div class="modal-empresa">${vaga.empresa}</div>
        </div>
        
        <div class="modal-section">
            <div class="modal-section-title">📝 Descrição da Vaga</div>
            <div class="modal-section-content">${vaga.descricao_vaga}</div>
        </div>
        
        <div class="modal-section">
            <div class="modal-section-title">📍 Localização e Horários</div>
            <div class="modal-info-grid">
                <div class="modal-info-item">
                    <div class="modal-info-label">Endereço</div>
                    <div class="modal-info-value">${localizacao}</div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Salário</div>
                    <div class="modal-info-value">${salario}</div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Escala</div>
                    <div class="modal-info-value">${vaga.escala || 'Não especificada'}</div>
                </div>
            </div>
            <div style="margin-top: 15px; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
                <div class="modal-info-label">Horários</div>
                <div class="modal-section-content">${horarios || 'Não especificado'}</div>
            </div>
        </div>
        
        ${beneficiosHTML}
        ${requisitosHTML}
        ${habilidadesHTML}
        ${diferenciaisHTML}
        
        <div class="modal-section">
            <div class="modal-section-title">📞 Entre em Contato</div>
            <div class="modal-contact-buttons">
                ${botoesContato || '<p class="modal-section-content">Contato não especificado. Consulte a divulgação original.</p>'}
            </div>
            <div class="modal-section-content" style="margin-top: 15px;">
                <strong>Divulgação:</strong> ${vaga.divulgacao || 'Não especificada'}
            </div>
        </div>
    `;
    
    document.getElementById('modal').style.display = 'flex';
}

// ==================== FECHAR MODAL ====================
function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

document.querySelector('.close-modal').addEventListener('click', fecharModal);

window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        fecharModal();
    }
});

// ==================== ABRIR CONTATO DIRETO ====================
function abrirContato(vagaId) {
    const vaga = todasAsVagas.find(v => v.id === vagaId);
    if (!vaga || !vaga.contato) return;
    
    if (vaga.contato.whatsapp) {
        const whatsappLink = `https://wa.me/55${vaga.contato.whatsapp.replace(/\D/g, '')}?text=Olá! Tenho interesse na vaga de ${vaga.cargo} na ${vaga.empresa}.`;
        window.open(whatsappLink, '_blank');
    } else if (vaga.contato.email) {
        const emailLink = `mailto:${vaga.contato.email}?subject=Interesse na vaga de ${vaga.cargo} na ${vaga.empresa}`;
        window.location.href = emailLink;
    }
}

// ==================== INICIALIZAR EVENTOS ====================
function inicializarEventos() {
    // Filtro de busca
    document.getElementById('search-input').addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        filtrarVagas(termo, null, null);
    });
    
    // Filtro de salário
    document.getElementById('salary-filter').addEventListener('change', (e) => {
        const searchTermo = document.getElementById('search-input').value.toLowerCase();
        const empresa = document.getElementById('company-filter').value;
        filtrarVagas(searchTermo, e.target.value, empresa);
    });
    
    // Filtro de empresa
    document.getElementById('company-filter').addEventListener('change', (e) => {
        const searchTermo = document.getElementById('search-input').value.toLowerCase();
        const salario = document.getElementById('salary-filter').value;
        filtrarVagas(searchTermo, salario, e.target.value);
    });
    
    // Botão de limpar filtros
    document.getElementById('reset-filters').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.getElementById('salary-filter').value = '';
        document.getElementById('company-filter').value = '';
        vagasFiltradas = [...todasAsVagas];
        exibirVagas(vagasFiltradas);
        atualizarContador();
    });
}

// ==================== FILTRAR VAGAS ====================
function filtrarVagas(termo, filtroSalario, filtroEmpresa) {
    vagasFiltradas = todasAsVagas.filter(vaga => {
        // Filtro de busca (cargo ou empresa)
        const matchTermoBusca = !termo || 
            vaga.cargo.toLowerCase().includes(termo) || 
            vaga.empresa.toLowerCase().includes(termo);
        
        // Filtro de salário
        let matchSalario = true;
        if (filtroSalario) {
            if (filtroSalario === 'especificado') {
                matchSalario = vaga.salario && vaga.salario !== 'Não especificado';
            } else if (filtroSalario === 'nao-especificado') {
                matchSalario = !vaga.salario || vaga.salario === 'Não especificado';
            } else if (filtroSalario === 'comissionado') {
                matchSalario = vaga.salario && vaga.salario.toLowerCase().includes('comissionado');
            }
        }
        
        // Filtro de empresa
        const matchEmpresa = !filtroEmpresa || vaga.empresa === filtroEmpresa;
        
        return matchTermoBusca && matchSalario && matchEmpresa;
    });
    
    exibirVagas(vagasFiltradas);
    atualizarContador();
}

// ==================== ATUALIZAR CONTADOR ====================
function atualizarContador() {
    document.getElementById('vagas-count').textContent = vagasFiltradas.length;
}