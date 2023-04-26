//  Elements from DOM

const productLots = document.getElementById('lotsRender');
const cartButton = document.getElementsByClassName('cart');
const cartPop = document.getElementsByClassName('cartPop');
const backShopButton = document.getElementsByClassName('return');
const itemsLotsContainer = document.getElementsByClassName('itemsList')[0];
const addToCart = document.getElementsByClassName('addToCart');
const clearCartButton = document.getElementsByClassName('clearCart')[0];
const numberOfItem = document.getElementsByClassName('numberOfItem');

// Cart interactions

function openCart(e) {
  cartPop[0].classList.add('open');
  e.preventDefault();
}

function closeCart() {
  cartPop[0].classList.remove('open');
}

function countAllItemsInCart() {
  const selectedItemsNumbers = Array.from(document.getElementsByClassName('numberOfItem'));
  const counterNum = selectedItemsNumbers.reduce(
    (accumulator, currentValue) => accumulator + (+currentValue.textContent),
    0,
  );

  document.querySelector('#cartCounter').innerHTML = `${counterNum}`;
  document.getElementById('numberOfItems').innerHTML = `${counterNum}`;
}

function sumAllItemsPriceInCart() {
  const selectedItemsPrices = Array.from(document.getElementsByClassName('item_actPrice'));
  const counterNum = selectedItemsPrices.reduce(
    (accumulator, currentValue) => accumulator + (+currentValue.textContent),
    0,
  );

  document.getElementById('priceSum').innerHTML = `${counterNum}`;
}

function calculateSameItemsPrice(id, numberItems) {
  const priceCalculation = store[id - 1].actualPrice * numberItems;
  const price = document.querySelector(`#item_actPrice${id}`);
  price.innerHTML = priceCalculation;
}

function clearCart() {
  const itemsInCart = document.querySelectorAll('.item');
  if (itemsInCart.length !== 0) {
    Array.from(itemsInCart).forEach((each) => { each.remove(); });
  }
  countAllItemsInCart();
  sumAllItemsPriceInCart();
}

function addOneOfTheseItem(event) {
  Array.from(numberOfItem).forEach((each) => {
    if (event.currentTarget.id === each.id) {
      const counter = +each.textContent + 1;
      if (counter > store[each.id - 1].amountOfProduct) {
        alert('Sorry the number of available product is limited!');
      } else {
        each.innerHTML = counter;
      }

      calculateSameItemsPrice(each.id, +each.textContent);
    }
  });
  countAllItemsInCart();
  sumAllItemsPriceInCart();
}

function removeOneOfTheseItem(event) {
  Array.from(numberOfItem).forEach((each) => {
    if (event.currentTarget.id === each.id) {
      const counter = +each.textContent - 1;
      if (counter === 0) {
        document.querySelector(`#item${each.id}`).remove();
      } else { each.innerHTML = counter; }

      if (document.getElementById(`item${+event.currentTarget.id}`) !== null) {
        calculateSameItemsPrice(each.id, +each.textContent);
      }
    }
  });
  countAllItemsInCart();
  sumAllItemsPriceInCart();
}

// Render functions

function renderSlots() {
  store.forEach((item) => {
    productLots.innerHTML += `
            <div class="shopLot">
                <img src=".${item.img}" alt="${item.name}" class="itemPicture">
                <h3 class="text text_black text_name">${item.name}</h3>
                <h3 class="price text text_black text_mid">
                ${item.price}
                    <span class="newPrice">${item.discountPrice}</span>
                    <span class="oldPrice">${item.oldPrice}</span>
                </h3>
                <a  id="${item.id}" class="addToCart" href="#"><img src="./images/addToCartIcon.png"></a>
            </div>
            `;
  });
}

function addEListenersToCart() {
  const addButton = Array.from(document.getElementsByClassName('addThisItem'));
  const removeButton = Array.from(document.getElementsByClassName('removeThisItem'));

  addButton.forEach((each) => { each.addEventListener('click', addOneOfTheseItem); });
  removeButton.forEach((each) => { each.addEventListener('click', removeOneOfTheseItem); });
}

function addItemToCart(event) {
  const theTarget = event.currentTarget.id;
  const thisItem = document.getElementById(`item${theTarget}`);
  // TODO: how to change this condition? !var
  if (thisItem === null) {
    // FIXME: use i += 1 || instead of disabling the rule it is better to use foreach() ;)
    for (let i = 0; i < addToCart.length; i ++) {
      if (addToCart[i].id === theTarget) {
        store.forEach((item) => {
          if (item.id === +theTarget) {
            itemsLotsContainer.innerHTML += `
                              <div class="item" id="item${item.id}">
                                      <img height="40px" width="38px" src=".${item.img}" alt="${item.name}"" class="cartImg">
                                      <h1 class="item_name">${item.name}"</h1>
                                      <p class="item_actPrice" id="item_actPrice${item.id}">${item.actualPrice}</p>
                                      <div class="item_counter"> 
                                          <button class="counterButton addThisItem" id="${item.id}" >+</button>
                                          <p class="numberOfItem" id="${item.id}">1</p>
                                          <button class="counterButton removeThisItem" id="${item.id}">-</button>     
                                      </div>
                                  </div>
                              `;
            addEListenersToCart();
          }
        });
      }
    }
  } else {
    addOneOfTheseItem(event);
  }
  countAllItemsInCart();
  sumAllItemsPriceInCart();
  event.preventDefault();
}

function addEventListeners() {
  cartButton[0].addEventListener('click', openCart);
  backShopButton[0].addEventListener('click', closeCart);
  clearCartButton.addEventListener('click', clearCart);

  Array.from(addToCart).forEach((each) => { each.addEventListener('click', addItemToCart); });
}

renderSlots();
addEventListeners();

// TODO: try to calculate allItems price on every btn click, as separate variable(const allItemsPrice).
// It will reduce the forEach loops and dom manipulation
// Create kind of array cartItems = [ { id, amount, price } ] and modify it and then depend on it modify the dom
// const cartItems = [
//   {
//     id,
//     amount,
//     price
//   }
// ];
