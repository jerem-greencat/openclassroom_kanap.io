let str = document.location.href;
let url = new URL(str);
let idProduct = url.searchParams.get("id");

let imgProduct = document.querySelector('.item__img');
let productTitle = document.querySelector('#title');
let priceProduct = document.querySelector('#price');
let descProduct = document.querySelector('#description');
let colorOptions = document.querySelector('#colors');
let quantity = document.querySelector('#quantity');
let addBtn = document.querySelector('#addToCart');

console.log(idProduct);

fetch('http://localhost:3000/api/products')
.then((response) => {
    return response.json();
})
.then((data) => {
    let canaps = data;
    for (let i=0; i<canaps.length; i++) {
        if (canaps[i]._id === idProduct) {
            
            // Crée l'image du produit
            let newImg = document.createElement('img');
            newImg.src = canaps[i].imageUrl;
            newImg.alt = canaps[i].altTxt;
            imgProduct.appendChild(newImg);
            
            // Crée le nom du produit
            productTitle.textContent = canaps[i].name;
            
            // Crée le prix du produit
            priceProduct.textContent = canaps[i].price;
            
            // Crée la description du produit
            descProduct.textContent = canaps[i].description;
            
            // Crée les options de couleur
            for (let j=0; j<canaps[i].colors.length; j++) {
                let newColor = document.createElement('option');
                newColor.value = canaps[i].colors[j];
                newColor.textContent = canaps[i].colors[j];
                colorOptions.appendChild(newColor);
            }
        }
    }
    addToCart();
});

function addToCart() {
    addBtn.addEventListener('click', () => {
        // Vérifie si tous les champs sont remplis
        if (colorOptions.value == "") {
            alert("Veuillez sélectionner une couleur");
        } else if (quantity.value == 0) {
            alert("Veuillez sélectionner une quantité");
        } else {
            
            // Crée l'obj json à stocker
            let productJson = {
                id: idProduct,
                color: colorOptions.value,
                quantity: quantity.value
            }
            
            for (let i=0; i<localStorage.length; i++) {
                // Vérifie si produit déja présent dans local storage
                if (localStorage.key(i) == idProduct + "/" + colorOptions.value) {
                    // Récupère valeurs du produit stocké
                    let productJsonStr = localStorage.getItem(idProduct + "/" + colorOptions.value);
                    // Change typage de l'objet stocké
                    let productJsonInStorage = JSON.parse(productJsonStr);
                    // Mets à jour quantité 
                    productJson.quantity = Math.floor(productJsonInStorage.quantity) + Math.floor(quantity.value);
                    productJson.quantity = JSON.stringify(productJson.quantity);
                }
            }
            // Stocke cookie
            let strJson = JSON.stringify(productJson);
            localStorage.setItem(idProduct + "/" + colorOptions.value, strJson);            
        }
    });
}

