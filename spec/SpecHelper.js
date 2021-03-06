'use strict';

const Fieldbook = require("src/Fieldbook.js");
const Word = require("src/Word.js");

global.wordEqualityTester = function(first, second) {
  if (first instanceof Word && second instanceof Word) {
    return first.text === second.text &&
           first.learningStatus === second.learningStatus &&
           first.dataStoreId === second.dataStoreId &&
           first.occurrences.length === second.occurrences.length
           ;
  }
};

global.mockAjaxRequest = function(expectedUrl, expectedResponse) {
    const request = jasmine.Ajax.requests.mostRecent();

    request.respondWith({
      status: 200,
      responseText: expectedResponse,
    });

    expect(request.url).toEqual(expectedUrl);
    expect(request.responseText).toEqual(expectedResponse);
};

global.fakeFieldbookRecords = function(texts) {
  const records = [];
  texts.forEach(function(text) {
    records.push({id: 0, record_url: "", word: text, how_well_known: "known"})
  });
  return JSON.stringify(records);
};

global.dom = (function() {
  const elements = [];

  return {
    createElement: function(tag, attrs, ...content) {
      const element = document.createElement(tag);

      for (let attr in attrs) {
        element[attr] = attrs[attr];
      }

      if (content.length === 1 && "string" === typeof content[0]) {
        element.innerText = content[0];
      } else {
        for (let i = 0; i < content.length; i++) {
          element.appendChild(content[i]);
        }
      }

      document.body.insertBefore(element, null);
      elements.push(element);

      return element;
    },

    cleanup: function() {
      for (let i in elements) {
        const element = elements[i];
        elements.pop(element);
        element.remove();
      }
    }
  };
}());

beforeEach(function() {
  Fieldbook.BASE_URL = "http://example.com";
  jasmine.addCustomEqualityTester(wordEqualityTester);

  Word.forgetAll();

  localStorage.setItem(Fieldbook.CONFIG_BOOK, "test-fieldbook-book");
  localStorage.setItem(Fieldbook.CONFIG_KEY, "test-fieldbook-key");
  localStorage.setItem(Fieldbook.CONFIG_SECRET, "test-fieldbook-secret");

  jasmine.Ajax.install();

  jasmine.addMatchers({

    toBeEmpty: function() {
      return {
        compare: function(actualElement) {
          return {
            pass: actualElement.length === 0
          };
        }
      };
    },

    toHaveText: function() {
      return {
        compare: function(actualElement, expectedText) {
          return {
            pass: actualElement.innerText.includes(expectedText),
            message: `Expected '${expectedText}' but was '${actualElement.innerText}'`
          };
        }
      };
    },

    toHaveClass: function() {
      return {
        compare: function(actualElement, expectedClass) {
          return {
            pass: actualElement.classList.contains(expectedClass)
          };
        }
      };
    },

    toHaveStyle: function() {
      return {
        compare: function(actualElement, attribute, expectedValue) {
          const styles = window.getComputedStyle(actualElement);
          const actualValue = styles.getPropertyValue(attribute) ;
          return {
            pass: actualValue === expectedValue,
            message: `Expected ${attribute} = '${expectedValue}' but was '${actualValue}'`
          };
        }
      };
    },

    toHaveRGBCloseTo: function() {
      return {
        compare: function(actualElement, attribute, expectedRgb) {
          const styles = window.getComputedStyle(actualElement);
          const actualValue = styles.getPropertyValue(attribute) ;

          const actualRgb = /rgb\((\d+), (\d+), (\d+)\)/.exec(actualValue);
          actualRgb.shift(); // get rid of whole match at [0]

          actualRgb.every((x, i) => {
            expect(parseInt(x, 10)).toBeCloseTo(expectedRgb[i], -1);
          });

          return {
            pass: true, // would have thrown above otherwise
            message: `Expected ${attribute} to be close to '${expectedRgb}' but was '${actualRgb}'`
          };
        }
      };
    }

  });
});

afterEach(function() {
  jasmine.Ajax.uninstall();
  dom.cleanup();
});
