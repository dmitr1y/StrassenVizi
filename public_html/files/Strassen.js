/*     
 Author     : Konstantinov Dmitrii
 e-mail: aser00707@ya.ru
 */
var SIZE = 1, NormSize = 1;
var arr1 = null, arr2 = null, result = null;

var colorA = {
    color1: 'rgb(91,155,213)',
    color2: 'rgb(237,125,49)',
    color3: 'rgb(165,165,165)',
    color4: 'rgb(255,192,0)'
};
var colorB = {
    color1: 'rgb(112,173,71)',
    color2: 'rgb(5,99,193)',
    color3: 'rgb(149,79,114)',
    color4: 'rgb(165,181,146)'
};
var colorC = {
    color1: 'rgb(227,45,145)',
    color2: 'rgb(78,166,220)',
    color3: 'rgb(216,217,220)',
    color4: 'rgb(155,87,211)'
};
var colorP = {
    color1: 'rgb(208,146,167)',
    color2: 'rgb(127,111,111)',
    color3: 'rgb(65,138,179)',
    color4: 'rgb(223,83,39)',
    color5: 'rgb(159,41,54)',
    color6: '#996600',
    color7: 'rgb(181,139,128)'
};

function Matrix(array, color) {
    this.array = array;
    this.color = color;
    return this;
}

function Initial()
{
    document.getElementById("SizeInput").value = SIZE;
    SIZE = 8;

    RandMatrix();
}
function ReadSize()
{
    var SizeInput = document.getElementById("SizeInput");
    var tmp = SizeInput.value;
    if (tmp && isInt(tmp) && tmp > 0) {
        SIZE = tmp;
    } else {
        alert("Bad size");
    }

}
function isInt(n) {
    return n % 1 === 0;
}
function startStrassen()
{
    NormSize = 1;
    var divContent = document.getElementById("content"), divP = document.getElementById("Steps");
    divContent.style.display = divP.style.display = 'block';
    var outTOP = document.getElementById("canvasTOP");
    outTOP.width = outTOP.height = 0;
    if (arr1 && arr2) {
        arr1 = NaNtoInt(arr1);
        arr2 = NaNtoInt(arr2);
        if (!isExp2(arr1.length) || arr1.length === 1) {
            // Дополнение матрицы до размера степени двойки
            arr1 = AddTo2Matrix(arr1, arr1.length);
            arr2 = AddTo2Matrix(arr2, arr2.length);
        }
        result = multi(arr1, arr2);
        ShowMainMatrix(arr1, arr2, result, outTOP);
    } else {
        divContent.style.display = divP.style.display = 'none';
    }
}

function randMatrixArray(size)
//генерация случайной матрицы
{
    var arr = new Array();
    for (var i = 0; i < size; i++) {
        arr[i] = new Array();
        for (var j = 0; j < size; j++) {
            arr[i][j] = Math.floor(Math.random() * (11 + 10) - 10) + 1;
        }
    }
    return arr;
}

function wrapText(context, arr, marginLeft, marginTop, lineHeight, color)
{
    var left = marginLeft;
    var top = marginTop;
    var line = "";
    for (var n = 0; n < arr.length; n++) {
        left = marginLeft;
        for (var i = 0; i < arr.length; i++) {
            line = arr[n][i];
            if ((i <= (arr.length / 2)) && (i < (arr.length / 2))) {
                context.fillStyle = color.color1;
            }
            if ((n < (arr.length / 2)) && (i >= (arr.length / 2))) {
                context.fillStyle = color.color2;
            }
            if ((n >= (arr.length / 2)) && (i < (arr.length / 2))) {
                context.fillStyle = color.color3;
            }
            if ((n >= (arr.length / 2)) && (i >= (arr.length / 2))) {
                context.fillStyle = color.color4;
            }
            context.fillText(line, left, top);
            left += 20;
        }
        top += lineHeight;
    }

}

function wrapSign(context, marginLeft, marginTop, sign)
{
    context.beginPath();
    context.font = "16pt Arial";
    context.fillStyle = "#000";
    context.fillText(sign, marginLeft, marginTop);
}

function ShowMainMatrix(arr1, arr2, arr3, out)
//Вывод матрицы
{
    var canvas = out;
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, 12 * arr1.length, 20 * arr1.length);
    canvas.width = (20 * arr1.length + 40) * 3;
    canvas.height = 12 * arr1.length;
    var lineHeight = 12;
    var marginTop = 10;
    context.font = "8pt Arial";
    context.fillStyle = "#000";
    wrapText(context, arr1, 0, marginTop, lineHeight, colorA);
    wrapMatrixBrackets(context, 20 * arr1.length, 12 * arr1.length - marginTop, 0, 0);
    wrapText(context, arr2, 20 * arr1.length + 40, marginTop, lineHeight, colorB);
    wrapText(context, arr3, 20 * arr1.length * 2 + 80, marginTop, lineHeight, colorC);
}

function wrapMatrix(context, arr, marginLeft, marginTop, lineHeight, color)
{
    context.beginPath();
    var left = marginLeft;
    var top = marginTop + 7;
    context.fillStyle = color;
    var sizeY = 12 * arr.length;
    var sizeX = 31 * arr.length;
    var line = "";
    for (var n = 0; n < arr.length; n++) {
        left = marginLeft + 10;
        for (var i = 0; i < arr.length; i++) {
            line = arr[n][i];
            context.fillText(line, left, top);
            left += 30;
        }
        top += lineHeight;
    }
    wrapMatrixBrackets(context, sizeX, sizeY, marginLeft, marginTop - 7);
}

function wrapBracket(context, startPosX, startPosY, height, inverse)
{
    context.beginPath();
    context.lineWidth = 2;
    height += 5;
    var width = 20;
    if (inverse) {
        width *= -1;
    }
    context.beginPath();
    context.moveTo(startPosX, startPosY);
    context.lineTo(startPosX + width, startPosY);
    context.moveTo(startPosX, startPosY);
    context.lineTo(startPosX, startPosY + height + 5);
    context.moveTo(startPosX, startPosY + height + 5);
    context.lineTo(startPosX + width, startPosY + height + 5);
    context.stroke();
}

function wrapMatrixBrackets(context, matrixWidth, matrixHeight, marginLeft, marginTop)
{
    wrapBracket(context, marginLeft, marginTop, matrixHeight, 0);
    wrapBracket(context, marginLeft + matrixWidth, marginTop, matrixHeight, 1);
}

function ShowPMatrix(P1, P2, P3, P4, P5, P6, P7, A11, A12, A21, A22, B11, B12, B21, B22, C1, C2, C3, C4)
{
    var canvas = document.getElementById("canvasP");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, 12 * arr1.length, 20 * arr1.length);
    canvas.width = (40 * P1.array.length) * 5;
    canvas.height = 12 * (P1.array.length) * 11 + 25 * 11;
    var marginLeft = 10;
    var lineHeight = 12;
    var sizeY = lineHeight * P1.array.length;
    var sizeX = 40 * P1.array.length;
    var marginTop = 25;
    var marginLeftSign = P1.array.length * 34.5;
    context.beginPath();
    context.font = "8pt Arial";
    context.fillStyle = "#000";
    var args = [];
    args[0] = P1;
    args[1] = A11;
    args[2] = A22;
    args[3] = B11;
    args[4] = B22;
    args[5] = P2;
    args[6] = A21;
    args[7] = A22;
    args[8] = B11;
    args[9] = P3;
    args[10] = A11;
    args[11] = B12;
    args[12] = B22;
    args[13] = P4;
    args[14] = A22;
    args[15] = B21;
    args[16] = B11;
    args[17] = P5;
    args[18] = A11;
    args[19] = A12;
    args[20] = B22;
    args[21] = P6;
    args[22] = A21;
    args[23] = A11;
    args[24] = B11;
    args[25] = B12;
    args[26] = P7;
    args[27] = A12;
    args[28] = A22;
    args[29] = B21;
    args[30] = B22;
    args[31] = C1;
    args[32] = P1;
    args[33] = P4;
    args[34] = P5;
    args[35] = P7;
    args[36] = C2;
    args[37] = P3;
    args[38] = P5;
    args[39] = C3;
    args[40] = P2;
    args[41] = P4;
    args[42] = C4;
    args[43] = P1;
    args[44] = P2;
    args[45] = P3;
    args[46] = P6;
    var symbArr = ['=', '+', 'x', '+', '=', '+', 'x', '=', 'x', '-', '=', 'x', '-', '=', '+', 'x', '=', '-', 'x', '+', '=', '-', 'x', '+',
        '=', '+', '-', '+', '=', '+', '=', '+', '=', '-', '+', '-'];
    var arrSizes = [5, 4, 4, 4, 4, 5, 5, 5, 3, 3, 5];
    for (var i = 0, top = 10, cur = 0, signcount = 0; i < 11; i++, top += marginTop + sizeY) {
        console.log("top: " + top);
        for (var j = 0, left = 0; j < arrSizes[i]; j++, left += marginLeft + sizeX) {
            wrapMatrix(context, args[cur].array, left, top, lineHeight, args[cur].color);
            if (arrSizes[i] !== (j + 1)) {
                wrapSign(context, left + marginLeftSign, top + sizeY / 2 + 5, symbArr[signcount]);
                signcount++;
            }
            cur++;
            context.font = "8pt Arial";
            context.fillStyle = "#000";
        }
        if (i === 7) {
            wrapLine(context, 0, top - marginTop + 10, canvas.width);
        }
    }
}


function wrapLine(context, x, y, width)
{
    context.beginPath();
    context.lineWidth = 4;
    context.moveTo(x, y);
    context.lineTo(width, y);
    context.stroke();
}

function DiscreteMatrix(A, startI, startJ, endI, endJ)
//деление матрицы на 4 части
{
    var subA = new Array();
    size = A.length;
    if (size > 2)
    {
        for (var i = startI, k = 0; i < endI; k++, i++) {
            subA[k] = new Array();
            for (var j = startJ, g = 0; j < endJ; g++, j++) {
                subA[k][g] = A[i][j];
            }
        }
    }
    if (size === 2) {
        subA[0] = new Array();
        subA[0][0] = A[startI][startJ];
    }
    if (size < 2) {
        return A;
    }
    return subA;
}

function strassen(A11, A12, A21, A22, B11, B12, B21, B22)
//Алгоритм Штрассена
{
    var P1, P2, P3, P4, P5, P6, P7;
    var C1, C2, C3, C4;
    var C;
    P1 = new Matrix(multi(summ(A11.array, A22.array), summ(B11.array, B22.array)), colorP.color1);
    P2 = new Matrix(multi(summ(A21.array, A22.array), B11.array), colorP.color2);
    ;
    P3 = new Matrix(multi(A11.array, diff(B12.array, B22.array)), colorP.color3);
    ;
    P4 = new Matrix(multi(A22.array, diff(B21.array, B11.array)), colorP.color4);
    ;
    P5 = new Matrix(multi(summ(A11.array, A12.array), B22.array), colorP.color5);
    ;
    P6 = new Matrix(multi(diff(A21.array, A11.array), summ(B11.array, B12.array)), colorP.color6);
    ;
    P7 = new Matrix(multi(diff(A12.array, A22.array), summ(B21.array, B22.array)), colorP.color7);
    ;
    C1 = new Matrix(summ(P1.array, summ(P7.array, diff(P4.array, P5.array))), colorC.color1);
    ;
    C2 = new Matrix(summ(P3.array, P5.array), colorC.color2);
    ;
    C3 = new Matrix(summ(P2.array, P4.array), colorC.color3);
    ;
    C4 = new Matrix(summ(diff(P1.array, P2.array), summ(P3.array, P6.array)), colorC.color4);
    ;
    if (C1.array.length === (SIZE / 2) | C1.array.length === (NormSize / 2)) {
        ShowPMatrix(P1, P2, P3, P4, P5, P6, P7, A11, A12, A21, A22, B11, B12, B21, B22, C1, C2, C3, C4);
    }
    C = new compileMatrix(C1.array, C2.array, C3.array, C4.array);
    return C;
}

function summ(A, B)
//cумма матриц
{
    var C = new Array();
    if (A.length > 1 && B.length > 1) {

        for (var i = 0; i < A.length; i++) {
            C[i] = new Array();
            for (var j = 0; j < A.length; j++) {
                C[i][j] = A[i][j] + B[i][j];
            }
        }
    } else {
        C[0] = new Array();
        C[0][0] = A[0][0] + B[0][0];
    }
    return C;
}

function diff(A, B)
//разность матриц
{
    var C = new Array();
    if (A.length > 1 && B.length > 1) {

        for (var i = 0; i < A.length; i++) {
            C[i] = new Array();
            for (var j = 0; j < A.length; j++) {
                C[i][j] = A[i][j] - B[i][j];
            }
        }
    } else {
        C[0] = new Array();
        C[0][0] = A[0][0] - B[0][0];
        //  console.log(C[0][0]);
    }
    return C;
}

function multi(A, B)
//умножение матриц
{
    var C;
    if (A.length > 1 && B.length > 1) {
        var A11, A12, A21, A22;
        var B11, B12, B21, B22;
        A11 = new Matrix(DiscreteMatrix(A, 0, 0, A.length / 2, A.length / 2), colorA.color1);
        B11 = new Matrix(DiscreteMatrix(B, 0, 0, B.length / 2, B.length / 2), colorB.color1);
        A12 = new Matrix(DiscreteMatrix(A, 0, A.length / 2, A.length / 2, A.length), colorA.color2);
        B12 = new Matrix(DiscreteMatrix(B, 0, B.length / 2, B.length / 2, B.length), colorB.color2);
        A21 = new Matrix(DiscreteMatrix(A, A.length / 2, 0, A.length, A.length / 2), colorA.color3);
        B21 = new Matrix(DiscreteMatrix(B, B.length / 2, 0, B.length, B.length / 2), colorB.color3);
        A22 = new Matrix(DiscreteMatrix(A, A.length / 2, A.length / 2, A.length, A.length), colorA.color4);
        B22 = new Matrix(DiscreteMatrix(B, B.length / 2, B.length / 2, B.length, B.length), colorB.color4);
        C = strassen(A11, A12, A21, A22, B11, B12, B21, B22);
    } else {
        C = new Array();
        C[0] = new Array();
        C[0][0] = A[0][0] * B[0][0];
    }
    return C;
}

function compileMatrix(A1, A2, A3, A4)
//сбор матрицы из четырех частей
{
    var size = A1.length * 2;
    var result = new Array();
    for (var i = 0, k = 0; i < size / 2; k++, i++) {
        result[i] = new Array();
        for (var j = 0, g = 0; j < size / 2; g++, j++) {
            result[i][j] = A1[k][g];
        }
    }
    for (var i = 0, k = 0; i < size / 2; k++, i++) {
        for (var j = size / 2, g = 0; j < size; g++, j++) {
            result[i][j] = A2[k][g];
        }
    }
    for (var i = size / 2, k = 0; i < size; k++, i++) {
        result[i] = new Array();
        for (var j = 0, g = 0; j < size / 2; g++, j++) {
            result[i][j] = A3[k][g];
        }
    }
    for (var i = size / 2, k = 0; i < size; k++, i++) {
        for (var j = size / 2, g = 0; j < size; g++, j++) {
            result[i][j] = A4[k][g];
        }
    }
    return result;
}

function isExp2(x)
//проверка числа на степень двойки
{
    return (x <= 0) ? 0 : (x & (x - 1)) === 0;
}

function AddTo2Matrix(arr, size)
//расширение матрицы до размера степени двойки
{
    var tmp = size, count = 0;
    while (tmp >= 2)
    {
        tmp = tmp >> 1;
        count++;
    }
    NormSize = Math.pow(2, count + 1);
    for (var i = 0; i < size; i++) {
        for (var j = size; j < NormSize; j++) {
            arr[i][j] = 0;
        }
    }
    for (var i = size; i < NormSize; i++) {
        arr[i] = new Array();
        for (var j = 0; j < NormSize; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}
function RandMatrix()
{
    result = DeleteArray(result);
    arr1 = randMatrixArray(SIZE);
    arr2 = randMatrixArray(SIZE);
    ShowMainScreen();
}
function DecrementSize() {
    if (SIZE > 1)
    {
        SIZE--;
        document.getElementById("SizeInput").value = SIZE;
    }
}
function IncrementSize() {
    SIZE++;
    document.getElementById("SizeInput").value = SIZE;
}
function Reset()
{
    document.getElementById("content").style.display = document.getElementById("Steps").style.display = 'none';
    arr1 = DeleteArray(arr1);
    arr2 = DeleteArray(arr2);
    result = DeleteArray(result);

}

function CreateInputs(form, name) {
    var input;
    var table = document.createElement("table");
    var tbody = document.createElement('tbody');
    table.border = 0;
    form.innerHTML = "";
    for (var i = 0; i < SIZE; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < SIZE; j++) {
            var td = document.createElement("td");
            input = document.createElement("input");
            input.type = "number";
            input.id = name + "_" + i + "_" + j;
            input.value = 0;
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
        var size = 1;
        if (arr.length < SIZE) {
            size = arr.length;
        } else {
            size = SIZE;
        }
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                document.getElementById(InputName + '_' + i + '_' + j).value = arr[i][j];
            }
        }
        for (var i = 0; i < arr.length; i++) {
            for (var j = arr.length; j < SIZE; j++) {
                document.getElementById(InputName + '_' + i + '_' + j).value = 0;
            }
        }
        for (var i = arr.length; i < SIZE; i++) {
            for (var j = 0; j < SIZE; j++) {
                document.getElementById(InputName + '_' + i + '_' + j).value = 0;
            }
        }
    } else
    {
        SetNullInputMatrix(InputName);
    }
}
function SetNullInputMatrix(InputName)
{
    for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
            document.getElementById(InputName + '_' + i + '_' + j).value = 0;
        }
    }
}

function ClearInputs()
{
    CreateInputs(document.getElementById("matrixA"), "A");
    CreateInputs(document.getElementById("matrixB"), "B");
}

function ReadInput(InputName, arr)
{
    if (!arr) {
        arr = new Array(SIZE);
        for (var i = 0; i < SIZE; i++) {
            arr[i] = new Array(SIZE);
        }
    }
    if (SIZE > arr.length) {
        for (var i = arr.length; i < SIZE; i++) {
            arr[i] = new Array(SIZE);
        }
    }
    for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
            arr[i][j] = !isNaN(document.getElementById(InputName + '_' + i + '_' + j).value) ? document.getElementById(InputName + '_' + i + '_' + j).value : 0;
        }
    }
    return arr;
}

function InputMatrix()
{
    document.getElementById("SizeManageMain").style.display =
            document.getElementById("Steps").style.display =
            document.getElementById("Operations").style.display = 'none';
    document.getElementById("SizeManageInput").style.display = 'inline-block';
    document.getElementById("content").style.display = document.getElementById("ApplyMatrix").style.display = 'block';
    CreateInputs(document.getElementById("matrixA"), "A");
    SetInputMatrix("A", arr1);
    CreateInputs(document.getElementById("matrixB"), "B");
    SetInputMatrix("B", arr2);
}

function ShowMainScreen()
{
    document.getElementById("SizeManageInput").style.display = document.getElementById("ApplyMatrix").style.display = 'none';
    document.getElementById("content").style.display = 'block';
    document.getElementById("SizeManageMain").style.display = 'inline-block';
    document.getElementById("Operations").style.display = 'block';
    startStrassen();
}

function ApplyInput()
{
    arr1 = DeleteArray(arr1);
    arr2 = DeleteArray(arr2);
    result = DeleteArray(result);
    arr1 = ReadInput("A", arr1);
    arr2 = ReadInput("B", arr2);
    ShowMainScreen();
//     var outA=document.getElementById("matrixA"),
//    outB=document.getElementById("matrixB");
//    ShowColorMatrix(arr1,outA, "A",colorA11,colorA12,colorA21,colorA22);      
//    ShowColorMatrix(arr2, outB, "B",colorB11,colorB12,colorB21,colorB22);     
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

function IncrementSizeInput() {
    IncrementSize();
    InputMatrix();
}

function DecrementSizeInput() {
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
                arr[i][j] = Number(arr[i][j]);
            }
        }
    }
    return arr;
}

function DisplBrackets(flag, ClassName, size) {
    var divs = document.getElementsByTagName("DIV");
    var param;
    if (flag === 1) {
        param = 'block';
    }
    if (flag === 0) {
        param = 'none';
    }
    if (!size) {
        size = arr1.length > SIZE ? arr1.length : SIZE;
        if (size < NormSize) {
            size = NormSize;
        }
    }
    for (var i = 0; i < divs.length; i++)
        if (divs[i].className === ClassName) {
            divs[i].style.display = 'block';
            divs[i].style.fontSize = size * 12.5 + 'px';
        }
}
