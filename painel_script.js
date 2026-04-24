/**
 * CHRONOSFERA RPG - Lógica do Painel Mestre
 */

var bancoDeDados = { personagens: [] };

const regrasClasses = {
    "Cavaleiro": { arquetipo: "Combatente", pv_base: 60, pm_base: 8, dados: { vigor: "d10", poder: "d12", magia: "d8", defesa_magica: "d8", velocidade: "d6", esquiva: "d6", precisao: "d4" } },
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
        }).catch(() => console.log("Iniciando novo banco de dados."));
};

function calcularFibonacci(v) { 
    return v >= 82 ? 5 : v >= 48 ? 4 : v >= 27 ? 3 : v >= 14 ? 2 : v >= 6 ? 1 : 0; 
}

// Atualiza os labels dos dados e os valores Totais na UI
function atualizarDadosMatriz() {
    const c = document.getElementById("classe").value;
    if(!c || !regrasClasses[c]) return;
    const d = regrasClasses[c].dados;
    
    Object.keys(d).forEach(attr => {
        const label = document.getElementById("dado_" + attr);
        if(label) label.innerText = d[attr];
    });
    atualizarTotais();
}

// Rola o dado específico do atributo
function rolarAtributo(attr) {
    const c = document.getElementById("classe").value;
    if(!c) return alert("Selecione uma classe primeiro!");
    
    const dadoStr = regrasClasses[c].dados[attr];
    const faces = parseInt(dadoStr.replace('d', ''));
    const resultado = Math.floor(Math.random() * faces) + 1;
    
    document.getElementById(attr + "_bruto").value = resultado;
    atualizarTotais();
}

// Calcula Total e Bônus em tempo real
function atualizarTotais() {
    const atrs = ['poder', 'vigor', 'velocidade', 'magia', 'precisao', 'esquiva', 'defesa_magica'];
    atrs.forEach(a => {
        const bruto = parseInt(document.getElementById(a + "_bruto").value) || 0;
        const mod = parseInt(document.getElementById(a + "_mod").value) || 0;
        const total = bruto + mod;
        const bonus = calcularFibonacci(total);
        
        document.getElementById(a + "_total").innerText = total;
        document.getElementById(a + "_bonus").innerText = "+" + bonus;
    });
}

function recalcularPVPM() {
    const cl = document.getElementById("classe").value;
    if(!cl) return alert("Selecione a Classe!");
    const info = regrasClasses[cl];
    
    const vigorTotal = parseInt(document.getElementById("vigor_total").innerText) || 0;
    const magiaTotal = parseInt(document.getElementById("magia_total").innerText) || 0;
    
    document.getElementById("pv_maximo").value = vigorTotal + info.pv_base;
    document.getElementById("pm_maximo").value = magiaTotal + info.pm_base;
}

function importarJSON(e) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const data = JSON.parse(ev.target.result);
            if (data.personagens) {
                bancoDeDados = data;
                atualizarSeletorHTML();
                alert("Banco de dados carregado!");
            } else {
                preencherFormulario(data);
                alert("Ficha individual carregada!");
            }
        } catch (err) { alert("Erro ao ler JSON."); }
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

function preencherFormulario(p) {
    document.getElementById("id").value = p.id || '';
    document.getElementById("nome").value = p.dados_basicos?.nome || '';
    document.getElementById("nivel").value = p.dados_basicos?.nivel || 1;
    document.getElementById("xp_atual").value = p.dados_basicos?.xp_atual || 0;
    document.getElementById("xp_proximo").value = p.dados_basicos?.xp_proximo || 50;
    document.getElementById("rd_armadura").value = p.status?.rd_armadura || 0;
    document.getElementById("raca").value = p.dados_basicos?.raca || '';
    document.getElementById("classe").value = p.dados_basicos?.classe || '';
    document.getElementById("url_imagem").value = p.url_imagem || '';
    document.getElementById("afinidade").value = p.dados_basicos?.afinidade_elemental || 'Neutro';
    document.getElementById("pv_maximo").value = p.status?.pv_maximo || 0;
    document.getElementById("pm_maximo").value = p.status?.pm_maximo || 0;

    atualizarDadosMatriz();

    const atrs = ['poder', 'vigor', 'velocidade', 'magia', 'precisao', 'esquiva', 'defesa_magica'];
    atrs.forEach(a => {
        document.getElementById(a + "_bruto").value = p.atributos?.[a]?.bruto || 0;
        document.getElementById(a + "_mod").value = p.atributos?.[a]?.mod || 0;
    });

    document.getElementById('lista-inventario').innerHTML = '';
    if(Array.isArray(p.inventario)) p.inventario.forEach(i => adicionarItem(i));

    document.getElementById('lista-techs').innerHTML = '';
    if(Array.isArray(p.techs)) p.techs.forEach(t => adicionarTech(t));

    document.getElementById('lista-lacos').innerHTML = '';
    if(Array.isArray(p.lacos)) p.lacos.forEach(l => adicionarLaco(l));
    
    atualizarTotais();
}

function carregarParaEdicao() {
    const id = document.getElementById("seletorPersonagem").value;
    const p = bancoDeDados.personagens.find(x => x.id === id);
    if(p) preencherFormulario(p);
}

function adicionarItem(i = {}) {
    const d = document.createElement('div'); d.className = 'box-dinamico item-box';
    const isEquipado = i.equipado ? 'checked' : ''; 
    d.innerHTML = `
        <button class="btn-remover" onclick="this.parentElement.remove()">X</button>
        <div class="grid-2">
            <div class="form-group"><label>Item</label><input type="text" class="i-nome" value="${i.nome || ''}"></div>
            <div class="grid-2">
                <div class="form-group"><label>Qtd</label><input type="number" class="i-qtd" value="${i.quantidade || 1}"></div>
                <div class="form-group"><label>Equipado</label><input type="checkbox" class="i-equip" ${isEquipado} style="width:20px;height:20px"></div>
            </div>
        </div>
        <textarea class="i-desc" placeholder="Descrição">${i.desc || ''}</textarea>`;
    document.getElementById('lista-inventario').appendChild(d);
}

function adicionarLaco(l = {}) {
    const d = document.createElement('div'); d.className = 'box-dinamico laco-box';
    d.innerHTML = `
        <button class="btn-remover" onclick="this.parentElement.remove()">X</button>
        <div class="grid-2">
            <div class="form-group"><label>Vínculo</label><input type="text" class="l-nome" value="${l.nome || ''}"></div>
            <div class="form-group"><label>%</label><input type="number" class="l-porc" value="${l.porcentagem || 0}"></div>
        </div>`;
    document.getElementById('lista-lacos').appendChild(d);
}

function adicionarTech(t = {}) {
    const d = document.createElement('div'); d.className = 'box-dinamico tech-box';
    d.innerHTML = `
        <button class="btn-remover" onclick="this.parentElement.remove()">X</button>
        <div class="grid-2">
            <input type="text" class="t-nome" placeholder="Habilidade" value="${t.nome || ''}">
            <div class="grid-2"><input type="text" class="t-custo" placeholder="Custo" value="${t.custo || ''}"><input type="text" class="t-elemento" placeholder="Elem" value="${t.elemento || ''}"></div>
        </div>
        <textarea class="t-desc" placeholder="Descrição">${t.desc || ''}</textarea>`;
    document.getElementById('lista-techs').appendChild(d);
}

function salvarPersonagem() {
    const id = document.getElementById("id").value;
    const cl = document.getElementById("classe").value;
    if(!id || !cl) return alert("ID e Classe são obrigatórios!");
    
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
        dados_basicos: {
            nome: document.getElementById("nome").value, nivel: parseInt(document.getElementById("nivel").value),
            xp_atual: parseInt(document.getElementById("xp_atual").value), xp_proximo: parseInt(document.getElementById("xp_proximo").value),
            raca: document.getElementById("raca").value, classe: cl, arquetipo: info.arquetipo, afinidade_elemental: document.getElementById("afinidade").value
        },
        status: { 
            pv_maximo: parseInt(document.getElementById("pv_maximo").value) || 0,
            pm_maximo: parseInt(document.getElementById("pm_maximo").value) || 0,
            nd_esquiva_base: 8 + attrs.esquiva.bonus, rd_armadura: parseInt(document.getElementById("rd_armadura").value) || 0
        },
        atributos: attrs,
        inventario: Array.from(document.querySelectorAll('.item-box')).map(b => ({
            nome: b.querySelector('.i-nome').value, quantidade: parseInt(b.querySelector('.i-qtd').value)||1,
            equipado: b.querySelector('.i-equip').checked, desc: b.querySelector('.i-desc').value
        })),
        techs: Array.from(document.querySelectorAll('.tech-box')).map(b => ({
            nome: b.querySelector('.t-nome').value, custo: b.querySelector('.t-custo').value, desc: b.querySelector('.t-desc').value
        })),
        lacos: Array.from(document.querySelectorAll('.laco-box')).map(b => ({
            nome: b.querySelector('.l-nome').value, porcentagem: parseInt(b.querySelector('.l-porc').value)||0
        }))
    };

    const idx = bancoDeDados.personagens.findIndex(x => x.id === id);
    if(idx > -1) bancoDeDados.personagens[idx] = p; else bancoDeDados.personagens.push(p);
    
    const blob = new Blob([JSON.stringify(bancoDeDados, null, 4)], { type: "application/json" });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = "banco_de_dados.json"; a.click();
}