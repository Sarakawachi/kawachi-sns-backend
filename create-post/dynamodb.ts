import * as AWS from 'aws-sdk';
export const getDocumentClient = async () => {
    const documentClient = new AWS.DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        region: 'ap-northeast-1',
    });
    return documentClient;
};
export const createDocument = async (item: Object, table: string, documentClient?: AWS.DynamoDB.DocumentClient) => {
    if (!documentClient) {
        documentClient = await getDocumentClient();
    }
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: table,
        Item: item,
    };

    const result = await documentClient
        .put(params, function (err, data) {
            if (err) {
                console.log('DynamoDB createDocument:' + err);
            } else {
                console.log('Success:' + data);
                return data;
            }
        })
        .promise();
    return result;
};
