function addToCart(productId) {
  (async () => {
    try {
      let cartId = localStorage.getItem("cartId");

      if (!cartId) {
        const response = await fetch("http://localhost:8080/api/carts", {
          method: "POST",
        });
        const data = await response.json();
        cartId = data.payload._id;
        localStorage.setItem("cartId", cartId);
      }

      const response = await fetch(
        `http://localhost:8080/api/carts/${cartId}/product/${productId}`,
        { method: "POST" }
      );

      if (response.status !== 200) {
        throw new Error("Error al agregar el producto al carrito");
      } else {
        alert("El producto se agregó al carrito correctamente");
      }

      updateCartBadge();
    } catch (error) {
      console.error(error);
      alert("Error al agregar el producto al carrito");
    }
    return cartId;
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

function purchaseCart() {
  const cartId = localStorage.getItem("cartId");
  windows.location.href = `/carts/purchase/${cartId}`;
  fetch(`/api/carts/${cartId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data.payload.products);
      const products = data.payload.products;
      const formatProduct = products.map((product) => {
        return {
          id: product.id._id,
          quantity: product.quantity,
        };
      });
      // console.log('desde front', formatProduct);

      fetch(`/api/carts/${cartId}/purchase`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formatProduct),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          const id = data.payload._id;
          setTimeout(() => {
            window.location.href = `/api/carts/purchase/${id}`;
          }, 3000);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

updateCartBadge();
