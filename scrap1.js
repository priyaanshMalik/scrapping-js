// |________________________________________________________________________________________________|
// |About:--                                                                                        |
// |this is the program to extract last ball delivery commentonry from espn cricinfo website        |
// |this program also extracts all bolwers of the match and their respective wickets and            |
// |        calculates the highest wicket taker                                                     |
// |the program uses the module 'request' to request data from the webpage and then makes use of    |
// |        the cheerio module for data extraction from the requested webpage                       |
// |________________________________________________________________________________________________|

let request=require("request")  //importing request.
let cheerio=require("cheerio")  // importing cheerio.
let fs=require("fs")  // importing fs module

var url1='https://www.espncricinfo.com/series/2020-21-12510595/royal-chalengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard'
var url2='https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/ball-by-ball-commentary'
// url of webpages↑

// request(url,cb); //accessing webpage using a callback function syntax
request(url1,cb1); //accessing webpage1 using a callback function
request(url2,cb2) //accessing webpage2 using a callback function



function cb1(error,response, html) { //a callback function for url1
    if (error){
        console.log("error", error);    //for error
    }
    else if(response.statusCode==404){  //error 404 also gives back a webpage
        console.log("Err! Page not found")
    }
    else{
        // console.log("response", response);
        // console.log(html)   //prints html file of requested page
        console.log('\t\t  fetching wickets data')
        console.log('...............................................')
        dataExtractor1(html)    // function for extracting data
    }
}
function cb2(error,response, html) { //a callback function for url2
    if (error){
        console.log("error", error);    //for error
    }
    else if(response.statusCode==404){  
        console.log("Err! Page not found");
    }
    else{
        console.log('\t\t  fetching commentory data')
        console.log('...............................................')
        dataExtractor2(html);
    }
}
function dataExtractor1(html){  //search tool for hoghest wicket taker.
    let searchTool=cheerio.load(html); //global tool
    let bowlers=searchTool(".table.bowler tbody tr");
    console.log('bowlers:\t\twickets');
    let theBowler="";
    let highestWickets=0;
    for(let i=0;i<bowlers.length;i++){  //iterating through each bowler
      let cols=searchTool(bowlers[i]).find('td');   //each bowler
      //whenever index is used searTool is used again.
      let bowlerName=searchTool(cols[0]).text().trim();    //for name of bowler
      let bowlerWickets=searchTool(cols[4]).text().trim(); //for number of wickets
      if(bowlerName!=''){ //to check for empty bowlerName
            if(bowlerName.length <16)   //for formatting text output
                console.log(bowlerName+"\t\t"+bowlerWickets);   //wickets for each bowler.
            else
                console.log(bowlerName+"\t"+bowlerWickets);   //wickets for each bowler.  
      }

      if(bowlerWickets > highestWickets){
        theBowler=bowlerName;
        highestWickets=bowlerWickets;   //hoghest wicket taker till now
      }
      else if(bowlerWickets == highestWickets){
        theBowler=theBowler + ", " + bowlerName;  //for multiple highest wicket takers
      }
    }
    console.log('__________________________________________________')
    console.log('\thighest wicket taker:')
    console.log("name: "+theBowler+',\twickets: ', + highestWickets)
}
function dataExtractor2(html){ //search tool for last ball commentry
    let searchTool = cheerio.load(html);
    let element = searchTool(".match-comment-wrapper .match-comment-long-text");
    // you always can't get unique selectors
    // console.log(element.length); //gets all commentry of the webpage
    let lastBallCommentory = searchTool(element[0]).text(); //first index contains last ball commentry
    console.log('__________________________________________________')
    console.log('\tlast ball commentory:-')
    console.log("~", lastBallCommentory);
    console.log('__________________________________________________')
}

console.log("\t\twaiting for response\t");
console.log("...................................................")