---
title: "Git Basics: Your First Commands"
excerpt: "Just installed Git? Here are the handful of commands that carry you through 90% of everyday work — clone, commit, push, and pull, explained without jargon."
date: "2026-07-09"
category: "Git & Dev Tools"
---

## What Git actually does

Git is a version control system: it keeps a full history of every change in your project, so you can go back in time, see who changed what, and work on the same code as other people without overwriting each other. GitHub is just a place to host those Git projects online. You only need a small set of commands to be productive — this post covers them.

## One-time setup

Before your first commit, tell Git who you are. This is stamped onto every commit you make:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

You only do this once per machine.

## Getting a project

To download an existing project and its full history, clone it:

```bash
git clone https://github.com/nmatei/chrome-bible-utilities.git
```

This creates a folder with the code and a hidden `.git` directory that tracks everything.

## The everyday loop

This is the cycle you will repeat all day. First, see what changed:

```bash
git status
```

Stage the files you want to save, then commit them with a short message describing the change:

```bash
git add .
git commit -m "Add contact form validation"
```

`git add .` stages everything; you can also stage a single file with `git add path/to/file`. A commit is a saved snapshot in your local history. To share it, push it to GitHub:

```bash
git push
```

## Getting other people's changes

When teammates push their work, bring it into your copy with:

```bash
git pull
```

Run this often — especially before you start working — so you stay up to date.

## Don't commit everything

Some files should never go into Git: build output, `node_modules`, secrets, editor settings. List them in a `.gitignore` file at the root of your project and Git will skip them:

```
node_modules/
.env
.DS_Store
```

## That's the core

Clone once, then loop `status → add → commit → push`, and `pull` to stay current. Master these and you're already productive.

## Read next

- [Working with Git in a Team](/en/blog/git-teamwork-and-conflicts) — rebasing, keeping local changes, and resolving merge conflicts.
- [Multiple GitHub Accounts with SSH](/en/blog/multiple-github-accounts-ssh) — one machine, more than one account.
