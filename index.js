//


// Animals Dictionary
var animal_classification = {};
var animal_list = [];
var questions = [];
var csvData = [];
// Read Excel
var obj_csv = {
    size:0,
    dataFile:[]
};




// Init for response
var response;
var res=[];
var animal_result;


// Legs
setTimeout(askQuestion,200,"Does your animal have four legs?",0);
//setTimeout(askQuestion,5000,"Does your animal have two legs?",1);

// Functions for Excel
// https://seegatesite.com/tutorial-read-and-write-csv-file-with-javascript/
function readImage(input) {
    //console.log(input)
   if (input.files && input.files[0]) {
     let reader = new FileReader();
            reader.readAsBinaryString(input.files[0]);
     reader.onload = function (e) {
    // console.log(e);
     obj_csv.size = e.total;
     obj_csv.dataFile = e.target.result
                //console.log(obj_csv.dataFile)
                parseData(obj_csv.dataFile)

     }
   }
}

function parseData(data){
    let lbreak = data.split("\n");
    lbreak.forEach(res => {
        csvData.push(res.split(","));
    });

    setTimeout(createQuestions, 200,csvData);
    setTimeout(createDictionary, 200,csvData);

    //console.table(csvData);
}

function createQuestions(csvData) {
  // Questions:
  for(var i = 0; i<csvData[0].length-3;i++)
  {
    //console.log(csvData[0][i+3])
    questions[i] = csvData[0][i+3];
  }
  //console.log(questions);
}

function createDictionary(csvData) {

  for(var i=1; i<csvData.length; i++) {
    //console.log(csvData[i][0]);
    var animal = csvData[i][0];
    var features = [];
    for(var j=1; j<csvData[i].length; j++) {

      //console.log(csvData[i][j].toLowerCase());
      if(csvData[i][j].toLowerCase().replace("\r","") == "true"){
        features[j-1] = true;
      }
      else {
        features[j-1] = false;
      }
    }
    //console.log(features);
    if(csvData[i][0]!="") {
      animal_list[i]=animal;
      animal_classification[animal] = features;
    }
  }
  printAnimalList();
  //animal_classification=dict;
  //console.log(animal_classification);
}
function printAnimalList() {
  var list = "<span>Animals:</span><br>";
  for(var i = 0; i < animal_list.length; i++) {
    if(animal_list[i] != null) {
      list = list + animal_list[i] +"<br>";
    }
  }
  console.log(list);
  document.querySelector(".animal_list").innerHTML = list;
}

function askQuestion(question,val) {
  var result;
  var questions_form = document.querySelector(".questions");

  // Set Question
  questions_form.firstElementChild.innerHTML = question;

  // Init checkboxes
  questions_form[0].checked = false;
  questions_form[1].checked = false;

  // Wait on changes
  questions_form[0].addEventListener('change', function() {
    if(this.checked===true) {
      result=true;
      questions_form[1].checked= false;
    }
  });
  questions_form[1].addEventListener('change', function() {
    if(this.checked===true) {
      result=false;
      questions_form[0].checked= false;
    }
  });

  // Send Answer, Save Result, and Next Question
  questions_form.elements["send"].onclick = function () {
    if(val ==0) {
      res[val] = result;
      if(result !== true) {
        setTimeout(askQuestion,0,"Does your animal have two legs?",1);
      }
      else {
        res[val+1] = !result;
        if(questions[val] != null){
          setTimeout(askQuestion,0,questions[val],val+2);
        }
      }

    }
    else {
      res[val]=result;
      if(questions[val-1] != null){
        setTimeout(askQuestion,0,questions[val-1],val+1);
      }
      else
      {
        setTimeout(comparision,200);
      }
    }
  }
}


// Do comparison
function comparision() {
  for(var animal in animal_classification) {
    //console.log(animal);
    var features = animal_classification[animal];
    var flag = true;
    for(var i = 0; i<features.length; i++) {
      //console.log((res[i] !== features[i]));
      if(res[i] !== features[i]) {
        flag = false;
        break;
      }
    }
    if(flag) {
      // set animal output
      animal_result = animal;
      break;
    }
    else {
      animal_result="";
    }
  }

  if(animal_result == "") {
    // no match
    document.querySelector(".animal_output").innerHTML = "We couldn't find your animal 🤨<br> Try again";

  }
  else {
    document.querySelector(".animal_output").innerHTML = "Congratulations! We found your animal! It's a(n) " + animal_result +"!";
  }
  document.querySelector(".questions").classList.add("remove");
  document.querySelector(".animal_output").classList.remove("remove");
  document.querySelector(".return").classList.remove("remove");
  // Try again
  document.querySelector(".return").elements["send"].onclick = function () {
    setTimeout(askQuestion,200,"Does your animal have four legs?",0);

    document.querySelector(".animal_output").classList.add("remove");
    document.querySelector(".return").classList.add("remove");
    document.querySelector(".questions").classList.remove("remove");
  }
}
