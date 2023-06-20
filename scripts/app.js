//  Elements from DOM
import {store} from "./products.js";
import {Slider} from "./slider_module.js";
import {downloadStoredCart, renderStoredCart, openCart, closeCart, clearCart, addItemToCart, cartButton, clearCartButton, cartPop} from "./cartRender_module.js"
import { renderFadedBackground, renderForm} from "./contact_us.js";

const productSlots = document.getElementById('slotsRender');
const currentSortingMethod = document.getElementById('sorting-method');

const mediaQueryMax940 = window.matchMedia('(max-width: 1024px)');
const mediaQueryMin940 = window.matchMedia('(min-width: 1024px)');

const burgerRenderPlace = document.querySelector('.burger-render');


function openBurger(click) {
  const burgerMenu = document.querySelector('.burger-menu');
  if (burgerMenu.classList.contains('burger-menu_closed')) {
    burgerMenu.classList.remove('burger-menu_closed');
    burgerMenu.classList.add('burger-menu_open');
    return;
  }
  if ((click.target !== burgerMenu) && burgerMenu.classList.contains('burger-menu_open')) {
    burgerMenu.classList.remove('burger-menu_open');
    burgerMenu.classList.add('burger-menu_closed');
    return;
  }
}

// media queries
function renderChanges(mediaObj) {
  if ((mediaObj) ? (mediaObj.matches && (mediaObj.media === '(max-width: 1024px)')) : window.innerWidth <= 1024 ) {
    document.querySelector('.menu-render').innerHTML = '';
    document.querySelector('.menu-render').classList.add('render-off');

    burgerRenderPlace.classList.remove('render-off');
    burgerRenderPlace.innerHTML = `
      <button class="burger-button">
      <div class="burger-decoration"></div>
      </button>
      
      <ul class="burger-menu burger-menu_closed">
                <li class="menu__button first"><a class="text text_black" href="#">Home</a></li>
                <li class="menu__button second"><a class="text text_black" href="#">Our Products</a></li>
                <li class="menu__button third"><a class="text text_black" href="#">Blog</a></li>
                <li class="menu__button forth"><a class="text text_black" href="#">About</a></li>
                <li class="menu__button fifth"><a class="text text_black" href="#">Contact</a></li>
                <li class="menu__button sixth"><a class="text text_black" href="#">StyleGuide</a></li>
            </ul>`;
    document.querySelector('.burger-button').addEventListener('click', openBurger);
  }

  if ((mediaObj) ? (mediaObj.matches && (mediaObj.media === '(min-width: 1024px)')) : window.innerWidth > 1024) {
    document.querySelector('.menu-render').classList.remove('render-off');
    document.querySelector('.menu-render').innerHTML = `
    <ul class="menu">
                <li class="menu__button first"><a class="text text_black" href="#">Home</a></li>
                <li class="menu__button second"><a class="text text_black" href="#">Our Products</a></li>
                <li class="menu__button third"><a class="text text_black" href="#">Blog</a></li>
                <li class="menu__button forth"><a class="text text_black" href="#">About</a></li>
                <li class="menu__button fifth"><a class="text text_black" href="#">Contact</a></li>
                <li class="menu__button sixth"><a class="text text_black" href="#">StyleGuide</a></li>
            </ul>`;
    burgerRenderPlace.innerHTML = '';
    burgerRenderPlace.classList.add('render-off');
  }
}


// -------------

// Cart interactions


// Render functions

function renderSlots(array = store) {
  productSlots.innerHTML = '';
  array.forEach((item) => {
    productSlots.innerHTML += `
            <div class="shopLot" id="${item.id}">
                <img src=".${item.img}" alt="${item.name}" class="itemPicture">
                <h3 class="text text_black text_name">${item.name}</h3>
                <h3 class="price text text_black text_mid">
                ${item.price}
                    <span class="newPrice">${item.discountPrice}</span>
                    <span class="oldPrice">${item.oldPrice}</span>
                </h3>
                <button id="${item.id}" class="addToCart" href="#">
                  <img class='addToCartImg' id="${item.id}addToCartImg" src="./images/cart.svg" width=20px height=20px>
                  <p class="addToCartText text text_white"> Add to cart </p>
                </button>
            </div>
            `;
  });
  const addToCart = document.getElementsByClassName('addToCart');
  Array.from(addToCart, (button) => button.addEventListener('click', (e) => {   
    addItemToCart(e, 1, parseInt(e.target.id));
  }));
}

function addEventListeners() {
  cartButton.addEventListener('click', openCart);
  cartPop.addEventListener('click', closeCart);
  clearCartButton.addEventListener('click', clearCart);
  document.querySelector('#checkOut').addEventListener('click', () => {
    console.log('Here');
    document.location = './buying_form.html';
  });
  

  document.querySelector('#sorting-method').addEventListener('change', chooseSortingMethod);

  mediaQueryMax940.addEventListener('change', renderChanges);
  mediaQueryMin940.addEventListener('change', renderChanges);

  document.querySelector('#contactUS').addEventListener('click', () => {
    console.log('listener working');
    renderFadedBackground();
    renderForm();
   }
  );
}

// sorting functions

function sortBy(property, fromLow) {
  store.sort((a, b) => (fromLow ? a[property] - b[property] : b[property] - a[property]));
}

function sortSize() {
  store.sort((a, b) => {
    const compStr = `${a.size} - ${b.size}`;
    if (['S - M', 'M - L', 'S - L'].includes(compStr)) {
      return -1;
    }
    if (['M - S', 'L - M', 'L - S'].includes(compStr)) {
      return 1;
    }
    return 0;
  });
}

function chooseSortingMethod(option) {
  if (!(currentSortingMethod.value === option.target.value)) {
    switch (option.target.value) {
      case 'byPriceFromLow':
        sortBy('actualPrice', true);
        break;
      case 'byPriceFromHigh':
        sortBy('actualPrice', false);
        break;
      case 'bySize':
        sortSize();
        break;
      case 'byAmount':
        sortBy('amountOfProduct', true);
        break;
    }
  }
  productSlots.innerHTML = '';
  renderSlots();
  addEventListeners();
}
// -----------------


const slider = new Slider();

// -- set initial value of counter --
slider.pointerMax.setValueOfPointer();
slider.pointerMin.setValueOfPointer();
// ----------------------------------

function filterByPrice() {
  const newArr = store.filter((product) => (product.actualPrice >= getPriceLimit('pointerMin')) && (product.actualPrice <= getPriceLimit('pointerMax')));
  renderSlots(newArr);
}

function getPriceLimit(pointer){
  return parseInt(slider[pointer].el.textContent)
}

let thumbMaxActive = false;
let thumbMinActive = false;

function addEventListenerToThumb(thumbID, eventType) {

  function addEvent(id, event) {
    slider[id].el.addEventListener(event, (event) => {
      if (id === 'thumbMax') {
        thumbMaxActive = true;
      } else if (id === 'thumbMin') {
        thumbMinActive = true;
      }
      event.preventDefault();
    });
  }

  if (Array.isArray(thumbID) && typeof eventType === 'string'){
    thumbID.forEach((id) => {
      addEvent(id, eventType);
    })
  } else if (typeof thumbID === 'string' && Array.isArray(eventType)){
    eventType.forEach((event) => {
      addEvent(thumbID, event);
    })
  } else if (Array.isArray(thumbID) && Array.isArray(eventType)) {
    thumbID.forEach((id) => {
      eventType.forEach((event) => {
        addEvent(id, event);
      });
    });
  } else {
    addEvent(thumbID, eventType)
  }
}

addEventListenerToThumb(['thumbMax', 'thumbMin'], ['mousedown', 'touchstart']);

window.addEventListener('mousemove', (move) => {
  if (thumbMaxActive) {
    slider.thumbMax.moveThumb(move);
  }else if (thumbMinActive){
    slider.thumbMin.moveThumb(move);
  }
  move.preventDefault();
});
window.addEventListener('mouseup', (up) => {
  if (thumbMaxActive || thumbMinActive) {
    thumbMaxActive = false;
    thumbMinActive = false;
    filterByPrice()
    up.preventDefault();
  }
});


//touchscreen


window.addEventListener('touchmove', (move) => {
  if (thumbMaxActive) {
    slider.thumbMax.moveThumb(move.changedTouches[0]);
  }else if (thumbMinActive){
    slider.thumbMin.moveThumb(move.changedTouches[0]);
  }
});
window.addEventListener('touchend', () => {
  if (thumbMaxActive || thumbMinActive) {
    thumbMaxActive = false;
    thumbMinActive = false;
    filterByPrice()
  }
});

renderChanges();
renderSlots();
addEventListeners();
downloadStoredCart();
renderStoredCart()
