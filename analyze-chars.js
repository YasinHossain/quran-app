const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({ error: 'Parse error' });
          }
        });
      })
      .on('error', reject);
  });
}

async function analyze() {
  const url = 'https://api.quran.com/api/v4/verses/by_key/9:4?fields=text_uthmani';
  console.log('Fetching:', url);
  const data = await fetchUrl(url);

  if (data.verse) {
    const text = data.verse.text_uthmani;
    console.log('Text:', text);
    console.log('--- Char Analysis ---');
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      const char = text[i];
      // Log interesting chars (non-arabic letters mostly, specifically marks)
      // Arabic block is roughly 0600-06FF
      // But interesting marks might be high range.
      if (code < 0x0600 || code > 0x06ff || (code >= 0x06d6 && code <= 0x06ed)) {
        console.log(`Index ${i}: ${char} (Code: ${code} / 0x${code.toString(16)})`);
      }
    }
  } else {
    console.log('No verse found');
  }
}

analyze();
