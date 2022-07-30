import AWS from "aws-sdk";

const DynamoDB = new AWS.DynamoDB.DocumentClient();

export async function closeAuction(auction) {
  const result = await DynamoDB.update({
    TableName: process.env.AUCTION_TABLE_NAME,
    Key: { id: auction.id },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": "CLOSED",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  }).promise();

  return result;

}
