import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import validator from "@middy/validator";
import createAuctionSchema from "../lib/schemas/createAuctionSchema";

const DynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = event.body;
  const now = new Date();
  if (!title) {
    throw new createError.InternalServerError("title required");
  }

  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);
  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  try {
    await DynamoDB.put({
      TableName: process.env.AUCTION_TABLE_NAME,
      Item: auction,
    }).promise();
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ auction }),
  };
}
export const handler = commonMiddleware(createAuction).use(
  validator({ inputSchema: createAuctionSchema })
);
