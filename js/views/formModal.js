jqList.extend(jqList, 'jqList.views');

jqList.views.FormModal = (function($) {
    var _mediator = jqList.utils.mediator,
        _masking = jqList.utils.masking;
    
    function FormModal (model, selector, list, modalView) {
        // get value, clear value, submit method, create markup
        var self = this;
        
        self.dataIndex = null;
        self.model = model;
        self.$el = $(selector);
        
        // First, we subscribe on event formModalView:edit
        // Edit existing elem (part2)
        _mediator.on('formModalView:edit', function (dataIndex) {
            self.model = list.list[dataIndex];
            self.render('edit');
            self.dataIndex = dataIndex;
            pasteValues(self.model.data);
        });
        
        _mediator.on('formModalView:read', function (dataIndex) {
            self.model = list.list[dataIndex];
            self.render('read', self.model);
        });
        
        bindBehavior();
        
        _mediator.on('addBtn:clicked', function () {
            self.render('add');
            $('.alert-view').addClass('hidden');
            $('.form-view').removeClass('hidden');
            modalView.openWin();
        });
        
        function bindBehavior() {
            // Close the window
            self.$el.on('click', '.close', function() {
                modalView.closeWin();
            });
            
            // Create / edit elem (+validation) TODO: validation works incorrect.
            self.$el.on('click', 'input[type=submit]', function() {
                var fields = $('.form-field').toArray(),
                    node_submitBtn = $('input[type=submit]'),
                    check = [], valid, values;

                for (var i = 0; i<fields.length; i++) {
                    var current = $(fields[i]);
                    check.push(validateField(current));
                    if (check[i] !== true) {
                        if (current.parent('div').children('p.error').length == 0) {
                            current.parent('div').append('<p class="error">' + check[i] + '</p>');
                        }
                        current.addClass('error');
                        current.effect( "shake", { distance: 5, times: 1 }, 800 );
                        valid = false;
                    } 
                }

                if (valid == false) {
                    if (node_submitBtn.next('p.error').length == 0) {
                        node_submitBtn.parent().append('<p class="error">Please check the fields.</p>');
                    }
                } else {
                    if (self.dataIndex) {
                        values = getValues();
                        values.price = _masking.unMaskPrice(values.price);
                        _mediator.trigger('listItemEdit:submitted', null, values, self.dataIndex); 
                    } else {
                        values = getValues();
                        values.price = _masking.unMaskPrice(values.price);
                        _mediator.trigger('listItemAdd:submitted', null, values);
                    }
                    
                    modalView.closeWin();
                    
                    clearValues();
                }
            });
            
            self.$el.on('focusin', '.form-field', function() {
                var _this = $(this);

                if (_this.hasClass('error')) {
                    var errorMsgHolder = _this.parent().find('p.error');
                    errorMsgHolder.css('color', '#aaa');
                    _this.removeClass('error');
                }
            });
            
            self.$el.on('focusout', '.form-field:not([name=calendar])', validateCallback);
            self.$el.on('change', '.form-field[name=calendar]', validateCallback);
            
            self.$el.on('focusout', 'input[name=price]', function() {
                var $this = $(this),
                    maskedVal = _masking.maskPrice($this.val());
                $this.val(maskedVal);
            });
            self.$el.on('focusin', 'input[name=price]', function(e){
                var $this = $(this),
                    unmaskedVal = _masking.unMaskPrice($this.val());
                if ($this) {
                    $this.val(unmaskedVal);
                }
            });
        }
        
        // Get values from the form
        function getValues() {
            var data;
            return data = {
                    date: self.$el.find('input[name=calendar]').val(),
                    name: self.$el.find('input[name=goodName]').val(),
                    supplier: self.$el.find('input[name=supplier]').val(),
                    count: self.$el.find('input[name=count]').val(),
                    price: self.$el.find('input[name=price]').val()
                };
        }
        
        // Paste values to the form (for edit)
        function pasteValues(data) {
            self.$el.find('input[name=calendar]').val(data.date);
            self.$el.find('input[name=goodName]').val(data.name);
            self.$el.find('input[name=supplier]').val(data.supplier);
            self.$el.find('input[name=count]').val(data.amount);
            self.$el.find('input[name=price]').val(data.price);
        }
        
        // Clear the form
        function clearValues() {
            self.$el.find('input[name=calendar]').val(" ");
            self.$el.find('input[name=goodName]').val(" ");
            self.$el.find('input[name=supplier]').val(" ");
            self.$el.find('input[name=count]').val(" ");
            self.$el.find('input[name=price]').val(" ");
            self.dataIndex = null;
        }
    }
    
    FormModal.prototype.render = function (context, model) {
        var markup;
        if (context == 'read') {
            markup = '<div class="header-holder clearfix">'
                        +'<h3>Good info</h3>'
                        +'<button class="close" title="Close">&times;</button>'
                        +'</div>'
                        +'<table>'
                        +'<tr><td>Date:</td><td>' + model.data.date + '</td></tr>'
                        +'<tr><td>Name:</td><td>' + model.data.name + '</td></tr>'
                        +'<tr><td>Supplier email:</td><td>' + model.data.supplier + '</td></tr>'
                        +'<tr><td>Count:</td><td>' + model.data.amount + '</td></tr>'
                        +'<tr><td>Price:</td><td>' + model.data.price + '</td></tr></table>';
        } else if (context == 'edit' || context == 'add') {
            markup = '<div class="header-holder clearfix">'
                    +'<h3>Add or edit data</h3>'
                    +'<button class="close" title="Close">&times;</button>'
                    +'</div>'
                    +'<form class="clearfix">'
                        +'<div>'
                            +'<label>Date</label>'
                            +'<input class="form-field calendar" title="Sales date" id="datepicker" type="text" name="calendar" value="" placeholder="01/01/2015">'
                        +'</div>'
                        +'<div>'
                            +'<label>Name</label>'
                            +'<input class="form-field" type="text" data-max-length="15" title="Good name" name="goodName" value="" placeholder="Good name" required>'
                        +'</div>'
                        +'<div>'
                            +'<label>Supplier email</label>'
                            +'<input class="form-field" type="email" title="Email" name="supplier" value="" placeholder="supplier@gmail.com">'
                        +'</div>'
                        +'<div>'
                            +'<label>Count</label>'
                            +'<input class="form-field" type="text" title="Numbers only" name="count" value="" placeholder="0">'
                        +'</div>'
                        +'<div>'
                            +'<label>Price</label>'
                            +'<input class="form-field" type="text" maxlength="10" data-max-length="14" title="Numbers only" pattern="^\d+(\.|\,)\d{2}$" name="price" value="" placeholder="$5">'
                        +'</div>'
                        // TODO! dropdown: http://codepen.io/ElmahdiMahmoud/pen/hlmri
                        // +'<div>'
                        //     +'<label>Delivery</label>'
                        //     +'<dl class="dropdown">'
                        //         +'<dt>Select</dt>'
                        //         +'<dd>'
                        //             +'<ul>'
                        //                 +'<li><input type="radio" id="delivery-air" name="delivery" value="Air"><label for="delivery-air">Air</label></li>'
                        //                 +'<li><input type="radio" id="delivery-ship" name="delivery" value="Ship"><label for="delivery-ship">Ship</label></li>'
                        //                 +'<li><input type="radio" id="delivery-train" name="delivery" value="Train"><label for="delivery-train">Train</label></li>'
                        //             +'</ul>'
                        //         +'</dd>'
                        //     +'</dl>'
                        // +'</div>'
                    +'</form>'
                    +'<input type="submit" value="Add / Edit" title="Submit">';
        }
        
        this.$el.html(markup);
        this.$el.find('#datepicker').datepicker();
    };
    
    // Validate
    function validateField(field) {
        var _field = $(field),
            fieldVal = _field.val(),
            fieldName = _field.attr('name'),
            errorMsg = undefined,
            isValid;
           
        if (fieldName == 'calendar') {
            checkField(isEmpty);
        } else if (fieldName == 'goodName') {
            checkField(isEmpty, exceedsMaxLength);
        } else if (fieldName == 'supplier') {
            checkField(isEmpty, isEmail);
        } else if (fieldName == 'count') {
            checkField(isEmpty, isNum);
        } else if (fieldName == 'price') {
            checkField(isEmpty, exceedsMaxLength, isNum);
        }
        
        function checkField() {
            var argArray = Array.prototype.slice.call(arguments);
            
            for (var i=0; i<argArray.length; i++) {
                var check = argArray[i]();
                if (check) {
                    isValid = check;
                } else {
                    isValid = true;
                }
            }
        }
        
        function isEmpty() {
            if (fieldVal == "" || fieldVal == " " || fieldVal.length < 1) {
                errorMsg = "(Required field)";
                return errorMsg;
            }
        }
        
        function exceedsMaxLength() {
            var num = _field.attr("data-max-length");
            if (fieldVal.length > num) {
                errorMsg = "(" + num + "symbols)";
                return errorMsg;
            }
        }
        
        function isEmail() {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var check = re.test(fieldVal);
            if (check == false) {
                errorMsg = "(Wrong email format)";
                return errorMsg;
            }
        }
        
        function isNum() {
            if (fieldVal) {
                fieldVal = fieldVal.replace(/[^0-9\.]+/g,"");
            }
            if (!$.isNumeric(fieldVal)) {
                errorMsg = "(Numbers only)";
                return errorMsg;
            }
        }
        
        return isValid;
    }
    
    // Validate focusout callback
    function validateCallback() {
        var _this = $(this),
            validation = validateField(_this);
            
        if (validation == true) {
            _this.parent('div').find('p.error').remove();
            return true;
        } else {
            if (_this.parent('div').find('p.error').length) {
                _this.effect( "shake", { distance: 5, times: 1 }, 800 );
            } else {
                var errorMsgHolder = _this.parent('div').append('<p class="error">' + validation + '</p>');
                _this.addClass('error');
                _this.effect( "shake", { distance: 5, times: 1 }, 800 );
            }
        }
    }
    
    return FormModal;
    
})(jQuery);