const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector('[name="productId"]').value;
  const csrfToken = btn.parentNode.querySelector('[name="_csrf"]').value;

  fetch("products/remove/" + prodId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken,
    },
  })
    .then((response) => {
      console.log(response);
      // if (!response.ok) {
      //   // deleting failde
      //   return ;
      // }
      return response.json().then();
    })
    .then((result) => {
      const productElement = btn.closest("li");
      productElement.parentNode.removeChild(productElement);
    })
    .catch((err) => {
      console.log(err);
    });
};
