let items = document.querySelector('.items');
let baseHref = "./product.html?id=";


fetch('http://localhost:3000/api/products')
.then((response) => {
    return response.json();
})
.then((data) => {
    let canaps = data;

    for (let i=0; i<canaps.length; i++) {

        // Crée le lien produit
        let newA = document.createElement('a');
        // Améliorer méthode d'ajout url (utiliser paramètre d'url)
        newA.href = baseHref + canaps[i]._id;
        items.appendChild(newA);

        // Crée balise article
        let lastA = items.lastChild;
        let newArticle = document.createElement('article');
        lastA.appendChild(newArticle);

        // Crée l'image
        let lastArticle = lastA.lastChild;
        let newImg = document.createElement('img');
        newImg.src = canaps[i].imageUrl;
        newImg.alt = canaps[i].altTxt + ", " + canaps[i].name;
        lastArticle.appendChild(newImg);

        // Crée le nom produit
        let newNameProduct = document.createElement('h3');
        newNameProduct.classList.add('productName');
        newNameProduct.textContent = canaps[i].name;
        lastArticle.appendChild(newNameProduct);

        // Crée la description produit
        let newDesc = document.createElement('p');
        newDesc.classList.add('productDescription');
        newDesc.textContent = canaps[i].description;
        lastArticle.appendChild(newDesc);
    }
});