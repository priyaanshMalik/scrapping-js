let request=require("request")  //importing request.
let cheerio=require("cheerio")  // importing cheerio.
let fs=require("fs")  // importing fs
let scoreCardObj=require("./scoreCard.js") //scorecard file

var url='https://www.espncricinfo.com/series/ipl-2020-21-1210595'
// url of webpages

request(url,cb); //accessing webpage1 using a callback function
function cb(error,response, html) { //a callback function
    if (error)
        console.log("error", error);    //for error
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
    let anchorElem = searchTool('a[data-hover="View All Results"]');
    let link = anchorElem.attr("href");
    let allMatchesPageLink = `https://www.espncricinfo.com${link}`;
    console.log(allMatchesPageLink);
    request(allMatchesPageLink, allMatchesPageCb); //  moving to all matches Page
}
function allMatchesPageCb(error, response, html) {  //callback function
    if (error) 
        console.log(error);    
    else if (response.statusCode == 404)
        console.log("Page Not Found")
    else
        getAllScoreCardLink(html);
}
function getAllScoreCardLink(html) {
    console.log("_________________________________________________");
    let searchTool = cheerio.load(html);
    let scoreCardsArr = searchTool("a[data-hover='Scorecard']");
    for (let i = 0; i < scoreCardsArr.length; i++) {
        let link = searchTool(scoreCardsArr[i]).attr("href");
        let matchPageLink= `https://www.espncricinfo.com${link}`;
        // console.log(matchPageLink);
        scoreCardObj.processSinglematch(matchPageLink)
    }
}

console.log("\t\twaiting for response\t");
console.log("...............................................")