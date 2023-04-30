const orderId = document.getElementById('orderId');

let str = document.location.href;
let url = new URL(str);
let idCommand = url.searchParams.get("orderId");

function displayOrderId() {
    orderId.textContent = idCommand;
}

window.addEventListener("DOMContentLoaded", () => {
    displayOrderId();
});