import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../../app';
import { expect, describe, it, jest } from '@jest/globals';

const event: APIGatewayProxyEvent = {
    httpMethod: 'post',
    body: '{"content":"投稿内容"}',
    headers: {
        Authorization: 'eyJraWQiOiI0XC8xcFV2SThUSndxcFFKeTRlTVliSnRMUDJDYUZYMzdOT1B0c0xNSmhyWT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJiNzE2ZWVhZC1kMTFhLTRjOGUtYWQ4NS04OGVhOTBhNWYzZDAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLW5vcnRoZWFzdC0xX0VwM3ZVUUVqbyIsImNvZ25pdG86dXNlcm5hbWUiOiJzYXJhIiwib3JpZ2luX2p0aSI6ImRkZTE1Y2MyLWUxMzYtNDM2My1iNWI3LTZmZWY0NGQzYWRjMiIsImF1ZCI6IjMwdWVoY2Ftc2Nxa2JtYTRraG4waTg1N2Y3IiwiZXZlbnRfaWQiOiJjYjE2YzYzMy04YzI3LTRkMTYtODI2OS00MTA3ODE0YzFmZTAiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY4MTM1ODkxMSwiZXhwIjoxNjgxMzYyNTExLCJpYXQiOjE2ODEzNTg5MTEsImp0aSI6IjQ5OTA4MjI2LTc1ZTAtNDIzNi04MGFjLWQ5OGQwZjlmZDk4MSIsImVtYWlsIjoia2F3YWNoaUBrZGwuY28uanAifQ.N5Q3yLc659WVmUqCYLLdN2BJ8TtN8NQRSC8WtxcC4NPs2ClJ6qYSfW1eyEHQYP_csX1a_n4O8708i89-sOGoXJtJtEEgTxokIFAHats4YnahL9A_FcGQ5XmLdEMtM0tqXWLwV_6Bj965HIOftW6PGQXcgqZgNTo2cV4RYRTbwR7V12x7CoyBHSWIvJ1vWHNBCRM5NJlo4CU8rPyIsTPrrGa9zDNUV5OzZ1LmFRdoY2dH9hNlKwrLGppc4hl8U9nkx4BIURa8eEH-JgTkqxmKxrb8nb0kr6UH0OYdA_yjAJoCGggVGLUMWxniGdaKgRnrBV0sUf6LoEzZWbEnOLBBLg',
    },
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path: '/post',
    pathParameters: {},
    queryStringParameters: {},
    requestContext: {
        accountId: '123456789012',
        apiId: '1234',
        authorizer: {},
        httpMethod: 'post',
        identity: {
            accessKey: '',
            accountId: '',
            apiKey: '',
            apiKeyId: '',
            caller: '',
            clientCert: {
                clientCertPem: '',
                issuerDN: '',
                serialNumber: '',
                subjectDN: '',
                validity: { notAfter: '', notBefore: '' },
            },
            cognitoAuthenticationProvider: '',
            cognitoAuthenticationType: '',
            cognitoIdentityId: '',
            cognitoIdentityPoolId: '',
            principalOrgId: '',
            sourceIp: '',
            user: '',
            userAgent: '',
            userArn: '',
        },
        path: '/post',
        protocol: 'HTTP/1.1',
        requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        requestTimeEpoch: 1428582896000,
        resourceId: '123456',
        resourcePath: '/post',
        stage: 'dev',
    },
    resource: '',
    stageVariables: {},
};
// dynamoDB操作をモック
jest.mock('../../dynamodb', () => ({
    // 受け取ったitemをそのまま返す関数にしました
    createDocument: async (item: any, table: string) => {
        return {
            item,
        };
    },
    getDocumentClient: jest.fn(),
}));
describe('CreatePostAPIのUnit test', function () {
    it('正常系', async () => {
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200); // resultを検証　ここでは、statusCodeを検証している
        expect(JSON.parse(result.body).content).toEqual("投稿内容"); // result.bodyのJSONオブジェクトにして検証
    });
    it('異常系テスト:bodyが空の時', async () => {
        event.body = '';
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(400); // resultを検証　ここでは、statusCodeを検証している
        
    });
});
