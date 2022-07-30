import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const DynamoDB = new AWS.DynamoDB.DocumentClient();

async function getSingleAuction(event, context) {
  let auction;
  const { id } = event.pathParameters;
  try {
    const result = await DynamoDB.get({
      TableName: process.env.AUCTION_TABLE_NAME,
      Key: { id },
    }).promise();
    auction = result.Item;
    if (!auction) {
      throw new createError.NotFound(`Auction with ID "${id}" not found!`);
    }
    return {
      statusCode: 200,
      body: JSON.stringify(auction),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}
export const handler = commonMiddleware(getSingleAuction);
