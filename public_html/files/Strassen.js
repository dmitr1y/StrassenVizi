/*     
    Author     : Konstantinov Dmitrii
    e-mail: aser00707@ya.ru
*/
var SIZE=1, NormSize=1;
var arr1=null,arr2=null, result=null;

var colorA11='rgb(91,155,213)',colorA12='rgb(237,125,49)',colorA21='rgb(165,165,165)',colorA22='rgb(255,192,0)';
var colorB11='rgb(112,173,71)',colorB12='rgb(5,99,193)',colorB21='rgb(149,79,114)',colorB22='rgb(165,181,146)';
var colorP1='rgb(208,146,167)',colorP2='rgb(127,111,111)',colorP3='rgb(65,138,179)',colorP4='rgb(223,83,39)',colorP5='rgb(159,41,54)',colorP6='rgb(251,238,201)',colorP7='rgb(181,139,128)';
var colorC1='rgb(227,45,145)',colorC2='rgb(78,166,220)',colorC3='rgb(216,217,220)',colorC4='rgb(155,87,211)';

function Initial()
{
   document.getElementById("SizeInput").value=SIZE;
}
function ReadSize()
{
    var SizeInput=document.getElementById("SizeInput");
    var tmp=SizeInput.value;
    if (tmp && isInt(tmp) && tmp>0) {
        SIZE=tmp;
    }
    else {
        alert("Bad size");
    }

}
function isInt(n) {
   return n % 1 === 0;
}
function startStrassen()
{
    NormSize=1;
    var divContent=document.getElementById("content"), divP=document.getElementById("Steps");
    divContent.style.display=divP.style.display= 'block';
    var outR=document.getElementById("result"),
    outA=document.getElementById("matrixA"),
    outB=document.getElementById("matrixB");  
     if (arr1 && arr2) {  
         // СООБЩЕНИЕ: матрица будет расширена
         arr1=NaNtoInt(arr1);
         arr2=NaNtoInt(arr2);
        if (!isExp2(arr1.length)||arr1.length===1) {        
      arr1= AddTo2Matrix(arr1,arr1.length);
      arr2= AddTo2Matrix(arr2,arr2.length);
  }
  //ShowMatrix(arr1,outA);
    ShowColorMatrix(arr1,outA, "A",colorA11,colorA12,colorA21,colorA22);      
    ShowColorMatrix(arr2, outB, "B",colorB11,colorB12,colorB21,colorB22);      
    result= multi(arr1,arr2);          
    ShowColorMatrix(result, outR, "R",colorC1,colorC2,colorC3,colorC4);    
    }
    else {
        ClearMatrixBlock();
       divContent.style.display=divP.style.display='none';
    }
}

function matrixArray(size)
//создание матрицы
{  
  var arr = new Array();
  for(var i=0; i<size; i++){
    arr[i] = new Array();
    for(var j=0; j<size; j++){
      arr[i][j] =Math.floor(Math.random() * (11 + 10) - 10)+1;
    }
  }
  return arr;
}
function ShowMatrix (arr,out, name)
//Вывод матрицы
{
    if (arr) {
        out.innerHTML="";
        var table=document.createElement("table");
        var tbody = document.createElement('tbody');
        //table.id="table_"+name; 
        table.border=1;
        for (var i = 0; i < arr.length; i++) {
            var tr=document.createElement("tr");
            for (var j = 0; j < arr.length; j++) {
                var td=document.createElement("td");
                td.id="td_"+name+"_"+i+"_"+j;
               // td.background='gray';
               td.textContent=arr[i][j];                
                tr.appendChild(td);
            }
            tbody.appendChild(tr);             
        }
       table.appendChild(tbody);
       out.appendChild(table);
    }   
}
function ShowColorMatrix (arr,out, name, color1,color2,color3,color4)
//Вывод матрицы с цветными частями
{
    if (arr) {
        out.innerHTML="";
        var table=document.createElement("table");
        var tbody = document.createElement('tbody');
        //table.id="table_"+name;         
        table.border=1;
        for (var i = 0; i < arr.length; i++) {
            var tr=document.createElement("tr");
            for (var j = 0; j < arr.length; j++) {
                var td=document.createElement("td");
                td.id="td_"+name+"_"+i+"_"+j;
                td.style.borderRadius='15px';
                if ((i<=(arr.length/2))&&(j<(arr.length/2))) {
                    td.style.backgroundColor=color1;
                }
                 if ((i<(arr.length/2))&&(j>=(arr.length/2))) {
                    td.style.backgroundColor=color2;
                }
                 if ((i>=(arr.length/2))&&(j<( arr.length/2))) {
                    td.style.backgroundColor=color3;
                }
                 if ((i>=( arr.length/2))&&(j>=(arr.length/2))) {
                    td.style.backgroundColor=color4;//зеленый
                }
               td.textContent=arr[i][j];                
                tr.appendChild(td);
            }
            tbody.appendChild(tr);             
        }
       table.appendChild(tbody);
       out.appendChild(table);
    }   
}
function DiscreteMatrix(A,startI,startJ,endI,endJ)
//деление матрицы на 4 части
{
var subA=new Array();;
    size=A.length;
  if (size>2)
  {    
    for (var i = startI,k=0; i < endI; k++,i++) {
        subA[k]=new Array();
        for (var j = startJ,g=0; j < endJ; g++,j++) {
            subA[k][g]=A[i][j];
        }
    }   
  }
    if (size===2) {
        subA[0]=new Array();
        subA[0][0]=A[startI][startJ];
    }
    if (size<2) {
        return A;
    }

   return subA;
}

function strassen (A11,A12,A21,A22,B11,B12,B21,B22)
//Алгоритм Штрассена
{
    var P1,P2,P3,P4,P5,P6,P7;
    var C1,C2,C3,C4;
    var C=new Array();    
    P1=multi(summ(A11,A22),summ(B11,B22));
    P2=multi(summ(A21,A22),B11);
    P3=multi(A11,diff(B12,B22));
    P4=multi(A22,diff(B21,B11));
    P5=multi(summ(A11,A12),B22);
    P6=multi(diff(A21,A11),summ(B11,B12));
    P7=multi(diff(A12,A22),summ(B21,B22));  
    C1=summ(P1,summ(P7,diff(P4,P5)));
    C2=summ(P3,P5);    
    C3=summ(P2,P4);
    C4=summ(diff(P1,P2),summ(P3,P6));
    if (C1.length===(SIZE/2)| C1.length===(NormSize/2)) {
        OutputPblock(P1,P2,P3,P4,P5,P6,P7,A11,A12,A21,A22,B11,B12,B21,B22,C1,C2,C3,C4);
    }
    C=compileMatrix(C1,C2,C3,C4);
    return C;
}

function OutputPblock(P1,P2,P3,P4,P5,P6,P7,A11,A12,A21,A22,B11,B12,B21,B22,C1,C2,C3,C4)
{
  var outP1=document.getElementById("1p"),
          outP1_1=document.getElementById("1p_1"),
          outP1_2=document.getElementById("1p_2"),
         outP2=document.getElementById("2p"), 
         outP2_1=document.getElementById("2p_1"),
         outP2_2=document.getElementById("2p_2"),
         outP3=document.getElementById("3p"), 
         outP3_1=document.getElementById("3p_1"), 
         outP3_2=document.getElementById("3p_2"),
         outP4=document.getElementById("4p"), 
         outP4_1=document.getElementById("4p_1"), 
         outP4_2=document.getElementById("4p_2"),
         outP5=document.getElementById("5p"), 
         outP5_1=document.getElementById("5p_1"), 
         outP5_2=document.getElementById("5p_2"),
         outP6=document.getElementById("6p"), 
         outP6_1=document.getElementById("6p_1"),
         outP7=document.getElementById("7p"), 
         outP7_1=document.getElementById("7p_1");
 var outA11=document.getElementById("A11"),
         outA11_1=document.getElementById("A11_1"), 
         outA11_2=document.getElementById("A11_2"), 
         outA11_3=document.getElementById("A11_3"),
         outA12=document.getElementById("A12"), 
         outA12_1=document.getElementById("A12_1"),
         outA21=document.getElementById("A21"), 
         outA21_1=document.getElementById("A21_1"),
         outA22=document.getElementById("A22"), 
         outA22_1=document.getElementById("A22_1"), 
         outA22_2=document.getElementById("A22_2"), 
         outA22_3=document.getElementById("A22_3");
 var outB11=document.getElementById("B11"),
         outB11_1=document.getElementById("B11_1"),
         outB11_2=document.getElementById("B11_2"),
         outB11_3=document.getElementById("B11_3"),        
         outB12=document.getElementById("B12"),
         outB12_1=document.getElementById("B12_1"),
         outB21=document.getElementById("B21"),
         outB21_1=document.getElementById("B21_1"),
         outB22=document.getElementById("B22"),
         outB22_1=document.getElementById("B22_1"),
         outB22_2=document.getElementById("B22_2"),
         outB22_3=document.getElementById("B22_3");
 var outC1=document.getElementById("1c"), 
         outC2=document.getElementById("2c"),
         outC3=document.getElementById("3c"),
         outC4=document.getElementById("4c");
 DisplBrackets(1, "bracketSignPblock", A11.length);
 ShowColorMatrix(C1,outC1, "C1",colorC1,colorC1,colorC1,colorC1);
 ShowColorMatrix(C2,outC2, "C2",colorC2,colorC2,colorC2,colorC2);
 ShowColorMatrix(C3,outC3, "C3",colorC3,colorC3,colorC3,colorC3);
 ShowColorMatrix(C4,outC4, "C4",colorC4,colorC4,colorC4,colorC4);
 ShowColorMatrix(P1,outP1, "P1",colorP1,colorP1,colorP1,colorP1);
 ShowColorMatrix(P2,outP2, "P2",colorP2,colorP2,colorP2,colorP2);
 ShowColorMatrix(P3,outP3, "P3",colorP3,colorP3,colorP3,colorP3);
 ShowColorMatrix(P4,outP4, "P4",colorP4,colorP4,colorP4,colorP4);
 ShowColorMatrix(P5,outP5, "P5",colorP5,colorP5,colorP5,colorP5);
 ShowColorMatrix(P6,outP6, "P6",colorP6,colorP6,colorP6,colorP6);
 ShowColorMatrix(P7,outP7, "P7",colorP7,colorP7,colorP7,colorP7);
 ShowColorMatrix(P1,outP1_1,"P1_1",colorP1,colorP1,colorP1,colorP1);
 ShowColorMatrix(P1,outP1_2,"P1_2",colorP1,colorP1,colorP1,colorP1);
 ShowColorMatrix(P2,outP2_1,"P2_1",colorP2,colorP2,colorP2,colorP2);
 ShowColorMatrix(P2,outP2_2,"P2_2",colorP2,colorP2,colorP2,colorP2);
 ShowColorMatrix(P3,outP3_1,"P3_1",colorP3,colorP3,colorP3,colorP3);
 ShowColorMatrix(P3,outP3_2,"P3_2",colorP3,colorP3,colorP3,colorP3);
 ShowColorMatrix(P4,outP4_1,"P4_1",colorP4,colorP4,colorP4,colorP4);
 ShowColorMatrix(P4,outP4_2,"P4_2",colorP4,colorP4,colorP4,colorP4);
 ShowColorMatrix(P5,outP5_1,"P5_1",colorP5,colorP5,colorP5,colorP5);
 ShowColorMatrix(P5,outP5_2,"P5_2",colorP5,colorP5,colorP5,colorP5);
 ShowColorMatrix(P6,outP6_1,"P6_1",colorP6,colorP6,colorP6,colorP6);
 ShowColorMatrix(P7,outP7_1,"P7_1",colorP7,colorP7,colorP7,colorP7);
 ShowColorMatrix(A11,outA11, "A11",colorA11,colorA11,colorA11,colorA11);
 ShowColorMatrix(A11,outA11_1, "A11_1",colorA11,colorA11,colorA11,colorA11);
 ShowColorMatrix(A11,outA11_2, "A11_2",colorA11,colorA11,colorA11,colorA11);
 ShowColorMatrix(A11,outA11_3, "A11_3",colorA11,colorA11,colorA11,colorA11);
 ShowColorMatrix(A12,outA12, "A12",colorA12,colorA12,colorA12,colorA12); 
 ShowColorMatrix(A12,outA12_1, "A12_1",colorA12,colorA12,colorA12,colorA12);
 ShowColorMatrix(A21,outA21, "A21",colorA21,colorA21,colorA21,colorA21); 
 ShowColorMatrix(A21,outA21_1, "A21_1",colorA21,colorA21,colorA21,colorA21);
 ShowColorMatrix(A22,outA22, "A22",colorA22,colorA22,colorA22,colorA22);
 ShowColorMatrix(A22,outA22_1, "A22_1",colorA22,colorA22,colorA22,colorA22); 
 ShowColorMatrix(A22,outA22_2, "A22_2",colorA22,colorA22,colorA22,colorA22); 
 ShowColorMatrix(A22,outA22_3, "A22_3",colorA22,colorA22,colorA22,colorA22);
 ShowColorMatrix(B11,outB11, "B11",colorB11,colorB11,colorB11,colorB11);
 ShowColorMatrix(B11,outB11_1, "B11_1",colorB11,colorB11,colorB11,colorB11); 
 ShowColorMatrix(B11,outB11_2, "B11_2",colorB11,colorB11,colorB11,colorB11); 
 ShowColorMatrix(B11,outB11_3, "B11_3",colorB11,colorB11,colorB11,colorB11);  
 ShowColorMatrix(B12,outB12, "B12",colorB12,colorB12,colorB12,colorB12); 
 ShowColorMatrix(B12,outB12_1, "B12_1",colorB12,colorB12,colorB12,colorB12);
 ShowColorMatrix(B21,outB21, "B21",colorB21,colorB21,colorB21,colorB21); 
 ShowColorMatrix(B21,outB21_1, "B21_1",colorB21,colorB21,colorB21,colorB21);
 ShowColorMatrix(B22,outB22, "B22",colorB22,colorB22,colorB22,colorB22);
 ShowColorMatrix(B22,outB22_1, "B22_1",colorB22,colorB22,colorB22,colorB22); 
 ShowColorMatrix(B22,outB22_2, "B22_2",colorB22,colorB22,colorB22,colorB22); 
 ShowColorMatrix(B22,outB22_3, "B22_3",colorB22,colorB22,colorB22,colorB22);
}

function summ (A,B)
//cумма матриц
{
      var C=new Array();;
    if (A.length>1&&B.length>1) {            
       
        for (var i = 0; i < A.length; i++) {
            C[i]=new Array();
            for (var j = 0; j < A.length; j++) {
                C[i][j] = A[i][j] + B[i][j];
            }
        }
    }
    else {
        C[0]=new Array();
        C[0][0]=A[0][0]+B[0][0];
    }
    return C;
}

function diff (A,B)
//разность матриц
{
     var C=new Array(); 
    if (A.length>1&&B.length>1) {        
           
        for (var i = 0; i < A.length; i++) {
            C[i]=new Array();
            for (var j = 0; j < A.length; j++) {
                C[i][j] = A[i][j] - B[i][j];
            }
        }
    }
    else {
        C[0]=new Array();
         C[0][0]=A[0][0]-B[0][0];
    }
    return C;
}

function multi(A,B)
//умножение матриц
{
    var C; 
    if (A.length>1&&B.length>1) { 
       var A11,A12,A21,A22;
       var B11,B12,B21,B22;
        A11=DiscreteMatrix(A,0,0,A.length/2,A.length/2);
        B11=DiscreteMatrix(B,0,0,B.length/2,B.length/2);
        A12=DiscreteMatrix(A,0,A.length/2,A.length/2,A.length);
        B12=DiscreteMatrix(B,0,B.length/2,B.length/2,B.length);
        A21=DiscreteMatrix(A,A.length/2,0,A.length,A.length/2);
        B21=DiscreteMatrix(B,B.length/2,0,B.length,B.length/2);
        A22=DiscreteMatrix(A,A.length/2,A.length/2,A.length,A.length);
        B22=DiscreteMatrix(B,B.length/2,B.length/2,B.length,B.length);
        C=strassen (A11,A12,A21,A22,B11,B12,B21,B22);    
    }
    else {
        C=new Array();
        C[0]=new Array();
        C[0][0]=A[0][0]*B[0][0];
    }
    return C;
}

function compileMatrix (A1, A2,A3, A4)
{
    var size=A1.length*2;
    var result=new Array();
    for (var i = 0,k=0; i < size/2; k++,i++) {
        result[i]=new Array();
        for (var j = 0,g=0; j < size/2; g++,j++) {
            result[i][j]=A1[k][g];
        }
    }
    for (var i = 0,k=0; i < size/2; k++,i++) {       
        for (var j = size/2,g=0; j < size; g++,j++) {
            result[i][j]=A2[k][g];
        }
    }
    for (var i = size/2,k=0; i < size; k++,i++) {
        result[i]=new Array();
        for (var j = 0,g=0; j < size/2; g++,j++) {
            result[i][j]=A3[k][g];
        }
    }
    for (var i = size/2,k=0; i < size; k++,i++) {       
        for (var j = size/2,g=0; j < size; g++,j++) {
            result[i][j]=A4[k][g];
        }
    }
    return result;
}

function compareMatrix(A,B)
{
    for (var i = 0; i < A.length; i++) {
        for (var j = 0; j < A.length; j++) {
            if (A[i][j]!==B[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function isExp2(x)
//проверка числа на степень двойки
{
    return (x <= 0) ? 0 : (x & (x-1)) === 0;  
}

function AddTo2Matrix(arr,size)
{
    
    var tmp=size, count=0;      
        while(tmp>=2)
        {
            tmp=tmp >> 1;
            count++;
        }
        NormSize = Math.pow(2, count+1);       
        for (var i = 0; i < size; i++) {
            for (var j = size; j < NormSize; j++) {
                arr[i][j]=0;
            }
        }       
        for (var i = size; i < NormSize; i++) {
            arr[i]=new Array();
            for (var j = 0; j < NormSize; j++) {            
                arr[i][j]=0;
            }
        }
    return arr;
}
function RandMatrix()
{
    var outA=document.getElementById("matrixA"),
    outB=document.getElementById("matrixB"),outR=document.getElementById("result"); 
    outR.innerHTML="";
    result=DeleteArray(result);
    arr1=matrixArray(SIZE);
    arr2=matrixArray(SIZE);
    //  DisplBrackets(1, "bracketSign", 0);
   // ShowMatrix(arr1,outA, "A");         
    //ShowMatrix(arr2, outB, "B"); 
    ShowMainScreen();
}
function DecrementSize(){
    if (SIZE>1)
    {
        SIZE--;
        document.getElementById("SizeInput").value=SIZE;
    }
}
function IncrementSize(){
        SIZE++;
        document.getElementById("SizeInput").value=SIZE;
}
function Reset()
{
    ClearMatrixBlock ;
    document.getElementById("content").style.display=document.getElementById("Steps").style.display= 'none';    
    arr1=DeleteArray(arr1);
    arr2=DeleteArray(arr2);
    result=DeleteArray(result);
    
}    

function ClearMatrixBlock ()
{
    document.getElementById("result").innerHTML=
    document.getElementById("matrixA").innerHTML=
    document.getElementById("matrixB").innerHTML="";
}
function CreateInputs (form, name) {
    var input;
    var table=document.createElement("table");
    var tbody = document.createElement('tbody');
    table.border=0;
    form.innerHTML="";
    for (var i = 0; i < SIZE; i++) {
        var tr=document.createElement("tr");
        for (var j = 0; j < SIZE; j++) {  
            var td=document.createElement("td");             
            input = document.createElement("input");                      
            input.type = "number";        
            input.id=name+"_"+i+"_"+j;
            input.value=0;
            td.appendChild(input);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
     table.appendChild(tbody);
       form.appendChild(table);
}
       
function SetInputMatrix(InputName, arr)
{
    if (arr)
    {
        var size=1;
        if (arr.length<SIZE) {
            size=arr.length;
        }
        else{
            size=SIZE;
        }
        for (var i = 0; i < size; i++) {
            for (var j = 0; j <  size; j++) {
                document.getElementById(InputName+'_'+i+'_'+j).value=arr[i][j];
            }
        }
        for (var i = 0; i < arr.length; i++) {
            for (var j = arr.length; j < SIZE; j++) {                
                document.getElementById(InputName+'_'+i+'_'+j).value=0;
            }
        }
        for (var i = arr.length; i < SIZE; i++) {
            for (var j = 0; j < SIZE; j++) {
                document.getElementById(InputName+'_'+i+'_'+j).value=0;
            }            
        }
    }
    else
    {
       SetNullInputMatrix(InputName);
    }
}
function SetNullInputMatrix(InputName)
{
     for (var i = 0; i < SIZE; i++) {
            for (var j = 0; j <  SIZE; j++) {
                document.getElementById(InputName+'_'+i+'_'+j).value=0;
            }
        }
}

function ClearInputs()
{
    CreateInputs(document.getElementById("matrixA"),"A");
    CreateInputs(document.getElementById("matrixB"),"B");
}

function ReadInput(InputName, arr)
{  
    if (!arr) {
        arr= new Array(SIZE);       
        for (var i = 0; i < SIZE; i++) {
            arr[i]=new Array(SIZE);
        }
    }
    if (SIZE>arr.length) {
        for (var i = arr.length; i < SIZE; i++) {
            arr[i]=new Array(SIZE);
        }
    }
    for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {           
            arr[i][j]= !isNaN(document.getElementById(InputName+'_'+i+'_'+j).value)?document.getElementById(InputName+'_'+i+'_'+j).value:0;
        }
    }
    return arr;
}

function InputMatrix()
{    
    document.getElementById("result").style.display= 
    document.getElementById("SizeManageMain").style.display= 
    document.getElementById("Steps").style.display= 
    document.getElementById("Operations").style.display= 'none';    
    document.getElementById("SizeManageInput").style.display= 'inline-block';
    document.getElementById("content").style.display=document.getElementById("ApplyMatrix").style.display= 'block';
    DisplBrackets(1, "bracketSign", SIZE);
    CreateInputs(document.getElementById("matrixA"),"A");
    SetInputMatrix("A", arr1);
    CreateInputs(document.getElementById("matrixB"),"B");
    SetInputMatrix("B", arr2);
}

function ShowMainScreen()
{
    document.getElementById("SizeManageInput").style.display=document.getElementById("ApplyMatrix").style.display= 'none';
    document.getElementById("result").style.display=
            document.getElementById("content").style.display='block';    
    document.getElementById("SizeManageMain").style.display= 'inline-block';
    document.getElementById("Operations").style.display= 'block';
    startStrassen();
}

function ApplyInput()
{
    arr1=DeleteArray(arr1);
    arr2=DeleteArray(arr2);
    result=DeleteArray(result);   
    arr1=ReadInput("A", arr1);
    arr2=ReadInput("B", arr2);
    ShowMainScreen();   
     var outA=document.getElementById("matrixA"),
    outB=document.getElementById("matrixB");
   ShowColorMatrix(arr1,outA, "A",colorA11,colorA12,colorA21,colorA22);      
    ShowColorMatrix(arr2, outB, "B",colorB11,colorB12,colorB21,colorB22);     
}

function DeleteArray(arr)
{
    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            delete arr[i];
        }
        delete arr;
    }
    return null;
}

function IncrementSizeInput(){
   IncrementSize();
    InputMatrix();
}

function DecrementSizeInput(){
   DecrementSize();
    InputMatrix();
    
}

function ReadSizeInput()
{
    ReadSize();
    InputMatrix();
}

function NaNtoInt(arr)
{
    if (arr) {       
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                arr[i][j]=Number(arr[i][j]);
            }
        }
    }
    return arr;
}

function DisplBrackets(flag, ClassName, size){
var divs=document.getElementsByTagName("DIV");
var param;
    if (flag===1) {
        param='block';
    }
    if (flag===0) {
        param='none';
    }
    if (!size) {
        size=arr1.length>SIZE?arr1.length:SIZE;
        if (size<NormSize) {
            size=NormSize;
        }
    }
for( var i=0; i<divs.length; i++)
	 if(divs[i].className===ClassName){
		 divs[i].style.display='block';
                 divs[i].style.fontSize=size*12.5+'px';
             }
}
