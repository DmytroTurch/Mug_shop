//Elements from DOM 

const productLots           = document.getElementById("lotsRender"); 
const cartButton            = document.getElementsByClassName("cart");
const cartPop               = document.getElementsByClassName("cartPop");
const backShopButton        = document.getElementsByClassName("return");
const itemsLots             = document.getElementsByClassName("shopLot");
const itemsLotsConteiner    = document.getElementsByClassName("itemsList")[0];
const addToCart             = document.getElementsByClassName("addToCart")
const cleareCartButton      = document.getElementsByClassName("cleareCart")[0];
const increaseButtons       = document.getElementsByClassName("addThisItem");
const decreaseButtons       = document.getElementsByClassName("removeThisItem");
const numberOfItem          = document.getElementsByClassName("numberOfItem");

//Render functions

function lotsRendering() {
    store.forEach( (item) => {
        productLots.innerHTML += `
            <div class="shopLot" ">
                <img src="${item.img}" alt="${item.name}" class="itempicture">
                <h3 class="text text_black text_name">${item.name}</h3>
                <h3 class="price text text_black text_mid">
                ${item.price}
                    <span class="newPrice">${item.discountPrice}</span>
                    <span class="oldPrice">${item.oldPrice}</span>
                </h3>
                <a  id="${item.id}" class="addToCart" href="#"><img src="/images/addToCartIcon.png"></a>
            </div>
            `;
    });
}

function addItem(event) {

   let theTarget = event.currentTarget.id;

    for (let i = 0; i < addToCart.length; i++) {
        if (addToCart[i].id === theTarget) {
            
            store.forEach( (item) => {
                if (item.id === +theTarget) {
                    itemsLotsConteiner.innerHTML += `
                            <div class="item" id="item${item.id}">
                                    <img height="40px" width="38px" src="${item.img}" alt="${item.name}"" class="cartImg">
                                    <h1 class="item_name">${item.name}"</h1>
                                    <p class="item_actPrice" id="item_actPrice${item.id}">${item.actualPrice}</p>
                                    <div class="item_counter"> 
                                        <button class="counterButton addThisItem${item.id}" id="${item.id}" >+</button>
                                        <p class="numberOfItem" id="${item.id}">1</p>
                                        <button class="counterButton removeThisItem${item.id}" id="${item.id}">-</button>     
                                    </div>
                                </div>
                            `;

                    document.querySelector(`.addThisItem${item.id}`).addEventListener("click", plusOne)
                    document.querySelector(`.removeThisItem${item.id}`).addEventListener("click", minusOne)
                }
            });

        }
    }

    event.preventDefault();
}


lotsRendering ();




//Event listeners 
cartButton[0].addEventListener("click", openCart)
backShopButton[0].addEventListener("click", closeCart)
cleareCartButton.addEventListener("click", cleareCart)

for ( each of addToCart) {
    each.addEventListener("click", addItem);
}


//Cart interactions

function openCart(e) {
    cartPop[0].classList.add("open");
    e.preventDefault();
}

function closeCart() {
    cartPop[0].classList.remove("open");
}

function cleareCart () {
    if (document.getElementsByClassName("item").length !== 0) {
        for (each of document.getElementsByClassName("item")) {
            each.remove();
        }
    }
}

function plusOne(event) {
    for (each of numberOfItem) {
        if (event.currentTarget.id === each.id) {
            let counter = each.textContent;
            counter = +counter+1;
            counter > store[each.id-1].amountOfProduct ? alert("Sorry the number of available product is limited!"):
            each.innerHTML = counter;
            itemPriceModifier(each.id, +each.textContent);
        }
    }
}

function minusOne(event) {
    for (each of numberOfItem) {
        if (event.currentTarget.id === each.id) {
            let counter = each.textContent;
            counter = +counter-1;
            counter == 0 ? document.querySelector(`#item${each.id}`).remove() : each.innerHTML = counter;
            itemPriceModifier(each.id, +each.textContent);
        }
    }
}

function itemPriceModifier(id,numberItems) {
    let priceCalculation = store[id-1].actualPrice*numberItems;
    const price = document.querySelector(`#item_actPrice${id}`);
    price.innerHTML = priceCalculation;
}



