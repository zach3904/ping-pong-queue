# Porch Ping Pong Queue

Game queue with matchmaking and stat tracking

## Getting Started

Update your shell to put node_modules/.bin into your path

    export PATH=$PATH:~/src/ping-pong-queue/node_modules/.bin

    npm install
    nodemon

## Running Locally

In the command line, navigate to the root folder "ping-pong-queue".

Run command "node server/bin/ping-pong-queue".

Go to URL http://127.0.0.1:9394.

## Code Layout

* server - NodeJS server side only code
  * bin/hm-internal-tools - main entry point for the server
* www - Static client side only assets
* www/common - JavaScript used from either the server side or client side

## Managing NodeJS Dependencies

Use `npm` to install new packages or update existing packages.

Any NodeJS code that is needed in production or to run automated tests,
should be **committed into git** under the node_modules directory.

### Binaries

Do not commit binary artifacts, such as object code from a C library.

### Developer Tools

Do not commit developer only tools, such as `nodemon`.

Do add them to package.json under `devDependencies`.

Do add them to .gitignore

Example:

    npm install --save-dev jspm

    # added to .gitignore
    node_modules/jspm/

## Managing Web Dependencies

Use `jspm` to install new JavaScript modules or update existing modules.

    jspm install