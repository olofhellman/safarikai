// Generated by CoffeeScript 1.11.1
(function() {
  window.Safarikai = {
    initialize: function() {
      this.queryWord = "";
      return this.result = "";
    },
    sendStatus: function(page) {
      return page.dispatchMessage("status", {
        enabled: this.enabled(),
        highlightText: this.highlightText(),
        showRomaji: this.showRomaji(),
        showTranslation: this.showTranslation()
      });
    },
    highlightText: function() {
      return true;
    },
    enabled: function() {
      return true;
    },
    showRomaji: function() {
      return true;
    },
    showTranslation: function() {
      return true;
    },
    toggle: function() {
      return this.updateStatus();
    },
    resultsLimit: function() {
      return 5;
    },
    lookup: function(word, url, page) {
      if (this.enabled()) {
        if (this.queryWord !== word) {
          this.queryWord = word;
          this.result = this.dict.find(this.queryWord, this.resultsLimit());
        }
        return page.dispatchMessage("showResult", {
          word: this.result.match,
          url: url,
          result: this.result.results
        });
      }
    },
    status: function(page) {
      return this.sendStatus(page);
    },
    updateStatus: function() {
      var i, len, ref, results, tab, win;
      this.prepareDictionary();
      ref = safari.application.browserWindows;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        win = ref[i];
        results.push((function() {
          var j, len1, ref1, results1;
          ref1 = win.tabs;
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            tab = ref1[j];
            results1.push(this.sendStatus(tab.page));
          }
          return results1;
        }).call(this));
      }
      return results;
    },
    prepareDictionary: function() {
      var ref;
      if (this.enabled()) {
        this.dict || (this.dict = new Dictionary);
        return this.dict.load();
      } else {
        if ((ref = this.dict) != null) {
          ref.unload();
        }
        return this.dict = null;
      }
    }
  };

  Safarikai.initialize();

  Safarikai.prepareDictionary();

  safari.application.addEventListener("command", function(e) {
    var ref;
    return (ref = Commands[e.command]) != null ? typeof ref.invoke === "function" ? ref.invoke(e) : void 0 : void 0;
  });

  safari.application.addEventListener('validate', function(e) {
    var ref;
    return (ref = Commands[e.command]) != null ? typeof ref.validate === "function" ? ref.validate(e) : void 0 : void 0;
  });

  safari.application.addEventListener("message", function(e) {
    var messageData;
    messageData = e.message;
    switch (e.name) {
      case "lookupWord":
        return Safarikai.lookup(messageData.word, messageData.url, e.target.page);
      case "queryStatus":
        return Safarikai.status(e.target.page);
    }
  });

}).call(this);