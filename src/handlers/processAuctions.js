import {getEndedAuctions} from '../lib/getEndedAuctions'


async function processAuctions(event, context) {
    const auctionsToClose = await getEndedAuctions()
    console.log(`processing auctions`);
    return {
        statusCode:200,
        body: JSON.stringify(auctionsToClose)
    }

}
export const handler = processAuctions;
