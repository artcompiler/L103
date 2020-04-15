### L107

A language for writing math scorers. Uses a remote SymPy service (https://github.com/artcompiler/sympy-service) for symbolic processing.

### Getting started

* Get, build and start the Graffiticode host app (https://github.com/graffiticode/graffiticode).
* Get, build and start the Graffiticode API (https://github.com/graffiticode/api).
* Clone and initialize L107.
  * `$ git clone git@github.com:artcompiler/L107.git`
  * `$ cd L107`
  * `$ npm install`
* Build L107
  * `$ npm run build`
* Start the compiler as a local service to make sure that all is well.
  * `$ npm start`
  * Visit your local GC server (e.g. http://localhost:3000/lang?id=107) to test.
  * Paste into the code view: `rubric [ symbolic "1+2" ] in [ "3" ]..`
  * See https://www.graffiticode.com/form?id=y5vHZqdQc0 in the form view.

### Getting and rebuilding mathcore and latexsympy

* Clone and build mathcore (while in the L107 root directory.)
  * `$ git clone git@github.com:artcompiler/mathcore.git`
  * `$ cd mathcore`
  * `$ git checkout L107`
  * `$ npm install`
  * `$ make`
  * `$ cd ..`
* Clone and build latexsympy (while in the L107 root directory.)
  * `$ git clone git@github.com:artcompiler/latexsympy.git`
  * `$ cd latexsympy`
  * `$ npm install`
  * `$ make`
  * `$ cd ..`
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
  * `$ make dev`
  
### Refreshing local latexsympy with remote commits

* See local changes you've made.
  * `$ cd ./L107/latexsympy`
  * `$ git branch` (You should see a list of branches with `* master` in it.)
  * `$ git diff` (You should see any changes you made.)
* If you want to keep those changes, then commit them:
  * `$ git commit -am "this is a comment describing what has changed."`
* Else if you don't want to keep those changes, then checkout the last good version:
  * `$ git checkout .
* Pull and build the latest commits from the remote repo:
  * `$ git pull origin master`
  * `$ make dev`

### Running automated tests against a remote deployment

* Get the Graffiticode host app (https://github.com/graffiticode/graffiticode)
* Set the environment variable `DATABASE_URL` to
`postgres://ucuhs5vbv75b95:p678afd5db29e2af04cbeceeef42a3161d402176e31fc245378c0aa9ac7f75d71@ec2-3-212-48-221.compute-1.amazonaws.com:5432/d30jtcnfqhdl65`
* Set the environment variable `API_HOST` to the URL of a remote API gateway that supports L107
* Set the environment variable `LOCAL_COMPILES` to false
* Build and run Graffiticode
* Open a new terminal window and cd to ./L107
* Make sure that in ./tools/test.js that TEST_GATEWAY is pointing to your local instance of Graffiticode. E.g.
  `const TEST_GATEWAY = 'http://localhost:3000/';`
* To verify that everything is set up: `$ make smoke`
* To run all tests: `$ make test`



