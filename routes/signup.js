/**
 * Created by richardbrash on 11/24/14.
 */

var express = require('express');
var InfusionsoftApiClient = require('../lib/InfusionsoftApiClient');

var router = express.Router();

router.get("/", function(req,res){
    res.json({Message:"Here we are"});
});

router.post("/addToGroup", function(req,res){

    var input = req.body;
    InfusionsoftApiClient.Caller("ContactService.addToGroup", [input.cid, parseInt(input.grpId)], function(error, valuegrp){
        res.json(valuegrp);
    });

});

router.post("/formhandler", function(req,res){

    var input = req.body;

    var grpid = null;
    var asid = null;
    var successUrl = null;
    var errorUrl = null;
    var clientid = null;
    var dupcheck = null;
    var groups = [];
    var posted = {};

    for(var attrib in input){

        switch(attrib){
            case "clientid":
                clientid = input[attrib];
                break;
            case "dupcheck":
                dupcheck = input[attrib];
                break;
            case "successUrl":
                successUrl = input[attrib];
                break;
            case "errorUrl":
                errorUrl = input[attrib];
                break;
            case "runaction":
                asid = input[attrib];
                break;
            case "addtogroup":
                grpid = input[attrib];
                break;
            case "groups":
                groups = input[attrib];
            default:
                posted[attrib] = input[attrib];

        }

    }

    var email = posted["Email"];
    var service = null;
    var packet = [posted];

    if(dupcheck == null){
        service = "ContactService.add";
    } else{
        service = "ContactService.addWithDupCheck";
        packet = packet.concat(dupcheck);

    }

    InfusionsoftApiClient.Caller(service, packet, function(error, value){

        if(!error){

            if(email){
                InfusionsoftApiClient.Caller("APIEmailService.optIn", [email, "Team member signup"], function(error, optin){

                    if(error){
                        console.log("Optin error:" + error);
                    } else {
                        console.log("Optin:" + optin);
                    }

                });
            }

            if(grpid != null){
                InfusionsoftApiClient.Caller("ContactService.addToGroup", [value, parseInt(grpid)], function(error, valuegrp){
                    if(error){
                        console.log("addToGroup error:" + error);
                    } else {
                        console.log("addToGroup:" + valuegrp);
                    }

                });
            }

            if(asid != null){
                InfusionsoftApiClient.Caller("ContactService.runActionSequence", [value, parseInt(asid)], function(error, valueas){

                    if(error){
                        console.log("runActionSequence error:" + error);
                    } else {
                        console.log("runActionSequence:" + valueas);
                    }

                });
            }

            if(groups.length != 0){
                for (var gid in groups) {
                    InfusionsoftApiClient.Caller("ContactService.addToGroup", [value, parseInt(groups[gid])], function(error, valuegrp){
                        if(error){
                            console.log("addToGroup error:" + error);
                        } else {
                            console.log("addToGroup:" + groups[gid] + " " + valuegrp);
                        }


                    });
                }

            }


            posted["Id"] = value;
            posted["message"] = "Data posted";

            res.json(posted);


        } else {
            res.json(error);
        }
    });

});


module.exports = router;

