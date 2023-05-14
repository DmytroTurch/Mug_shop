const sectorOne = document.querySelector('.sector_one');
const sectorTwo = document.querySelector('.sector_two');
const sectorThree = document.querySelector('.sector_three');
const thumbMinEl = document.querySelector('.thumb_min');
const thumbMaxEl = document.querySelector('.thumb_max');

const slider = {
    ID: 0,

    thumbWidth: 10,
    thumbHeight: 14,

    trackWidth : undefined,
    trackStart: undefined,
    trackEnd: undefined,

    changeIDto(newID) {
        this.ID = newID;
    },

    setDefaultStyles() {
        document.getElementsByTagName('body')[0].innerHTML += `
        <style>
            .slider{
                margin: 0;
                border: 1px solid #c42525;
            }
            .slider__track {
                height: 10px;
                position: relative;
                margin: 0;
            }

            .sector:nth-child(even){
                background-color: #858282;
            }

            .sector:nth-child(odd){
                background-color: #000;
            }

            .thumb {
                position: absolute;
                top: 7px;
                width: ${this.thumbWidth}px;
                height: ${this.thumbHeight}px;
                background-color: #bdb4b4;
                border-radius: 5px;
                box-shadow: inset 0.5px 0.5px 0.5px #000, inset -0.5px -0.5px 0.5px #000;
            }
        </style>
        `;
    },

    renderSliderIn(targetElement, trackWidth, number) {
        this.setDefaultStyles();
        targetElement.innerHTML += `
            <div class="slider-container" >
                <style scoped>
                    div#slider${this.ID} {
                        width: ${trackWidth}px;
                    }
                    div#track${this.ID} {
                        width: ${trackWidth}px;
                    }
                </style>

                <div class="slider" id="slider${this.ID}">
                    <div class="slider__track" id="track${this.ID}"></div>
                </div>
            </div>`;
        this.trackWidth = trackWidth;
        this.setTrackPosition(this.ID);
        this.createThumbs(number);
        this.setSectors();
        this.calculateInitScale();
        this.calcScaleTranslate();
        this.setThumb('all');

        console.log(`NumThumbs: ${this.thumb.length}`)
        console.log(`NumThumbs: ${this.sector.length}`)
    },

    setTrackPosition() {
        let coordObj = document.getElementById(`track${this.ID}`).getBoundingClientRect();
        this.trackStart = coordObj.left;
        this.trackEnd = coordObj.right;
        console.log(`track start: ${this.trackStart}`);
        console.log(`track end: ${this.trackEnd}`);
        console.log(`track width: ${this.trackWidth}`);
    },

    createThumbs(number) {
        for (let i = 0; i < number; i++) {
            let indexOfThumb = this.thumb.length;
            document.getElementById(`slider${this.ID}`).innerHTML += `<div class="thumb" id="thumb${this.ID}${indexOfThumb}"></div>`;
            this.thumb[indexOfThumb] = {
                elDOM: document.getElementById(`thumb${this.ID}${indexOfThumb}`),
                translate: 0,
                translateCSS: undefined,
                calcTranslateCSS() {
                    this.translateCSS = `translate(${this.translate}%, 0px)`
                },
            };
            this.thumb[i].calcTranslateCSS();
        }
    },

    setThumb(index) { 
        function setThisThumb (input) {
            const singleMode = (typeof input === 'number');

            let index = singleMode ? input : slider.thumb.indexOf(input);
            let overlappedSectors = slider.sector.slice(0, index+1);
            let offset = overlappedSectors.reduce((acc, next) => acc + next.currentScale, 0);
            let currentElement = document.getElementById(`thumb${slider.ID}${index}`);
            let currentThumb = singleMode ? slider.thumb[input] : input;

            currentThumb.xAbsoluteDefault = currentElement.getBoundingClientRect().left;
            currentThumb.translate = slider.trackWidth*offset/slider.thumbWidth*100 - 50; 
            currentThumb.calcTranslateCSS();
            currentElement.setAttribute('style', `transform: ${slider.thumb[index].translateCSS}`);
            currentThumb.xAbsolute = currentElement.getBoundingClientRect().left;
            console.log(`defaultThumb${index}: ${currentThumb.translate}`);
        }

        if (index === 'all') {
            this.thumb.forEach((thumb) => {setThisThumb(thumb)});
        } else if (typeof index === 'number') {
            setThisThumb(index);
        }
    },

    setSectors() {
        for (let i = 0; i <= this.thumb.length; i++) {
            document.getElementById(`track${this.ID}`).innerHTML += `<div class="sector" id="sector${this.ID}${i}"></div>`
            this.sector[i] = {
                elDOM : document.getElementById(`sector${this.ID}${i}`),
                currentScale: 0,
                initScale: 0,
                scaleCSS: undefined,
                calcScaleCSS() {
                    this.scaleCSS = `scale(${this.currentScale}, 1)`
                },
                translate: 0,
                translateCSS: undefined,
                calcTranslateCSS() {
                    this.translateCSS = `translate(${this.translate}%, 0px)`
                },
            };
            this.sector[i].calcScaleCSS();
            this.sector[i].calcTranslateCSS();
        }
    },
 
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
    },


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
    },

    sector: [],

    thumb: [],

//at that moment take x as difference between start position of cursor and his current position ((start - current))
    moveThumb(thumbIndex, offset) {
            
            const thumbsArr =  this.thumb;
            const currentX = thumbsArr[thumbIndex].xAbsolute;
            const minLimit = ((thumbIndex - 1) > 0) ? thumbsArr[thumbIndex - 1].xAbsolute : this.trackStart;
            const maxLimit = (thumbIndex >= thumbsArr.length) ? this.trackEnd : thumbsArr[thumbIndex + 1].xAbsolute;
            const startThumb = (thumbIndex === 0);

            const endThumb = (thumbIndex === this.thumb.length - 1);

            const leftLimit = startThumb ? this.trackStart : minLimit;
            const rightLimit = endThumb ? this.trackEnd : maxLimit;


            let newX = currentX + offset;

            function calcScales(index, offset) {
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

            calcScales(thumbIndex, offset);

            this.calcScaleTranslate();

            this.setThumb(thumbIndex);
            this.sector[thumbIndex].elDOM.setAttribute('style', `transform: ${this.sector[thumbIndex].scaleCSS} ${this.sector[thumbIndex].translateCSS}`);
            this.sector[thumbIndex + 1].elDOM.setAttribute('style', `transform: ${this.sector[thumbIndex + 1].scaleCSS} ${this.sector[thumbIndex + 1].translateCSS}`);
            thumbsArr[thumbIndex].elDOM.setAttribute('style', `transform: ${thumbsArr[thumbIndex].translateCSS}`);
    },
}

slider.renderSliderIn(document.getElementsByTagName('body')[0], 100, 4);
/*slider.thumbMax = {
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
    e.preventDefault;
})
window.addEventListener('mousemove', (e) => {
    if (onThumb) {
        slider.moveThumb((e.clientX-slider.thumbMin.xThumbAbsolute));
    }
    e.preventDefault;
});
window.addEventListener('mouseup', (e) => {
    onThumb = false;
    e.preventDefault;
}); */