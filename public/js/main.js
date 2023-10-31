$(document).ready(function () {
  // DELETE CLIENT - Event listener for clicking the trash icon
  $(".delete-client").click(function () {
    const clientId = $(this).data("id");

    if (confirm("Are you sure you want to delete this client?")) {
      $.ajax({
        url: "/delete/" + clientId, // Your server route to delete a client
        type: "DELETE",
        success: function () {
          // If the request is successful, remove the client from the list
          $(this).parent().remove();
        },
        error: function () {
          // Handle any errors here
          alert("Error deleting the client.");
        },
      });
    }
  });
  // Update EDIT Contact client
  $(".edit-client").on("click", function () {
    $("#edit-form-clientId").val($(this).data("id"));

    $("#edit-form-name").val($(this).data("name"));
    $("#edit-form-email").val($(this).data("email"));
    $("#edit-form-phoneMobile").val($(this).data("phone_mobile"));
    $("#edit-form-phoneOther").val($(this).data("phone2"));
    $("#edit-form-address").val($(this).data("address"));
    $("#edit-form-address2").val($(this).data("address2"));
    $("#edit-form-city").val($(this).data("city"));
    $("#edit-form-zip").val($(this).data("zip"));
    $("#edit-form-state").val($(this).data("state"));
    $("#edit-form-privateNote").val($(this).data("note"));
  });

  // Update EDIT Item
  $(".edit-item").on("click", function () {
    $("#edit-form-itemId").val($(this).data("id"));
    $("#edit-form-item_name").val($(this).data("item_name"));
    $("#edit-form-rate").val($(this).data("rate"));
    $("#edit-form-taxe").val($(this).data("taxe"));
    $("#edit-form-description").val($(this).data("description"));
  });
});

// delete Item
$(".delete-item").click(function () {
  const itemId = $(this).data("id");

  if (confirm("Are you sure you want to delete this item?")) {
    $.ajax({
      url: "/delete/item/" + itemId, // Use the correct URL
      type: "DELETE",
      success: function (response) {
        if (response.success) {
          // If the item is deleted successfully, remove it from the list
          $(this).parent().remove();
        } else {
          // Handle the case where the deletion was not successful
          alert("Error deleting the item.");
        }
      },
      error: function () {
        // Handle any errors here
        alert("Error deleting the item.");
      },
    });
  }
});

//Add Item Line to Invoice
document.addEventListener("DOMContentLoaded", function () {
  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function (item) {
    item.addEventListener("click", function () {
      // Retrieve item data from data attributes
      const item_name = item.getAttribute("data-item_name");
      const description = item.getAttribute("data-description");
      const taxe = item.getAttribute("data-taxe");
      const rate = item.getAttribute("data-rate");
      const itemId = item.getAttribute("data-id");

      // Create a new table row for the selected item
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
          <td>${item_name}<br>${description}</td>
          <td><input type="number" value="1" id="quantity-${itemId}" /></td>
          <td>${rate}</td>
          <td class="text-right" id="total-${itemId}">${rate}</td>
        `;

      // Append the new row to the table
      const table = document
        .getElementById("selected-items-table")
        .getElementsByTagName("tbody")[0];
      table.appendChild(newRow);

      // Add an event listener to the quantity input field for dynamic updates
      const quantityInput = document.getElementById(`quantity-${itemId}`);
      quantityInput.addEventListener("input", function () {
        updateTotalPrice(itemId, rate);
      });

      // Add a selected item row to the table
      // You can place the code here
      $("#selected-items-table tbody").append(selectedItemHtml);
      // Add a 'selected-item' class to the <tr> element
      $("#selected-items-table tbody .selected-item:last").addClass(
        "selected-item"
      );
      // Update the total price
      updateTotalPrice();

      // Remove the selected item row from the table
      $(this).parent().remove();
      // Update the total price
      updateTotalPrice();
    });
  });
  function updateTotalPrice() {
    const totalCell = document.getElementById("total-price");
    let total = 0.0;

    // Iterate through the selected items and calculate the overall total
    const selectedItems = document.querySelectorAll(".selected-item");
    selectedItems.forEach(function (item) {
      const rate = parseFloat(
        item.querySelector("td:nth-child(3)").textContent
      );
      const quantityInput = item.querySelector("input[type=number]");
      const quantity = parseInt(quantityInput.value);

      const itemTotal = rate * quantity;
      total += itemTotal;
    });

    // Update the total price cell with the overall total
    totalCell.textContent = total.toFixed(2);
  }

  // Call the function to initially update the total price
  updateTotalPrice();

  function updateTotalPrice(itemId, rate) {
    const quantityInput = document.getElementById(`quantity-${itemId}`);
    const totalCell = document.getElementById(`total-${itemId}`);
    const quantity = parseInt(quantityInput.value);
    const totalPrice = quantity * parseFloat(rate);

    totalCell.textContent = totalPrice.toFixed(2); // Adjust the formatting as needed
  }
});
