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
});

function displayItems() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log('\n=============================================================================================================');
            console.log('Item #' + res[i].item_id + ': ' + res[i].product_name + ', Price: $' + res[i].price.toFixed(2) + ' (' + res[i].department_name + ')');
            console.log('=============================================================================================================\n');
        }
    }).then(function() {
        inquirer.prompt({
            name:'selectedItem',
            type: 'input',
            message: 'Choose an item to purchase by selecting an item number',
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }).then(function(ans) {
            var item = ans.selectedItem;
            console.log(item);
        })
    })
}

displayItems();

// inquirer.prompt({
//     name: 'which', 
//     type: 'input', 
//     message: 'Which of these items would you like to purchase? Please enter the item number.\n',
//     validate: function (input) {
//         if (isNaN(input) === false) {
//             return true;
//         }
//         return false;
//     }
// }).then(function(ans) {
//     connection.query('SELECT * FROM products WHERE item_id = ?', {item_id: ans}, function(err, res) {
//         if (err) throw err;
//         console.log(res);
//     })
// })

// function selectItem() {
   
// }

// function start() {
//     displayItems();
// }
// start();

// selectItem();
connection.end();