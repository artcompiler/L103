import fs from 'fs';
import {execSync} from 'child_process';

// Current best rule sets
const latexRulesID = "epLtg4YeVh5";
const sympyRulesID = 'Kz8tV5Rd4FN';
const debug = true;
function rmdir(path) {
  try { var files = fs.readdirSync(path); }
  catch(e) { return; }
  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      var filePath = path + '/' + files[i];
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        rmdir(filePath);
      }
    }
  }
  fs.rmdirSync(path);
}

function mkdir(path) {
  fs.mkdirSync(path);
}

function cldir(path) {
  rmdir(path);
  mkdir(path);
}

function exec(cmd, args) {
  return execSync(cmd, args);
}

function clean() {
  console.log("Cleaning...");
  cldir("./pub");
  cldir("./build");
  cldir("./dist");
}

function compile() {
  console.log("Compiling...");
  if (process.argv.includes("--dev")) {
    exec("cp ./mathcore/dist/mathcore.js ./src/");
  }
}

function bundle() {
  console.log("Bundling...");
  exec("npx webpack --config ./webpack.config.js");
  let sha = exec("git rev-parse HEAD | cut -c 1-7").toString().replace("\n", "");
  exec("cat ./tools/license.js | sed 's/{{sha}}/" + sha + "/' >> ./dist/compile.js");
  exec("cp ./src/lexicon.js ./pub");
  exec("cp ./src/style.css ./pub");
  exec("cp ./dist/viewer.js ./pub");
}

function rules() {
  console.log("Fetching latex to latex rules " + latexRulesID);
  exec('curl -L "https://gc.acx.ac/data?id=' + latexRulesID + '" -o "./data.txt"');
  var data = JSON.parse(fs.readFileSync("./data.txt", "utf8"));
  delete data.options.data; // Cleanup
  fs.writeFileSync("src/latexRules.js", "export var latexRules=" + JSON.stringify(data.options), "utf8");

  console.log("Fetching latex to sympy rules " + sympyRulesID);
  exec('curl -L "https://gc.acx.ac/data?id=' + sympyRulesID + '" -o "./data.txt"');
  var data = JSON.parse(fs.readFileSync("./data.txt", "utf8"));
  delete data.options.data; // Cleanup
  fs.writeFileSync("src/sympyRules.js", "export var sympyRules=" + JSON.stringify(data.options), "utf8");
}

function build(debug) {
  let t0 = Date.now();
  clean();
  rules();
  compile();
  bundle(debug);
  console.log("Build completed in " + (Date.now() - t0) + " ms");
}

function prebuild() {
  const commit = String(exec('git rev-parse HEAD')).trim().slice(0, 7);
  const build = {
    'name': 'L107',
    'commit': commit,
  };
  fs.writeFile('build.json', JSON.stringify(build, null, 2), () => {});
}

build();
