jqList.extend(jqList, 'jqList.views');

jqList.views.Filter = (function($) {
    return function() {
        var button = $('.filter').append('<input type="search" title="Filter items by name" placeholder="Find good by name"><button type="button" name="search">Search</button>');
    };
})(jQuery);