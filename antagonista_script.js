let bancoAntagonistas = { personagens: [] }; // Mantemos a chave 'personagens' para reaproveitar a lógica de renderização se quiser

window.onload = () => {
    fetch('banco_antagonistas.json?v=' + new Date().getTime())
        .then(r => r.json())
        .then(data => {
            if (data.personagens) {
                bancoAntagonistas = data;
                atualizarSeletorHTML();
            }
        }).catch(() => console.log("Iniciando novo Bestiário."));
};

function calcularFibonacci(v) { 
    return v >= 82 ? 5 : v >= 48 ? 4 : v >= 27 ? 3 : v >= 14 ? 2 : v >= 6 ? 1 : 0; 
}

// Para antagonistas, o dado de cada atributo pode ser fixo ou definido por Tier. 
// Aqui usamos d10 como padrão, mas você pode ajustar.
function atualizarDadosMatriz() {
    const labels = ['poder','vigor','velocidade','magia','precisao','esquiva','defesa_magica'];
    labels.forEach(l => {
        const el = document.getElementById("lbl_" + l);
        if(el) el.innerText = l.charAt(0).toUpperCase() + l.slice(1) + " (d10)";
    });
}

function importarJSON(e) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const ficha = JSON.parse(ev.target.result);
            preencherFormulario(ficha);
            alert("Dados do antagonista carregados!");
        } catch (err) { alert("Erro ao importar vilão."); }
        e.target.value = '';
    };
    reader.readAsText(e.target.files[0]);
}

function atualizarSeletorHTML() {
    const s = document.getElementById("seletorAntagonista");
    s.innerHTML = '<option value="">Selecionar Antagonista...</option>';
    bancoAntagonistas.personagens.forEach(p => {
        const o = document.createElement("option");
        o.value = p.id; o.innerText = p.dados_basicos.nome; s.appendChild(o);
    });
}

function preencherFormulario(p) {
    document.getElementById("id").value = p.id || '';
    document.getElementById("nome").value = p.nome_personagem || p.dados_basicos?.nome || '';
    document.getElementById("nivel").value = p.nivel || p.dados_basicos?.nivel || 1;
    document.getElementById("tipo_inimigo").value = p.tipo_inimigo || p.dados_basicos?.arquetipo || '';
    document.getElementById("rd_armadura").value = p.status?.rd_armadura || 0;
    document.getElementById("url_imagem").value = p.url_imagem || '';
    document.getElementById("afinidade").value = p.afinidade_elemental || p.dados_basicos?.afinidade_elemental || 'Neutro';

    const atrs = ['poder', 'vigor', 'velocidade', 'magia', 'precisao', 'esquiva', 'defesa_magica'];
    atrs.forEach(a => {
        document.getElementById(a + "_bruto").value = p.atributos?.[a]?.valor_bruto || p.atributos?.[a]?.bruto || 0;
        document.getElementById(a + "_mod").value = p.atributos?.[a]?.mod || 0;
    });

    document.getElementById('lista-techs').innerHTML = '';
    if(Array.isArray(p.techs)) p.techs.forEach(t => adicionarTech(t));

    document.getElementById('lista-drops').innerHTML = '';
    if(Array.isArray(p.inventario)) p.inventario.forEach(i => adicionarDrop(i));
}

function carregarParaEdicao() {
    const id = document.getElementById("seletorAntagonista").value;
    const p = bancoAntagonistas.personagens.find(x => x.id === id);
    if(p) preencherFormulario(p);
}

function adicionarTech(t = {}) {
    const d = document.createElement('div'); d.className = 'box-dinamico tech-box';
    d.innerHTML = `
        <button class="btn-remover" onclick="this.parentElement.remove()">Remover</button>
        <div class="grid-2">
            <div class="form-group"><label>Ação / Habilidade</label><input type="text" class="t-nome" value="${t.nome || ''}"></div>
            <div class="form-group"><label>Valor/Dano</label><input type="text" class="t-valor" value="${t.valor || ''}"></div>
        </div>
        <div class="form-group"><label>Descrição do Efeito</label><textarea class="t-desc" rows="2">${t.desc || ''}</textarea></div>`;
    document.getElementById('lista-techs').appendChild(d);
}

function adicionarDrop(i = {}) {
    const d = document.createElement('div'); d.className = 'box-dinamico drop-box';
    d.innerHTML = `
        <button class="btn-remover" onclick="this.parentElement.remove()">Remover</button>
        <div class="grid-2">
            <div class="form-group"><label>Item de Recompensa</label><input type="text" class="i-nome" value="${i.nome || ''}"></div>
            <div class="form-group"><label>Chance / Qtd</label><input type="text" class="i-qtd" value="${i.quantidade || '100%'}"></div>
        </div>`;
    document.getElementById('lista-drops').appendChild(d);
}

function salvarAntagonista() {
    const id = document.getElementById("id").value;
    if(!id) return alert("ID obrigatório!");
    
    const attrs = {};
    ['poder','vigor','velocidade','magia','precisao','esquiva','defesa_magica'].forEach(a => {
        const b = parseInt(document.getElementById(a+"_bruto").value)||0;
        const m = parseInt(document.getElementById(a+"_mod").value)||0;
        const t = b + m;
        attrs[a] = { dado: "d10", bruto: b, mod: m, total: t, bonus: calcularFibonacci(t) };
    });

    const p = {
        id, url_imagem: document.getElementById("url_imagem").value,
        techs: Array.from(document.querySelectorAll('.tech-box')).map(b => ({
            nome: b.querySelector('.t-nome').value, valor: b.querySelector('.t-valor').value, desc: b.querySelector('.t-desc').value
        })),
        inventario: Array.from(document.querySelectorAll('.drop-box')).map(b => ({
            nome: b.querySelector('.i-nome').value, quantidade: b.querySelector('.i-qtd').value
        })),
        dados_basicos: {
            nome: document.getElementById("nome").value, nivel: parseInt(document.getElementById("nivel").value),
            arquetipo: document.getElementById("tipo_inimigo").value, afinidade_elemental: document.getElementById("afinidade").value,
            classe: "Antagonista"
        },
        status: { 
            pv_maximo: attrs.vigor.total * 10, // Exemplo: monstros tem mais vida
            pm_maximo: attrs.magia.total * 5,
            nd_esquiva_base: 8 + attrs.esquiva.bonus,
            rd_armadura: parseInt(document.getElementById("rd_armadura").value) || 0
        },
        atributos: attrs
    };

    const idx = bancoAntagonistas.personagens.findIndex(x => x.id === id);
    if(idx > -1) bancoAntagonistas.personagens[idx] = p; else bancoAntagonistas.personagens.push(p);
    
    const blob = new Blob([JSON.stringify(bancoAntagonistas, null, 4)], { type: "application/json" });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = "banco_antagonistas.json"; a.click();
}