<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Chronosfera RPG - Laboratório de Antagonistas</title>
    <style>
        /* === LAYOUT DASHBOARD === */
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; display: flex; height: 100vh; background-color: #f4f4f9; overflow: hidden; }
        
        /* === SIDEBAR (LISTA DE MONSTROS) === */
        #sidebar { width: 350px; background-color: #2c3e50; color: #ecf0f1; display: flex; flex-direction: column; box-shadow: 2px 0 10px rgba(0,0,0,0.2); z-index: 10; }
        .sidebar-header { padding: 20px; background-color: #1a252f; text-align: center; border-bottom: 3px solid #e74c3c; }
        .sidebar-header h2 { margin: 0; color: #e74c3c; font-size: 1.5em; }
        #lista-cards { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 15px; }
        
        /* CARDS DO SIDEBAR */
        .monster-card { background: #34495e; border-left: 4px solid #e74c3c; border-radius: 6px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); transition: transform 0.2s; }
        .monster-card:hover { transform: translateX(5px); background: #3b536b; }
        .monster-card h4 { margin: 0 0 5px 0; color: #fff; font-size: 1.1em; display: flex; justify-content: space-between; }
        .monster-card .badge { font-size: 0.7em; background: #e74c3c; padding: 2px 6px; border-radius: 10px; }
        .monster-card p { margin: 3px 0; font-size: 0.85em; color: #bdc3c7; }
        .monster-card .tech-list { font-style: italic; color: #9b59b6; margin-top: 5px; border-top: 1px solid #465c71; padding-top: 5px; }
        .btn-editar { background: #3498db; color: white; border: none; padding: 5px 10px; width: 100%; margin-top: 10px; border-radius: 4px; cursor: pointer; font-weight: bold; }
        .btn-editar:hover { background: #2980b9; }

        /* === PAINEL CENTRAL (FORMULÁRIO) === */
        #main-content { flex: 1; overflow-y: auto; padding: 30px; position: relative; }
        .top-bar { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 25px; }
        .top-bar input[type="file"] { width: auto; border: none; padding: 0; }
        
        .btn-novo { background-color: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; }
        .btn-novo:hover { background-color: #219653; }
        .btn-gerar { background-color: #f39c12; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 10px; font-size: 1.1em; }
        .btn-gerar:hover { background-color: #d68910; }

        /* Formulário */
        .form-section { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 20px; }
        .secao-titulo { margin-top: 0; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; color: #c0392b; font-size: 1.2em; }
        .form-group { margin-bottom: 15px; }
        label { display: block; font-weight: bold; margin-bottom: 5px; color: #555; font-size: 0.9em; }
        input[type="text"], input[type="number"], select, textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-family: inherit; }
        
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
        
        /* Tabela de Atributos Corrigida */
        .atributos-tabela { background: #fdf9f9; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-top: 20px; }
        .atr-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 10px; align-items: center; text-align: center; }
        .atr-header { font-weight: bold; color: #c0392b; border-bottom: 2px solid #ddd; padding-bottom: 8px; margin-bottom: 15px; }
        .atr-row span:first-child { text-align: left; font-weight: bold; color: #555; }
        .atr-total { font-weight: bold; color: #c0392b; font-size: 1.1em; background: #fff; padding: 8px; border-radius: 4px; border: 1px dashed #e74c3c; }
        .atr-bonus { font-weight: bold; color: #2980b9; font-size: 1.1em; background: #e8f4f8; padding: 8px; border-radius: 4px; }

        /* Dinâmicos */
        .box-dinamico { background: #fdfdfd; border: 1px solid #dcdde1; border-radius: 6px; padding: 15px; margin-bottom: 15px; position: relative; }
        .tech-box { border-left: 5px solid #8e44ad; }
        .drop-box { border-left: 5px solid #f1c40f; }
        .btn-remover { background-color: #e74c3c; width: auto; padding: 5px 10px; font-size: 12px; position: absolute; right: 15px; top: 10px; border: none; color: white; border-radius: 4px; cursor: pointer;}
        
        .btn-add { background-color: #34495e; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-bottom: 15px; }
        .btn-salvar { background-color: #c0392b; color: white; padding: 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 18px; font-weight: bold; width: 100%; margin-top: 20px; margin-bottom: 50px; }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1a252f; }
        ::-webkit-scrollbar-thumb { background: #c0392b; border-radius: 4px; }
    </style>
</head>
<body>

<div id="sidebar">
    <div class="sidebar-header">
        <h2>Bestiário</h2>
        <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #bdc3c7;">banco_antagonistas.json</p>
    </div>
    <div id="lista-cards">
        <p style="text-align: center; color: #7f8c8d; font-size: 0.9em; margin-top: 20px;">A carregar base de dados...</p>
    </div>
</div>

<div id="main-content">
    
    <div class="top-bar">
        <div>
            <label style="margin:0; font-size: 0.8em; color: #7f8c8d;">Importar Ficha (.json)</label>
            <input type="file" id="arquivoImport" accept=".json" onchange="importarJSON(event)">
        </div>
        <button class="btn-novo" onclick="limparFormulario()">+ Criar Novo Antagonista</button>
    </div>

    <div class="form-section">
        <h3 class="secao-titulo">👿 Identidade da Ameaça</h3>
        <div class="grid-2">
            <div class="form-group"><label>Nome</label><input type="text" id="nome" placeholder="Ex: Orc Furioso"></div>
            <div class="form-group"><label>ID Único</label><input type="text" id="id" placeholder="Ex: orc_fogo_01"></div>
        </div>
        <div class="grid-4">
            <div class="form-group"><label>Nível</label><input type="number" id="nivel" value="1"></div>
            <div class="form-group">
                <label>Tipo (Classe)</label>
                <select id="tipo">
                    <option value="Mob">Mob (Lacaio)</option>
                    <option value="Elite">Elite</option>
                    <option value="Subchefe">Subchefe</option>
                    <option value="Boss">Boss (Chefe)</option>
                    <option value="NPC">NPC (Aliado/Neutro)</option>
                </select>
            </div>
            <div class="form-group"><label>Afinidade</label><select id="afinidade"><option value="Neutro">Neutro</option><option value="Fogo">Fogo</option><option value="Gelo/Água">Gelo/Água</option><option value="Luz">Luz</option><option value="Sombra">Sombra</option></select></div>
            <div class="form-group"><label>Avatar (URL)</label><input type="text" id="url_imagem"></div>
        </div>
        
        <button class="btn-gerar" onclick="gerarStatusAutomatico()">🎲 Auto-Gerar Atributos e Combate</button>
    </div>

    <div class="form-section">
        <h3 class="secao-titulo">⚔️ Status de Combate</h3>
        <div class="grid-4">
            <div class="form-group"><label>❤️ PV Máx</label><input type="number" id="pv" value="10"></div>
            <div class="form-group"><label>💧 PM Máx</label><input type="number" id="pm" value="5"></div>
            <div class="form-group"><label>🛡️ RD (Armadura)</label><input type="number" id="rd" value="0"></div>
            <div class="form-group"><label>🏃 Esquiva Base (ND)</label><input type="number" id="esquiva_base" value="8"></div>
        </div>
        <div class="grid-2">
            <div class="form-group"><label>🎯 Bônus de Ataque Padrão</label><input type="text" id="ataque" placeholder="Ex: +5"></div>
            <div class="form-group"><label>💥 Dano Base</label><input type="text" id="dano" placeholder="Ex: 2d6 + 4"></div>
        </div>

        <h3 class="secao-titulo" style="margin-top: 30px;">📊 Atributos e Modificadores</h3>
        <div class="atributos-tabela">
            <div class="atr-row atr-header">
                <span>Atributo</span><span>Bruto</span><span>Mod. (Buffs)</span><span>Total</span><span>Bônus</span>
            </div>
            <div class="atr-row">
                <span id="lbl_poder">Poder (d10)</span>
                <input type="number" id="poder_bruto" value="0" oninput="atualizarTotais()">
                <input type="number" id="poder_mod" value="0" oninput="atualizarTotais()">
                <span id="poder_total" class="atr-total">0</span>
                <span id="poder_bonus" class="atr-bonus">+0</span>
            </div>
            <div class="atr-row">
                <span id="lbl_vigor">Vigor (d10)</span>
                <input type="number" id="vigor_bruto" value="0" oninput="atualizarTotais()">
                <input type="number" id="vigor_mod" value="0" oninput="atualizarTotais()">
                <span id="vigor_total" class="atr-total">0</span>
                <span id="vigor_bonus" class="atr-bonus">+0</span>
            </div>
            <div class="atr-row">
                <span id="lbl_velocidade">Velocidade (d10)</span>
                <input type="number" id="velocidade_bruto" value="0" oninput="atualizarTotais()">
                <input type="number" id="velocidade_mod" value="0" oninput="atualizarTotais()">
                <span id="velocidade_total" class="atr-total">0</span>
                <span id="velocidade_bonus" class="atr-bonus">+0</span>
            </div>
            <div class="atr-row">
                <span id="lbl_magia">Magia (d10)</span>
                <input type="number" id="magia_bruto" value="0" oninput="atualizarTotais()">
                <input type="number" id="magia_mod" value="0" oninput="atualizarTotais()">
                <span id="magia_total" class="atr-total">0</span>
                <span id="magia_bonus" class="atr-bonus">+0</span>
            </div>
            <div class="atr-row">
                <span id="lbl_precisao">Precisão (d10)</span>
                <input type="number" id="precisao_bruto" value="0" oninput="atualizarTotais()">
                <input type="number" id="precisao_mod" value="0" oninput="atualizarTotais()">
                <span id="precisao_total" class="atr-total">0</span>
                <span id="precisao_bonus" class="atr-bonus">+0</span>
            </div>
            <div class="atr-row">
                <span id="lbl_esquiva">Esquiva (d10)</span>
                <input type="number" id="esquiva_bruto" value="0" oninput="atualizarTotais()">
                <input type="number" id="esquiva_mod" value="0" oninput="atualizarTotais()">
                <span id="esquiva_total" class="atr-total">0</span>
                <span id="esquiva_bonus" class="atr-bonus">+0</span>
            </div>
            <div class="atr-row">
                <span id="lbl_defesa_magica">Defesa Mágica (d10)</span>
                <input type="number" id="defesa_magica_bruto" value="0" oninput="atualizarTotais()">
                <input type="number" id="defesa_magica_mod" value="0" oninput="atualizarTotais()">
                <span id="defesa_magica_total" class="atr-total">0</span>
                <span id="defesa_magica_bonus" class="atr-bonus">+0</span>
            </div>
        </div>
    </div>

    <div class="form-section">
        <h3 class="secao-titulo" style="color: #8e44ad;">🔮 Ações e Techs (Habilidades Especiais)</h3>
        <div id="lista-techs"></div>
        <button type="button" class="btn-add" style="background:#8e44ad;" onclick="adicionarTech()">+ Adicionar Ação</button>

        <h3 class="secao-titulo" style="color: #d35400; margin-top: 20px;">💎 Drops (Recompensas)</h3>
        <div id="lista-drops"></div>
        <button type="button" class="btn-add" style="background:#d35400;" onclick="adicionarDrop()">+ Adicionar Drop</button>
    </div>

    <button class="btn-salvar" onclick="salvarAntagonista()">💾 SALVAR NO BESTIÁRIO (JSON)</button>
</div>

<script src="antagonista_script.js"></script>
</body>
</html>