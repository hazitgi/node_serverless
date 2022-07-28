import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";

const DynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);
  const now = new Date();
  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
  };

  await DynamoDB.put({
    TableName: "AuctionTable",
    Item: auction,
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify({ auction }),
  };
}

export const handler = createAuction;
