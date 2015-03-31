jqList.extend(jqList, 'jqList.models');

jqList.models.Item = (function($) {
    return function (itemData) {
        this.data = itemData;
    };
})(jQuery);