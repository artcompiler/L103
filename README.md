### L107

A language for writing math scorers. Uses a remote SymPy service (https://github.com/artcompiler/sympy-service) for symbolic processing.

### Getting started

* Get, build and start the Graffiticode host app (https://github.com/graffiticode/graffiticode).
* Get, build and start the Graffiticode API (https://github.com/graffiticode/api).
* Clone and initialize L107.
  * `$ git clone git@github.com:artcompiler/L107.git`
  * `$ cd L107`
  * `$ npm i`
* Get mathcore and translatex (see below)
* Build L107
  * `$ npm run build`
* Start the compiler as a local service to make sure that all is well.
  * `$ npm start`
  * Visit your local GC server (e.g. http://localhost:3000/lang?id=107) to test.
  * Paste into the code view: `rubric [ symbolic "1+2" ] in [ "3" ]..`
  * See https://www.graffiticode.com/form?id=y5vHZqdQc0 in the form view.

### Getting mathcore and translatex

* Clone mathcore (while in the L107 root directory.)
  * `$ git clone git@github.com:artcompiler/mathcore.git`
  * `$ cd mathcore`
  * `$ git checkout L107`
  * `$ npm i`
* Clone translatex (while still in the L107/mathcore directory.)
  * `$ git clone git@github.com:artcompiler/translatex.git`
  * `$ cd translatex`
  * `$ npm i`
  * `$ cd ../..`
* Build and start the compiler as a local service to make sure that all is well.
  * `$ make`
  * Visit your local GC server (e.g. http://localhost:3000/lang?id=107) to test.
  * Paste into the code view: `rubric [ symbolic "1+2" ] in [ "3" ]..`
  * See https://www.graffiticode.com/form?id=y5vHZqdQc0 in the form view.

### Refreshing local mathcore with remote commits

* See local changes you've made.
  * `$ cd ./L107/mathcore`
  * `$ git branch` (You should see a list of branches with `* L107` in it.)
  * `$ git diff` (You should see any changes you made.)
* If you want to keep those changes, then commit them:
  * `$ git commit -am "this is a comment describing what has changed."`
* Else if you don't want to keep those changes, then checkout the last good version:
  * `$ git checkout .
* Pull and build the latest commits from the remote repo:
  * `$ git pull origin L107`
  * `$ make`
  
### Refreshing local translatex with remote commits

* See local changes you've made.
  * `$ cd ./L107/mathcore/translatex`
  * `$ git branch` (You should see a list of branches with `* master` in it.)
  * `$ git diff` (You should see any changes you made.)
* If you want to keep those changes, then commit them:
  * `$ git commit -am "this is a comment describing what has changed."`
* Else if you don't want to keep those changes, then checkout the last good version:
  * `$ git checkout .
* Pull and build the latest commits from the remote repo:
  * `$ git pull origin master`
  * `$ make`

### Running automated tests against a remote deployment

* Open a new terminal window and cd to ./L107
* Make sure that in ./tools/test.js that TEST_GATEWAY is pointing to your local instance of Graffiticode
  * E.g. `const TEST_GATEWAY = 'https://gc.acx.ac/';`
* To run all tests: `$ make test`

### Using a local instance of SymPy service (https://github.com/artcompiler/sympy-service) for symbolic processing.

* `$ cd ./L107` (Traverse to the root dir of L107)
* `$ export ARTCOMPILER_CONFIG=config-local.json` (Point to the config file for running L107 with local sympy service)
* Start the local instance of SymPy service
* Verify that the port number aligns with the port number in `config-local.json`
* `$ make` (Start L107)
* You should be good to go!
