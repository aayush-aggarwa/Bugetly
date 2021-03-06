 //module
/*var bugetController = (function (){
    // x and add are private 
    var x=23;
    
    var add=function(a){
        return x+a; 
    }
    return {
        //pubicTest is an object which contain a methord n
        //publicTest methord is public
        //bcz of closers we are abel to acces x and foem here 
         publicTest: function(b){
             console.log(add(b));
         }
    }
})();
*/

//budgret controller
var budgetController = (function() {
    
  var Expense= function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
    this.percentage =-1;
  };
    Expense.prototype.calcPercentage =function(totalIncome){
        if(totalIncome >0){
          this.percentage =Math.round  ((this.value /totalIncome)*100);  
        }
        else{
            this.percentage = -1;
        }     
    };
    
    Expense.prototype.getPercentage =function(){
        return this.percentage;
    }
  
 var Income=function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
  }; 
  var calculateTotal =function(type){
    
      var sum=0;
      data.allItems[type].forEach(function(cur){
          sum =sum +cur.value;
       data.totals[type]=sum;   
      });
  };
    
 var data={
     allItems: {
         exp: [],
         inc: []
     },
     totals:{
         exp: 0,
         inc: 0  
     },
     budget: 0,
     percentage: -1
 };
    return{
       addItem: function(type,des,val){
         var newItem,ID;
           
           //[1 2 3 4 5 ],next id =6;
           //[1 2 4 6 8],next id =9
           
           //create new id
           if(data.allItems[type].length > 0){
               ID=data.allItems[type][data.allItems[type].length -1].id +1;
           }
           else{
              ID =0;
           }
        //create new item
        if(type== 'exp')
            {
               newItem = new Expense(ID,des,val); 
            }
        else if(type =='inc')
            {
                newItem =new Income(ID,des,val);
            }
        
        // push it into datastructue
        data.allItems[type].push(newItem);
           
        //return newitem
        return newItem; 
       },
        
        deleteItem : function(type,id){
             // id =3
            //data.allItems[type][id]
           //ids =[1 2 4 6 8]
          // index =3
          var ids,index;
        
          ids = data.allItems[type].map(function(current){
               return current.id; 
            });
            
            index =ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            } 
        },
      calculateBudget: function(){
        // calculate total income and expeneses
          
          calculateTotal('exp');
          calculateTotal('inc');
          
        //calculate the budget :income -expenses
         
         data.budget =data.totals.inc - data.totals.exp; 
          
        //calculate the percentage of income that we spent
          if(data.totals.inc > 0)
  {          data.percentage = Math.round((data.totals.exp / data.totals.inc) *100)
  }
          else {
              data.percentage =-1;
          }
          
      }, 
        
        calculatePercentages: function(){
          
            /*
            a=20
            b=10
            c=40
            income=100
            a=20/100=20%
            */
            
            data.allItems.exp.forEach(function(cur){
               cur .calcPercentage(data.totals.inc); 
            });
        },
     getPercentage : function(){
         var allPerc =data.allItems.exp.map(function(cur){
             return cur.getPercentage();
         });
         return allPerc;
     },
     getBudget : function(){
        return {
            budget :data.budget,
            totalInc :data.totals.inc,
            totalExp: data.totals.exp,
            percentage:data.percentage
        }
         
     },
      testing: function(){
          console.log(data);
      }
    };
    
})();

//ui controller 
var UIController =(function(){
    var DOMstrings ={
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue : '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
        
    };
     var formatNumber = function(num, type){
       var numSplit,int,dec;
        /*
        + or -  before number
        exactly 2 decimal points
        comma seprating the thousands 
        
        2310.4567 -> +2310.46
        2000-> +2000.00
        */
         num =Math.abs(num);
         num = num.toFixed(2);
        numSplit =num.split('.');
        
        int= numSplit[0];
        if(int.length > 3){
            int = int.substr(0,int.length -3) + ',' + int.substr(int.length -3 ,int.length -1); 
             // input 2310 , output 2,310
        }
        
        dec =numSplit[1];
        
        
        return (type === 'exp' ? '-': '+') + ' ' +int +'.' + dec;
          
    };
    var nodeListForEach = function(list,callback){ 
               for(var i=0 ; i<list.length ; i++)
                   {
                       callback(list[i] ,i);  
                   }
           };
        
    return{
        getInput: function(){
            return{
            //here its a property 
             type : document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
             description: document.querySelector(DOMstrings.inputDescription).value,
             value: parseFloat( document.querySelector(DOMstrings.inputValue).value )
        };
            
      },
        addListItem :function(obj,type){
            var html,newHtml,element;
            // create html string with placeholder text
            if(type === 'inc'){
            element =DOMstrings.incomeContainer;
            html ='<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp'){
              element =DOMstrings.expensesContainer;
              html=' <div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>      <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
                
            //replace the placeholder text with some actual data 
             newHtml = html.replace('%id%',obj.id);
             newHtml = newHtml.replace('%description%',obj.description);
             newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));
            
            //insert the html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        
      deleteListItem: function(selectorID){
          
          var el =document.getElementById(selectorID);
          el.parentNode.removeChild(el);
          
      },
        
        clearFiels: function(){
         var fiels,fieldsArr;
            
          fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
        fieldsArr = Array.prototype.slice.call(fields);
        
        fieldsArr.forEach(function(current , index, array){
            current.value="";
            
        });
         // to go back to the discription     
        fieldsArr[0].focus();
         
        },
        displayBudget :function(obj){
           obj.budget > 0 ? type ='inc' :type ='exp';
       document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');
            
           
            if(obj.percentage >0)
                {document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                    
                }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        
       displayPercentages: function(percentages){
         
           var fields= document.querySelectorAll(DOMstrings.expensesPercLabel);
           
           nodeListForEach(fields, function(current ,index){
                  
               if(percentages[index] >0)
                   {
                       current.textContent = percentages[index] + '%';
                   }
               else {
                   current.textContent = '---';
               }
                        
               });
           
       },
        
    displayMonth: function(){
        var now =new Date();
        var months=['January','Fabuary','March','April','June','July','August','September','October','November','December'];
        var month =now.getMonth();
        var year = now.getFullYear();
        document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        
    },
        changeType: function(){
          
             var fields =document.querySelectorAll(
                 DOMstrings.inputType+ ','+
                 DOMstrings.inputDescription + ','+
                 DOMstrings.inputValue);
             
             
            nodeListForEach(fields,function(cur){
                
                cur.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        getDOMstrings: function(){
            return DOMstrings;
        }
    };
    
    
})();
                   
//global app controller                   

var controller =(function(budgetCtrl,UICtrl){
   
 var setupEventListeners =function(){
    var DOM= UICtrl.getDOMstrings();
     
document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem); 
    document.addEventListener('keypress',function(event){
                if(event.keyCode === 13 || event.which === 13){
                  ctrlAddItem();
               }
            });
     
     document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
     
     document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changeType);
 };   

    var updateBudget = function(){
        
            //1. CALCULATE THE BUDGET 
               
            budgetCtrl.calculateBudget();
        
            //2. return the budget    
        
            var budget = budgetCtrl.getBudget();
        
            //3.DISPLAY THE BUDGET ON THE UI
        
            UICtrl.displayBudget(budget);
    };
    
    var updatePercentage =function(){
        
        //1. calculate percentage
        
         budgetCtrl.calculatePercentages();
        
        //2. read percentage from the budget controller  
        
        var percentages = budgetCtrl.getPercentage();
        
        //3. update the ui with the new percentage 
        
         UICtrl.displayPercentages(percentages);
    };
  
  var ctrlAddItem = function(){
           // 1. Get The Field input Data
               var input = UICtrl.getInput();
               if(input.description !==""  && !isNaN(input.value) && input.value>0)
            
            {
             
             //2. Add the item to the budget controller 
              var newItem=budgetCtrl.addItem(input.type,input.description,input.value);        
       
            //3. ADD THE ITEM TO THE UI
                   
             UICtrl.addListItem(newItem,input.type);
      
             //4. clear the fields
            UICtrl.clearFiels();
       
            //5. calculate and update budget 
             updateBudget();
            
            //6.calculate and update percentages
             updatePercentage();
          }
    
  };  
    
 var ctrlDeleteItem = function(event){
     var itemId,splitID,type,ID;
     
     itemId =event.target.parentNode.parentNode.parentNode.parentNode.id;
     
     
     if(itemId){
         
         //inc-1
         splitID =itemId.split('-'); 
         type = splitID[0];
         
         //here ID is a string so we need to convert it in nummber  
         ID = parseInt(splitID[1]);
         //1.delete item from ds
            budgetCtrl.deleteItem(type,ID);
         
         //2. delete item from ui
            UICtrl.deleteListItem(itemId);
         
         //3.update and show the new budget
           updateBudget();
         //4. calculate and update percentages
           updatePercentage();
         
         
     }
 }; 
    return{
        init: function(){
            console.log('Appliction has stared');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
            budget :0,
            totalInc :0,
            totalExp: 0,
            percentage: -1 
        });
            setupEventListeners();
        }
    };
 
})(budgetController,UIController);

controller.init();



 