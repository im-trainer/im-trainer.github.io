---
title: "🌱 Git pentru începători: primele comenzi"
excerpt: "Tocmai ai instalat Git? Iată setul mic de comenzi care acoperă 90% din munca de zi cu zi — clone, commit, push și pull, explicate fără jargon."
date: "2026-07-09"
tags: ["Git", "Dev Tools"]
---

## 💡 Ce face Git, de fapt

Git este un sistem de control al versiunilor: păstrează istoricul complet al fiecărei modificări din proiect, ca să poți reveni în timp, să vezi cine ce a schimbat și să lucrezi la același cod împreună cu alți oameni fără să vă suprascrieți reciproc. GitHub este doar un loc unde găzduiești proiectele Git online. Ai nevoie doar de câteva comenzi ca să fii productiv — despre ele este acest articol.

## ⚙️ Configurarea inițială

Înainte de primul commit, spune-i lui Git cine ești. Această informație este atașată fiecărui commit pe care îl faci:

```bash
git config --global user.name "Numele Tău"
git config --global user.email "you@example.com"
```

Faci asta o singură dată pe fiecare calculator.

## 📥 Cum obții un proiect

Ca să descarci un proiect existent împreună cu tot istoricul lui, îl clonezi:

```bash
git clone https://github.com/nmatei/chrome-bible-utilities.git
```

Se creează un folder cu codul și un director ascuns `.git`, care ține evidența tuturor modificărilor.

## 🔁 Ciclul de zi cu zi

Acesta este ciclul pe care îl repeți toată ziua. Mai întâi, vezi ce s-a schimbat:

```bash
git status
```

Adaugă în „staging" fișierele pe care vrei să le salvezi. Adaugă un singur fișier când vrei doar o parte din munca ta în acest commit:

```bash
git add app/contact-form.js
```

Sau adaugă tot ce ai modificat, dintr-o dată:

```bash
git add .
```

Apoi fă un commit cu fișierele adăugate, cu un mesaj scurt care descrie modificarea:

```bash
git commit -m "Adaugă validare pentru formularul de contact"
```

Un commit este un instantaneu salvat în istoricul tău local. Ca să îl împărtășești, trimite-l pe GitHub:

```bash
git push
```

## ⬇️ Cum aduci modificările altora

Când colegii își trimit munca, adu-o în copia ta cu:

```bash
git pull
```

Rulează asta des — mai ales înainte să începi să lucrezi — ca să rămâi la zi.

## 🙈 Nu pune totul în Git

Unele fișiere nu ar trebui să ajungă niciodată în Git: rezultatul build-ului, `node_modules`, secretele, setările editorului. Enumeră-le într-un fișier `.gitignore` la rădăcina proiectului, iar Git le va ignora:

```
node_modules/
.env
.DS_Store
```

## 🎯 Acesta este nucleul

Clonezi o dată, apoi repeți ciclul `status → add → commit → push` și faci `pull` ca să rămâi la zi. Odată ce le stăpânești, ești deja productiv.

## 📚 Citește mai departe

- [Lucrul în echipă cu Git](/ro/blog/git-teamwork-and-conflicts) — rebase, păstrarea modificărilor locale și rezolvarea conflictelor de merge.
- [Mai multe conturi GitHub cu SSH](/ro/blog/multiple-github-accounts-ssh) — un singur calculator, mai multe conturi.
