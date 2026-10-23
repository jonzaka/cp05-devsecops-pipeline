// Portal de status da Arcanjosa — lógica da página.
// Nenhum dado sensível vive aqui: credenciais ficam em variáveis de ambiente
// do servidor, nunca no código versionado.

const SERVICOS = [
  { nome: "API de pedidos", status: "operacional" },
  { nome: "Portal do cliente", status: "operacional" },
  { nome: "Processamento de pagamentos", status: "degradado" },
  { nome: "Relatórios gerenciais", status: "operacional" },
];

const MINUTOS_NO_MES = 30 * 24 * 60;

function rotuloStatus(status) {
  const rotulos = {
    operacional: "Operacional",
    degradado: "Degradado",
    indisponivel: "Indisponível",
  };
  return rotulos[status] ?? "Desconhecido";
}

function renderizarServicos(lista) {
  const ul = document.getElementById("lista-servicos");
  ul.innerHTML = "";
  for (const servico of lista) {
    const li = document.createElement("li");
    const nome = document.createElement("span");
    nome.textContent = servico.nome;
    const status = document.createElement("span");
    status.className = `status ${servico.status}`;
    status.textContent = rotuloStatus(servico.status);
    li.append(nome, status);
    ul.appendChild(li);
  }
}

function calcularDisponibilidade(minutosIndisponivel) {
  const minutos = Number(minutosIndisponivel);
  if (!Number.isFinite(minutos) || minutos < 0) {
    return null;
  }
  const limitado = Math.min(minutos, MINUTOS_NO_MES);
  return ((MINUTOS_NO_MES - limitado) / MINUTOS_NO_MES) * 100;
}

function configurarFormulario() {
  const form = document.getElementById("form-sla");
  const saida = document.getElementById("resultado-sla");
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const valor = form.elements.minutos.value;
    const disponibilidade = calcularDisponibilidade(valor);
    if (disponibilidade === null) {
      saida.textContent = "Informe um número de minutos válido.";
      return;
    }
    saida.textContent = `Disponibilidade no mês: ${disponibilidade.toFixed(3)}%`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarServicos(SERVICOS);
  configurarFormulario();
});
