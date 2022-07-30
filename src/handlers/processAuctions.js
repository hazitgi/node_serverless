async function processAuctions(event, context) {
    console.log(`processing auctions`);
    return {
        statusCode: 200,
        body: "processAuctions success",
      };
}
export const handler = processAuctions;
