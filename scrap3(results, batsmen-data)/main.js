let request=require("request")  
let cheerio=require("cheerio")  
let fs=require("fs")            
let scoreCardObj=require("./scoreCard.js") //scorecard file
const { match } = require("assert")

var url='https://www.espncricinfo.com/series/ipl-2020-21-1210595'   // url of webpage

request(url,cb); 
function cb(error,response, html) { //a callback function
    if (error)
        console.log("error!!!some unexpected error occured!!!\n\n"); //for error
    else if(response.statusCode==404)  
        console.log("Err! Page not found")
    else{
        console.log('\t\t\tfetching');
        console.log('...............................................');
        dataExtractor(html);
    }
}
function dataExtractor(html){
    let searchTool=cheerio.load(html);
    let anchorElem = searchTool('a[data-hover="View All Results"]');    //for url of all match results
    let link = anchorElem.attr("href");
    let allMatchesPageLink = `https://www.espncricinfo.com${link}`;     //full link of required result webpage
    console.log(allMatchesPageLink);
    //now navigating to the required url:-
    request(allMatchesPageLink, allMatchesPageCb); 
}
function allMatchesPageCb(error, response, html) {  //callback function for allMatchesPageLink
    if (error) 
        console.log(error);    
    else if (response.statusCode == 404)
        console.log("Page Not Found")
    else
        getAllScoreCardsLink(html);
}
function getAllScoreCardsLink(html) {
    console.log("_________________________________________________");
    let searchTool = cheerio.load(html);
    let scoreCardsArr = searchTool("a[data-hover='Scorecard']");
    for (let i = 0; i < scoreCardsArr.length; i++) {    //for each match
        let link = searchTool(scoreCardsArr[i]).attr("href");
        let matchPageLink= `https://www.espncricinfo.com${link}`;//navigating to full scoreCard webpage
        if (matchPageLink!=undefined && matchPageLink != `https://www.espncricinfo.com${undefined}` 
                && matchPageLink!=`https://www.espncricinfo.com`)
            // console.log(matchPageLink);
            scoreCardObj.processSinglematch(matchPageLink)  //processing each match. using module ./scoreCard.js
    }
}

console.log("\t\twaiting for response\t");
console.log("...............................................")