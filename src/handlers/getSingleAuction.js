import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const DynamoDB = new AWS.DynamoDB.DocumentClient();

export const getAuctionById = async (id) => {
  let auction;
  try {
    const result = await DynamoDB.get({
      TableName: process.env.AUCTION_TABLE_NAME,
      Key: { id },
    }).promise();

    auction = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  if (!auction) {
    throw new createError.NotFound(`Auction with ID "${id}" not found!`);
  }
  return auction
};


async function getSingleAuction(event, context) {

  const { id } = event.pathParameters;
  try {
   const auction = await getAuctionById(id)

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
