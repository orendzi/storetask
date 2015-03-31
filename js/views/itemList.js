jqList.extend(jqList, 'jqList.views');

jqList.views.ItemList = (function($) {
    var _mediator = jqList.utils.mediator,
        _masking = jqList.utils.masking,
        _itemConstructor = jqList.models.Item;
            
    function ItemList (model, selector, modalView) {
        var self = this;
        self.model = model;
        // select root element for this list
        self.$el = $(selector);
        bindBehavior();
        
        function bindBehavior() {
            
            var node_searchField = $('.filter input[type=search]');

            // DELETE (btn)
            self.$el.on('click', '.del-data', function() {
                var $chosen = $(this).parents("tr"),
                    chosenIndex = $chosen.attr("data-index");
                
                _mediator.trigger('DeleteMsg:show');
                
                modalView.openWin();
                
                _mediator.on('listItemDelete:confirmed', deleteItem);
                
                function deleteItem() {
                    _mediator.off('listItemDelete:confirmed', deleteItem);
                    $chosen.fadeOut(1000).remove();
                    self.model.list.splice(chosenIndex, 1); // TODO: test this!!!
                }
            });
            
            // EDIT (btn)
            self.$el.on('click', '.edit-data', function() {
                var $chosen = $(this).parents("tr"),
                chosenIndex = $chosen.attr("data-index");
                $chosen.addClass('editing');
                $('.alert-view').addClass('hidden');
                $('.form-view').removeClass('hidden');
                modalView.openWin();
                
                _mediator.trigger('formModalView:edit', null, chosenIndex); // trigger form builder with data for item from model (arg)
            });
            
            // Sort
            self.$el.parent().find('.sortable').on('click', function(e) {
                var sortArea = $(e.target),
                    sortOrder = sortArea.attr('data-order'),
                    sortKey = sortArea.text().toLowerCase();
                    
                    // TODO: rewrite a bit shorter... =)
                    if(sortOrder == 'asc') {
                        sortOrder = 'desc';
                        sortArea.attr('data-order', sortOrder);
                        sortArea.removeClass('asc');
                        sortArea.addClass('desc');
                        self.model.sortList(sortKey, sortOrder);
                    } else if (sortOrder == 'desc') {
                        sortOrder = 'asc';
                        sortArea.attr('data-order', sortOrder);
                        sortArea.removeClass('desc');
                        sortArea.addClass('asc');
                        self.model.sortList(sortKey, sortOrder);
                    }
                
                self.render(model.list);
            });
            
            // Filter autocomplete
            node_searchField.autocomplete({
                source: model.cachedSearch
            });
            // Filter
            $('button[name=search]').on('click', filterItems);
            // Or use onsearch event ?
            node_searchField.on('keyup', function(e) {
                if(e.keyCode == 13) { // on enter key
                    filterItems();
                }
            });
            
            // Filter fn
            
            function filterItems () {
                // TODO: search on 3 letters.
                var filter = node_searchField.val().toLowerCase(),
                    error;
                    
                model.searchTerm = filter;
                model.cachedSearch.push(filter);

                if ($('.search-error')) {
                    $('.search-error').remove();
                }
                node_searchField.removeClass('error');
                
                if (!model.searchTerm) {
                    self.render(model.list);
                } else {
                    var selection = filterList(model.list, model.searchTerm);
                    self.render(selection);
                }
                
                function filterList(list, filter) {
                    var items = [];
                    for (var i=0; i<list.length; i++) {
                        var current = list[i].data.name;
                        if (current.toLowerCase().indexOf(filter) != -1) {
                            items.push(list[i]);
                        }
                    }
                    if (!items.length) {
                        node_searchField.addClass('error');
                        error = $('table').append('<p class="error search-error">Sorry, no items found. Change your filter, please.</p>');
                    }
                    
                    return items;
                }
            }

            
            // READ
            self.$el.on('click', 'a', function(event) {
                event.preventDefault();
                var $chosen = $(this).parents("tr"),
                chosenIndex = $chosen.attr("data-index");
                
                $('.alert-view').addClass('hidden');
                $('.form-view').removeClass('hidden');
                modalView.openWin();
                
                _mediator.trigger('formModalView:read', null, chosenIndex);
            });
        }
        
        // EDIT (onsubmit)
        _mediator.on('listItemEdit:submitted', function editItem(values, dataIndex) {
            var listItem = {
                        "date": values.date,
                        "name": values.name,
                        "amount": values.count,
                        "price": values.price,
                        "supplier": values.supplier
                        // TODO: "delivery": delivery
                    };
            self.model.updateItem(listItem, dataIndex);
            self.render(model.list);
            self.$el.find('.editing').hide().fadeIn(1000); 
        });
        
        // ADD
        _mediator.on('listItemAdd:submitted', function addItem(values) {
            var listItem = new _itemConstructor({
                        "date": values.date,
                        "name": values.name,
                        "amount": values.count,
                        "price": values.price,
                        "supplier": values.supplier
                        // TODO: "delivery": delivery
                    });
            self.model.addToItemList(listItem);
            self.render(model.list);
            self.$el.find('tr:last').hide().fadeIn(1000);
        });
    }

    ItemList.prototype.render = function (data) {
        var markup = [];
        for(var i=0; i<data.length; i++) {
            var current = data[i];
            markup.push(createMarkup(current, i));
        } 
        
        this.$el.html(markup);
    };
    
    // TODO: rewrite with underscore or anything else tpl - no html in js.
    function createMarkup (model, index) {
        model.data.price = _masking.maskPrice(model.data.price);
        var markup = '<tr data-index="' + index + '">'
                    + '<td>' + model.data.date + '</td>'
                    + '<td><a href="#" title="Click to see full info">' + model.data.name + '</a><span>' + model.data.amount + '</span></td>'
                    + '<td>' + model.data.price + '</td>'
                    + '<td><button class="edit-data">Edit</button><button class="del-data">Delete</button></td>'
                + '</tr>';
        model.data.price = _masking.unMaskPrice(model.data.price);
        return markup;
    }
    
    return ItemList;
    
})(jQuery);