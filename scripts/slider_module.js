import {store} from "./products.js"

class Track {
    constructor(ctx) {
        this.slider = ctx;
    };

    get DOMReact(){ return document.getElementById('track').getBoundingClientRect() };
      
    get width() {return this.DOMReact.width};
    
    get step(){
      return parseFloat((this.width / this.slider.max).toFixed(2));
    };
  
    get leftLimit(){ return this.DOMReact.left};
  
    get rightLimit(){ return this.DOMReact.right};
  }
  class Thumb {
    constructor (ctx, id){
        this.slider = ctx;
        this.id = id
    };
  
    #offset = 0;
    
    get currentOffset() { return this.#offset };
    
    /**
     * @param {number} step
     */
    set newOffset(step) {
      const newOffset = this.currentOffset + step;
      const isMAX = this.id === 'thumbMax';
      const isThumbCollision = isMAX
        ? (newOffset < (-(this.slider.track.width - this.slider.thumbMin.currentOffset - 20)))
        : (newOffset > (this.slider.track.width + this.slider.thumbMax.currentOffset - 20));
      const thumbCollisionCoord = isMAX ? (-(this.slider.track.width - this.slider.thumbMin.currentOffset - 20)) : (this.slider.track.width + this.slider.thumbMax.currentOffset - 20);
      const zeroOffset = isMAX ? (newOffset > 0) : (newOffset < 0);
  
      if (isThumbCollision) {
        this.#offset = thumbCollisionCoord;
      } else if (zeroOffset) {
        this.#offset = 0;
      }else {
        this.#offset += step;
      }
    };
  
    get el(){
      return document.getElementById(this.id);
    };
  
    get position(){ 
      const thumbPos = this.el.getBoundingClientRect();
      return thumbPos.left + thumbPos.width / 2;
    };
  
    moveThumb(mouse) {
      let offset = 0
      let cursorPos = Math.ceil(mouse.clientX);
      let thumbPosition = Math.ceil(this.position);
      while (cursorPos !== thumbPosition) {
        let direction = cursorPos - this.position;
        if (direction > 0) {
          offset++
          thumbPosition++
        } else if (direction < 0) {
          offset--
          thumbPosition--
        }
  
        this.newOffset = offset;
  
        this.el.setAttribute('style', `left: ${this.currentOffset}px`);
  
        this.slider.pointerMax.setValueOfPointer();
        this.slider.pointerMin.setValueOfPointer();
        offset = 0;
      }
    }
  };
  
  class Pointer {
    constructor (ctx, id){
        this.slider = ctx;
        this.id = id
    };
    // FIXME: Not clear name
    get maxOrMin() {return /[M][a][x]/.test(this.id)};
  
    get el() { return document.getElementById(this.id); };
  
    setValueOfPointer() {
      const absoluteValue = this.slider[this.maxOrMin ? 'thumbMax' : 'thumbMin'].position - this.slider.track.leftLimit;
      const actualValue = parseInt(absoluteValue/this.slider.track.step);
      this.el.innerHTML = actualValue;
      return (actualValue);
    }
  
  };
  
  class Slider {
  
    get min() {return 0};
  
    get max(){
      const prices = store.map((item) => item.actualPrice);
      return Math.max(...prices);
    };
  
    track = new Track(this);
  
    thumbMin = new Thumb(this, 'thumbMin');
    thumbMax = new Thumb(this, 'thumbMax');
  
    pointerMin = new Pointer(this, 'pointerMin');
    pointerMax = new Pointer(this, 'pointerMax');
  };

  export {Slider}