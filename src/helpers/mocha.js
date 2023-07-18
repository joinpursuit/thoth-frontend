let Mocha = window.Mocha;
let chai = window.chai;

function runMochaTestsFromString(functionString, testString) {
  // Prepare Mocha
  window.mocha.setup('bdd');

  // Combine function definitions with the test string
  const combinedCode = functionString + testString;

  // Evaluate the combined code using new Function()
  new Function('describe', 'it', 'beforeEach', 'assert', combinedCode)(describe, it, beforeEach, chai.assert);

  // Run the tests
  const runner = window.mocha.run();

  runner.on("end", function() {
    console.log(runner);
  });
}


export default runMochaTestsFromString;