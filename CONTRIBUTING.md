# Contribution Guidelines

First off, thanks for taking the time to contribute! :+1:

## I just have a question

You can launch a quick question on the [#acpaas-ui slack channel](https://dgpls.slack.com/messages/C4M60PQJF).

For something that requires longer discussion it may be better to book an issue.

## How do I report bugs / ask features?

Please book a GitHub issue.

## What should I know to get started?

This widget is part of the [ACPaaS UI platform](https://acpaas-ui.digipolis.be). For more info about Smart Widgets, check the [documentation hub](https://github.com/digipolisantwerp/smart-widgets).

Before contributing code, you should be aware of the following:

- The architecture consists of a separate front-end and back-end package. The back-end is a so-called Backend-For-Frontend (BFF). The architecture should conform to the [SA2020 guidelines](https://goo.gl/izTzSH).
- There may be multiple independent front-ends and back-ends for the different technologies that Digipolis supports. All of these should implement the same BFF API. The set of supported technologies is described in the [DAAS standard](https://docs.google.com/spreadsheets/d/e/2PACX-1vR9N3gAJoJFIlaXnpAfSpog85EN1DXJYy5bWHgZ4XKhy8KN1v6xgT4-eaoTTBTEzhIpMGqd_Q11RuKF/pubhtml).

## How can I contribute code?

### Code layout

- `./src` contains the service library (typescript)
- `./example` contains the demo app (typescript)
- `./test`contains the jasmine unit tests (javascript)

### Building and Testing

`> npm install`

Commands:

- Start the demo app

  `> npm start`

- Run the tests (with coverage)

  `> npm test`

### Submitting Changes

Please send us your changes as a GitHub pull request.

In order for us to be able to accept your pull request without remarks, please do these things:

- Follow the above style guides.
- Please update the readme documentation and example app along with the code.
- Make sure all the tests pass.
- Provide a clear description on the pull request of what was changed
- Link to a relevant issue. Feel free to create one if none exists.

If possible, do provide meaningful and clean commit messages. A [good commit message](https://chris.beams.io/posts/git-commit/) completes the sentence "When committed this will …"

### Publishing

> Only the ACPaaS UI team publishes new packages. [Contact us](https://acpaas-ui.digipolis.be/contact) if you need a new release published.

Follow these steps to publish a new version of the package.
You must have a Digipolis account with access to Nexus.

1. Increment the version in package.json
2. Log in to the the private registry

    `> npm login --registry=https://nexusrepo.antwerpen.be/repository/npm-private/`

3. Publish the package

    `> npm publish --registry=https://nexusrepo.antwerpen.be/repository/npm-private/`
