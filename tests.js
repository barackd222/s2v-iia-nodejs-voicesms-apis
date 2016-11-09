var myNestedJSON = {"values":[{"to":"+61449588440", "msg":"Hello world 1"}, {"to":"+61449588441", "msg":"Hello world 2"}]};

    // Point to array of values...
    var values = myNestedJSON.values;
    

    for(i = 0; i < values.length ; ++i) {

        // Get current key:
        var currentValue = values[i];

        // do something here with the value...
        console.log("Displaying current value. to is [" + currentValue.to + "], msg is [" + currentValue.msg + "]");
    }

    console.log("It is done iterating...");