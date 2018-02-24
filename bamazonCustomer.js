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
    if (err) throw err;
    console.log('\n**************************************');
    console.log('\n~~ ~~ ~~ Welcome to Bamazon! ~~ ~~ ~~\n');
    console.log('**************************************\n');
    displayItems();  
})

function displayItems() {

    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log('\n=============================================================================================================');
            console.log('Item #' + res[i].item_id + ': ' + res[i].product_name + ', Price: $' + res[i].price.toFixed(2) + ' (' + res[i].department_name + ')');
            console.log('=============================================================================================================\n');
        }
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
        console.log(ans.selection);
        var query = 'SELECT * FROM products WHERE item_id = ' + ans.selection;
        connection.query(query, function (err, res) {
            if (err) throw err;

            var choice = "Product: " + res[0].product_name + " || Price: $" + res[0].price.toFixed(2);
            console.log(choice);

            var stockQuantity = res[0].stock_quantity;
            var orderAmount = ans.quantity;
            var unitPrice = res[0].price.toFixed(2);

            console.log(stockQuantity + "\n" + orderAmount);

            processOrder(stockQuantity, orderAmount, unitPrice, ans.selected);

        })
        
    })
}

function processOrder(a, b, c, d) {
    
    if (a < b) {
        console.log('Insufficient quantity. Please choose again.');
        return false;
    } 

    var stockUpdate = a - b;
    var total = b * c;

    var query = 'UPDATE products SET ? WHERE ?'
    connection.query(query, [{stock_quantity: stockUpdate}, {item_id: d}], function(err, res) {
        if (err) throw err;
        console.log(res);
        displayTotal(total);
    })
    
    connection.end();
}

function displayTotal(val) {
    console.log('*** Total = $' + val + ' ***\nThank you for your purchase!');
}