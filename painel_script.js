/**
 * CHRONOSFERA RPG - Lógica do Painel Mestre (V5.0)
 */

var bancoDeDados = { personagens: [] };

const regrasClasses = {
    "Cavaleiro": { arquetipo: "Combatente", pv_base: 60, pm_base: 8, dados: { vigor: "d12", poder: "d10", magia: "d8", defesa_magica: "d8", velocidade: "d6", esquiva: "d6", precisao: "d4" } },
    "Construto": { arquetipo: "Combatente", pv_base: 72, pm_base: 6, dados: { vigor: "d12", poder: "d10", precisao: "d8", defesa_magica: "d8", magia: "d6", esquiva: "d6", velocidade: "d4" } },
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

// Curva Fibonacci Corrigida (Intervalos: 1-5, 6-13, 14-26, 27-47, 48-81, 82-99)
function calcularFibonacci(v) { 
    if (v >= 82) return 5;
    if (v >= 48) return 4;
    if (v >= 27) return 3;
    if (v >= 14) return 2;
    if (v >= 6) return 1;
    return 0; 
}

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

function rolarAtributo(attr) {
    const c = document.getElementById("classe").value;
    if(!c) return alert("Selecione uma classe primeiro!");
    
    const dadoStr = regrasClasses[c].dados[attr];
    const faces = parseInt(dadoStr.replace('d', ''));
    const resultado = Math.floor(Math.random() * faces) + 1;
    
    document.getElementById(attr + "_bruto").value = resultado;
    atualizarTotais();
}

function atualizarTotais() {
    const atrs = ['poder', 'vigor', 'velocidade', 'magia', 'precisao', 'esquiva', 'defesa_magica'];
    let bonusVelocidade = 0; 
    let bonusEsquiva = 0;

    atrs.forEach(a => {
        const bruto = parseInt(document.getElementById(a + "_bruto").value) || 0;
        const mod = parseInt(document.getElementById(a + "_mod").value) || 0;
        const total = bruto + mod;
        const bonus = calcularFibonacci(total);
        
        document.getElementById(a + "_total").innerText = total;
        document.getElementById(a + "_bonus").innerText = (bonus > 0 ? "+" : "") + bonus;

        if (a === 'velocidade') bonusVelocidade = bonus;
        if (a === 'esquiva') bonusEsquiva = bonus;
    });

    const modArm = parseInt(document.getElementById("mod_armadura").value) || 0;

    // Lógica ND Esquiva: 8 + Bônus de Esquiva + Mod. Armadura
    const campoND = document.getElementById("nd_esquiva_base");
    if (campoND) campoND.value = 8 + bonusEsquiva + modArm;

    // Lógica Movimento: Face do Dado de Velocidade + Bônus de Velocidade + Mod. Armadura
    const cl = document.getElementById("classe").value;
    const campoMov = document.getElementById("movimento");

    if (campoMov && cl && regrasClasses[cl]) {
        const faceVel = parseInt(regrasClasses[cl].dados.velocidade.replace('d', '')) || 4;  
        const metadeVel = Math.floor(faceVel / 2);

        campoMov.value = metadeVel + bonusVelocidade + modArm;
    }
}

function recalcularPVPM() {
    const cl = document.getElementById("classe").value;
    if(!cl) return alert("Selecione a Classe!");
    const info = regrasClasses[cl];
    
    const vigorTotal = parseInt(document.getElementById("vigor_total").innerText) || 0;
    const magiaTotal = parseInt(document.getElementById("magia_total").innerText) || 0;
    
    document.getElementById("pv_maximo").value = vigorTotal + info.pv_base;
    document.getElementById("pm_maximo").value = magiaTotal + info.pm_base;
    alert("PV e PM iniciais calculados. Lembre-se: use isso apenas para personagens de NÍVEL 1.");
}

function atualizarNDEsquiva() {
    atualizarTotais(); 
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
    document.getElementById("nd_esquiva_base").value = p.status?.nd_esquiva_base || 8;
    document.getElementById("movimento").value = p.status?.movimento || 4;
    document.getElementById("mod_armadura").value = p.status?.mod_armadura || 0;

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
        <div style="display: flex; gap: 15px; align-items: flex-end; margin-bottom: 15px;">
            <div class="form-group" style="flex: 2; margin-bottom: 0;"><label>Item</label><input type="text" class="i-nome" value="${i.nome || ''}"></div>
            <div class="form-group" style="flex: 1; margin-bottom: 0;"><label>Qtd</label><input type="number" class="i-qtd" value="${i.quantidade || 1}"></div>
            <div class="form-group" style="flex: 1; margin-bottom: 0; text-align: center; padding-bottom: 10px;">
                <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 5px; color: #27ae60;">
                    <input type="checkbox" class="i-equip" ${isEquipado} style="width: 18px; height: 18px; margin: 0;"> Equipado
                </label>
            </div>
        </div>
        <textarea class="i-desc" rows="2" placeholder="Descrição">${i.desc || ''}</textarea>`;
    document.getElementById('lista-inventario').appendChild(d);
}

function adicionarLaco(l = {}) {
    const d = document.createElement('div'); d.className = 'box-dinamico laco-box';
    d.innerHTML = `
        <button class="btn-remover" onclick="this.parentElement.remove()">X</button>
        <div class="grid-2">
            <div class="form-group"><label>Aliado</label><input type="text" class="l-nome" value="${l.nome || ''}"></div>
            <div class="form-group"><label>%</label><input type="number" class="l-porc" value="${l.porcentagem || 0}"></div>
        </div>`;
    document.getElementById('lista-lacos').appendChild(d);
}

function adicionarTech(t = {}) {
    const d = document.createElement('div'); d.className = 'box-dinamico tech-box';
    d.innerHTML = `
        <button class="btn-remover" onclick="this.parentElement.remove()">X</button>
        <div class="grid-2">
            <div class="form-group">
                <label>Habilidade</label>
                <input type="text" class="t-nome" placeholder="Ex: Impacto de Égide" value="${t.nome || ''}">
            </div>
            <div class="grid-2">
                <div class="form-group">
                    <label>Custo (PM)</label>
                    <input type="text" class="t-custo" placeholder="2 PM" value="${t.custo || ''}">
                </div>
                <div class="form-group">
                    <label>Elemento</label>
                        <select class="t-tipo">
                            <option value="Neutro" ${t.elemento=='Neutro'?'selected':''}>Neutro</option>
                            <option value="Fogo" ${t.elemento=='Fogo'?'selected':''}>Fogo</option>
                            <option value="Gelo/Água" ${t.elemento=='Gelo/Água'?'selected':''}>Gelo/Água</option>
                            <option value="Luz" ${t.elemento=='Luz'?'selected':''}>Luz</option>
                            <option value="Sombra" ${t.elemento=='Sombra'?'selected':''}>Sombra</option>
                        </select>
                </div>
            </div>
        </div>
        <div class="grid-3">
            <div class="form-group">
                <label>Alvo</label>
                <input type="text" class="t-alvo" placeholder="1 Inimigo" value="${t.alvo || ''}">
            </div>
            <div class="form-group">
                <label>Tipo</label>
                <select class="t-tipo">
                    <option value="Dano" ${t.tipo=='Dano'?'selected':''}>Dano</option>
                    <option value="Cura" ${t.tipo=='Cura'?'selected':''}>Cura</option>
                    <option value="Buff/Debuff" ${t.tipo=='Buff/Debuff'?'selected':''}>Buff/Debuff</option>
                    <option value="Reação" ${t.tipo=='Reação'?'selected':''}>Reação</option>
                    <option value="Especial" ${t.tipo=='Especial'?'selected':''}>Especial</option>
                </select>
            </div>
            <div class="form-group">
                <label>Rolagem</label>
                <input type="text" class="t-valor" placeholder="1d8 + Poder Total" value="${t.valor || ''}">
            </div>
        </div>
        <div class="form-group">
            <label>Descrição do Efeito</label>
            <textarea class="t-desc" rows="2" placeholder="O que a habilidade faz...">${t.desc || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Interação Elemental</label>
            <textarea class="t-inter" rows="2" placeholder="Ex: Dobra dano em alvos lentos...">${t.inter || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Dica de Combo</label>
            <textarea class="t-combo" rows="2" placeholder="Sugestão de uso conjunto...">${t.combo || ''}</textarea>
        </div>`;
    document.getElementById('lista-techs').appendChild(d);
}

function salvarPersonagem() {
    const elId = document.getElementById("id");
    const elClasse = document.getElementById("classe");
    
    if (!elId || !elClasse || !elId.value || !elClasse.value) {
        return alert("ID e Classe são obrigatórios para salvar!");
    }

    const id = elId.value;
    const cl = elClasse.value;
    const info = regrasClasses[cl];
    
    const getVal = (campoId, padrao) => {
        const el = document.getElementById(campoId);
        return el ? el.value : padrao;
    };
    const getInt = (campoId, padrao) => {
        const el = document.getElementById(campoId);
        return el ? (parseInt(el.value) || 0) : padrao;
    };

    const attrs = {};
    ['poder','vigor','velocidade','magia','precisao','esquiva','defesa_magica'].forEach(a => {
        const b = getInt(a + "_bruto", 0);
        const m = getInt(a + "_mod", 0);
        const t = b + m;
        attrs[a] = { dado: info.dados[a], bruto: b, mod: m, total: t, bonus: calcularFibonacci(t) };
    });

    const p = {
        id: id, 
        url_imagem: getVal("url_imagem", ""),
        dados_basicos: {
            nome: getVal("nome", ""), 
            nivel: getInt("nivel", 1),
            xp_atual: getInt("xp_atual", 0), 
            xp_proximo: getInt("xp_proximo", 50),
            raca: getVal("raca", ""), 
            classe: cl, 
            arquetipo: info.arquetipo, 
            afinidade_elemental: getVal("afinidade", "Neutro")
        },
        status: { 
            pv_maximo: getInt("pv_maximo", 0),
            pm_maximo: getInt("pm_maximo", 0),
            nd_esquiva_base: getInt("nd_esquiva_base", 8), 
            rd_armadura: getInt("rd_armadura", 0),
            movimento: getInt("movimento", 4),
            mod_armadura: getInt("mod_armadura", 0)
        },
        atributos: attrs,
        inventario: Array.from(document.querySelectorAll('.item-box')).map(b => ({
            nome: b.querySelector('.i-nome') ? b.querySelector('.i-nome').value : '', 
            quantidade: b.querySelector('.i-qtd') ? parseInt(b.querySelector('.i-qtd').value) || 1 : 1,
            equipado: b.querySelector('.i-equip') ? b.querySelector('.i-equip').checked : false, 
            desc: b.querySelector('.i-desc') ? b.querySelector('.i-desc').value : ''
        })),
        techs: Array.from(document.querySelectorAll('.tech-box')).map(b => ({
            // Agora TODOS os campos da Tech possuem a trava de segurança (?)
            nome: b.querySelector('.t-nome') ? b.querySelector('.t-nome').value : '',
            custo: b.querySelector('.t-custo') ? b.querySelector('.t-custo').value : '',
            elemento: b.querySelector('.t-elemento') ? b.querySelector('.t-elemento').value : '',
            alvo: b.querySelector('.t-alvo') ? b.querySelector('.t-alvo').value : '',
            tipo: b.querySelector('.t-tipo') ? b.querySelector('.t-tipo').value : '',
            valor: b.querySelector('.t-valor') ? b.querySelector('.t-valor').value : '',
            desc: b.querySelector('.t-desc') ? b.querySelector('.t-desc').value : '',
            inter: b.querySelector('.t-inter') ? b.querySelector('.t-inter').value : '',
            combo: b.querySelector('.t-combo') ? b.querySelector('.t-combo').value : ''
        })),
        lacos: Array.from(document.querySelectorAll('.laco-box')).map(b => ({
            nome: b.querySelector('.l-nome') ? b.querySelector('.l-nome').value : '', 
            porcentagem: b.querySelector('.l-porc') ? parseInt(b.querySelector('.l-porc').value) || 0 : 0
        }))
    };

    const idx = bancoDeDados.personagens.findIndex(x => x.id === id);
    if(idx > -1) bancoDeDados.personagens[idx] = p; else bancoDeDados.personagens.push(p);
    
    const blob = new Blob([JSON.stringify(bancoDeDados, null, 4)], { type: "application/json" });
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(blob); 
    a.download = "banco_de_dados.json"; 
    a.click();
}