let request=require("request")  //importing request.
let cheerio=require("cheerio")  // importing cheerio.
let fs=require("fs")  // importing cheerio.

var url1='https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard'
// url of webpages

request(url1,cb); //accessing webpage1 using a callback function

function cb(error,response, html) { //a callback function
    if (error){
        console.log("error", error);    //for error
    }
    else if(response.statusCode==404){  //error 404 also gives back a webpage
        console.log("Err! Page not found")
    }
    else{
        console.log('\t\t\tfetching')
        console.log('...............................................')
        dataExtractor(html) // function for extracting data
    }
}
// let rootlink='https://www.espncricinfo.com'
function dataExtractor(html){  //search tool
    let searchTool = cheerio.load(html);
    let bowlers = searchTool(".table.bowler tbody tr");
    console.log('key:\ty-years, d-days\n')
    for (let i = 0; i < bowlers.length; i++) {
        let cols = searchTool(bowlers[i]).find("td");
        let anchorElem = searchTool(cols[0]).find("a")
        let link = anchorElem.attr("href");
        let fullLink = `https://www.espncricinfo.com${link}`;
        // console.log(fullLink)
        request(fullLink, newcb); //requesting data from new new webpage i.e. from url==fullLink
    }
}
function newcb(error, response, html) {
    if (error) {
        console.log(error); // Print the error
    } else if (response.statusCode == 404) {
        console.log("Page Not Found")
    }
    else {
        getAge(html);  //get birthday from function getAge
    }
}

function getAge(html) { //to get birthday from each fullLink (variable) from dataExtractor function
    let searchTool = cheerio.load(html);
    let headingsArr = searchTool(".player-card-description");
    let age = searchTool(headingsArr[2]).text();
    let name = searchTool(headingsArr[0]).text();
    console.log(name, "- ", age);
}

console.log("\t\twaiting for response\t");
console.log("...............................................")