

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

const thumb = document.querySelectorAll('.thumb');

const inCart = [];

function moveThumb (mousedown) {
  document.querySelector('.slider-wrapper').addEventListener('mousemove', (slide) => {
    mousedown.target.setAttribute('style', `left:${slide.offsetX}px`);
  });  
}

function releaseMouse () {
  document.querySelector('.slider-wrapper').removeEventListener('mousemove', (slide) => {
    mousedown.target.setAttribute('style', `left:${slide.offsetX}px`);
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

function openCart(event) {
  cartPop.classList.add('open');
  event.preventDefault();
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
      price.innerHTML = each.price * each.amount;
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
  //----------------------------------------------------------------------
  // function have to mutate objs in inCart array. Destructive assignment 
  //make code logic more complicate and confusing.

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
  test.active();
  cartButton[0].addEventListener('click', openCart);
  cartPop.addEventListener('click', closeCart);
  clearCartButton.addEventListener('click', clearCart);

  Array.from(addToCart, (button) => button.addEventListener('click', addItemToCart));

  document.querySelector('#sorting-method').addEventListener('change', chooseSortingMethod);

  mediaQueryMax940.addEventListener('change', renderChanges);
  mediaQueryMin940.addEventListener('change', renderChanges);
  Array.from(thumb, (oneOfThumbs) => oneOfThumbs.addEventListener('mousedown', moveThumb));
  Array.from(thumb, (oneOfThumbs) => oneOfThumbs.addEventListener('mouseout', releaseMouse));
}

// sorting functions

function sortBy(property, fromLow) {
  store.sort((a, b) => (fromLow ? a[property] - b[property] : b[property] - a[property]));
}

function sortSize() {
  store.sort((a, b) => {
    const compStr = `${a.size} - ${b.size}`;vb 
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



renderSlots();
const test = new Slider(0, 100, 2, 0, 100);
test.render();
console.log('main');
document.querySelector('.slider-wrapper').innerHTML += test.codeHtml;

addEventListeners();
