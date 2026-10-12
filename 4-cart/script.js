const products = [
  { id: 1, name: "Кофе", price: 300 },
  { id: 2, name: "Чай", price: 200 },
  { id: 3, name: "Круассан", price: 150 },
  { id: 4, name: "Маффин", price: 180 },
];

const PROMO_CODE = "SALE10";
const PROMO_DISCOUNT = 0.1;

let cart = [];
let discount = 0;

const productsEl = document.getElementById("products");
const cartItemsEl = document.getElementById("cart-items");
const badgeEl = document.getElementById("badge");
const totalEl = document.getElementById("total");
const emptyMsg = document.getElementById("empty-msg");
const promoInput = document.getElementById("promo-input");
const promoBtn = document.getElementById("promo-btn");
const clearBtn = document.getElementById("clear-btn");

function renderProducts() {
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = `${product.price} ₽`;

    const button = document.createElement("button");
    button.textContent = "В корзину";
    button.addEventListener("click", () => addToCart(product.id));

    card.append(name, price, button);
    productsEl.appendChild(card);
  });
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  const cartItem = cart.find((item) => item.id === id);
  if (cartItem) {
    cartItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
}

function increaseQty(id) {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;

  item.qty += 1;
  renderCart();
}

function decreaseQty(id) {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;

  item.qty = Math.max(1, item.qty - 1);
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
}

function applyPromo() {
  discount = promoInput.value.trim() === PROMO_CODE ? PROMO_DISCOUNT : 0;
  renderCart();
}

function clearCart() {
  cart = [];
  discount = 0;
  promoInput.value = "";
  renderCart();
}

function formatPrice(value) {
  return String(Number(value.toFixed(2)));
}

function createCartButton(label, className, onClick, action) {
  const button = document.createElement("button");
  button.textContent = label;
  button.className = className;
  if (action) button.dataset.act = action;
  button.addEventListener("click", onClick);
  return button;
}

function renderCart() {
  cartItemsEl.replaceChildren();

  let subtotal = 0;
  let itemCount = 0;

  cart.forEach((item) => {
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;
    itemCount += item.qty;

    const row = document.createElement("li");
    row.className = "cart-item";

    const name = document.createElement("span");
    name.textContent = item.name;

    const quantity = document.createElement("span");
    quantity.className = "qty";
    quantity.textContent = String(item.qty);

    const line = document.createElement("span");
    line.className = "line";
    line.textContent = `${formatPrice(lineTotal)} ₽`;

    row.append(
      name,
      createCartButton("−", "qty-btn", () => decreaseQty(item.id), "dec"),
      quantity,
      createCartButton("+", "qty-btn", () => increaseQty(item.id), "inc"),
      line,
      createCartButton("✕", "remove", () => removeItem(item.id)),
    );
    cartItemsEl.appendChild(row);
  });

  const total = subtotal * (1 - discount);
  badgeEl.textContent = String(itemCount);
  totalEl.textContent = formatPrice(total);
  emptyMsg.hidden = cart.length > 0;
}

promoBtn.addEventListener("click", applyPromo);
clearBtn.addEventListener("click", clearCart);

renderProducts();
renderCart();
