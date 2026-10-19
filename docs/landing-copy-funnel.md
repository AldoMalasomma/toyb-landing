# Landing Page Copy + Funnel

Snapshot: 2026-03-14

Scope:

- Pagina: `/` (`src/pages/index.astro`)
- Componenti shared che compaiono nella landing: `src/components/Hero.astro`, `src/components/Navbar.astro`, `src/components/Footer.astro`
- Questo documento fotografa il copy attivo della landing.
- Nota tecnica: il sito supporta anche una variante `legacyCopy`, ma il default corrente e `ui` salvo override di `PUBLIC_COPY_VERSION=legacy`.

## 1. Funnel della landing

### Obiettivo del funnel

La landing spinge verso un'unica conversione primaria: iscrizione alla waitlist / richiesta early access.

La logica attuale e questa:

1. Posizionamento immediato
   Hero + navbar spiegano in pochi secondi che Toyb serve a gestire worldbuilding e narrative systems in modo strutturato.
2. Qualificazione dell'offerta
   Il blocco "Early access includes" e "What is Toyb?" chiariscono cosa si ottiene e per chi e pensato.
3. Conversione
   Il blocco waitlist raccoglie l'email e gestisce consensi, rassicurazione e feedback di submit.
4. Prova di valore
   "Why Toyb", "Built for system thinkers", "Inside the engine" e "The Toyb workspace" mostrano il modello mentale del prodotto e la UI.
5. Fiducia
   Il blocco founder e il footer danno contesto umano, legale e canali esterni.

### Lettura sezione per sezione

#### 1. Navbar

Funzione nel funnel:

- orienta rapidamente verso proof (`Why Toyb`, `Preview`);
- offre una deviazione narrativa verso `/origin`;
- mantiene sempre visibile la CTA `Get early access`.

#### 2. Hero

Funzione nel funnel:

- comunica la promessa principale;
- apre due direzioni: conversione immediata o approfondimento.

Esito desiderato:

- click su `Get early access`;
- in alternativa scroll verso `Why Toyb`.

#### 3. Early access briefing

Funzione nel funnel:

- rende concreto il beneficio della waitlist;
- riduce l'ambiguita su cosa succede dopo il submit;
- aggiunge contesto di prodotto e founder.

#### 4. What is Toyb?

Funzione nel funnel:

- trasforma il claim del hero in descrizione operativa;
- spiega il prodotto come platform / workspace, non come semplice writing app.

#### 5. Waitlist

Funzione nel funnel:

- conversione primaria;
- combina promessa, rassicurazione anti-spam, consenso privacy e consenso marketing opzionale.

Punti chiave:

- il CTA e unico e diretto: `Get early access`;
- il tono e basso-frizione;
- il form separa consenso obbligatorio e marketing opzionale.

#### 6. Why Toyb

Funzione nel funnel:

- prova sintetica del valore;
- presenta 3 reason-to-believe: struttura del progetto, controllo di timeline e dipendenze, coherence checks.

#### 7. Built for system thinkers

Funzione nel funnel:

- qualifica il target;
- aumenta l'auto-identificazione di writers e worldbuilders strutturati;
- riduce traffico poco qualificato.

#### 8. Inside the engine

Funzione nel funnel:

- mostra il prodotto in uso;
- rafforza il framing "connected system" vs "disconnected notes";
- riporta di nuovo alla CTA di conversione.

#### 9. Workspace overview

Funzione nel funnel:

- chiude il blocco prodotto con una vista piu ampia e piu "operational";
- consolida l'idea di cockpit unico.

#### 10. Founder

Funzione nel funnel:

- aggiunge credibilita e origine del problema;
- rende piu credibile il posizionamento "built from a real narrative pain".

#### 11. Footer

Funzione nel funnel:

- chiusura di fiducia;
- accesso a legal, preview, origin e CTA finale;
- supporto a utenti che vogliono verificare prima di lasciare l'email.

### Nota strategica

Nel funnel attuale il blocco waitlist arriva abbastanza presto, prima della maggior parte delle prove di prodotto. E una scelta sensata per utenti gia caldi. Le sezioni successive lavorano soprattutto come supporto alla conversione per utenti piu freddi o piu analitici.

## 2. Copy completo della landing

### Meta / SEO

Fonte: `src/pages/index.astro`

- Title: `toyb | Build universes. Break complexity.`
- Description: `Toyb is a modular worldbuilding engine for creators who think in systems.`

### Navbar

Fonte: `src/components/Navbar.astro`

- `Why Toyb`
- `Built for creators`
- `Preview`
- `Origin`
- `Get early access`

### Hero

Fonte: `src/components/Hero.astro`

- Headline: `Build universes. Break complexity.`
- Subtitle: `Toyb is a modular worldbuilding engine for creators who think in systems.`
- CTA primary: `Get early access`
- CTA secondary: `See how it works`

### Early access briefing

Fonte: `src/pages/index.astro`

- Title line: `Early access includes:`
- Bullet: `invitation to the private beta`
- Bullet: `access to the founding community`
- Bullet: `direct feedback with the creator`
- Bullet: `founding builder status`
- Bullet: `Kickstarter launch notification`
- Bullet: `early backer rewards`
- Supporting line: `Toyb replaces folder-based worldbuilding workflows with a system-oriented workspace.`
- Supporting line: `Toyb is entering its first private release phase with early testers.`
- Supporting line: `The public launch is planned for Kickstarter next month.`
- Supporting line: `Built by a solo founder focused on narrative systems.`

### What is Toyb?

Fonte: `src/pages/index.astro` (`uiCopy.whatIs`)

- Section title: `What is Toyb?`
- Paragraph 1: `Toyb is a narrative systems platform for managing projects as connected data, not scattered files.`
- Paragraph 2: `Track relationships across characters, events, factions, plots, and locations in one operational model.`
- Paragraph 3: `Monitor dependencies, detect contradictions early, and keep narrative state consistent as scope grows.`

### Waitlist

Fonte: `src/pages/index.astro` (`uiCopy.waitlist`)

- Section title: `Request early access.`
- Subtitle: `Join the private pre-launch cohort to access the beta and help validate core workflows before public release.`
- Note: `Early beta access. Founding community. Direct feedback channel with the founder.`
- Reassurance: `No spam. Just occasional updates about early access and launch.`
- Email placeholder: `Your email`
- Button label: `Get early access`

Consensi:

- Required consent: `I declare I am at least 16 years old. Privacy policy.`
- Optional consent: `I consent to receive promotional emails and launch updates (newsletter).`

Feedback submit / error:

- Success: `You're on the list. Check your inbox.`
- Success with email issue: `You're on the list, but we could not send the email. Retry in a moment or contact support.`
- Validation: `Please confirm you are at least 16 and accept the Privacy Policy.`
- Forbidden origin: `This origin is not allowed for submissions.`
- Invalid request: `Please check the email and try again.`
- Age required: `Please confirm you are at least 16 years old.`
- Privacy required: `Please accept the Privacy Policy to continue.`
- Rate limited: `Too many attempts. Try again later.`
- Server error: `Service is temporarily unavailable. Try again shortly.`
- Generic error: `Something went wrong. Try again.`

### Why Toyb

Fonte: `src/pages/index.astro` (`uiCopy.why`)

- Section title: `Why Toyb`
- Subtitle: `Operational controls for complex narrative projects. Minimal surface, maximum clarity.`

Card 1:

- Title: `Projects as systems`
- Text: `Model creative work as linked entities instead of isolated documents and folders.`

Card 2:

- Title: `Graph + timeline control`
- Text: `Review relationships, chronology, and dependencies in one structured interface.`

Card 3:

- Title: `Coherence checks`
- Text: `Detect contradictions early and resolve narrative conflicts before they scale.`

### Built for system thinkers

Fonte: `src/pages/index.astro` (`uiCopy.creators`)

- Section title: `Built for system thinkers.`
- Subtitle: `For writers and worldbuilders who need structured control across interconnected narrative components.`
- Bullet: `Model characters, plots, factions, and locations as linked records.`
- Bullet: `Keep timeline and dependency logic explicit as projects scale.`
- Bullet: `Reduce rework by surfacing constraints early.`
- Visual alt: `Toyb narrative graph interface`

### Inside the engine

Fonte: `src/pages/index.astro` (`uiCopy.preview`)

- Section title: `Inside the engine.`
- Subtitle: `Operate graph, timeline, insights, and health views as one coherent narrative workflow.`
- Summary lead: `Run your project as a connected system instead of disconnected notes.`
- Summary line: `Characters link to plots.`
- Summary line: `Events map to timelines.`
- Summary line: `Factions track influence across arcs.`
- Summary line: `Monitor dependencies. Resolve contradictions early.`
- Summary line: `Maintain consistency as project complexity grows.`
- Statement line: `Not a generic writing app.`
- Statement line: `A control layer for narrative systems.`
- Note: `Early access users help prioritize workflows before public launch.`
- CTA primary: `Get early access`
- CTA secondary: `See how it works`

Slide labels / microcopy:

- `Narrative Graph`
- `Timeline`
- `AI Insights`
- `Project Health`

Slide alt text:

- `Narrative Graph view showing connections between story entities.`
- `Timeline view mapping events and sequence across the narrative.`
- `AI Insights panel surfacing narrative issues and recommendations.`
- `Project Health view validating consistency across the system.`

Lightbox / controls:

- `Open Narrative Graph screenshot in fullscreen` and equivalent per slide
- `Previous slide`
- `Next slide`
- `Choose slide`
- `Close fullscreen viewer`
- `Previous screenshot`
- `Next screenshot`
- `Inside the engine gallery`

### Workspace overview

Fonte: `src/pages/index.astro` (`uiCopy.workspace`)

- Section title: `The Toyb workspace`
- Subtitle: `Project workspace overview.`
- Body copy: `Track entities, timelines, narrative signals, and project health from one unified workspace.`
- Caption: `Workspace Overview · unified cockpit`
- Alt text: `Toyb workspace overview showing unified project cockpit with entities, timeline, signals, and health.`
- Action label: `Open Toyb workspace overview in fullscreen`

### Founder

Fonte: `src/pages/index.astro`

- Section title: `Built by a solo founder`
- Paragraph 1: `Toyb is developed by Aldo G. Malasomma, an independent developer with 15+ years of experience building web systems and creative tools.`
- Paragraph 2: `The idea came while working on a large science-fiction worldbuilding project. Hundreds of notes, character ideas, technologies, and plot fragments had grown across files, notebooks, and devices.`
- Paragraph 3: `Managing that complexity became harder than writing the story itself.`
- Paragraph 4: `Toyb was created to solve that problem: treating narrative worlds as structured systems instead of scattered files.`
- Paragraph 5: `Aldo relocated to Estonia to build the project inside one of Europe's most active digital startup ecosystems.`
- Link label: `LinkedIn`

### Footer

Fonte: `src/components/Footer.astro`

- Signature: `{year} · toyb.space`

Legal links:

- `Privacy`
- `Accessibility`
- `Terms`
- `Imprint`

Site links:

- `Origin`
- `Preview`
- `Get early access`

Follow block:

- `Follow Toyb`
- `X`
- `GitHub`
- `Email`

## 3. Note su copy non attivo ma presente nel codice

Fonte: `src/pages/index.astro`

Sono presenti contenuti non renderizzati o non usati come default:

- variante `legacyCopy` con copy alternativo per `whatIs`, `waitlist`, `why`, `creators`, `preview`, `workspace`;
- vecchio blocco prelaunch commentato;
- vecchia founder section commentata.

Questo significa che il file contiene sia il copy attivo del funnel corrente sia materiale tenuto come rollback rapido.
