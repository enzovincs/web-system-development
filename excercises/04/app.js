const { useState } = React;

function App() {

  const products = [
    { name: "Camiseta", price: 15 },
    { name: "Pantalones", price: 30 },
    { name: "Zapatillas", price: 50 },
    { name: "Calcetines", price: 7 }
  ];


  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);


  const productElements = products.map((product, index) =>
    React.createElement(
      "div",
      { className: "product", key: index },
      React.createElement(
        "span",
        null,
        product.name + " - " + product.price + "€"
      ),
      React.createElement(
        "button",
        {
          "data-testid": "add-" + index,
          onClick: () => addToCart(product)
        },
        "Add"
      )
    )
  );

  const cartElements = cart.map((item, index) =>
    React.createElement(
      "div",
      {
        className: "cart-item",
        key: index,
        "data-testid": "cart-item-" + index
      },
      React.createElement(
        "span",
        null,
        item.name + " - " + item.price + "€"
      ),
      React.createElement(
        "button",
        {
          "data-testid": "remove-" + index,
          onClick: () => removeFromCart(index)
        },
        "Remove"
      )
    )
  );

  const productsBox = React.createElement(
    "div",
    { className: "box" },
    React.createElement("h2", null, "Products"),
    ...productElements
  );

  const cartChildren = [
    React.createElement("h2", null, "Cart"),
    cart.length === 0
      ? React.createElement("p", null, "Cart is empty")
      : null,
    ...cartElements,
    React.createElement(
      "span",
      { id: "cart-total", "data-testid": "cart-total" },
      "Total: " + total + "€"
    )
  ];

  const cartBox = React.createElement("div", { className: "box" }, ...cartChildren);

  return React.createElement(
    "div",
    { className: "container" },
    productsBox,
    cartBox
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));