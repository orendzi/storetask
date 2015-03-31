$(document).ready(function() {

    var itemsListData = new jqList.models.ItemList([
                        {
                            "date": "01/03/2015",
                            "name": "Mittens",
                            "amount": 2,
                            "price": "12534",
                            "supplier": " ",
                            "delivery": " "
                        },
                        {
                            "date": "01/04/2015",
                            "name": "Kittens",
                            "amount": 16,
                            "price": "150",
                            "supplier": " ",
                            "delivery": " "
                        },
                        {
                            "date": "01/23/2015",
                            "name": "Noodles",
                            "amount": 5,
                            "price": "100584",
                            "supplier": " ",
                            "delivery": " "
                        }
    ]);
    var formModal = new jqList.models.FormModal({
            "date": " ",
            "name": " ",
            "amount": " ",
            "price": " ",
            "supplier": " ",
            "delivery": " "
    });
    var alertMsgDelete = new jqList.models.AlertMsg({
        "title": "Are you sure?",
        "msg": "Are you sure you want to perform this action?",
        "btn1": "Yes",
        "btn2": "No"
    });

    var nameFilter = new jqList.views.Filter();
    var addBtn = new jqList.views.TableControl('addItem', 'Add item');
    
    var modalWindow = new jqList.views.ModalWindow('.modal-view-container');
    modalWindow.render();

    var itemListView = new jqList.views.ItemList(itemsListData, '.data-grid tbody', modalWindow);
    itemListView.render(itemsListData.list);

    var alertMsgDeleteView = new jqList.views.AlertMsg(alertMsgDelete, '.alert-view', modalWindow);
    var formModalView = new jqList.views.FormModal(formModal, '.form-view', itemsListData, modalWindow);
    
    // jQuery UI tooltip
    $( document ).tooltip({
        track: true
    });

}); 
