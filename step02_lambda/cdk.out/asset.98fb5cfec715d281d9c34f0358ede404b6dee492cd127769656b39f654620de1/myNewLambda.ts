import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Context,
  } from "aws-lambda";
  
const handler=async(event: APIGatewayProxyEvent,context: Context): Promise<APIGatewayProxyResult>=> {
  console.log("request:", event);
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, Mishaal khan The Cloud Architect!. You've hit ${event.path}\n`,
  };
}
export default handler