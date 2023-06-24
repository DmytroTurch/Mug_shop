import {store} from "./products.js";
const itemsLotsContainer = document.querySelector('.itemsList');
const cartButton = document.querySelector('.cart');
const cartPop = document.querySelector('.cartPop');
const clearCartButton = document.querySelector('.clearCart');

const inCart = [];

  function downloadStoredCart() {
    for (let i = 0; i < localStorage.length; i++){
      if (localStorage.getItem(`item${i}`) === null) {
        break;
      }
      // FIXME: Create one entity for items in card and save it as one key-value object
      inCart[i] = JSON.parse(localStorage.getItem(`item${i}`));
    }
  }

  function renderStoredCart(){
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

  function openCart(click) {
    if (cartPop) {
      cartPop.classList.add('open');
      click.preventDefault();
    }
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
  
    Array.from(document.querySelectorAll('#cartCounter'))
    .forEach((element) => element.innerHTML = `${counterNum}`);
  }
  
  function sumAllItemsPriceInCart() {
    const counterNum = inCart.reduce(
      (accumulator, currentValue) => accumulator + (currentValue.amount * currentValue.price),
      0,
    );
  
    document.getElementById('priceSum').innerHTML = `${counterNum} $`;
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
    let result = 0;
    inCart.forEach((item) => {
      let {id, amount} = item;
      if (parseInt(event.target.id) === id) {
        const counter = amount + 1;
        if (counter > store[id - 1].amountOfProduct) {
          alert('Sorry the number of available product is limited!');
        } else {
          document.getElementById(`amount${id}`).innerHTML = counter;
          item.amount = counter;
          result = counter;
        }
  
        calculateSameItemsPrice(id);
      }
    });
    countAllItemsInCart();
    sumAllItemsPriceInCart();
    collectItemInCartData();
    return result;
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

  // FIXME: Don't use upper case for variables (ID)
  function addItemToCart(event, amount = 1, ID = -1) {
    let isInCart = false;
    // FIXME: Do you need this > 0?
    if (inCart.length > 0) {
  
      inCart.forEach((item) => {
        if (ID === item.id) {
          isInCart = true;
          item.amount = (event === undefined) ? amount : addOneOfTheseItem(event);
          document.querySelector(`#item${ID}`) ?? render(ID, item.amount);
        }
      });
  
      if (!isInCart) {
        // FIXME:
        store.forEach((item) => {
          if (item.id === ID) {
            inCart.push({
              id: ID,
              amount: amount,
              price: item.actualPrice,
            });
            render(ID, amount);
          }
        });
      }
     } else {
      // FIXME:
      store.forEach((item) => {
        if (item.id === ID) {
          inCart.push({
            id: ID,
            amount: amount,
            price: item.actualPrice,
          });
          render(ID, amount);
        }
      });
    }
  
    function render(targetID, amount) {
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
    countAllItemsInCart();
    sumAllItemsPriceInCart();
    collectItemInCartData();
  }
  
function addEListenersToCart() {
    Array.from(document.getElementsByClassName('addThisItem'), (plus) => plus.addEventListener('click', addOneOfTheseItem));
    Array.from(document.getElementsByClassName('removeThisItem'), (minus) => minus.addEventListener('click', removeOneOfTheseItem));
}

export {downloadStoredCart, renderStoredCart, openCart, closeCart, clearCart, 
    addItemToCart, cartButton, clearCartButton, cartPop, itemsLotsContainer, inCart};