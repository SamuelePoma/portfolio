# Content TODO

What the site still needs from Samuele. Nothing here is ever filled in with invented content: until an item is resolved, the site shows a designed placeholder or omits the detail.

## Assets

Drop image files into `public/images/` (WebP or AVIF, sRGB). Slot details are in DESIGN.md §10.

| Slot                | What                                                                    | Ratio | Status                |
| ------------------- | ----------------------------------------------------------------------- | ----- | --------------------- |
| `IMG-MUSETRAIL-01`  | Main MuseTrail screen (desktop screenshot)                              | 16:10 | ⏳ Samuele has it     |
| `IMG-MUSETRAIL-02`  | Dragons' Den award ceremony / team with the prize                       | 4:5   | ⏳ Samuele has it     |
| `IMG-MUSETRAIL-03`  | Second design screen or mobile view                                     | 16:10 | Optional              |
| `IMG-CONNEQTECH-01` | Dashboard main view (map + vehicles). **Blur plates and customer data** | 16:10 | ⏳ Samuele has images |
| `IMG-CONNEQTECH-02` | Vehicle detail / GPS history view                                       | 16:10 | ⏳ Samuele has images |
| `IMG-STEDIN-01`     | Product screen (power-usage map or transformer overview)                | 16:10 | ⏳ Samuele has it     |
| `IMG-STEDIN-02`     | Detail / alert view for a faulty transformer                            | 16:10 | Optional              |
| `IMG-PROGMATIC-01`  | Research board, whiteboard or early prototype                           | 16:10 | Optional              |
| `IMG-PORTRAIT`      | Professional portrait, neutral background                               | 4:5   | Optional              |
| `CV-PDF`            | Résumé **without the phone number** → `public/cv/samuele-poma-cv.pdf`   | A4    | ⏳ To export          |

## Permissions

- [ ] Can Conneqtech screenshots be published? (Confirm with Conneqtech.)
- [ ] Can Stedin project screenshots be published? (Confirm with HZ / Stedin.)

## Questions for the case studies

Answers make the case studies richer. Unanswered questions just mean shorter sections.

### All projects

- [ ] Are any repositories public? Links, please.
- [ ] Is there a live demo for any of them?

### MuseTrail

- [ ] How big was the team, and what exactly did you build (which features, frontend vs backend)?
- [ ] What was the architecture (SvelteKit routes, database, how Docker was used)?
- [ ] What did you learn (technical and as a team lead)?
- [ ] What did the Dragons' Den competition involve (who judged, how many teams)?

### Conneqtech GPS dashboard

- [ ] Which parts were Go (backend only, or also the frontend via templates)? Which frontend tech?
- [ ] Where does the GPS data come from, and how is it stored and served (APIs, database, real-time or polling)?
- [ ] Who uses it (internal staff, customers)? Any result you can share?
- [ ] What did you learn?

### Stedin grid monitoring

- [ ] Team size and your role?
- [ ] How are faulty transformers detected / shown?
- [ ] Period (dates)?
- [ ] What did you learn?

### Progmatic AI knowledge assistant

- [ ] Which approaches are you comparing (e.g. RAG, specific models, vector stores)?
- [ ] Anything you can share publicly about the client context (confidentiality)?

### ChessGame

- [ ] Which design patterns did you use (e.g. Strategy, Factory, Command)?
- [ ] Solo project? Is the repo public?

## Decisions pending

- [ ] Git author email for this public repo: currently `poma0001@hz.nl`. Keep it, or use a personal one?
- [ ] Domain `samuelepoma.com` (Phase 10).
