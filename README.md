# cdp-portal-journey-tests

Testing CDP Portal.

WDIO tests against an environment, github workflow or locally.

> [!WARNING]
> DO NOT DEPLOY THESE TESTS TO AN CDP ENVIRONMENT AT THE MOMENT!
> Contains non-ephemeral flows.

- [Local Development](#local-development)
- [Requirements](#requirements)
  - [Node.js](#nodejs)
  - [Setup](#setup)
- [Running](#running)
  - [Test](#test)
  - [GitHub](#github)
  - [Local](#local)
  - [Local with debug](#local-with-debug)
  - [Docker and Docker Local](#docker-and-docker-local)
  - [Running individual tests](#running-individual-tests)
- [Debugging](#debugging)
  - [WebdriverIO Plugin](#webdriverio-plugin)
  - [Setup in IntelliJ/Webstorm](#setup-in-intellijwebstorm)
  - [Debug environment variable](#debug-environment-variable)
  - [WebdriverIO debug command](#webdriverio-debug-command)
- [Production](#production)
  - [Running the tests](#running-the-tests)
- [Requirements of CDP Environment Tests](#requirements-of-cdp-environment-tests)
- [Running on GitHub](#running-on-github)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

## Local Development

## Requirements

### Node.js

Please install [Node.js](http://nodejs.org/) `>= v22` and [npm](https://nodejs.org/) `>= v9`.

> [!TIP]
> To install Node.js and npm Use Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
cd cdp-portal-journey-tests
nvm use
```

### Setup

Install application dependencies:

```bash
npm install
```

## Running

There are various ways to run these tests via `npm scripts`. Easiest way to work out what they do is to look at the urls
used in the below table. Under the table there are more details on when to use the specific `npm scripts`.

| Command                     | Description                                                                                                                                                      | Use                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `npm test`                  | Run in portal against `https://cdp-portal-journey-tests.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`                                                          | In the Portal UI against specified environment                                       |
| `npm test:github`           | Run in CI against `http://cdp-portal-frontend:3000` and the cdp-portal-journey-tests docker compose                                                              | In GitHub CI against cdp-portal-journey-tests docker compose                         |
| `npm run test:local`        | Run locally against `http://localhost:3000`                                                                                                                      | Locally ran services                                                                 |
| `npm run test:local:debug`  | Run locally against `http://localhost:3000` with debug turned on                                                                                                 | Locally ran services with debug                                                      |
| `npm run test:docker`       | Run locally against `http://cdp.127.0.0.1.sslip.io:3333` cdp-local-environment docker compose setup                                                              | Against cdp-local-environment docker compose, optional with locally running services |
| `npm run test:docker:local` | Run locally against `http://cdp.127.0.0.1.sslip.io:3000` cdp-local-environment docker compose setup but with cdp-portal-frontend running locally via npm run dev | Against cdp-local-environment docker compose, with local running cdp-portal-frontend |

### Test

```bash
npm test
```

This is used in the CDP Portal to run the tests against the deployed service in a chosen environment.

### GitHub

To mimic the GitHub workflow locally. Start up the docker compose in this repository:

```bash
docker compose up --wait-timeout 300 -d --quiet-pull --force-recreate
```

Then run the following command:

```bash
npm run test:github
```

### Local

To run against portal running locally on `http://localhost:3000` or `http://cdp.127.0.0.1.sslip.io:3000`:

> Note to use a different base url, fEx cdp.127.0.0.1.sslip.io:3000 set this value to the env `BASE_URL=cdp.127.0.0.1.sslip.io:3000`

```bash
npm run test:local
```

### Local with debug

To debug a local version of the portal running on `http://localhost:3000`:

```bash
npm run test:local:debug
```

### Docker and Docker Local

To run these tests against the `docker compose` from https://github.com/DEFRA/cdp-local-environment/

> Follow the instructions in https://github.com/DEFRA/cdp-local-environment/README.md around starting the docker compose
> setup. You will also find details on how to run specific services locally if you are writing tests against local code.

Then run the following command:

```bash
npm run test:docker
```

Or if you are running `cdp-portal-frontend` locally:

```bash
npm run test:docker:local
```

### Running individual tests

```bash
npm run test:local -- --spec test/specs/deploy-service.e2e.js
```

## Debugging

### WebdriverIO Plugin

In IntelliJ and Webstorm use the [WebdriverIO Plugin](https://plugins.jetbrains.com/plugin/16147-webdriverio). This
provides full run, debug and breakpoint capabilities in your WebDriverIO tests.

### Setup in IntelliJ/Webstorm

1. Add a `WebdriverIO` configuration template
1. `Run -> Edit configurations`
1. `Edit configuration templates -> WebdriverIO`
1. Add the following values to the `WebdriverIO` configuration template:
   ![WebDriverIO configuration template](docs/webdriverio-plugin/webdriverio-configuration-template.png)
1. Add an `All tests configuration`
1. `Run -> Edit configurations`
1. `Add new configuration -> WebdriverIO`
1. `Add the values shown in the following image`:
   ![WebDriverIO all tests configuration](docs/webdriverio-plugin/all-tests.png)
1. You can now run and debug your tests in IntelliJ/Webstorm:
   ![WebDriverIO with test controls](docs/webdriverio-plugin/with-test-controls.png)

> [!NOTE]
> If you wish to run against cdp-local-environment, you will need to set the `Wdio config file` to point at `wdio.docker.conf.js` in the `WebdriverIO` configuration template:

### Debug environment variable

You can also set the following env:

> This provides debug config in the [wdio.local.conf.js](./wdio.local.conf.js) file

```bash
DEBUG=true
```

Or use the npm script:

> This script automatically sets the debug environment variable

```bash
npm run test-local:debug
```

### WebdriverIO debug command

Use the following command in code:

```javascript
await browser.debug()
```

## Production

### Running the tests

Tests are run from the CDP-Portal under the Test Suites section. Before any changes can be run, a new docker image must
be built, this will happen automatically when a pull request is merged into the `main` branch.
You can check the progress of the build under the actions section of this repository. Builds typically take around 1-2
minutes.

The results of the test run are made available in the portal.

## Requirements of CDP Environment Tests

1. Your service builds as a docker container using the `.github/workflows/publish.yml`
   The workflow tags the docker images allowing the CDP Portal to identify how the container should be run on the
   platform.
   It also ensures its published to the correct docker repository.

2. The Dockerfile's entrypoint script should return exit code of 0 if the test suite passes or 1/>0 if it fails

3. Test reports should be published to S3 using the script in `./bin/publish-tests.sh`

## Running on GitHub

Alternatively you can run the test suite as a GitHub workflow.
Test runs on GitHub are not able to connect to the CDP Test environments. Instead, they run the tests agains a version
of the services running in docker.
A docker compose `compose.yml` is included as a starting point, which includes the databases (mongodb, redis) and
infrastructure (localstack) pre-setup.

Steps:

1. Edit the compose.yml to include your services.
2. Modify the scripts in docker/scripts to pre-populate the database, if required and create any localstack resources.
3. Test the setup locally with `docker compose up` and `npm run test:github`
4. Set up the workflow trigger in `.github/workflows/journey-tests`.

By default, the provided workflow will run when triggered manually from GitHub or when triggered by another workflow.

If you want to use the repository exclusively for running docker composed based test suites consider displaying the
publish.yml workflow.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
