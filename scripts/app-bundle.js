define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('modalCustomElement',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ModalCustomElement = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ModalCustomElement = exports.ModalCustomElement = (_dec = (0, _aureliaFramework.inject)(Element), _dec(_class = function () {
    function ModalCustomElement(el) {
      _classCallCheck(this, ModalCustomElement);

      this.visible = false;

      this.el = el;
    }

    ModalCustomElement.prototype.attached = function attached() {
      this.visible = false;
    };

    ModalCustomElement.prototype.open = function open() {
      this.visible = true;
      console.log("Modal opened");
    };

    ModalCustomElement.prototype.close = function close() {
      this.visible = false;

      this.el.dispatchEvent(new CustomEvent('closed', { bubbles: true }));
    };

    ModalCustomElement.prototype.cancel = function cancel() {
      this.visible = false;
    };

    return ModalCustomElement;
  }()) || _class);
});
define('text!modalCustomElement.html', ['module'], function(module) { module.exports = "<!-- Always decorate your custom element template tag with a class, preferably\r\n  matching the name of your custom element. This will allow you to write\r\n  robust css that plays well with the as-element attribute, e.g. <form as-element=\"modal\">. -->\r\n<template class=\"modal ${visible ? 'visible' : ''}\">\r\n\r\n\r\n  <!-- I want my modal to have a \"greyed out\" background, so I need to have a \r\n    box in my modal that will contain the modal dialog box content. -->\r\n  <div class=\"modal-content\">\r\n\r\n    <!-- I also might want to add an optional header element. Since I want it\r\n      to be optional, I will probably be using the \":empty\" selector, so I need\r\n      to make sure there is no whitespace in the element. I give it a slot and\r\n      call the slot \"header\". -->\r\n    <div class=\"modal-header\"><slot name=\"header\"></slot></div>\r\n\r\n    <!-- Next I have the main body of the modal. It contains the default slot. -->\r\n    <div class=\"modal-body\">\r\n      <slot></slot>\r\n    </div>\r\n\r\n    <!-- Finally, I want to include an optional footer element. Every modal\r\n      should probably have this footer element, but almost every modal is going\r\n      to have the same content in the footer, so I add an optional slot \"footer\"\r\n      with default content. The default action will be to close the modal. -->\r\n    <!--<div class=\"modal-footer\">\r\n      <slot name=\"footer\">\r\n        <button click.delegate=\"close()\">Close</button>\r\n      </slot>\r\n    </div>-->\r\n  </div>\r\n</template>"; });
define('text!modalCustomElement.css', ['module'], function(module) { module.exports = "// This is the outer container of the modal. Its default view shoud be a full screen element \r\n\r\n.modal { \r\n  position: fixed;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  width:100%;\r\n  height:100%;\r\n  max-height:600px;\r\n  overflow-y:auto;\r\n\r\n  background: white;\r\n  font-family:Arial;\r\n  padding:10pt;\r\n\r\n  display:flex;\r\n  flex-direction:column;\r\n  justify-content:center;\r\n  align-items:center;\r\n  font-family:Arial;\r\n  transform:scale(0,0);\r\n  transition: background 250ms ease-in-out;\r\n\r\n}\r\n.visible {\r\n    display:flex;\r\n  }\r\n\r\n\r\n"; });
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');


    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('aurelia-cookie',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var AureliaCookie = function () {
        function AureliaCookie() {}

        AureliaCookie.get = function (name) {
            var cookies = this.all();
            if (cookies && cookies[name]) {
                return cookies[name];
            }
            return null;
        };

        AureliaCookie.set = function (name, value, options) {
            var str = this.encode(name) + "=" + this.encode(value);
            if (value === null) {
                options.expiry = -1;
            }

            if (options.expiry >= 0 && !options.expires) {
                var expires = new Date();
                expires.setHours(expires.getHours() + options.expiry);
                options.expires = expires;
            }
            if (options.path) {
                str += "; path=" + options.path;
            }
            if (options.domain) {
                str += "; domain=" + options.domain;
            }
            if (options.expires) {
                str += "; expires=" + options.expires.toUTCString();
            }
            if (options.secure) {
                str += '; secure';
            }
            document.cookie = str;
        };

        AureliaCookie.delete = function (name, domain, path) {
            var cookieString = name + " =;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            if (domain) {
                cookieString += "; domain=" + domain;
            }
            if (path) {
                cookieString += "; path=" + path;
            }
            document.cookie = cookieString;
        };

        AureliaCookie.all = function () {
            return this.parse(document.cookie);
        };
        AureliaCookie.parse = function (str) {
            var obj = {};
            var pairs = str.split(/ *; */);
            var pair;
            if (pairs[0] === '') {
                return obj;
            }
            for (var i = 0; i < pairs.length; ++i) {
                pair = pairs[i].split('=');
                obj[this.decode(pair[0])] = this.decode(pair[1]);
            }
            return obj;
        };
        AureliaCookie.encode = function (value) {
            try {
                return encodeURIComponent(value);
            } catch (e) {
                return null;
            }
        };
        AureliaCookie.decode = function (value) {
            try {
                return decodeURIComponent(value);
            } catch (e) {
                return null;
            }
        };
        return AureliaCookie;
    }();
    exports.AureliaCookie = AureliaCookie;
});
define('app',['exports', 'aurelia-router', 'aurelia-cookie'], function (exports, _aureliaRouter, _aureliaCookie) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      var _this = this;

      _classCallCheck(this, App);

      window.app = this;
      this.params = this.getQueryParams() || {};
      this.oldConfiguration = "";
      this.theme = "blue";
      this.topBannerMessage = '<img src="http://cognitiveworlds.com/lib/getImage.sjs?path=/images/image/_TheCagleReportBanner.jpeg" class="topBannerImage"/>';
      this.defaultPage = "publisher:_CognitiveWorld";
      this.defaultIcon = "/lib/getImage.sjs?path=/images/image/_DefaultImage.jpeg";
      this.missingImage = "/lib/getImage.sjs?path=/images/image/_DefaultImage.jpeg";
      this.defaultLabel = "GraCIE";
      this.footer = '<div class="copyright">Copyright 2019 Semantical LLC.</div>';
      this.widgets = { output: ['Loading ...'] };
      this.activeCSS = "";
      this.context = this.params.context || this.defaultPage;
      this.showProperties = true;
      this.linksContent = "Placeholder";
      this.preferredPredicate = "rdf:type";
      this.qRefine = this.params.qr || "";
      this.cache = this.params.cache || "cached";
      this.q = this.params.q || "";
      this.qGraph = "";
      this.activeGraph = "";
      this.backupGraph = null;
      this.searchData = {};
      this.history = [];
      this.mode = this.params.mode || "card";
      this.showAdvancedListOptions = true;
      this.showMenu = false;

      this.sortMode = "sortMode:_ModifiedDateDesc";
      this.sortModeStates = [{ label: "Created Date Descending", value: "sortMode:_CreatedDateDesc" }, { label: "Modified Date Descending", value: "sortMode:_ModifiedDateDesc" }, { label: "Created Date Ascending", value: "sortMode:_CreatedDateAsc" }, { label: "Modified Date Ascending", value: "sortMode:_ModifiedDateAsc" }, { label: "Alphanumeric Ascending", value: "sortMode:_AlphaAsc" }, { label: "Alphanumeric Descending", value: "sortMode:_AlphaDesc" }, { label: "Internal Order Ascending", value: "sortMode:_OrdinalAsc" }, { label: "Internal Order Descending", value: "sortMode:_OrdinalDesc" }];
      this.namespace = '';
      this.activeLinkPredicate = null;
      this.visibleLinks = [];
      var cookieLogin = JSON.parse(_aureliaCookie.AureliaCookie.get("login"));
      console.log(cookieLogin);
      this.loginData = cookieLogin ? cookieLogin : { username: "", password: "", permissions: [], status: false, action: "login" };
      this.userRole = new Set(this.loginData.permissions);
      this.page = 1;
      this.pageSize = 20;
      this.itemCount = 0;
      this.totalPages = 1;
      this.wait = false;
      this.templates = {};
      this.server = ("" + document.location.href).match(/\:\/\/localhost/) ? "http://3.84.16.9:8020" : "";
      this.client = document.location.href.match(/\:\/\/localhost/) ? "" : "";
      this.cardEdit = false;
      this.editMode = "view";
      this.tempGraph = null;
      this.blocks = [];
      this.loadBlocks();
      this.typedMessage = '';
      this.insertTermObj = { label: "", value: "", temp: "", asImage: false, image: "" };
      this.complianceItem = { country: "", industry: "", strain: "", enzyme: "", product: "", complianceTest: "",
        noItemsMessage: '<div><p>No Compliance Tests Exist for this combination.</p><p>While this cannot guarantee that there are no compliance requirements,\n      it does mean that Dupont has not yet developed a compliance test for this contingency, so you should check with regulatory compliance guidelines.</p></div>' };
      this.instanceList = {};
      this.instanceList['class:_Class'] = {};
      this.instanceList['class:_Class']['rdf:type'] = [];
      this.constraints = [];
      this.activeConstraint = { predicate: '', object: '' };
      this.availableProperties = [];
      this.pageIndex = 0;
      this.activeProperty = {};
      this.currentPath = "";
      this.selectedProperty = null;
      this.activePropertyValues = [];
      this.activePredicates = [];
      this.availableTemplates = [];
      var hash = window.location.hash.substr(1);
      this.hash = this.mode || hash || "card";
      console.log(this.hash);

      this.newModal;
      this.duplicateModal;
      this.addPropertyModal;
      this.addConstraintModal;
      this.editImageModal;
      this.insertTermModal;
      this.loginModal;
      this.userValidated = false;
      this.editImage = {
        src: "",
        width: "500px",
        height: "300px",
        alt: "",
        title: "",
        align: "float:left"
      };

      this.classAction = "classAction:_View";
      this.activeClass = "";
      this.defaultCard = { title: "New Card", body: "This is a new card.", image: "", curie: "foo:bar", prefix: "", ns: "", datatype: "", nodeKind: "",
        domain: "", range: "", cardinality: "", sourceCurie: "", externalURL: "", template: "", activePredicate: "", target: "", filename: "", username: "", password: "", graph: "", predicateEntries: [] };
      this.defaultNamespace = "http://semantical.llc/ns/";
      this.activeCard = Object.assign(this.defaultCard, {});
      this.linkPropertyList = {};
      this.activeLinksData = { count: 0, data: [], page: 1, pageSize: 20, numPages: 1 };
      this.displayFullBody = false;

      setTimeout(function () {
        _this.refreshApp();
      }, 50);
    }

    App.prototype.refreshApp = function refreshApp() {
      this.updateClassNamespace();
      this.updateConfiguration();
      this.updateInstanceList('class:_Graph');
      this.updateInstanceList('class:_Class');

      this.updateInstanceList('class:_Cardinality');
      this.updateInstanceList('class:_XSD');
      this.loadMenu('menuItem:_MainMenu', '.mainMenu');
    };

    App.prototype.showTypedMessage = function showTypedMessage() {
      alert(this.typedMessage);
    };

    App.prototype.activateClass = function activateClass(activeClass, classAction) {
      console.log(activeClass, classAction);
      switch (classAction) {
        case "classAction:_View":
          this.fetchContext(activeClass);break;
        case "classAction:_New":
          this.newCard(activeClass);break;
      }
    };

    App.prototype.selectGraph = function selectGraph() {
      var graph = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.activeGraph;

      this.activeGraph = graph;
      this.updateInstanceList('class:_Class');
    };

    App.prototype.invokeAction = function invokeAction() {
      var _this2 = this;

      this.globalActions.find(function (action) {
        return action.id === _this2.selectedClass;
      }).action();
    };

    App.prototype.fetchContext = function fetchContext(context) {
      var _this3 = this;

      var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "card";
      var dataOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { qRefine: '', noPush: false };

      if (this.cardEdit) {
        alert("You are currently in edit mode. You must save or revert changes first.");
        return;
      }
      var body = this.constraints;
      var options = { method: 'POST',
        body: JSON.stringify(body, null, 4),
        mode: 'cors',
        cache: 'default' };
      this.wait = true;

      window.fetch(this.server + '/lib/server.sjs?context=' + context + '&cache=' + this.cache + '&uid=' + this.loginData.uid, options).then(function (blob) {
        return blob.json();
      }).then(function (json) {

        _this3.selectedClass = "";
        _this3.contextData = json;
        _this3.ns = json["@context"];
        _this3.widgets = json.content;
        _this3.g = json["graph"];
        _this3.report = _this3.g["report:_"];
        if (!options.noPush) {
          _this3.history.push(_this3.context);
        }
        _this3.context = _this3.report['report:hasContext'][0].value;
        window.history.pushState({ context: context }, _this3.g[context]['term:prefLabel'][0].value, '/?context=' + context);

        _this3.namespace = _this3.ciri(context);

        _this3.predicates = json.predicates;
        _this3.linkPredicates = json.linkPredicates;

        _this3.links = _this3.report['report:hasLink'] ? _this3.report['report:hasLink'].filter(function (link) {
          return link.value != null;
        }).map(function (link) {
          return link.value;
        }) : [];
        _this3.page = 1;
        _this3.preferredPredicate = _this3.g[context].hasOwnProperty('term:hasPreferredProperty') ? _this3.g[context]['term:hasPreferredProperty'][0].value : null;
        _this3.sort();

        console.log(tabIndex);
        console.log(_this3.predicates);
        _this3.activePredicates = _this3.linkPredicates;
        var tabIndex = _this3.activePredicates.map(function (predicate) {
          return predicate.curie;
        }).includes('rdf:type') ? _this3.activePredicates.map(function (predicate) {
          return predicate.curie;
        }).indexOf('rdf:type') : 0;
        console.log("Active Predicates:", _this3.activePredicates);
        var predicate = _this3.preferredPredicate ? _this3.preferredPredicate : _this3.activePredicates.length > 0 ? _this3.activePredicates[tabIndex].curie : 'rdf:type';

        setTimeout(function () {
          _this3.activateTab();
          _this3.qRefine = dataOptions.qRefine || "";
          _this3.q = "";
          _this3.reversed = false;
          _this3.wait = false;
          _this3.mode = hash;

          _this3.refreshBlocks();
          _this3.validateUserContext();
        }, 500);
      }).catch(function (err) {
        console.log("Error");
        if (!_this3.g.hasOwnProperty('report:_')) {
          _this3.fetchContext('page:_404_TermNotFound', 'card');
        } else {
          console.log(err);
          _this3.wait = false;
        }
      });
    };

    App.prototype.filterListPredicates = function filterListPredicates(predicates) {
      var termList = ['rdfs:domain', 'rdfs:range'];
      return predicates != null ? predicates.filter(function (predicate) {
        return !termList.includes(predicate.curie);
      }) : [];
    };

    App.prototype.fetchSearch = function fetchSearch() {
      var _this4 = this;

      if (this.cardEdit) {
        alert("You are currently in edit mode. You must save or revert changes first.");
        return;
      }

      if (this.q != "") {
        var options = { method: 'GET',
          mode: 'cors',
          cache: 'default' };
        window.fetch(this.server + '/lib/search.sjs?q=' + this.q, options).then(function (blob) {
          return blob.json();
        }).then(function (json) {
          _this4.mode = 'search';
          _this4.searchData = json;
        }).catch(function (err) {
          return console.log(err);
        });
      }
    };

    App.prototype.inputSearch = function inputSearch() {
      var _this5 = this;

      if (this.q != "") {
        var options = { method: 'GET',
          mode: 'cors',
          cache: 'default' };
        window.fetch(this.server + '/lib/search.sjs?q=' + this.q, options).then(function (blob) {
          return blob.json();
        }).then(function (json) {
          _this5.searchData = json;
          console.log(_this5.searchData);
        }).catch(function (err) {
          return console.log(err);
        });
      }
    };

    App.prototype.keys = function keys(obj) {
      var excludes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      console.log("***** Keys");
      var excludeSet = new Set(excludes);
      var keysObj = [];
      for (var key in obj) {
        if (!excludeSet.has(key)) {
          keysObj.push(key);
        }
      }

      return keysObj.sort();
    };

    App.prototype.ciri = function ciri(expr) {
      var _expr$split = expr.split(":"),
          prefix = _expr$split[0],
          local = _expr$split[1];

      return '' + this.contextData['@context'][prefix] + local;
    };

    App.prototype.activateTab = function activateTab(predicate) {
      var resetPage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var _this6 = this;

      var noPush = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      if (options.predicate != null) {
        predicate = options.predicate;
      }
      this.activeLinkPredicate = predicate ? predicate : this.activePredicates.length > 0 ? this.activePredicates[0].curie : "";
      this.activeLinkPredicate = this.activeLinkPredicate != '' ? this.activeLinkPredicate : this.g[this.context]['rdf:type'][0].value === 'class:_Class' ? "rdf:type" : "";

      var sortMode = this.g[this.context].hasOwnProperty('class:isClassWithPreferredSortMode') ? this.g[this.context]['class:isClassWithPreferredSortMode'][0].value : this.sortMode;

      this.sortMode = sortMode;
      var path = this.server + '/lib/links.sjs?context=' + this.context + '&predicate=' + this.activeLinkPredicate + '&q=' + this.qRefine + '&page=' + this.page;
      path += '&pageSize=' + this.pageSize + '&sort=' + (this.sortMode || options.sortMode);
      if (this.constraints.length > 0) {
        var constraintString = this.constraints.map(function (constraint) {
          return constraint.predicate + '|' + constraint.value;
        }).join(';');
        path += '&constraints=' + constraintString;
      }
      this.currentPath = path;
      window.fetch(path).then(function (response) {
        return response.json();
      }).then(function (json) {
        _this6.activeLinksData = json;
        _this6.linksContent = json.content.content || "";

        _this6.page = json.page;
        if (resetPage) {
          _this6.page = 1;
        }
        _this6.totalPages = json.numPages;
      });
    };

    App.prototype.prevRefPage = function prevRefPage() {
      if (this.page > this.totalPages) {
        this.page = this.totalPages;
      } else {
        this.page = this.page > 1 ? this.page - 1 : 1;
      }
      this.activateTab(this.activeLinkPredicate, false);
    };

    App.prototype.nextRefPage = function nextRefPage() {
      if (this.page > this.totalPages) {
        this.page = this.totalPages;
      } else {
        this.page = this.page < this.totalPages ? this.page + 1 : this.totalPages;
      }
      this.activateTab(this.activeLinkPredicate, false);
    };

    App.prototype.setPage = function setPage(page) {
      this.page = page;
      this.activateTab(this.activeLinkPredicate, false);
    };

    App.prototype.sort = function sort() {
      var _this7 = this;

      this.activateTab(this.activeLinkPredicate, false);
      return null;
      console.log(this.sortMode);
      var sortValue = void 0;

      this.links.forEach(function (link) {
        _this7.g[link].link = link;
      });
      var linkNodes = this.links.map(function (link) {
        return _this7.g[link];
      });

      if (linkNodes.length > 1) {
        if (this.sortMode === "sortMode:_AlphaAsc") {
          sortValue = function sortValue(a) {
            var item = a["term:prefLabel"][0].value.trim();
            return item;
          };
          linkNodes.sort(function (a, b) {
            return sortValue(a) <= sortValue(b) ? -1 : 1;
          });
        }
        if (this.sortMode === "sortMode:_AlphaDesc") {
          sortValue = function sortValue(a) {
            var item = a["term:prefLabel"][0].value.trim();
            return item;
          };
          linkNodes.sort(function (a, b) {
            return sortValue(a) <= sortValue(b) ? 1 : -1;
          });
        }
        if (this.sortMode === "sortMode:_CreatedDateDesc") {
          sortValue = function sortValue(a) {
            return a.hasOwnProperty('term:hasCreatedDate') ? '' + a["term:hasCreatedDate"][0].value : "";
          };
          linkNodes.sort(function (a, b) {
            return sortValue(a) <= sortValue(b) ? 1 : -1;
          });
        }
        if (this.sortMode === "sortMode:_CreatedDateAsc") {
          sortValue = function sortValue(a) {
            return a.hasOwnProperty('term:hasCreatedDate') ? '' + a["term:hasCreatedDate"][0].value : "";
          };
          linkNodes.sort(function (a, b) {
            return sortValue(a) <= sortValue(b) ? -1 : 1;
          });
        }
        if (this.sortMode === "sortMode:_ModifiedDateAsc") {
          sortValue = function sortValue(a) {
            return a.hasOwnProperty('term:hasLastModifiedDate') ? '' + a["term:hasLastModifiedDate"][0].value : "";
          };
          linkNodes.sort(function (a, b) {
            return sortValue(a) <= sortValue(b) ? -1 : 1;
          });
        }
        if (this.sortMode === "sortMode:_OrdinalAsc") {
          sortValue = function sortValue(a) {
            return a.hasOwnProperty('term:hasOrder') ? parseInt(a["term:hasOrder"][0].value) : 0;
          };
          linkNodes.sort(function (a, b) {
            return sortValue(a) <= sortValue(b) ? -1 : 1;
          });
        }
        if (this.sortMode === "sortMode:_OrdinalDesc") {
          sortValue = function sortValue(a) {
            return a.hasOwnProperty('term:hasOrder') ? parseInt(a["term:hasOrder"][0].value) : 0;
          };
          linkNodes.sort(function (a, b) {
            return sortValue(a) <= sortValue(b) ? 1 : -1;
          });
        }
      }

      this.links = linkNodes.map(function (node) {
        return node.link;
      });
      this.activateTab(this.activeLinkPredicate);
    };

    App.prototype.getQueryParams = function getQueryParams() {
      var url = window.document.location.href;
      var queryStr = url.split("?")[1];
      var params = {};
      if (queryStr != null) {
        var paramStrs = queryStr.split("&");
        paramStrs.forEach(function (paramStr) {
          var paramTerms = paramStr.split("=");
          var paramName = paramTerms[0];
          var paramValue = paramTerms.slice(1).join("=");
          params[paramName] = paramValue;
        });
        return params;
      }
    };

    App.prototype.displayLiteral = function displayLiteral(item) {
      if (!item) {
        return "";
      }
      var datatype = item.datatype || "xsd:string";
      switch (datatype) {
        case 'xsd:currency_usd':
          {
            return parseFloat(item.value).toLocaleString(["en-us"], { style: "currency", currency: "USD" }) + ' USD';
          };
        case 'xsd:currency_eur':
          {
            return '' + parseFloat(item.value).toLocaleString(["en-us"], { style: "currency", currency: "EUR" });
          };
        case 'xsd:integer':
          {
            return parseInt(item.value).toLocaleString(["en-us"], { style: "decimal", maximumFractionDigits: 0 });
          };
        case 'xsd:float':
          {
            return parseFloat(item.value).toLocaleString(["en-us"], { style: "decimal", maximumFractionDigits: 4 });
          };
        case 'unit:_MilesPerGallon':
          {
            return parseInt(item.value) + ' mpg';
          };
        case 'unit:_Mile':
          {
            return parseInt(item.value).toLocaleString(["en-us"], { style: "decimal", maximumFractionDigits: 1 }) + ' miles';
          };

        case "xsd:dateTime":
          {
            return item.value;
          };
        case "xsd:date":
          {
            return item.value;
          };
        case "termType:_Image":
          return '<a href="' + item.value + '" target="_blank"><img src="' + item.value + '" class="imageThumbnail"/></a>';
        case "xsd:textLiteral":
          return '<pre>' + item.value + '</pre>';
        case "xsd:imageURL":
          return '<div class="internalImageContainer"><a href="' + item.value + '" target="_blank"><img src="' + item.value + '" class="link internalImage"/></a></div>';
        case "xsd:fileURL":
          return '<div class="internalFileContainer"><a href="' + item.value + '" target="_blank">' + item.value + '</a></div>';
        case "xsd:hexColor":
          return '<div class="colorSwatchContainer">\n          <div class="colorSwatch" style="background-color:' + item.value + '">&nbsp;</div>\n          <div class="colorValue">' + item.value + '</div>\n          </div>';
        case "xsd:curie":
          return '<span class="curie">' + item.value + '</span>';
        case "xsd:anyURI":
          return '<a href="' + item.value + '" target="_blank" class="link">' + item.value.replace(/(http.+?\/\/)(.+?\/).*/, '$1$2...') + '</a>';
        case "xsd:anyURL":
          return '<a href="https://' + item.value + '" target="_blank" class="link">' + item.value.replace(/(http.+?\/\/)(.+?\/).*/, '$1$2...') + '</a>';
        case "identifier:_Email":
          return '<a href="mailto:' + item.value + '" target="_blank" class="emailLink"><span>' + item.value + '</span></a>';
        case "xsd:hours":
          {
            var lines = item.value.split('|');
            var entries = lines.map(function (line) {
              if (line != '') {
                var _line$replace$split = line.replace(/(.+?)\:(.+?)/, "$1#$2").split("#"),
                    day = _line$replace$split[0],
                    time = _line$replace$split[1];

                day = day.trim();
                time = time.trim();
                return '<div class="item"><div class="label">' + day + '</div><div class="value">' + time + '</div></div>';
              } else {
                return '';
              }
            });
            return '<div class="hours">' + entries.join('') + '</div>';
          };
        default:
          {
            return '' + item.value;
          };
      }
    };

    App.prototype.launchService = function launchService() {
      window.open(this.server + '/lib/server.sjs?context=' + this.context, '');
    };

    App.prototype.launchSeo = function launchSeo() {
      window.open(this.server + '/lib/seo.sjs?context=' + this.context, '');
    };

    App.prototype.pinPage = function pinPage() {
      var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "card";

      window.location.href = this.client + '/?context=' + this.context + (refresh ? '&cache=refresh&mode=' + this.mode : '');
    };

    App.prototype.launchPage = function launchPage() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.context;
      var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.mode;

      window.open(this.client + '/?context=' + context + '&cache=refresh&mode=' + mode);
    };

    App.prototype.launchURL = function launchURL(url) {
      window.open(url);
    };

    App.prototype.goBack = function goBack() {
      window.history.back();
    };

    App.prototype.goForward = function goForward() {
      window.history.back();
    };

    App.prototype.wrapArray = function wrapArray(arr) {
      var wrappedArray = Array.isArray(arr) ? arr : arr != null ? [arr] : [];
      if (wrappedArray.length > 0) {
        if (wrappedArray[0].type === 'uri') {
          wrappedArray.sort(function (a, b) {
            return a.value > b.value ? 1 : a.value < b.value ? -1 : 0;
          });
        }
      }
      return wrappedArray;
    };

    App.prototype.tokenize = function tokenize(str) {
      var tokenCase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "title";

      var tokens = str.split(/\s+/);
      var expr = tokens.map(function (token) {
        return '' + token.substr(0, 1).toUpperCase() + token.substr(1);
      }).join('');
      expr = expr.replace(/[^A-z0-9_\-]/gi, '');
      if (tokenCase === "camel") {
        return '' + expr.substr(0, 1).toLowerCase() + expr.substr(1);
      } else {
        return expr;
      }
    };

    App.prototype.reverse = function reverse() {
      this.reversed = !this.reversed;
      this.page = 1;
      this.activateTab(this.activeLinkPredicate);
    };

    App.prototype.jumpTo = function jumpTo(selectedClass) {
      this.qRefine = "";
      this.constraints = [];
      this.fetchContext(selectedClass, 'card');
    };

    App.prototype.setMode = function setMode(mode) {
      if (this.cardEdit) {
        alert("You must save or revert changes before changing mode.");
      } else {
        this.mode = mode;
        this.hash = this.mode;
        this.refreshBlocks();
        switch (mode) {
          case "ingestion":
            this.loadIngestData();break;
          case "list":
            {
              this.qRefine = "";
              this.constraints = [];
              if (this.predicates.map(function (predicate) {
                return predicate.curie;
              }).includes('rdf:type')) {
                console.log(this.predicates);
                this.activateTab();
              }
              break;
            }
          case "widgets":
            {
              break;
            }
          default:
            break;
        }
      }
    };

    App.prototype.getWidgets = function getWidgets() {
      var _this8 = this;

      this.widgets = "<p><b>Loading widgets ...</b></p>";
      var path = '/lib/getWidgets.sjs?context=' + this.context;
      window.fetch(path).then(function (response) {
        return response.json();
      }).then(function (json) {
        _this8.widgets = json;
      }).catch(function (e) {
        return console.log(e);
      });
    };

    App.prototype.loadIngestData = function loadIngestData() {
      var _this9 = this;

      fetch(this.server + '/files/analysis.json').then(function (blob) {
        return blob.json();
      }).then(function (json) {
        _this9.templates = json;
      });
    };

    App.prototype.editCard = function editCard() {
      var editMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "edit";

      this.mode = "card";
      if (editMode === "edit") {
        this.activeCard.title = this.g[this.context]['term:prefLabel'][0].value;
      } else {
        this.activeCard.title = this.g[this.context]['term:prefLabel'][0].value + " Copy";
        this.activeCard.sourceCurie = this.context;
      }
      this.activeCard.body = this.g[this.context]['term:hasDescription'] != null ? this.g[this.context]['term:hasDescription'][0].value : "";
      console.log(this.g[this.context].hasOwnProperty('term:hasPrimaryImageURL'));
      this.activeCard.image = this.g[this.context]['term:hasPrimaryImageURL'] != null ? this.g[this.context]['term:hasPrimaryImageURL'][0].value : "";
      this.activeCard.context = this.context;
      this.activeCard.curie = this.context;
      console.log(this.g[this.context]['term:hasExternalURL']);
      this.activeCard.externalURL = this.g[this.context]['term:hasExternalURL'] != null ? this.g[this.context]['term:hasExternalURL'][0].value : '';
      this.cardEdit = true;
      this.editMode = editMode;
    };

    App.prototype.saveCard = function saveCard() {
      var _this10 = this;

      this.activeCard.context = this.activeCard.curie;
      var internalTerms = this.extractInternalTerms(this.activeCard.body);
      var path = this.server + '/lib/saveCard.sjs';
      console.log(path);

      console.log(this.activeCard);
      window.fetch(path, { body: JSON.stringify(this.activeCard), method: "POST" }).then(function (response) {
        return response.text();
      }).then(function (text) {
        _this10.cache = "refresh";
        _this10.fetchContext(_this10.activeCard.curie, "card");
      }).catch(function (e) {
        return console.log(e);
      });
      this.cardEdit = false;
    };

    App.prototype.filterBody = function filterBody(content) {
      var _this11 = this;

      var filters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['box'];

      var input = content || "";
      if (input === "") {
        return "";
      }

      filters.forEach(function (filter) {
        switch (filter) {
          case "box":
            input = _this11.boxFilter(input);return input;break;
          case "lists":
            input = _this11.listsFilter(input);return input;break;
          default:
            input;
        }
      });
      return input;
    };

    App.prototype.extractInternalTerms = function extractInternalTerms(body) {
      var parser = new DOMParser();
      var parsedHtml = parser.parseFromString(body, 'text/html');
      var termCuries = Array.from(parsedHtml.querySelectorAll("a")).filter(function (node) {
        return node.getAttribute('property') === 'term:hasInternalTerm';
      }).map(function (node) {
        return node.getAttribute('resource');
      });
      return termCuries;
    };

    App.prototype.boxFilter = function boxFilter(input) {
      input = input.replace(/\[(.*?)\|(.*?)\]/g, '<a href="?context=$1">$2</a>');
      input = input.replace(/\*/g, '<li>');
      return input;
    };

    App.prototype.iso2Date = function iso2Date(isoDate) {
      var date = new Date(isoDate);
      return date.toLocaleDateString("en-us", { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    App.prototype.deleteItem = function deleteItem(index, arr) {
      arr.splice(index, 1);
    };

    App.prototype.editCardProperties = function editCardProperties() {
      var _this12 = this;

      console.log(this.g[this.context]);
      this.cardEdit = true;
      this.activeCard.title = this.g[this.context]['term:prefLabel'][0].value;
      this.activeCard.body = this.g[this.context]['term:hasDescription'][0].value;

      this.activeCard.image = this.g[this.context]['term:hasPrimaryImageURL'][0].value;
      this.activeCard.externalURL = this.g[this.context]['term:hasExternalURL'][0].value;
      this.activeCard.context = this.context;
      this.activeCard.curie = this.context;
      Object.keys(this.g[this.context]).forEach(function (predicate) {
        if (!Array.isArray(_this12.g[_this12.context][predicate])) {
          _this12.g[_this12.context][predicate] = [];
        };
        _this12.g[_this12.context][predicate].forEach(function (object) {
          if (object.type === "uri") {
            console.log(object.value, _this12.g.hasOwnProperty(object.value));
            if (_this12.g.hasOwnProperty(object.value)) {
              if (_this12.g[object.value] != null) {
                object.label = _this12.g[object.value]['term:prefLabel'][0].value;
                object.defaultValue = object.value;
                object.defaultLabel = object.label;
              }
            }
          }
        });
      });
    };

    App.prototype.saveCardProperties = function saveCardProperties() {
      var _this13 = this;

      this.cardEdit = false;
      var context = this.context;
      var curie = this.activeCard.curie;
      this.g[this.context]['term:prefLabel'][0].value = this.activeCard.title != '' ? this.activeCard.title : '' + this.tokenize(new Date().toISOString());
      this.g[this.context]['term:hasDescription'] = [{ datatype: "xsd:html", value: this.activeCard.body, type: "literal" }];
      this.g[this.context]['term:hasPrimaryImageURL'] = [{ datatype: "xsd:imageURL", value: this.activeCard.image, type: "literal" }];

      this.g[this.context]['term:hasExternalURL'] = [{ datatype: "xsd:anyURI", value: this.activeCard.externalURL, type: "literal" }];
      var internalTerms = this.extractInternalTerms(this.activeCard.body);
      var termObjs = internalTerms.map(function (term) {
        return { value: term, type: "uri" };
      });
      console.log(termObjs);
      this.g[this.context]['term:hasCrossReference'] = termObjs;
      var buffer = [];
      var update = Array.from(Object.keys(this.g[context])).forEach(function (predicate) {
        Array.from(_this13.g[context][predicate]).forEach(function (object) {
          if (object.type === 'uri') {
            buffer.push(curie + ' ' + predicate + ' ' + object.value + '.');
          } else {
            buffer.push(curie + ' ' + predicate + ' """' + object.value + '"""^^' + (object.datatype || 'xsd:string') + '.');
          }
        });
      });
      var triples = buffer.join('\n');
      var prolog = Object.keys(this.ns).map(function (prefix) {
        return 'prefix ' + prefix + ': <' + _this13.ns[prefix] + '>';
      }).join('\n');
      var output = prolog + '\ndelete {' + context + ' ?p ?o}\ninsert {\n  ' + triples + '\n}\nwhere {\n  ' + context + ' ?p ?o\n}';
      var newRecord = { "@context": this.namespace, "graph": this.g, subject: context, curie: curie };
      var path = this.server + '/lib/updateProperties.sjs';
      window.fetch(path, { method: "POST", body: JSON.stringify(newRecord, null, 4) }).then(function (response) {
        return response.text();
      }).then(function (text) {
        _this13.fetchContext(curie, _this13.mode || "card");
      }).catch(function (e) {
        return console.log(e);
      });
    };

    App.prototype.saveDuplicateCardProperties = function saveDuplicateCardProperties() {
      var _this14 = this;

      this.cardEdit = false;
      var context = this.activeCard.curie;
      var curie = this.activeCard.curie;
      this.g[this.context]['term:prefLabel'][0].value = this.activeCard.title != '' ? this.activeCard.title : '' + this.tokenize(new Date().toISOString());
      this.g[this.context]['term:hasDescription'] = [{ datatype: "xsd:html", value: this.activeCard.body, type: "literal" }];
      this.g[this.context]['term:hasPrimaryImageURL'] = [{ datatype: "xsd:imageURL", value: this.activeCard.image, type: "literal" }];
      this.g[this.context]['term:hasExternalURL'] = [{ datatype: "xsd:anyURI", value: this.activeCard.externalURL, type: "literal" }];
      var internalTerms = this.extractInternalTerms(this.activeCard.body);
      var termObjs = internalTerms.map(function (term) {
        return { value: term, type: "uri" };
      });
      console.log(termObjs);
      this.g[this.context]['term:hasCrossReference'] = termObjs;
      var buffer = [];
      var update = Array.from(Object.keys(this.g[this.context])).forEach(function (predicate) {
        var objects = Array.from(_this14.g[_this14.context][predicate]).filter(function (objects) {
          return objects != null;
        });
        Array.from(_this14.g[_this14.context][predicate]).forEach(function (object) {
          if (object.type === 'uri') {
            buffer.push(curie + ' ' + predicate + ' ' + object.value + '.');
          } else {
            buffer.push(curie + ' ' + predicate + ' """' + object.value + '"""^^' + (object.datatype || 'xsd:string') + '.');
          }
        });
      });
      var triples = buffer.join('\n');
      var prolog = Object.keys(this.ns).map(function (prefix) {
        return 'prefix ' + prefix + ': <' + _this14.ns[prefix] + '>';
      }).join('\n');
      var output = prolog + '\ndelete {' + context + ' ?p ?o}\ninsert {\n  ' + triples + '\n}\nwhere {\n  optional {\n  ' + context + ' ?p ?o\n  }\n}';
      console.log(output);
      var newRecord = { "@context": this.namespace, "graph": this.g, subject: context, curie: curie, query: output };
      var path = this.server + '/lib/duplicate.sjs';
      window.fetch(path, { method: "POST", body: JSON.stringify(newRecord, null, 4) }).then(function (response) {
        return response.text();
      }).then(function (text) {}).catch(function (e) {
        return console.log(e);
      });
    };

    App.prototype.revertCard = function revertCard() {
      this.pinPage(true, "card");
      console.log("revertCard() called");
    };

    App.prototype.getLinkOptions = function getLinkOptions(property) {
      if (this.linkPropertyList.hasOwnProperty(property)) {
        return this.linkPropertyList[property].values || [];
      } else {
        return [];
      }
    };

    App.prototype.updateLinkEntry = function updateLinkEntry(item, property) {
      var _this15 = this;

      if (this.linkPropertyList.hasOwnProperty(property)) {
        var link = this.linkPropertyList[property].values.find(function (link) {
          return link.value === item.label;
        });
        if (link) {
          item.value = link.context;
        } else {
          var action = confirm("Do you wish this to be a new Entry?");
          if (action) {
            item.value = item.value.replace(/^(\w+):(\w+)/, '$1:_' + this.tokenize(item.label));
            var prolog = Object.keys(this.ns).map(function (prefix) {
              return 'prefix ' + prefix + ': <' + _this15.ns[prefix] + '>';
            }).join('\n');
            var update = prolog + '\n  insert data {\n    ' + item.value + '\n        a ' + this.linkPropertyList[property].type + ';\n        term:prefLabel "' + item.label + '"^^xsd:string;\n        .\n  }';
            console.log(update);
            console.log("ToDo: Complete the update of the new entry.");
            var path = this.server + '/lib/updateProperties.sjs?update=' + encodeURI(update.replace(/(#)/g, "%%%"));
            window.fetch(path).then(function (response) {
              return response.text();
            }).then(function (text) {
              _this15.pinPage(true);
              console.log(text);
            }).catch(function (e) {
              return console.log(e);
            });
          } else {
            this.revertItem(item);
          }
        }
      }
    };

    App.prototype.revertItem = function revertItem(item) {
      item.value = item.defaultValue;
      item.label = item.defaultLabel;
    };

    App.prototype.login = function login() {
      this.loginData.action = "login";
      this.loginModal.open();
    };

    App.prototype.logout = function logout() {
      var _this16 = this;

      this.loginData.password = "";
      this.loginData.status = false;
      this.loginData.action = "logout";
      this.loginData.data = {};
      var path = this.server + '/lib/access.sjs';
      var params = { method: "POST", body: JSON.stringify(this.loginData) };

      window.fetch(path, params).then(function (response) {
        return response.json();
      }).then(function (json) {
        console.log(json);
        _this16.loginData = json;
        _this16.userRole = new Set(_this16.loginData.permissions);
        _aureliaCookie.AureliaCookie.delete("login");
        _this16.cache = "cached";
        _this16.fetchContext(_this16.context);
        _this16.validateUserContext();
      }).catch(function (e) {
        return console.log(e);
      });
    };

    App.prototype.processLogin = function processLogin() {
      var _this17 = this;

      var path = this.server + '/lib/access.sjs';
      var params = { method: "POST", body: JSON.stringify(this.loginData) };

      window.fetch(path, params).then(function (response) {
        return response.json();
      }).then(function (json) {
        console.log(json);
        _this17.loginData = json;
        _this17.userRole = new Set(_this17.loginData.permissions);
        if (!_this17.loginData.status) {
          alert("Log-in failed.");
        } else {
          _aureliaCookie.AureliaCookie.set("login", JSON.stringify(_this17.loginData), { expiry: 60, path: '', domain: '', secure: false });
        }
      }).catch(function (e) {
        return console.log(e);
      });
    };

    App.prototype.newCard = function newCard(ctx) {
      var asProperty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var _this18 = this;

      var preferredProperty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var target = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

      var context = ctx || this.context;
      this.context = context;
      this.activeCard = Object.assign(this.defaultCard, {});
      this.activeCard.type = context;
      this.activeCard.title = "";
      this.activeCard.body = "";
      this.activeCard.externalURL = "";
      this.activeCard.template = "";

      this.activeCard.image = this.g.hasOwnProperty(context) ? Array.isArray(this.g[context]['term:hasPrimaryImageURL']) ? this.g[context]['term:hasPrimaryImageURL'][0].value : "" : "";
      this.activeCard.image = this.activeCardImage || "";
      this.activeCard.activePredicate = preferredProperty;
      this.activeCard.target = target;

      if (context === 'class:_Class') {
        this.activeCard.prefix = '';
        this.activeCard.namespace = '';
        this.activeCard.plural = '';
      }
      if (context === 'class:_Property') {
        this.activeCard.nodeKind = '';
        this.activeCard.range = '';
        this.activeCard.datatype = '';
        this.activeCard.cardinality = '';
      } else if (asProperty === true) {
        this.context = "class:_Property";
        this.activeCard.domain = context;
        this.activeCard.type = "class:_Property";
        this.activeCard.nodeKind = 'nodeKind:_IRI';
        this.activeCard.range = '';
        this.activeCard.datatype = '';
        this.activeCard.cardinality = 'cardinality:_ZeroOrMore';
      }

      this.availableTemplates = [];

      var path = this.server + '/lib/newTemplate.sjs?context=' + this.context;
      window.fetch(path).then(function (response) {
        return response.json();
      }).then(function (json) {
        _this18.templateProperties = json.templateData;
        console.log(_this18.templateProperties);
        _this18.generateEntityId(_this18.context);
        _this18.newModal.open();
      }).catch(function (e) {
        return console.log(e);
      });
    };

    App.prototype.duplicateCard = function duplicateCard() {
      this.revertCard = Object.assign(this.activeCard, {});
      this.activeCard = {
        title: this.g[this.context]['term:prefLabel'][0].value + ' Copy',
        body: this.g[this.context].hasOwnProperty('term:hasDescription') ? this.g[this.context]['term:hasDescription'][0].value : ' ',
        image: this.g[this.context].hasOwnProperty('term:hasPrimaryImageURL') && Array.isArray(this.g[this.context]['term:hasPrimaryImageURL']) ? this.g[this.context]['term:hasPrimaryImageURL'][0].value : ' ',
        curie: this.context + '_Copy',
        sourceCurie: this.context,
        externalURL: this.g[this.context].hasOwnProperty('term:hasExternalURL') ? this.g[this.context]['term:hasExternalURL'][0].value : ' '
      };
      this.duplicateModal.open();
    };

    App.prototype.deleteCard = function deleteCard() {
      var _this19 = this;

      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.context;
      var landing = arguments[1];

      landing = context === this.context ? this.g[context]['rdf:type'][0].value : landing;

      if (confirm('Are you sure you wish to delete this item?')) {
        var path = this.server + '/lib/deleteCard.sjs?context=' + context;
        window.fetch(path).then(function (response) {
          return response.text();
        }).then(function (text) {
          console.log(text);

          _this19.refreshApp();
          _this19.fetchContext(landing, "card");
        }).catch(function (err) {
          return console.log(err);
        });
      }
    };

    App.prototype.processNewCard = function processNewCard() {
      var _this20 = this;

      console.log("processing card");
      if (this.activeCard.title === "") {
        var dt = new Date();
        this.activeCard.title = '' + dt;
        this.activeCard.curie += this.tokenize(dt.toISOString());
      }

      var prolog = Object.keys(this.ns).map(function (prefix) {
        return 'prefix ' + prefix + ': <' + _this20.ns[prefix] + '>';
      }).join('\n');
      console.log("ToDo: Complete the update of the new entry.");

      if (this.activeCard.prefix != '') {
        this.ns[this.activeCard.prefix] = this.activeCard.namespace;
        var _path = this.server + '/lib/updateNamespaces.sjs?prefix=' + this.activeCard.prefix + '&namespace=' + this.activeCard.namespace + '&action=add';
        window.fetch(_path).then(function (response) {
          return response.text();
        }).then(function (text) {
          console.log(text);
        }).catch(function (e) {
          return console.log(e);
        });
      }
      this.activeCard.predicateEntries = [];
      this.templateProperties.filter(function (predicate) {
        return predicate.value;
      }).forEach(function (predicate) {
        return _this20.activeCard.predicateEntries.push(Object.assign(predicate, {}));
      });
      console.log("Predicate Entries", this.activeCard.predicateEntries);
      var path = this.server + '/lib/newCard.sjs';
      window.fetch(path, { method: "POST", body: JSON.stringify(this.activeCard, null, 4) }).then(function (response) {
        return response.text();
      }).then(function (text) {
        console.log(_this20.activeCard);

        _this20.refreshApp();
        _this20.fetchContext(_this20.activeCard.curie, 'card');
      }).catch(function (e) {
        return console.log(e);
      });
    };

    App.prototype.processDuplicateCard = function processDuplicateCard() {
      var _this21 = this;

      console.log("processing duplicate card");
      var ignorePredicates = new Set(['term:prefLabel', 'term:hasDescription', 'term:hasPrimaryImageURL', 'rdf:type']);
      var prolog = Object.keys(this.ns).map(function (prefix) {
        return 'prefix ' + prefix + ': <' + _this21.ns[prefix] + '>';
      }).join('\n');
      console.log(this.context, this.g[this.context]);
      var triples = [];
      var triple;
      Object.keys(this.g[this.context]).forEach(function (predicate) {
        if (!ignorePredicates.has(predicate)) {
          _this21.g[_this21.context][predicate].forEach(function (object) {
            if (object.type === 'literal') {
              triple = _this21.activeCard.curie + ' ' + predicate + ' ' + object.value + '.';
            } else {
              triple = _this21.activeCard.curie + ' ' + predicate + ' """' + object.value + '"""^^' + (object.datatype || 'xsd:string') + '.';
            }
            triples.push(triple);
          });
        }
      });
      var update = prolog + '\n  insert data {\n    ' + this.activeCard.curie + '\n        a ' + this.g[this.context]['rdf:type'][0].value + ';\n        term:prefLabel """' + this.activeCard.title + '"""^^xsd:string;\n        term:hasDescription """' + this.activeCard.body + '"""^^termType:_HTML;\n        term:hasPrimaryImageURL "' + this.activeCard.image + '"^^termType:_Image;\n        term:isDerivedFrom ' + this.activeCard.sourceCurie + ';\n        term:hasExternalURL  "' + this.activeCard.externalURL + '"^^xsd:anyURI;\n        .\n    ' + triples.join('\n') + '\n}';
      console.log(update);
      var path = this.server + '/lib/updateProperties.sjs?update=' + encodeURI(update.replace(/(#)/g, "%%%"));
      window.fetch(path).then(function (response) {
        return response.text();
      }).then(function (text) {
        console.log(text);
      }).catch(function (e) {
        return console.log(e);
      });
    };

    App.prototype.generateEntityId = function generateEntityId(context) {
      console.log('Generate Entity Id - ' + context);
      if (context.startsWith('class:')) {
        var _prefix = this.tokenize(context.replace(/.*\:_(.+?)$/, "$1"), "camel");
        if (context === 'class:_Class') {
          var cleanTitle = this.summaryFilter(this.activeCard.title, 128);
          var id = this.tokenize(cleanTitle);
          this.activeCard.curie = 'class:_' + id;
          var _prefix = this.tokenize(cleanTitle, "camel");
          this.activeCard.prefix = _prefix;
          this.activeCard.namespace = '' + this.defaultNamespace + _prefix + '/';
          this.activeCard.plural = this.activeCard.title + 's';
        } else if (context === 'class:_Property') {
          var _cleanTitle = this.summaryFilter(this.activeCard.title, 128);
          var id = this.tokenize(_cleanTitle, "camel");
          var domain = this.tokenize(this.activeCard.domain.replace(/.+?\:_/, ''), 'camel');

          var _prefix = domain;
          this.activeCard.curie = _prefix + ':' + id;
        } else {
          var _cleanTitle2 = this.activeCard.title;
          var className = this.context.replace(/.*?\:_(.+?)$/, "$1");
          var _prefix2 = '' + className.substr(0, 1).toLowerCase() + className.substr(1);
          console.log(this.activeCard);
          var id = this.tokenize(_cleanTitle2);
          if (id === "") {
            id = this.tokenize(new Date().toISOString());
          }
          this.activeCard.curie = _prefix2 + ':_' + id;
          this.activeCard.title = _cleanTitle2;
        }
      } else {
        var _cleanTitle3 = this.activeCard.title;
        var _prefix3 = this.context.replace(/(.*)\:_.+?$/, "$1");
        console.log(this.activeCard);
        var id = this.tokenize(_cleanTitle3);
        if (id === "") {
          id = this.tokenize(new Date().toISOString());
        }
        this.activeCard.curie = _prefix3 + ':_' + id;
        this.activeCard.title = _cleanTitle3;
      }
    };

    App.prototype.getTerms = function getTerms(property) {
      var _this22 = this;

      var path = this.server + '/lib/terms.sjs?predicate=' + property;
      window.fetch(path).then(function (response) {
        return response.json();
      }).then(function (json) {
        _this22.linkPropertyList = {};
        _this22.linkPropertyList[property] = json.results;
      });
      return [];
    };

    App.prototype.updateLink = function updateLink(context, property, item, event) {
      console.log("*** updateLink");

      var value = event.srcElement.value;
      console.log(value);
      if (value === "delete") {
        item.deleted = true;
        console.log("deletes called");
      } else {
        var label = this.linkPropertyList[property].find(function (tempItem) {
          return event.srcElement.value === tempItem.context;
        }).value;
        console.log(label);
        var foundItem = this.g[context][property].find(function (tempItem) {
          return tempItem.value === item.value;
        });
        foundItem.value = value;
        foundItem.label = label;
        console.log(foundItem);
      }
    };

    App.prototype.updateClassNamespace = function updateClassNamespace() {
      this.activeCard.namespace = '' + this.defaultNamespace + this.activeCard.prefix + '/';
    };

    App.prototype.updateInstanceList = function updateInstanceList(classContext) {
      var _this23 = this;

      var predicate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'rdf:type';

      var path = this.server + '/lib/getList.sjs?context=' + classContext + '&predicate=' + predicate;
      path += classContext === 'class:_Class' ? '&graph=' + this.activeGraph : '';
      window.fetch(path).then(function (response) {
        return response.json();
      }).then(function (json) {
        _this23.instanceList[classContext] = {};
        _this23.instanceList[classContext][predicate] = json;
      });
    };

    App.prototype.filterComplianceTest = function filterComplianceTest() {
      var _this24 = this;

      var classContext = 'class:_ComplianceTest';
      var predicate = 'rdf:type';
      var path = this.server + '/lib/getList.sjs?context=' + classContext + '&predicate=' + predicate;
      var constraintObj = { constraints: [] };
      if (this.complianceItem.country != "") {
        constraintObj.constraints.push({ predicate: 'complianceTest:hasCountry', object: this.complianceItem.country });
      }
      if (this.complianceItem.industry != "") {
        constraintObj.constraints.push({ predicate: 'complianceTest:hasIndustry', object: this.complianceItem.industry });
      }
      console.log("Entering Filter Compliance List");
      console.log(constraintObj);
      window.fetch(path, { method: "POST", body: JSON.stringify(constraintObj, null, 4) }).then(function (response) {
        return response.json();
      }).then(function (json) {
        _this24.instanceList[classContext] = {};
        _this24.instanceList[classContext][predicate] = json;
      });
    };

    App.prototype.getDescription = function getDescription(context, object, predicate) {
      if (context === null || object === null || predicate === null) {
        return "";
      }
      var item = this.instanceList[object][predicate].find(function (item) {
        return item.curie === context;
      });
      if (item != null) {
        return item.description;
      } else {
        return "";
      }
    };

    App.prototype.getInstanceList = function getInstanceList(classContext) {
      var predicate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'rdf:type';

      if (this.instanceList.hasOwnProperty(classContext) && this.instanceList[classContext].hasOwnProperty(predicate)) {
        return this.instanceList;
      } else {
        return [];
      }
    };

    App.prototype.summaryFilter = function summaryFilter(content) {
      var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

      content = content ? content : "";
      content = content.replace(/<.+?>/g, ' ').replace(/\s+/g, ' ');
      content = content.substr(0, len);
      return '' + content;
    };

    App.prototype.addProperty = function addProperty(property) {
      var _this25 = this;

      var contextType = this.g[this.context]['rdf:type'][0].value;
      var path = this.server + '/lib/properties.sjs?type=' + contextType + '&cache=refresh';
      console.log(path);
      fetch(path).then(function (response) {
        return response.json();
      }).then(function (json) {
        _this25.availableProperties = json.results;
        console.log(_this25.availableProperties);
        _this25.selectedProperty = property;
        if (property != null) {
          _this25.setPropertyListValue(property);
        };
        _this25.addPropertyModal.open();
      }).catch(function (e) {
        return console.log(e);
      });
    };

    App.prototype.activePropertySelected = function activePropertySelected(event) {
      var predicate = event.target.value;
      this.setPropertyListValue(predicate);
    };

    App.prototype.setPropertyListValue = function setPropertyListValue(predicate) {
      var _this26 = this;

      console.log(predicate);
      this.activeProperty = this.availableProperties.find(function (property) {
        return property.predicate === predicate;
      });
      console.log(this.activeProperty);
      if (this.activeProperty.nodeKind === 'nodeKind:_IRI') {
        var path = this.server + '/lib/getList.sjs?context=' + this.activeProperty.range + '&cache=refresh';
        fetch(path).then(function (response) {
          return response.json();
        }).then(function (json) {
          _this26.activePropertyValues = json;
        }).catch(function (e) {
          return console.log(e);
        });
      }
    };

    App.prototype.activeClassSelected = function activeClassSelected(event) {
      console.log(event);
    };

    App.prototype.processAddProperty = function processAddProperty() {
      console.log('*', this.activeProperty);
      var set = new Set([]);
      if (this.activeProperty.nodeKind === 'nodeKind:_IRI') {
        if (!this.g[this.context].hasOwnProperty(this.activeProperty.predicate)) {
          this.g[this.context][this.activeProperty.predicate] = [];
        }
        if (new Set(['cardinality:_ZeroOrMore', 'cardinality:_OneOrMore']).has(this.activeProperty.cardinality)) {
          if (!set.has(this.activeProperty.value)) {
            this.g[this.context][this.activeProperty.predicate].push({ 'type': 'uri', value: this.activeProperty.value });
            set.add(this.activeProperty.value);
          }
        } else {
          this.g[this.context][this.activeProperty.predicate] = [{ 'type': 'uri', value: this.activeProperty.value }];
        }
        this.saveCardProperties();
      }
      if (this.activeProperty.nodeKind === 'nodeKind:_Literal') {
        if (!this.g[this.context].hasOwnProperty(this.activeProperty.predicate)) {
          this.g[this.context][this.activeProperty.predicate] = [];
        }
        this.g[this.context][this.activeProperty.predicate].push({ 'type': 'literal', value: this.activeProperty.value, datatype: this.activeProperty.datatype });
        this.saveCardProperties();
      }
    };

    App.prototype.addExistingPropertyValue = function addExistingPropertyValue(property) {
      var newObject = Object.assign({}, this.g[this.context][property][0]);
      newObject.value = "";
      newObject.label = "";
      this.g[this.context][property].push(newObject);
    };

    App.prototype.newConstraint = function newConstraint() {
      var _this27 = this;

      var path = this.server + '/lib/properties.sjs?type=' + this.context + '&cache=refresh';
      console.log(path);
      fetch(path).then(function (response) {
        return response.json();
      }).then(function (json) {
        _this27.availableProperties = json.results;
        _this27.activeConstraint.predicate = "";
        _this27.activeConstraint.object = "";
        _this27.addConstraintModal.open();
      }).catch(function (e) {
        return console.log(e);
      });
    };

    App.prototype.processAddConstraint = function processAddConstraint() {
      console.log(this.activeProperty);
      var constraint = Object.assign({}, this.activeProperty);
      if (constraint.nodeKind === "nodeKind:_IRI") {
        var propertyValue = this.activePropertyValues.find(function (activePropertyValue) {
          return activePropertyValue.curie === constraint.value;
        }).label;
        constraint.objectLabel = propertyValue;
      }
      this.constraints.push(constraint);
      console.log(this.constraints);
      this.fetchContext(this.context, "card");
    };

    App.prototype.removeConstraint = function removeConstraint(index) {
      this.constraints.splice(index, 1);
      console.log(this.constraints);
      this.cache = "refresh";
      this.fetchContext(this.context, "card");
    };

    App.prototype.clearConstraints = function clearConstraints() {
      this.constraints = [];
      this.fetchContext(this.context, "card");
    };

    App.prototype.formatDoc = function formatDoc(action) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var gui = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var editor = document.querySelector('.bodyEditor');
      document.execCommand(action, gui, params);editor.focus();
    };

    App.prototype.createHyperlink = function createHyperlink() {
      var sLnk = prompt('Write the URL here', 'http://');
      if (sLnk && sLnk != '' && sLnk != 'http://') {
        var editor = document.querySelector('.bodyEditor');
        var selection = window.getSelection();
        var text = selection.toString();
        var link = '<a href="' + sLnk + '" target="_blank">' + text + '</a>';

        document.execCommand('insertHTML', false, link);
        editor.focus();
      }
    };

    App.prototype.setForeColor = function setForeColor(evt) {
      console.log(evt);
      this.formatDoc('foreColor', evt.srcElement.value);
    };

    App.prototype.setBackColor = function setBackColor(evt) {
      console.log(evt);
      this.formatDoc('backColor', evt.srcElement.value);
    };

    App.prototype.setHeading = function setHeading(evt) {
      this.formatDoc('formatBlock', evt.srcElement.value);
      evt.srcElement.value = "";
    };

    App.prototype.imageEdit = function imageEdit() {
      var selection = document.getSelection();
      var imageNode = selection.anchorNode.querySelector ? selection.anchorNode.querySelector("IMG") : null;
      if (imageNode) {
        this.editImage = {
          src: imageNode.getAttribute('src'),
          width: imageNode.getAttribute('width'),
          height: imageNode.getAttribute('height'),
          alt: imageNode.getAttribute('alt') || "",
          title: imageNode.getAttribute('title') || "",
          align: imageNode.getAttribute('alignment') || ""
        };
      }
      document.execCommand("insertHTML", false, "%^%");

      console.log("Enter imageEdit");
      this.editImageModal.open();
      console.log("Leave imageEdit");
    };

    App.prototype.processEditImage = function processEditImage() {
      console.log("Entering processEditImage");

      var img = '<img src="' + this.editImage.src + '" class="bodyEditorImage ' + this.editImage.align + '" alignment="' + this.editImage.align + '"\n    alt="' + this.editImage.alt + '" title="' + this.editImage.title + '" width="' + this.editImage.width + '" height="' + this.editImage.height + '"/>';
      console.log(img);
      var editor = document.querySelector('.bodyEditor');
      editor.focus();

      var html = editor.innerHTML;
      editor.innerHTML = html.replace("%^%", img);

      console.log("Leaving processEditImage");
    };

    App.prototype.cancelEditImage = function cancelEditImage() {
      this.editImageModal.cancel();
      var editor = document.querySelector('.bodyEditor');

      var html = editor.innerHTML;
      editor.innerHTML = html.replace("%^%", "");
    };

    App.prototype.insertTermDlg = function insertTermDlg() {
      this.insertTermObj = { label: "", value: "", temp: "", asImage: false, image: "" };
      var editor = document.querySelector('.bodyEditor');
      var selection = window.getSelection();
      this.q = selection.toString();
      this.insertTermObj.temp = selection.toString();
      this.insertTermObj.label = selection.toString();
      this.formatDoc('insertHTML', "%^%");
      this.inputSearch();
      this.insertTermModal.open();
    };

    App.prototype.insertTerm = function insertTerm() {
      console.log("Entering insertTerm()");
      this.q = "";
      var label = this.insertTermObj.temp;
      console.log(this.insertTermObj.asImage);
      var link = this.insertTermObj.asImage === "image" ? '\n     <div class="insertedImageContainer">\n        <div onclick="window.app.fetchContext(\'' + this.insertTermObj.value + '\',\'card\')"  class="link"  resource="' + this.insertTermObj.value + '" property="term:hasInternalTerm">\n          <img src="' + this.insertTermObj.image + '" class="insertedImage"/>\n          <div class="imageCaption">' + this.insertTermObj.temp + '</div>\n        </div>\n      </div>' : '<span onclick="window.app.fetchContext(\'' + this.insertTermObj.value + '\',\'card\')" class="link" resource="' + this.insertTermObj.value + '" \n      property="term:hasInternalTerm">' + label + '</span>';
      var editor = document.querySelector('.bodyEditor');
      var html = editor.innerHTML;
      editor.innerHTML = html.replace("%^%", link);
      editor.focus();
    };

    App.prototype.cancelInsertTerm = function cancelInsertTerm() {
      this.q = "";
      var link = this.insertTermObj.temp;
      var editor = document.querySelector('.bodyEditor');
      var html = editor.innerHTML;
      editor.innerHTML = html.replace("%^%", link);

      editor.focus();
    };

    App.prototype.updateInsertTerm = function updateInsertTerm() {
      var _this28 = this;

      var searchItem = this.searchData.results.find(function (searchItem) {
        return searchItem.s === _this28.insertTermObj.value;
      });
      this.insertTermObj.temp = searchItem.prefLabel;
    };

    App.prototype.updateInsertImage = function updateInsertImage() {
      var _this29 = this;

      var searchItem = this.searchData.results.find(function (searchItem) {
        return searchItem.s === _this29.insertTermObj.value;
      });
      this.insertTermObj.image = searchItem.imageURL;
    };

    App.prototype.insertCodeBlock = function insertCodeBlock() {
      var editor = document.querySelector('.bodyEditor');
      editor.focus();
      document.execCommand('insertHTML', false, '<pre class="codeBlock">// Insert Code Here</pre>');
    };

    App.prototype.insertVideo = function insertVideo() {
      var videoURL = window.prompt("Enter video URL");

      var videoEmbed = this.generateVideoLink(videoURL);
      var editor = document.querySelector('.bodyEditor');
      editor.focus();

      document.execCommand('insertHTML', false, videoEmbed);
    };

    App.prototype.hasContent = function hasContent(context, property) {
      return property === 'link' ? true : !this.g[context][property][0].value.match(/\:_$/);
    };

    App.prototype.deleteClassItems = function deleteClassItems() {
      var _this30 = this;

      var clearClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var message = clearClass ? 'Warning! This will delete the class "' + this.g[this.context]['term:prefLabel'][0].value + '", all properties for that class and all items in the class. It can not be undone. Are you sure you want to continue?' : 'Warning! This will remove all items from this class (but keep class and properties). It cannot be undone. Are you sure you want to continue?';
      if (confirm(message)) {
        console.log("Delete class items");
        var path = this.server + '/lib/deleteClassItems.sjs?context=' + this.context + '&removeClass=' + (clearClass ? 'true' : 'false');
        window.fetch(path).then(function (response) {
          return response.text();
        }).then(function (text) {
          _this30.cache = "refresh";
          _this30.fetchContext("class:_Class", 'card');
        }).catch(function (e) {
          return console.log(e);
        });
      }
    };

    App.prototype.log = function log(content) {
      console.log(content);
      return content;
    };

    App.prototype.setImage = function setImage(event) {
      var file = event.srcElement.files[0];
      var reader = new FileReader();
      var target = this.activeCard;
      var me = this;
      reader.addEventListener("load", function () {
        target.image = reader.result;
        target.filename = file.name;
        me.createImageFile();
      }, false);
      reader.readAsDataURL(file);
    };

    App.prototype.createImageFile = function createImageFile() {
      var _this31 = this;

      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.activeCard.curie;

      var url = this.activeCard.image;
      var name = this.activeCard.filename;
      if (url.startsWith('data:image')) {
        var type = url.replace(/^data:image\/(\w+)\;.*/, '$1');
        var data = url.split(';base64,')[1];
        var options = { "method": "POST", body: JSON.stringify({ imageData: data, imageType: type, id: id, filename: name }, null, 4) };
        var target = this.activeCard;
        window.fetch(this.server + '/lib/uploadImage.sjs', options).then(function (resp) {
          return resp.json();
        }).then(function (json) {
          var path = _this31.server + '/lib/getImage.sjs?path=' + json.filepath;
          target.image = path;
        }).catch(function (e) {
          return console.log(e);
        });
      }
    };

    App.prototype.setFile = function setFile(event) {
      var file = event.srcElement.files[0];
      var reader = new FileReader();
      var target = this.activeCard;
      var me = this;
      reader.addEventListener("load", function () {
        target.externalURL = reader.result;
        target.filename = file.name;
        if (target.title != '') {}
        target.title = target.filename.split('.')[0];
        console.log(target.filename);
        me.createFile();
      }, false);
      reader.readAsDataURL(file);
    };

    App.prototype.createFile = function createFile() {
      var _this32 = this;

      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.activeCard.curie;

      var url = this.activeCard.externalURL;
      var name = this.activeCard.filename;
      if (url.startsWith('data:')) {
        var type = url.replace(/^data:(.+?)\;.*/, '$1');
        var data = url.split(';base64,')[1];
        var options = { "method": "POST", body: JSON.stringify({ fileData: data, fileType: type, id: id, filename: name }, null, 4) };
        var target = this.activeCard;
        window.fetch(this.server + '/lib/uploadFile.sjs', options).then(function (resp) {
          return resp.json();
        }).then(function (json) {
          var path = _this32.server + '/lib/getFile.sjs?path=' + json.filepath;
          target.externalURL = path;
        }).catch(function (e) {
          return console.log(e);
        });
      }
    };

    App.prototype.loadBlocks = function loadBlocks() {
      this.blocks = [];
    };

    App.prototype.refreshBlocks = function refreshBlocks() {
      var _this33 = this;

      this.blocks.forEach(function (block) {
        var container = document.querySelector('.' + block.container);
        if (container != null) {
          container.innerHTML = " ";
        }
      });
      this.blocks.forEach(function (block) {
        console.log(block.mode);
        if (new Set(block.mode).has(_this33.mode)) {
          var container = document.querySelector('.' + block.container);
          if (container != null) {
            if (!container.querySelector('.' + block.selector)) {
              container.innerHTML += '<div class="' + block.selector + '"> </div>';
            }
            block.html = '<style type="text/css">' + block.css + '</style><div class="block">' + block.header;
            var targets = Array.from(document.querySelectorAll('.' + block.selector));
            targets.forEach(function (target) {
              return target.innerHTML = "";
            });
            console.log(block);
            if (block.type === "sp") {
              if (_this33.g[_this33.context].hasOwnProperty(block.predicate)) {
                var count = _this33.g[_this33.context][block.predicate].length;
                var index = -1;
                var contexts = _this33.g[_this33.context][block.predicate].map(function (object) {
                  return object.value;
                });
                contexts.forEach(function (context) {
                  window.fetch(_this33.server + '/lib/server.sjs?context=' + context).then(function (response) {
                    return response.json();
                  }).then(function (json) {
                    var graph = json.graph;
                    block.html += block.template(context, graph, index, count);
                    index += 1;
                  }).then(function () {
                    var targets = Array.from(document.querySelectorAll('.' + block.selector));
                    if (index + 1 === count) {
                      block.html += block.footer + '</div>';

                      targets.forEach(function (target) {
                        target.innerHTML = block.html;
                      });
                    }
                  });
                });
              }
            }
            if (block.type === "self") {
              console.log("Entering self");
              if (_this33.g[_this33.context].hasOwnProperty(block.predicate)) {
                console.log(_this33.g[_this33.context][block.predicate]);
                var _count = _this33.g[_this33.context][block.predicate].length;
                var _index = -1;
                var graph = _this33.g;
                var _contexts = _this33.g[_this33.context][block.predicate].map(function (object) {
                  return object.value;
                });
                block.html += _contexts.map(function (context) {
                  return !_this33.isNullLink(context) ? block.template(context, graph, _index, _count) : '';
                }).join(block.separator);
                block.html += block.footer + '</div>';
                targets.forEach(function (target) {
                  target.innerHTML = block.html;
                });
              }
            }
          }
        }
      });
    };

    App.prototype.isNullLink = function isNullLink(context) {
      return context.match(/:_$/);
    };

    App.prototype.getValidLink = function getValidLink(context, property) {
      var _this34 = this;

      if (this.g[context].hasOwnProperty(property)) {
        var validLink = this.g[context][property].find(function (value) {
          return !_this34.isNullLink(value);
        });
        return validLink;
      } else {
        return false;
      }
    };

    App.prototype.summary = function summary(body) {
      if (body != null) {
        var text = body.replace(/<.+?>/g, '');
        text = text.substr(0, 300);
        return text.replace(/^(.*)\..*/, '$1 ...');
      } else {
        return "";
      }
    };

    App.prototype.setBodyToTemplate = function setBodyToTemplate() {
      var templateCurie = this.activeCard.template;
      if (templateCurie != "") {
        this.activeCard.body = this.availableTemplates.find(function (template) {
          return template.link === templateCurie;
        }).description;
      } else {
        this.activeCard.body = "";
      }
    };

    App.prototype.updateConfiguration = function updateConfiguration() {
      var _this35 = this;

      var path = this.server + '/lib/server.sjs?context=class:_Configuration';
      window.fetch(path).then(function (response) {
        return response.json();
      }).then(function (json) {
        var graph = json.graph;
        if (graph.hasOwnProperty('class:_Configuration')) {
          if (graph["class:_Configuration"].hasOwnProperty('class:hasActiveConfiguration')) {
            var configuration = graph['class:_Configuration']['class:hasActiveConfiguration'][0].value;
            if (configuration != _this35.oldConfiguration) {
              _this35.oldConfiguration = configuration;
              var _path2 = _this35.server + '/lib/server.sjs?context=' + configuration;
              window.fetch(_path2).then(function (response) {
                return response.json();
              }).then(function (json) {
                var graph = json.graph;
                _this35.theme = graph[configuration].hasOwnProperty('configuration:hasTheme') ? graph[configuration]['configuration:hasTheme'][0].value : "";
                _this35.defaultLabel = graph[configuration].hasOwnProperty('configuration:hasSiteName') ? graph[configuration]['configuration:hasSiteName'][0].value : "";
                _this35.defaultIcon = graph[configuration].hasOwnProperty('configuration:hasIcon') ? graph[configuration]['configuration:hasIcon'][0].value : "";
                _this35.defaultPage = graph[configuration].hasOwnProperty('configuration:hasHomePage') ? graph[configuration]['configuration:hasHomePage'][0].value : "page:_Home";
                _this35.activeCSS = graph[configuration].hasOwnProperty('configuration:hasCSS') ? graph[configuration]['configuration:hasCSS'][0].value : "";
                _this35.footer = graph[configuration].hasOwnProperty('configuration:hasFooter') ? graph[configuration]['configuration:hasFooter'][0].value : "";
                _this35.topBannerMessage = graph[configuration].hasOwnProperty('configuration:hasTopBanner') ? graph[configuration]['configuration:hasTopBanner'][0].value : "";
                var mode = graph[configuration].hasOwnProperty('configuration:hasMode') ? graph[configuration]['configuration:hasMode'][0].value : "card";
                _this35.mode = _this35.params.mode || mode;
                _this35.context = _this35.params != null ? _this35.params.context || _this35.defaultPage : _this35.defaultPage;

                _this35.fetchContext(_this35.context, _this35.mode);
              }).catch(function (e) {
                return console.log(e);
              });
            }
          }
        }
      }).catch(function (e) {
        return console.log(e);
      });
    };

    App.prototype.titleCase = function titleCase(expr) {
      return expr.replace(/(^|\W)(\w)/g, function (text) {
        return text.toUpperCase();
      });
    };

    App.prototype.graphToContext = function graphToContext() {
      var context = window.gvis ? window.gvis.context : this.context;
      this.fetchContext(context, "card");
    };

    App.prototype.graphQ = function graphQ(event) {
      console.log(event);
      if (event.keyCode === 13) {
        window.gvis.loadSelectedContext(this.context, this.qGraph);
      }
    };

    App.prototype.article = function article(predicate, object) {
      if (object[0].match(/[AEHIOU]/)) {
        if (predicate.match(/ A$/)) {
          predicate += 'n';
        }
      }
      return predicate;
    };

    App.prototype.getPredicate = function getPredicate(predicate) {
      return this.predicates ? this.predicates.find(function (predicate) {
        return predicate === predicate.s;
      }) : null;
    };

    App.prototype.getPreferredClasses = function getPreferredClasses(context) {
      if (!this.g) {
        return [];
      }
      var contextClass = this.g[context]['rdf:type'][0].value;
      console.log(contextClass);
      var preferredProperty = this.g[contextClass].hasOwnProperty('term:hasPreferredProperty') ? this.g[contextClass]['term:hasPreferredProperty'][0].value : '';
      console.log(preferredProperty);
      if (preferredProperty != '') {
        this.preferredProperty = preferredProperty;
        var prefix = preferredProperty.split(/:/)[0];
        console.log(prefix);

        var classInstances = Array.from(this.instanceList['class:_Class']['rdf:type']).filter(function (instance) {
          return instance.prefix === prefix;
        });
        console.log(classInstances);
        return classInstances;
      } else return [];
    };

    App.prototype.loadMenu = function loadMenu(context, selector) {
      var _this36 = this;

      var path = '/lib/menu.sjs?context=' + context + '&predicate=menuItem:hasParentMenuItem&sort=sortMode:_OrdinalAsc&transitive=plus&pageSize=100';
      window.fetch(path).then(function (response) {
        return response.json();
      }).then(function (json) {
        var menu = json.data;
        var html = _this36.traverseMenu(menu, context);
        html = html.replace(/<ul><\/ul>/g, '');
        var mainMenu = document.querySelector(selector);
        mainMenu.innerHTML = html;
      }).catch(function (error) {
        return console.log(error);
      });
    };

    App.prototype.traverseMenu = function traverseMenu(menu, context) {
      var _this37 = this;

      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var subMenus = menu.filter(function (menuItem) {
        return menuItem.object === context;
      });
      return subMenus.length > 0 ? '<ul>' + subMenus.map(function (menuItem) {
        return '<li class="menuItem level' + level + '"><div class="link" onclick="window.app.selectMenuItem(\'' + menuItem.target + '\')"\n        title="' + menuItem.description + '">' + menuItem.linkLabel + '</div>' + _this37.traverseMenu(menu, menuItem.link, level + 1) + '</li>';
      }).join('\n') + '</ul>' : '';
    };

    App.prototype.selectMenuItem = function selectMenuItem(context) {
      if (context != "") {
        this.fetchContext(context, 'card');
      };
      this.showMenu = false;
    };

    App.prototype.convertToRichText = function convertToRichText() {
      var editor = document.querySelector('.bodyEditor');
      editor.innerHTML = editor.textContent;
      this.activeCard.body = editor.innerHTML;
    };

    App.prototype.convertFromRichText = function convertFromRichText() {
      var editor = document.querySelector('.bodyEditor');
      editor.textContent = editor.innerHTML;
      this.activeCard.body = editor.innerHTML;
    };

    App.prototype.getVideoId = function getVideoId(url) {
      var regExpYouTube = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var regExpVimeo = /^.*(vimeo\.com)\/(.+$)/;

      var match = url.match(regExpYouTube);

      if (match && match[2].length == 11) {
        return { id: match[2], type: "youtube" };
      } else {
        match = url.match(regExpVimeo);
        if (match) {
          return { id: match[2], type: "vimeo" };
        } else {
          return { type: 'error' };
        }
      }
    };

    App.prototype.generateVideoLink = function generateVideoLink(url) {
      var video = this.getVideoId(url);

      if (video.type != 'error') {
        if (video.type === "youtube") {
          return '<iframe width="640" height="480" src="//www.youtube.com/embed/' + video.id + '" frameborder="0" allowfullscreen></iframe>';
        }
        if (video.type === "vimeo") {
          return '<iframe width="640" height="480" src="//player.vimeo.com/video/' + video.id + '" frameborder="0" allowfullscreen></iframe>';
        }
      } else {
        return "";
      }
    };

    App.prototype.validateUserContext = function validateUserContext() {
      var _this38 = this;

      var role = this.loginData ? this.loginData.data ? this.loginData.data.hasOwnProperty('user:hasUserRole') ? this.loginData.data['user:hasUserRole'][0].value : "" : "" : "";
      console.log(role);
      switch (role) {
        case "userRole:_Admin":
          this.userValidated = true;break;
        case "userRole:_DataSteward":
          {
            var typeClass = this.g[this.context]['rdf:type'][0].value;
            this.userValidated = this.loginData.data.hasOwnProperty('user:hasEditClass') ? this.loginData.data['user:hasEditClass'].find(function (editClass) {
              return editClass.value === typeClass || editClass.value === _this38.context;
            }) != null : false;
          };break;
        default:
          this.userValidated = false;
      }
    };

    return App;
  }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./app.css\"></require>\n  <require from=\"./modalCustomElement\"></require>\n  <require from=\"ObjectKeysValueConverter\"></require>\n  <require from=\"SortedObjectKeysValueConverter\"></require>\n  <div class=\"outer ${theme}\">\n  <style type=\"text/css\">${activeCSS}</style>\n  <div class=\"container ${wait?'wait':''}\">\n  <div class=\"header\">\n  \t  <div class=\"headerBlock\" click.trigger=\"fetchContext(defaultPage,'card')\">\n\t      <img src=\"${defaultIcon}\" class=\"headerLogo link\"/>\n\t  \t  <div class=\"bannerText\">${defaultLabel}</div>\n  \t </div>\n  \t <div class=\"headerBlock\">\n\t  \t  <input type=\"search\" value.bind=\"q\" input.delegate=\"fetchSearch()\" placeholder=\"Search\"/>\n\t   \t  <div class=\"actions mobile\" if.bind=\"loginData.status\">\n\t   \t  \t\t<select value.bind=\"activeGraph\" class=\"classSelector\" change.delegate=\"selectGraph(activeGraph)\">\n\t   \t  \t\t\t<option value=\"\">All Graphs</option>\n\t   \t  \t\t\t<option repeat.for=\"graphType of instanceList['class:_Graph']['rdf:type']\" value.bind=\"graphType.curie\">${graphType.label}</option>\n\t   \t  \t\t</select>\t   \t  \t\n\t   \t  \t\t<select value.bind=\"activeClass\" class=\"classSelector\" change.delegate=\"activateClass(activeClass,'classAction:_View')\">\n\t   \t  \t\t\t<option disabled=\"disabled\" value=\"\">Select a class:</option>\n\t   \t  \t\t\t<option value=\"class:_Class\">Class</option> \n\t   \t  \t\t\t<option value=\"class:_Property\">Property</option> \n\t   \t  \t\t\t<option disabled=\"disabled\" value=\"\">──────────────────</option>\n\t   \t  \t\t\t<option repeat.for=\"classType of instanceList['class:_Class']['rdf:type']\" value.bind=\"classType.curie\">${classType.label}</option>\n\t   \t  \t\t</select>\n\t   \t  \t\t<select value.bind=\"classAction\" class=\"classSelector\" change.delegate=\"activateClass(activeClass,classAction)\">\n\t   \t  \t\t\t<option value=\"classAction:_View\">View</option> \n\t   \t  \t\t\t<option value=\"classAction:_New\">New</option> \n\t   \t  \t\t</select>\n\t   \t  \t\t<div class=\"button\" click.trigger=\"activateClass(activeClass,classAction)\">Go</div>\n\t   \t  </div>\n   \t  </div>\t\n   \t  <div class=\"headerBlock mobile\">\n   \t  \t<div class=\"userFullName\">${loginData.data['term:prefLabel'][0].value}</div>\n   \t  \t<div class=\"button mobile\" click.trigger=\"login()\" if.bind=\"!loginData.status\">Log in</div>\n   \t  \t<div class=\"button mobile\" click.trigger=\"logout()\" if.bind=\"loginData.status\">Log out</div>\n\n\n   \t  </div>  \t  \n  </div>\n  <div class=\"paneContainer\">\n  <div class=\"horizontalPanes\">\t\n  <div class=\"leftPane\">\n<!--\t<div class=\"byline\"> </div>\n\t<div class=\"topics\"> </div>\n\t<div class=\"previousPage\"></div>-->\n  </div>\t\n  <div class=\"centerPane\">\n  <div class=\"display\">\n  \t  <div class=\"modeFrame\">\n  \t  <div class=\"modeButtons\">\n  \t  \t   <div class=\"button\" click.trigger=\"showMenu=!showMenu\">&#x2261; Menu</div>\n  \t  \t   <div class=\"mainMenu ${showMenu?'visible':''}\" click.trigger=\"showMenu=false\" blur.trigger=\"showMenu=false\"> </div>\n  \t  \t   <!--<div class=\"button ${mode==='list'?'selected':''}\" click.trigger=\"setMode('list')\">Links</div>-->\n  \t  \t   <div class=\"button ${mode==='card'?'selected':''}\" click.trigger=\"setMode('card')\">Content</div>\n  \t  \t   <div class=\"button ${mode==='properties'?'selected':''}\" click.trigger=\"setMode('properties')\">Properties</div>\n  \t  \t   <div class=\"button ${mode==='graph'?'selected':''}\" click.trigger=\"setMode('graph')\">Graph</div>\n<!--  \t  \t   <div class=\"button ${mode==='images'?'selected':''}\" click.trigger=\"setMode('images')\">Images</div>-->\n<!--  \t  \t   <div class=\"button ${mode==='compliance'?'selected':''}\" click.trigger=\"setMode('compliance')\">Compliance</div> -->\n<!--  \t  \t   <div class=\"button ${mode==='ingestion'?'selected':''}\" click.trigger=\"setMode('ingestion')\">Ingestion</div>-->\n \t  \t   <div class=\"button ${mode==='sparql'?'selected':''}\" click.trigger=\"setMode('sparql')\" if.bind=\"userRole.has('accountRole:_Sparql')\">SPARQL</div>\n \t  \t   <!--<div class=\"button ${mode==='widgets'?'selected':''}\" click.trigger=\"setMode('widgets')\">Widgets <span class=\"${widgets.count>0?'activeLight':'inactiveLight'}\">&#9830;</span></div>--> \t  \t   \n \t  \t   <div class=\"button ${mode==='namespaces'?'selected':''}\" click.trigger=\"setMode('namespaces')\" if.bind=\"userRole.has('accountRole:_Sparql')\">\nNamespaces</div>\n \t  \t   <div class=\"button ${mode==='search'?'selected':''}\" click.trigger=\"setMode('search')\" if.bind=\"mode==='search'\">Search</div>\n\t   \t  <!--<div class=\"button\" click.trigger=\"fetchContext('page:_About','list',{predicate:'term:hasFolderPage',sortMode:'sortMode:_AlphaAsc'})\">About</div>-->\n\t  \t<div class=\"button\" click.trigger=\"goBack()\">Back</div>\n\t  \t<div class=\"button\" click.trigger=\"goForward()\">Forward</div>\n   \t  \t<div class=\"button\" click.trigger=\"launchService()\" if.bind=\"loginData.status\">JSON</div>\n\t\t<div class=\"button\" click.trigger=\"launchSeo()\" if.bind=\"loginData.status\">SEO</div>\n\t\t<div class=\"button\" click.trigger=\"launchPage()\" if.bind=\"loginData.status\">New Tab</div>\n\t\t<div class=\"button\" click.trigger=\"pinPage(true)\" if.bind=\"loginData.status\">Refresh</div>\n\t\t<div class=\"button\" click.trigger=\"cache='cached'\" if.bind=\"loginData.status\">Cache</div>\n\n   \t  </div>\n      </div>\n\n\n<!--\t<div class=\"properties\"  if.bind=\"mode==='properties' && !cardEdit\">\n\t  \t<div class=\"type link\" click.trigger=\"fetchContext(g[context]['rdf:type'][0].value,'list')\">${g[g[context]['rdf:type'][0].value]['term:prefLabel'][0].value}</div>\n\t\t<div class=\"propertyContextLabel\">${g[context]['term:prefLabel'][0].value}</div>\n\t\t<div class=\"buttons\">\n\t\t\t<div class=\"button\" click.trigger=\"editCardProperties()\" if.bind=\"userValidated\">Edit</div>\n\t\t</div>\n\t\t<div class=\"property\" repeat.for=\"property of keys(g[context], ['term:prefLabel','term:hasPrimaryImageURL','term:hasDescription','term:inGlossary', \n\t\t'term:hasSearchable'])\">\n\t\t  \t<div class=\"label\" title=\"${property}\"\n\t\t  \t>${titleCase((g[property]['term:prefLabel'])?g[property]['term:prefLabel'][0].value:property)}:&nbsp;</div>\n\t\t  \t<div class=\"valueBlock\">\n\t\t\t  \t<div class=\"value\" repeat.for=\"item of wrapArray(g[context][property])\">\n\t\t\t  \t\t<span class=\"link\" if.bind=\"item.type==='uri'\" click.trigger=\"fetchContext(item.value)\">${g[item.value]['term:prefLabel'][0].value}<span if.bind=\"!$last\">,&nbsp;</span>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal'\" title=\"${item.datatype}\"><span innerhtml=\"${displayLiteral(item)}\"\n\t\t\t  \t\t\tcss=\"item.datatype.startsWith('xsd:textLiteral')?'display:block;word-space:pre':''\"></span> \n\t\t\t  \t\t\t<span class=\"link\" click.trigger=\"fetchContext(item.datatype)\" if.bind=\"g[item.datatype]['term:prefLabel'].length > 0 \">[${g[item.datatype][\"term:prefLabel\"][0].value}]</span><span if.bind=\"!$last && $index != 0\">, </span>\n\t\t\t  \t\t</span>\n\t\t\t  \t</div>\n\t\t    </div>\n\t\t  </div>\n\t\t</div>-->\n\n    <div class=\"properties\"  if.bind=\"mode==='properties' && !cardEdit\">\n\t  \t<div class=\"type link\" click.trigger=\"fetchContext(g[context]['rdf:type'][0].value,'list')\">${g[g[context]['rdf:type'][0].value]['term:prefLabel'][0].value}</div>\n\t\t<div class=\"propertyContextLabel\">${g[context]['term:prefLabel'][0].value}</div>\n\t\t<div class=\"buttons\">\n\t\t\t<div class=\"button\" click.trigger=\"editCardProperties()\" if.bind=\"userValidated\">Edit</div>\n\t\t</div>\n\t\t<div class=\"property\" repeat.for=\"property of predicates\" if.bind=\"g[context][property.curie].length > 0\">\n\t\t  \t<div class=\"label\" title=\"${property.curie}\"\n\t\t  \t>${property.fullLabel}</div>\n\t\t  \t<div class=\"valueBlock\">\n\t\t\t  \t<div class=\"value\" repeat.for=\"item of g[context][property.curie]\">\n\t\t\t  \t\t<span class=\"link\" if.bind=\"property.nodeKind === 'nodeKind:_IRI'\" click.trigger=\"fetchContext(item.value)\">${g[item.value]['term:prefLabel'][0].value}<span if.bind=\"!$last\">,&nbsp;</span>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"property.nodeKind === 'nodeKind:_Literal'\" title=\"${item.datatype}\"><span innerhtml=\"${displayLiteral(item)}\"\n\t\t\t  \t\t\tcss=\"item.datatype.startsWith('xsd:textLiteral')?'display:block;word-space:pre':''\"></span> \n\t\t\t  \t\t\t<span class=\"link\" click.trigger=\"fetchContext(item.datatype)\" if.bind=\"g[item.datatype]['term:prefLabel'].length > 0 \">[${g[item.datatype][\"term:prefLabel\"][0].value}]</span> <span if.bind=\"!$last && $index != 0\">, </span>\n\t\t\t  \t\t</span>\n\t\t\t  \t</div>\n\t\t    </div>\n\t\t  </div>\n\t\t</div>\n\n\t<div class=\"properties\"  if.bind=\"mode==='properties' && cardEdit\">\n\t\t<div class=\"propertyContextLabel\">${g[context]['term:prefLabel'][0].value}</div>\n\t\t<div class=\"buttons\">\n\t\t\t<div class=\"button\" click.trigger=\"saveCardProperties()\">Save</div>\n\t\t\t<div class=\"button\" click.trigger=\"addProperty()\">Add Property</div>\n\t\t\t<div class=\"button\" click.trigger=\"revertCard()\">Revert</div>\n\t\t</div>\n<!--\t\t<div class=\"property\" repeat.for=\"property of keys(g[context], ['term:prefLabel','term:hasPrimaryImageURL','term:hasDescription','term:inGlossary','term:hasSearchable'])\"\n\t\t    >-->\n\t\t    <div class=\"property\" repeat.for=\"property of keys(g[context], ['term:prefLabel','term:hasPrimaryImageURL','term:hasDescription','term:inGlossary','term:hasSearchable'])\"\n\t\t    >\n\n\t\t  \t<div class=\"label\" title=\"${property}\">${g[g[property]['rdfs:domain'][0].value]['term:prefLabel'][0].value} ${titleCase((g[property]['term:prefLabel'])?g[property]['term:prefLabel'][0].value:property)}:&nbsp;</div>\n\t\t  \t<div class=\"valueBlock\">\n\t\t\t  \t<div class=\"value\" repeat.for=\"item of wrapArray(g[context][property])\">\n\t\t\t  \t\t<div class=\"link\" if.bind=\"item.type==='uri'\" if.bind=\"linkPropertyList[property]||[]>0\">\n\t\t\t  \t\t\t<!--<select value=\"${item.value}\" mouseover.trigger=\"getTerms(property)\" if.bind=\"!item.deleted\"\n\t\t\t  \t\t\t\t\tchange.delegate=\"updateLink(context,property,item,$event)\">\n\t\t\t  \t\t\t\t<option value=\"${item.value}\" selected=\"selected\">${item.label}</option>\n\t\t\t  \t\t\t\t<option repeat.for=\"term of linkPropertyList[property]||[]\" value.bind=\"term.context\" if.bind=\"term.context != item.value\">${term.value}</option>\n\t\t\t  \t\t\t</select>-->\n\t\t\t  \t\t\t<span class=\"link\">${item.label}</span>\n\t\t\t  \t\t\t<button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</div>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype === 'currency:_USD'\" title=\"${item.datatype}\">\n\t\t\t  \t\t\t$<input type=\"text\" value.bind = \"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype === 'currency:_EUR'\" title=\"${item.datatype}\">\n\t\t\t  \t\t\t&#8364;<input type=\"text\" value.bind = \"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype === 'xsd:dateTime'\" title=\"${item.value}\"> \n\t\t\t  \t\t\t<input type=\"dateTime\" value.bind = \"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype === 'xsd:date'\" title=\"${item.value}\"> \n\t\t\t  \t\t\t<input type=\"date\" value.bind = \"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<div class=\"valueImages\" if.bind=\"item.type==='literal' && item.datatype === 'xsd:imageURL'\" title=\"${item.value}\">\n\t\t\t  \t\t\t<img src=\"${item.value}\" class=\"imageMedium\"/> \n\t\t\t  \t\t\t<div><input type=\"text\" value.bind = \"item.value\" class=\"longInput\"/>\n\t\t\t  \t\t    <button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t\t</div>\n\t\t\t  \t\t</div>\n\t\t\t  \t\t<div class=\"value\" if.bind=\"item.type==='literal' && item.datatype === 'xsd:anyURI'\" title=\"${item.value}\">\n\t\t\t  \t\t\t<div><input type=\"text\" value.bind = \"item.value\" class=\"longInput\"/>\n\t\t\t  \t\t    <button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t\t</div>\n\t\t\t  \t\t</div>\n\t\t\t  \t\t<div class=\"value\" if.bind=\"item.type==='literal' && item.datatype === 'xsd:anyURL'\" title=\"${item.value}\">\n\t\t\t  \t\t\t<div><input type=\"text\" value.bind = \"item.value\" class=\"longInput\"/>\n\t\t\t  \t\t    <button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t\t</div>\n\t\t\t  \t\t</div>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype.startsWith('identifier:')\" title=\"${item.value}\">\n\t\t\t  \t\t\t<input type=\"text\" value.bind = \"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype.startsWith('unit:')\" title=\"${item.value}\">\n\t\t\t  \t\t\t<input type=\"text\" value.bind = \"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype.startsWith('xsd:string')\" title=\"${item.value}\">\n\t\t\t  \t\t\t<input type=\"text\" value.bind = \"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype.startsWith('xsd:curie')\" title=\"${item.value}\">\n\t\t\t  \t\t\t<input type=\"text\" value.bind = \"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype.startsWith('xsd:hours')\" title=\"${item.value}\">\n\t\t\t  \t\t\t<input type=\"text\" value.bind = \"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype.startsWith('xsd:integer')\" title=\"${item.value}\">\n\t\t\t  \t\t\t<input type=\"number\" value.bind = \"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype.startsWith('xsd:float')\" title=\"${item.value}\">\n\t\t\t  \t\t\t<input type=\"number\" value.bind = \"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype.startsWith('xsd:currency_usd')\" title=\"${item.value}\">\n\t\t\t  \t\t\t<input type=\"number\" value.bind = \"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype.startsWith('xsd:htmlLiteral')\" title=\"${item.value}\">\n\t\t\t\t  \t\t<div class=\"bodyEditor\" innerhtml.two-way=\"item.value\" contenteditable=\"true\"></div>\n\t\t\t\t  \t\t<button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype.startsWith('xsd:textLiteral')\" title=\"${item.value}\">\n\t\t\t\t  \t\t<textarea class=\"bodyEditor\" value.bind=\"item.value\"></textarea>\n\t\t\t\t  \t\t<button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype.startsWith('xsd:gYear')\" title=\"${item.value}\">\n\t\t\t  \t\t\t<input type=\"number\" value.bind = \"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype.startsWith('xsd:hexColor')\" title=\"${item.value}\">\n\t\t\t  \t\t\t<input type=\"color\" value.bind = \"item.value\"/><input type=\"string\" value.bind=\"item.value\"/><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal' && item.datatype.startsWith('xsd:boolean')\" title=\"${item.value}\">\n\t\t\t  \t\t\t<select value.bind=\"item.value\">\n\t\t\t  \t\t\t\t<option value=\"true\">Yes</option>\n\t\t\t  \t\t\t\t<option value=\"false\">No</option>\n\t\t\t  \t\t\t</select><button click.trigger=\"deleteItem($index,g[context][property])\">X</button>\n\t\t\t  \t\t</span>\n\t\t\t  \t</div>\n\t\t\t  \t<button click.trigger=\"addProperty(property)\"><span>&#8226;</span></button>\n\t\t\t\t<!--<button click.trigger = \"addExistingPropertyValue(property)\" repeat.for=\"cardinality of g[property]['property:hasCardinality']\"\n\t\t\t\t if.bind=\"cardinality.value === 'cardinality:_ZeroOrMore' || cardinality.value === 'cardinality:_OneOrMore'\">+</button>-->\n\t\t    </div>\n\t\t  </div>\n\t\t</div>\n\n\t  <div class=\"list\" if.bind=\"(['list','images']).includes(mode)\">\n\t  \t<!--<div class=\"type link\" click.trigger=\"fetchContext(g[context]['rdf:type'][0].value,'list')\">${g[g[context]['rdf:type'][0].value]['term:prefLabel'][0].value}</div>-->\n\t\t<h1 class=\"propertyContextLabel\">${g[context]['term:prefLabel'][0].value||'Loading ...'}</h1>\n\t\t<div class=\"imageHeader\">\n\t\t\t<div>\n\t\t\t\t<img class=\"cardImage\" src=\"${g[context]['term:hasPrimaryImageURL'][0].value||missingImage}\"/>\n\t\t\t\t<div class=\"largeColorSwatch\" css=\"background-color:${g[context]['color:hasColorHexValue'][0].value}\" if.bind=\"g[context].hasOwnProperty('color:hasColorHexValue')\">&nbsp;</div>\n\t\t\t</div> \n\t\t  \t<div class=\"summaryContainer\">\n\t\t\t\t<div class=\"summary\" innerHTML=\"${g[context].hasOwnProperty('term:hasSummary')?g[context]['term:hasSummary'][0].value:summaryFilter(g[context]['term:hasDescription'][0].value)}\"> </div>\n\t\t\t\t<div class=\"button\" click.trigger=\"fetchContext(context,'card')\">Read More</div>\n\t\t\t\t<div class=\"button\" click.trigger=\"launchURL(g[context]['term:hasExternalURL'][0].value)\"\n\tif.bind=\"g[context]['term:hasExternalURL'][0].value != ''\">See Source</div>\n\t  \t  \t   <!--<div class=\"button ${mode==='graph'?'selected':''}\" click.trigger=\"setMode('graph')\">Graph</div>-->\n\t\t\t</div>\n\t\t\t<ul class=\"backLinks\" if.bind=\"loginData.status\">\n\t\t\t\t<li class=\"backLink\" \n\t\t\t\t\trepeat.for=\"predicate of keys(g[context],['term:hasPublicationStatus'])\"\n\t\t\t\t\tif.bind=\"(g[context][predicate][0].type === 'uri')\">\n\t\t\t\t\t<span>${g[predicate]['term:prefLabel'][0].value}</span>\n\t\t\t\t\t<span class=\"link\" click.trigger=\"fetchContext(object.value,'card')\"\n\t\t\t\t\t repeat.for=\"object of wrapArray(g[context][predicate])\"\n\t\t\t\t\t>${g[object.value]['term:prefLabel'][0].value}<span if.bind=\"!$last\">, </span></span>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\n<!--\t\t<ul class=\"backLinks\">\n\t\t\t<li class=\"backLink\" \n\t\t\t\trepeat.for=\"predicate of keys(g[context],['term:hasPublicationStatus','rdfs:subClassOf','term:hasSourceTerm'])\"\n\t\t\t\tif.bind=\"g[context][predicate][0].type === 'uri'\">\n\t\t\t\t<span>${g[predicate]['term:prefLabel'][0].value}</span>\n\t\t\t\t<span class=\"link\" click.trigger=\"fetchContext(object.value,'list')\"\n\t\t\t\t repeat.for=\"object of wrapArray(g[context][predicate])\"\n\t\t\t\t>${g[object.value]['term:prefLabel'][0].value}<span if.bind=\"!$last\">, </span></span>\n\t\t\t</li>\n\t\t</ul>\t\t\n\t  \t<div class=\"imageHeader\">\n\t\t  \t<div class=\"imageContainer\">\n\t\t  \t\t<img src.bind=\"g[context]['term:hasPrimaryImageURL'][0].value\" class=\"thumbImage\"/>\n\t\t  \t</div>\n\t\t  \t<div class=\"summaryContainer\">\n\t\t\t\t<div class=\"summary\" innerhtml.bind=\"summary(g[context]['term:hasDescription'][0].value)\"> </div>\n\t\t\t\t<div class=\"button\" click.trigger=\"fetchContext(context,'card')\">More</div>\n\t\t\t</div>\n\t\t</div>-->\t\t\t  \t\t\n\n\n\t  \t<div class=\"buttons\"  if.bind=\"userRole.has('accountRole:_Create')\">\n\t\t  \t<div class=\"button\" click.trigger=\"newCard()\" if.bind=\"context.startsWith('class:') && userRole.has('accountRole:_Create')\">New ${g[context]['term:prefLabel'][0].value}</div>\n\t\t  \t<div class=\"button\" click.trigger=\"newCard(context,true)\" if.bind=\"context.startsWith('class:') && userRole.has('accountRole:_Create')\">New Property</div>\n\t\t  \t<!--<div class=\"button\" click.trigger=\"newCard(g[activeLinkPredicate]['rdfs:domain'][0].value,false,context)\" if.bind=\"(!context.startsWith('class:')) && userRole.has('accountRole:_Create')\">New ${g[g[activeLinkPredicate]['rdfs:domain'][0].value]['term:prefLabel'][0].value}</div>-->\n  \t\t  \t<div class=\"button\" click.trigger=\"newCard(preferredClass.curie,false,preferredProperty||activeLinkPredicate,context)\" if.bind=\"(!context.startsWith('class:')) && userRole.has('accountRole:_Create')\" repeat.for=\"preferredClass of getPreferredClasses(context)\">New ${preferredClass.label}</div>\n\t \t\t<div class=\"button\" click.trigger=\"editCard('edit')\" if.bind=\"userRole.has('accountRole:_Edit')\">Edit</div>\n\t\t\t<div class=\"button\" click.trigger=\"editCard('duplicate')\" if.bind=\"userRole.has('accountRole:_Edit')\">Duplicate</div>\n\t\t\t<div class=\"button\" click.trigger=\"deleteCard()\" if.bind=\"userRole.has('accountRole:_Delete') && (context != 'class:_Class') && (context != 'class:_Property')\">Delete</div>\n \t\t  \t\n\t\t  \t<div class=\"button\" click.trigger=\"deleteClassItems(false)\" if.bind=\"context.startsWith('class:') && userRole.has('accountRole:_Delete')  && (context != 'class:_Class') && (context != 'class:_Property')\">Clear Items In ${g[context]['term:prefLabel'][0].value}</div>\n\t\t  \t<div class=\"button\" click.trigger=\"deleteClassItems(true)\" if.bind=\"context.startsWith('class:') && userRole.has('accountRole:_Delete')  && (context != 'class:_Class') && (context != 'class:_Property')\">Delete Class, Properties and Items In ${g[context]['term:prefLabel'][0].value}</div>\n\t\t</div>\n\n\t  <!--<div class=\"tabs\">\n\t     <div class=\"tab ${(predicate.curie === activeLinkPredicate)?'active':''}\" repeat.for=\"predicate of filterListPredicates(predicates)\" click.trigger=\"activateTab(predicate.curie)\"\n\t     if.bind=\"filterListPredicates(predicates).length>0\"\n\t     title=\"${predicate.curie}\">\n\t\t   ${predicate.domainLabel } ${predicate.label} ${g[context].hasOwnProperty('class:hasPluralName')?g[context]['class:hasPluralName'][0].value:g[context]['term:prefLabel'][0].value}\n\t\t  </div>\n\t  </div>-->\t\n\t  <div class=\"listRefine\" if.bind=\"activePredicates.length>0\">\n\n\t  \t\t<div class=\"property\">\n\t  \t\t\t<span class=\"label\">Sort Order</span>\n\t  \t\t\t\t<select value.bind=\"sortMode\" change.delegate=\"sort()\">\n\t\t\t  \t\t\t<option repeat.for=\"sortModeState of sortModeStates\" value.bind = \"sortModeState.value\">${sortModeState.label}</option>\n\t\t\t  \t\t</select>\n\t  \t\t</div>\n\t  \t\t<div class=\"property\">\n\t  \t\t\t<span class=\"label\">Refine</span>\n\t\t  \t\t<input type=\"search\" class=\"value\" value.bind=\"qRefine\" placeholder=\"Search in List\" input.delegate=\"activateTab(activeLinkPredicate,true)\"/>\n\t\t  \t</div>\n\t  \t</div>\n\n\t  \t\t<div class=\"itemCount\" if.bind=\"loginData.status && activeLinksData.count>0\">Total Number of Items = ${activeLinksData.count}</div>\n<!--\t\t  \t<div class=\"constraintsBlock\" >\n\t\t  \t\t<div class=\"buttons\">\n\t\t  \t\t\t<button click.trigger=\"newConstraint()\" class=\"button\">Add Constraint</button>\n\t\t  \t\t\t<button click.trigger=\"clearConstraints()\" class=\"button\">Clear Constraints</button>\n\t\t  \t\t</div>\n\t\t  \t\t<div class=\"contraints\">\n\t\t  \t\t\t<div class=\"constraint property\" repeat.for=\"constraint of constraints\">\n\t\t  \t\t\t\t<button click.trigger=\"removeConstraint($index)\">X</button>\n\t\t  \t\t\t\t<div class=\"constraintProperty label\">&nbsp;${constraint.label}: &nbsp;</div>\n\t\t  \t\t\t\t<div class=\"constraintValue value\">${constraint.objectLabel}</div>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t  \t</div>-->\n\t  \t<!-- links.sjs implementation -->\n\t  <div class=\"tabs predicateTabs\"  if.bind='predicates.length>0'>\n\t  \t <!--<div class=\"button\" title=\"This hides or shows the properties that dictate what gets seen in the list view. This is useful for better exploring the information space.\"\n\t  \t click.trigger=\"showProperties = ! showProperties\" class=\"settingsIcon\"><img src=\"https://cdn3.iconfinder.com/data/icons/musthave/256/Settings.png\" class=\"settingsIcon\"/></div>-->\n\t  \t <select value.bind=\"activeLinkPredicate\" change.delegate=\"activateTab(activeLinkPredicate)\" click.trigger=\"activateTab(activeLinkPredicate)\"  class=\"classSelector\" if.bind=\"showProperties\">\n<!--\t  \t \t <option  repeat.for=\"predicate of activePredicates\" if.bind=\"showProperties\" value.bind=\"predicate.curie\" >Each Item ${article(titleCase(predicate.label),g[context]['term:prefLabel'][0].value)} ${g[context]['term:prefLabel'][0].value}</option> -->\n\t\t\t\t <option  repeat.for=\"predicate of activePredicates\" if.bind=\"showProperties && predicate.curie != 'rdf:type'\" value.bind=\"predicate.curie\" >${predicate.domainLabel}s</option>\n\t\t\t\t <option  repeat.for=\"predicate of activePredicates\" if.bind=\"showProperties && predicate.curie === 'rdf:type'\" value.bind=\"predicate.curie\">${g[context]['class:hasPluralName'][0].value}</option>\n\t  \t </select>\n\t  </div>\n\t  \t<div class=\"linksContainer\"  if.bind=\"mode === 'list'\">\n\t  \t\t<div class=\"linkContainer\" repeat.for=\"item of activeLinksData.data\" if.bind=\"loginData.status || (!loginData.status && item.publicationStatus === 'publicationStatus:_Published')\">\n\t  \t\t\t<div class=\"link iconContainer\"><div class=\"iconSubcontainer\"><img src=\"${item.image||missingImage}\" click.trigger=\"fetchContext(item.link,'list')\" class=\"linkImage\"/></div>\n\t  \t\t\t<!--<div  class=\"link colorIcon \"\n\t  \t\t\tif.bind=\"g[link].hasOwnProperty('color:hasColorHexValue')\"\n\t  \t\t\t click.trigger=\"fetchContext(link,'list')\"\n\t  \t\t\tcss=\"background-color:${g[link]['color:hasColorHexValue'][0].value}\">&nbsp;</div>-->\n\t  \t\t</div>\n\t  \t\t<div class=\"linkMeta\">\n\t\t  \t\t<span click.trigger=\"fetchContext(item.link,'list')\" class=\"link\">${item.linkLabel}</span>\n\t\t  \t\t<div class=\"linkDate\">${displayLiteral({value:item.lastModifiedDate,type:'literal',datatype:'xsd:dateTime'})}</div>\n\t\t  \t\t<div class=\"linkDescription\" innerHTML=\"${item.summary != null?item.summary:summaryFilter(item.description)}\"></div>\n\t\t  \t\t<div class=\"button\" click.delegate=\"launchPage(item.link,'card')\" if.bind=\"loginData.status\">Content</div>\n\t\t\t\t<div class=\"button\" click.delegate=\"launchPage(item.link,'properties')\"\n\t\t  \t\t\t if.bind=\"loginData.status\">Properties</div>\n\t\t  \t\t<div class=\"button\" if.bind=\"loginData.status\">${item.publicationStatus.split(':_')[1]}</div>\t \n\t  \t\t</div>\n  \t\t</div>\n  \t</div>\n\t <div class=\"imageFrame\" if.bind=\"mode === 'images'\">\n\t  \t<div repeat.for=\"item of activeLinksData.data\" class=\"imageContainer\">\n\t  \t\t<div class=\"imagesEntry\">\n\t  \t\t<img src.bind=\"item.image||missingImage\" click.trigger=\"fetchContext(item.link,'list')\" class=\"thumbImage link\"\n\t  \t\ttitle.bind=\"item.linkLabel\"/>\n\t  \t\t<!--<div click.trigger=\"fetchContext(item.link,'list')\" class=\"link imageCaption\">${item.linkLabel}.&nbsp;</div>-->\n\t  \t\t</div>\n\t  \t</div>\n\t  </div>\n\n\n\t  \t<div class=\"pager\" if.bind=\"!(activeLinksData.page >= activeLinksData.totalPages) &&  activeLinksData.count>0\"><span class=\"link\" click.trigger=\"setPage(1)\">|&#9664;</span> <span class=\"link\" click.trigger=\"prevRefPage()\">&#9664;</span> Page ${page} of ${totalPages} <span class=\"link\" click.trigger=\"nextRefPage()\">&#9654;</span> <span class=\"link\" click.trigger=\"setPage(totalPages)\">&#9654;|</span></div>\n\n\t  </div> \n\n\n\n\n\n\n\t<div if.bind=\"mode==='graph'\">\n \t  <div class=\"graphBody\">\n\t \t  <div class=\"notice\">Click nodes once to expand graph, twice to jump to node entry.</div>\n\t \t  <div class=\"graphBar\">\n\t \t  <button click.trigger=\"graphToContext()\">Go</button>\n\t \t  <input keyup.delegate=\"graphQ($event)\" value.bind=\"qGraph\" title=\"Filter links to selected node. Press RETURN to retrieve.\"></button>\n\t \t</div>\n\t  </div>\n \t  <!--<div><input type=\"search\" placeholder=\"Refine the selected item.\" value.bind=\"qGraph\" input.delegate=\"searchGraph()\"></input></div>-->\n \t  <div class=\"iframeContainer\"><iframe src=\"${server}/app/graphview/index.html?context=${context}\" class=\"graph\" id=\"graph\"></iframe></div>\n \t</div>\n\n\n   <div class=\"card\"  if.bind=\"(mode==='card') && (cardEdit === false)\">\n   \t<!--<div class=\"topBanner link\" innerhtml.bind=\"topBannerMessage\" click.trigger=\"fetchContext(defaultPage)\"></div>-->\t\n\t<div class=\"buttons\" if.bind=\"userValidated\">\t\n\t    <div class=\"button\" click.trigger=\"newCard()\" if.bind=\"context.startsWith('class:')\">New ${g[context]['term:prefLabel'][0].value}</div>\n<!--\t    <div class=\"button\" click.trigger=\"newCard(g[context]['rdf:type'][0].value)\" if.bind=\"!context.startsWith('class:')  && userRole.has('accountRole:_Create')\">New ${g[g[context]['rdf:type'][0].value]['term:prefLabel'][0].value}</div>-->\n\t  \t<div class=\"button\" click.trigger=\"newCard(preferredClass.curie,false,preferredProperty||activeLinkPredicate,context)\" if.bind=\"(!context.startsWith('class:'))\" repeat.for=\"preferredClass of getPreferredClasses(context)\">New ${preferredClass.label}</div>\n\t\t<!--<div class=\"button\" click.trigger=\"editCard('edit')\" if.bind=\"userRole.has('accountRole:_Edit')\">Edit</div>-->\n\t\t<div class=\"button\" click.trigger=\"editCard('edit')\" if.bind=\"userRole.has('accountRole:_Edit')\">Edit</div>\n\t\t<div class=\"button\" click.trigger=\"editCard('duplicate')\" if.bind=\"userRole.has('accountRole:_Edit')\">Duplicate</div>\n\t\t<div class=\"button\" click.trigger=\"deleteCard()\" if.bind=\"userRole.has('accountRole:_Delete') && (context != 'class:_Class') && (context != 'class:_Property')\">Delete</div>\n\t\t<!--<div class=\"button\" click.trigger=\"newCard()\" if.bind=\"context.startsWith('class:') && userRole.has('accountRole:_Create')\">New ${g[context]['term:prefLabel'][0].value}</div>-->\n\t\t<div class=\"button\" click.trigger=\"newCard(context,true)\" if.bind=\"context.startsWith('class:')\">New Property</div>\n\t\t<!--<div class=\"button\" click.trigger=\"launchPage()\">External</div>-->\n\t</div>\n   \t<div class=\"widgetsContainer\" innerhtml.bind=\"widgets.output.join('')\" if.bind=\"!loginData.status\">&nbsp;</div>\n   \t<div if.bind=\"loginData.status  || widgets.count === 0\">\n\t<div class=\"pageNavigators\">\n\t\t<div class=\"button\" if.bind=\"g[context].hasOwnProperty('page:hasPreviousPage') && g[context]['page:hasPreviousPage'][0].value != 'page:_'\" click.trigger=\"fetchContext(g[context]['page:hasPreviousPage'][0].value)\">Previous Page</div>\n\t\t<div class=\"button\" if.bind=\"g[context].hasOwnProperty('page:hasNextPage') && g[context]['page:hasNextPage'][0].value != 'page:_'\" click.trigger=\"fetchContext(g[context]['page:hasNextPage'][0].value)\">Next Page</div>\t\t\n\t</div>\n\t<div class=\"imageHeader\">\n\t\t<div>\n\t\t\t<img class=\"cardImage\" src=\"${g[context]['term:hasPrimaryImageURL'][0].value||missingImage}\"/>\n\t\t\t<div class=\"largeColorSwatch\" css=\"background-color:${g[context]['color:hasColorHexValue'][0].value}\" if.bind=\"g[context].hasOwnProperty('color:hasColorHexValue')\">&nbsp;</div>\n\t\t</div>\n\t\t<div> \n\t\t<ul class=\"backLinks\" ><span class=\"title\">${g[context]['term:prefLabel'][0].value}</span>\n\t\t\t<li class=\"backLink\" \n\t\t\t\trepeat.for=\"predicate of keys(g[context],['term:hasPublicationStatus'])\"\n\t\t\t\tif.bind=\"g[context][predicate][0].type === 'uri'\">\n\t\t\t\t<span>${g[predicate]['term:prefLabel'][0].value}</span>\n\t\t\t\t<span class=\"link\" click.trigger=\"fetchContext(object.value,'card')\"\n\t\t\t\t repeat.for=\"object of wrapArray(g[context][predicate])\"\n\t\t\t\t>${g[object.value]['term:prefLabel'][0].value}<span if.bind=\"!$last\">, </span></span>\n\t\t\t</li>\n\t\t</ul>\n\t\t<!--<div class=\"button\" click.trigger=\"fetchContext(context,'list')\">Links</div>-->\n  \t  \t<!--<div class=\"button ${mode==='graph'?'selected':''}\" click.trigger=\"setMode('graph')\">Graph</div>-->\n\t\t</div>\n\t</div>\n  \t<!--<div class=\"type link\" click.trigger=\"fetchContext(g[context]['rdf:type'][0].value,'list')\">${g[g[context]['rdf:type'][0].value]['term:prefLabel'][0].value}</div>-->\n\t<h1>${g[context]?g[context]['term:prefLabel'][0].value:\"Loading\"}</h1>\n\t<div class=\"description  expanded\">\n\t\t<div class=\"bodyDisplay\" repeat.for=\"descrKey of ['term:hasDescription']\" innerHTML=\"${filterBody(g[context][descrKey][0].value)}\"></div>\n\t\t<div class=\"button\" click.trigger=\"launchURL(g[context]['term:hasExternalURL'][0].value)\"\n\t\tif.bind=\"g[context]['term:hasExternalURL'][0].value != ''\">See Source</div>\n\t</div>\n\t<hr/>\n    </div>\n\n<!-- Start links -->\n\t  <div class=\"tabs predicateTabs\"  if.bind='predicates.length>0'>\n\t  \t <!--<div class=\"button\" title=\"This hides or shows the properties that dictate what gets seen in the list view. This is useful for better exploring the information space.\"\n\t  \t click.trigger=\"showProperties = ! showProperties\" class=\"settingsIcon\"><img src=\"https://cdn3.iconfinder.com/data/icons/musthave/256/Settings.png\" class=\"settingsIcon\"/></div>-->\n\t  \t <select value.bind=\"activeLinkPredicate\" change.delegate=\"activateTab(activeLinkPredicate)\" click.trigger=\"activateTab(activeLinkPredicate)\"  class=\"classSelector\" if.bind=\"showProperties\">\n\t\t\t <option  repeat.for=\"predicate of activePredicates\" if.bind=\"showProperties\" value.bind=\"predicate.curie\" ><div class=\"predicateTarget\">${predicate.dropLabel}</div></option>\n\t  \t </select>\n\t  </div>\t    \n\t  <div class=\"listRefine\" if.bind=\"activePredicates.length>0\">\n\n\t  \t\t<div class=\"property\">\n\t  \t\t\t<span class=\"label\">Sort Order</span>\n\t  \t\t\t\t<select value.bind=\"sortMode\" change.delegate=\"sort()\">\n\t\t\t  \t\t\t<option repeat.for=\"sortModeState of sortModeStates\" value.bind = \"sortModeState.value\">${sortModeState.label}</option>\n\t\t\t  \t\t</select>\n\t  \t\t</div>\n\t  \t\t<div class=\"property\">\n\t  \t\t\t<span class=\"label\">Refine</span>\n\t\t  \t\t<input type=\"search\" class=\"value\" value.bind=\"qRefine\" placeholder=\"Search in List\" input.delegate=\"activateTab(activeLinkPredicate,true)\"/>\n\t\t  \t</div>\n\t\t</div>\n\t\t<div class=\"constraintsBlock\" if.bind=\"loginData.status\">\n\t\t  \t\t<div class=\"buttons\">\n\t\t  \t\t\t<button click.trigger=\"newConstraint()\" class=\"button\">Add Filter</button>\n\t\t  \t\t\t<button click.trigger=\"clearConstraints()\" class=\"button\">Clear Filters</button>\n\t\t  \t\t</div>\n\t\t  \t\t<div class=\"contraints\">\n\t\t  \t\t\t<div class=\"constraint property\" repeat.for=\"constraint of constraints\">\n\t\t  \t\t\t\t<button click.trigger=\"removeConstraint($index)\">X</button>\n\t\t  \t\t\t\t<div class=\"constraintProperty label\">&nbsp;${constraint.label}: &nbsp;</div>\n\t\t  \t\t\t\t<div class=\"constraintValue value\">${constraint.objectLabel}</div>\n\t\t  \t\t\t</div>\n\t\t  \t\t</div>\n\t\t</div>\t  \t\n\t  \t<div class=\"itemCount\" if.bind=\"loginData.status && activeLinksData.count>0\">Total Number of Items = ${activeLinksData.count}</div>\n     \t<div class=\"altLinksContent\" innerhtml.bind=\"linksContent\"></div>\n\t  \t<div class=\"linksContainer\"  if.bind=\"mode === 'card' && linksContent === ''\">\n\t  \t\t<div class=\"linkContainer\" repeat.for=\"item of activeLinksData.data\" if.bind=\"loginData.status || (!loginData.status && item.publicationStatus === 'publicationStatus:_Published')\">\n\t  \t\t\t<div class=\"link iconContainer\"><div class=\"iconSubcontainer\"><img src=\"${item.image||missingImage}\" click.trigger=\"fetchContext(item.link,'card')\" class=\"linkImage\"/></div>\n\t  \t\t\t<!--<div  class=\"link colorIcon \"\n\t  \t\t\tif.bind=\"g[link].hasOwnProperty('color:hasColorHexValue')\"\n\t  \t\t\t click.trigger=\"fetchContext(link,'list')\"\n\t  \t\t\tcss=\"background-color:${g[link]['color:hasColorHexValue'][0].value}\">&nbsp;</div>-->\n\t  \t\t</div>\n\t  \t\t<div class=\"linkMeta\"> \t\n\t\t  \t\t<span click.trigger=\"fetchContext(item.link,'card')\" class=\"link\">${item.linkLabel}</span>\n\t\t  \t\t<div class=\"linkDate\">${displayLiteral({value:item.lastModifiedDate,type:'literal',datatype:'xsd:dateTime'})}</div>\n\t\t  \t\t<div class=\"linkDescription\" innerHTML=\"${item.summary != null?item.summary:summaryFilter(item.description)}\"></div>\n\t\t  \t\t<div class=\"button\" click.trigger=\"deleteCard(item.link,item.linkType)\" if.bind=\"userRole.has('accountRole:_Delete') && (context != 'class:_Class') && (context != 'class:_Property')\">Delete</div>\n\t\t  \t\t<div class=\"button\" click.delegate=\"launchPage(item.link,'card')\" if.bind=\"loginData.status\">Content &#8594;</div>\n\t\t\t\t<div class=\"button\" click.delegate=\"launchPage(item.link,'properties')\"\n\t\t  \t\t\t if.bind=\"loginData.status\">Properties &#8594;</div>\n\t\t  \t\t<div class=\"button\" if.bind=\"loginData.status\">${item.publicationStatus.split(':_')[1]}</div>\t \n\t  \t\t</div>\n  \t\t</div>\n  \t</div>\n\t <div class=\"imageFrame\" if.bind=\"mode === 'images'\">\n\t  \t<div repeat.for=\"item of activeLinksData.data\" class=\"imageContainer\">\n\t  \t\t<div class=\"imagesEntry\">\n\t  \t\t<img src.bind=\"item.image||missingImage\" click.trigger=\"fetchContext(item.link,'card')\" class=\"thumbImage link\"\n\t  \t\ttitle.bind=\"item.linkLabel\"/>\n\t  \t\t<!--<div click.trigger=\"fetchContext(item.link,'list')\" class=\"link imageCaption\">${item.linkLabel}.&nbsp;</div>-->\n\t  \t\t</div>\n\t  \t</div>\n\t  </div>\n\n\n\t  \t<div class=\"pager\" if.bind=\"!(activeLinksData.page >= activeLinksData.totalPages) &&  activeLinksData.count>0\"><span class=\"link\" click.trigger=\"setPage(1)\">|&#9664;</span> <span class=\"link\" click.trigger=\"prevRefPage()\">&#9664;</span> Page ${page} of ${totalPages} <span class=\"link\" click.trigger=\"nextRefPage()\">&#9654;</span> <span class=\"link\" click.trigger=\"setPage(totalPages)\">&#9654;|</span></div>\n\n<!-- End links -->\t\n  </div>\n\n  <div class=\"card\"  if.bind=\"mode==='card' && cardEdit === true\">\n\t<div class=\"buttons\">\n\t\t<div class=\"button\" click.trigger=\"saveCardProperties()\" if.bind=\"editMode === 'edit'\">Save</div>\n\t\t<div class=\"button\" click.trigger=\"saveDuplicateCardProperties()\" if.bind=\"editMode === 'duplicate'\">Save</div>\n\t\t<div class=\"button\" click.trigger=\"revertCard()\">Cancel</div>\n\t</div>\n\t<div class=\"property\">\n\t\t<div class=\"dlg-label\">Title</div>\n\t\t<div if.bind=\"editMode === 'duplicate'\" ><input type=\"text\" class=\"cardTitle longInput\" value.bind=\"activeCard.title\" input.delegate=\"generateEntityId(context)\"></div>\n\t\t<div if.bind=\"editMode === 'edit'\" ><input type=\"text\" class=\"cardTitle longInput\" value.bind=\"activeCard.title\"></input></div>\n\t</div>\n\t<div class=\"property\">\n\t\t<div class=\"dlg-label\">Curie</div>\n\t\t<div class=\"curie\"><input value.bind=\"activeCard.curie\"></div>\n<!--\t\t<div class=\"curie\" contenteditable=\"true\"  innerhtml.two-way=\"activeCard.curie\" placeholder=\"Condensed URI or Curie\"></div>-->\n\t</div>\n\t<img class=\"cardImage\" src=\"${activeCard.image}\"/>\n\t<div><span class=\"label\">Image URL: </span><input value.two-way=\"activeCard.image\" class=\"primaryImageEditField longInput\" input.delegate=\"createImageFile(activeCard.curie)\"/>\n\t\t<input type=\"file\" change.trigger=\"setImage($event)\"/>\n\t</div>\n\t<div class=\"property\">\n\t\t<div class=\"dlg-label\">External URL</div>\n\t\t<div class=\"dlg-value\"><input value.two-way=\"activeCard.externalURL\" class=\"longInput\" title=\"Clear to remove link\"/></div>\n\t</div>\n\t<div class=\"editorBlock\">\n\t\t<div class=\"description expanded\">\n\t\t\t<div class=\"bodyEditor\" innerhtml.two-way=\"activeCard.body\" contenteditable=\"true\"></div>\n\t\t</div>\n\t\t<div class=\"editorButtonsPane\">\n\t\t<div class=\"editorButtons\">\n\t\t\t<button><img class=\"intLink\" title=\"Undo\" click.trigger=\"formatDoc('undo')\" src=\"data:image/gif;base64,R0lGODlhFgAWAOMKADljwliE33mOrpGjuYKl8aezxqPD+7/I19DV3NHa7P///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARR8MlJq7046807TkaYeJJBnES4EeUJvIGapWYAC0CsocQ7SDlWJkAkCA6ToMYWIARGQF3mRQVIEjkkSVLIbSfEwhdRIH4fh/DZMICe3/C4nBQBADs=\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Redo\" click.trigger=\"formatDoc('redo')\" src=\"data:image/gif;base64,R0lGODlhFgAWAMIHAB1ChDljwl9vj1iE34Kl8aPD+7/I1////yH5BAEKAAcALAAAAAAWABYAAANKeLrc/jDKSesyphi7SiEgsVXZEATDICqBVJjpqWZt9NaEDNbQK1wCQsxlYnxMAImhyDoFAElJasRRvAZVRqqQXUy7Cgx4TC6bswkAOw==\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Bold\" click.trigger=\"formatDoc('bold')\" src=\"data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAInhI+pa+H9mJy0LhdgtrxzDG5WGFVk6aXqyk6Y9kXvKKNuLbb6zgMFADs=\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Italic\" click.trigger=\"formatDoc('italic')\" src=\"data:image/gif;base64,R0lGODlhFgAWAKEDAAAAAF9vj5WIbf///yH5BAEAAAMALAAAAAAWABYAAAIjnI+py+0Po5x0gXvruEKHrF2BB1YiCWgbMFIYpsbyTNd2UwAAOw==\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Underline\" click.trigger=\"formatDoc('underline')\" src=\"data:image/gif;base64,R0lGODlhFgAWAKECAAAAAF9vj////////yH5BAEAAAIALAAAAAAWABYAAAIrlI+py+0Po5zUgAsEzvEeL4Ea15EiJJ5PSqJmuwKBEKgxVuXWtun+DwxCCgA7\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Left align\" click.trigger=\"formatDoc('justifyleft')\" src=\"data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw==\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Center align\" click.trigger=\"formatDoc('justifycenter')\" src=\"data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Right align\" click.trigger=\"formatDoc('justifyright')\" src=\"data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw==\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Numbered list\" click.trigger=\"formatDoc('insertorderedlist')\" src=\"data:image/gif;base64,R0lGODlhFgAWAMIGAAAAADljwliE35GjuaezxtHa7P///////yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKSespwjoRFvggCBUBoTFBeq6QIAysQnRHaEOzyaZ07Lu9lUBnC0UGQU1K52s6n5oEADs=\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Dotted list\" click.trigger=\"formatDoc('insertunorderedlist')\" src=\"data:image/gif;base64,R0lGODlhFgAWAMIGAAAAAB1ChF9vj1iE33mOrqezxv///////yH5BAEAAAcALAAAAAAWABYAAAMyeLrc/jDKSesppNhGRlBAKIZRERBbqm6YtnbfMY7lud64UwiuKnigGQliQuWOyKQykgAAOw==\" /></button>\n\t\t\t\t<button><img class=\"intLink\" title=\"Hyperlink\" click.trigger=\"createHyperlink()\" src=\"data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Quote\" click.trigger=\"formatDoc('formatblock','blockquote')\" src=\"data:image/gif;base64,R0lGODlhFgAWAIQXAC1NqjFRjkBgmT9nqUJnsk9xrFJ7u2R9qmKBt1iGzHmOrm6Sz4OXw3Odz4Cl2ZSnw6KxyqO306K63bG70bTB0rDI3bvI4P///////////////////////////////////yH5BAEKAB8ALAAAAAAWABYAAAVP4CeOZGmeaKqubEs2CekkErvEI1zZuOgYFlakECEZFi0GgTGKEBATFmJAVXweVOoKEQgABB9IQDCmrLpjETrQQlhHjINrTq/b7/i8fp8PAQA7\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Add indentation\" click.trigger=\"formatDoc('outdent')\" src=\"data:image/gif;base64,R0lGODlhFgAWAMIHAAAAADljwliE35GjuaezxtDV3NHa7P///yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKCQG9F2i7u8agQgyK1z2EIBil+TWqEMxhMczsYVJ3e4ahk+sFnAgtxSQDqWw6n5cEADs=\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Delete indentation\" click.trigger=\"formatDoc('indent')\" src=\"data:image/gif;base64,R0lGODlhFgAWAOMIAAAAADljwl9vj1iE35GjuaezxtDV3NHa7P///////////////////////////////yH5BAEAAAgALAAAAAAWABYAAAQ7EMlJq704650B/x8gemMpgugwHJNZXodKsO5oqUOgo5KhBwWESyMQsCRDHu9VOyk5TM9zSpFSr9gsJwIAOw==\" /></button>\n\t\t\n\t\t\t<button><img class=\"intLink\" title=\"Cut\" click.trigger=\"formatDoc('cut')\" src=\"data:image/gif;base64,R0lGODlhFgAWAIQSAB1ChBFNsRJTySJYwjljwkxwl19vj1dusYODhl6MnHmOrpqbmpGjuaezxrCztcDCxL/I18rL1P///////////////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAVu4CeOZGmeaKqubDs6TNnEbGNApNG0kbGMi5trwcA9GArXh+FAfBAw5UexUDAQESkRsfhJPwaH4YsEGAAJGisRGAQY7UCC9ZAXBB+74LGCRxIEHwAHdWooDgGJcwpxDisQBQRjIgkDCVlfmZqbmiEAOw==\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Copy\" click.trigger=\"formatDoc('copy')\" src=\"data:image/gif;base64,R0lGODlhFgAWAIQcAB1ChBFNsTRLYyJYwjljwl9vj1iE31iGzF6MnHWX9HOdz5GjuYCl2YKl8ZOt4qezxqK63aK/9KPD+7DI3b/I17LM/MrL1MLY9NHa7OPs++bx/Pv8/f///////////////yH5BAEAAB8ALAAAAAAWABYAAAWG4CeOZGmeaKqubOum1SQ/kPVOW749BeVSus2CgrCxHptLBbOQxCSNCCaF1GUqwQbBd0JGJAyGJJiobE+LnCaDcXAaEoxhQACgNw0FQx9kP+wmaRgYFBQNeAoGihCAJQsCkJAKOhgXEw8BLQYciooHf5o7EA+kC40qBKkAAAGrpy+wsbKzIiEAOw==\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Paste\" click.trigger=\"formatDoc('paste')\" src=\"data:image/gif;base64,R0lGODlhFgAWAIQUAD04KTRLY2tXQF9vj414WZWIbXmOrpqbmpGjudClFaezxsa0cb/I1+3YitHa7PrkIPHvbuPs+/fvrvv8/f///////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAWN4CeOZGmeaKqubGsusPvBSyFJjVDs6nJLB0khR4AkBCmfsCGBQAoCwjF5gwquVykSFbwZE+AwIBV0GhFog2EwIDchjwRiQo9E2Fx4XD5R+B0DDAEnBXBhBhN2DgwDAQFjJYVhCQYRfgoIDGiQJAWTCQMRiwwMfgicnVcAAAMOaK+bLAOrtLUyt7i5uiUhADs=\" /></button>\n\t\t\t<button click.trigger=\"insertVideo()\" class=\"editorButton\"><img src=\"http://icons.iconarchive.com/icons/iconsmind/outline/256/Video-5-icon.png\" class=\"intLink editorButtonImage\"/></button>\n\t\t\t<button click.trigger=\"formatDoc('unlink')\"><img src=\"https://cdn0.iconfinder.com/data/icons/website-kit-2/512/icon_342-512.png\" class=\"intLink editorButtonImage\"/></button>\n\t\t\t<button click.trigger=\"formatDoc('removeFormat')\"><img src=\"https://cdn1.iconfinder.com/data/icons/text-and-typography-5-1/64/Text_and_Typography_339-512.png\" class=\"intLink editorButtonImage\"/></button>\t\t\n\t\t\t<button click.trigger=\"formatDoc('insertHorizontalRule')\"><img src=\"https://cdn1.iconfinder.com/data/icons/popular-user-interface-2/30/minus_dash_line_horizontal-512.png\" class=\"intLink editorButtonImage\" title=\"Insert Horizontal Rule\"/></button>\t\t\n\t\t\t<button click.trigger=\"imageEdit()\"><img src=\"https://image.flaticon.com/icons/png/512/23/23765.png\" class=\"intLink editorButtonImage\"/></button>\n\t\t\t<input type=\"color\" value=\"#ff0000\" input.trigger=\"setForeColor($event)\" alt=\"ForeColor\"></input>\n\t\t\t<input type=\"color\" value=\"#ffffff\" input.trigger=\"setBackColor($event)\" alt=\"BackColor\"></input>\n\t\t\t<button click.trigger=\"insertCodeBlock()\"><img src=\"http://www.iconarchive.com/download/i89195/icons8/ios7/Very-Basic-Code.ico\" class=\"intLink editorButtonImage\" title=\"Insert Code Block\"/></button>\n\t\t\t<select value=\"\" input.trigger=\"setHeading($event)\">\n\t\t\t\t<option value=\"\" disabled=\"disabled\" selected=\"selected\">Select Heading</option>\n\t            <option value=\"h1\">Heading 1</option>\n\t            <option value=\"h2\">Heading 2</option>\n\t            <option value=\"h3\">Heading 3</option>\n\t            <option value=\"h4\">Heading 4</option>\n\t            <option value=\"p\">Paragraph</option>\n\t            <option value=\"pre\">Code</option>\n\t\t\t</select>\n\n\t\t\t<button click.trigger=\"insertTermDlg()\">Insert Term</button>\n\t\t\t<button class=\"editorButtonLong\">&#8658;<img title=\"Convert To Rich Text\" click.trigger=\"convertToRichText()\" src=\"https://cdn3.iconfinder.com/data/icons/flat-design-development-set-1/24/control-rich-text-edit-512.png\"  class=\"intLink editorButtonImage\"/></button>\n\t\t\t<button class=\"editorButtonLong\">&#8656;<img title=\"Convert From Rich Text\" click.trigger=\"convertFromRichText()\" src=\"https://cdn3.iconfinder.com/data/icons/flat-design-development-set-1/24/control-rich-text-edit-512.png\"  class=\"intLink editorButtonImage\"/></button>\n\t\t\t<button class=\"editorButtonLong\" click.trigger=\"saveCardProperties()\">Save</button>\n\t\t</div>\n\t\t</div>\n\t</div>\n<!--\t<div><button click.trigger=\"displayFullBody = true\" if.bind=\"!displayFullBody\">Expand</button><button click.trigger=\"displayFullBody = false\" if.bind=\"displayFullBody\">Collapse</button></div>-->\n </div>\n\n\n <div class=\"namespaces card\" if.bind=\"mode==='namespaces'\">\n \t\t<h1 class=\"subhead\">Namespaces</h1>\n\n \t\t<table>\n \t\t<tr>\n \t\t\t<th>Prefix</th>\n \t\t\t<th>Namespace</th>\n \t\t</tr>\t\n \t\t<tr class=\"property\" repeat.for=\"prefix of ns | sortedObjectKeys\">\n \t\t\t<td class=\"inlineLabel\">${prefix}</td>\n \t\t\t<td class=\"inlineValue\">${ns[prefix]}></td>\n \t\t</tr>\n \t\t</table>\n </div>\n\n\t<div class=\"compliance card\"  if.bind=\"mode==='compliance'\">\n\t\t<h1>Compliance: ${g[context]['term:prefLabel'][0].value}</h1>\n\t\t<div class=\"property\">\n\t\t\t<div class=\"label\">For Country:</div>\n\t\t\t<div class=\"value\"><select value.bind=\"complianceItem.country\"\n\t\t\t\tchange.delegate=\"filterComplianceTest()\">>\n\t\t\t\t<option value=\"\" disabled=\"disabled\">Select the compliance country</option>\n\t\t\t\t<option value=\"country:_UnitedStates\">United States</option>\n\t\t\t\t<option value=\"country:_EuropeanUnion\">European Union</option>\n\t\t\t\t<option value.bind=\"item.curie\" repeat.for=\"item of instanceList['class:_Country']['rdf:type']\">${item.label}</option>\n\t\t\t</select></div>\n\t\t</div>\n\t\t<div class=\"property\">\n\t\t\t<div class=\"label\">Industry Use:</div>\n\t\t\t<div class=\"value\"><select value.bind=\"complianceItem.industry\"\n\t\t\t\tchange.delegate=\"filterComplianceTest()\">\n\t\t\t\t<option value=\"\" disabled=\"disabled\">Select the industry use.</option>\n\t\t\t\t<option value.bind=\"item.curie\" repeat.for=\"item of instanceList['class:_Industry']['rdf:type']\">${item.label}</option>\n\t\t\t</select></div>\n\t\t\t<div class=\"description\" innerhtml.bind=\"getDescription(complianceItem.industry,'class:_Industry','rdf:type')\"></div>\n\t\t</div>\n\t\t<div class=\"property\">\n\t\t\t<div class=\"label\">Compliance Test:</div>\n\t\t\t<div class=\"value\"><select value.bind=\"complianceItem.complianceTest\"  if.bind=\"instanceList['class:_ComplianceTest']['rdf:type'].length > 0\">\n\t\t\t\t<option value=\"\" disabled=\"disabled\">Select the compliance test.</option>\n\t\t\t\t<option value.bind=\"item.curie\" repeat.for=\"item of instanceList['class:_ComplianceTest']['rdf:type']\">${item.label}</option>\n\t\t\t</select>\n\t\t</div>\n\t\t<div class=\"description\" innerhtml.bind=\"getDescription(complianceItem.complianceTest,'class:_ComplianceTest','rdf:type')\"\n\t\t if.bind=\"instanceList['class:_ComplianceTest']['rdf:type'].length > 0\" ></div>\n\t\t<div class=\"description\" if.bind=\"instanceList['class:_ComplianceTest']['rdf:type'].length === 0\" innerhtml.two-way=\"complianceItem.noItemsMessage\"></div>\n\t\t<hr/>\n\t\t</div>\n\t\t<div class=\"property\">\n\t\t\t<div class=\"label\">Strain:</div>\n\t\t\t<div class=\"value\"><select value.bind=\"complianceItem.strain\"\n\t\t\t\t change.delegate=\"updateInstanceList($event.target.value,'enzymeActivity:hasStrain')\">\n\t\t\t\t<option value=\"\" disabled=\"disabled\">Select the strain.</option>\n\t\t\t\t<option value.bind=\"item.curie\" repeat.for=\"item of instanceList['class:_Strain']['rdf:type']\">${item.label}</option>\n\t\t\t</select></div>\n\t\t</div>\n\t\t<div class=\"property\" if.bind=\"complianceItem.strain != ''\">\n\t\t\t<div class=\"label\">Enzyme Activity:</div>\n\t\t\t<div class=\"value\"><select value.bind=\"complianceItem.enzyme\"\n\t\t\t\tclick.trigger=\"updateInstanceList($event.target.value,'grainProduct:hasEnzymeActivity')\"\n\t\t\t\tchange.delegate=\"updateInstanceList($event.target.value,'grainProduct:hasEnzymeActivity')\">\n\t\t\t\t<option value=\"\" disabled=\"disabled\">Select the enzyme</option>\n\t\t\t\t<option value.bind=\"item.curie\" selected=\"selected\" repeat.for=\"item of instanceList[complianceItem.strain]['enzymeActivity:hasStrain']||[]\">${item.label}</option>\n\t\t\t</select></div>\n\n\t\t</div>\n\t\t<div class=\"property\" if.bind=\"complianceItem.enzyme != ''\">\n\t\t\t<div class=\"label\">Product:</div>\n\t\t\t<div class=\"value\"><select value.bind=\"complianceItem.product\">\n\t\t\t\t<option value.bind=\"item.curie\" selected=\"selected\" repeat.for=\"item of instanceList[complianceItem.enzyme]['grainProduct:hasEnzymeActivity']||[]\">${item.label}</option>\n\t\t\t</select></div>\n\t\t\t\n\t\t</div>\n\t</div>\n\n\n <div class=\"ingestion card\" if.bind=\"mode==='ingestion'\">\n \t<h1>Ingestion</h1>\n \t<h2 class=\"subhead\">Properties</h2>\n \t<div repeat.for=\"sheet of templates | objectKeys\" class=\"sheet\">\n \t\t<div class=\"sheetName\">Worksheet '${sheet}'</div>\n \t\t<div class=\"ingest property\"><span class=\"label\">Namespace:</span> <span class=\"value\">${templates[sheet].uri}</span></div>\n \t\t<details>\n \t\t\t<summary>Sheet Properties</summary>\n \t\t\t<div class=\"sheetProperty\" repeat.for=\"sheetProperty of templates[sheet].headers\">{{${sheetProperty}}}</div>\n \t\t</details>\n \t\t<div class=\"property\">\n \t\t<div class=\"label\">Template</div>\n \t\t\t<textarea value.bind=\"templates[sheet].template\"></textarea>\n \t\t</div>\n \t</div>\n </div>\n <div class=\"search card\" if.bind=\"mode==='search'\">\n \t<h1>Search</h1>\n \t<p>${searchData.count} ${searchData.count === 1?'item':'items'} found.</p>\n\t<div repeat.for=\"item of searchData.results\" class=\"searchItems\" >\n\t\t<div class=\"searchItem link\" click.trigger=\"fetchContext(item.s,'card')\" title=\"${item.s}\">\n\t\t<img src=\"${item.imageURL}\" class=\"imageThumbnail\"/>\n\t\t<div>${item.prefLabel} [${item.sTypeLabel}]</div>\n\t\t</div>\n\t</div> \t\n </div>\n  \n <div class=\"sparql card\" if.bind=\"mode==='sparql'\">\n \t<h1>SPARQL Query Page</h1>\n \t<p>This is the future home of the SPARQL query page.</p>\n </div>\n\n <div class=\"widgets card\" if.bind=\"mode==='widgets'\">\n \t<div class=\"widgetsContainer\" innerhtml.bind=\"widgets.output.join('')\"></div>\n </div>\n\n\n  <!-- New Modal -- Dialog -->\n  \n  <modal view-model.ref=\"newModal\" closed.delegate=\"processNewCard()\" class=\"newModal\">\n    <div slot=\"header\" class=\"dlgHeader\">\n      <div class=\"dlgHeaderLabel\">New ${g[context]['term:prefLabel'][0].value}</div>\n      <div class=\"button\" click.trigger=\"newModal.cancel()\">X</div>\n    </div>\n    <div class=\"dlgBody\">\n    <div class=\"dlg-property\">\t\n  \t\t<div class=\"dlg-label\" title=\"This is the name of the ${g[context]['term:prefLabel'][0].value.toLowerCase()} used in the application. Avoid the use of the &amp; or &quot; characters in titles.\">Title of ${g[context]['term:prefLabel'][0].value}</div>\n    \t<div class=\"cardTitleEdit\"><input value.bind=\"activeCard.title\" input.delegate=\"generateEntityId(context)\" class=\"longInput\" tabindex=\"0\"/></div>\n\t</div>\n\t<div class=\"dlg-property\"  if.bind=\"context === 'class:_User'\">\n\t    <div class=\"dlg-property\">\t\n\t  \t\t<div class=\"dlg-label\" title=\"This is the username for the user.\">Username</div>\n\t    \t<div class=\"dlg-value\"><input value.bind=\"activeCard.username\" input.delegate=\"generateEntityId(context)\" class=\"longInput\" tabindex=\"0\"/></div>\n\t\t</div>\n\t    <div class=\"dlg-property\">\t\n\t  \t\t<div class=\"dlg-label\" title=\"This is the password for the user.\">Password</div>\n\t    \t<div class=\"dlg-value\"><input value.bind=\"activeCard.password\" input.delegate=\"generateEntityId(context)\" class=\"longInput\" type=\"password\" tabindex=\"0\"/></div>\n\t\t</div>\n\t</div>\n\t<div class=\"dlg-property\">\n\t<img class=\"cardImage\" src=\"${activeCard.image}\"/>\n\t<div><span class=\"label\">Image URL </span><input value.bind=\"activeCard.image\" class=\"primaryImageEditField longInput\"  input.delegate=\"createImageFile(activeCard.curie)\" tabindex=\"0\"/>\n\t\t<input type=\"file\" change.trigger=\"setImage($event)\" tabindex=\"0\"/>\n\t</div>\n\t</div>\n\t<div class=\"dlg-property\"> \n  \t<div class=\"dlg-label\">Body</div>\n\n\t<div class=\"editorButtons\">\n\t\t<button><img class=\"intLink\" title=\"Undo\" click.trigger=\"formatDoc('undo')\" src=\"data:image/gif;base64,R0lGODlhFgAWAOMKADljwliE33mOrpGjuYKl8aezxqPD+7/I19DV3NHa7P///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARR8MlJq7046807TkaYeJJBnES4EeUJvIGapWYAC0CsocQ7SDlWJkAkCA6ToMYWIARGQF3mRQVIEjkkSVLIbSfEwhdRIH4fh/DZMICe3/C4nBQBADs=\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Redo\" click.trigger=\"formatDoc('redo')\" src=\"data:image/gif;base64,R0lGODlhFgAWAMIHAB1ChDljwl9vj1iE34Kl8aPD+7/I1////yH5BAEKAAcALAAAAAAWABYAAANKeLrc/jDKSesyphi7SiEgsVXZEATDICqBVJjpqWZt9NaEDNbQK1wCQsxlYnxMAImhyDoFAElJasRRvAZVRqqQXUy7Cgx4TC6bswkAOw==\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Bold\" click.trigger=\"formatDoc('bold')\" src=\"data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAInhI+pa+H9mJy0LhdgtrxzDG5WGFVk6aXqyk6Y9kXvKKNuLbb6zgMFADs=\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Italic\" click.trigger=\"formatDoc('italic')\" src=\"data:image/gif;base64,R0lGODlhFgAWAKEDAAAAAF9vj5WIbf///yH5BAEAAAMALAAAAAAWABYAAAIjnI+py+0Po5x0gXvruEKHrF2BB1YiCWgbMFIYpsbyTNd2UwAAOw==\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Underline\" click.trigger=\"formatDoc('underline')\" src=\"data:image/gif;base64,R0lGODlhFgAWAKECAAAAAF9vj////////yH5BAEAAAIALAAAAAAWABYAAAIrlI+py+0Po5zUgAsEzvEeL4Ea15EiJJ5PSqJmuwKBEKgxVuXWtun+DwxCCgA7\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Left align\" click.trigger=\"formatDoc('justifyleft')\" src=\"data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw==\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Center align\" click.trigger=\"formatDoc('justifycenter')\" src=\"data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Right align\" click.trigger=\"formatDoc('justifyright')\" src=\"data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw==\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Numbered list\" click.trigger=\"formatDoc('insertorderedlist')\" src=\"data:image/gif;base64,R0lGODlhFgAWAMIGAAAAADljwliE35GjuaezxtHa7P///////yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKSespwjoRFvggCBUBoTFBeq6QIAysQnRHaEOzyaZ07Lu9lUBnC0UGQU1K52s6n5oEADs=\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Dotted list\" click.trigger=\"formatDoc('insertunorderedlist')\" src=\"data:image/gif;base64,R0lGODlhFgAWAMIGAAAAAB1ChF9vj1iE33mOrqezxv///////yH5BAEAAAcALAAAAAAWABYAAAMyeLrc/jDKSesppNhGRlBAKIZRERBbqm6YtnbfMY7lud64UwiuKnigGQliQuWOyKQykgAAOw==\" /></button>\n\t\t\t<button><img class=\"intLink\" title=\"Hyperlink\" click.trigger=\"createHyperlink()\" src=\"data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Quote\" click.trigger=\"formatDoc('formatblock','blockquote')\" src=\"data:image/gif;base64,R0lGODlhFgAWAIQXAC1NqjFRjkBgmT9nqUJnsk9xrFJ7u2R9qmKBt1iGzHmOrm6Sz4OXw3Odz4Cl2ZSnw6KxyqO306K63bG70bTB0rDI3bvI4P///////////////////////////////////yH5BAEKAB8ALAAAAAAWABYAAAVP4CeOZGmeaKqubEs2CekkErvEI1zZuOgYFlakECEZFi0GgTGKEBATFmJAVXweVOoKEQgABB9IQDCmrLpjETrQQlhHjINrTq/b7/i8fp8PAQA7\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Add indentation\" click.trigger=\"formatDoc('outdent')\" src=\"data:image/gif;base64,R0lGODlhFgAWAMIHAAAAADljwliE35GjuaezxtDV3NHa7P///yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKCQG9F2i7u8agQgyK1z2EIBil+TWqEMxhMczsYVJ3e4ahk+sFnAgtxSQDqWw6n5cEADs=\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Delete indentation\" click.trigger=\"formatDoc('indent')\" src=\"data:image/gif;base64,R0lGODlhFgAWAOMIAAAAADljwl9vj1iE35GjuaezxtDV3NHa7P///////////////////////////////yH5BAEAAAgALAAAAAAWABYAAAQ7EMlJq704650B/x8gemMpgugwHJNZXodKsO5oqUOgo5KhBwWESyMQsCRDHu9VOyk5TM9zSpFSr9gsJwIAOw==\" /></button>\n\t\n\t\t<button><img class=\"intLink\" title=\"Cut\" click.trigger=\"formatDoc('cut')\" src=\"data:image/gif;base64,R0lGODlhFgAWAIQSAB1ChBFNsRJTySJYwjljwkxwl19vj1dusYODhl6MnHmOrpqbmpGjuaezxrCztcDCxL/I18rL1P///////////////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAVu4CeOZGmeaKqubDs6TNnEbGNApNG0kbGMi5trwcA9GArXh+FAfBAw5UexUDAQESkRsfhJPwaH4YsEGAAJGisRGAQY7UCC9ZAXBB+74LGCRxIEHwAHdWooDgGJcwpxDisQBQRjIgkDCVlfmZqbmiEAOw==\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Copy\" click.trigger=\"formatDoc('copy')\" src=\"data:image/gif;base64,R0lGODlhFgAWAIQcAB1ChBFNsTRLYyJYwjljwl9vj1iE31iGzF6MnHWX9HOdz5GjuYCl2YKl8ZOt4qezxqK63aK/9KPD+7DI3b/I17LM/MrL1MLY9NHa7OPs++bx/Pv8/f///////////////yH5BAEAAB8ALAAAAAAWABYAAAWG4CeOZGmeaKqubOum1SQ/kPVOW749BeVSus2CgrCxHptLBbOQxCSNCCaF1GUqwQbBd0JGJAyGJJiobE+LnCaDcXAaEoxhQACgNw0FQx9kP+wmaRgYFBQNeAoGihCAJQsCkJAKOhgXEw8BLQYciooHf5o7EA+kC40qBKkAAAGrpy+wsbKzIiEAOw==\" /></button>\n\t\t<button><img class=\"intLink\" title=\"Paste\" click.trigger=\"formatDoc('paste')\" src=\"data:image/gif;base64,R0lGODlhFgAWAIQUAD04KTRLY2tXQF9vj414WZWIbXmOrpqbmpGjudClFaezxsa0cb/I1+3YitHa7PrkIPHvbuPs+/fvrvv8/f///////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAWN4CeOZGmeaKqubGsusPvBSyFJjVDs6nJLB0khR4AkBCmfsCGBQAoCwjF5gwquVykSFbwZE+AwIBV0GhFog2EwIDchjwRiQo9E2Fx4XD5R+B0DDAEnBXBhBhN2DgwDAQFjJYVhCQYRfgoIDGiQJAWTCQMRiwwMfgicnVcAAAMOaK+bLAOrtLUyt7i5uiUhADs=\" /></button>\n\t\t<button click.trigger=\"insertVideo()\" class=\"editorButton\"><img src=\"http://icons.iconarchive.com/icons/iconsmind/outline/256/Video-5-icon.png\" class=\"intLink editorButtonImage\"/></button>\n\t\t<button click.trigger=\"formatDoc('unlink')\"><img src=\"https://cdn0.iconfinder.com/data/icons/website-kit-2/512/icon_342-512.png\" class=\"intLink editorButtonImage\"/></button>\n\t\t<button click.trigger=\"formatDoc('removeFormat')\"><img src=\"https://cdn1.iconfinder.com/data/icons/text-and-typography-5-1/64/Text_and_Typography_339-512.png\" class=\"intLink editorButtonImage\"/></button>\t\t\n\t\t<button click.trigger=\"formatDoc('insertHorizontalRule')\"><img src=\"https://cdn1.iconfinder.com/data/icons/popular-user-interface-2/30/minus_dash_line_horizontal-512.png\" class=\"intLink editorButtonImage\" title=\"Insert Horizontal Rule\"/></button>\t\t\n\t\t<button click.trigger=\"imageEdit()\"><img src=\"https://image.flaticon.com/icons/png/512/23/23765.png\" class=\"intLink editorButtonImage\"/></button>\n\t\t<input type=\"color\" value=\"#ff0000\" input.trigger=\"setForeColor($event)\" alt=\"ForeColor\"></input>\n\t\t<input type=\"color\" value=\"#ffffff\" input.trigger=\"setBackColor($event)\" alt=\"BackColor\"></input>\n\t\t<button click.trigger=\"insertCodeBlock()\"><img src=\"http://www.iconarchive.com/download/i89195/icons8/ios7/Very-Basic-Code.ico\" class=\"intLink editorButtonImage\" title=\"Insert Code Block\"/></button>\n\t\t<select value=\"\" input.trigger=\"setHeading($event)\">\n\t\t\t<option value=\"\" disabled=\"disabled\" selected=\"selected\">Select Heading</option>\n            <option value=\"h1\">Heading 1</option>\n            <option value=\"h2\">Heading 2</option>\n            <option value=\"h3\">Heading 3</option>\n            <option value=\"h4\">Heading 4</option>\n            <option value=\"p\">Paragraph</option>\n            <option value=\"pre\">Code</option>\n\t\t</select>\n\n\t\t<button click.trigger=\"insertTermDlg()\">Insert Term</button>\n\t\t<button class=\"editorButtonLong\">&#8658;<img title=\"Convert To Rich Text\" click.trigger=\"convertToRichText()\" src=\"https://cdn3.iconfinder.com/data/icons/flat-design-development-set-1/24/control-rich-text-edit-512.png\"  class=\"intLink editorButtonImage\"/></button>\n\t\t<button class=\"editorButtonLong\">&#8656;<img title=\"Convert From Rich Text\" click.trigger=\"convertFromRichText()\" src=\"https://cdn3.iconfinder.com/data/icons/flat-design-development-set-1/24/control-rich-text-edit-512.png\"  class=\"intLink editorButtonImage\"/></button>\n\t</div>\n\n\n\t<div class=\"bodyEditor newModalBE\" innerhtml.two-way=\"activeCard.body\" contenteditable=\"true\"\n\ttitle=\"If your content is just text, type it in. If it's pasted HTML, then save the new item and use the HTML editor to paste the content in.\"\n\t tabindex=\"0\"> </div>\n\t</div>\n\t<div class=\"dlg-property\"  if.bind=\"context === 'class:_Class'\">\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Prefix</div>\n\t\t\t<div class=\"prefix\" contenteditable=\"true\"  innerhtml.two-way=\"activeCard.prefix\" input.delegate=\"updateClassNamespace()\" placeholder=\"Prefix\" tabindex=\"0\"></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Namespace</div>\n\t\t\t<div class=\"namespace\" contenteditable=\"true\"  innerhtml.two-way=\"activeCard.namespace\" if.bind=\"context === 'class:_Class'\" placeholder=\"Namespace\" tabindex=\"0\"></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Plural Form</div>\n\t\t\t<div class=\"namespace\" contenteditable=\"true\"  innerhtml.two-way=\"activeCard.plural\" if.bind=\"context === 'class:_Class'\" placeholder=\"Plural Form\" tabindex=\"0\"></div>\n\t\t</div>\n<!--\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Graph</div>\n\t\t\t<div class=\"dlg-value\"><select value.bind=\"activeCard.graph\" tabindex=\"0\">\n\t\t\t\t<option value=\"\" disabled=\"disabled\">Select Graph</option>\n\t\t\t\t<option value.bind=\"link.curie\" repeat.for=\"link of instanceList['class:_Graph']['rdf:type']\">${link.label}</option>\n\t\t\t</select></div>\n\t\t</div> -->\n\t</div>\n\t<div class=\"dlg-property\"  if.bind=\"context === 'class:_Property'\">\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Domain</div>\n\t\t\t<div class=\"dlg-value\"><select value.bind=\"activeCard.domain\" change.delegate=\"generateEntityId(context)\">\n\t\t\t\t<option value.bind=\"link.curie\" repeat.for=\"link of instanceList['class:_Class']['rdf:type']\" tabindex=\"0\">${link.label}</option>\n\t\t\t</select></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Node Kind</div>\n\t\t\t<div class=\"dlg-value\"><select value.bind=\"activeCard.nodeKind\"  tabindex=\"0\">\n\t\t\t\t\t<option value=\"\" disabled=\"disabled\">Choose whether the target is an attribute or an object.</option>\n\t\t\t\t\t<option value=\"nodeKind:_Literal\">Attribute</option>\n\t\t\t\t\t<option value=\"nodeKind:_IRI\">Object</option>\n\t\t\t\t</select></div>\n\t\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeCard.nodeKind==='nodeKind:_IRI'\">\n\t\t\t<div class=\"dlg-label\">Range</div>\n\t\t\t<div class=\"dlg-value\"><select value.bind=\"activeCard.range\" tabindex=\"0\">\n\t\t\t\t<option value.bind=\"link.curie\" repeat.for=\"link of instanceList['class:_Class']['rdf:type']\">${link.label}</option>\n\t\t\t</select></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeCard.nodeKind==='nodeKind:_Literal'\" >\n\t\t\t<div class=\"dlg-label\">Datatype</div>\n\t\t\t<div class=\"dlg-value\"><select value.bind=\"activeCard.datatype\" tabindex=\"0\">\n\t\t\t\t<option value.bind=\"link.curie\" repeat.for=\"link of instanceList['class:_XSD']['rdf:type']\">${link.label}</option>\n\t\t\t</select></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Cardinality</div>\n\t\t\t<div class=\"dlg-value\"><select value.bind=\"activeCard.cardinality\" tabindex=\"0\">\n\t\t\t\t<option value=\"\" disabled=\"disabled\">Select Cardinality</option>\n\t\t\t\t<option value.bind=\"link.curie\" repeat.for=\"link of instanceList['class:_Cardinality']['rdf:type']\">${link.label}</option>\n\t\t\t</select></div>\n\t\t</div>\n\t</div>\n<!--\t<div class=\"dlg-property\">\n\t\t<div class=\"dlg-label\">External URL:</div>\n\t\t<div class=\"dlg-value\"><input value.two-way=\"activeCard.externalURL\" class=\"longInput\"/></div>\n\t</div>-->\t\n\t<div class=\"dlg-property\" repeat.for=\"property of templateProperties\" if.bind=\"property.order != null\">\n\t\t<div class=\"dlg-label\">[${property.domainLabel}] ${property.label}</div>\n\t\t<div class=\"dlg-value\" if.bind=\"property.nodeKind === 'nodeKind:_Literal' && property.datatype === 'xsd:string'\"><input type=\"string\" value.two-way=\"property.value\" class=\"longInput\"/></div>\n\t\t<div class=\"dlg-value\" if.bind=\"property.nodeKind === 'nodeKind:_Literal' && property.datatype === 'xsd:date'\"><input type=\"date\" value.two-way=\"property.value\" class=\"longInput\"/></div>\n\t\t<div class=\"dlg-value\" if.bind=\"property.nodeKind === 'nodeKind:_Literal' && property.datatype === 'xsd:dateTime'\"><input type=\"dateTime\" value.two-way=\"property.value\" class=\"longInput\"/></div>\n\t\t<div class=\"dlg-value\" if.bind=\"property.nodeKind === 'nodeKind:_Literal' && property.datatype === 'xsd:integer'\"><input type=\"number\" value.two-way=\"property.value\" class=\"longInput\"/></div>\n\t\t<div class=\"dlg-value\" if.bind=\"property.nodeKind === 'nodeKind:_IRI'\"><select value.two-way=\"property.value\" tabindex=\"0\">\n   \t  \t\t<option repeat.for=\"entity of property.entities\" value.bind=\"entity.curie\">${entity.label}</option>\n\t\t</select></div>\n\t</div>\t\n\t<div class=\"dlg-property\">\n\t<div><span class=\"label\">File URL </span><input value.bind=\"activeCard.externalURL\" class=\"primaryImageEditField longInput\"  input.delegate=\"createFile(activeCard.curie)\" tabindex=\"0\"/>\n\t\t<input type=\"file\" change.trigger=\"setFile($event)\" tabindex=\"0\"/>\n\t</div>\n\t</div>\n\n\t<div class=\"dlg-property\">\n\t\t<div class=\"dlg-label\">Curie</div>\n<!--\t\t<div class=\"curie\" contenteditable=\"true\"  innerhtml.two-way=\"activeCard.curie\"></div>-->\n\t\t<div class=\"dlg-value\"><input value.two-way=\"activeCard.curie\" class=\"longInput\" placeholder=\"Condensed URI or Curie\" tabindex=\"0\"></input></div>\n\t</div>\n\t<div class=\"dlg-property\">\n\t\t<div class=\"dlg-label\">Class</div>\n\t\t<div class=\"dlg-value\"><select value.bind=\"activeCard.type\" change.delegate=\"generateEntityId(activeCard.type)\" tabindex=\"0\">\n\t\t\t<option value=\"\" disabled=\"disabled\">Select Class</option>\n   \t  \t\t<option repeat.for=\"action of instanceList['class:_Class']['rdf:type']\" value.bind=\"action.curie\">${action.label}</option>\n\t\t</select></div>\n\t</div>\n\t<div class=\"dlg-property\">\n\t\t<div class=\"dlg-label\">Template</div>\n\t\t<div class=\"dlag-value\"><select value.bind=\"activeCard.template\" change.delegate=\"setBodyToTemplate()\" tabindex=\"0\">\n\t\t\t<option value=\"\">None</option>\n\t\t\t<option value.bind=\"template.link\" repeat.for=\"template of availableTemplates\">${template.linkLabel}</option>\n\t\t</select></div>\n\t</div>\n\t</div>\n\t<div class=\"modal-footer\">\n\t\t<div class=\"button\" click.trigger=\"newModal.close()\" tabindex=\"0\">Create</div>\n\t\t<div class=\"button\" click.trigger=\"newModal.cancel()\" tabindex=\"0\">Cancel</div>\n\t</div>\n  </modal>\n\n  <modal view-model.ref=\"duplicateModal\" closed.delegate=\"processDuplicateCard()\">\n    <div slot=\"header\" class=\"dlgHeader\">\n      <div class=\"dlgHeaderLabel\"><b>New ${g[context]['term:prefLabel'][0].value}</b></div>\n      <div class=\"button\" click.trigger=\"duplicateModal.cancel()\">X</div>\n    </div>\n    <div>\n\t<div class=\"dlg-property\">\n\t\t<div class=\"dlg-label\">Title</div>\n\t\t<div class=\"dlg-value\"><input value.two-way=\"activeCard.title\"input.delegate=\"generateEntityId(context)\"></input></div>\n\t</div>\n\t<div class=\"dlg-property\">\n\t\t<img class=\"cardImage\" src=\"${activeCard.image}\"/>\n\t\t<div class=\"dlg-value\"><span class=\"label\">Image URL</span></div>\n\t\t<div class=\"dlg-label\"><input value.two-way=\"activeCard.image\" class=\"primaryImageEditField longInput\"/></div>\n\t</div> \n\t<div class=\"bodyEditor duplicateModalBE\" innerhtml.two-way=\"activeCard.body\" contenteditable=\"true\"></div>\n\t<div class=\"dlg-property\">\n\t\t<div class=\"dlg-label\">Curie</div>\n\t\t<div class=\"dlg-value\"><input value.two-way=\"activeCard.curie\" input.delegate=\"generateEntityId(context)\"></input></div>\n\t</div>\n\t</div>\n\t<div class=\"modal-footer\">\n\t\t<div class=\"button\" click.trigger=\"duplicateModal.close()\">Save</div>\n\t\t<div class=\"button\" click.trigger=\"duplicateModal.cancel()\">Cancel</div>\n\t</div>\n  </modal>\n\n  <modal view-model.ref=\"addPropertyModal\" closed.delegate=\"processAddProperty()\">\n\t    <div slot=\"header\" class=\"dlgHeader\">\n\t      <div class=\"dlgHeaderLabel\">Add property</div>\n\t      <div class=\"button\" click.trigger=\"addPropertyModal.cancel()\">X</div>\n\t     </div>\n\t    <div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Select Property</div>\n\t\t\t<div class=\"dlg-value\"><select value.bind=\"selectedProperty\" change.delegate=\"activePropertySelected($event)\" tabindex=\"0\">\n\t\t\t\t<option value=\"\">None Selected</option>\n\t\t\t\t<option value.bind=\"property.predicate\" repeat.for=\"property of availableProperties\">[${property.domainLabel}] ${property.label}</option>\n\t\t\t</select></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind === 'nodeKind:_IRI'\">\n\t\t\t<div class=\"dlg-label\">Select Value</div>\n\t\t\t<div class=\"dlg-value\"><select value.bind=\"activeProperty.value\" tabindex=\"0\">\n\t\t\t\t<option value=\"\">None Selected</option>\n\t\t\t\t<option value.bind=\"value.curie\" repeat.for=\"value of activePropertyValues\">${value.label}</option>\n\t\t\t</select>\n\t\t\t<div class=\"button\" click.trigger=\"launchPage(activeProperty.range,'card')\">+</div>\n\t\t</div>\n\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind === 'nodeKind:_Literal' && activeProperty.datatype ==='xsd:string'\" >\n\t\t\t<div class=\"dlg-label\">Value:</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"activeProperty.value\" tabindex=\"0\"/></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind === 'nodeKind:_Literal' && activeProperty.datatype ==='xsd:curie'\" >\n\t\t\t<div class=\"dlg-label\">Value:</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"activeProperty.value\" tabindex=\"0\"/></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind === 'nodeKind:_Literal' && ((activeProperty.datatype === 'xsd:integer') ||  (activeProperty.datatype === 'xsd:double') || (activeProperty.datatype === 'xsd:float'))\" >\n\t\t\t<div class=\"dlg-label\">Value:</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"activeProperty.value\" type=\"number\" tabindex=\"0\"/></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind === 'nodeKind:_Literal' && (activeProperty.datatype === 'xsd:currency_usd')\" >\n\t\t\t<div class=\"dlg-label\">Value:</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"activeProperty.value\" type=\"number\" tabindex=\"0\"/></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind === 'nodeKind:_Literal' && (activeProperty.datatype === 'xsd:currency_eur')\" >\n\t\t\t<div class=\"dlg-label\">Value:</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"activeProperty.value\" type=\"number\" tabindex=\"0\"/></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind === 'nodeKind:_Literal' && activeProperty.datatype ==='xsd:imageURL'\" >\n\t\t\t<div class=\"dlg-label\">Paste in Image URL:</div>\n\t\t    <img src.bind=\"activeProperty.value\" class=\"imageMedium\"/> \n\t\t\t<div class=\"dlg-value\"><input type=\"text\" value.bind = \"activeProperty.value\" class=\"longInput\" tabindex=\"0\"/></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind === 'nodeKind:_Literal' && activeProperty.datatype ==='xsd:htmlLiteral'\" >\n\t\t\t<div class=\"dlg-label\">HTML Content:</div>\n\t\t\t<div class=\"dlg-value\" innerhtml.two-way=\"activeProperty.value\" contenteditable=\"true\" tabindex=\"0\"></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind === 'nodeKind:_Literal' && activeProperty.datatype ==='xsd:textLiteral'\" >\n\t\t\t<div class=\"dlg-label\">Multiline Text Content:</div>\n\t\t\t<div class=\"dlg-value textLiteralBlock\" textcontent.bind=\"activeProperty.value\" contenteditable=\"true\" tabindex=\"0\"></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind === 'nodeKind:_Literal' && (activeProperty.datatype === 'xsd:hexColor')\" >\n\t\t\t<div class=\"dlg-label\">Value:</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"activeProperty.value\" type=\"color\" tabindex=\"0\"></input></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind==='nodeKind:_Literal' && activeProperty.datatype === 'xsd:anyURI'\" title=\"${activeProperty.value}\">\n\t\t\t<div class=\"dlg-label\">URL:</div>\n  \t\t\t<div><input type=\"text\" value.bind = \"activeProperty.value\" class=\"longInput\" tabindex=\"0\"></input></div>\n  \t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind==='nodeKind:_Literal' && activeProperty.datatype === 'xsd:date'\" title=\"${activeProperty.value}\">\n\t\t\t<div class=\"dlg-label\">URL:</div>\n  \t\t\t<div><input type=\"date\" value.date = \"activeProperty.value\" class=\"longInput\" tabindex=\"0\"></input></div>\n  \t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind==='nodeKind:_Literal' && activeProperty.datatype === 'xsd:dateTime'\" title=\"${activeProperty.value}\">\n\t\t\t<div class=\"dlg-label\">URL:</div>\n  \t\t\t<div><input type=\"dateTime\" value.date = \"activeProperty.value\" class=\"longInput\" tabindex=\"0\"></input></div>\n  \t\t</div>\n    </div>\n\t<div class=\"modal-footer\">\n\t\t<div class=\"button\" click.trigger=\"addPropertyModal.close()\">Save</div>\n\t\t<div class=\"button\" click.trigger=\"addPropertyModal.cancel()\">Cancel</div>\n\t</div>\n  </modal>\n\n  <modal view-model.ref=\"addConstraintModal\" closed.delegate=\"processAddConstraint()\">\n    <div slot=\"header\" class=\"dlgHeader\">\n      <div class=\"dlgHeaderLabel\">Add Constraint</div>\n      <div class=\"button\" click.trigger=\"addConstraintModal.cancel()\">X</div>\n    </div>\n\n    <div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Select Property</div>\n\t\t\t<div class=\"dlg-value\"><select value.bind=\"this.activeProperty\" change.delegate=\"activePropertySelected($event)\" tabindex=\"0\">\n\t\t\t\t<option value=\"\">None Selected</option>\n\t\t\t\t<option value.bind=\"property.predicate\" repeat.for=\"property of availableProperties\" if.bind=\"property.nodeKind === 'nodeKind:_IRI'\">${property.label}</option>\n\t\t\t</select></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\" if.bind=\"activeProperty.nodeKind === 'nodeKind:_IRI'\">\n\t\t\t<div class=\"dlg-label\">Select Value</div>\n\t\t\t<div class=\"dlg-value\"><select value.bind=\"activeProperty.value\" tabindex=\"0\">\n\t\t\t\t<option value=\"\">None Selected</option>\n\t\t\t\t<option value.bind=\"value.curie\" repeat.for=\"value of activePropertyValues\">${value.label}</option>\n\t\t\t</select>\n\t\t</div>\n\t\t</div>\n    </div>\n\t<div class=\"modal-footer\">\n\t\t<div class=\"button\" click.trigger=\"addConstraintModal.close()\">Save</div>\n\t\t<div class=\"button\" click.trigger=\"addConstraintModal.cancel()\">Cancel</div>\n\t</div>\n  </modal>\n\n  <modal view-model.ref=\"insertTermModal\" closed.delegate=\"insertTerm()\" canceled.delegate=\"cancelInsertTerm()\">\n    <div slot=\"header\" class=\"dlgHeader\">\n      <div class=\"dlgHeaderLabel\">Insert Term</div>\n      <div class=\"button\" click.trigger=\"insertTermModal.cancel()\">X</div>\n    </div>\n\n    <div>\n\t\t\t<!--  change.delegate=\"activeClassSelected($event)\" -->\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Search</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"q\" type=\"text\" input.delegate=\"inputSearch()\" placeholder=\"Search for a term\" tabindex=\"0\"/></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Link</div>\n\t\t\t\t<div class=\"dlg-value\"><select class=\"inputSearchList\" value.bind=\"insertTermObj.value\" change.delegate=\"updateInsertImage()\" tabindex=\"0\">\n\t\t\t\t\t<option value=\"\" disabled=\"disabled\">Search for an item above.</option>\n\t\t\t\t\t<option class=\"inputSearchItem link\" value.bind=\"searchItem.s\" repeat.for=\"searchItem of searchData.results\" if.bind=\"$index<10\">${searchItem.prefLabel} [${searchItem.sTypeLabel}]</option>\n\t\t\t\t</select>\n\t\t\t\t<div class=\"button\" click.trigger=\"launchPage('class:_Topic','card')\" tabindex=\"0\">+</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Label:</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"insertTermObj.temp\" type=\"text\"/><div class=\"button\" click.trigger=\"updateInsertTerm()\" tabindex=\"0\">Use Term Label</div></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Image:</div>\n\t\t\t<div class=\"dlg-value\"><img class=\"imageThumbnail\" src.bind=\"insertTermObj.image\" tabindex=\"0\"/></div>\n\t\t</div>\t\t\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\"><select value.bind=\"insertTermObj.asImage\" tabindex=\"0\">\n\t\t\t\t<option value=\"text\">Insert As Linked Text</option>\n\t\t\t\t<option value=\"image\">Insert As Image</option>\n\t\t\t</select></div>\n\t\t</div>\n    </div>\n\t<div class=\"modal-footer\">\n\t\t<div class=\"button\" click.trigger=\"insertTermModal.close()\">Insert</div>\n\t\t<div class=\"button\" click.trigger=\"insertTermModal.cancel()\">Cancel</div>\n\t</div>\n  </modal>\n\n\n\n    <modal view-model.ref=\"editImageModal\" closed.delegate=\"processEditImage()\">\n    <div slot=\"header\" class=\"dlgHeader\">\n      <div class=\"dlgHeaderLabel\">Edit Image</div>\n      <div class=\"button\" click.trigger=\"editImageModal.cancel()\">X</div>\n    </div>\n    <div>\n    \t<img src.bind=\"editImage.src\"/>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Image URL:</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"editImage.src\" class=\"longInput\" tabindex=\"0\"></input></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Width:</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"editImage.width\" tabindex=\"0\"/> px</div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Height:</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"editImage.height\" tabindex=\"0\"/> px</div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Alt Text:</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"editImage.alt\" class=\"longInput\" tabindex=\"0\"/></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Title:</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"editImage.title\" class=\"longInput\" tabindex=\"0\"/></div>\n\t\t</div>\n\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Alignment:</div>\n\t\t\t<div class=\"dlg-value\"><select value.bind=\"editImage.align\" tabindex=\"0\">\n\t\t\t\t<option value=\"None\">None</option>\n\t\t\t\t<option value=\"Left\">Left</option>\n\t\t\t\t<option value=\"Right\">Right</option>\n\t\t\t\t<option value=\"Top\">Top</option>\n\t\t\t\t<option value=\"Middle\">Middle</option>\n\t\t\t\t<option value=\"Bottom\">Bottom</option>\n\t\t\t</select></div>\n\t\t</div>\n    </div>\n\t<div class=\"modal-footer\">\n\t\t<div class=\"button\" click.trigger=\"editImageModal.close()\">Insert</div>\n\t\t<div class=\"button\" click.trigger=\"cancelEditImage()\">Cancel</div>\n\t</div>\n  </modal>\n  </div>\n  \t<div class=\"centerPaneAddons\"><!-- Empty --></div>\n</div>\n  <div class=\"rightPane\">\n\t<!--<div class=\"sideProperties\"  if.bind=\"userRole.has('accountRole:_Create')\">\n\t\t<div class=\"propertyContextLabel\">${g[context]['term:prefLabel'][0].value}</div>\n\t\t<div class=\"property\" repeat.for=\"property of keys(g[context], ['rdf:type','term:prefLabel','term:hasPrimaryImageURL','term:hasDescription','vehicle:hasOptions','term:inGlossary','vehicle:hasVehicleComments', \n\t\t'term:hasIdentifier','term:hasSearchable'])\">\n\t\t  \t<div class=\"label\" title=\"${property}\"             \n\t\t  \t>${titleCase((g[property]['term:prefLabel'])?g[property]['term:prefLabel'][0].value:property)}:&nbsp;</div>\n\t\t  \t<div class=\"valueBlock\">\n\t\t\t  \t<div class=\"value\" repeat.for=\"item of wrapArray(g[context][property])\">\n\t\t\t  \t\t<span class=\"link\" if.bind=\"item.type==='uri'\" click.trigger=\"fetchContext(item.value)\">${g[item.value]['term:prefLabel'][0].value}<span if.bind=\"!$last\">,&nbsp;</span>\n\t\t\t  \t\t</span>\n\t\t\t  \t\t<span class=\"value\" if.bind=\"item.type==='literal'\" title=\"${item.datatype}\"><span innerhtml=\"${displayLiteral(item)}\"></span> \n\t\t\t  \t\t\t<span class=\"link\" click.trigger=\"fetchContext(item.datatype)\" if.bind=\"g[item.datatype]['term:prefLabel'].length > 0 \">&nbsp;[${g[item.datatype][\"term:prefLabel\"][0].value}]</span><span if.bind=\"!$last && $index != 0\">, </span>\n\t\t\t  \t\t</span>\n\t\t\t  \t</div>\n\t\t    </div>\n\t\t  </div>\n\t\t  <div class=\"property\">\n\t\t\t  <div class=\"label\">Has Curie</div>\n\t \t      <div click.trigger=\"fetchContext(context)\" class=\"longWord\">${context}</div>\n\t\t</div>\n\t </div>-->\n  </div>\n</div>\n</div>\n  <div class=\"footer\" innerhtml.bind=\"footer\"></div>\n</div>\n</modal>\n<modal view-model.ref=\"loginModal\" closed.delegate=\"processLogin()\">\n    <div slot=\"header\">Log In</div>\n    <div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Username</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"loginData.username\" type=\"input\"/></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Password</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"loginData.password\" type=\"password\"/></div>\n\t\t</div>\n    </div>\n\t<div class=\"modal-footer\">\n\t\t<div class=\"button\" click.trigger=\"loginModal.close()\">Log in</div>\n\t\t<div class=\"button\" click.trigger=\"loginModal.cancel()\">Cancel</div>\n\t</div>\n  </modal>\n<!-- <modal view-model.ref=\"newUserModal\" closed.delegate=\"processNewUserLogin()\">\n    <div slot=\"header\" class=\"dlgHeader\">\n      <div class=\"dlgHeaderLabel\">New ${newLoginData.fullName}</div>\n      <div class=\"button\" click.trigger=\"newLoginModal.cancel()\">X</div>\n    </div>\n    <div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">First Name</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"newLoginData.firstName\" type=\"input\"/></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Last Name</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"newLoginData.lastName\" type=\"input\"/></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Full Name</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"newLoginData.fullName\" type=\"input\"/></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Username</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"newLoginData.username\" type=\"input\"/></div>\n\t\t</div>\n\t\t<div class=\"dlg-property\">\n\t\t\t<div class=\"dlg-label\">Password</div>\n\t\t\t<div class=\"dlg-value\"><input value.bind=\"newLoginData.password\" type=\"password\"/></div>\n\t\t</div>\n    </div>\n\t<div class=\"modal-footer\">\n\t\t<div class=\"button\" click.trigger=\"newLoginModal.close()\">Log in</div>\n\t\t<div class=\"button\" click.trigger=\"newLoginModal.cancel()\">Cancel</div>\n\t</div>\n  </modal>-->\n\n\n\n </div>\n</template>\n\n\n\n"; });
define('text!app.css', ['module'], function(module) { module.exports = ":root {\r\n\tfont-family:Arial;\r\n}\r\n\r\n:root .red {\r\n  --contextBorderColor: #E61031;\r\n  --contextBorderHiliteColor: #E06440;\r\n  --contextBorderDarkColor: #A02200;\r\n  --contextBorderDarkerColor: #401100;\r\n  --contextBorderDarkestColor: #200000;\r\n  --contextLinkColor: #802210;\r\n  --visibleBorder:dotted 1px black;\r\n  --invisibleBorder:solid 1px transparent;\r\n  --boundary: var(--invisibleBorder);\r\n  --mainWidth:100%;\r\n  --verticalGradient1: linear-gradient(to bottom, var(--contextBorderDarkColor) 0%, var(--contextBorderDarkestColor) 100%);\r\n  --verticalGradient2: linear-gradient(to bottom, var(--contextBorderDarkerColor) 0%, var(--contextBorderDarkestColor) 100%);\r\n  // background-color:var(--contextBorderDarkestColor);\r\n}\r\n\r\n:root .blue {\r\n  --contextBorderColor: #21A0F6;\r\n  --contextBorderHiliteColor: #4064E0;\r\n  --contextBorderDarkColor: #0022A0;\r\n  --contextBorderDarkerColor: #0011A0;\r\n  --contextBorderDarkestColor: #000020;\r\n  --contextLinkColor: #102280;\r\n  --visibleBorder:dotted 1px black;\r\n  --invisibleBorder:solid 1px transparent;\r\n  --boundary: var(--invisibleBorder);\r\n  --mainWidth:100%;\r\n  --verticalGradient1: linear-gradient(to bottom, var(--contextBorderColor) 0%, var(--contextBorderDarkerColor) 100%);\r\n  --verticalGradient2: linear-gradient(to bottom, var(--contextBorderDarkerColor) 0%, var(--contextBorderDarkestColor) 100%);\r\n}\r\n\r\n\r\n@import url('https://fonts.googleapis.com/css?family=Zilla+Slab+Highlight&display=swap');\r\n\r\nbody  {\r\n\tmargin:0px;\r\n\tfont-family:Arial;\r\n\tbackground-color:black;\r\n}\r\n/*.outer.blue {\r\n\tbackground:black;\r\n//\tbackground:linear-gradient(to bottom, blue 0%, black 100%);\r\n}*/\r\n.tabs {\r\n\tgrid-area:tabs;\r\n\t/* height:40px; */\r\n\tmargin:10px;\r\n\tborder:var(--boundary);\r\n}\r\n\r\n.containerOld {\r\n\tdisplay:grid;\r\n\tgrid-template-areas: \"header\" \"body\";\r\n\tgrid-template-columns: 100%;\r\n\tgrid-template-rows:50px 1fr;\r\n}\r\n\r\n.container {\r\n\tdisplay:flex;\r\n\tflex-direction:column;\r\n}\r\n\r\n.outer {\r\n\tposition:absolute;\r\n\tleft:0;\r\n\ttop:0;\r\n\t/*background:var(--verticalGradient1);*/\r\n\tbackground:transparent;\r\n\twidth:100%;\r\n\theight:100%;\r\n}\r\n\r\n.list {\r\n\twidth:var(--mainWidth);\r\n\tgrid-area:list;\r\n\talign-items:start;\r\n\tpadding:20px;\r\n\tfont-family:Arial;\r\n\tmargin:10px;\r\n\tmargin-left:20px;\r\n\tborder:solid 2px var(--contextBorderColor);\r\n\tborder-radius:12px;\r\n}\r\n.images {\r\n\tpadding:20px;\r\n\tdisplay:block;\r\n\twidth:var(--mainWidth);\t\r\n\tpadding:20px;\r\n\tfont-family:Arial;\r\n\tmargin:10px;\r\n\tborder:solid 2px var(--contextBorderColor);\r\n\tborder-radius:12px;\r\n\r\n}\r\n.images .imageFrame {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\tflex-wrap:wrap;\r\n\r\n}\r\n.images .imageContainer {\r\n\twidth:320px;\r\n\tdisplay:block;\r\n}\r\n.imageCaption {\r\n\tdisplay:block;\r\n}\r\n.imagesEntry {\r\n\tdisplay:flex;\r\n\tflex-direction:column;\r\n\talign-items:center;\r\n\tjustify-content:center;\r\n\tpadding:5px;\r\n\r\n}\r\n\r\n.imageContainer .thumbImage {\r\n\tmax-width:200px;\r\n\tmax-height:200px;\r\n\tdisplay:block;\r\n}\r\n.summaryContainer {\r\n\tmargin:10pt;\r\n\tfont-style:italic;\r\n}\r\n.card {\r\n\twidth:100%;\r\n\tborder:solid 2px var(--contextBorderColor);\r\n\tborder-radius:12px;\r\n\tmargin:10px;\r\n\tpadding:30px;\r\n\tfont-family:Arial;\r\n\t//grid-area:card;\r\n\tdisplay:block;\r\n}\r\n\r\n.leftPane {\r\n\tdisplay:flex;\r\n\tflex-direction:column;\r\n\talign-items:flex-start;\r\n\tjustify-content:flex-start;\r\n\twidth:20%;\r\n/*\tborder:solid 1px red;*/\r\n\tbackground:transparent;\r\n\tmargin:0;\r\n\tpadding:10px;\r\n\tcolor:white;\r\n}\r\n\r\n\r\n.centerPane {\r\n\tdisplay:flex;\r\n\tflex-direction:column;\r\n\tmin-height: 1fr;\t\r\n\tbackground-color:white;\r\n\tpadding-top:5px;\r\n\tpadding-bottom:10px;\r\n\tjustify-content:flex-start;\r\n\talign-items:flex-start;\r\n\twidth:60%;\r\n\tmin-width:1024px;\r\n\tpadding-left:40px;\r\n}\r\n\r\n\r\n.leftPane .link {\r\n\tcolor:yellow;\r\n\r\n}\r\n\r\n.rightPane {\r\n\tdisplay:block;\r\n\twidth:20%;\r\n/*\tborder:solid 1px blue;*/\r\n/*\tbackground:var(--verticalGradient1);*/\r\n\tbackground:transparent;\r\n\tmargin:0;\r\n}\r\n\r\n@media only screen  and (max-width: 600px) {\r\n.leftPane {display:none;}\r\n.rightPane {display:none;}\r\n.centerPane {\r\n\tmin-width:0;\r\n\twidth:90%;\r\n}\r\n.mobile {display:none;}\r\n}\r\n\r\n\r\n.properties {\r\n/*\twidth:var(--mainWidth); */\r\n\tborder:solid 2px var(--contextBorderColor);\r\n\tmargin:10px;\r\n\tpadding:30px;\r\n\tborder-radius:12px;\r\n\toverflow-y: auto;\r\n/*\tmax-height:400px;*/\r\n}\r\n\r\n.sideProperties {\r\n\tcolor:white;\r\n\tpadding:10pt;\r\n}\r\n.sideProperties .property {\r\n\tfont-weight:normal;\r\n}\r\n\r\n\r\n.sideProperties .link\r\n {\r\n\tcolor:yellow;\r\n\tfont-weight:normal;\r\n}\r\n\r\n.sideProperties a:visited,.sideProperties a {color:yellow;}\r\n.card h1 {font-size:18pt;}\r\n\r\n.cardImage {\r\n\tmax-width:95%;\r\n\tmax-height:400px;\r\n\tmax-width:480px;\r\n\tmargin:10px;\r\n}\r\n.namespace {\r\n\tfont-size:12pt;\r\n\tfont-style:italic;\r\n\tpadding:10px;\r\n}\r\n\r\n\r\n.linkContainer {\r\n\tmargin-bottom:10pt;\r\n\tmin-height:80px;\r\n\tdisplay:flex;\r\n\tflex-direction:column;\r\n\tborder-bottom:solid 1pt var(--contextLinkColor);\r\n\tpadding-bottom:5pt;\r\n\t}\r\n\r\n.link, .bodyDisplay a {\r\n\tcolor: var(--contextLinkColor); \r\n\tfont-weight:bold;\r\n\tcursor:pointer;\r\n\ttext-decoration:none;\r\n}\r\n\r\n@media only screen  and (max-width: 600px) {\r\n\t.linkContainer {\r\n\tmargin-bottom:10pt;\r\n\tmin-height:80px;\r\n\tdisplay:flex;\r\n\tflex-direction:column;\r\n\t\r\n\t} }\r\n\r\n\r\n.label {font-weight:bold;}\r\n.property .value {\r\n\tdisplay:flex;\r\n\tflex-direction: row;\r\n}\r\n\r\n.property .label {\r\n\tdisplay:block;\r\n}\r\n\r\n.longWord {\r\n\t/*overflow-x:hidden;\r\n\tmax-width:350px;*/\r\n\toverflow-wrap: break-word\r\n}\r\n.linkImage {\r\n\tmax-width:100px;\r\n\tmax-height:80px;\r\n\t//float:left;\r\n\tdisplay:block;\r\n}\r\n.iconContainer {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\tmargin-right:10px;\r\n\r\n}\r\n.iconSubcontainer {\r\n\twidth:100px;\r\n\theight:80px;\r\n\talign-items: center;\r\n\tjustify-content: flex-end;\r\n\tdisplay:flex;\r\n}\r\n.linkMeta {\r\n\tdisplay:block;\r\n}\r\n\r\n.property .label {cursor:pointer;}\r\n\r\n.tabs {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\tflex-wrap:wrap;\r\n\tjustify-items:start;\r\n\t/*height:60px;*/\r\n\tfont-family:Arial;\r\n\tfont-size:10pt;\r\n\tfont-weight:bold;\r\n\tpadding:5px;\r\n\tmqrgin-top:5px;\r\n}\r\n\r\n.header {\r\n\tposition:fixed;\r\n\tgrid-area:header;\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\theight:35px;\r\n\tborder-bottom:solid 2px var(--contextBorderColor);\r\n\tpadding:10px;\r\n\tjustify-content:space-between;\r\n\tbackground-color:white;\r\n\twidth:99%;\r\n\tz-index:1;\r\n\tbox-shadow:4px 4px 4px rgba(0,0,0,0.7);\r\n}\r\n.headerBlock {\r\n    display:flex;\r\n    flex-direction:row;\r\n\r\n}\r\n.headerLogo {\r\n\theight:30px;\r\n}\r\n\r\n.tab {border:outset 2px gray;\r\n\t  border-radius:5px;\r\n\t  border-bottom-left-radius:0;\r\n\t  border-bottom-right-radius:0;\r\n\t  background-color: var(--contextBorderColor);\r\n\t  padding:5pt;\r\n\t  cursor:pointer;\r\n\t  color: white;\r\n\t  }\r\n\r\n.tab.active {border:inset 2px gray;\r\n\t  border-radius:5px;\r\n\t  border-bottom-left-radius:0;\r\n\t  border-bottom-right-radius:0;\r\n\t  border-bottom-color:transparent;\r\n\t  background-color:white;\r\n\t  color: var(--contextLinkColor);\r\n\t  }\r\n\r\n.description {\r\n\tmargin:10pt;\r\n\tpadding:10pt;\r\n\t\r\n}\r\n.description.expanded {\r\n\r\n}\r\n\r\n.description.contracted {\r\n\tmax-height:400px;\r\n\tmax-width:700px;\r\n\toverflow-y:auto;\r\n}\r\n\r\n.listRefine {\r\n\tpadding:10pt;\r\n\tdisplay:flex;\r\n\tflex-direction: row;\r\n\tjustify-content:flex-start;\r\n\tflex-wrap: wrap;\r\n\tborder-bottom:solid 3px var(--contextBorderColor);\r\n\tmargin-bottom:10pt;\r\n}\r\n.property {\r\n\tmargin-bottom:4pt;\r\n}\r\n.buttons {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\tmargin-bottom:10pt;\r\n\tpadding-bottom:10pt;\r\n\tborder-bottom:solid 1px var(--contextBorderColor);\r\n\r\n}\r\n.button {\r\n\t/* background-color: var(--contextBorderDarkColor); */\r\n\tbackground:radial-gradient(ellipse at center, #4d79a8 0%,#203c8a 49%,#0022A0 100%);\r\n\tcolor:rgba(255,255,255,0.75);\r\n\tbox-shadow:3px 3px 3px rgba(0,0,0,0.75);\r\n\tfont-size:10pt;\r\n\tpadding:5pt;\r\n\tcursor:pointer;\r\n\ttransform:translate(0,0);\r\n\tdisplay:inline-block;\r\n\tmargin:2px;\r\n\tfont-family:Arial;\r\n\tborder-radius:8px;\r\n\r\n}\r\n.button:hover {\r\n\tbackground-color:var(--contextBorderHiliteColor);\r\n\tcolor:white;\r\n}\r\n.button:active, .button.selected {\r\n\tbackground:radial-gradient(ellipse at center, #7db9e8 0%,#207cca 49%,#1e4299 100%);\r\n\ttransform:translate(2px,2px);\r\n\tbox-shadow:none;\r\n\tcolor:white;\r\n\ttext-shadow:-1px -1px 1px rgba(0,0,0,0.75);\r\n}\r\n\r\n/*.graph {\r\n\twidth:100%;\r\n\theight:100%;\r\n\tmax-width:1024px;\r\n\tmax-height:1024px;\r\n\tmin-height:700px;\r\n\tmin-height:1fr;\r\n\tresize: both;\r\n    overflow:hidden;\r\n    display:block;\r\n} */\r\n\r\n.iframeContainer {\r\n    position: relative;\r\n    overflow: hidden;\r\n    padding:0;\r\n    padding-top: 80%;\r\n}\r\n\r\n.iframeContainer .graph {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    border: 0;\r\n    margin:0;\r\n    padding:0;\r\n    overflow:hidden;\r\n}\r\n\r\n.modeButtons {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n}\r\n.modeFrame {\r\n\tdisplay:block;\r\n\twidth:1fr;\r\n\theight:40px;\r\n\tpadding-top:5px;\r\n}\r\n.pager {\r\n\tpadding-bottom:5px ;\r\n\tmargin-bottom:10px;\r\n\tborder-bottom:solid 2px var(--contextLinkColor) ;\r\n}\r\n.wait {\r\n\tcursor:wait;\r\n}\r\n.wait .link {\r\n\tcursor:wait;\r\n}\r\n.property .valueBlock {\r\n\t/* max-height:110px;\r\n\toverflow-y:auto;*/\r\n}\r\n.dealer {\r\n\tbackground-color:var(--contextBorderColor);\r\n\tcolor:white;\r\n\tpadding:5px;\r\n\tmargin-bottom:5px;\r\n}\r\n\r\n.sheetName {\r\n\tfont-size:12pt;\r\n\tfont-weight:bold;\r\n}\r\n.sheet {\r\n\tmargin:10pt;\r\n}\r\n.sheet details {\r\n\tpadding-left:10pt;\r\n}\r\n.sheet details summary {\r\n\tmargin-left:-10pt;\r\n\tfont-weight:bold;\r\n\tfont-style:italic;\r\n}\r\n.ingest.property .label {\r\n\tdisplay:inline-block;\r\n\tfont-weight:bold;\r\n}\r\n.ingest.property .value {\r\n\tdisplay:inline-block;\r\n\tfont-weight:normal;\r\n}\r\n.subhead {\r\n\tfont-size:14pt;\r\n\tfont-weight:bold;\r\n}\r\ntable tr th {\r\n\tbackground-color:var(--contextBorderColor);\r\n\tcolor:white;\r\n}\r\ntable td.inlineLabel {\r\n\tcolor:var(--contextBorderColor);\r\n\tfont-weight:bold;\r\n}\r\n.imageThumbnail {\r\n\tmax-width:140px;\r\n\tdisplay:block;\t\r\n}\r\n.searchItems {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n}\r\n.searchItem {\r\n\tdisplay:block;\r\n\tborder-bottom:solid 2px var(--contextBorderColor);\r\n\tmargin-bottom:10pt;\r\n}\r\n.valueBlock {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\tflex-wrap:wrap;\r\n}\r\n.value {display:block;}\r\n\r\n.imageFrame {\r\n\twidth:100%;\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\tflex-wrap:wrap;\r\n}\r\n.imageContainer {\r\n\tdisplay:block;\r\n}\r\n*[contenteditable=\"true\"]{\r\n\tborder:inset 2px gray;\r\n\tpadding:5px;\r\n}\r\n.imageMedium {\r\n\twidth:420px;\r\n}\r\n.longInput {\r\n\twidth:90%;\r\n}\r\n\r\n.modal { \r\n  position: fixed;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  z-index:1;\r\n  display:flex;\r\n  flex-direction:column;\r\n  justify-content:center;\r\n  align-items:center;\r\n  background: transparent;\r\n  font-family:Arial;\r\n  transform:scale(0,0);\r\n  transition: background 250ms ease-in-out;\r\n  padding:10pt;\r\n}\r\n.visible {\r\n    transform:scale(1,1);\r\n    background:rgba(0,0,0,0.7);\r\n  }\r\n .modal-content {\r\n \tdisplay:block;\r\n \tbackground-color:white;\r\n \tborder:groove 3px var(--contextBorderDarkerColor);\r\n \twidth:780px;\r\n } \r\n .modal-header {\r\n \tbackground-color: var(--contextBorderDarkerColor);\r\n \tpadding:5px;\r\n \tfont-weight:bold;\r\n \tcolor:white;\r\n \tposition:fixed;\r\n \tdisplay:block;\r\n \twidth:770px;\r\n }\r\n.modal-body  {\r\n\tpadding:0.125in;\r\n\tmargin-top:0.375in;\r\n\tmax-height:600px;\r\n\toverflow-y:auto;\r\n}\r\n\r\n.modal-footer {\r\n  display:flex;\r\n  flex-direction:row;\r\n  justify-content: flex-end;\r\n  border-top:solid 1px black;\r\n  padding:5pt;\r\n\r\n}\r\n\r\n .dlg-property {\r\n \tpadding:5pt;\r\n }\r\n\r\n .dlg-label {\r\n \tpadding-left:5pt;\r\n \tfont-weight:bold;\r\n }\r\n .dlg-value {\r\n \t/* border:inset 2px lightGray;*/\r\n }\r\n\r\n .bodyEditor {\r\n/* \tmax-height:400px;*/\r\n \twidth:720px;\r\n \t/*overflow-y:auto;*/\r\n\r\n }\r\n\r\n .bodyEditor img {\r\n\tmax-width:100%;\r\n }\r\n\r\n\r\n.bodyDisplay img {\r\n\tmax-width:100%;\r\n}\r\n\r\n.newModalBE {\r\n\theight:200px;\r\n\toverflow-y:scroll;\r\n}\r\n\r\n.duplicateModalBE {\r\n\theight:200px;\r\n\toverflow-y:scroll;\r\n}\r\n\r\n .cardTitleEdit input {\r\n \tfont-size:14pt;\r\n \tfont-weight:bold;\r\n \twidth:100%;\r\n }\r\n .classSelector {\r\n \theight:26pt;\r\n \t/* border:none; */\r\n \tfont-weight:bold;\r\n }\r\n .classSelector .predicate {\r\n \tfont-size:9pt;\r\n \tcolor:gray;\r\n \tdisplay:block;\r\n }\r\n\r\n .classSelector .predicateTarget {\r\n \tfont-size:12pt;\r\n \tdisplay:block;\r\n }\r\n\r\n .bannerText {\r\n \tfont-size:14pt;\r\n \tfont-weight:bold;\r\n \tfont-family:Arial,Helvetica;\r\n \theight:26pt;\r\n \tpadding-left:10pt;\r\n \tpadding-right:10pt;\r\n }\r\n\r\n .bannerText:hover {\r\n \tcolor:blue;\r\n \tcursor:pointer;\r\n }\r\n\r\n.propertyContextLabel {\r\n\tfont-size:16pt;\r\n\tfont-weight:bold;\r\n\tborder-bottom:solid 1pt black;\r\n\tmargin-bottom:10pt;\r\n}\r\n.editorButtonsPane {\r\n\tborder:inset 3px gray;\r\n\tbackground-color:lightGray;\r\n\tpadding:2px;\r\n/*\tmax-width:720px;*/\r\n\tdisplay:flex;\r\n\tflex-direction: column;\r\n\tposition:fixed;\r\n\tz-index:1;\r\n\tmargin-left:760px;\r\n\tmargin-top:0px;\r\n\twidth:240px;\r\n\tjustify-content:flex-start;\r\n}\r\n\r\n.editorButtons {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\tflex-wrap:wrap;\r\n\r\n}\r\n.editorBlock {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n}\r\n\r\n.paneContainer {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\tmargin-top:57px;\r\n}\r\n\r\n.horizontalPanes {\r\n\tgrid-area: body;\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\tjustify-content: space-between;\r\n\twidth:100%;\r\n\tbackground:transparent;\r\n}\r\n\r\n.display {\r\n\tdisplay:block;\r\n\twidth:90%;\r\n}\r\n.topBanner {\r\n\tdisplay:block;\r\n\tmax-width:800px;\r\n}\r\n.topBannerImage {\r\n\twidth:100%;\r\n\tbackground:black;\r\n\twidth:800px;\r\n}\r\n.monotype {\r\n\tfont-family: 'Zilla Slab Highlight', cursive;\r\n\tfont-size:14pt;\r\n\tdisplay:block;\r\n\tbackground-color:black;\r\n\tcolor:#40FF40;\r\n\tborder:inset 3px lightGray;\r\n\twidth:100%;\r\n\tpadding:8px;\r\n}\r\n\r\n.emailLink {text-decoration:none;}\r\n.hours {font-size:10pt;}\r\n.hours .item {margin-bottom:2pt;}\r\n.hours .label {font-style:italic;}\r\n.datatypeLink {font-style:italic;}\r\n.colorSwatchContainer {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\tjustify-content: felx-start;\r\n}\r\n.colorSwatch {\r\n\tdisplay:block;\r\n\twidth:48px;\r\n\theight:36px;\r\n}\r\n.largeColorSwatch {\r\n\tdisplay:block;\r\n\twidth:240px;\r\n\theight:180px;\r\n}\r\n.colorValue {\r\n\tdisplay:block;\r\n\tfont-size:12pt;\r\n\tpadding-left:10pt;\r\n}\r\n.colorIcon {\r\n\twidth:100px;\r\n\theight:80px;\r\n\tdisplay:block;\r\n\tborder:solid 1px black;\r\n\tmargin-right:10px;\r\n}\r\n.constraintsBlock {\r\n\tmargin-bottom:10pt;\r\n\tpadding-bottom:10pt;\r\n\tdisplay:block;\r\n\tborder-bottom:solid 2px var(--contextBorderColor);\r\n}\r\n\r\n.constraints {\r\n\tdisplay:flex;\r\n\tflex-direction:column;\r\n\tjustify-content:flex-start;\r\n}\r\n.constraint {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\tjustify-content:flex-start;\r\n}\r\n.sideProperties .internalImage {\r\n\tmax-width:160px;\r\n}\r\n.properties .internalImage {\r\n\tmax-width:500px;\r\n}\r\n\r\n.compliance .description {\r\n\tfont-size:10pt\r\n}\r\n.footer {\r\n/* \tbackground:var(--verticalGradient2);*/\r\n    background:transparent;\r\n\twidth:100%;\r\n\tmin-height:100px;\r\n\theight:100%;\r\n\tdisplay:flex;\r\n\tflex-direction:column;\r\n\tjustify-content:center;\r\n\talign-items:center;\r\n\tcolor:white;\r\n\r\n}\r\n.footer .copyright {\r\n\tdisplay:block;\r\n\tfont-family:Arial;\r\n\tcolor:white;\r\n}\r\n.footer a {\r\n\tcolor:yellow;\r\n\ttext-decoration:none;\r\n}\r\n\r\n.linkDate {font-style:italic;color:var(--contextBorderDarkerColor);}\r\n\r\n.insertedImage {\r\n\tmax-width:500px;\r\n}\r\n.centerPaneAddons {\r\n\twidth:1fr;\r\n\tmargin:10px;\r\n\tfont-family:Arial;\r\n\t//grid-area:card;\r\n\tdisplay:block;\t\r\n}\r\n.centerPaneAddons .block {\r\n\tborder:solid 2px var(--contextBorderColor);\r\n\tborder-radius:12px;\r\n\tpadding:15px;\r\n\tmargin:10px;\r\n\r\n}\r\n.imageHeader {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\tjustify-content: space-between;\r\n\r\n}\r\n.backLinks {\r\n\tdisplay:block;\r\n\twidth:1fr;\r\n\tmax-width:500px;\r\n\tpadding:20pt;\r\n\tborder:solid 1px var(--contextBorderColor);\r\n\tbox-shadow: 5px 5px 4px rgba(0,0,0,0.7);\r\n\tmargin:10pt;\r\n}\r\n.backLinks .title {\r\n\tmargin:-12pt;\r\n\tfont-weight:bold;\r\n}\r\n\r\n.itemCount {\r\n\tborder-bottom: solid 2px  var(--contextBorderColor);\r\n\tpadding:5pt;\r\n\tmargin-bottom:10pt;\r\n}\r\n.predicateTabs select {\r\n\tfont-size:16pt;\r\n\tfont-weight:bold;\r\n\tfont-style:italic;\r\n\tpadding-bottom:5pt;\r\n\tmargin-bottom:5pt;\r\n\tborder-bottom: solid 1px var(--contextBorderColor);\r\n\r\n}\r\n\r\n.settingsIcon {\r\n\twidth:16px;\r\n\theight:16px;\r\n\r\n}\r\n.mainMenu {\r\n\tdisplay:none;\r\n\tposition:absolute;\r\n\tz-index:1;\r\n\tbackground:white;\r\n\tborder:solid 1px black;\r\n\tbox-shadow:3px 3px 3px rgba(0,0,0,0.75);\r\n\tpadding:5pt;\r\n\tpadding-right:10pt;\r\n\tmargin-left:20pt;\r\n}\r\n\r\n.mainMenu.visible {display:block;}\r\n.mainMenu .menuItem div {\r\n\tborder:solid 1px transparent;\r\n}\r\n.mainMenu .menuItem div:hover {\r\n\tborder:solid 1px  var(--contextBorderColor);\r\n}\r\n.curie {font-style:italic;}\r\n.editorButton {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\talign-items: center;\r\n\tjustify-content: center;\r\n\twidth:32px;\r\n\theight:32px;\r\n\r\n}\r\n.editorButtonLong {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\talign-items: center;\r\n\tjustify-content: center;\r\n\twidth:64px;\r\n\theight:32px;\r\n\r\n}\r\n.editorButtonImage {\r\n\twidth:12pt;\r\n\theight:12pt;\r\n}\r\n.bodyEditorImage {}\r\n.bodyEditorImage.None {}\r\n.bodyEditorImage.Left {float:left;vertical-align:top;padding-right:5pt;padding-bottom:5pt;}\r\n.bodyEditorImage.Right {float:right;vertical-align:top;padding-left:5pt;padding-bottom:5pt;}\r\n\r\n.activeLight {color:#80FF80;text-shadow:2px 2px 2px rgba(0,0,0,0.75);}\r\n.inactiveLight {color:red;text-shadow:2px 2px 2px rgba(0,0,0,0.75);}\r\n\r\n.modal-body {\r\n\tpadding:0.25in;\r\n}\r\n\r\n.textLiteralBlock {\r\n\twidth:800px;\r\n\tmin-height:250px;\r\n}\r\n\r\n\r\n.graphBody {margin:0.125in;}\r\n\r\n.userFullName {\r\n\tvertical-align:middle;\r\n\tfont-size:9pt;\r\n\tpadding-top:8pt;\r\n\tpadding-right:5pt;\r\n}\r\n\r\n.altLinksContent {\r\n\tdisplay:block;\r\n\twidth:960px;\r\n}\r\n\r\n.dlgHeader {\r\n\tdisplay:flex;\r\n\tflex-direction:row;\r\n\tjustify-content: space-between;\r\n}"; });
define('SortedObjectKeysValueConverter',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var SortedObjectKeysValueConverter = exports.SortedObjectKeysValueConverter = function () {
        function SortedObjectKeysValueConverter() {
            _classCallCheck(this, SortedObjectKeysValueConverter);
        }

        SortedObjectKeysValueConverter.prototype.toView = function toView(obj) {
            var temp = [];

            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    temp.push(prop);
                }
            }
            temp.sort();
            return temp;
        };

        return SortedObjectKeysValueConverter;
    }();
});
define('ObjectKeysValueConverter',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var ObjectKeysValueConverter = exports.ObjectKeysValueConverter = function () {
        function ObjectKeysValueConverter() {
            _classCallCheck(this, ObjectKeysValueConverter);
        }

        ObjectKeysValueConverter.prototype.toView = function toView(obj) {
            var temp = [];

            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    temp.push(prop);
                }
            }

            return temp;
        };

        return ObjectKeysValueConverter;
    }();
});
//# sourceMappingURL=app-bundle.js.map