const axios = require ('axios');
const cheerio = require ('cheerio');
const saveFile = require('objects-to-csv')
const fs = require('fs')


const url = 'https://nuleafnaturals.com/locations/'
const parsedResults = []
const pageLimit = 10
let pageCounter = 0
let resultCount = 0

const getContent = async (url) => {
    try {
        const response = await axios.get(url)
        const $ = cheerio.load(response.data)

        $('.w2dc-listings-block-content').map((i, el) => {
            const count = resultCount++
            const title= $(el).find('header').parent().next().find('h2').text()
            const address = $(el).find('address').text()
            const phone = $(el).find('telephone').attr('href')
             const metadata = {
               count: count, 
               title: title, 
               address: address,
               phone: phone
            }
            parsedResults.push(metadata) 
         })
  
         //pagination 
         const nextPageLink = $('.pagination').find('.curr').parent().next().find('a').attr('href')
         console.log(`scraping: ${nextPageLink}`)
         pageCounter++

        if (pageCounter === pageLimit) {
             exportResults(parsedResults)
            return false
        }

         getContent(nextPageLink)
     } catch (error) {
         exportResults(parsedResults)
        console.log(error)
     }
 }

 const exportResults = (parsedResults) => {
     const csv = new saveFile(parsedResults);
    csv.toDisk('./test3.csv');
//     // fs.writeFile(outPutFile, JSON.stringify(parsedResults, null, 4), (err) => {
//     //     if (err) {
//     //         console.log(err)
//     //     }
//     //     console.log(parsedResults.length + 'results exported')
//     }; 
 }
getContent(url); 