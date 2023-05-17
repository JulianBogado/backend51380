const addProductForm = document.getElementById("product-form");
const addProductFormRealtime = document.getElementById("product-form-realtime");
const productListContainer = document.getElementById("product_list");

function deleteProductWithSocket(id) {
  socket.emit("product:delete", id);
}

try {
  socket.on("connect", () => {
    console.log("Conexion establecida con el servidor");
  });

  socket.on("product:created", (product) => {
    const li = `
    <li class="list-group-item d-flex justify-content-between align-items-center" id="{{this.id}}">
    <div class="d-flex align-items-center">
            <img src="{{this.thumbnail}}" alt="" style="width: 45px; height: 45px"
      class="rounded-circle" />
      <div class="ms-3">
      <p class="fw-bold mb-1">${product.title}</p>
      <p class="text-muted mb-0">Precio: ${product.price}</p>
      <p class="text-muted mb-0">Categoría: ${product.category}</p>
      <button onclick="deleteProductWithSocket('${product.id}')">Delete</button>    </div>
    </div>
  </li>
`;
    productListContainer.innerHTML += li;
  });

  socket.on("product:deleted", (id) => {
    const li = document.getElementById(id);
    li.remove();
  });

  addProductFormRealtime.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const stockInput = document.getElementById("stock").value;
    const category = document.getElementById("category").value;
    const code = document.getElementById("code").value
    const stock = parseInt(stockInput);

    const newProduct = { title, description, price, thumbnail, stock, category, code};
    console.log(newProduct);
    socket.emit("product:create", newProduct);
    addProductFormRealtime.reset();
  });
} catch (error) {}
