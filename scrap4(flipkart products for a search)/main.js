let inputArr = process.argv.slice(2);
let input=inputArr.join(' ')     // takes user entered input in the variable input
const request = require('request');
const cheerio = require('cheerio');
let search = 'https://www.flipkart.com/search?q='+input+'&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off';
//full link for searching flipkart
request(search, cb);   //cb is call back function
function cb(error, response, body) {
    if (error){
        console.log("ERR!!!");
    }
    else{
        console.log('status code', response.statusCode);
        if(response.statusCode==404){
            console.log('Err! Page not found')
        }
        else{
            console.log('fetching-----------------------')
            dataExtractor(body);
        }
    }    
};
function dataExtractor(html){
    let searchTool=cheerio.load(html);
    let element=searchTool("._3pLy-c.row .col"); //for each product

    let rootLink='https://www.flipkart.com'

    let elementLinks = searchTool("._1fQZEK")   //for retrieving separate link/url of each product
    let elementLinksList = []
    for(let i=0;i<elementLinks.length;i++){ //links for all products in a list
        let temp= searchTool(elementLinks[i]).attr('href');
        elementLinksList.push(`${rootLink}${temp}`);
    }

    let compareL= searchTool('._13oc-S')    // for comparison webpage for top 3 products
    let compareList = []
    for(let i=0;i<3;i++){  //accumalating id for forming link for comparison webpage for top 3 products
        let temp= searchTool(compareL[i]).children().attr('data-id');
        compareList.push(`${temp}`);
    }
    let compareLink=`${rootLink}/${input}/compare?ids=${compareList[0]},${compareList[1]},${compareList[2]}&otracker=compare_product_3`;
    // link for comparison webpage for top 3 products by adding ids
    console.log('\n\n')
    console.log('click following link for detailed comparison');
    console.log(compareLink);
    console.log('\n\n')

    // let len=element.length;

    for(let i=0;i<23;i++){     //iterating through each product.
        let eachProduct=searchTool(element[i]);
        let productName= eachProduct.find('._4rR01T').text();   //extracting product name
        if(productName==undefined || productName=='')
            continue;
        // let price = eachProduct.find('._30jeq3._1_WHN1').text(); //extracting price
        let discount= eachProduct.find('._3Ay6Sb').text();   //extracting discount offered
        let tool= cheerio.load(eachProduct.html())
        let features= tool('.rgWa7D')   //for features in array object
        let featureList=[];
        for(let i=0;i<features.length;i++){ //for extracting features text into a list
            featureList.push(tool(features[i]).text());
        }
        request(elementLinksList[i],callBack);  //for reviews of each product navigating to each product link
        function callBack(error, response, body) {
            (display =() =>{
                console.log('**********************');
                console.log(`${productName}\nprice:\tRs.--\n${discount}\nfeatures:`)    //-- replace ${price}
                for(let i=0;i<featureList.length;i++){
                    console.log(featureList[i]);
                }
            })();
            

            if (error){
                console.log("error in retrieving reviews");
            }
            else if(response.statusCode==404){
                    console.log('Err! Page not found')
            }
            else{
                    console.log('Top Reviews:')
                    dataExtr(body);
            }
            function dataExtr(html){    //for navigating for product reviews
                let searchTool=cheerio.load(html);
                let reviews = searchTool('.t-ZTKy>')
                for(let i=0;i<3;i++){
                    let temp=searchTool(reviews[i]).text()
                    temp = temp.slice(0,temp.length-9)
                    console.log(`Review ${i+1}: ${temp}`)
                }
            }
        } 
    } 
}

console.log("_______loading_______");
