// |________________________________________________________________________________________________|
// |About:--                                                                                        |
// |the following program makes a request ot espncricinfo webpage and retrieves the birthdays for   |
// |    bowlers of a particular match.                                                              |
// |This is done by requesting a wepage for each bowler each time and extracting birthday           |
// |        information                                                                             |
// |________________________________________________________________________________________________|

let request=require("request")  //importing request.
let cheerio=require("cheerio")  // importing cheerio.
let fs=require("fs")  // importing fs module

var url='https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard'
// url of webpages

request(url,cb); //accessing webpage1 using a callback function

function cb(error,response, html) { //a callback function for request
    if (error){
        console.log("error", error);
    }
    else if(response.statusCode==404){  
        console.log("Err! Page not found")
    }
    else{
        console.log('\t\t\tfetching')
        console.log('...............................................')
        dataExtractor(html) // function for extracting data
    }
}
// rootlink is 'https://www.espncricinfo.com'
function dataExtractor(html){  //search tool
    let searchTool = cheerio.load(html);
    let bowlers = searchTool(".table.bowler tbody tr");
    console.log('key:\ty-years, d-days\n')
    for (let i = 0; i < bowlers.length; i++) {
        let cols = searchTool(bowlers[i]).find("td");
        let anchorElement = searchTool(cols[0]).find("a")   //find link through <a> element
        let link = anchorElement.attr("href");  //extracting link through href attribute of <a>
        // console.log(link)
        if(link!=undefined){    //if link obtained isb't undefined ...
            let fullLink = `https://www.espncricinfo.com${link}`;   //formig full path as only relative path is extracted
            request(fullLink, newcb); //requesting data from new new webpage i.e. from url==fullLink
        }
    }
}
function newcb(error, response, html) { //callback function for request of each webpage for each bowler
    if (error) {
        console.log('an error occured while requesting page. could not retrieve information'); // Print the error
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