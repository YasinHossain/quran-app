const https = require('https');

https.get('https://api.qurancdn.com/api/qdc/audio/reciters', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('ID | Name');
            console.log('---|---');
            json.reciters.forEach(r => {
                console.log(`${r.id} | ${r.name}`);
            });
        } catch (e) {
            console.error(e.message);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
