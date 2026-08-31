# Verhalenhuis

Een simpele verhalensite met categorieën. Bezoekers lezen verhalen, jij voegt
ze toe via "Site beheer" onderin de pagina.

## Bestanden

- `index.html` — de pagina
- `style.css` — de vormgeving (inclusief de regenboogtitel)
- `app.js` — de logica (categorieën, verhalen laden, beheerpaneel)
- `firebase-config.js` — hier vul je jouw eigen Firebase-gegevens in

## 1. Firebase instellen

1. Ga naar [console.firebase.google.com](https://console.firebase.google.com) en maak een nieuw project.
2. Klik links op **Build → Realtime Database** en maak een database aan.
   Kies bij de regio bijvoorbeeld Europa.
3. Ga naar het tabblad **Rules** van de Realtime Database en zet dit erin
   (zodat iedereen verhalen kan lezen, en iedereen ze ook kan toevoegen —
   de wachtwoordbeveiliging zit in de website zelf, niet in Firebase):

   ```json
   {
     "rules": {
       "verhalen": {
         ".read": true,
         ".write": true
       }
     }
   }
   ```

   > Dit is een eenvoudige opzet voor een hobbyproject. Iedereen die de
   > website-code leest kan in theorie ook rechtstreeks naar de database
   > schrijven. Voor een site met alleen jouw eigen verhalen is dat een
   > acceptabel risico, maar wil je het steviger afsluiten, gebruik dan
   > Firebase Authentication in plaats van het wachtwoord in `app.js`.

4. Ga naar **Project instellingen → Algemeen**, scroll naar "Jouw apps",
   klik op het `</>`-icoon om een webapp toe te voegen, en kopieer de
   configuratie die je te zien krijgt.
5. Plak die gegevens in `firebase-config.js`, in plaats van de
   `VUL-HIER-IN`-waarden.

## 2. Wachtwoord instellen

Open `app.js` en pas deze regel aan bovenaan het bestand:

```js
const BEHEER_WACHTWOORD = "verander-dit-wachtwoord";
```

## 3. Categorieën aanpassen

Ook bovenaan `app.js` staat de lijst met categorieën. Verander, verwijder of
voeg toe wat je wilt:

```js
const CATEGORIEEN = [
  "Fantasie",
  "Romantiek",
  "Horror",
  "Avontuur",
  "Mysterie",
  "Gedichten"
];
```

## 4. Op GitHub zetten en publiceren met GitHub Pages

1. Maak een nieuwe (public of private) repository op GitHub.
2. Upload deze vier bestanden (`index.html`, `style.css`, `app.js`,
   `firebase-config.js`) naar de root van die repository.
3. Ga naar **Settings → Pages** in de repository.
4. Kies bij "Source" de branch `main` en map `/ (root)`, en klik op **Save**.
5. Na een minuutje staat je site live op
   `https://jouw-gebruikersnaam.github.io/repository-naam/`.

Dat is alles — geen build-stap of installatie nodig, het zijn platte
HTML/CSS/JS-bestanden.
