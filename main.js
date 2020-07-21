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

    sliderUpdate(value)
    {
        document.getElementById("p-slider").max = this.frames;
        document.getElementById("p-slider").value = this.frame;
        document.getElementById("p-slider-cur").innerHTML = this.frame.toString();
        document.getElementById("p-slider-max").innerHTML = this.frames.toString();
    }
    render()
    {
        this.sliderUpdate();

        var canvas = document.getElementById('p-canvas');
        var buffer = this.rlottie.render(this.frame, canvas.width, canvas.height)
        var imageData = new ImageData(Uint8ClampedArray.from(buffer), canvas.width, canvas.height);
        canvas.getContext('2d').putImageData(imageData, 0, 0);
    }
    tick()
    {
        if (!this.playing) return;

        this.render();

        if (++this.frame >= this.frames) this.frame = 0;

        window.requestAnimationFrame(()=>{ this.tick();});
    }
    sliderDrag()
    {
        this.frame = parseInt(document.getElementById("p-slider").value);
        this.render();
    }
    btnUpdate()
    {
        if (this.playing) {
            this.playing = false;
            document.getElementById("p-control").value = "Play";
        } else {
            this.playing = true;
            document.getElementById("p-control").value = "Pause";
            this.tick()
        }
    }

    load(jsString)
    {

        this.rlottie.load(jsString);
        this.frames = this.rlottie.frames();
        this.frame = 0;
        this.render();
    }

    handleFiles(files) {
        for (var i = 0, f; f = files[i]; i++) {
          if (f.type.includes('json')) {
            var read = new FileReader();
            read.readAsText(f);
            read.onloadend = ()=> {
                console.log("loaded");
                this.load(read.result);
            }
            break;
          }
        }
    }
    dragStart(evt)
    {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    }
    dropComplete(evt)
    {
        evt.stopPropagation();
        evt.preventDefault();

        this.handleFiles(evt.dataTransfer.files);
    }
    constructor()
    {
        this.layout();
        this.rlottie = new Module.RlottieWasm();
        this.frames = this.rlottie.frames();
        this.frame = 0;
        this.playing = false;
        document.getElementById("p-control").addEventListener('click', ()=>{this.btnUpdate();});
        document.getElementById("p-slider").addEventListener('input', ()=>{this.sliderDrag();});
        document.getElementById("p-selector-btn").addEventListener('click', ()=>{document.getElementById("p-selector").click();});
        document.getElementById('p-selector').addEventListener('change', ()=>{this.handleFiles(document.getElementById('p-selector').files);});
        window.addEventListener('dragover', (evt)=>{this.dragStart(evt);}, false);
        window.addEventListener('drop', (evt)=>{this.dropComplete(evt);}, false);
        this.btnUpdate();
    }
}