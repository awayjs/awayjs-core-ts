"use strict";
exports.__esModule = true;
var fs = require("fs");
var indexJSData="";
fs.readFile("./dist/index.js", 'utf8', function(err, data) {
    if (err) throw err;
    indexJSData=dat.replace("#BUILD_VIA_NPM_VERSION_PATCH_TO_DISPLAY_VERSION_HERE#", process.env.npm_package_version);
    console.log(indexJSData);
    fs.writeFile("/tmp/test", "Hey there!", function(err) {
        if (err) throw err;    
        console.log("Updated ./dist/index.js with inserted version ", process.env.npm_package_version);
    }); 
});           