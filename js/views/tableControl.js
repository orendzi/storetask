jqList.extend(jqList, 'jqList.views');

jqList.views.TableControl = (function($){
    var _mediator = jqList.utils.mediator;
    
    return function(btnName, label) {
        var button = $('.controls').append('<button>' + label + '</button>').find('button').attr('name', btnName);
        
        // Add elem to list
        $('button[name=addItem]').on('click', function() {
            _mediator.trigger('addBtn:clicked');
        });
    };
})(jQuery);