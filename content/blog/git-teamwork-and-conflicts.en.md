---
title: "Working with Git in a Team"
excerpt: "Once other people share your branch, life gets more interesting. Here's how to rebase cleanly, update without losing your local changes, and resolve merge conflicts calmly."
date: "2026-07-08"
category: "Git & Dev Tools"
---

Once you're comfortable with the [basics](/en/blog/git-basics-for-beginners), the next challenge is working alongside other people. These are the commands I reach for every day on a shared branch.

## Work on a branch

Instead of committing straight to `master`, create a branch for each feature or fix:

```bash
git checkout -b new-branch-name
```

This keeps your work isolated until it's ready to merge.

## Pull with rebase to keep history clean

When several people work on the same branch, a plain `git pull` creates extra "merge commits" that clutter the history. Pulling with rebase replays your commits on top of the latest changes instead:

```bash
git pull --rebase
```

The result is a straight, readable history.

## Update while keeping your local changes

You often want the latest code but you're in the middle of something uncommitted. Stash your changes, pull, then put them back:

```bash
git stash && git pull --rebase && git stash pop
```

`git stash` tucks your uncommitted work aside, and `git stash pop` restores it afterwards.

Need to switch to `master` and update it without losing your work-in-progress? Chain it in one line:

```bash
git stash && git checkout master && git pull --rebase && git stash pop
```

## Resolving merge conflicts

Sooner or later, two people change the same lines and Git can't decide who wins — that's a conflict. Git marks the spot in the file like this:

```
<<<<<<< HEAD
your version
=======
their version
>>>>>>> branch-name
```

Don't panic. Open the file, decide what the final code should be, and delete the `<<<<<<<`, `=======`, and `>>>>>>>` marker lines. Then stage the resolved file:

```bash
git add path/to/resolved-file
```

Then continue the operation you were in the middle of:

```bash
git rebase --continue   # if you were rebasing (e.g. after pull --rebase)
git merge --continue    # if you were merging
```

If things get messy and you'd rather start over, back out safely:

```bash
git rebase --abort      # or: git merge --abort
```

This returns you to the state before the operation, with nothing lost.

## The takeaway

Branch your work, `pull --rebase` to stay current with a clean history, use `stash` to move around freely, and treat conflicts as a normal, recoverable part of teamwork.

## Read next

- [Git Basics: Your First Commands](/en/blog/git-basics-for-beginners) — start here if the everyday loop is still new.
- [Multiple GitHub Accounts with SSH](/en/blog/multiple-github-accounts-ssh) — one machine, more than one account.
