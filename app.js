//  Elements from DOM

const productLots = document.getElementById('lotsRender');
const cartButton = document.getElementsByClassName('cart');
const cartPop = document.getElementsByClassName('cartPop');
const backShopButton = document.getElementsByClassName('return');
const itemsLotsContainer = document.getElementsByClassName('itemsList')[0];
const addToCart = document.getElementsByClassName('addToCart');
const clearCartButton = document.getElementsByClassName('clearCart')[0];

const inCart = [];

// Cart interactions

function openCart(e) {
  cartPop[0].classList.add('open');
  e.preventDefault();
}

function closeCart() {
  cartPop[0].classList.remove('open');
}

function countAllItemsInCart() {
  const selectedItemsNumbers = inCart.map((each) => each.amount);
  const counterNum = selectedItemsNumbers.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  document.querySelector('#cartCounter').innerHTML = `${counterNum}`;
  document.getElementById('numberOfItems').innerHTML = `${counterNum}`;
}

function sumAllItemsPriceInCart() {
  const selectedItemsPrices = inCart.map((each) => each.priceOfAll);
  const counterNum = selectedItemsPrices.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  document.getElementById('priceSum').innerHTML = `${counterNum}`;
}

function calculateSameItemsPrice(id) {
  const price = document.querySelector(`#item_actPrice${id}`);
  inCart.forEach((each) => {
    if (id === each.id) {
      const currentItem = each;
      const calculatedPrice = currentItem.price * currentItem.amount;
      price.innerHTML = calculatedPrice;
      currentItem.priceOfAll = calculatedPrice;
    }
  });
}

function clearCart() {
  const itemsInCart = document.querySelectorAll('.item');
  if (inCart.length !== 0) {
    Array.from(itemsInCart).forEach((each) => { each.remove(); });
    inCart.splice(0, inCart.length);
  }
  countAllItemsInCart();
  sumAllItemsPriceInCart();
}

function addOneOfTheseItem(event) {
  inCart.forEach((each) => {
    if (+event.currentTarget.id === each.id) {
      const counter = each.amount + 1;
      if (counter > store[each.id - 1].amountOfProduct) {
        alert('Sorry the number of available product is limited!');
      } else {
        document.getElementById(`amount${each.id}`).innerHTML = counter;
        const currentItem = each;
        currentItem.amount = counter;
      }

      calculateSameItemsPrice(each.id);
    }
  });
  countAllItemsInCart();
  sumAllItemsPriceInCart();
}

function removeOneOfTheseItem(event) {
  inCart.forEach((each) => {
    if (+event.currentTarget.id === each.id) {
      const counter = each.amount - 1;
      if (counter === 0) {
        document.querySelector(`#item${each.id}`).remove();
        inCart.splice(inCart.indexOf(each), 1);
      } else {
        document.querySelector(`#amount${each.id}`).innerHTML = counter;
        const currentItem = each;
        currentItem.amount = counter;
      }

      if (document.getElementById(`item${+event.currentTarget.id}`) ) {
        calculateSameItemsPrice(each.id);
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
  if (!thisItem) {
    Array.from(addToCart).forEach((each) => {
      if (+each.id === +theTarget) {
        store.forEach((item) => {
          if (item.id === +theTarget) {
            itemsLotsContainer.innerHTML += `
                              <div class="item" id="item${item.id}">
                                      <img height="40px" width="38px" src=".${item.img}" alt="${item.name}"" class="cartImg">
                                      <h1 class="item_name">${item.name}"</h1>
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
              priceOfAll: item.actualPrice,
            });
          }
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
  backShopButton[0].addEventListener('click', closeCart);
  clearCartButton.addEventListener('click', clearCart);

  Array.from(addToCart).forEach((each) => { each.addEventListener('click', addItemToCart); });
}

renderSlots();
addEventListeners();

// TODO: try to calculate allItems price on every btn click, as separate variable(const allItemsPrice).
// It will reduce the forEach loops and dom manipulation
