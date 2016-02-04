# Contributing guides

> Simple guide on how to contribute to the project

Hey there :wave: Thanks for taking the time to contribute! This document should provide you with all the information needed.

If you want to contribute but you're not sure where to start, check the issues tagged as [**help wanted**](/issues?q=is%3Aissue+is%3Aopen+label%3A"help+wanted").

Please, take a moment to review this document in order to make the contribution process easy and effective.

## Questions

If you have a question, make sure it wasn't [already answered](/issues?q=label%3Asupport). If it wasn't, please feel free to file an issue.

## Bugs

Bug reports are tricky. Please provide as much context as possible.

## Feature requests

Feature requests are always appreciated! The only thing is that they might not get implemented. The main goal is to keep things small and focused so we usually favor more abstract features and so new addons and extensions are easy to be build upon.

## Commit messages

Commit messages are also documentation so clear and descriptive commit messages can be a really powerful tool.

We adopt the **[AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit?usp=sharing)**.

### General rules

* Wrap the body of the message at `72` characters
* Add a blank line between the header and the body of the message
* Use the imperative, present tense: "change" not "changed" nor "changes"
* Don't capitalize the first letter
* Do not finish the subject with a period
* Feel free to use emojis as much as you want but make sure to use [GitHub's short-codes](http://emoji.github.io) instead of the unicode value

### Format

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Types

| Type     | Description                                               |
| -------- | --------------------------------------------------------- |
| feat     | A new feature                                             |
| fix      | A bug fix                                                 |
| docs     | Documentation only changes                                |
| style    | Changes that do not affect the meaning of the code        |
| refactor | A code change that neither fixes a bug or adds a feature  |
| perf     | A code change that improves performance                   |
| test     | Adding missing tests                                      |
| chore    | Changes to the build process or auxiliary tools/libraries |

### Example

A great commit message should look something like these:

```
docs(instructions): update API reference

Couple of typos fixed:
- indentation
- batchLogbatchLog -> batchLog
- start periodic checking
- missing brace

Closes #42
```

## Git workflow

1. Fork the repository
2. Create a new feature branch following the same rules used for commit messages
  * `feat/my-awesome-feature`
  * `fix/fixed-that-for-you`
  * `perf/render`
  * `chore/deploy-scripts`
3. Start working you your thing
4. Commit your changes and push them to the remote repository
5. Make sure the build is valid (if not fix it then go back to **#4**)
6. Open a new pull request

Please, detail the pull request as much as you can. Also make sure to mention people and current issues involved on the PR context.

## Development

To get the project ready for development, first install the dependencies:

```sh
$ npm install
```

### Code linting

As an effort to keep the code consistent, we rely on code linting. To lint the code, simply run:

```sh
$ npm run lint
```

Note that linting is tied to the `test` script. That means any pull requests where the linting breaks, CI will break as well.

### Test

To run the tests, simply run the following command:

```sh
$ npm test
```
