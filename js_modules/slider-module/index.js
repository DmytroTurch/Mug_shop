
class Thumb {

    constructor(indexOfThumb, slider) {
        this.elDOM = document.getElementById(`thumb${slider.ID}${indexOfThumb}`);
        this.currentTranslate = 0;
        this.newTranslate = 0;
        this.translateCSS = undefined;
        this.pointTo = undefined;
        this.xAbsolute = undefined;
        this.xAbsoluteDefault =
        this.update = function() {
                        this.translateCSS = `translate(${this.newTranslate}%, 0px)`;
                        this.pointTo = Math.ceil(slider.min + (this.newTranslate / slider.thumbWidth) * (slider.max - slider.min) / slider.trackWidth)+5; 
                        this.currentTranslate = this.newTranslate;
                    }
    }
}

class Sector {
    constructor(i, slider) {
        this.elDOM = document.getElementById(`sector${slider.ID}${i}`);
        this.currentScale = 0;
        this.initScale = 0;
        this.scaleCSS = undefined;
        this.calcScaleCSS = function() { this.scaleCSS = `scale(${this.currentScale}, 1)` };
        this.translate = 0;
        this.translateCSS = undefined;
        this.calcTranslateCSS = function() { this.translateCSS = `translate(${this.translate}%, 0px)` };
    }
}

class Slider {

    constructor(ID, trackWidth, thumbsNumber, min, max) {
        this.ID = ID;
        this.trackWidth = trackWidth;
        this.min = min;
        this.max = max;
        this.thumbsNumber = thumbsNumber;

        this.thumbWidth = 10;
        this.thumbHeight = 10;

        this.thumb = [];
        this.sector = [];

        this.mousedown = false;
    }

    setDefaultStyles() {
        document.getElementsByTagName('body')[0].innerHTML += `
        <style>
            .pointer-container {
                display: flex;
                justify-content: space-around;
                gap: 20px;
                width: ${this.trackWidth}px;
                margin-bottom: 10px;
            }

            .pointer {
                box-sizing: border-box;
                display: block;
                width: 40px;
                height: 20px;
                background-color: #fff;
                border-radius: 10px;
                border: solid #000 1px;
                box-shadow: inset 0.5px 0.5px 2px #000,;
                text-align: center;
            }

            .slider{
                margin: 0;
                position: relative;
            }
            .slider__track {
                height: 2px;
                position: relative;
                margin: 0;
            }

            .sector {
                position: absolute;
                top:0px;
                left: 0px;
                height: 100%;
                width: 100%;
                transform-origin: 0 0;
            }

            .sector:nth-child(even){
                background-color: #858282;
            }

            .sector:nth-child(odd){
                background-color: #000;
            }

            .thumb {
                position: absolute;
                top: -4px;
                width: ${this.thumbWidth}px;
                height: ${this.thumbHeight}px;
                background-color: #bdb4b4;
                border-radius: 5px;
                box-shadow: inset 0.5px 0.5px 0.5px #000, inset -0.5px -0.5px 0.5px #000;
            }
        </style>
        `;
    }

    
    setTrackPosition() {
        let coordObj = document.getElementById(`track${this.ID}`).getBoundingClientRect();
        this.trackStart = coordObj.left;
        this.trackEnd = coordObj.right;
    }

    createThumbs(number) {
        for (let i = 0; i < number; i++) {
            let indexOfThumb = this.thumb.length;
            this.thumb[indexOfThumb] = new Thumb(indexOfThumb, this);
            this.thumb[i].update();
        }
    }

    setSectors() {
        for (let i = 0; i <= this.thumb.length; i++) {
            this.sector[i] = new Sector(i, this);
            this.sector[i].calcScaleCSS();
            this.sector[i].calcTranslateCSS();
        }
    }
 
    calculateInitScale() {
        const sectorsArr = this.sector;
        let initScale = 1 / (sectorsArr.length-2);
        sectorsArr.forEach((sector) => {
            let index = sectorsArr.indexOf(sector);
            let sectorEl = document.getElementById(`sector${this.ID}${index}`);
            if (sectorEl.id === `sector${this.ID}0` || sectorEl.id === `sector${this.ID}${sectorsArr.length-1}`){
                sector.initScale = 0;
                sector.currentScale = sector.initScale;
                sector.calcScaleCSS();

                sectorEl.setAttribute('style', `transform: ${sectorsArr[index].scaleCSS} ${sectorsArr[index].translateCSS}`)
            } else {
                sector.initScale = initScale;
                sector.currentScale = sector.initScale;
                sector.calcScaleCSS();
                sectorEl.setAttribute('style', `transform: ${sectorsArr[index].scaleCSS} ${sectorsArr[index].translateCSS}`)
            }
            
        });
    }


    calcScaleTranslate() {
        const sectorsArr = this.sector;
        let leftScalesSum = 0;
        sectorsArr.forEach((sector) => {
            let index = sectorsArr.indexOf(sector);
            let sectorEl = document.getElementById(`sector${this.ID}${index}`);
            let sectorScale = sector.currentScale;
            sector.translate = ((index === sectorsArr.length)? 1 : leftScalesSum) / ((sectorScale) ? sectorScale : 1) *100;

            leftScalesSum += sectorScale;
            sectorsArr[index].calcTranslateCSS();
            sectorEl.setAttribute('style', `transform: ${sectorsArr[index].scaleCSS} ${sectorsArr[index].translateCSS}`)
        });
    }

    
    setThumb(index) { 
        function setThisThumb (input, slider) {
            const singleMode = (typeof input === 'number');

            let index = singleMode ? input : slider.thumb.indexOf(input);
            let overlappedSectors = slider.sector.slice(0, index+1);
            let offset = overlappedSectors.reduce((acc, next) => acc + next.currentScale, 0);
            let currentElement = document.getElementById(`track${slider.ID}`);
            let currentThumbElement = document.getElementById(`thumb${slider.ID}${index}`);
            let currentThumb = singleMode ? slider.thumb[input] : input;

            currentThumb.xAbsoluteDefault = currentElement.getBoundingClientRect().left;
            let correction = currentThumb.xAbsoluteDefault - currentThumbElement.getBoundingClientRect().left;
             
            currentThumb.newTranslate = slider.trackWidth*offset/slider.thumbWidth*100 - 50; 
            currentThumb.update();
            slider.thumb[index].elDOM.setAttribute('style', `transform: ${slider.thumb[index].translateCSS}`);
            currentThumb.xAbsolute = slider.thumb[index].elDOM.getBoundingClientRect().left;
        }

        if (index === 'all') {
            this.thumb.forEach((thumb) => {setThisThumb(thumb, this)});
        } else if (typeof index === 'number') {
            setThisThumb(index, this);
        }
    }

    moveThumb(thumbIndex, offset) {
            
            const thumbsArr =  this.thumb;
            const currentX = thumbsArr[thumbIndex].xAbsolute;
            const minLimit = ((thumbIndex - 1) > 0) ? thumbsArr[thumbIndex - 1].xAbsolute : this.trackStart;
            const maxLimit = (thumbIndex + 1 >= thumbsArr.length) ? this.trackEnd : thumbsArr[thumbIndex + 1].xAbsolute;
            const startThumb = (thumbIndex === 0);

            const endThumb = (thumbIndex === this.thumb.length - 1);

            const leftLimit = startThumb ? this.trackStart : minLimit;
            const rightLimit = endThumb ? this.trackEnd : maxLimit;


            let newX = currentX + offset;

            function calcScales(index, offset, slider) {
                const sectorLeft = slider.sector[index];
                const sectorRight = slider.sector[index+1];
                
                const promisedScaleL = sectorLeft.currentScale + (offset / slider.trackWidth);
                const promisedScaleR = sectorRight.currentScale - (offset / slider.trackWidth);
                const scaleSum = sectorLeft.currentScale + sectorRight.currentScale;

                const newScaleL = (promisedScaleL > scaleSum) ? scaleSum : ((promisedScaleL < 0 ) ? 0 : promisedScaleL);
                const newScaleR = (promisedScaleR > scaleSum) ? scaleSum : ((promisedScaleR < 0 ) ? 0 : promisedScaleR);

                sectorLeft.currentScale = newScaleL;
                sectorLeft.calcScaleCSS();
                sectorRight.currentScale = newScaleR;
                sectorRight.calcScaleCSS();
            }

            if (leftLimit < newX && newX < rightLimit) {
                thumbsArr[thumbIndex].xAbsolute = newX;
            } else if (leftLimit >= newX) {
                thumbsArr[thumbIndex].xAbsolute = leftLimit;
            } else if (rightLimit <= newX) {
                thumbsArr[thumbIndex].xAbsolute = rightLimit;
            }

            calcScales(thumbIndex, offset, this);
            this.calcScaleTranslate();
            this.setThumb(thumbIndex);


            this.sector[thumbIndex].elDOM.setAttribute('style', `transform: ${this.sector[thumbIndex].scaleCSS} ${this.sector[thumbIndex].translateCSS}`);
            this.sector[thumbIndex + 1].elDOM.setAttribute('style', `transform: ${this.sector[thumbIndex + 1].scaleCSS} ${this.sector[thumbIndex + 1].translateCSS}`);
            thumbsArr[thumbIndex].elDOM.setAttribute('style', `transform: ${thumbsArr[thumbIndex].translateCSS}`);
            document.getElementById(`mid${thumbIndex}`).innerHTML = thumbsArr[thumbIndex].pointTo;
    }

    addInteraction() {
        this.thumb.forEach((thumb, i) => document.getElementById(`thumb${this.ID}${i}`).addEventListener('mousedown', (take) => {
            take.preventDefault;
            this.mousedown = true;
            this.downOn = +(take.target.id.split(`${this.ID}`)[1]); // get target id (thumb00). first 0 is id of slider. we need only last digit. 
        }));

        
        window.addEventListener('selectstart', () => false);


        window.addEventListener('mousemove', (move) => {
            move.preventDefault;
            if (this.mousedown) {
                this.moveThumb(this.downOn, (move.clientX-this.thumb[this.downOn].xAbsolute));
            }
        });

        window.addEventListener('mouseup', (drop) => {
            drop.preventDefault;
            this.mousedown = false;
        });
    }

    renderPointer(number) {
        let output = '';
        for (let i = 0; i < number; i++){
            output += `<span class="pointer" id="mid${i}">${(i === 0) ? this.min : (i === number - 1) ? this.max : ''}</span>`;
        }
        return output;
    }

    renderThumbs(number) {
        let output = '';
        for (let i = 0; i < number; i++){
            output += `<div class="thumb" id="thumb${this.ID}${i}"></div>`;
        }
        return output;
    }

    renderSectors(number) {
        let output = '';
        for (let i = 0; i <= number; i++){
            output += `<div class="sector" id="sector${this.ID}${i}"></div>`;
        }
        return output;
    }

    bindThumbsToPointer() {
        this.thumb.forEach((thumb, ind) => {
            if (ind === 0){
                thumb.pointTo = this.min;
            } else if (ind === this.thumb.length - 1){
                thumb.pointTo = this.max;
            } else {
                thumb.pointTo = Math.ceil((thumb.newTranslate/this.thumbWidth + 0.5*this.thumbWidth) * ((this.max-this.min)/this.trackWidth));
            }
        })
    }

    active() {
        this.createThumbs(this.thumbsNumber);
        this.setSectors();
        this.calculateInitScale();
        this.calcScaleTranslate();
        this.setThumb('all');
        this.bindThumbsToPointer();
        this.addInteraction();
    }

    render() {
        this.setDefaultStyles();
        const possibleMin = ((this.min >= 0) && (this.min < this.max)) ? true : false;
        const possibleMax = ((this.max >= 0) && (this.min < this.max)) ? true : false; 

        let HTMLstructure = `
        
            ${
                (possibleMin && possibleMax) ? `<div class="pointer-container">${this.renderPointer(this.thumbsNumber)}</div>` : '' 
            }
            <div class="slider-container">
                <style scoped>
                    div#slider${this.ID} {
                        width: ${this.trackWidth}px;
                    }
                    div#track${this.ID} {
                        width: ${this.trackWidth}px;
                    }
                </style>

                <div class="slider" id="slider${this.ID}">
                    <div class="slider__track" id="track${this.ID}">${this.renderSectors(this.thumbsNumber)}</div>
                    ${this.renderThumbs(this.thumbsNumber)}
                </div>
            </div>
        
        `;

        this.codeHtml = HTMLstructure;
    }

}



