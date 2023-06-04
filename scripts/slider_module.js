import {store} from "./products.js"
import {slider} from "./app.js"

class Track {
    get DOMReact(){ return document.getElementById('track').getBoundingClientRect() };
      
    get width() {return this.DOMReact.width};
    
    get step(){
      return parseFloat((this.width / slider.max).toFixed(2));
    };
  
    get leftLimit(){ return this.DOMReact.left};
  
    get rightLimit(){ return this.DOMReact.right};
  }
  class Thumb {
    constructor (id){
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
        ? (newOffset < (-(slider.track.width - slider.thumbMin.currentOffset - 20)))
        : (newOffset > (slider.track.width + slider.thumbMax.currentOffset - 20));
      const thumbCollisionCoord = isMAX ? (-(slider.track.width - slider.thumbMin.currentOffset - 20)) : (slider.track.width + slider.thumbMax.currentOffset - 20);
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
  
        slider.pointerMax.setValueOfPointer();
        slider.pointerMin.setValueOfPointer();
        offset = 0;
      }
    }
  };
  
  class Pointer {
    constructor (id){
      this.id = id
    };
    get maxOrMin() {return /[M][a][x]/.test(this.id)};
  
    get el() { return document.getElementById(this.id); };
  
    setValueOfPointer() {
      const absoluteValue = slider[this.maxOrMin ? 'thumbMax' : 'thumbMin'].position - slider.track.leftLimit;
      const actualValue = parseInt(absoluteValue/slider.track.step);
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
  
    track = new Track();
  
    thumbMin = new Thumb('thumbMin');
    thumbMax = new Thumb('thumbMax');
  
    pointerMin = new Pointer('pointerMin');
    pointerMax = new Pointer('pointerMax');
  };

  export {Slider, Track, Pointer, Thumb}