//  Elements from DOM
import {store} from "./products.js";
import {Slider} from "./slider_module.js";

const productSlots = document.getElementById('slotsRender');
const cartButton = document.getElementsByClassName('cart');
const cartPop = document.getElementsByClassName('cartPop')[0];
const itemsLotsContainer = document.getElementsByClassName('itemsList')[0];
const clearCartButton = document.getElementsByClassName('clearCart')[0];
const currentSortingMethod = document.getElementById('sorting-method').value;

const mediaQueryMax940 = window.matchMedia('(max-width: 1024px)');
const mediaQueryMin940 = window.matchMedia('(min-width: 1024px)');

const burgerRenderPlace = document.querySelector('.burger-render');


const inCart = [];

function downloadStoredCart() {
  for (let i = 0; i < localStorage.length; i++){
    if (localStorage.getItem(`item${i}`) === null) {
      break;
    }
    inCart[i] = JSON.parse(localStorage.getItem(`item${i}`));
  }
  console.log(inCart);
  inCart.forEach((item) => {
    addItemToCart(undefined, item.amount, item.id); 
  });
}

function collectItemInCartData() {
  localStorage.clear();
  inCart.forEach((item, ind) => {
    localStorage.setItem(`item${ind}`, JSON.stringify(item));
  });
}

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
  if (mediaObj.matches && (mediaObj.media === '(max-width: 1024px)')) {
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

  if (mediaObj.matches && (mediaObj.media === '(min-width: 1024px)')) {
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
function openCart(click) {
  cartPop.classList.add('open');
  click.preventDefault();
}

function closeCart(event) {
  if (event.target === cartPop) {
    cartPop.classList.remove('open');
  }
}

function countAllItemsInCart() {
  console.log(inCart);
  const counterNum = inCart.reduce(
    (accumulator, currentValue) => accumulator + currentValue.amount,
    0,
  );

  document.querySelector('#cartCounter').innerHTML = `${counterNum}`;
  document.getElementById('numberOfItems').innerHTML = `${counterNum}`;
}

function sumAllItemsPriceInCart() {
  const counterNum = inCart.reduce(
    (accumulator, currentValue) => accumulator + (currentValue.amount * currentValue.price),
    0,
  );

  document.getElementById('priceSum').innerHTML = `${counterNum}`;
}

function calculateSameItemsPrice(id) {
  const price = document.querySelector(`#item_actPrice${id}`);
  inCart.forEach((each) => {
    if (id === each.id) {
      price.innerHTML = each.price * each.amount;
    }
  });
}

function clearCart() {
  const itemsInCart = document.querySelectorAll('.item');

  if (inCart.length) {
    Array.from(itemsInCart, (item) => item.remove());
    inCart.splice(0, inCart.length);
  }
  countAllItemsInCart();
  sumAllItemsPriceInCart();
  collectItemInCartData();
}

function addOneOfTheseItem(event) {
  inCart.forEach((item) => {
    let {id, amount} = item;
    if (+event.currentTarget.id === id) {
      const counter = amount + 1;
      if (counter > store[id - 1].amountOfProduct) {
        alert('Sorry the number of available product is limited!');
      } else {
        document.getElementById(`amount${id}`).innerHTML = counter;
        item.amount = counter;
      }

      calculateSameItemsPrice(id);
    }
  });
  countAllItemsInCart();
  sumAllItemsPriceInCart();
  collectItemInCartData();
}

function removeOneOfTheseItem(event) {
  inCart.forEach((item) => {
    if (+event.currentTarget.id === item.id) {
      const counter = item.amount - 1;
      if (counter === 0) {
        document.querySelector(`#item${item.id}`).remove();
        inCart.splice(inCart.indexOf(item), 1);
      } else {
        document.querySelector(`#amount${item.id}`).innerHTML = counter;
        item.amount = counter;
      }

      if (document.getElementById(`item${+event.currentTarget.id}`)) {
        calculateSameItemsPrice(item.id);
      }
    }
  });
  countAllItemsInCart();
  sumAllItemsPriceInCart();
  collectItemInCartData();
}

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
  Array.from(addToCart, (button) => button.addEventListener('click', addItemToCart));
}

function addEListenersToCart() {
  Array.from(document.getElementsByClassName('addThisItem'), (plus) => plus.addEventListener('click', addOneOfTheseItem));
  Array.from(document.getElementsByClassName('removeThisItem'), (minus) => minus.addEventListener('click', removeOneOfTheseItem));
}

function addItemToCart(event, amount = 1, ID = -1) {
  
  let isInCart = false;
  inCart.forEach((item) => {
    if (ID === item.id) {
      item.amount += (event === undefined)? 0 : amount;
      render(ID, item.amount);
      isInCart = true;
    } else {
      inCart.push({
        id: item.id,
        amount: amount,
        price: item.actualPrice,
      });

      const theTarget = +(event.currentTarget.id);   
      render(theTarget, item.amount);
      event.preventDefault();

    }
  });

  function render(targetID, amount) {
    if (!isInCart) {
      store.forEach((item) => {
        if (item.id === targetID) {
          itemsLotsContainer.innerHTML += `
                                <div class="item" id="item${item.id}">
                                        <img height="40px" width="38px" src=".${item.img}" alt="${item.name}" class="cartImg">
                                        <h1 class="item_name text text_articleHead">${item.name}</h1>
                                        <p class="item_actPrice" id="item_actPrice${item.id}">${item.actualPrice}</p>
                                        <div class="item_counter"> 
                                            <button class="counterButton addThisItem" id="${item.id}" >+</button>
                                            <p class="numberOfItem" id="amount${item.id}">${amount}</p>
                                            <button class="counterButton removeThisItem" id="${item.id}">-</button>     
                                        </div>
                                    </div>
                                `;
          addEListenersToCart();
        }
      });
    }
  }
  countAllItemsInCart();
  sumAllItemsPriceInCart();
  collectItemInCartData();
}

function addEventListeners() {
  cartButton[0].addEventListener('click', openCart);
  cartPop.addEventListener('click', closeCart);
  clearCartButton.addEventListener('click', clearCart);

  

  document.querySelector('#sorting-method').addEventListener('change', chooseSortingMethod);

  mediaQueryMax940.addEventListener('change', renderChanges);
  mediaQueryMin940.addEventListener('change', renderChanges);
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
  if (!(currentSortingMethod === option.target.value)) {
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

console.log(slider);
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

renderSlots();
addEventListeners();
downloadStoredCart();
