function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({ name, price });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(name + " добавлен в корзину!");
}

function loadCart() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let list = document.getElementById('cart-items');
  let total = 0;
  if (list) {
    list.innerHTML = '';
    cart.forEach(item => {
      let li = document.createElement('li');
      li.textContent = item.name + " — " + item.price + " ₽";
      list.appendChild(li);
      total += item.price;
    });
    document.getElementById('cart-total').textContent = total;
  }
}

function checkout() {
  alert("Ваш заказ оформлен!");
  localStorage.removeItem('cart');
  loadCart();
}

function login() {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  if (email && password) {
    localStorage.setItem('user', email);
    alert("Добро пожаловать, " + email);
    window.location.href = "index.html";
  } else {
    alert("Введите почту и пароль!");
  }
}

window.onload = loadCart;