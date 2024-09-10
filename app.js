const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Middleware to extract info from the HTML
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.send(
    '<body style="background-color: bisque;" ><h3>The Server is running ...</h3></body>'
  )
);

// Database connection
const connection = mysql.createConnection({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user:process.env.USER,
  password: process.env.PASSWORD,
  // port: process.env.PORT
});

// // local Database  connection
// const connection = mysql.createConnection({
//   user: "customers",
//   password: "BPN.TN@L2w[U!9zE",
//   host: "localhost",
//   database: "customers",
//   port: 3306,
// });

connection.connect((err) => {
  if (err) console.log(err);
  console.log("Connected to MySQL");
});

// ************************************* //
// ************************************* //
// Route to create tables
// app.get("/create-table", (req, res) => {
//   let name = `CREATE TABLE if not exists customers(customer_id int auto_increment, name VARCHAR(255) not null, PRIMARY KEY (customer_id))`;

//   let address = `CREATE TABLE if not exists address(address_id int auto_increment, customer_id int(11) not null, address VARCHAR(255) not null, PRIMARY KEY (address_id), FOREIGN KEY (customer_id) REFERENCES customers (customer_id))`;

//   let company = `CREATE TABLE if not exists company(company_id int auto_increment, customer_id int(11) not null, company VARCHAR(255) not null, PRIMARY KEY (company_id), FOREIGN KEY (customer_id) REFERENCES customers (customer_id))`;

//   connection.query(name, (err, results) => {
//     if (err) console.log(`Error Found: ${err}`);
//   });

//   connection.query(address, (err, results) => {
//     if (err) console.log(`Error Found: ${err}`);
//   });

//   connection.query(company, (err, results) => {
//     if (err) console.log(`Error Found: ${err}`);
//   });

//   res.end("Tables Created");
//   console.log("Tables Created");
// });
// ************or************************* //
// ************************************* //

app.get("/install", (req, res) => {
  let name = `CREATE TABLE if not exists customers(
      customer_id int auto_increment, 
      name VARCHAR(255) not null, 
      PRIMARY KEY (customer_id)
  )`;

  let address = `CREATE TABLE if not exists address(
      address_id int auto_increment, 
      customer_id int(11) not null, 
      address VARCHAR(255) not null, 
      PRIMARY KEY (address_id), 
      FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
  )`;

  let email = `CREATE TABLE if not exists email(
    email_id int auto_increment, 
    customer_id int(11) not null, 
    email VARCHAR(255) not null, 
    PRIMARY KEY (email_id), 
    FOREIGN KEY (customer_id) REFERENCES customers (customer_id)


)`;
  let Phonenumber = `CREATE TABLE if not exists phonenumber(
  phonenumber_id int auto_increment, 
  customer_id int(11) not null, 
  phonenumber VARCHAR(255) not null, 
  PRIMARY KEY (phonenumber_id), 
  FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
)`;

  let company = `CREATE TABLE if not exists company(
      company_id int auto_increment, 
      customer_id int(11) not null, 
      company VARCHAR(255) not null,
      PRIMARY KEY (company_id), 
      FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
  )`;

  connection.query(name, (err) => {
    if (err) {
      console.log(`Error Found: ${err}`);
      return res.status(500).send("Error creating customers table.");
    }
    console.log("Customer name table created");
  });

  connection.query(address, (err) => {
    if (err) {
      console.log(`Error Found: ${err}`);
      return res.status(500).send("Error creating address table.");
    }
    console.log("Address table created");

    connection.query(email, (err) => {
      if (err) {
        console.log(`Error Found: ${err}`);
        return res.status(500).send("Error creating email table.");
      }
      console.log("Email table created");
    });

    connection.query(Phonenumber, (err) => {
      if (err) {
        console.log(`Error Found: ${err}`);
        return res.status(500).send("Error creating Phonenumber table.");
      }
      console.log("Phonenumber table created");

      connection.query(company, (err) => {
        if (err) {
          console.log(`Error Found: ${err}`);
          return res.status(500).send("Error creating company table.");
        }
        console.log("Company table created");

        // If all queries are successful, send the response
        console.log("All Tables Created");
        res.status(200).send("Tables Created Successfully");
      });
    });
  });
});

// ************************************* //
// ************************************* //
// Route to insert customer information
app.post("/insert-customers-info", (req, res) => {
  const { name, address, company, email, phonenumber } = req.body;

  let insertName = `INSERT INTO customers (name) VALUES ('${name}')`;

  connection.query(insertName, (err) => {
    if (err) console.log(`Error Found: ${err}`);
  });
console.log(req.body);


  connection.query(
    `SELECT * FROM customers WHERE name = "${name}"`,
    (err, rows) => {
      let nameAdded_id = rows[0].customer_id;

      let insertAddress = `INSERT INTO address (customer_id,address) VALUES ("${nameAdded_id}", "${address}")`;

      connection.query(insertAddress, (err) => {
        if (err) console.log(`Error Found: ${err}`);
      });

      let insertEmail = `INSERT INTO email (customer_id,email) VALUES ("${nameAdded_id}", "${email}")`;

      connection.query(insertEmail, (err) => {
        if (err) console.log(`Error Found: ${err}`);
      });

      let insertPhonenumber = `INSERT INTO phonenumber (customer_id,phonenumber) VALUES ("${nameAdded_id}", "${phonenumber}")`;

      connection.query(insertPhonenumber, (err) => {
        if (err) console.log(`Error Found: ${err}`);
      });

      let insertCompany = `INSERT INTO company (customer_id,company) VALUES ("${nameAdded_id}", "${company}")`;

      connection.query(insertCompany, (err) => {
        if (err) console.log(`Error Found: ${err}`);
      });
    }
  );
  res.status = 200;
  res.end("Data inserted to tables");
  console.log("Data inserted to tables");
});
// ************************************* //

// ************************************* //
//* Route to retrieve all customer data
app.get("/customers", (req, res) => {
  connection.query(
    "SELECT customers.customer_id AS ID, customers.name, email.email,phonenumber.phonenumber, address.address, company.company FROM customers JOIN address ON customers.customer_id = address.customer_id JOIN company ON customers.customer_id = company.customer_id JOIN email ON customers.customer_id = email.customer_id JOIN phonenumber ON customers.customer_id = phonenumber.customer_id",

    (err, results) => {
      if (err) console.log("Error During selection", err);
      res.send(results);
    }
  );
});

// SELECT
//     customers.customer_id AS ID,
//     customers.name,
//     email.email,
//     phonenumber.phonenumber,
//     address.address,
//     company.company
// FROM
//     customers
// JOIN
//     address ON customers.customer_id = address.customer_id
// JOIN
//     company ON customers.customer_id = company.customer_id
// JOIN
//     email ON customers.customer_id = email.customer_id
// JOIN
//     phonenumber ON customers.customer_id = phonenumber.customer_id;

// ************************************* /

// ************************************** //
//* Route to retrieve a customer by ID

app.get("/customers/:id", (req, res) => {
  connection.query(
    `SELECT customers.customer_id AS ID, customers.name FROM customers WHERE customers.customer_id = ${req.params.id}`,
    (err, customerResults) => {
      if (err) console.log("Error During selection", err);

      connection.query(
        `SELECT address.address FROM address WHERE address.customer_id = ${req.params.id}`,
        (err, addressResults) => {
          if (err) console.log("Error During selection", err);

          connection.query(
            `SELECT email.email FROM email WHERE email.customer_id = ${req.params.id}`,
            (err, emailResults) => {
              if (err) console.log("Error During selection", err);

              connection.query(
                `SELECT phonenumber.phonenumber FROM phonenumber WHERE phonenumber.customer_id = ${req.params.id}`,
                (err, PhonenumberResults) => {
                  if (err) console.log("Error During selection", err);

                  connection.query(
                    `SELECT company.company FROM company WHERE company.customer_id = ${req.params.id}`,
                    (err, companyResults) => {
                      if (err) console.log("Error During selection", err);
                      res.send({
                        id: customerResults[0]?.ID,
                        name: customerResults[0]?.name,
                        address: addressResults[0]?.address,
                        email: emailResults[0]?.email,
                        phonenumber: PhonenumberResults[0]?.phonenumber,
                        company: companyResults[0]?.company,
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});
// ************************************* //

// ************************************* //
//* Route to update a customer's name
app.put("/update", (req, res) => {
  const { newName, newEmail, newPhonenumber, newAddress, newCompany, id } =
    req.body;

  // Start transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error starting transaction.");
    }
  });
  //* Update customers table
  let updateCustomerQuery = `
      UPDATE customers
      SET name = ?
      WHERE customer_id = ?;
    `;


  connection.query(updateCustomerQuery, [newName, id], (err, result) => {
    if (err) {
      return connection.rollback(() => {
        console.error(err);
        res.status(500).send("Error updating customer name.");
      });
    }

    //* Update address table
    let updateAddressQuery = `
        UPDATE address
        SET address = '${newAddress}'
        WHERE customer_id = '${id}';
      `;

    connection.query(updateAddressQuery, (err, result) => {
      if (err) {
        return connection.rollback(() => {
          console.error(err);
          res.status(500).send("Error updating address.");
        });
      }
      //* Update Email table
      let updateEmailQuery = `
        UPDATE email
        SET email = '${newEmail}'
        WHERE customer_id = '${id}';
      `;

      connection.query(updateEmailQuery, (err, result) => {
        if (err) {
          return connection.rollback(() => {
            console.error(err);
            res.status(500).send("Error updating Email.");
          });
        }
        //* Update Phonenumber table
        let updatePhonenumberQuery = `
        UPDATE phonenumber
        SET phonenumber = '${newPhonenumber}'
        WHERE customer_id = '${id}';
      `;

        connection.query(updatePhonenumberQuery, (err, result) => {
          if (err) {
            return connection.rollback(() => {
              console.error(err);
              res.status(500).send("Error updating Phonenumber.");
            });
          }

          //* Update company table
          let updateCompanyQuery = `
          UPDATE company
          SET company = ?
          WHERE customer_id = ?;
        `;

          connection.query(
            updateCompanyQuery,
            [newCompany, id],
            (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  console.error(err);
                  res.status(500).send("Error updating company.");
                });
              }

              //* Commit transaction
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    console.error(err);
                    res.status(500).send("Error committing transaction.");
                  });
                }

                console.log("Transaction Complete.");
                res.status(200);
                res.send("Customer updated successfully!");
              });
            }
          );
        });
      });
    });
  });
});
// ************************************* //

// ************************************* //
//* Route to delete a customer
app.delete("/remove-user", (req, res) => {
  const { id } = req.body;
  let removeName = `DELETE FROM customers WHERE customer_id = '${id}'`;
  let removeAddress = `DELETE FROM address WHERE customer_id = '${id}'`;
  let removeEmail = `DELETE FROM email WHERE customer_id = '${id}'`;
  let removePhonenumber = `DELETE FROM phonenumber WHERE customer_id = '${id}'`;
  let removeCompany = `DELETE FROM company WHERE customer_id = '${id}'`;

  connection.query(removeAddress, (err, result) => {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) Deleted from Address");
  });

  connection.query(removeCompany, (err, result) => {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) Deleted from Company");
  });
  connection.query(removeEmail, (err, result) => {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) Deleted from Email");
  });
  connection.query(removePhonenumber, (err, result) => {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) Deleted from Phonenumber");
  });

  connection.query(removeName, (err, result) => {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) Deleted from Customer");
  });

  res.send("Customer deleted");
});
// ************************************* //
//* or To retrieve all customer,address,name data from database //
//// app.get("/customers", (req, res) => {
// // const customers = `SELECT
// // customers.customer_id AS ID,
// // customers.name,
// // address.address,
// // company.company,
// // FROM customers
// // JOIN address
// // ON customers.customer_id =address.customer_id
// // JOIN company
// // ON customers.customer_id =company.customer_id`
// //  connection.query(customers,(err,results)=>{
// //   if (err) throw err;
// //   else res.send(results)
// //  })

//// })
// ************************************* //
//// * or To retrieve single customer,address,name data from database //
//// app.get("/customers/:id", (req, res) => {

//   const customers = `SELECT
//   customers.customer_id AS ID,
//   customers.name,
//   address.address,
//   company.company,
//   FROM customers
//   JOIN address
//   ON customers.customer_id =address.customer_id
//   JOIN company
//   ON customers.customer_id =company.customer_id`
//    connection.query(customers,(err,results)=>{
//     if (err) throw err;
//     else res.send(results)
//    })

////   })
// ************************************* //

// ************************************* //

const port = 2024;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
