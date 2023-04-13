import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import crypto from 'crypto';
import * as AWS from 'aws-sdk';
import { createDocument } from './dynamodb';

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
        let content: string = '';
        if (
            event.body &&
            JSON.parse(event.body).content &&
            JSON.parse(event.body).content.length >= 1 &&
            JSON.parse(event.body).content.length <= 140
        ) {
            content = JSON.parse(event.body).content;
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: '不正な入力形式です',
                }),
            };
        }
        let username: string | null = null;
        const item = {
            id: crypto.randomUUID(),
            content: content,
            type: 'post',
            owner: username,
            timestamp: Date.now(),
        };

        let post = await createDocument(item, 'process.env.TABLE_NAME');
        return {
            statusCode: 200,
            body: JSON.stringify({
                result: item,
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
