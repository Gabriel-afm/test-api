// API Configurations
const CLIENT_ID = "921366091275-m476i96govuv9ksaqnr44b6i393bjove.apps.googleusercontent.com";
const API_KEY = "AIzaSyCKzDUOinstTX4L_tHBaI9jOk0Q8e7c5MM";
const SHEET_ID = "1VkqAFmpUOeljbin0DEKOrD5RJG8A91MEj77eSx92eHg";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

// Initialize API
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

  const addButton = document.getElementById("addButton");
  const checkErrorButton = document.getElementById("checkErrorButton");
  const clearButton = document.getElementById("clearButton");
  const menuToggle = document.getElementById("menuToggle");
  const menuLinks = document.getElementById("menuLinks");

  let records = [];

  addButton.addEventListener("click", () => {
    const product = document.getElementById("productInput").value;
    const quantity = document.getElementById("quantityInput").value;

    if (!product || !quantity) {
      alert("Preencha todos os campos!");
      return;
    }

    records.push({ product, quantity });
    updateTable();

    // Add data to Google Sheets
    gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "A:B",
      valueInputOption: "RAW",
      resource: {
        values: [[product, quantity]],
      },
    }).then((response) => {
      alert("Dados adicionados com sucesso!");
    }).catch((error) => {
      console.error("Erro ao salvar os dados:", error);
      alert("Erro ao salvar os dados.");
    });
  });

  checkErrorButton.addEventListener("click", () => {
    window.open(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`, "_blank");
  });

  clearButton.addEventListener("click", () => {
    records = [];
    updateTable();
  });

  menuToggle.addEventListener("click", () => {
    menuLinks.classList.toggle("hidden");
  });

  function updateTable() {
    const tableBody = document.getElementById("recordTable");
    tableBody.innerHTML = "";

    records.forEach((record) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${record.product}</td>
        <td>${record.quantity}</td>
        <td><button class="delete-btn">Excluir</button></td>
      `;
      row.querySelector(".delete-btn").addEventListener("click", () => {
        records = records.filter((r) => r !== record);
        updateTable();
      });
      tableBody.appendChild(row);
    });
  }
});
