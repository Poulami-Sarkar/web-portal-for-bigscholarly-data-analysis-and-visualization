var url = '/data';
var messageToDisplay;
var disp=[0,0];
var disp2=[0,0];
var disp3=[0,0];
var result;
var layout = {
  showlegend: true,
  legend: {"orientation": "h",
    font:{color:'white'},
    bgcolor: 'rgba(0,0,0,0)'    
  },
  margin: {
    l: 40,
    r: 40,
    b: 20,
    t: 20,
    pad: 0
  },
  xaxis: {title: 'year',
          color: 'white'
        },
  yaxis: {title:'count',
          color: 'white',
        },

  //opacity=0.1,  
  paper_bgcolor: 'rgba(0.1,0.1,0.1,0.1)',
  plot_bgcolor: 'rgba(0.2,0.2,0.2,0.3)'
}; 

var array = [10, 13, 7, 11, 12, 9, 6, 5];

function smooth(values, alpha) {
    var weighted = average(values) * alpha;
    var smoothed = [];
    for (var i in values) {
        var curr = values[i];
        var prev = smoothed[i - 1] || values[values.length - 1];
        var next = curr || values[0];
        var improved = Number(this.average([weighted, prev, curr, next]).toFixed(2));
        smoothed.push(improved);
    }
    return smoothed;
}

function average(data) {
    var sum = data.reduce(function(sum, value) {
        return sum + value;
    }, 0);
    var avg = sum / data.length;
    return avg;
}

function doublevalues (yval,year){
  var i=0;
  while (yval[i] == 0 || yval[i] == null){
    i++;
  } 
  var base = yval[i];
  var y=[];
  var x=[];
  y.push(yval[i]);
  x.push(year[i]);
  var j=2;
  var diff=0;
  for (i =i+1;i<yval.length;i++){
    diff= diff+yval[i];
  }
  console.log(diff/(yval.length*2));
  diff = diff/(yval.length*2);
  for (i =1;i<yval.length;i++){
    if(yval[i]>=(base*2)){
        y.push(yval[i]);
        x.push(year[i]);
        console.log(base*j,yval[i]);
        base = yval[i];
    }
  }
  console.log(x,y)
  return [x,y];
}

$(document).ready(function(){
  $('.tabs').tabs();
});
      
$('.btn1').on('click', function() {
  if($('#se').is(':checked')){
    query('SELECT paper_published_year year, COUNT(distinct paa.paper_ID) papers, COUNT(distinct author_ID) authors from Paper_Author_Affiliations_SE paa, Papers_SE p where paa.paper_ID =p.paper_ID and paper_published_year>1970 group by (paper_published_year);');
    disp[0] =1;
    $(document).ready(function() {
      console.log(messageToDisplay+" click");
    });
    //display1(messageToDisplay);
  }
  if($('#am').is(':checked')){
    query('SELECT paper_year year,COUNT(distinct paa.paper_ID) papers, COUNT(distinct author_ID) authors from Paper_Author_AM paa, Papers_AM p where paa.paper_ID =p.paper_ID and paper_year>1970 group by (paper_year);');
    disp[1] =1;
  }
});

//Authors/paper
$('.btn2').on('click', function() {
  if($('#se2').is(':checked')){
    Plotly.purge($('#plot0'));
    query('select paper_published_year year, avg(authors) avg from (SELECT paper_published_year,paa.paper_ID,COUNT(distinct author_ID) authors from Paper_Author_Affiliations_SE paa, Papers_SE p where paa.paper_ID =p.paper_ID and paper_published_year>1970 group by (paa.paper_ID)) t1 group by paper_published_year;');
    console.log(messageToDisplay);
    query('select paper_published_year year, avg(papers) as avg from (SELECT paper_published_year, author_ID,COUNT(distinct paa.paper_ID) papers from Paper_Author_Affiliations_SE paa, Papers_SE p where paa.paper_ID =p.paper_ID and paper_published_year>1970 group by paper_published_year, author_ID) t2 group by paper_published_year;');   
    disp2[0] =2;
    console.log(messageToDisplay)
  }
  if($('#am2').is(':checked')){
    Plotly.purge($('#plot1'));
    query('select paper_year year, avg(papers) avg from (SELECT paper_year, author_ID,COUNT(distinct paa.paper_ID) papers from Paper_Author_AM paa, Papers_AM p where paa.paper_ID =p.paper_ID and paper_year>1970 group by paper_year, author_ID) t2 group by paper_year;');   
    query('select paper_year year, avg(authors) avg from (SELECT paper_year, paa.paper_ID,COUNT(distinct paa.author_ID) authors from Paper_Author_AM paa, Papers_AM p where paa.paper_ID =p.paper_ID and paper_year>1970 group by paper_ID) t2 group by paper_year;');
    disp2[1] =2;
  }
});

//Authors/paper
$('.btn3').on('click', function() {
  //if($('#se3').is(':checked')){
  console.log("cl");
  Plotly.purge($('#plot0'));
  query('select * from (select  paper_year, avg(ai_citations) aiav from (select pai.paper_year, count(ai.paper_cite_id) ai_citations from Paper_Citations_AI ai, Papers_AI pai where ai.paper_id =pai.paper_id and pai.paper_year >1970 group by pai.paper_id) ai group by paper_year) t1 left JOIN (select  paper_year, avg(se_citations) seav from (select pse.paper_published_year paper_year, count(se.paper_cite_ID) se_citations from Paper_Citations_SE se, Papers_SE pse where se.paper_ID =pse.paper_ID and pse.paper_published_year >1970 group by pse.paper_ID) se group by paper_year) t2 on t1.paper_year = t2.paper_year;');
  disp3[0] =1;
  console.log(messageToDisplay)
  //}
});

function onLoad() {
  var response = this.responseText;
  var parsedResponse = JSON.parse(response);   
  // access your data newly received data here and update your DOM with appendChild(), findElementById(), etc...
  messageToDisplay = parsedResponse;
  if (disp[0] ==1){
    console.log(disp);
    display1(messageToDisplay,0);``
  }
  else if (disp[1] ==1){
    console.log(disp);
    display1(messageToDisplay,1);
  }
  else if (disp2[0] !=0){
    console.log(disp2);
    messageToDisplay = JSON.parse(result);
    console.log(messageToDisplay[0]);
    display2(messageToDisplay,0);
  }
  else if (disp2[1] !=0){
    console.log(disp2);
    messageToDisplay = JSON.parse(result);
    display2(messageToDisplay,1);
    //display2(messageToDisplay,1);
  }  
  else if (disp3[0] !=0){
    console.log(disp3);
    display3(messageToDisplay,0);
    console.log(messageToDisplay);
    //display2(messageToDisplay,1);
  } 
}

function display1(parsedResponse,no){
   var xval =[];
   var yval1=[];
   var yval2=[];

   for(i=0;i<parsedResponse.length-1;i++){
     xval.push(parsedResponse[i].year);
     yval1.push(parsedResponse[i].papers);
     yval2.push(parsedResponse[i].authors);
   }      

   TESTER = document.getElementById('plot'+no);
   var markers = {
    x:(doublevalues(yval1,xval)[0]).concat(doublevalues(yval2,xval)[0]),
    y:(doublevalues(yval1,xval)[1]).concat(doublevalues(yval2,xval)[1]),
    mode: 'markers',
    name: 'double',
    marker: {color:'red'}
  };
   var papers = {
    x: xval,
    y: yval1,
    mode: 'lines',
    name: 'papers'
  };
  
  var authors = {
    x: xval,
    y: yval2,
    mode: 'lines',
    name: 'authors'
  };
   Plotly.purge(TESTER);
   Plotly.plot( TESTER, [papers,authors,markers],layout,{responsive: true} );
   disp[no] =0;
   // append child (with text value o messageToDisplay for instance) here or do some more stuff
}

function display2(parsedResponse,no){
  var xval =[];
  var yval =[];
  
    
  TESTER = document.getElementById('plot'+no);

  for(i=0;i<parsedResponse.length-1;i++){
    xval.push(parsedResponse[i].year);
    yval.push(parsedResponse[i].avg);
  }
  yval=smooth(yval, 0.99);
  //
  if (disp2[no]==2){  
    Plotly.purge(TESTER); 
    var nametitle = 'avgAuth_per_paper';
  }
  else if(disp2[no]==1){
    var nametitle= 'avgPapers_per_author';
  }    
    var trace = {
      x: xval,
      y: yval,
      mode: 'lines',
      name: nametitle
    };
    var markers = {
      x:(doublevalues(yval,xval)[0]),
      y:(doublevalues(yval,xval)[1]),
      mode: 'markers',
      name: 'double',
      marker: {color:'red'}
    };
    Plotly.plot( TESTER, [trace,markers],layout,{responsive: true});
    disp2[no] =disp2[no]-1;   
}
  // append child (with text value o messageToDisplay for instance) here or do some more stuff

function display3(parsedResponse,no){
   var xval =[];
   var yval1=[];
   var yval2=[];

   for(i=0;i<parsedResponse.length-1;i++){
     xval.push(parsedResponse[i].paper_year);
     yval1.push(parsedResponse[i].aiav);
     yval2.push(parsedResponse[i].seav);
   }   
   TESTER = document.getElementById('plot'+no);
   var markers = {
    x:(doublevalues(yval1,xval)[0]).concat(doublevalues(yval2,xval)[0]),
    y:(doublevalues(yval1,xval)[1]).concat(doublevalues(yval2,xval)[1]),
    mode: 'markers',
    name: 'double',
    marker: {color:'red'}
  };
   var papers = {
    x: xval,
    y: yval1,
    mode: 'lines',
    name: 'ai'
  };
  
  var authors = {
    x: xval,
    y: yval2,
    mode: 'lines',
    name: 'se'
  };

   Plotly.purge(TESTER);
   Plotly.plot( TESTER, [papers,authors,markers],layout,{responsive: true} );
   disp[no] =0;
   // append child (with text value o messageToDisplay for instance) here or do some more stuff
}

function onError() {
  // handle error here, print message perhaps
  console.log('error receiving async AJAX call');
}

function query (str){
  var http = new XMLHttpRequest();
  var url = '/query?q='+str;
  http.open('GET', url, true);
  
  //Send the proper header information along with the request
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  http.addEventListener('load',onLoad);
  http.addEventListener('error',onError);
  
  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
          //alert(http.responseText);
          result=http.responseText;
      }
  }
  console.log("query returning");
  http.send()   ;  
}



///////////////////////////////////////////////////////////////
//                       Nimisha's part                      //
//                        (Home page)                        //
///////////////////////////////////////////////////////////////