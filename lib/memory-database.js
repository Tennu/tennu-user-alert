var _ = require("lodash");

function add(setter, target) {
    var self = this;
    self.data.push({
        setter: setter,
        target: target
    });
}

function find(sender) {
    var self = this;
    
    return _.remove(self.data, function(pair){
        return pair.target === sender;
    });
    
}

module.exports = {
    data: [],
    add: add,
    find: find
};