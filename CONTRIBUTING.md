## Contributing

Thanks for wanting to contribute to Taskcafe!

### Where do I go from here?

So you want to contribute to Taskcafe? Great!

If you have noticed a bug, please [create an issue](https://github.com/JordanKnott/taskcafe/issues/new/choose) for it before starting any work on a pull request.

If there is a [new feature you'd like added](https://github.com/JordanKnott/taskcafe/discussions/new?category=ideas) or [have a question](https://github.com/JordanKnott/taskcafe/discussions/new?category=q-a), please visit the [discussions section](https://github.com/JordanKnott/taskcafe/discussions)

Alternatively you can join the [Taskcafe discord](https://discord.gg/JkQDruh) and ask in the #questions channel.

After the bug is validated or the feature is accepted by a project maintainer, the next step is to fork the repository!

### Fork & create a branch

If there is something you want to fix or add, the first step is to fork this repository.

Next is to create a new branch with an appropriate name. The general format that should be used is

```
git checkout -b '<type>/<description>'
```

The `type` is the same as the `type` that you will use for [your commit message](https://www.conventionalcommits.org/en/v1.0.0/#summary).

The `description` is a decriptive summary of the change the PR will make.

### General Rules

- All PRs should be rebased (with master) and commits squashed prior to the final merge process
- One PR per fix or feature
- Setup & install [pre-commit hooks](https://pre-commit.com/#install) then install the hooks `pre-commit install && pre-commit install --hook-type commit-msg`

### Unwanted PRs

- Please do not submit pull requests containing only typo fixes, fixed spelling mistakes, or minor wording changes.

### Git Commit Message Style

This project uses the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) format.

Example commit messages:

```
chore: update gqlgen dependency to v2.6.0
docs(README): add new contributing section
fix: remove debug log statements
```
