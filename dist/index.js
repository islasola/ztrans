var $c5L0i$express = require("express");


      var $parcel$global = globalThis;
    
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire705a"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire705a"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
parcelRegister("epZHA", function(module, exports) {

});


const $43d7963e56408b24$var$app = $c5L0i$express();
const $43d7963e56408b24$var$port = 3000;

$43d7963e56408b24$var$app.use('/api/v1/auth', (parcelRequire("epZHA")));
$43d7963e56408b24$var$app.listen($43d7963e56408b24$var$port, ()=>{
    console.log(`Server running on port ${$43d7963e56408b24$var$port}`);
});


//# sourceMappingURL=index.js.map
