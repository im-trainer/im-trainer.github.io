---
title: "🔑 Multiple GitHub Accounts with SSH"
excerpt: "Juggling a personal and a work GitHub account on one machine? Set up SSH once so the right key is used automatically — no more password prompts or wrong-account push errors."
date: "2026-07-09"
tags: ["Git", "Dev Tools", "SSH"]
---

If you have more than one [GitHub](https://github.com) account — say a personal one and a work one — on the same computer, SSH keys are the cleanest way to keep them apart. Set it up once and Git picks the right key automatically, based on which organization you're pushing to. This builds on the [team workflow post](/en/blog/git-teamwork-and-conflicts); it's the most advanced piece of the series.

There are several ways to do this. Below is the approach I use, based on a URL-rewrite rule so you never have to think about it again.

## 1. 🔑 Generate a work SSH key

Keep your personal key as-is and create a dedicated key for the second account:

```bash
ssh-keygen -t ed25519 -C "work@example.com" -f ~/.ssh/id_ed25519_work
```

> Skip this if you already have a key for that account.

## 2. 🔗 Add each key to the right GitHub account

- Personal key (`~/.ssh/id_rsa.pub` or your default) → your personal GitHub → Settings → SSH Keys
- Work key (`~/.ssh/id_ed25519_work.pub`) → your work GitHub account → Settings → SSH Keys

## 3. ⚙️ Configure `~/.ssh/config`

View the current config with `cat ~/.ssh/config`, then add:

```
# Work key for the im-trainer org
Host github.work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
  IdentitiesOnly yes

# Personal key — fallback for everything else (nmatei, etc.)
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes
```

`IdentitiesOnly yes` forces SSH to use exactly the key you named, instead of trying every key it knows.

## 4. 🔀 Add a URL rewrite rule (one-time)

This is the trick that makes it automatic: any URL pointing at the work org gets rewritten to use the work host.

```bash
git config --global url."git@github.work:im-trainer/".insteadOf "git@github.com:im-trainer/"
```

Now you can copy clone URLs straight from GitHub without editing them.

## 5. ✅ Test the connections

```bash
ssh -T git@github.com       # Hi <your-personal-username>!
ssh -T github.work          # Hi <your-work-username>!
```

## 6. 📥 Clone examples

```bash
# Work org (im-trainer) — insteadOf rewrites it automatically, copy the URL as-is
git clone git@github.com:im-trainer/some-repo.git

# Personal repo — no rewrite needed
git clone git@github.com:nmatei/chrome-bible-utilities.git
```

## 7. 🛠️ Force a specific key for a one-off command

If you ever need to override the key manually, without touching the config:

```bash
# Clone with a specific key
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519_work -o IdentitiesOnly=yes" git clone git@github.com:im-trainer/some-repo.git

# Push with a specific key
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519_work -o IdentitiesOnly=yes" git push
```

## 📋 The result

| Org               | Key used                                |
| ----------------- | --------------------------------------- |
| `im-trainer/*`    | `id_ed25519_work` (auto via insteadOf)  |
| `nmatei/*` or any other | `id_rsa` (personal, fallback)     |

Set this up once and you'll forget it's even there — the right identity is always used.

## 📚 Read next

- [Working with Git in a Team](/en/blog/git-teamwork-and-conflicts) — rebasing, keeping local changes, and resolving merge conflicts.
- [Git Basics: Your First Commands](/en/blog/git-basics-for-beginners) — the everyday clone / commit / push / pull loop.
