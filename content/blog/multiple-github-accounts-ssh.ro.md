---
title: "🔑 Mai multe conturi GitHub cu SSH"
excerpt: "Jonglezi cu un cont personal și unul de serviciu pe același calculator? Configurează SSH o singură dată, ca să fie folosită automat cheia corectă — fără parole cerute mereu și fără erori de push pe contul greșit."
date: "2026-07-09"
tags: ["Git", "Dev Tools", "SSH"]
---

Dacă ai mai mult de un cont [GitHub](https://github.com) — de exemplu unul personal și unul de serviciu — pe același calculator, cheile SSH sunt cea mai curată metodă de a le ține separate. Le configurezi o dată, iar Git alege automat cheia potrivită, în funcție de organizația către care faci push. Acest articol continuă [postarea despre lucrul în echipă](/ro/blog/git-teamwork-and-conflicts); este partea cea mai avansată din serie.

Există mai multe moduri de a face asta. Mai jos este abordarea pe care o folosesc eu, bazată pe o regulă de rescriere a URL-ului, ca să nu mai trebuiască să te gândești la ea vreodată.

## 1. 🔑 Generează o cheie SSH de serviciu

Păstrează cheia personală așa cum e și creează o cheie dedicată pentru al doilea cont:

```bash
ssh-keygen -t ed25519 -C "work@example.com" -f ~/.ssh/id_ed25519_work
```

> Sari peste acest pas dacă ai deja o cheie pentru acel cont.

## 2. 🔗 Adaugă fiecare cheie la contul GitHub potrivit

- Cheia personală (`~/.ssh/id_rsa.pub` sau cea implicită) → GitHub-ul tău personal → Settings → SSH Keys
- Cheia de serviciu (`~/.ssh/id_ed25519_work.pub`) → contul GitHub de serviciu → Settings → SSH Keys

## 3. ⚙️ Configurează `~/.ssh/config`

Vezi configurația actuală cu `cat ~/.ssh/config`, apoi adaugă:

```
# Cheia de serviciu pentru organizația im-trainer
Host github.work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
  IdentitiesOnly yes

# Cheia personală — fallback pentru orice altceva (nmatei etc.)
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes
```

`IdentitiesOnly yes` forțează SSH să folosească exact cheia pe care ai specificat-o, în loc să le încerce pe toate pe care le cunoaște.

## 4. 🔀 Adaugă o regulă de rescriere a URL-ului (o singură dată)

Acesta este trucul care face totul automat: orice URL care pointează către organizația de serviciu este rescris ca să folosească host-ul de serviciu.

```bash
git config --global url."git@github.work:im-trainer/".insteadOf "git@github.com:im-trainer/"
```

Acum poți copia URL-urile de clone direct de pe GitHub, fără să le editezi.

Ca să vezi ce reguli de rescriere sunt active:

```bash
# Listează toate regulile insteadOf
git config --global --get-regexp 'url\..*\.insteadof'

# Sau afișează toate setările url.*
git config --global --get-regexp '^url\.'
```

Ca să ștergi o regulă mai târziu:

```bash
git config --global --unset url."git@github.work:im-trainer/".insteadOf
```

## 5. ✅ Testează conexiunile

```bash
ssh -T git@github.com       # Hi <username-ul-tau-personal>!
ssh -T github.work          # Hi <username-ul-tau-de-serviciu>!
```

## 6. 📥 Exemple de clone

```bash
# Organizația de serviciu (im-trainer) — insteadOf rescrie automat, copiază URL-ul ca atare
git clone git@github.com:im-trainer/some-repo.git

# Repo personal — nu e nevoie de rescriere
git clone git@github.com:nmatei/chrome-bible-utilities.git
```

## 7. 🛠️ Forțează o anumită cheie pentru o comandă punctuală

Dacă ai vreodată nevoie să suprascrii cheia manual, fără să atingi configurația:

```bash
# Clone cu o cheie anume
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519_work -o IdentitiesOnly=yes" git clone git@github.com:im-trainer/some-repo.git

# Push cu o cheie anume
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519_work -o IdentitiesOnly=yes" git push
```

## 📋 Rezultatul

| Organizație              | Cheie folosită                          |
| ------------------------ | --------------------------------------- |
| `im-trainer/*`           | `id_ed25519_work` (auto prin insteadOf) |
| `nmatei/*` sau oricare altele | `id_rsa` (personală, fallback)     |

Configurează asta o dată și vei uita că există — mereu este folosită identitatea corectă.

## 📚 Citește mai departe

- [Lucrul în echipă cu Git](/ro/blog/git-teamwork-and-conflicts) — rebase, păstrarea modificărilor locale și rezolvarea conflictelor de merge.
- [Git pentru începători: primele comenzi](/ro/blog/git-basics-for-beginners) — ciclul zilnic clone / commit / push / pull.
