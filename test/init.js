beforeEach(function() {
  jasmine.addMatchers({
    toBeArray: function(array) {
      this.message = function() {
        return "Expected " + JSON.stringify(array) + " to be array " + JSON.stringify(array) + ".";
      };
      var arraysAreSame = function(x, y) {
         var arraysAreSame = true;
         for(var i; i < x.length; i++)
            if(x[i] !== y[i])
               arraysAreSame = false;
         return arraysAreSame;
      };
      return arraysAreSame(this.actual, array);
    }
  });

});
