/**
 * CHRONOSFERA RPG - Lógica do Laboratório de Antagonistas
 */

let bancoAntagonistas = { personagens: [] };

window.onload = () => {
    fetch('banco_antagonistas.json?v=' + new Date().getTime())
        .then(r => r.json())
        .then(data => {
            if (data.personagens) {
                bancoAntagonistas = data;
                renderizarSidebar();
            }
        }).catch(() => {
            document.getElementById("lista-cards").innerHTML = '<p style="text-align:center; color:#bdc3c7;">Nenhum banco encontrado. Crie o primeiro monstro!</p>';
        });
};

function calcularFibonacci(v) { 
    return v >= 82 ? 5 : v >= 48 ? 4 : v >= 27 ? 3 : v >= 14 ? 2 : v >= 6 ? 1 : 0; 
}

function atualizarTotais() {
    ['poder', 'vigor', 'velocidade', 'magia', 'precisao', 'esquiva', 'defesa_magica'].forEach(a => {
        const bruto = parseInt(document.getElementById(a + "_bruto").value) || 0;
        const mod = parseInt(document.getElementById(a + "_mod").value) || 0;
        const total = bruto + mod;
        const bonus = calcularFibonacci(total);
        
        document.getElementById(a + "_total").innerText = total;
        document.getElementById(a + "_bonus").innerText = "+" + bonus;
    });
}

// === AQUI FICA A INCLUSÃO DA IMAGEM NOS CARDS ===
function renderizarSidebar() {
    const container = document.getElementById("lista-cards");
    container.innerHTML = '';

    if (bancoAntagonistas.personagens.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#bdc3c7;">Bestiário vazio.</p>';
        return;
    }

    const monstrosOrdenados = [...bancoAntagonistas.personagens].sort((a, b) => b.dados_basicos.nivel - a.dados_basicos.nivel);

    monstrosOrdenados.forEach(p => {
        let techsResumo = "Nenhuma";
        if (p.techs && p.techs.length > 0) {
            techsResumo = p.techs.map(t => t.nome).join(", ");
        }

        // Se não tiver imagem, usa um placeholder visualmente neutro
        const imgUrl = p.url_imagem && p.url_imagem.trim() !== "" 
            ? p.url_imagem 
            : 'https://via.placeholder.com/50/1a252f/bdc3c7?text=?';

        const card = document.createElement("div");
        card.className = "monster-card";
        card.innerHTML = `
            <div class="monster-header">
                <img src="${imgUrl}" class="monster-thumb" alt="Avatar">
                <div class="monster-title-area">
                    <h4>${p.dados_basicos.nome} <span class="badge">Nv ${p.dados_basicos.nivel}</span></h4>
                    <p style="margin:0;"><strong>Tipo:</strong> ${p.dados_basicos.arquetipo} | <strong>Afin:</strong> ${p.dados_basicos.afinidade_elemental}</p>
                </div>
            </div>
            <p><strong>PV:</strong> ${p.combate.pv_maximo} | <strong>PM:</strong> ${p.combate.pm_maximo} | <strong>RD:</strong> ${p.combate.rd}</p>
            <p><strong>Esq:</strong> ${p.combate.esquiva_base} | <strong>Atq:</strong> ${p.combate.bonus_ataque} | <strong>Dano:</strong> ${p.combate.dano_base}</p>
            <div class="tech-list"><strong>Techs:</strong> ${techsResumo}</div>
            <button class="btn-editar" onclick="carregarParaEdicao('${p.id}')">✏️ Editar no Painel</button>
        `;
        container.appendChild(card);
    });
}

function limparFormulario() {
    document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(el => el.value = '');
    document.getElementById("nivel").value = 1;
    document.getElementById("tipo").value = "Mob";
    document.getElementById("afinidade").value = "Neutro";
    
    ['pv', 'pm', 'rd', 'esquiva_base'].forEach(id => document.getElementById(id).value = 0);
    
    ['poder', 'vigor', 'velocidade', 'magia', 'precisao', 'esquiva', 'defesa_magica'].forEach(a => {
        document.getElementById(a + "_bruto").value = 0;
        document.getElementById(a + "_mod").value = 0;
    });

    document.getElementById('lista-techs').innerHTML = '';
    document.getElementById('lista-drops').innerHTML = '';
    
    atualizarTotais();
}

function importarJSON(e) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const importado = JSON.parse(ev.target.result);
            if (importado.personagens) {
                bancoAntagonistas = importado;
                renderizarSidebar();
                alert("Banco de dados carregado com sucesso!");
            } else {
                preencherFormulario(importado);
                alert("Ficha individual importada!");
            }
        } catch (err) { alert("Erro ao ler JSON."); }
        e.target.value = '';
    };
    reader.readAsText(e.target.files[0]);
}

function preencherFormulario(p) {
    document.getElementById("id").value = p.id || '';
    document.getElementById("nome").value = p.dados_basicos?.nome || '';
    document.getElementById("nivel").value = p.dados_basicos?.nivel || 1;
    document.getElementById("tipo").value = p.dados_basicos?.arquetipo || 'Mob';
    document.getElementById("afinidade").value = p.dados_basicos?.afinidade_elemental || 'Neutro';
    document.getElementById("url_imagem").value = p.url_imagem || '';

    document.getElementById("pv").value = p.combate?.pv_maximo || 10;
    document.getElementById("pm").value = p.combate?.pm_maximo || 0;
    document.getElementById("rd").value = p.combate?.rd || 0;
    document.getElementById("esquiva_base").value = p.combate?.esquiva_base || 8;
    document.getElementById("ataque").value = p.combate?.bonus_ataque || '+0';
    document.getElementById("dano").value = p.combate?.dano_base || '1d4';

    const atrs = ['poder', 'vigor', 'velocidade', 'magia', 'precisao', 'esquiva', 'defesa_magica'];
    atrs.forEach(a => {
        document.getElementById(a + "_bruto").value = p.atributos?.[a]?.bruto || p.atributos?.[a]?.valor_bruto || 0;
        document.getElementById(a + "_mod").value = p.atributos?.[a]?.mod || 0;
    });

    document.getElementById('lista-techs').innerHTML = '';
    if(Array.isArray(p.techs)) p.techs.forEach(t => adicionarTech(t));

    document.getElementById('lista-drops').innerHTML = '';
    if(Array.isArray(p.drops) || Array.isArray(p.inventario)) {
        const dropsList = p.drops || p.inventario;
        dropsList.forEach(d => adicionarDrop(d));
    }
    
    atualizarTotais();
}

function carregarParaEdicao(id) {
    const p = bancoAntagonistas.personagens.find(x => x.id === id);
    if (p) preencherFormulario(p);
}

function gerarStatusAutomatico() {
    const nivel = parseInt(document.getElementById("nivel").value) || 1;
    const tipo = document.getElementById("tipo").value;
    
    let mult = 1; let baseDano = "1d6";
    if (tipo === "Elite") { mult = 2.5; baseDano = "2d6"; }
    else if (tipo === "Subchefe") { mult = 4; baseDano = "2d8"; }
    else if (tipo === "Boss") { mult = 8; baseDano = "3d8"; }
    else if (tipo === "NPC") { mult = 1.5; baseDano = "1d4"; }

    const baseAtr = Math.floor(nivel * mult * 1.5);
    
    ['poder', 'vigor', 'velocidade', 'magia', 'precisao', 'esquiva', 'defesa_magica'].forEach(a => {
        const variacao = Math.random() * 0.4 - 0.2; 
        let valorFim = Math.floor(baseAtr + (baseAtr * variacao));
        if(valorFim < 0) valorFim = 0;
        document.getElementById(a + "_bruto").value = valorFim;
        document.getElementById(a + "_mod").value = 0;
    });

    atualizarTotais();

    const vigorGid = parseInt(document.getElementById("vigor_bruto").value);
    const magiaGid = parseInt(document.getElementById("magia_bruto").value);
    const esquivaGid = parseInt(document.getElementById("esquiva_bruto").value);
    const precisaoGid = parseInt(document.getElementById("precisao_bruto").value);
    const poderGid = parseInt(document.getElementById("poder_bruto").value);

    document.getElementById("pv").value = Math.floor((vigorGid * 5) + (nivel * 10 * mult));
    document.getElementById("pm").value = Math.floor((magiaGid * 2) + (nivel * 5));
    document.getElementById("esquiva_base").value = 8 + calcularFibonacci(esquivaGid) + Math.floor(nivel/3);
    document.getElementById("rd").value = Math.floor(nivel * (mult / 2));
    
    const bonusAtq = calcularFibonacci(precisaoGid) + Math.floor(nivel/2);
    document.getElementById("ataque").value = "+" + bonusAtq;
    
    const poderBonus = calcularFibonacci(poderGid);
    document.getElementById("dano").value = `${baseDano} + ${poderBonus}`;

    alert(`Atributos gerados! Reveja os dados.`);
}

function adicionarTech(t = {}) {
    const d = document.createElement('div'); d.className = 'box-dinamico tech-box';
    d.innerHTML = `
        <button class="btn-remover" onclick="this.parentElement.remove()">X</button>
        <div class="grid-3">
            <div class="form-group"><label>Ação / Habilidade</label><input type="text" class="t-nome" value="${t.nome || ''}"></div>
            <div class="form-group"><label>Alvo / Alcance</label><input type="text" class="t-alvo" value="${t.alvo || ''}"></div>
            <div class="form-group"><label>Valor (Dano/Cura)</label><input type="text" class="t-valor" value="${t.valor || ''}"></div>
        </div>
        <div class="form-group"><label>Descrição do Efeito</label><textarea class="t-desc" rows="2">${t.desc || ''}</textarea></div>`;
    document.getElementById('lista-techs').appendChild(d);
}

function adicionarDrop(d = {}) {
    const div = document.createElement('div'); div.className = 'box-dinamico drop-box';
    div.innerHTML = `
        <button class="btn-remover" onclick="this.parentElement.remove()">X</button>
        <div class="grid-2">
            <div class="form-group"><label>Item / Recompensa</label><input type="text" class="d-nome" value="${d.nome || ''}"></div>
            <div class="form-group"><label>Qtd ou Condição</label><input type="text" class="d-qtd" value="${d.quantidade || '100%'}"></div>
        </div>`;
    document.getElementById('lista-drops').appendChild(div);
}

function salvarAntagonista() {
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    if(!id || !nome) return alert("Erro: Nome e ID Único são obrigatórios!");

    const attrs = {};
    ['poder','vigor','velocidade','magia','precisao','esquiva','defesa_magica'].forEach(a => {
        const b = parseInt(document.getElementById(a+"_bruto").value)||0;
        const m = parseInt(document.getElementById(a+"_mod").value)||0;
        const t = b + m;
        attrs[a] = { dado: "d10", bruto: b, mod: m, total: t, bonus: calcularFibonacci(t) };
    });

    const p = {
        id: id,
        url_imagem: document.getElementById("url_imagem").value,
        dados_basicos: {
            nome: nome,
            nivel: parseInt(document.getElementById("nivel").value),
            arquetipo: document.getElementById("tipo").value,
            afinidade_elemental: document.getElementById("afinidade").value,
            classe: "Antagonista"
        },
        combate: {
            pv_maximo: parseInt(document.getElementById("pv").value) || 0,
            pm_maximo: parseInt(document.getElementById("pm").value) || 0,
            rd: parseInt(document.getElementById("rd").value) || 0,
            esquiva_base: parseInt(document.getElementById("esquiva_base").value) || 8,
            bonus_ataque: document.getElementById("ataque").value,
            dano_base: document.getElementById("dano").value
        },
        atributos: attrs,
        techs: Array.from(document.querySelectorAll('.tech-box')).map(b => ({
            nome: b.querySelector('.t-nome').value, alvo: b.querySelector('.t-alvo').value,
            valor: b.querySelector('.t-valor').value, desc: b.querySelector('.t-desc').value
        })),
        drops: Array.from(document.querySelectorAll('.drop-box')).map(b => ({
            nome: b.querySelector('.d-nome').value, quantidade: b.querySelector('.d-qtd').value
        }))
    };

    const idx = bancoAntagonistas.personagens.findIndex(x => x.id === id);
    if(idx > -1) bancoAntagonistas.personagens[idx] = p; else bancoAntagonistas.personagens.push(p);
    
    renderizarSidebar();
    
    const blob = new Blob([JSON.stringify(bancoAntagonistas, null, 4)], { type: "application/json" });
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(blob); 
    a.download = "banco_antagonistas.json"; 
    a.click();
}