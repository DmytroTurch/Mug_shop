import * as cartRender from "./cartRender_module.js";
import {store} from './products.js';

const orderList = document.querySelector('.orderList');

function formOrderList(savedAmount, savedID) {
    if (orderList) {
        store.forEach((itemStore) => {
            if (itemStore.id === savedID) {
                const newItemSlot = document.createElement('div');
                newItemSlot.classList.add('item');
                newItemSlot.id = `item${savedID}`
        
                const itemImg = document.createElement('img');
                itemImg.width = 40;
                itemImg.height = 38;
                itemImg.src = `.${itemStore.img}`;
                itemImg.alt = 'Super Cup';
                itemImg.classList.add('cartImg');
                newItemSlot.appendChild(itemImg);
        
                const itemName = document.createElement('h1');
                itemName.classList.add('item_name', 'text', 'text_articleHead');
                const name = document.createTextNode(`${itemStore.name}`);
                itemName.appendChild(name);
                newItemSlot.appendChild(itemName);
        
                const price = document.createElement('p');
                price.classList.add('item_actPrice');
                price.id = `item_actPrice${savedID}`;
                const actualPrice = document.createTextNode(`${itemStore.actualPrice*savedAmount}`);
                price.appendChild(actualPrice);
                newItemSlot.appendChild(price);
        
                const numberOfItem = document.createElement('p');
                numberOfItem.classList.add('numberOfItem');
                numberOfItem.id = `amount${savedID}`;
                const number = document.createTextNode(`${savedAmount}`);
                numberOfItem.appendChild(number);
                newItemSlot.appendChild(numberOfItem);
        
                orderList.appendChild(newItemSlot);
            }
        })

    }
};

let totalItemsPrice = 0;
let deliveryPrice = 0;

function renderOrderList(){
    cartRender.inCart.forEach((item) => {
        formOrderList(item.amount, item.id);
    });
};

function renderCheckOutAside() {
    if(document.querySelector('.check-out-total')) {
        const listedItemsNumber = cartRender.inCart
        .reduce((acc, next) => acc + next.amount, 0);

        document.querySelector('#cartCounter').innerHTML = `${listedItemsNumber}`;

        const totalSum = cartRender.inCart
        .reduce((acc, next) => acc + next.amount*next.price, 0);
        document.querySelector('#priceSum').innerHTML = `${totalSum}$`
        totalItemsPrice = totalSum;
    }
};

function deliverySelection() {
    const deliveryPriseHolder = document.querySelector('.delivery-price');
    if (document.querySelector('#pick-up_shop').checked ) {
        deliveryPriseHolder.innerHTML = '0$';
        deliveryPrice = 0;
        calcTotal()
    } else if (document.querySelector('#pick-up_post').checked) {
        deliveryPriseHolder.innerHTML = '5$';
        deliveryPrice = 5;
        calcTotal()
    } else if (document.querySelector('#courier').checked) {
        deliveryPriseHolder.innerHTML = '10$';
        deliveryPrice = 10;
        calcTotal()
    }
};

function calcTotal() {
    document.querySelector('.toPay').innerHTML = `${totalItemsPrice + deliveryPrice}$`
};

cartRender.downloadStoredCart();
renderOrderList();
renderCheckOutAside();
deliverySelection();
calcTotal();

document.querySelector('#pick-up_shop').addEventListener('click', deliverySelection);
document.querySelector('#pick-up_post').addEventListener('click', deliverySelection);
document.querySelector('#courier').addEventListener('click', deliverySelection);