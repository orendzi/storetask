jqList.extend(jqList, 'jqList.views');

jqList.views.ModalWindow = (function($) {
    function ModalWindow (selector) {
        var self = this;
        self.$el = $(selector);
    };
    
    ModalWindow.prototype.render = function() {
        var markup = '<section class="modal-overlay hidden">'
                    + '<div class="modal-content clearfix">'
                    + '<div class="alert-view"></div>'
                    + '<div class="form-view"></div>'
                    + '</div>'
                    + '</section>';
        this.$el.html(markup);
    };
    
    ModalWindow.prototype.openWin = function() {
        this.$el.find('.modal-overlay').fadeIn(500);
        this.$el.find('.modal-content').show();
    };
    
    ModalWindow.prototype.closeWin = function() {
        this.$el.find('.modal-overlay').hide();
        this.$el.find('.modal-content').fadeOut(200);
    };
    
    return ModalWindow;
})(jQuery);