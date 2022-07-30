import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const DynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;
  try {
    const result = await DynamoDB.scan({
      TableName: process.env.AUCTION_TABLE_NAME,
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
export const handler = commonMiddleware(getAuctions);
