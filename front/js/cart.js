const cartList = document.getElementById('cart__items');
const indicTotalQuantity = document.getElementById('totalQuantity');
const indicTotalPrice = document.getElementById('totalPrice');
let allProductsSelected = [];

const errorFirstName = document.getElementById('firstNameErrorMsg');
const firstNameInput = document.getElementById('firstName');

const errorLastName = document.getElementById('lastNameErrorMsg');
const lastNameInput = document.getElementById('lastName');

const errorAddress = document.getElementById('addressErrorMsg');
const addressInput = document.getElementById('address');

const cityError = document.getElementById('cityErrorMsg');
const cityInput = document.getElementById('city');

const emailError = document.getElementById('emailErrorMsg');
const emailInput = document.getElementById('email');

const orderBtn = document.getElementById('order');

let productSrc;
let productAlt;
let productName;
let productCol;
let productNb;
let productPrice;
let totalQuantity = 0;
let priceCurrentProduct = 0;
let totalPrice = 0;


function checkProducts() {
    
    for (let i=0; i<localStorage.length; i++) {
        
        let canapStr = localStorage.getItem(localStorage.key(i));
        let canapJson = JSON.parse(canapStr);
        
        let productId = canapJson.id;
        let productColor = canapJson.color;
        let productQuantity = canapJson.quantity;
        let productCheck = [];
        let productColorCheck = [];
        
        productCheck.push(productId);
        productColorCheck.push(productColor);
        productColorCheck.push(productQuantity);
        productCheck.push(productColorCheck);
        allProductsSelected.push(productCheck);
    }
}

function displayProducts() {
    fetch('http://localhost:3000/api/products')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let canaps = data;
        
        for (let i=0; i<allProductsSelected.length; i++) {
            // Crée fiche article
            let newArticle = document.createElement('article');
            newArticle.classList.add('cart__item');
            newArticle.setAttribute('data-id', allProductsSelected[i][0]);
            newArticle.setAttribute('data-color', allProductsSelected[i][1][0]);
            cartList.appendChild(newArticle);
            
            const fichesProduit = Array.from(document.querySelectorAll('.cart__item'));
            
            // Crée img item
            let newDivImg = document.createElement('div');
            newDivImg.classList.add('cart__item__img');
            fichesProduit[i].appendChild(newDivImg);
            const divImg = Array.from(document.querySelectorAll('.cart__item__img'));
            let newImgItem = document.createElement('img');
            
            // stocke variables
            for (let j=0; j<canaps.length; j++) {
                if (canaps[j]._id == allProductsSelected[i][0]) {
                    productSrc = canaps[j].imageUrl;
                    productAlt = canaps[j].altTxt;
                    productName = canaps[j].name;
                    productCol = allProductsSelected[i][1][0];
                    productPrice = canaps[j].price;
                    productNb = allProductsSelected[i][1][1];
                }
            }
            
            newImgItem.src = productSrc;
            newImgItem.alt = productAlt;
            divImg[i].appendChild(newImgItem);
            
            // Crée container content
            let newContainerContent = document.createElement('div');
            newContainerContent.classList.add('cart__item__content');
            fichesProduit[i].appendChild(newContainerContent);
            const containerContent = Array.from(document.querySelectorAll('.cart__item__content'));
            
            // Crée container description
            let newContainerDesc = document.createElement('div');
            newContainerDesc.classList.add('cart__item__content__description');
            containerContent[i].appendChild(newContainerDesc);
            const containerDesc = Array.from(document.querySelectorAll('.cart__item__content__description'));
            
            // Crée description
            let newNameProduct = document.createElement('h2');
            newNameProduct.textContent = productName;
            containerDesc[i].appendChild(newNameProduct);
            
            let newColorProduct = document.createElement('p');
            newColorProduct.textContent = productCol;
            containerDesc[i].appendChild(newColorProduct);
            
            let newPriceProduct = document.createElement('p');
            newPriceProduct.textContent = productPrice + " €";
            containerDesc[i].appendChild(newPriceProduct);
            allProductsSelected[i].push(productPrice);
            
            // Crée container settings
            let newContainerSettings = document.createElement('div');
            newContainerSettings.classList.add('cart__item__content__settings');
            containerContent[i].appendChild(newContainerSettings);
            const containerSettings = Array.from(document.querySelectorAll('.cart__item__content__settings'));
            
            // Crée container quantité
            let newContainerQuantity = document.createElement('div');
            newContainerQuantity.classList.add('cart__item__content__settings__quantity');
            containerSettings[i].appendChild(newContainerQuantity);
            const containerQuantity = Array.from(document.querySelectorAll('.cart__item__content__settings__quantity'));
            
            // Crée content quantity
            let newQuantityContent = document.createElement('p');
            newQuantityContent.textContent = "Quantité : ";
            containerQuantity[i].appendChild(newQuantityContent);
            
            let newInputQuantity = document.createElement('input');
            newInputQuantity.type = "number";
            newInputQuantity.classList.add('itemQuantity');
            newInputQuantity.name = "itemQuantity";
            newInputQuantity.min = "1";
            newInputQuantity.max = "100";
            newInputQuantity.value = productNb;
            containerQuantity[i].appendChild(newInputQuantity);
            
            
            // Crée container delete
            let newContainerDelete = document.createElement('div');
            newContainerDelete.classList.add('cart__item__content__settings__delete');
            containerSettings[i].appendChild(newContainerDelete);
            const containerDelete = Array.from(document.querySelectorAll('.cart__item__content__settings__delete'));
            
            // Crée delete
            let newDelete = document.createElement('p');
            newDelete.classList.add('deleteItem');
            newDelete.textContent = "Supprimer";
            containerDelete[i].appendChild(newDelete);
        }
        
        calculateQuantity();
        calculatePrice();
        
        // handle quantity
        const inputQuantity = Array.from(document.querySelectorAll('.itemQuantity'));
        
        inputQuantity.forEach((item) => {
            item.addEventListener("change", (e) => {
                calculateQuantity();
                calculatePrice();
                
                for (let i=0; i<inputQuantity.length; i++) {
                    if (inputQuantity[i] == item) {
                        allProductsSelected[i][1][1] = inputQuantity[i].value;
                        
                        // Mets à jour local storage
                        let idStorage = item.closest('.cart__item').getAttribute('data-id');
                        let colorStorage = item.closest('.cart__item').getAttribute('data-color');
                        let quantityStorage = allProductsSelected[i][1][1];
                        
                        let productJson = {
                            id : idStorage,
                            color : colorStorage,
                            quantity : quantityStorage
                        }
                        
                        if (localStorage.key(i) == idStorage + "/" + colorStorage) {
                            // Stocke cookie
                            let strJson = JSON.stringify(productJson);
                            localStorage.setItem(idStorage + "/" + colorStorage, strJson); 
                        }
                    }
                }
            });
        });
        
        // handle delete
        const deleteBtn = Array.from(document.querySelectorAll('.deleteItem'));
        
        deleteBtn.forEach((item) => {
            item.addEventListener("click", (e) => {
                
                for (let i=0; i<deleteBtn.length; i++) {
                    if (deleteBtn[i] == item) {
                        // Mets à jour local storage
                        let idStorage = item.closest('.cart__item').getAttribute('data-id');
                        let colorStorage = item.closest('.cart__item').getAttribute('data-color');
                        
                        localStorage.removeItem(idStorage + "/" + colorStorage);
                        
                        allProductsSelected.splice(i, 1);
                    }
                }
                
                itemToDelete = item.closest('.cart__item');
                itemToDelete.remove();
                
                calculateQuantity();
                calculatePrice();
            });
        });
    });
}

function calculateQuantity() {
    const inputQuantity = Array.from(document.querySelectorAll('.itemQuantity'));
    totalQuantity = 0;
    inputQuantity.forEach((item) => {
        totalQuantity = Math.floor(totalQuantity) + Math.floor(item.value);
    })
    indicTotalQuantity.textContent = totalQuantity;
}

function calculatePrice() {
    const inputQuantity = Array.from(document.querySelectorAll('.itemQuantity'));
    totalPrice = 0;
    for (let i=0; i<inputQuantity.length; i++) {
        priceCurrentProduct =  Math.floor(inputQuantity[i].value) * Math.floor(allProductsSelected[i][2]);
        totalPrice = Math.floor(totalPrice) + Math.floor(priceCurrentProduct);
    }
    indicTotalPrice.textContent = totalPrice;
    
}

// Gère Formulaire
function handleOrder() {
    
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const nameRegex = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/;
    const addressRegex = /(\d{1,}) [a-zA-Z0-9\s]+(\.)? [a-zA-Z]/;
    const cityRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    
    orderBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let firstNameIsOk = false;
        let lastNameIsOk  = false;
        let addressIsOk = false;
        let cityIsOk = false;
        let emailIsOk = false;
        
        if (firstNameInput.value == "") {
            errorFirstName.textContent = "Veuillez indiquer votre prénom";
        } else if (nameRegex.test(firstNameInput.value) == false) {
            errorFirstName.textContent = "Il semble y avoir une erreur dans votre prénom";
        } else {
            errorFirstName.textContent = "";
            firstNameIsOk = true;
        }
        
        if (lastNameInput.value == "") {
            errorLastName.textContent = "Veuillez indiquer votre nom";
        } else if (nameRegex.test(lastNameInput.value) == false) {
            errorLastName.textContent = "Il semble y avoir une erreur dans votre nom";
        } else {
            errorLastName.textContent = "";
            lastNameIsOk = true;
        }
        
        if (addressInput.value == "") {
            errorAddress.textContent = "Veuillez indiquer votre adresse";
        } else if (addressRegex.test(addressInput.value) == false) {
            errorAddress.textContent = "Il semble y avoir une erreur dans votre adresse";
        } else {
            errorAddress.textContent = "";
            addressIsOk = true;
        }
        
        if (cityInput.value == "") {
            cityError.textContent = "Veuillez indiquer votre ville";
        } else if (cityRegex.test(cityInput.value) == false) {
            cityError.textContent = "Il semble y avoir une erreur dans votre ville";
        } else {
            cityError.textContent = "";
            cityIsOk = true;
        }
        
        if (emailInput.value == "") {
            emailError.textContent = "Veuillez indiquer votre email";
        } else if (emailRegex.test(emailInput.value) == false) {
            emailError.textContent = "Il semble y avoir une erreur dans votre email";
        } else {
            emailError.textContent = "";
            emailIsOk = true;
        }
        
        if (firstNameIsOk && lastNameIsOk && addressIsOk && cityIsOk && emailIsOk) {
            submitOrder();
        }
    });
}

async function submitOrder() {
    let contact = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        address: addressInput.value,
        city: cityInput.value,
        email: emailInput.value
    }
    
    
    let productsArray = allProductsSelected.map(p => p[0]);
    let data = {
        contact : contact,
        products : productsArray
    };
    
    
    
    let response = await fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    let result = await response.json();

    window.location.href = "./confirmation.html?orderId=" + result.orderId; 
} 


window.addEventListener("DOMContentLoaded", () => {
    checkProducts();
    displayProducts();
    handleOrder();
});