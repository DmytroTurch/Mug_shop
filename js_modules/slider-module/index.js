const sectorOne = document.querySelector('.sector_one');
const sectorTwo = document.querySelector('.sector_two');
const sectorThree = document.querySelector('.sector_three');
const thumbMinEl = document.querySelector('.thumb_min');
const thumbMaxEl = document.querySelector('.thumb_max');

const slider = {
    width : 100,

    emptyMin: {
        scale: 0,
        translate: 0
    },
    mainSector: {
        scale: 1,
        translate: 0
    },
    emptyMax: {
        scale: 0,
        translate: 0,
    },


    // in further update make thumb realization in JS as array of standardized objs 
    thumbMin: {
        positionDefault: -50,
        positionCurrent: -50, 
    },

    thumbMax: {
       
    },

//at that moment take x as difference between start position of cursor and his current position ((start - current))
    moveThumbMin(offset) {
            newX = this.thumbMin.xThumbAbsolute + offset
            if (13 < newX < 100) {
                this.thumbMin.xThumbAbsolute = newX;
            }
            const minDefaultPosition = this.thumbMin.positionDefault;
            const maxDefaultPosition = this.thumbMax.positionDefault;

            const minCurrentPosition = this.thumbMin.positionCurrent;
            const maxCurrentPosition = this.thumbMax.positionCurrent;

            const currentMainScale = this.mainSector.scale;
            const minCurrentScale = this.emptyMin.scale;
            const maxCurrentScale = this.emptyMax.scale;

            let newMinScale = minCurrentScale + offset/100;
            let newMainScale = currentMainScale - offset/100;
            let newMainTranslate = (newMinScale / newMainScale)*100;
            let newThumbMinPosition = minCurrentPosition + offset*10;

            if((newThumbMinPosition <  maxDefaultPosition) && (newThumbMinPosition >= maxCurrentPosition)) {
                offset = newMainScale*100;
                newMinScale = 1 - maxCurrentScale - 0.01;
                newMainScale = 0.01;
                newMainTranslate = (newMinScale / newMainScale)*100;;
                newThumbMinPosition = maxCurrentPosition - 10;

            }else if (newThumbMinPosition >= maxDefaultPosition) {
                newMinScale = 0.99;
                newMainScale = 0.01;
                newMainTranslate = (newMinScale / newMainScale)*100;;
                newThumbMinPosition = maxDefaultPosition - 10; // 10 is width of thumb. 
            }

            if(newThumbMinPosition < minDefaultPosition){
                newMinScale = 0;
                newMainScale = 1 - maxCurrentScale;
                newMainTranslate = 0;
                newThumbMinPosition = -50;
            }

            this.emptyMin.scale = newMinScale;
            this.mainSector.scale = newMainScale;
            this.mainSector.translate = newMainTranslate;
            this.thumbMin.positionCurrent = newThumbMinPosition;
            
            sectorOne.setAttribute('style', `transform: scale(${newMinScale}, 1) translate(0%, 0px)`);
            sectorTwo.setAttribute('style', `transform: scale(${newMainScale}, 1) translate(${newMainTranslate}%, 0px)`);
            thumbMinEl.setAttribute('style', `translate: ${newThumbMinPosition}% 0%`);
    },
    
    moveThumbMax(x) {
        let offset = Math.abs(x);

        if(x < 0) {
            this.emptyMax.scale += offset/100;
            this.mainSector.scale -= offset/100;
            this.thumbMax.positionCurrent -= offset*10;
            if ((this.thumbMax.positionCurrent > this.thumbMin.positionDefault) && (this.thumbMax.positionCurrent <= this.thumbMin.positionCurrent)) {
                this.emptyMax.scale = this.mainSector.scale - this.emptyMax.scale - 0.01;
                this.mainSector.scale = 0.01;
                this.thumbMin.positionCurrent = this.thumbMin.positionCurrent + 10;

            }else if(this.thumbMax.positionCurrent <= this.thumbMin.positionDefault) {
                this.emptyMax.scale = 0.99;
                this.mainSector.scale = 0.01;
                this.thumbMax.positionCurrent = -40;
            }
        } else if(x > 0){
            this.emptyMax.scale -= offset/100;
            this.mainSector.scale += offset/100;
            this.thumbMax.positionCurrent += offset*10;
            if(this.thumbMax.positionCurrent < this.thumbMax.positionDefault){
                this.emptyMax.scale = 0;
                this.mainSector.scale -= this.emptyMin.scale;
                this.mainSector.translate = 0;
                this.thumbMin.positionCurrent = 950;
            }
        }
        sectorTwo.setAttribute('style', `transform: scale(${this.mainSector.scale}, 1) translate(${this.mainSector.translate}%, 0px)`);
        sectorThree.setAttribute('style', `transform: scale(${this.emptyMax.scale}, 1) translate(0%, 0px)`);
        thumbMaxEl.setAttribute('style', `translate: ${this.thumbMax.positionCurrent}% 0%`);
    },
}

slider.thumbMax = {
    // 10 is thumb width and 50 is 50% of thumb - needed in order to place thumb center on chosen value. 
    positionDefault: (slider.width - 10) / 10 * 100 + 50, 
    initPos() {return this.positionDefault},
   }

slider.thumbMax.positionCurrent = slider.thumbMax.initPos();
let onThumb = false;



thumbMinEl.addEventListener('mousedown', (e) => {
    onThumb = true;
    let thumbCoordinates = e.target.getBoundingClientRect();
    slider.thumbMin.xThumbAbsolute = thumbCoordinates.left + thumbCoordinates.width/2;
})
window.addEventListener('mousemove', (e) => {
    if (onThumb) {
        slider.moveThumbMin((e.clientX-slider.thumbMin.xThumbAbsolute));
    }
});
window.addEventListener('mouseup', () => {
    onThumb = false;
});