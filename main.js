//IIFE
(function () {
    console.log("setup called ")
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'rlottie-wasm.js';
    head.appendChild(script);

    script.onload = _ => {
      console.log("setup1 called ");
      Module.onRuntimeInitialized = _ => {
        console.log("setup1 called ");
        var instance = new Module.RlottieWasm();
        alert(instance.frames());
      };
    };
})();

