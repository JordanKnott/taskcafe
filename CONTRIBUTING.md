## Contributing

Thanks for wanting to contribute to Taskcafe!

### Where do I go from here?

If you have noticed a bug or have a feature request, make one! If best to get confirmation
of your bug or feature before starting work on a pull request.

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
- Setup & install [pre-commit hooks](https://pre-commit.com/#install)

### Git Commit Message Style

This project uses the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) format.

Example commit messages:

```
chore: update gqlgen dependency to v2.6.0
docs(README): add new contributing section
fix: remove debug log statements
```
