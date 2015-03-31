jqList.extend(jqList, 'jqList.utils');

jqList.utils.mediator = {
    _eventStore: { 
                    // eventName: [func1, func2] it will be like that.
                 },
    on: function(eventName, callback) {
        if(!this._eventStore[eventName]) {
            this._eventStore[eventName] = [];
        } 
        this._eventStore[eventName].push(callback);
    },
    trigger: function(eventName, context) {
        var event = this._eventStore[eventName];
        if(event) {
            var argArray = Array.prototype.slice.call(arguments);
            argArray.splice(0, 2);
            context = context || window;

            for(var i=0, func; i<event.length; i++) {
                func = event[i];
                func.apply(context, argArray);
            }
        }
    },
    off: function(eventName, callback) {
        var event = this._eventStore[eventName];
        if(event) {
            for(var i=0, current; i<event.length; i++) {
                current = event[i];
                if(current === callback) {
                    event.splice(i, 1);
                    break;
                }
            }
        }
    }
};
