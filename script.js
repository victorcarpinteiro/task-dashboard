let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let modoInteligente=false;

/* PAGINAS */
function mostrarPagina(p){
    document.querySelectorAll(".pagina")
    .forEach(pg=>pg.classList.add("hidden"));

    document.getElementById(p).classList.remove("hidden");

    atualizarDashboard();
}

/* DARK MODE */
function toggleDark(){
    document.body.classList.toggle("dark");
}

/* ADICIONAR */
function adicionarTarefa(){

    const input=document.getElementById("novaTarefa");

    if(!input.value) return;

    tarefas.push({
        texto:input.value,
        data:new Date().toLocaleDateString(),
        status:"Pendente"
    });

    input.value="";

    salvar();
}

/* SALVAR */
function salvar(){
    localStorage.setItem("tarefas",JSON.stringify(tarefas));
    render();
}

/* RENDER */
function render(){

    const lista=document.getElementById("lista");
    lista.innerHTML="";

    tarefas.forEach((t,i)=>{

        const div=document.createElement("div");
        div.className="tarefa";

        div.innerHTML=`
        ${t.texto} - ${t.status}
        <br>
        <button onclick="concluir(${i})">✔</button>
        <button onclick="editar(${i})">✏</button>
        <button onclick="excluir(${i})">🗑</button>
        `;

        lista.appendChild(div);
    });

    renderHistorico();
    atualizarDashboard();
}

/* CONCLUIR */
function concluir(i){
    tarefas[i].status="Concluída";
    salvar();
}

/* EDITAR */
function editar(i){
    const novo=prompt("Editar tarefa",tarefas[i].texto);
    if(novo){
        tarefas[i].texto=novo;
        salvar();
    }
}

/* EXCLUIR */
function excluir(i){
    tarefas.splice(i,1);
    salvar();
}

/* HISTORICO */
function renderHistorico(){

    const hist=document.getElementById("historicoLista");
    hist.innerHTML="";

    const ultimos=tarefas.slice(-5);

    ultimos.forEach(t=>{
        hist.innerHTML+=`
        <div class="card">
        ${t.data} - ${t.texto} (${t.status})
        </div>`;
    });
}

/* DASHBOARD */
function atualizarDashboard(){

    const total=tarefas.length;
    const concluidas=tarefas.filter(t=>t.status==="Concluída").length;
    const prod= total===0?0:Math.round(concluidas/total*100);

    document.getElementById("kpiTotal").innerHTML=`Total: ${total}`;
    document.getElementById("kpiConcluidas").innerHTML=`Concluídas: ${concluidas}`;
    document.getElementById("kpiProd").innerHTML=`Produtividade: ${prod}%`;

    if(modoInteligente)
        analisarProdutividade();
}

/* MODO INTELIGENTE */
function ativarModoInteligente(){

    modoInteligente=!modoInteligente;

    document.body.classList.toggle("inteligente");

    analisarProdutividade();
}

function analisarProdutividade(){

    const total=tarefas.length;
    const concluidas=tarefas.filter(t=>t.status==="Concluída").length;

    let produtividade= total===0?0:
        Math.round(concluidas/total*100);

    let kpi=document.getElementById("kpi");

    kpi.innerHTML=`
    <h3>🧠 Análise Inteligente</h3>
    Produtividade: ${produtividade}%
    `;

    if(produtividade<50)
        kpi.className="card alerta";
    else
        kpi.className="card sucesso";
}

/* START */
render();
render();