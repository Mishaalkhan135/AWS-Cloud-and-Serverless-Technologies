const AWS = require("aws-sdk");
const secretsmanager = new AWS.SecretsManager();
import {randomBytes} from 'crypto';

interface Event {
    SecretId: string
    ClientRequestToken: string
    Step: 'createSecret' | 'setSecret' | 'testSecret' | 'finishSecret'
}

const secretName = process.env.SECRET_NAME || "";
const secretKey = process.env.KEY_IN_SECRET_NAME || "";

exports.handler = async (event : Event) => {

    console.log("Event ==>> ", event);
    console.log("Step ==>> ", event.Step);
//=======================
//To get the secret value in lambda function 
//=======================
    const secretValue : any = await secretsmanager.getSecretValue({
        SecretId: secretName
    }).promise();

    if(event.Step === "createSecret"){
        await secretsmanager.putSecretValue({
            SecretID:secretName,
            SecretString: JSON.stringify({
                [secretKey]:randomBytes(32).toString("hex")
            }),
            VersionStages:["AWSCURRENT"]
        }).promise()
    }

    

    //===================================================================
    //process.env.EXAMPLE_SECRET_KEY(for calling keys through environment)
    //====================================================================

    return {
        statusCode:200,
        headers:{"Content-Type":"text/plan"},
        body:`Hello cdk you have hit key 1 ${process.env.EXAMPLE_SECRET_KEY1} == key 2 ${process.env.EXAMPLE_SECRET_KEY2} \n`
    }
}