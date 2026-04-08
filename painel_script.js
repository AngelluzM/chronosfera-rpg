/**
 * CHRONOSFERA RPG - Motor de Tradução e Lógica do Painel
 */

let bancoDeDados = { personagens: [] };

const regrasClasses = {
    "Cavaleiro": { arquetipo: "Combatente", pv_base: 60, pm_base: 8, dados: { vigor: "d12", poder: "d10", magia: "d8", defesa_magica: "d8", velocidade: "d6", esquiva: "d6", precisao: "d4" } },
    "Construto": { arquetipo: "Combatente", pv_base: 72, pm_base: 6, dados: { poder: "d10", vigor: "d12", precisao: "d8", defesa_magica: "d8", magia: "d6", esquiva: "d6", velocidade: "d4" } },
    "Espadachim": { arquetipo: "Equilibrada", pv_base: 36, pm_base: 4, dados: { velocidade: "d12", poder: "d10", esquiva: "d8", precisao: "d8", vigor: "d6", defesa_magica: "d6", magia: "d4" } },
    "Selvagem": { arquetipo: "Equilibrada", pv_base: 48, pm_base: 4, dados: { esquiva: "d12", poder: "d10", velocidade: "d8", vigor: "d8", precisao: "d6", defesa_magica: "d6", magia: "d4" } },
    "Mecânico": { arquetipo: "Arcana / Tecnologia", pv_base: 32, pm_base: 20, dados: { precisao: "d12", magia: "d10", defesa_magica: "d8", vigor: "d8", poder: "d6", esquiva: "d6", velocidade: "d4" } },
    "Suporte": { arquetipo: "Arcana", pv_base: 24, pm_base: 20, dados: { defesa_magica: "d12", magia: "d10", precisao: "d8", velocidade: "d8", vigor: "d6", esquiva: "d6", poder: "d4" } },
    "Feiticeiro": { arquetipo: "Arcana", pv_base: 24, pm_base: 24, dados: { magia: "d12", defesa_magica: "d10", velocidade: "d8", poder: "d8", esquiva: "d6", vigor: "d6", precisao: "d4" } }
};

window.onload = () => {
    fetch('banco_de_dados.json?v=' + new Date().getTime())
        .then(r => r.json())
        .then(data => {
            if (data.personagens) {
                bancoDeDados = data;
                atualizarSeletorHTML();
            }
        }).catch(() => console.log("Banco de dados não carregado."));
};

function calcularFibonacci(v) { 
    return v >= 82 ? 5 : v >= 48 ? 4 : v >= 27 ? 3 : v >= 14 ? 2 : v >= 6 ? 1 : 0; 
}

function atualizarDadosMatriz() {
    const c = document.getElementById("classe").value;
    if(!c || !regrasClasses[c]) return;
    const d = regrasClasses[c].dados;
    document.getElementById("lbl_poder").innerText = "Poder ("+d.poder+")";
    document.getElementById("lbl_vigor").innerText = "Vigor ("+d.vigor+")";
    document.getElementById("lbl_velocidade").innerText = "Velocidade ("+d.velocidade+")";
    document.getElementById("lbl_magia").innerText = "Magia ("+d.magia+")";
    document.getElementById("lbl_precisao").innerText = "Precisão ("+d.precisao+")";
    document.getElementById("lbl_esquiva").innerText = "Esquiva ("+d.esquiva+")";
    document.getElementById("lbl_defesa_magica").innerText = "Defesa Mágica ("+d.defesa_magica+")";
}

// --- FUNÇÃO DE IMPORTAÇÃO CORRIGIDA ---
function importarJSON(e) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const ficha = JSON.parse(ev.target.result);
            // Deteta se é o formato da IA ou do Sistema
            if (ficha.dados_basicos || ficha.nome_personagem) {
                preencherFormulario(ficha);
                alert("Ficha carregada com sucesso! Verifique os campos antes de salvar.");
            } else {
                alert("Erro: O ficheiro JSON não é reconhecido como uma ficha de personagem.");
            }
        } catch (err) { 
            alert("Erro ao ler JSON: " + err.message); 
        }
        e.target.value = '';
    };
    reader.readAsText(e.target.files[0]);
}

function atualizarSeletorHTML() {
    const s = document.getElementById("seletorPersonagem");
    s.innerHTML = '<option value="">Selecione um personagem...</option>';
    bancoDeDados.personagens.forEach(p => {
        const o = document.createElement("option");
        o.value = p.id; o.innerText = p.dados_basicos.nome; s.appendChild(o);
    });
}

// --- TRADUTOR DE CAMPOS (IA -> SISTEMA) ---
function preencherFormulario(p) {
    // Normalização dos dados da IA
    const nome = p.nome_personagem || p.dados_basicos?.nome || '';
    const classe = p.classe || p.dados_basicos?.classe || '';
    const nivel = p.nivel || p.dados_basicos?.nivel || 1;
    const afinidade = p.afinidade_elemental || p.dados_basicos?.afinidade_elemental || 'Neutro';
    
    // Gerar ID automático se não existir
    const idSugerido = p.id || nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_');

    document.getElementById("id").value = idSugerido;
    document.getElementById("nome").value = nome;
    document.getElementById("nivel").value = nivel;
    document.getElementById("xp_atual").value = p.dados_basicos?.xp_atual || 0;
    document.getElementById("xp_proximo").value = p.dados_basicos?.xp_proximo || 50;
    document.getElementById("rd_armadura").value = p.status?.rd_armadura || 0;
    document.getElementById("raca").value = p.dados_basicos?.raca || '';
    document.getElementById("classe").value = classe;
    document.getElementById("url_imagem").value = p.url_imagem || '';
    document.getElementById("afinidade").value = afinidade;

    atualizarDadosMatriz();

    // Atributos (Lida com 'bruto' ou 'valor_bruto')
    const atrs = ['poder', 'vigor', 'velocidade', 'magia', 'precisao', 'esquiva', 'defesa_magica'];
    atrs.forEach(a => {
        const valorBruto = p.atributos?.[a]?.valor_bruto || p.atributos?.[a]?.bruto || 0;
        const valorMod = p.atributos?.[a]?.mod || 0;
        document.getElementById(a + "_bruto").value = valorBruto;
        document.getElementById(a + "_mod").value = valorMod;
    });

    // Listas Dinâmicas
    document.getElementById('lista-inventario').innerHTML = '';
    if(Array.isArray(p.inventario)) p.inventario.forEach(i => adicionarItem(i));

    document.getElementById('lista-techs').innerHTML = '';
    if(Array.isArray(p.techs)) p.techs.forEach(t => adicionarTech(t));

    document.getElementById('lista-lacos').innerHTML = '';
    if(Array.isArray(p.lacos)) p.lacos.forEach(l => adicionarLaco(l));
}

function carregarParaEdicao() {
    const id = document.getElementById("seletorPersonagem").value;
    const p = bancoDeDados.personagens.find(x => x.id === id);
    if(p) preencherFormulario(p);
}

function adicionarItem(i = {}) {
    const d = document.createElement('div'); d.className = 'box-dinamico item-box';
    d.innerHTML = `
        <button class="btn-remover" onclick="this.parentElement.remove()">Remover</button>
        <div class="grid-2">
            <div class="form-group"><label>Nome do Item</label><input type="text" class="i-nome" value="${i.nome || ''}"></div>
            <div class="form-group"><label>Qtd</label><input type="number" class="i-qtd" value="${i.quantidade || 1}"></div>
        </div>
        <div class="form-group"><label>Descrição / Efeito</label><textarea class="i-desc" rows="2">${i.desc || ''}</textarea></div>`;
    document.getElementById('lista-inventario').appendChild(d);
}

function adicionarLaco(l = {}) {
    const d = document.createElement('div'); d.className = 'box-dinamico laco-box';
    d.innerHTML = `
        <button class="btn-remover" onclick="this.parentElement.remove()">Remover</button>
        <div class="grid-2">
            <div class="form-group"><label>Vínculo com (Aliado)</label><input type="text" class="l-nome" value="${l.nome || ''}"></div>
            <div class="form-group"><label>Força do Laço (%)</label><input type="number" class="l-porc" value="${l.porcentagem || 0}"></div>
        </div>`;
    document.getElementById('lista-lacos').appendChild(d);
}

function adicionarTech(t = {}) {
    const d = document.createElement('div'); d.className = 'box-dinamico tech-box';
    d.innerHTML = `
        <button class="btn-remover" onclick="this.parentElement.remove()">Remover</button>
        <div class="grid-2">
            <div class="form-group"><label>Habilidade</label><input type="text" class="t-nome" value="${t.nome || ''}"></div>
            <div class="grid-2">
                <div class="form-group"><label>Custo (PM)</label><input type="text" class="t-custo" value="${t.custo || ''}"></div>
                <div class="form-group"><label>Elemento</label><input type="text" class="t-elemento" value="${t.elemento || ''}"></div>
            </div>
        </div>
        <div class="grid-3">
            <div class="form-group"><label>Alvo</label><input type="text" class="t-alvo" value="${t.alvo || ''}"></div>
            <div class="form-group">
                <label>Tipo</label>
                <select class="t-tipo">
                    <option value="Dano" ${t.tipo=='Dano'?'selected':''}>Dano</option>
                    <option value="Cura" ${t.tipo=='Cura'?'selected':''}>Cura</option>
                    <option value="Bônus" ${t.tipo=='Bônus'?'selected':''}>Bônus</option>
                    <option value="Escudo" ${t.tipo=='Escudo'?'selected':''}>Escudo</option>
                    <option value="Especial" ${t.tipo=='Especial'?'selected':''}>Especial</option>
                </select>
            </div>
            <div class="form-group"><label>Valor/Rolagem</label><input type="text" class="t-valor" value="${t.valor || ''}"></div>
        </div>
        <div class="form-group"><label>Efeito</label><textarea class="t-desc" rows="2">${t.desc || ''}</textarea></div>
        <div class="form-group"><label>Interação</label><textarea class="t-inter" rows="2">${t.inter || ''}</textarea></div>
        <div class="form-group"><label>Combo</label><textarea class="t-combo" rows="2">${t.combo || ''}</textarea></div>`;
    document.getElementById('lista-techs').appendChild(d);
}

function salvarPersonagem() {
    const id = document.getElementById("id").value;
    const cl = document.getElementById("classe").value;
    if(!id || !cl) return alert("ID e Classe obrigatórios!");
    
    const info = regrasClasses[cl];
    const attrs = {};
    ['poder','vigor','velocidade','magia','precisao','esquiva','defesa_magica'].forEach(a => {
        const b = parseInt(document.getElementById(a+"_bruto").value)||0;
        const m = parseInt(document.getElementById(a+"_mod").value)||0;
        const t = b + m;
        attrs[a] = { dado: info.dados[a], bruto: b, mod: m, total: t, bonus: calcularFibonacci(t) };
    });

    const p = {
        id, url_imagem: document.getElementById("url_imagem").value,
        techs: Array.from(document.querySelectorAll('.tech-box')).map(b => ({
            nome: b.querySelector('.t-nome').value, custo: b.querySelector('.t-custo').value,
            elemento: b.querySelector('.t-elemento').value, alvo: b.querySelector('.t-alvo').value,
            tipo: b.querySelector('.t-tipo').value, valor: b.querySelector('.t-valor').value,
            desc: b.querySelector('.t-desc').value, inter: b.querySelector('.t-inter').value,
            combo: b.querySelector('.t-combo').value
        })),
        inventario: Array.from(document.querySelectorAll('.item-box')).map(b => ({
            nome: b.querySelector('.i-nome').value, quantidade: parseInt(b.querySelector('.i-qtd').value)||1,
            desc: b.querySelector('.i-desc').value
        })),
        lacos: Array.from(document.querySelectorAll('.laco-box')).map(b => ({
            nome: b.querySelector('.l-nome').value, porcentagem: parseInt(b.querySelector('.l-porc').value)||0
        })),
        dados_basicos: {
            nome: document.getElementById("nome").value, nivel: parseInt(document.getElementById("nivel").value),
            xp_atual: parseInt(document.getElementById("xp_atual").value), xp_proximo: parseInt(document.getElementById("xp_proximo").value),
            raca: document.getElementById("raca").value, classe: cl, arquetipo: info.arquetipo, afinidade_elemental: document.getElementById("afinidade").value
        },
        status: { 
            pv_maximo: attrs.vigor.total + info.pv_base, pm_maximo: attrs.magia.total + info.pm_base, 
            nd_esquiva_base: 8 + attrs.esquiva.bonus, rd_armadura: parseInt(document.getElementById("rd_armadura").value) || 0
        },
        atributos: attrs
    };

    const idx = bancoDeDados.personagens.findIndex(x => x.id === id);
    if(idx > -1) bancoDeDados.personagens[idx] = p; else bancoDeDados.personagens.push(p);
    
    const blob = new Blob([JSON.stringify(bancoDeDados, null, 4)], { type: "application/json" });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = "banco_de_dados.json"; a.click();
}