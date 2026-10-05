---
name: tarteel
description: Work in the Tarteel Quran app (Vue 3, Vuetify, Arabic RTL). Use when changing search, تشكيل, roots, the word list, verse overlay, sura header, sura index, or when the user says push merge and deploy.
---

# Tarteel

Read the matching rule in `.cursor/rules/` before editing. The rules hold the constraints. This skill is the map.

## Where things live

- Quran search menu: `src/components/SearchBar.vue`
- Suggestions and تشكيل: `src/hooks/useAutoComplete.js`
- Result groups: `src/utils/wordFilter/results.ts` and `processor.ts`
- Root lookup: `src/utils/dictionaryUtils.js` (`fetchWordRoot`)
- Word chips and verse overlay: `src/components/Tarteel/WordsList.vue`
- Word title: `src/components/Tarteel/WordsListHeader.vue`
- Sura page: `src/components/Sura/SuraHeader.vue`, `SuraBoard.vue`, `SuraText.vue`
- Sura index drawer: `src/components/tableQuranIndex.vue`
- App bar: `src/components/App/AppNav.vue`

Dev server: `http://localhost:8000/app/`. Live site: `https://rusul.net/app/`.

## Deploy

Only when the user says "push merge and deploy".

1. Commit on `main`.
2. `git push origin HEAD`.
3. From the repo root, `bash deploy.sh`.
4. Stop when the log says `Deployment completed successfully!`.
5. Never print the deploy password.

## Check before finishing a UI change

Open the touched screen and use it. For search, type a word, toggle تشكيل, and confirm both the menu and the result chips. For the word list, open verses, then click the title (closes) and an analysis button (stays open).
