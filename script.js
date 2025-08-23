function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(name + " добавлен в корзину!");
}

function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItems = document.getElementById("cart-items");
  let total = 0;
  if (cartItems) {
    cartItems.innerHTML = "";
    cart.forEach(item => {
      cartItems.innerHTML += `<p>${item.name} — ${item.price} ₽</p>`;
      total += item.price;
    });
    document.getElementById("total").innerText = "Итого: " + total + " ₽";
  }
}

function clearCart() {
  localStorage.removeItem("cart");
  loadCart();
}

function login(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (email && password) {
    localStorage.setItem("user", email);
    document.getElementById("login-message").innerText = "Вход успешен!";
  } else {
    document.getElementById("login-message").innerText = "Введите данные!";
  }
}

window.onload = loadCart;