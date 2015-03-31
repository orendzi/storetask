jqList.extend(jqList, 'jqList.utils');

jqList.utils.masking = {
    // Masking
    maskPrice: function (value) {
        // var validation = validateField(input);
        value = value.replace(/[^0-9\.]+/g,"");
        
        var valueLength = value.length,
            lastNum = valueLength,
            classArray = [],
            substring,
            rule;

            if (!valueLength) {
                return 0;
            } else if (valueLength <= 3) {
                rule = 1;
            } else if (valueLength > 3 && valueLength <= 6) {
                rule = 2;
            } else if (valueLength > 6 && valueLength <= 9) {
                rule = 3;
            } else {
                rule = 4;
            }
            
        for (var i = 0; i<rule; i++) {    
            if (valueLength >= 3) {
                substring = value.substr(lastNum - 3, lastNum); 
                classArray.push(substring);
                var filter = new RegExp(substring);
                value = value.replace(filter, '');
                valueLength = value.length;
                lastNum = valueLength;
            } else {
                classArray.push(value);
            }
        }
        
        var classifiedNum = classArray.reverse().join(",");
        var currency = "$" + classifiedNum;
        return currency;
    },
    
    // Unmasking
    unMaskPrice: function (value) {
        // var validation = validateField(input);
        value = value.replace(/[^0-9\.]+/g,"");
        return value;
    }
};