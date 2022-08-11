const parse = require('csv-parse/lib/sync');
const xlsx = require('xlsx');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const workbook = xlsx.readFile('xlsx/data.xlsx');

const csv = fs.readFileSync('csv/data.csv');
const records = parse(csv.toString('utf-8'));
records.forEach((r,i) => {
    console.log(i,r);
});

const ws = workbook.Sheets.영화목록;

const records2 = xlsx.utils.sheet_to_json(ws);
console.log(records2);

for( const [i,r] of records2.entries()){
    console.log(i, r.제목, r.링크);
}

const crawler = async () => {
    await Promise.all(records2.map(async (r) => {
        const response = await axios.get(r.링크);
        if(response.status === 200){
            const html = response.data;
            const $ = cheerio.load(html);
            const text = $('.score.score_left .star_score').text();
            console.log(text);
        }
    }));
};

crawler();