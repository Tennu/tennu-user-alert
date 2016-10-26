var should = require("should");
var format = require("util").format;

var client = {
    notice: function(target, message) {
        return;
    },
    config: function(){
        return {
            "notice": true
        };
    }
};

var plugin = require("../plugin.js").init(client);

describe('user-alert', function() {

    var usHandler = plugin.handlers["!useralert"];

    var firstSettingMessage = {
            nickname: "test123",
            args: [
                "testtarget123"
            ]
        };

    it('Should save the setter and target', function() {

        var expectedResponse = {
            intent: 'notice',
            query: true,
            message: format('We will ping you when %s talks next.', firstSettingMessage.args[0])
        }

        var response = usHandler(firstSettingMessage);

        response.should.be.eql(expectedResponse);

        plugin.testExports.memDb.data.should.containEql({
            setter: firstSettingMessage.nickname,
            target: firstSettingMessage.args[0],
            note: null
        });

    });

    it('Should remove memory item when target speaks. Case insensitive.', function() {

        var message = {
            nickname: "Testtarget123",
        };

        plugin.handlers["privmsg"](message);

        plugin.testExports.memDb.data.should.not.containEql({
            setter: firstSettingMessage.nickname,
            target: firstSettingMessage.args[0],
            note: null
        });

    });

});