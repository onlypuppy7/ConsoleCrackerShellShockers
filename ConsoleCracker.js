// ==UserScript==
// @name         ConsoleCracker: Variable Exposer for Shell Shockers
// @namespace    https://github.com/onlypuppy7/ConsoleCrackerShellShockers/
// @license      GPL-3.0
// @version      1.0.0
// @author       onlypuppy7
// @description  Simple script that allows you to access most shell shockers variables usually hidden by the extern IIF
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// @icon         https://github.com/onlypuppy7/ConsoleCrackerShellShockers/blob/main/consolecracker.png?raw=true
// ==/UserScript==

//this script is built off LibertyMutual 1.3.0: https://github.com/onlypuppy7/LibertyMutualShellShockers/

(function () {
    let originalReplace = String.prototype.replace;

    String.prototype.originalReplace = function() {
        return originalReplace.apply(this, arguments);
    };

    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRGetResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');
    let shellshockjs
    XMLHttpRequest.prototype.open = function(...args) {
        const url = args[1];
        if (url && url.includes("js/shellshock.js")) {
            shellshockjs = this;
        };
        originalXHROpen.apply(this, args);
    };
    Object.defineProperty(XMLHttpRequest.prototype, 'response', {
        get: function() {
            if (this===shellshockjs) {
                return applyConsoleCracker(originalXHRGetResponse.get.call(this));
            };
            return originalXHRGetResponse.get.call(this);
        }
    });

    const fetchTextContent = function(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false); // Make the request synchronous
        xhr.send();
        if (xhr.status === 200) {
            return xhr.responseText;
        } else {
            console.error("Error fetching text content. Status:", xhr.status);
            return null;
        };
    };

    const applyConsoleCracker = function(js) {
        
        const modifyJS = function(find,replace) {
            let oldJS = js;
            js = js.originalReplace(find,replace);
            if (oldJS !== js) {
                console.log("%cReplacement successful! Injected code: "+replace, 'color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            } else {
                console.log("%cReplacement failed! Attempted to replace "+find+" with: "+replace, 'color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            };
        };

        console.log('%cATTEMPTING TO START CONSOLECRACKER', 'color: magenta; font-weight: bold; font-size: 1.5em; text-decoration: underline;');
    
        js = js.replace("(()=>{", "");
        js = js.replace("}}})();", "}};");

        modifyJS("Not playing in iframe", "CONSOLECRACKER ACTIVE!");
        console.log(js);
        console.log(CCH);
        return js;
    };

    let clientKeys;
    window.onlineClientKeys = fetchTextContent("https://raw.githubusercontent.com/StateFarmNetwork/client-keys/main/statefarm_latest.json");

    if (onlineClientKeys == "value_undefined" || onlineClientKeys == null) {
        let userInput = prompt('Valid keys could not be retrieved online. Enter keys if you have them. Join the StateFarm Network Discord server to generate keys! https://discord.gg/HYJG3jXVJF', '');
        if (userInput !== null && userInput !== '') {
            alert('Aight, let\'s try this. If it is invalid, it will just crash.');
            clientKeys = JSON.parse(userInput);
        } else {
            alert('You did not enter anything, this is gonna crash lmao.');
        };
    } else {
        clientKeys = JSON.parse(onlineClientKeys);
    };

    //console cracker H
    window.CCH = clientKeys.vars;
})();
