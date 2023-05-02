//  Elements from DOM

const productSlots = document.getElementById('slotsRender');
const cartButton = document.getElementsByClassName('cart');
const cartPop = document.getElementsByClassName('cartPop')[0];
const itemsLotsContainer = document.getElementsByClassName('itemsList')[0];
const addToCart = document.getElementsByClassName('addToCart');
const clearCartButton = document.getElementsByClassName('clearCart')[0];
const currentSortingMethod = document.getElementById('sortingMethod').value;

const inCart = [];

// sorting functions
function sortFromChip() {
  store.sort((a, b) => a.actualPrice - b.actualPrice);
  productSlots.innerHTML = '';
  renderSlots();
}

function sortFromExp() {
  store.sort((a, b) => b.actualPrice - a.actualPrice);
  productSlots.innerHTML = '';
  renderSlots();
}

function chooseSortingMethod(e) {
  if (!(currentSortingMethod === e.target.value)) {
    if (e.target.value === 'byPriceFromLow') {
      sortFromChip();
    } else if (e.target.value === 'byPriceFromHigh') {
      sortFromExp();
    }
  }
}
// -----------------
// Cart interactions

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
      const calculatedPrice = each.price * each.amount;
      price.innerHTML = calculatedPrice;
    }
  });
}

function clearCart() {
  const itemsInCart = document.querySelectorAll('.item');
  if (inCart.length !== 0) {
    Array.from(itemsInCart, (item) => item.remove());
    inCart.splice(0, inCart.length);
  }
  countAllItemsInCart();
  sumAllItemsPriceInCart();
}

function addOneOfTheseItem(event) {
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
                  <img class='addToCartImg' id="${item.id}addToCartImg" src="./images/addToCartIcon.png">
                  <p class="addToCartText text"> Add to cart </p>
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

  document.querySelector('#sortingMethod').addEventListener('change', chooseSortingMethod);
}

renderSlots();
addEventListeners();
