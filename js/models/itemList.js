jqList.extend(jqList, 'jqList.models');

jqList.models.ItemList = (function($) {
    function ItemList (gridData) {
        var _itemConstructor = jqList.models.Item;

        this.list = init();
        this.searchTerm = null;
        this.cachedSearch = [];
        
        function init() {
            var list = [],
                item;
            
            for(var i=0; i<gridData.length; i++) {
                item = new _itemConstructor(gridData[i]);
                list.push(item);
            }
            return list;
        }
    };
    
    ItemList.prototype.sortList = function(key, order) {
        this.list = this.list.sort(function (a, b) {
            var first = a.data[key];
            var second = b.data[key];
            
            if(key == 'price') {
                first = parseInt(first, 10);
                second = parseInt(second, 10);
            }
            if(first < second) return -1;
            if(first > second) return 1;
            return 0; // a = b
        });
        
        if(order == 'asc') {
            return this.list;
        } else if (order == 'desc') {
            return this.list.reverse();
        }
    };
    
    ItemList.prototype.addToItemList = function (itemData) {
        return this.list.push(itemData);
    };
    
    ItemList.prototype.updateItem = function(itemData, index) {
        var obj = this.list[index].data,
            prop;
        for (prop in obj) {
            obj[prop] = itemData[prop];
        }
    };
    
    return ItemList;
})(jQuery);