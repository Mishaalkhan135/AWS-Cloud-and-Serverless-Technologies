import {EventBridge} from "aws-sdk"

exports.handler = async (event:any) => {

//========================================================================
//Generating the the evnet by producer function
//========================================================================
    const eventBridge = new EventBridge();
    //main part to create a event
    const result = await eventBridge.putEvents({
        Entries: [
            {
                EventBusName: 'default',
                Source: 'producerLambda',
                DetailType: 'test',
                Detail: JSON.stringify({
                    productName: 'T-shirt',
                    productPrice: 100,
                    customerName: 'Mishaal Khan'
                })
            }
        ]
    }).promise();


    console.log('request : ', JSON.stringify(result));
    return ({
        statusCode: 200,
        headers: {
            'Content/Type' : 'text/plain'
        },
        body: `Producer Event, New Hello, CDK! You've hit, ${JSON.stringify(result)}\n`
    })
}