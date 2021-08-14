let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");

function processSinglematch(url) {
    request(url, cb);
}

function cb(error, response, html) {
    if (error) 
        console.log(error); 
    else if (response.statusCode == 404) 
        console.log("Page Not Found")
    else 
        dataExtracter(html);
}

function dataExtracter(html) {
    let searchTool = cheerio.load(html)
    let inningsArr = searchTool(".Collapsible");  //storing innings
    for (let i = 0; i < inningsArr.length; i++) { //for iterating through both the innings
        let teamNameElem = searchTool(inningsArr[i]).find("h5");//finding team name elemment-css selector
        let teamName = teamNameElem.text(); //extracting
        teamName = teamName.split("INNINGS")[0];  //extracting team name
        teamName = teamName.trim(); //applying formatting tools on team name
        console.log(teamName);
        console.log('.....')
        let batsmenTableAllRows = searchTool(inningsArr[i]).find(".table.batsman tbody tr");  //all rows aren't required here (as few rows are internal comments &hence carry no value), so further format text accordingly
        
        for (let j = 0; j < batsmenTableAllRows.length; j++) {
            let numberofTdElements = searchTool(batsmenTableAllRows[j]).find("td"); //finding td element inside each tr(row) element
            if (numberofTdElements.length == 8) {
                let playerName = searchTool(numberofTdElements[0]).text();
                console.log(playerName);
            }
        }
        console.log("_____________________________________________")
        // fs.writeFileSync(`innning${i+1}.html`,scoreCard);
    }
}

module.exports = {
    processSinglematch
}