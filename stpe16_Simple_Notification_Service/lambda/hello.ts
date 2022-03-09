import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  // the messages sent by SNS are recieved in the event's body
  const data = JSON.parse(event.body || '{}')

  // we are logging the data coming from SNS. You can view it in the cloudWatch log events.
  console.log('Hello CDK, My Data is  ===>>> ', data);
 
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  };
}