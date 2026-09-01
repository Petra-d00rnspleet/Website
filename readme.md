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
3. Ga naar het tabblad **Rules** van de Realtime Database en zet dit erin.
   Iedereen mag verhalen *lezen*, maar alleen wie is ingelogd mag ze
   *schrijven* — dat inloggen regelt Firebase zelf (zie stap 2 hieronder),
   niet meer een wachtwoord in de website-code zelf:

   ```json
   {
     "rules": {
       "verhalen": {
         ".read": true,
         ".write": "auth != null"
       }
     }
   }
   ```

4. Ga naar **Project instellingen → Algemeen**, scroll naar "Jouw apps",
   klik op het `</>`-icoon om een webapp toe te voegen, en kopieer de
   configuratie die je te zien krijgt.
5. Plak die gegevens in `firebase-config.js`, in plaats van de
   `VUL-HIER-IN`-waarden.

## 2. Beheerdersaccount aanmaken (inloggen)

Site-beheer werkt nu via **Firebase Authentication** in plaats van een
wachtwoord dat in de code staat.

1. Ga in de Firebase Console links naar **Build → Authentication** en
   klik op **Aan de slag** (Get started).
2. Kies bij "Sign-in method" de aanbieder **E-mail/wachtwoord** en zet
   hem aan (Enable → Opslaan).
3. Ga naar het tabblad **Users** en klik op **Add user**. Vul je eigen
   e-mailadres in en een sterk wachtwoord. Dit is voortaan je login voor
   "Site beheer" op de website.
4. Klaar — je kunt op de site inloggen met dat e-mailadres en wachtwoord.
   Wil je later iemand anders ook toegang geven (of jezelf een nieuw
   wachtwoord geven), doe dat hier in **Authentication → Users**.

> Let op: iedereen met een geldig account kan verhalen toevoegen en
> verwijderen. Maak dus alleen accounts aan voor mensen die je
> vertrouwt, en gebruik een sterk, uniek wachtwoord.

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

   > `firebase-config.js` bevat geen geheimen — de Firebase-configuratie
   > (apiKey etc.) is bedoeld om openbaar in de browser te staan. De
   > écht gevoelige beveiliging zit in de Database Rules (stap 1) en de
   > accounts in Authentication (stap 2).
3. Ga naar **Settings → Pages** in de repository.
4. Kies bij "Source" de branch `main` en map `/ (root)`, en klik op **Save**.
5. Na een minuutje staat je site live op
   `https://jouw-gebruikersnaam.github.io/repository-naam/`.

Dat is alles — geen build-stap of installatie nodig, het zijn platte
HTML/CSS/JS-bestanden.
