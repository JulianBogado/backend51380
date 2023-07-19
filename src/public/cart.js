//Agregar al carrito

function addToCart(productId) {
  (async () => {
    try {
      let cartId = localStorage.getItem("cartId");
      return cartId

      if (!cartId) {
        const response = await fetch("http://localhost:8080/api/carts", {
          method: "POST",
        });
        const data = await response.json();
        cartId = data.payload._id;
        localStorage.setItem("cartId", cartId);
      }

      await fetch(
        `http://localhost:8080/api/carts/${cartId}/product/${productId}`,
        { method: "POST" }
      );

      alert("El producto se agregó al carrito correctamente");
      updateCartBadge();
    } catch (error) {
      console.error(error);
      alert("Error al agregar el producto al carrito");
    }
  })();
}

//Badge

function updateCartBadge() {
  (async () => {
    try {
      let cartId = localStorage.getItem("cartId");

      if (!cartId) {
        document.getElementById("badgeCarrito").textContent = "";
        return;
      }

      const response = await fetch(`http://localhost:8080/api/carts/${cartId}`);
      const data = await response.json();

      if (data.payload && data.payload[0] && data.payload[0].products) {
        const cart = data.payload[0];
        const itemCount = cart.products.length;
        document.getElementById("badgeCarrito").textContent =
          itemCount.toString();
      } else {
        document.getElementById("badgeCarrito").textContent = "";
      }
    } catch (error) {
      console.error(error);
      document.getElementById("badgeCarrito").textContent = "";
    }
  })();
}

function redirectToCart() {
  const cartId = localStorage.getItem("cartId"); 
  window.location.href = `/carts/${cartId}`;
}

updateCartBadge();
