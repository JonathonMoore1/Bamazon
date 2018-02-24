require('dotenv').config();
var pw = process.env.MYSQL_PW;

var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : pw,
    database : 'bamazon_db'
});

connection.connect(function(err) {

    // Handle errors
    if (err) throw err;

    // Welcome banner
    console.log('\n**************************************');
    console.log('\n~~ ~~ ~~ Welcome to Bamazon! ~~ ~~ ~~\n');
    console.log('**************************************\n');

    // Call function to display items in the database.
    displayItems();  
})

function displayItems() {

    // We make a query to our database, cycle through the information, extract relevant data and log it to the console.
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log('\n=============================================================================================================');
            console.log('Item #' + res[i].item_id + ': ' + res[i].product_name + ', Price: $' + res[i].price.toFixed(2) + ' (' + res[i].department_name + ')');
            console.log('=============================================================================================================\n');
        }

        //Call a function that will prompt the user to choose an item to purchase.
        selectItem();
    })  
}


function selectItem() {
    inquirer.prompt([
        {
            name: 'selection',
            type: 'input',
            message: '\nChoose an item to purchase. Please enter the item number.\n',
            validate: function (input) {
                if (isNaN(input) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many would you like to purchase?',
            validate: function (input) {
                if (isNaN(input) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (ans) {
        
        // Select the object specified by the user request.
        var query = 'SELECT * FROM products WHERE item_id = ' + ans.selection;
        connection.query(query, function (err, res) {

            // Handle errors
            if (err) throw err;
            
            // Log user input information to the console.
            console.log('\n====================================');
            console.log("Product: " + res[0].product_name + "\nPrice: $" + res[0].price.toFixed(2) + "\nQuantity desired: " + ans.quantity);
            console.log('====================================\n');

            // Store values to be passed into the next function.
            var stockQuantity = res[0].stock_quantity;
            var orderAmount = ans.quantity;
            var unitPrice = res[0].price.toFixed(2);

            // Call a function to process the order. Pass values in to be handled.
            processOrder(stockQuantity, orderAmount, unitPrice, ans.selection);
        })    
    })
}

function processOrder(a, b, c, d) {
    
    // Check to make sure quantity did not exceed stock.
    if (a < b) {
        console.log('Insufficient quantity. Please choose again.');
        return false;
    } 

    var stockUpdate = a - b;
    var total = b * c;

    // Query to update our database
    var query = 'UPDATE products SET ? WHERE ?'
    connection.query(query, [{stock_quantity: stockUpdate}, {item_id: d}], function(err, res) {

        // Handle errors.
        if (err) throw err;
        console.log(res);

        // Display total after making query.
        displayTotal(total);
    })
    
    // End MySQL connection.
    connection.end();
}

function displayTotal(val) {
    console.log('\n*** Total = $' + val + ' ***\n\nThank you for your purchase!');
    return;
}
// :)