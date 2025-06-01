// Defina a URL base da API
const API_URL = "http://cnms-parking-api.net.uztec.com.br/api/v1";

// Função para carregar veículos ativos
function carregarVeiculos() {
  fetch(`${API_URL}/active`)
    .then(res => res.json())
    .then(veiculos => {
      const container = document.getElementById("resultado");
      container.innerHTML = "<h3>Veículos Estacionados:</h3>";
      if (veiculos.length === 0) {
        container.innerHTML += "<p>Nenhum veículo estacionado.</p>";
        return;
      }
      veiculos.forEach(v => {
        const div = document.createElement("div");
        div.textContent = `Placa: ${v.plate} | Modelo: ${v.model || 'Desconhecido'}`;
        container.appendChild(div);
      });
    })
    .catch(err => console.error("Erro ao carregar veículos:", err));
}

// Função para verificar um veículo
function verificarVeiculo() {
  const placa = prompt("Digite a placa:");
  if (!placa) return;

  fetch(`${API_URL}/check/${placa}`)
    .then(res => {
      if (!res.ok) throw new Error("Veículo não encontrado");
      return res.json();
    })
    .then(data => {
      alert(`Veículo ${data.plate} está no estacionamento desde: ${data.entryTime}`);
    })
    .catch(err => alert(err.message));
}

// Função para cancelar o registro de um veículo
function cancelarVeiculo() {
  const placa = prompt("Digite a placa do veículo para cancelar:");
  if (!placa) return;

  fetch(`${API_URL}/cancel/${placa}`, { method: "DELETE" })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Veículo removido.");
      carregarVeiculos();
    })
    .catch(err => alert("Erro ao cancelar veículo."));
}

// Função para registrar a entrada de um veículo
function registrarEntrada() {
  const placa = prompt("Digite a placa:");
  const modelo = prompt("Digite o modelo:");
  if (!placa || !modelo) return;

  fetch(`${API_URL}/entry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plate: placa, model: modelo })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Veículo registrado.");
      carregarVeiculos();
    })
    .catch(err => alert("Erro ao registrar entrada."));
}

// Função para registrar a saída de um veículo
function registrarSaida() {
  const placa = prompt("Digite a placa do veículo que está saindo:");
  if (!placa) return;

  fetch(`${API_URL}/exit/${placa}`, {
    method: "PATCH"
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao registrar saída");
      return res.json();
    })
    .then(data => {
      alert(`Veículo ${data.plate} saiu. Tempo estacionado: ${data.parkedTime.toFixed(2)} minutos`);
      carregarVeiculos();
    })
    .catch(err => alert(err.message));
}
