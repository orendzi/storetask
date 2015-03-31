jqList.extend(jqList, 'jqList.models');

jqList.models.FormModal = (function($){
    return function (data) {
        this.data = data;
    };
})(jQuery);