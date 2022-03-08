

//========================================================================
//Showing the the evnet by producer function
//========================================================================

exports.handler = async (event:any) => {
    console.log('request : ', JSON.stringify(event, undefined, 2));
    return ({
        statusCode: 200,
        headers: {
            'Content/Type' : 'text/plain'
        },
        body: `Consumer Event, New Hello, CDK! You've hit ${event.path}\n`
    })
}