// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");

// Create an Express app
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Configure your PostgreSQL connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "EstimateAPP",
  password: "fl123",
  port: 5432,
});

// Connect to the PostgreSQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err);
  } else {
    console.log("Connected to PostgreSQL");
  }
});

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET home page
// Other routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/invoice", (req, res) => {
  res.render("invoice.ejs");
});

// Display Clients get name and id
app.get("/client", async (req, res) => {
  try {
    // Fetch client data including id and name
    const result = await db.query(
      "SELECT id, name, phone_mobile, email, phone_other, address, address2, city, zip_code, state, note FROM client_contact"
    );
    const clients = result.rows;
    // console.log("Fetched clients: ", clients);
    res.render("client.ejs", { clients: clients });
  } catch (error) {
    console.error("Error fetching clients: ", error);
    res.redirect("/error"); // Redirect to an error page
  }
});

//Display client EDIT content

// Display Items name
app.get("/item", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, item_name, description, rate, taxes FROM item_hvac"
    );
    const item = result.rows;
    console.log(item);
    res.render("item.ejs", { item: item });
  } catch (error) {
    console.error("Error fetching item: ", error);
    res.redirect("/error"); // Redirect to an error page
  }
});

// Get Item list and client List
app.get("/estimate", async (req, res) => {
  try {
    // Fetch item data
    const itemResult = await db.query(
      "SELECT id, item_name, description, rate, taxes FROM item_hvac"
    );
    const item = itemResult.rows;

    // Fetch client data
    const clientResult = await db.query(
      "SELECT id, name, phone_mobile, email, phone_other, address, address2, city, zip_code, state, note FROM client_contact"
    );
    const clients = clientResult.rows;

    res.render("estimate.ejs", { item: item, clients: clients });
  } catch (error) {
    console.error("Error fetching data for estimate: ", error);
    res.redirect("/error"); // Redirect to an error page
  }
});

// Define a route to handle the form submission
app.post("/add_client", async (req, res) => {
  const nameIp = req.body.nameIp;
  const phoneMobile = req.body.phoneMobile;
  const email = req.body.email;
  const phoneOther = req.body.phoneOther;
  const address = req.body.address;
  const address2 = req.body.address2;
  const city = req.body.city;
  const zip = req.body.zip;
  const state = req.body.state;
  const privateNote = req.body.privateNote;
  console.log(
    "name:",
    nameIp,
    "Phone:",
    phoneMobile,
    "email",
    email,
    "Phone2",
    phoneOther,
    "address",
    address,
    "address2",
    address2,
    "city",
    city,
    "zip",
    zip,
    "state",
    state,
    "Private:",
    privateNote
  );

  // Create a SQL query to insert the data into the "client_contact" table
  const query = {
    text: "INSERT INTO client_contact (name, phone_mobile, email, phone_other, address, address2, city, zip_code, state, note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    values: [
      nameIp,
      phoneMobile,
      email,
      phoneOther,
      address,
      address2,
      city,
      zip,
      state,
      privateNote,
    ],
  };
  try {
    await db.query(query);
    res.redirect("/client"); // Redirect to a success page
  } catch (error) {
    console.error("Error inserting data: ", error);
    res.redirect("/error"); // Redirect to an error page
  }
});

// POST - New Item
app.post("/add_Item", async (req, res) => {
  const item_name = req.body.item_name;
  const description = req.body.description;
  const rate = req.body.rate;
  const taxe = req.body.taxe;

  console.log(
    "item:",
    item_name,
    "description;",
    description,
    "rate",
    rate,
    "taxe:",
    taxe
  );

  // Insert Item data to PostgreSQL
  const query = {
    text: "INSERT INTO item_hvac (item_name, description, rate, taxes) VALUES ($1, $2, $3, $4)",
    values: [item_name, description, rate, taxe],
  };

  try {
    await db.query(query);
    res.redirect("/item"); // Redirect to a success page
  } catch (error) {
    console.error("Error inserting data: ", error);
    res.redirect("/error"); // Redirect to an error page
  }
});

// DELETE CLIENT
app.delete("/delete/:id", async (req, res) => {
  const clientId = req.params.id; // Get the client ID from the URL parameters

  try {
    // Create a SQL query to delete the client with the given ID
    const query = {
      text: "DELETE FROM client_contact WHERE id = $1",
      values: [clientId], // Use values to prevent SQL injection
    };

    // Execute the query
    await db.query(query);

    res.status(204).send(); // Send a success response with no content (status code 204)
  } catch (error) {
    console.error("Error deleting client: ", error);
    res.status(500).send("Error deleting client"); // Send an error response with a status code 500
  }
});

// DELETE an item by ID
app.delete("/delete/item/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    // Implement the code to delete the item with the given ID from your database
    // This might look something like this, assuming you're using PostgreSQL:
    await db.query("DELETE FROM item_hvac WHERE id = $1", [itemId]);

    // Send a success response as JSON
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting the item: ", error);
    res.status(500).json({ success: false, error: "Error deleting the item" });
  }
});

// Edit Client_contact
app.post("/edit_client", async (req, res) => {
  const nameIp = req.body.nameIp;
  const phoneMobile = req.body.phoneMobile;
  const email = req.body.email;
  const phoneOther = req.body.phoneOther;
  const address = req.body.address;
  const address2 = req.body.address2;
  const city = req.body.city;
  const zip = req.body.zip;
  const state = req.body.state;
  const privateNote = req.body.privateNote;
  const clientId = req.body.clientId;

  // Create a SQL query to update the data in the "client_contact" table
  const query = {
    text: "UPDATE  client_contact SET name = $1, phone_mobile = $2, email = $3, phone_other = $4, address = $5, address2 = $6, city = $7, zip_code = $8, state = $9, note = $10 WHERE id = $11",
    values: [
      nameIp,
      phoneMobile,
      email,
      phoneOther,
      address,
      address2,
      city,
      zip,
      state,
      privateNote,
      clientId, // Use the provided client ID to target the specific client
    ],
  };

  try {
    await db.query(query);
    res.redirect("/client"); // Redirect to a success page
  } catch (error) {
    console.error("Error Editing data: ", error);
    res.redirect("/error"); // Redirect to an error page
  }
});

// Edit Item
app.post("/edit_item", async (req, res) => {
  const item_name = req.body.item_name;
  const description = req.body.description;
  const rate = req.body.rate;
  const taxe = req.body.taxe;
  const itemId = req.body.itemId;

  // Create a SQL query to update the data in the "client_contact" table
  const query = {
    text: "UPDATE item_hvac SET item_name = $1, description = $2, rate = $3, taxes = $4 WHERE id = $5",
    values: [item_name, description, rate, taxe, itemId],
  };

  try {
    await db.query(query);
    res.redirect("/item"); // Redirect to a success page
  } catch (error) {
    console.error("Error Editing data: ", error);
    res.redirect("/error"); // Redirect to an error page
  }
});
app.post("/", async (req, res) => {});
// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
