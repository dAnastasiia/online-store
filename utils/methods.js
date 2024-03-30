exports.createInvoice = (doc, order) => {
  doc.fontSize(20).text(`Invoice #${order._id}`, 100, 50);

  let yPos = 100;

  let totalPrice = 0;

  // Loop through products and add to the invoice
  order.products.forEach(({ product: { title, price }, quantity }) => {
    totalPrice += quantity * price;
    doc
      .fontSize(14)
      .text(`Product: ${title}`, 100, yPos)
      .text(`Quantity: ${quantity}`, 100, yPos + 20)
      .text(`Price: $${price}`, 100, yPos + 40);
    yPos += 70;
  });

  // Add total to the invoice
  doc.fontSize(16).text(`Total: $${totalPrice}`, 100, yPos + 50);
};
