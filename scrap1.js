let request=require("request")  //importing request.
let cheerio=require("cheerio")  // importing cheerio.
let fs=require("fs")  // importing fs module

var url1='https://www.espncricinfo.com/series/2020-21-12510595/royal-chalengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard'
var url2='https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/ball-by-ball-commentary'
// url of webpages

// request(url,cb); //accessing webpage using a callback function
request(url1,cb1); //accessing webpage1 using a callback function
request(url2,cb2) //accessing webpage2 using a callback function

function cb1(error,response, html) { //a callback function
    if (error){
        console.log("error", error);    //for error
    }
    else if(response.statusCode==404){  //error 404 also gives back a webpage
        console.log("Err! Page not found")
    }
    else{
        // console.log("response", response);
        // console.log(html)   //prints html file of requested page
        // console.log("body", body);
        console.log('\t\t\tfetching')
        console.log('...............................................')
        dataExtractor1(html)
        // function for extracting data
    }
}
function cb2(error,response, html) { //a callback function
    if (error){
        console.log("error", error);    //for error
    }
    else if(response.statusCode==404){  
        console.log("Err! Page not found")
    }
    else{
        console.log('\t\t\tfetching')
        console.log('...............................................')
        dataExtractor2(html)
    }
}
function dataExtractor1(html){  //search tool
    let searchTool=cheerio.load(html); //global tool
    let bowlers=searchTool(".table.bowler tbody tr");
    // for(let i=0; i<bowlerTables.length;i++){
    //   let player=searchTool(bowlerTables[i]).find("tr")
    // }
    console.log('bowlers:')
    let bowler="";
    let highestWickets=0;
    for(let i=0;i<bowlers.length;i++){
      let cols=searchTool(bowlers[i]).find('td');
      let bowlerName=searchTool(cols[0]).text();    //whenever index is used searTool is used again.
      let bowlerWickets=searchTool(cols[4]).text()
      
      console.log(bowlerName+"\t"+bowlerWickets)
      if(bowlerWickets > highestWickets){
        bowler=bowlerName
        highestWickets=bowlerWickets
      }
      else if(bowlerWickets == highestWickets){
        bowler=bowler + ", " + bowlerName
      }
    }
    console.log('__________________________________________________')
    console.log('\thighest wicket taker:')
    console.log("name: "+bowler+',\twickets: ', + highestWickets)
}

function dataExtractor2(html){
    let searchTool = cheerio.load(html);
    // you always can't get unique selectors
    let elemRepArr = searchTool(".match-comment-wrapper .match-comment-long-text");
    // console.log(elemRepArr.length);
    let lbc = searchTool(elemRepArr[0]).text();
    console.log('__________________________________________________')
    console.log('\tlast ball commentory')
    console.log("~", lbc);
}

console.log("\t\twaiting for response\t");
console.log("...............................................")