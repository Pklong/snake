(function (root) {
  var callBackQueue = [],
      ready = false;

  document.addEventListener("DOMContentLoaded", function () {
    ready = true;
    callBackQueue.forEach(function (cb) { cb(); });
  });

  var enqueueDocumentCB = function(cb) {
    if (ready) {
      cb();
    } else {
      callBackQueue.push(cb);
    }
  };

  function retrieveDomNodes(selector) {
    var nodes = [].slice.call(document.querySelectorAll(selector), 0);
    return new DOMNodeCollection(nodes);
  }

  function DOMNodeCollection(nodes) {
    this.nodes = [].slice.call(nodes);
  }

  DOMNodeCollection.prototype = {
    addClass: function(className) {
      this.each(function(node) {
        node.classList.add(className);
      });
    return this;
    },

    append: function (children) {
      debugger;
      if (this.nodes.length > 0) { return; }

      if (typeof children === 'object' &&
      !(children instanceof DOMNodeCollection)) {
        children = root.$w(children);
      }

      if (typeof children === 'string') {
        this.each(function (node) {
          node.innerHTML += children;
        });
      } else if (children instanceof DOMNodeCollection) {
        var node = this.nodes[0];
        children.each(function (childNode) {
          node.appendChild(childNode);
        });
      }
    },

    attr: function (key, value) {
      if (typeof value === 'string') {
        this.each (function (node) {
          node.setAttribute(key, value);
        });
      } else {
        return this.nodes[0].getAttribute(key);
      }
    },


    children: function () {
      var childNodes = [];
      this.each(function(node) {
        var childNodeList = node.children;
        childNodes = childNodes.concat([].slice.call(childNodeList));
      });
      return new DOMNodeCollection(childNodes);
    },

    each: function(cb) {
      this.nodes.forEach(cb);
    },

    empty: function () {
      this.html("");
    },

    eq: function (idx) {
      if (!this.nodes[idx]) {
        return new DOMNodeCollection([]);
      } else {
        return new DOMNodeCollection([this.nodes[idx]]);
      }
    },

    html: function(html) {
      if (typeof html === 'string') {
        //setter
        this.nodes.forEach(function (el) {
          el.innerHTML = html;
        });
      } else {
        //getter
        if (this.nodes.length > 0) {
          return this.nodes[0].innerHTML;
        } else {
          console.error("No nodes present!");
        }
      }
    },
    filter: function(selector) {
      var filterNodes = [];
      this.each(function (node) {
        if (node.matches(selector)) {
          filterNodes.push(node);
        }
      });
      return new DOMNodeCollection(filterNodes);
    },

    find: function (selector) {
      var foundNodes = [];
      this.each(function (node) {
        var nodeList = node.querySelectorAll(selector);
        foundNodes = foundNodes.concat([].slice.call(nodeList));
      });
      return new DOMNodeCollection(foundNodes);
    },

    parent: function () {
      var parentNodes = [];
      this.each(function (node) {
        parentNodes.push(node.parentNode);
      });
      return new DOMNodeCollection(parentNodes);
    },

    remove: function () {
      this.each(function(node){
        node.parentNode.removeChild(node);
      });
    },

    removeClass: function(className) {
      this.each(function(node) {
        node.classList.remove(className);
      });
    },

    off: function (event, callback) {
      this.each(function (node) {
        node.removeEventListener(event, callback);
      });
    },

    on: function (event, callback) {
      this.each(function(node) {
        node.addEventListener(event, callback);
      });
    }
};

  root.$w = function(arg) {
    var wrapper;

    if (typeof arg === 'function') {
      //document is loading...
      enqueueDocumentCB(arg);
    } else if (typeof arg === 'string') {
      //css selector
      wrapper = retrieveDomNodes(arg);
    } else if (arg instanceof HTMLElement) {
      wrapper = new DOMNodeCollection([arg]);
    } else {
      console.error("Cannot jQuerify!");
    }

    return wrapper;
  };

  root.$w.extend = function(base) {
    var otherObjs = [].slice.call(arguments, 1);

    otherObjs.forEach(function(obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          base[prop] = obj[prop];
        }
      }
    });
    return base;
  };

  var toQueryString = function(obj){
    var result = "";
    for(var prop in obj){
      if (obj.hasOwnProperty(prop)){
        result += prop + "=" + obj[prop] + "&";
      }
    }
    return result.substring(0, result.length - 1);
  };

  root.$w.myAjax = function(options) {
    var request = new XMLHttpRequest();

    var requestParams = {
      method: 'GET',
      url: window.location.href,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: function () {},
      error: function () {},
      data: {},
    };

    requestParams = root.$w.extend(requestParams, options);

    if (options.method.toUpperCase() === 'GET'){
      options.url += "?" + toQueryString(options.data);
    }

    request.open(requestParams.method, requestParams.url, true);
    request.onload = function(e) {
      if (request.status === 200) {
        options.success(request.response);
      } else {
        options.error(request.response);
      }
    };

    request.send(JSON.stringify(options.data));
  };
})(this);
