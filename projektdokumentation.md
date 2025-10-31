# Projektdokumentation

**Navn:** Valdemar Andreas Larsen

**Hold:** WU14

**Uddannelse:** Webudvikler

**Uddannelsessted:** Roskilde Tekniske Skole

[Link til min applikation](https://headliner-rho.vercel.app/)

## Teknologier

- HTML
- CSS
- JavaScript
- Vitest
- Vite
- Sass
- React
- React Router
- TanStack Query (React Query)
- Zustand
- React Icons

---

### Redegørelse for oprindelsen af evt. tredjeparts kode anvendt i opgaveløsningen (Teknisk dokumentation)

**TanStack Query (React Query v5)**  
Håndterer data fetching, caching og state management for API-kald til New York Times. Løser problemet med rate limiting (begrænset antal requests per minut) ved at cache data lokalt, så vi ikke skal hente de samme artikler gentagne gange. Understøtter også automatisk retry-logik og background refetching.

**Zustand**  
Bruges til global state management for favoritter og indstillinger. Meget lettere end Redux og perfekt til mindre state-behov. Har indbygget persistence via localStorage, så brugerens favoritter og indstillinger gemmes mellem sessioner.

**React Router v7**  
Håndterer navigation mellem sider (Home, Popular, Archive, Settings, Search) og beskytter routes, så kun logged-in brugere kan tilgå hovedapplikationen.

**React Icons**  
Giver adgang til tusindvis af ikoner fra forskellige biblioteker. Bruges til UI-elementer som favorit-ikon, søg-ikon, navigation osv.

**Vite**  
Moderne build-tool der er meget hurtigere end Create React App. Giver hot module replacement (HMR) og optimeret production build.

**Sass**  
CSS preprocessor der gør det muligt at bruge variabler, mixins (som themify) og bedre strukturering af styles.

**Vitest**  
Testing framework der fungerer perfekt med Vite. Bruges til at teste komponenter, hooks og utility-funktioner.

---

### Argumentation for de valg du selvstændigt har truffet under løsningen af opgaven

**Swipe-to-action funktion**  
Jeg overvejede oprindeligt at lave en simpel animation hvor man skulle swipe og derefter klikke på en favorit- eller slet-knap. Men efter at have tænkt over hvordan Gmail håndterer archivering af emails, hvor man bare swiper og så bliver den archiveret automatisk, besluttede jeg mig for at implementere noget lignende.

Jeg lavede et to-tærskel system: Ved 40px åbner knappen og forbliver åben, ved 120px trigger den automatisk handlingen.

**Konsolideret søgefunktionalitet**  
I stedet for at have tre forskellige måder at søge på (home, popular, archive), konsoliderede jeg alt i én `useArticleSearch` hook. Dette gjorde koden meget mere vedligeholdelig. Hver kilde bruger stadig sin egen metode (Top Stories API, Most Popular API, eller lokal filtering af favoritter), men returnerer konsistent data-struktur.

**Fallback til Article Search API**  
Sports-sektionen returnerer ofte `null` fra Top Stories API (ikke opdateret siden april 2025). Jeg implementerede automatisk fallback til Article Search API når dette sker, så brugeren altid får content.

**Theme system med SCSS mixins**  
Jeg lavede et fleksibelt theme-system med `themify` mixins der gør det utroligt nemt at tilføje nye themes. Man definerer bare farver i `$themes` map'en, og alle komponenter opdaterer automatisk. Det understøtter også system preference detection (mørk/lys mode fra OS).

---

### Vurdering af egen indsats & gennemførelse af opgaveforløbet (Arbejdsgangen)

Jeg synes jeg har gjort et godt stykke arbejde. Der er stadig nogle ting der ville være fede at have nået at lave (f.eks. serverless functions til at skjule API-nøgler, mere omfattende tests), men overall er jeg tilfreds med resultatet.

Jeg prioriterede at holde koden struktureret og vedligeholdelig gennem hele projektet. Dette betyder:

- Konsistent mappestruktur med co-located styles (component.jsx + component.scss)
- Separation of concerns (hooks for data, components for UI, stores for state)
- Genbrugelige komponenter (f.eks. Toggle, ArticleItem)
- Single source of truth (f.eks. NYT_SECTIONS konstant)

En ting jeg ville have gjort anderledes er at have startet med tests tidligere i processen i stedet for at tilføje dem senere. Det ville have gjort det nemmere at refaktorere med tillid.

Jeg brugte også en del tid på UX-detaljer som animationer, progressive feedback under swipe, auto-scrolling under drag, og smooth kategori-åbning/lukning. Disse små detaljer gør appen føles mere poleret og professionel.

---

### En beskrivelse af særlige punkter til bedømmelse

**Component struktur og genbrugelighed**  
Jeg er særligt stolt af hvordan jeg har struktureret Category og ArticleItem som separate, genbrugelige komponenter. ArticleItem fungerer på tværs af Home, Popular og Archive sider, men opfører sig forskelligt baseret på context (f.eks. delete-animation kun på Archive-siden via `isArchivePage` prop).

Category-komponenten håndterer både Top Stories og Most Popular data, med smart fallback-logik og custom event system til at koordinere åbning/lukning af flere kategorier.

**Themify mixin system**  
Mit theme-system er ekstremt fleksibelt og skalerbart:

```scss
// Themify mixin
@mixin themify($themes) {
  @each $theme, $theme-map in $themes {
    .#{$theme}-theme & {
      $theme-map: $theme-map !global;
      @content;
      $theme-map: null !global;
    }
  }
}

@mixin themify-root($themes) {
  @each $theme, $theme-map in $themes {
    .#{$theme}-theme {
      $theme-map: $theme-map !global;
      @content;
      $theme-map: null !global;
    }
  }
}
```

Dette gør det super let at tilføje theming til nye komponenter og lave lige så mange themes som man vil.
Kredit til denne fede artikel: https://david-x.medium.com/light-mode-dark-mode-dynamic-theming-through-scss-mixin-c86e57a4de49

**Data-håndtering og performance**  
Min brug af TanStack Query med custom persistence betyder at appen kan fungere næsten offline efter første load. Combined med smart staleTime og gcTime konfiguration, minimerer jeg API-kald drastisk.

**Progressive enhancement**  
Appen fungerer på alle skærmstørrelser og har touch-optimerede interaktioner (swipe) der føles native på mobile enheder.
