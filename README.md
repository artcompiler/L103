### L107

A language for writing math scorers. Uses a remote SymPy service for symbolic processing.

### Getting started

* Get, build and start the Graffiticode host app (https://github.com/graffiticode/graffiticode).
* Clone and initialize L107.
  * `$ git clone git@github.com:artcompiler/L107.git`
  * `$ cd L107`
  * `$ npm install`
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
* Build L107
  * `$ make`
* Start the compiler as a local service to make sure that all is well.
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
  * `$ make`
