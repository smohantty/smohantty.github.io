//IIFE setup function.
(function () {
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'rlottie-wasm.js';
    head.appendChild(script);

    script.onload = _ => {
      Module.onRuntimeInitialized = _ => {
        var player = new Player();
      };
    };
})();


class Player
{
    layout() {
      var width = document.getElementById("p-content").clientWidth;
      var height = document.getElementById("p-content").clientHeight;
      var size = width;
      if (width < height)
        size = width;
      else
        size = height;
      size = size-8;

      document.getElementById("p-canvas").width  = size;
      document.getElementById("p-canvas").height  = size;
    }

    sliderUpdate()
    {
        document.getElementById("p-slider").max = this.frames;
        document.getElementById("p-slider").value = this.frame;
        document.getElementById("p-slider-cur").innerHTML = this.frame.toString();
        document.getElementById("p-slider-max").innerHTML = this.frames.toString();
    }
    render(frame)
    {
        var canvas = document.getElementById('p-canvas');
        var buffer = this.rlottie.render(frame, canvas.width, canvas.height)
        var imageData = new ImageData(Uint8ClampedArray.from(buffer), canvas.width, canvas.height);
        canvas.getContext('2d').putImageData(imageData, 0, 0);
    }
    tick()
    {
        this.render(this.frame++);
        if (this.frame >= this.frames) this.frame = 0;

        this.sliderUpdate();

        window.requestAnimationFrame(()=>{ this.tick();});
    }
    constructor()
    {
        this.layout();
        this.rlottie = new Module.RlottieWasm();
        this.frames = this.rlottie.frames();
        this.frame = 0;
        window.requestAnimationFrame(()=>{ this.tick();});
    }
}