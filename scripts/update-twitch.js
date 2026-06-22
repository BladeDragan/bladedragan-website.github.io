const fs = require("fs");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const USER = "bladedragan";

async function main() {

    const tokenRes = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
    {
        method: "POST"
    });

    const tokenData = await tokenRes.json();

    const accessToken = tokenData.access_token;

    const streamRes = await fetch(
        `https://api.twitch.tv/helix/streams?user_login=${USER}`,
        {
            headers: {
                "Client-ID": CLIENT_ID,
                "Authorization": `Bearer ${accessToken}`
            }
        }
    );

    const streamData = await streamRes.json();

    let output;

    if (streamData.data.length > 0) {
        
        const stream = streamData.data[0];

        output = {
            live: true,
            title: stream.title,
            game: stream.game_name,
            viewers: stream.viewer_count,
            started_at: stream.started_at,
            url: `https://twitch.tv/${USER}`
        };
    } else {
        output = {
            live: false
        };
    }

    fs.writeFileSync(
        "twitch-status.json",
        JSON.stringify(output, null, 2)
    );
}

main();
