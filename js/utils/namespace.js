var jqList = (function(){
    return {
        extend: function (ns, ns_string) {
            var parts = ns_string.split('.'),
                parent = ns,
                pl, i;
                
            ns = ns || {};
                
            // if it contains namespace name, delete it    
            if (parts[0] == "jqList") {
                parts = parts.slice(1);
            }
            pl = parts.length;
            for (i = 0; i < pl; i++) {
                //create a property if it doesnt exist
                if (typeof parent[parts[i]] == 'undefined') {
                    parent[parts[i]] = {};
                }
                parent = parent[parts[i]];
            }
            return parent;
        }
    };
})();