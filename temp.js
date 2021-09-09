let inputArr = process.argv.slice(2);
let input=inputArr.join(' ')     // takes user entered input in the variable input
const request = require('request');
const cheerio = require('cheerio');
let search = 'https://www.flipkart.com/search?q='+input+'&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off';
// console.log(search);
request(search, cb);   //cb is call back function
function cb(error, response, body) {
    if (error){
        console.log(error);
    }
    else{
        console.log('status code', response.statusCode);
        if(response.statusCode==404){
            console.log('Err! Page not found')
        }
        else{
            // console.log(body);
            dataExtractor(body);
        }
    }    
};
function dataExtractor(html){
    let searchTool=cheerio.load(html);
    let element=searchTool("._3pLy-c.row .col");
    let len=element.length;
    let products={};
    for(let i=0;i<len;i++){
        let tool=cheerio.load(element[i]);
        let name=tool("._4rR01T").text().trim();
        // console.log(name)
        let rating=tool("._3LWZ1k").text().trim();
        let about=tool("._1xgFaf li");
        let specifications="";
        for(let j=0;j<about.length;j++){
            specifications.concat(about[j].text())
        }
        console.log(specifications)
    }
    // console.log(products)
}
console.log("_______loading_______");


