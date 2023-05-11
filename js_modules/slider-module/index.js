const sectorOne = document.querySelector('.sector_one');
const sectorTwo = document.querySelector('.sector_two');
const sectorThree = document.querySelector('.sector_three');
const thumbMinEl = document.querySelector('.thumb_min');
const thumbMaxEl = document.querySelector('.thumb_max');

const slider = {
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

    thumbMin: {
        positionDefault: -50,
        positionCurrent: -50, 
    },

    thumbMax: {
        positionDefault: 950,
        positionCurrent: 950, 
    },
//at that moment take x as difference between start position of cursor and his current position ((start - current))
    moveThumbMin(x) {
        let offSet = Math.abs(x);
        let currentMainScale = this.mainSector.scale;
        let currentMainTranslate = this.mainSector.translate;

        let minDefaultPosition = this.thumbMin.positionDefault;
        let maxDefaultPosition = this.thumbMax.positionDefault;

        let minCurrentPosition = this.thumbMin.positionCurrent;
        let maxCurrentPosition = this.thumbMax.positionCurrent;


        if(x > 0) {
            let newMinScale = this.emptyMin.scale + offSet/100;
            let newMainScale = currentMainScale - offSet/100;
            let newMainTranslate = ((currentMainTranslate*(currentMainScale))+offSet)/newMainScale;
            let newThumbMinPosition = minCurrentPosition + offSet*10;

            if((newThumbMinPosition <  maxDefaultPosition) && (newThumbMinPosition >= maxCurrentPosition)) {
                offSet = newMainScale*100;
                newMinScale = 1 - this.emptyMax.scale - 0.01;
                newMainScale = 0.01;
                newMainTranslate = ((currentMainTranslate*(currentMainScale))+offSet)/newMainScale;
                newThumbMinPosition = maxCurrentPosition - 10;

            }else if (newThumbMinPosition >= maxDefaultPosition) {
                newMinScale = 0.99;
                newMainScale = 0.01;
                newMainTranslate = 99/(this.mainSector.scale);
                newThumbMinPosition = 940;
            }

            this.emptyMin.scale = newMinScale;
            this.mainSector.scale = newMainScale;
            this.mainSector.translate = newMainTranslate;
            this.thumbMin.positionCurrent = newThumbMinPosition;

        } else if (x < 0){
            let newMinScale = this.emptyMin.scale - offSet/100;
            let newMainScale = this.mainSector.scale + offSet/100;
            let newMainTranslate = ((currentMainTranslate*(currentMainScale))-offSet)/newMainScale;
            let newThumbMinPosition = minCurrentPosition - offSet*10;

            if(newThumbMinPosition < minDefaultPosition){
                newMinScale = 0;
                newMainScale = 1 - this.emptyMax.scale;
                newMainTranslate = 0;
                newThumbMinPosition = -50;
            }

            this.emptyMin.scale = newMinScale;
            this.mainSector.scale = newMainScale;
            this.mainSector.translate = newMainTranslate;
            this.thumbMin.positionCurrent = newThumbMinPosition;
        }

        sectorOne.setAttribute('style', `transform: scale(${this.emptyMin.scale}, 1) translate(0%, 0px)`);
        sectorTwo.setAttribute('style', `transform: scale(${this.mainSector.scale}, 1) translate(${this.mainSector.translate}%, 0px)`);
        thumbMinEl.setAttribute('style', `translate: ${this.thumbMin.positionCurrent}% 0%`);
    
    },
    
    moveThumbMax(x) {
        let offSet = Math.abs(x);

        if(x < 0) {
            this.emptyMax.scale += offSet/100;
            this.mainSector.scale -= offSet/100;
            this.thumbMax.positionCurrent -= offSet*10;
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
            this.emptyMax.scale -= offSet/100;
            this.mainSector.scale += offSet/100;
            this.thumbMax.positionCurrent += offSet*10;
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
