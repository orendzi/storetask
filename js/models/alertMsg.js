jqList.extend(jqList, 'jqList.models');

jqList.models.AlertMsg = (function($){
    return function (data) {
        this.data = data;
    };
})(jQuery);