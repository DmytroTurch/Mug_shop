//  Elements from DOM

const productSlots = document.getElementById('slotsRender');
const cartButton = document.getElementsByClassName('cart');
const cartPop = document.getElementsByClassName('cartPop')[0];
const itemsLotsContainer = document.getElementsByClassName('itemsList')[0];
const addToCart = document.getElementsByClassName('addToCart');
const clearCartButton = document.getElementsByClassName('clearCart')[0];
const currentSortingMethod = document.getElementById('sorting-method').value;

const mediaQueryMax940 = window.matchMedia('(max-width: 940px)');
const mediaQueryMin940 = window.matchMedia('(min-width: 940px)');

const burgerRenderPlace = document.querySelector('.burger-render');


const inCart = [];

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
  if (mediaObj.matches && (mediaObj.media === '(max-width: 940px)')) {
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

  if (mediaObj.matches && (mediaObj.media === '(min-width: 940px)')) {
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

// FIXME: What is this e? Name parameters with meaning everywhere.
function openCart(e) {
  cartPop.classList.add('open');
  e.preventDefault();
}

function closeCart(event) {
  if (event.target === cartPop) {
    cartPop.classList.remove('open');
  }
}

function countAllItemsInCart() {
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
      // FIXME: Do you need this var?
      const calculatedPrice = each.price * each.amount;
      price.innerHTML = calculatedPrice;
    }
  });
}

function clearCart() {
  const itemsInCart = document.querySelectorAll('.item');

  // FIXME: How to improve this checking
  if (inCart.length) {
    Array.from(itemsInCart, (item) => item.remove());
    inCart.splice(0, inCart.length);
  }
  countAllItemsInCart();
  sumAllItemsPriceInCart();
}

function addOneOfTheseItem(event) {
  // FIXME: Replace item with object destruction approach? { id, amount  }
  // It is good practice if there are only several properties used
  inCart.forEach((item) => {
    if (+event.currentTarget.id === item.id) {
      const counter = item.amount + 1;
      if (counter > store[item.id - 1].amountOfProduct) {
        alert('Sorry the number of available product is limited!');
      } else {
        document.getElementById(`amount${item.id}`).innerHTML = counter;
        item.amount = counter;
      }

      calculateSameItemsPrice(item.id);
    }
  });
  countAllItemsInCart();
  sumAllItemsPriceInCart();
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
}

// Render functions

function renderSlots() {
  store.forEach((item) => {
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
}

function addEListenersToCart() {
  Array.from(document.getElementsByClassName('addThisItem'), (plus) => plus.addEventListener('click', addOneOfTheseItem));
  Array.from(document.getElementsByClassName('removeThisItem'), (minus) => minus.addEventListener('click', removeOneOfTheseItem));
}

function addItemToCart(event) {
  const theTarget = event.currentTarget.id;
  const thisItem = document.getElementById(`item${theTarget}`);
  if (!thisItem) {
    store.forEach((item) => {
      if (item.id === +theTarget) {
        itemsLotsContainer.innerHTML += `
                              <div class="item" id="item${item.id}">
                                      <img height="40px" width="38px" src=".${item.img}" alt="${item.name}" class="cartImg">
                                      <h1 class="item_name text text_articleHead">${item.name}</h1>
                                      <p class="item_actPrice" id="item_actPrice${item.id}">${item.actualPrice}</p>
                                      <div class="item_counter"> 
                                          <button class="counterButton addThisItem" id="${item.id}" >+</button>
                                          <p class="numberOfItem" id="amount${item.id}">1</p>
                                          <button class="counterButton removeThisItem" id="${item.id}">-</button>     
                                      </div>
                                  </div>
                              `;
        addEListenersToCart();
        inCart.push({
          id: item.id,
          amount: 1,
          price: item.actualPrice,
        });
      }
    });
  } else {
    addOneOfTheseItem(event);
  }
  countAllItemsInCart();
  sumAllItemsPriceInCart();
  event.preventDefault();
}

function addEventListeners() {
  cartButton[0].addEventListener('click', openCart);
  cartPop.addEventListener('click', closeCart);
  clearCartButton.addEventListener('click', clearCart);

  Array.from(addToCart, (button) => button.addEventListener('click', addItemToCart));

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
    // FIXME: Improve this checking with using array.includes()
    if (['S - M', 'M - L', 'S - L'].includes(compStr)) {
      return -1;
    }
    if (['M - S', 'L - M', 'L - S'].includes(compStr)) {
      return 1;
    }
    return 0;
  });
}

function chooseSortingMethod(e) {
  if (!(currentSortingMethod === e.target.value)) {
    if (e.target.value === 'byPriceFromLow') {
      sortBy('actualPrice', true);
    } else if (e.target.value === 'byPriceFromHigh') {
      sortBy('actualPrice', false);
    } else if (e.target.value === 'bySize') {
      sortSize();
    } else if (e.target.value === 'byAmount') {
      sortBy('amountOfProduct', true);
    }
  }
  productSlots.innerHTML = '';
  renderSlots();
  addEventListeners();
}
// -----------------

const slider = {

  get min() {return 0},

  get max(){
    const prices = store.map((item) => item.actualPrice);
    return Math.max(...prices);
  }, 

};

slider.track = {

  get elPosObj(){ return document.getElementById('track').getBoundingClientRect() },
  
  get width() {return this.elPosObj.width},
  
  get step(){
    return parseFloat((this.width / slider.max).toFixed(2));
  }, 

  get leftLimit(){ return this.elPosObj.left},

  get rightLimit(){ return this.elPosObj.right}
};

class Thumb  {
  constructor (id){
    this.id = id
  };

  #offset = 0;
  
  get currentOffset() { return this.#offset }
  
  /**
   * @param {number} step
   */
  set newOffset(step) {
    const newOffset = this.currentOffset + step;
    if (this.id === 'thumb-max') {
      if (newOffset < -slider.track.width) {
        this.#offset = (-slider.track.width);
      } else if (newOffset < (-(slider.track.width - slider.thumbMin.currentOffset - 20))) {
        this.#offset = (-(slider.track.width - slider.thumbMin.currentOffset - 20));
      } else if (newOffset > 0) {
        this.#offset = 0;
      }else {
        this.#offset += step;
      }
    }
    
    if (this.id === 'thumb-min') {
      if (newOffset > slider.track.width) {
        this.#offset = slider.track.width;
      } else if (newOffset > (slider.track.width + slider.thumbMax.currentOffset - 20)) {
        this.#offset = (slider.track.width + slider.thumbMax.currentOffset - 20);
      } else if (newOffset < 0) {
        this.#offset = 0;
      }else {
        this.#offset += step;
      }
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
      slider.pointerMax.valueOfPointer;
      slider.pointerMin.valueOfPointer;
      offset = 0;
    }
  }
};

slider.thumbMin = new Thumb('thumb-min');
slider.thumbMax = new Thumb('thumb-max');

slider.pointerMax = {
  id: 'pointer-max',
  get maxOrMin() {return /[m][a][x]/.test(this.id)},
  get el() { return document.getElementById(this.id); },
  get valueOfPointer() {
    if (this.maxOrMin) {
      const absoluteValue = slider.thumbMax.position - slider.track.leftLimit;
      const actualValue = parseInt(absoluteValue/slider.track.step);
      this.el.innerHTML = actualValue;
      return (actualValue);
    } else {
      const absoluteValue = slider.thumbMin.position - slider.track.leftLimit;
      const actualValue = parseInt(absoluteValue/slider.track.step);
      this.el.innerHTML = actualValue;
      return (actualValue);
    }
  }
}

slider.pointerMin = Object.create(slider.pointerMax, {id: {value: 'pointer-min',}});

// -- set initial value of counter --
slider.pointerMax.valueOfPointer;
slider.pointerMin.valueOfPointer;
// ----------------------------------

let thumbMaxActive = false;
let thumbMinActive = false;

slider.thumbMax.el.addEventListener('mousedown', (e) => {
  thumbMaxActive = true;
  e.preventDefault();
});
slider.thumbMin.el.addEventListener('mousedown', (e) => {
  thumbMinActive = true;
  e.preventDefault();
});
window.addEventListener('mousemove', (e) => {
  if (thumbMaxActive) {
    slider.thumbMax.moveThumb(e);
  }else if (thumbMinActive){
    slider.thumbMin.moveThumb(e);
  }
  e.preventDefault();
});
window.addEventListener('mouseup', (e) => {
  thumbMaxActive = false;
  thumbMinActive = false;
  e.preventDefault();
});

renderSlots();
addEventListeners();
