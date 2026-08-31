/* ============================================================
   INSTELLINGEN
   ============================================================ */

// Wachtwoord voor "Site beheer". Pas dit aan naar wens.
// Let op: dit is client-side beveiliging, prima voor een hobbysite,
// maar niet geschikt om echt gevoelige data te beschermen.
const BEHEER_WACHTWOORD = "verander-dit-wachtwoord";

// De categorieën die op de site getoond worden.
const CATEGORIEEN = [
  "Fantasie",
  "Romantiek",
  "Horror",
  "Avontuur",
  "Mysterie",
  "Gedichten"
];

/* ============================================================
   FIREBASE
   ============================================================ */

const db = firebase.database();
const verhalenRef = db.ref("verhalen");

let alleVerhalen = {}; // id -> verhaalobject
let huidigeCategorie = null;
let isIngelogd = false;

/* ============================================================
   ELEMENTEN
   ============================================================ */

const viewCategorieen = document.getElementById("view-categorieen");
const viewVerhalen = document.getElementById("view-verhalen");
const viewLezen = document.getElementById("view-lezen");

const categorieGrid = document.getElementById("categorie-grid");
const verhalenLijst = document.getElementById("verhalen-lijst");
const verhalenCategorieTitel = document.getElementById("verhalen-categorie-titel");

const leesTitel = document.getElementById("lees-titel");
const leesMeta = document.getElementById("lees-meta");
const leesInhoud = document.getElementById("lees-inhoud");

const beheerOverlay = document.getElementById("beheer-overlay");
const beheerLogin = document.getElementById("beheer-login");
const beheerPaneel = document.getElementById("beheer-paneel");
const wachtwoordInvoer = document.getElementById("wachtwoord-invoer");
const loginFout = document.getElementById("login-fout");
const inputCategorie = document.getElementById("input-categorie");
const beheerVerhalenLijst = document.getElementById("beheer-verhalen-lijst");
const opslaanSucces = document.getElementById("opslaan-succes");

/* ============================================================
   NAVIGATIE TUSSEN SCHERMEN
   ============================================================ */

function toonScherm(scherm) {
  [viewCategorieen, viewVerhalen, viewLezen].forEach(v => v.classList.add("hidden"));
  scherm.classList.remove("hidden");
}

/* ============================================================
   CATEGORIEËN TONEN
   ============================================================ */

// Vaste, subtiel afwisselende kleuren voor de "boekruggen" van de categoriekaarten
const SPINE_KLEUREN = ["#d4af6a", "#7a8cff", "#e97a7a", "#6ee7a0", "#f4c14d", "#d17aff"];

function renderCategorieen() {
  categorieGrid.innerHTML = "";

  CATEGORIEEN.forEach((categorie, i) => {
    const aantal = Object.values(alleVerhalen).filter(v => v.categorie === categorie).length;

    const kaart = document.createElement("button");
    kaart.className = "categorie-kaart";
    kaart.style.setProperty("--spine-kleur", SPINE_KLEUREN[i % SPINE_KLEUREN.length]);
    kaart.innerHTML = `
      <h3>${escapeHtml(categorie)}</h3>
      <div class="aantal">${aantal} ${aantal === 1 ? "verhaal" : "verhalen"}</div>
    `;
    kaart.addEventListener("click", () => openCategorie(categorie));
    categorieGrid.appendChild(kaart);
  });
}

function openCategorie(categorie) {
  huidigeCategorie = categorie;
  verhalenCategorieTitel.textContent = categorie;

  const verhalenInCategorie = Object.entries(alleVerhalen)
    .filter(([id, v]) => v.categorie === categorie)
    .sort((a, b) => (b[1].aangemaakt || 0) - (a[1].aangemaakt || 0));

  verhalenLijst.innerHTML = "";

  if (verhalenInCategorie.length === 0) {
    verhalenLijst.innerHTML = `<p class="categorie-leeg">Nog geen verhalen in deze categorie. Kom later terug!</p>`;
  } else {
    verhalenInCategorie.forEach(([id, verhaal]) => {
      const item = document.createElement("button");
      item.className = "verhaal-item";
      item.innerHTML = `
        <div class="titel">${escapeHtml(verhaal.titel)}</div>
        ${verhaal.auteur ? `<div class="auteur">door ${escapeHtml(verhaal.auteur)}</div>` : ""}
      `;
      item.addEventListener("click", () => openVerhaal(id));
      verhalenLijst.appendChild(item);
    });
  }

  toonScherm(viewVerhalen);
}

function openVerhaal(id) {
  const verhaal = alleVerhalen[id];
  if (!verhaal) return;

  leesTitel.textContent = verhaal.titel;
  leesMeta.textContent = [verhaal.categorie, verhaal.auteur ? `door ${verhaal.auteur}` : null]
    .filter(Boolean).join(" · ");
  leesInhoud.textContent = verhaal.inhoud;

  toonScherm(viewLezen);
}

document.getElementById("terug-naar-categorieen").addEventListener("click", () => toonScherm(viewCategorieen));
document.getElementById("terug-naar-verhalen").addEventListener("click", () => openCategorie(huidigeCategorie));

/* ============================================================
   VERHALEN OPHALEN UIT FIREBASE
   ============================================================ */

verhalenRef.on("value", snapshot => {
  alleVerhalen = snapshot.val() || {};
  renderCategorieen();

  if (!viewVerhalen.classList.contains("hidden") && huidigeCategorie) {
    openCategorie(huidigeCategorie);
  }
  if (isIngelogd) {
    renderBeheerVerhalenLijst();
  }
});

/* ============================================================
   SITE BEHEER: inloggen
   ============================================================ */

document.getElementById("open-beheer").addEventListener("click", () => {
  beheerOverlay.classList.remove("hidden");
  if (isIngelogd) {
    beheerLogin.classList.add("hidden");
    beheerPaneel.classList.remove("hidden");
  } else {
    beheerLogin.classList.remove("hidden");
    beheerPaneel.classList.add("hidden");
    wachtwoordInvoer.value = "";
    loginFout.classList.add("hidden");
    wachtwoordInvoer.focus();
  }
});

document.getElementById("sluit-beheer").addEventListener("click", () => {
  beheerOverlay.classList.add("hidden");
});

document.getElementById("login-knop").addEventListener("click", probeerInloggen);
wachtwoordInvoer.addEventListener("keydown", e => {
  if (e.key === "Enter") probeerInloggen();
});

function probeerInloggen() {
  if (wachtwoordInvoer.value === BEHEER_WACHTWOORD) {
    isIngelogd = true;
    beheerLogin.classList.add("hidden");
    beheerPaneel.classList.remove("hidden");
    vulCategorieSelect();
    renderBeheerVerhalenLijst();
  } else {
    loginFout.classList.remove("hidden");
  }
}

document.getElementById("uitlog-knop").addEventListener("click", () => {
  isIngelogd = false;
  beheerOverlay.classList.add("hidden");
});

/* ============================================================
   SITE BEHEER: verhaal toevoegen
   ============================================================ */

function vulCategorieSelect() {
  inputCategorie.innerHTML = CATEGORIEEN
    .map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
    .join("");
}

document.getElementById("verhaal-form").addEventListener("submit", e => {
  e.preventDefault();

  const nieuwVerhaal = {
    titel: document.getElementById("input-titel").value.trim(),
    categorie: inputCategorie.value,
    auteur: document.getElementById("input-auteur").value.trim(),
    inhoud: document.getElementById("input-inhoud").value.trim(),
    aangemaakt: Date.now()
  };

  verhalenRef.push(nieuwVerhaal).then(() => {
    e.target.reset();
    opslaanSucces.classList.remove("hidden");
    setTimeout(() => opslaanSucces.classList.add("hidden"), 2500);
  });
});

/* ============================================================
   SITE BEHEER: bestaande verhalen tonen & verwijderen
   ============================================================ */

function renderBeheerVerhalenLijst() {
  const items = Object.entries(alleVerhalen)
    .sort((a, b) => (b[1].aangemaakt || 0) - (a[1].aangemaakt || 0));

  beheerVerhalenLijst.innerHTML = "";

  if (items.length === 0) {
    beheerVerhalenLijst.innerHTML = `<p class="categorie-leeg">Er staan nog geen verhalen op de site.</p>`;
    return;
  }

  items.forEach(([id, verhaal]) => {
    const rij = document.createElement("div");
    rij.className = "beheer-verhaal-rij";
    rij.innerHTML = `
      <span>${escapeHtml(verhaal.titel)} <em style="color:var(--tekst-zacht)">(${escapeHtml(verhaal.categorie)})</em></span>
      <button class="verwijder">Verwijderen</button>
    `;
    rij.querySelector(".verwijder").addEventListener("click", () => {
      if (confirm(`"${verhaal.titel}" verwijderen?`)) {
        verhalenRef.child(id).remove();
      }
    });
    beheerVerhalenLijst.appendChild(rij);
  });
}

/* ============================================================
   HULPFUNCTIE
   ============================================================ */

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}
