// Configurações da API
const CLIENT_ID = "921366091275-m476i96govuv9ksaqnr44b6i393bjove.apps.googleusercontent.com";
const API_KEY = "AIzaSyCKzDUOinstTX4L_tHBaI9jOk0Q8e7c5MM";
const SHEET_ID = "1VkqAFmpUOeljbin0DEKOrD5RJG8A91MEj77eSx92eHg";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

// Inicializa a API
function initClient() {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
      scope: SCOPES,
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initClient();

  const entryButton = document.getElementById("entryButton");
  const exitButton = document.getElementById("exitButton");
  const menuToggle = document.getElementById("menuToggle");
  const menuLinks = document.getElementById("menuLinks");

  let records = [];

  entryButton.addEventListener("click", () => handleAction("entrada"));
  exitButton.addEventListener("click", () => handleAction("saida"));

  menuToggle.addEventListener("click", () => {
    menuLinks.classList.toggle("hidden");
  });

  function handleAction(action) {
    const product = document.getElementById("productSelect").value;
    const quantity = parseFloat(document.getElementById("quantityInput").value);

    if (!product || isNaN(quantity) || quantity <= 0) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    // Adiciona ao registro local
    const recordIndex = records.findIndex((r) => r.product === product);
    if (recordIndex === -1) {
      records.push({ product, entrada: action === "entrada" ? quantity : 0, saida: action === "saida" ? quantity : 0 });
    } else {
      if (action === "entrada") {
        records[recordIndex].entrada += quantity;
      } else {
        records[recordIndex].saida += quantity;
      }
    }
    updateTable();

    // Atualiza a planilha do Google Sheets
    const column = action === "entrada" ? "E" : "F";
    const range = `${column}:${column}`;
    const value = [[product], [quantity]];

    gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: range,
      valueInputOption: "RAW",
      resource: {
        values: [[quantity]],
      },
    }).then(() => {
      alert("Dados atualizados com sucesso!");
    }).catch((error) => {
      console.error("Erro ao atualizar os dados:", error);
      alert("Erro ao atualizar os dados.");
    });
  }

  function updateTable() {
    const tableBody = document.getElementById("recordTable");
    tableBody.innerHTML = "";

    records.forEach((record) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${record.product}</td>
        <td>${record.entrada}</td>
        <td>${record.saida}</td>
      `;
      tableBody.appendChild(row);
    });
  }
});
