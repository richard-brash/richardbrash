/**
 * Created by richardbrash on 11/24/14.
 */
/**
 * Created by richardbrash on 11/20/14.
 */

var xmlrpc = require('xmlrpc');
var config = require('Config');

function InfusionsoftApiClient(){

    this.Caller = function(service, input, callback){

        var client = xmlrpc.createSecureClient('https://' + config.AppName + '.infusionsoft.com/api/xmlrpc');

        var data = [config.ApiKey].concat(input);

        client.methodCall(service, data, function(error, value){
            if(!error){
                callback(null, value);

            } else {
                callback(error, null);
            }
        });

    }

}



module.exports = new InfusionsoftApiClient();