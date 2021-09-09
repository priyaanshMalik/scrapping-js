let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
// importing modules↑

function processSinglematch(url) {  //function to be exported
    request(url, cb);
}

function cb(error, response, html) {
    if (error) 
        console.log(error); 
    else if (response.statusCode == 404) 
        console.log("Page Not Found")
    else 
        dataExtracter(html);    //for extracting data.
}

function dataExtracter(html) {  //data extractinbg function for each match.
    let searchTool = cheerio.load(html)
    let matchInfoList=[];
    ( function mInfo(){     //for important result, match information
        let classes= ['.event .name','.event .score','.event .status-text',
                '.playerofthematch-name']
        for(let x of classes){
            let temp = searchTool(x)
            if(temp.length>=2){
                matchInfoList.push(searchTool(temp[0]).text());
                matchInfoList.push(searchTool(temp[1]).text());
            }
            else{
                matchInfoList.push(searchTool(temp[0]).text());
            }
        }
    }());
    console.log('**********');
    console.log(`${matchInfoList[0]}-${matchInfoList[2]}\n${matchInfoList[1]}-${matchInfoList[3]}
        \nRESULT:\t\t\t${matchInfoList[4]}\nPLAYER OF THE MATCH:\t${matchInfoList[5]}`)
    console.log('**********');
    let inningsArr = searchTool(".Collapsible");  //storing innings
    for (let i = 0; i < inningsArr.length; i++) { //for iterating through both the innings
        let teamNameElem = searchTool(inningsArr[i]).find("h5");//finding team name elemment-css selector
        let teamName = teamNameElem.text(); //extracting team name
        console.log(teamName);
        console.log('.....')
        let batsmenTableAllRows = searchTool(inningsArr[i]).find(".table.batsman tbody tr");  
        //all rows aren't required here (as few rows are internal comments &hence carry no value), so further formatting text accordingly
        for (let j = 0; j < batsmenTableAllRows.length; j++) {
            let numberofTdElements = searchTool(batsmenTableAllRows[j]).find("td"); //finding td element inside each tr(row) element
            if (numberofTdElements.length == 8) {
                let playerName = searchTool(numberofTdElements[0]).text();
                let runs = searchTool(numberofTdElements[2]).text();
                let ballsPlayed = searchTool(numberofTdElements[3]).text(); 
                if(playerName.length>=16)
                    console.log(playerName+'\truns-'+runs+'\tballs-'+ballsPlayed);
                    else
                    console.log(playerName+'\t\truns-'+runs+'\tballs-'+ballsPlayed);
            }
        }
        console.log("____________")
        // fs.writeFileSync(`innning${i+1}.html`,scoreCard);
    }
    console.log("#############################################")
}

module.exports = {  //exporting function
    processSinglematch
}