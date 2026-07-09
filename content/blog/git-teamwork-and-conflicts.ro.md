---
title: "🤝 Lucrul în echipă cu Git"
excerpt: "Când alți oameni împart branch-ul cu tine, lucrurile devin mai interesante. Iată cum faci rebase curat, cum te actualizezi fără să pierzi modificările locale și cum rezolvi conflictele de merge fără stres."
date: "2026-07-09"
tags: ["Git", "Dev Tools", "Teamwork"]
---

După ce te-ai obișnuit cu [comenzile de bază](/ro/blog/git-basics-for-beginners), următoarea provocare este să lucrezi alături de alți oameni 😄. Acestea sunt comenzile pe care le folosesc zilnic pe un branch partajat.

## 🌿 Lucrează pe un branch

În loc să faci commit direct pe `master`, creează un branch pentru fiecare funcționalitate sau fix:

```bash
git checkout -b new-branch-name
```

Astfel munca ta rămâne izolată până e gata de merge.

## 🧹 Pull cu rebase pentru un istoric curat

Când mai mulți oameni lucrează pe același branch, un simplu `git pull` creează „merge commit"-uri suplimentare care încarcă istoricul. Pull cu rebase îți rejoacă commit-urile peste ultimele modificări, în loc să adauge zgomot:

```bash
git pull --rebase
```

Rezultatul este un istoric liniar și ușor de citit.

## 📦 Actualizează-te păstrând modificările locale

Deseori vrei cel mai recent cod, dar ești în mijlocul unei modificări necommise. Pune-ți modificările în „stash", fă pull, apoi readu-le:

```bash
git stash && git pull --rebase && git stash pop
```

`git stash` îți pune deoparte munca necommisă, iar `git stash pop` o restaurează după aceea.

Vrei să treci pe `master` și să-l actualizezi fără să-ți pierzi munca în curs? Înlănțuie totul într-o singură linie:

```bash
git stash && git checkout master && git pull --rebase && git stash pop
```

> 💡 **Sfat pentru IDE:** Unele editoare fac asta în locul tău. În [IntelliJ IDEA](https://www.jetbrains.com/idea/), apeși pur și simplu **Update Project** — te întreabă dacă vrei merge sau rebase, apoi îți pune modificările locale în stash și le readuce automat. În [VS Code](https://code.visualstudio.com/) nu este la fel de simplu: trebuie să faci manual pașii de stash, pull și readucere a modificărilor.

## ⚔️ Rezolvarea conflictelor de merge

Mai devreme sau mai târziu, doi oameni modifică aceleași linii și Git nu poate decide cine „câștigă" 🙈 — acesta este un conflict. Git marchează locul în fișier astfel:

```
<<<<<<< HEAD
versiunea ta
=======
versiunea lor
>>>>>>> nume-branch
```

> 💡 **Sfat:** Înainte să rezolvi ceva, deschide repository-ul în aplicația de hosting ([GitHub](https://github.com), [GitLab](https://gitlab.com)…) și uită-te la commit-urile recente sau la fila *Files changed* a Pull Request-ului. Văzând exact ce au modificat colegii tăi — și de ce — îți este mult mai ușor să înțelegi ambele variante și să alegi versiunea finală potrivită pentru merge.

Fără panică. Deschide fișierul, decide cum trebuie să arate codul final și șterge liniile de marcaj `<<<<<<<`, `=======` și `>>>>>>>`. Apoi adaugă fișierul rezolvat în staging:

```bash
git add app/contact-form.js
```

Apoi continuă operațiunea în care erai:

```bash
git rebase --continue   # dacă făceai rebase (ex. după pull --rebase)
git merge --continue    # dacă făceai merge
```

Dacă lucrurile se complică și preferi să o iei de la capăt, retrage-te în siguranță:

```bash
git rebase --abort      # sau: git merge --abort
```

Astfel revii la starea de dinaintea operațiunii, fără să pierzi nimic.

## 🎯 Concluzia

Lucrează pe branch-uri, folosește `pull --rebase` ca să rămâi la zi cu un istoric curat, folosește `stash` ca să te miști liber și tratează conflictele ca pe o parte normală și recuperabilă a muncii în echipă.

## 📚 Citește mai departe

- [Git pentru începători: primele comenzi](/ro/blog/git-basics-for-beginners) — începe de aici dacă ciclul de zi cu zi îți este încă nou.
- [Mai multe conturi GitHub cu SSH](/ro/blog/multiple-github-accounts-ssh) — un singur calculator, mai multe conturi.
