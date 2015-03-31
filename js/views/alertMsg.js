jqList.extend(jqList, 'jqList.views');  

jqList.views.AlertMsg = (function($) {
    var _mediator = jqList.utils.mediator;
    
    function AlertMsg (model, selector, modalView) {
        var self = this;
        self.model = model;
        self.$el = $(selector);
        bindBehavior();

        function bindBehavior() {
            self.$el.on('click', ('.approve'), function() {
                _mediator.trigger('listItemDelete:confirmed', null);
                modalView.closeWin();
            });
            self.$el.on('click', ('.cancel'), function() {
                modalView.closeWin();
            });
        }
        
        _mediator.on('DeleteMsg:show', function() {
            self.render();
            $('.form-view').addClass('hidden');
            $('.alert-view').removeClass('hidden');
        });
    }
    
    AlertMsg.prototype.render = function() {
        var markup = '<h3>' + this.model.data.title + '</h3>'
                    +'<p>' +this.model.data.msg + '</p>'
                    +'<button type="button" class="approve" title="Attention, this record will be deleted!">' + this.model.data.btn1 + '</button>'
                    +'<button type="button" class="cancel">' + this.model.data.btn2 + '</button>';
        this.$el.html(markup);
    };
    
    return AlertMsg;
})(jQuery);