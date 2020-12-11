var money = 0.00;
$(document).ready(function(){
    loadItems();
})
function loadItems(){
    clearItems();
    var itemButtons = $("#itemButtons");

    $.ajax({
        type: 'GET',
        url: 'http://tsg-vending.herokuapp.com/items',
        success: function(itemArray) {
            $.each(itemArray, function(index, item){
                var id = item.id;
                var name = item.name;
                var price = item.price;
                var quantity = item.quantity;

                var box = '<div class="col-md-4"><div class ="border m-2 p-2" id="itemBox" onclick="addItem('+id+')">';
                    box += id;
                    box += '<p>'+ name + '</p>';
                    box += '<h3>$'+ price + '</h3>';
                    box += '<p>Quantity Left: ' + quantity + '</p>';
                    box += '</div></div>';
                
                    itemButtons.append(box);
            })
        
        },
        error: function() {
            handleError("Server error");
        }
    }); 
}

function addMoney(amount){
    money +=amount;
    $("#displayMoney").val(money.toFixed(2));
}
function addItem(id){
    $("#displayItem").val(id);
}
function clearItems(){
    $("#itemButtons").empty();
}
function makePurchase(){
    var id = $("#displayItem").val();

    if(id == ''){
        handleError('Please make a selection');
    } else if (money == 0){
        handleError('Please insert money');
    } else {
        $.ajax({
            type: 'POST',
            url: 'http://tsg-vending.herokuapp.com/money/' + money + '/item/' + id,
            data: '',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            'datatype': 'json',
            success: function(change){
                
                displayChange(change);
                $('#messages').val("Thank you!!!");

            },
            error: function(error){
                handleError(error.responseJSON.message);
                loadItems();
            }
        });
    }

}

function displayChange(change){
    var message = '';

    if(change.quarters > 0){
        message += change.quarters + ' Quarter(s) ';
    }

    if(change.dimes > 0){
        message += change.dimes + ' Dime(s) ';    
    }

    if(change.nickels > 0){
        message += change.nickels + ' Nickel(s) ';
    }

    if(change.pennies > 0){
        message += change.pennies + ' Penny(s) ';
        
    }
    if(message ==''){
        message = '-';
    }
    $('#change').val(message);
}

function returnChange(){
    $('#change').val('')
    $('#displayMoney').val('');
    $('#displayItem').val('');
    $('#messages').val('');
    money=0;
    loadItems();
}

function handleError(msg){
    $("#messages").val(msg); 
}