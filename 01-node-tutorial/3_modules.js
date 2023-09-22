// Modules
const names = require("./4_module_names");
const sayHi = require("./5_module_utils");
const data = require("./6_module_alternative_flavour");
console.log(data);

sayHi("susan");
sayHi(names.john);
sayHi(names.peter);

require("./7_module_mind_grenade");
