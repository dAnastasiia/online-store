const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector("[name=id]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");

  fetch(`/admin/product/${productId}`, {
    method: "DELETE",
    headers: {
      "x-csrf-token": csrf,
    },
  })
    .then((result) => result.json())
    .then((data) => {
      productElement.parentNode.removeChild(productElement);
      return data;
    }) // * on success deletion remove element from DOM
    .catch((err) => console.log(err));
};
