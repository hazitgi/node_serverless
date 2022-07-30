import AWS from "aws-sdk";

const DynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getEndedAuctions() {
  const now = new Date();

  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status AND endingAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toDateString(),
    },
    ExpressionAttributesNames: {
      "#status": "status",
    },
  };
  const result = await DynamoDB.query({
    TableName: process.env.AUCTION_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status AND endingAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toDateString(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  }).promise()
  return result.Items;
}
