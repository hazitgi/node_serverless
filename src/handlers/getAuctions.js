import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import validator from "@middy/validator";
import getAuctionSchema from "../lib/schemas/getAuctionSchema";

const DynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;
  let auctions;
  const params = {};
  try {
    const result = await DynamoDB.query({
      TableName: process.env.AUCTION_TABLE_NAME,
      IndexName: "statusAndEndDate",
      KeyConditionExpression: "#status = :status",
      ExpressionAttributeValues: {
        ":status": status,
      },
      ExpressionAttributeNames: {
        "#status": "status",
      },
    }).promise();

    auctions = result.Items;
    return {
      statusCode: 200,
      body: JSON.stringify(auctions),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}
export const handler = commonMiddleware(getAuctions).use(
  validator({
    inputSchema: {
      type: "object",
      properties: {
        queryStringParameters: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["OPEN", "CLOSED"],
              default: "OPEN",
            },
          },
        },
      },
      required: ["queryStringParameters"],
    },
    useDefaults: true,
  })
);
