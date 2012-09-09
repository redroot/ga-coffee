(function() {
  var Gene, Population, population;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Gene = (function() {
    function Gene(code) {
      this.code = code || '';
      this.cost = 9999;
    }
    Gene.prototype.randomize = function(length) {
      var _results;
      this.code = '';
      _results = [];
      while (length--) {
        _results.push(this.code += String.fromCharCode(Math.floor(Math.random() * 255)));
      }
      return _results;
    };
    Gene.prototype.calculate_cost = function(compare) {
      var i, total, _ref;
      total = 0;
      for (i = 0, _ref = compare.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        total += Math.pow(this.code.charCodeAt(i) - compare.charCodeAt(i), 2);
      }
      return this.cost = total;
    };
    Gene.prototype.mate = function(gene) {
      var child_one, child_two, pivot;
      pivot = Math.round(this.code.length / 2) - 1;
      child_one = this.code.substr(0, pivot) + gene.code.substr(pivot);
      child_two = gene.code.substr(0, pivot) + this.code.substr(pivot);
      return [new Gene(child_one), new Gene(child_two)];
    };
    Gene.prototype.mutate = function(chance) {
      var chars, direction, rand;
      if (Math.random() > chance) {
        return;
      }
      rand = Math.floor(Math.random() * this.code.length);
      direction = (Math.random() <= 0.5 ? -1 : 1);
      chars = this.code.split("");
      chars[rand] = String.fromCharCode(this.code.charCodeAt(rand) + direction);
      return this.code = chars.join("");
    };
    return Gene;
  })();
  Population = (function() {
    function Population(goal, size) {
      var gene;
      this.members = [];
      this.generation = 0;
      this.goal = goal;
      while (size--) {
        gene = new Gene();
        gene.randomize(this.goal.length);
        this.members.push(gene);
      }
    }
    Population.prototype.sort = function() {
      return this.members.sort(function(a, b) {
        return a.cost - b.cost;
      });
    };
    Population.prototype.display = function() {
      var content, gene, _i, _len, _ref;
      document.getElementById("generation").innerHTML = this.generation;
      content = "";
      _ref = this.members;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        gene = _ref[_i];
        content += "<li>" + gene.code + " <em>(" + gene.cost + ")</em></li>";
      }
      return document.getElementById("list").innerHTML = content;
    };
    Population.prototype.run_generation = function() {
      var children, gene, _i, _j, _len, _len2, _ref, _ref2;
      _ref = this.members;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        gene = _ref[_i];
        gene.calculate_cost(this.goal);
      }
      this.sort();
      this.display();
      children = this.members[0].mate(this.members[1]);
      this.members.splice(this.members.length - 2, 2, children[0], children[1]);
      _ref2 = this.members;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        gene = _ref2[_j];
        gene.mutate(0.3);
        gene.calculate_cost(this.goal);
        if (gene.code === this.goal) {
          this.sort();
          this.display();
          return true;
        }
      }
      this.generation++;
      return setTimeout((__bind(function() {
        return this.run_generation();
      }, this)), 20);
    };
    return Population;
  })();
  population = new Population("Hello, world!", 20);
  population.run_generation();
}).call(this);
