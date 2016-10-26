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
            "notice": true
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
                    var alerts = memDb.find(message.nickname);

                    if (alerts.length > 0) {
                        alerts.forEach(function(alert){
                            var message = format("At your request, we are notifying you that %s has returned.", alert.target);
                            if(alert.note){
                                message += format(" Note: ", alert.note);
                            }
                            client[alertmethod](alert.setter, message);
                        });
                    }

                },
                "!useralert": function(message) {

                    if (!message.args[0] || message.args[0].length < 1) {
                        return noticeResponse("Invalid target. Usage is: `!useralert <target>`");
                    }

                    var target = message.args[0]

                    var note = null;
                    
                    // Do we have a note?
                    if(message.args.length > 1){
                        note = message.args.slice(1, message.args.length).join(' ');
                    }

                    memDb.add(message.nickname, target, note);

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