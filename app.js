"use strict";

const products = [
  { id: "arroz", name: "Arroz branco", category: "Básicos", price: 2490, unit: "pacote de 5 kg", emoji: "🍚", description: "Arroz branco para acompanhar as refeições do dia a dia." },
  { id: "feijao", name: "Feijão carioca", category: "Básicos", price: 749, unit: "pacote de 1 kg", emoji: "🫘", description: "Feijão carioca para preparar em casa." },
  { id: "oleo", name: "Óleo de soja", category: "Básicos", price: 649, unit: "garrafa de 900 ml", emoji: "🫗", description: "Óleo de soja para cozinhar e preparar receitas." },
  { id: "cafe", name: "Café tradicional", category: "Básicos", price: 1790, unit: "pacote de 500 g", emoji: "☕", description: "Café tradicional para preparar uma bebida quente." },
  { id: "banana", name: "Banana prata", category: "Hortifruti", price: 699, unit: "preço por kg", emoji: "🍌", description: "Bananas para comer no lanche ou no café da manhã." },
  { id: "maca", name: "Maçã vermelha", category: "Hortifruti", price: 990, unit: "preço por kg", emoji: "🍎", description: "Maçãs frescas para lanches e refeições." },
  { id: "tomate", name: "Tomate", category: "Hortifruti", price: 750, unit: "preço por kg", emoji: "🍅", description: "Tomates para saladas, molhos e outras receitas." },
  { id: "leite", name: "Leite integral", category: "Laticínios", price: 529, unit: "caixa de 1 litro", emoji: "🥛", description: "Leite integral para beber ou usar em receitas." },
  { id: "ovos", name: "Ovos", category: "Laticínios", price: 1199, unit: "bandeja com 12", emoji: "🥚", description: "Bandeja com doze ovos para preparar refeições." },
  { id: "pao", name: "Pão de forma", category: "Padaria", price: 899, unit: "pacote de 450 g", emoji: "🍞", description: "Pão fatiado para sanduíches e café da manhã." },
  { id: "sabonete", name: "Sabonete", category: "Cuidados", price: 299, unit: "unidade de 85 g", emoji: "🧼", description: "Sabonete para a higiene diária." },
  { id: "papel", name: "Papel higiênico", category: "Cuidados", price: 1299, unit: "pacote com 4 rolos", emoji: "🧻", description: "Pacote com quatro rolos de papel higiênico." }
];

const state = {
  category: "Todos",
  search: "",
  cart: new Map(),
  fontSize: 16,
  highContrast: false,
  easyRead: false
};

const elements = {
  searchForm: document.querySelector("#search-form"),
  searchInput: document.querySelector("#search-input"),
  productGrid: document.querySelector("#product-grid"),
  categoryList: document.querySelector("#category-list"),
  resultsCount: document.querySelector("#results-count"),
  emptyResults: document.querySelector("#empty-results"),
  cartItems: document.querySelector("#cart-items"),
  cartEmpty: document.querySelector("#cart-empty"),
  cartSummary: document.querySelector("#cart-summary"),
  cartSubtotal: document.querySelector("#cart-subtotal"),
  cartCount: document.querySelector("#cart-count"),
  navCartCount: document.querySelector("#nav-cart-count"),
  statusMessage: document.querySelector("#status-message"),
  accessibilityToggle: document.querySelector("#accessibility-toggle"),
  accessibilityPanel: document.querySelector("#accessibility-panel"),
  checkoutDialog: document.querySelector("#checkout-dialog"),
  dialogSummary: document.querySelector("#dialog-summary")
};

let statusTimeoutId;

function formatPrice(priceInCents) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(priceInCents / 100);
}

function announce(message) {
  elements.statusMessage.textContent = message;
  elements.statusMessage.classList.add("is-visible");
  window.clearTimeout(statusTimeoutId);
  statusTimeoutId = window.setTimeout(() => {
    elements.statusMessage.classList.remove("is-visible");
  }, 3200);
}

function speak(text) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    announce("A leitura em voz alta não está disponível neste navegador. Você ainda pode ler o texto na tela.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = 0.92;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  announce("Leitura em voz alta interrompida.");
}

function getVisibleProducts() {
  const normalizedSearch = state.search.trim().toLocaleLowerCase("pt-BR");
  return products.filter((product) => {
    const matchesCategory = state.category === "Todos" || product.category === state.category;
    const searchableText = `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("pt-BR");
    return matchesCategory && searchableText.includes(normalizedSearch);
  });
}

function createButton(label, className, onClick, accessibleLabel = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  if (accessibleLabel) button.setAttribute("aria-label", accessibleLabel);
  button.addEventListener("click", onClick);
  return button;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  elements.productGrid.replaceChildren();
  elements.resultsCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "produto" : "produtos"}`;
  elements.emptyResults.hidden = visibleProducts.length !== 0;

  visibleProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const visual = document.createElement("div");
    visual.className = "product-visual";
    visual.setAttribute("aria-hidden", "true");
    visual.textContent = product.emoji;

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;

    const meta = document.createElement("div");
    meta.className = "product-meta";
    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);
    const unit = document.createElement("span");
    unit.className = "product-unit";
    unit.textContent = product.unit;
    meta.append(price, unit);

    const actions = document.createElement("div");
    actions.className = "product-actions";
    const readButton = createButton("Ouvir", "button read-button", () => {
      speak(`${product.name}. ${product.description} Unidade: ${product.unit}. Preço: ${formatPrice(product.price)}.`);
    }, `Ouvir descrição e preço de ${product.name}`);
    const addButton = createButton("Adicionar", "button button-primary", () => addToCart(product.id), `Adicionar ${product.name} ao carrinho`);
    actions.append(readButton, addButton);

    card.append(visual, category, title, description, meta, actions);
    elements.productGrid.append(card);
  });
}

function getCartCount() {
  let count = 0;
  state.cart.forEach((quantity) => { count += quantity; });
  return count;
}

function getCartTotal() {
  let total = 0;
  state.cart.forEach((quantity, productId) => {
    const product = products.find((item) => item.id === productId);
    if (product) total += product.price * quantity;
  });
  return total;
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  state.cart.set(productId, (state.cart.get(productId) || 0) + 1);
  renderCart();
  announce(`${product.name} adicionado ao carrinho.`);
}

function changeQuantity(productId, change) {
  const currentQuantity = state.cart.get(productId) || 0;
  const nextQuantity = currentQuantity + change;
  if (nextQuantity <= 0) state.cart.delete(productId);
  else state.cart.set(productId, nextQuantity);
  renderCart();

  const product = products.find((item) => item.id === productId);
  if (product) {
    announce(nextQuantity <= 0 ? `${product.name} removido do carrinho.` : `Quantidade de ${product.name}: ${nextQuantity}.`);
  }
}

function removeFromCart(productId) {
  const product = products.find((item) => item.id === productId);
  state.cart.delete(productId);
  renderCart();
  if (product) announce(`${product.name} removido do carrinho.`);
}

function renderCart() {
  elements.cartItems.replaceChildren();
  const entries = Array.from(state.cart.entries());
  const count = getCartCount();

  elements.cartCount.textContent = String(count);
  elements.navCartCount.textContent = String(count);
  elements.cartEmpty.hidden = entries.length !== 0;
  elements.cartSummary.hidden = entries.length === 0;
  elements.cartSubtotal.textContent = formatPrice(getCartTotal());

  entries.forEach(([productId, quantity]) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const item = document.createElement("li");
    item.className = "cart-item";
    const main = document.createElement("div");
    main.className = "cart-item-main";

    const emoji = document.createElement("span");
    emoji.className = "cart-item-emoji";
    emoji.setAttribute("aria-hidden", "true");
    emoji.textContent = product.emoji;

    const info = document.createElement("div");
    info.className = "cart-item-info";
    const title = document.createElement("h3");
    title.textContent = product.name;
    const price = document.createElement("p");
    price.textContent = `${quantity} × ${formatPrice(product.price)} = ${formatPrice(product.price * quantity)}`;
    info.append(title, price);
    main.append(emoji, info);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";
    const decrease = createButton("−", "", () => changeQuantity(product.id, -1), `Diminuir quantidade de ${product.name}`);
    const value = document.createElement("span");
    value.className = "quantity-value";
    value.textContent = String(quantity);
    value.setAttribute("aria-label", `Quantidade: ${quantity}`);
    const increase = createButton("+", "", () => changeQuantity(product.id, 1), `Aumentar quantidade de ${product.name}`);
    const remove = createButton("Remover", "remove-item", () => removeFromCart(product.id), `Remover ${product.name} do carrinho`);
    controls.append(decrease, value, increase, remove);

    item.append(main, controls);
    elements.cartItems.append(item);
  });
}

function setAccessibilityPanel(open) {
  elements.accessibilityPanel.hidden = !open;
  elements.accessibilityToggle.setAttribute("aria-expanded", String(open));
  if (open) document.querySelector("#close-accessibility").focus();
}

function updateCategoryButtons(selectedCategory) {
  elements.categoryList.querySelectorAll("[data-category]").forEach((button) => {
    const isActive = button.dataset.category === selectedCategory;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function setFontSize(nextSize) {
  state.fontSize = Math.max(14, Math.min(22, nextSize));
  document.documentElement.style.fontSize = `${state.fontSize}px`;
  announce(`Tamanho base do texto: ${state.fontSize} pixels.`);
}

function showCheckoutSummary() {
  const count = getCartCount();
  const total = formatPrice(getCartTotal());
  const itemDescription = Array.from(state.cart.entries()).map(([productId, quantity]) => {
    const product = products.find((item) => item.id === productId);
    return product ? `${quantity} ${product.name}` : "";
  }).filter(Boolean).join(", ");

  elements.dialogSummary.textContent = `Você selecionou ${count} ${count === 1 ? "item" : "itens"}: ${itemDescription}. Subtotal simulado: ${total}.`;
  if (typeof elements.checkoutDialog.showModal === "function") elements.checkoutDialog.showModal();
  else announce("Seu pedido de demonstração está pronto para conferência. Nenhuma compra será enviada.");
}

function bindEvents() {
  elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.search = elements.searchInput.value;
    renderProducts();
    document.querySelector("#produtos").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  elements.searchInput.addEventListener("input", () => {
    state.search = elements.searchInput.value;
    renderProducts();
  });

  elements.categoryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    updateCategoryButtons(state.category);
    renderProducts();
  });

  elements.accessibilityToggle.addEventListener("click", () => {
    setAccessibilityPanel(elements.accessibilityPanel.hidden);
  });
  document.querySelector("#close-accessibility").addEventListener("click", () => {
    setAccessibilityPanel(false);
    elements.accessibilityToggle.focus();
  });
  document.querySelector("#font-decrease").addEventListener("click", () => setFontSize(state.fontSize - 2));
  document.querySelector("#font-increase").addEventListener("click", () => setFontSize(state.fontSize + 2));

  document.querySelector("#contrast-toggle").addEventListener("click", (event) => {
    state.highContrast = !state.highContrast;
    document.body.classList.toggle("high-contrast", state.highContrast);
    event.currentTarget.setAttribute("aria-pressed", String(state.highContrast));
    event.currentTarget.textContent = `Alto contraste: ${state.highContrast ? "ligado" : "desligado"}`;
    announce(`Alto contraste ${state.highContrast ? "ativado" : "desativado"}.`);
  });

  document.querySelector("#simple-mode-toggle").addEventListener("click", (event) => {
    state.easyRead = !state.easyRead;
    document.body.classList.toggle("easy-read", state.easyRead);
    event.currentTarget.setAttribute("aria-pressed", String(state.easyRead));
    event.currentTarget.textContent = `Modo simples: ${state.easyRead ? "ligado" : "desligado"}`;
    announce(`Modo de leitura simplificada ${state.easyRead ? "ativado" : "desativado"}.`);
  });

  document.querySelector("#read-instructions").addEventListener("click", () => {
    speak("Bem-vindo ao Mercadinho Perto. Para comprar, procure um produto pelo nome ou escolha uma categoria. Aperte Ouvir para escutar a descrição e o preço. Aperte Adicionar para colocar o produto no carrinho. No carrinho, use mais ou menos para mudar a quantidade e Confira pedido para ler o resumo. Este site é uma demonstração e não recebe pagamentos.");
  });
  document.querySelector("#stop-audio").addEventListener("click", stopSpeaking);
  document.querySelector("#read-welcome").addEventListener("click", () => {
    speak("Sua compra do dia, sem complicação. No Mercadinho Perto, você pode buscar produtos, ouvir suas descrições e montar seu carrinho. Use o botão Acessibilidade para aumentar o texto ou ligar o alto contraste.");
  });

  document.querySelector("#clear-cart-button").addEventListener("click", () => {
    state.cart.clear();
    renderCart();
    announce("Carrinho esvaziado.");
  });
  document.querySelector("#checkout-button").addEventListener("click", showCheckoutSummary);
  document.querySelector("#close-dialog").addEventListener("click", () => elements.checkoutDialog.close());

  elements.checkoutDialog.addEventListener("click", (event) => {
    if (event.target === elements.checkoutDialog) elements.checkoutDialog.close();
  });
  elements.checkoutDialog.addEventListener("close", () => document.querySelector("#checkout-button").focus());

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.accessibilityPanel.hidden) {
      setAccessibilityPanel(false);
      elements.accessibilityToggle.focus();
    }
  });
}

bindEvents();
renderProducts();
renderCart();
