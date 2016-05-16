var format = require("util").format;

var noticeResponse = function(msg) {
    return {
        intent: 'notice',
        query: true,
        message: msg
    };
}

var TennuUserAlert = {
    configDefaults: {
        "user-alert": {
            "notice": false
        }
    },    
    init: function(client) {

        const helps = {
            "useralert": [
                "{{!}}useralert <target>",
                "Alerts a user when another user talks in the channel."
            ]
        };

        var memDb = require("./lib/memory-database");
        var userAlertConfig = client.config("user-alert");
        
        var alertmethod = "";
        if(userAlertConfig.notice){
            alertmethod = "notice";
        } else {
            alertmethod = "say";
        }

        return {
            handlers: {
                "privmsg": function(message) {
                    var targets = memDb.find(message.nickname);

                    if (targets.length > 0) {
                        targets.forEach(function(target){
                            client[alertmethod](target.setter, format("At your request, we are notifying you that %s has returned.", target.target));
                        });
                    }

                },
                "!useralert": function(message) {

                    if (!message.args[0] || message.args[0].length < 1) {
                        return noticeResponse("Invalid target. Usage is: `!useralert <target>`");
                    }

                    var target = message.args[0]

                    memDb.add(message.nickname, target);

                    return noticeResponse(format("We will ping you when %s talks next.", target));

                },
            },

            help: {
                "useralert": helps.useralert
            },

            commands: ["useralert"],

            testExports: {
                memDb: memDb
            }
        }
    }
};

module.exports = TennuUserAlert;