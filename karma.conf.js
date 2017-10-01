module.exports = function(config) {
  config.set({
    frameworks: ["jasmine-ajax", "jasmine"],
    browsers: ["ChromeHeadless"],
    singleRun: true,

    files: [
      "src/Constants.js",
      "src/Fieldbook.js",
      "src/Language.js",
      "src/WebWords.js",
      "src/Word.js",
      "src/Page.js",
      "src/InfoBox.js",
      "spec/SpecHelper.js",
      "spec/*Spec.js",
    ],

    reporters: ["spec", "coverage"],

    preprocessors: {
      "**/src/*.js": "coverage"
    },

    coverageReporter: {
      type: "lcov",
      dir: "spec/coverage/",
    },

    customLaunchers: {
      Chrome_travis_ci: {
        base: "Chrome",
        flags: ["--no-sandbox"]
      }
    },
  });

  if (process.env.TRAVIS) {
    config.browsers = ["Chrome_travis_ci"];
  }
}