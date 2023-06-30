const PORT = 8000;
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

const url = 'https://www.theguardian.com/uk-news/2023/jun/29/manchester-mixed-reaction-aviva-studios-naming-deal';

app.get('/', (req, res) => {
    axios(url).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const articles = []
    
        $('.dcr-iyhl1z', html).each(function() {
            const paragraph = $(this).text();
            articles.push({paragraph})
        })
        res.json(articles)
    }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))