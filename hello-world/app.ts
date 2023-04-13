import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import crypto from 'crypto'; 

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        let content: string = (event.body)? JSON.parse(event.body).content:"";
        let username: string | null = null;
        if (event.headers["Authorization"]) {
            let sections = event.headers["Authorization"].split('.');
            let payload = Buffer.from(sections[1], 'base64').toString();
            username = JSON.parse(payload)["cognito:username"];
        }
        const item = {
            id: crypto.randomUUID(), 
            content: content,
            type: 'post',            
            owner: username,
            timestamp: Date.now(),   
        };
        const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
            TableName: process.env.TABLE_NAME,
            Item: item,
          };
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'hello world',
                content: content,
                username: username
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};

