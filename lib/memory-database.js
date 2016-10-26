var _ = require("lodash");

function add(setter, target, note) {
    var self = this;
    self.data.push({
        setter: setter,
        target: target,
        note: note
    });
}

function find(sender) {
    var self = this;
    
    return _.remove(self.data, function(pair){
        return pair.target.toLowerCase() === sender.toLowerCase();
    });
    
}

module.exports = {
    data: [],
    add: add,
    find: find
};