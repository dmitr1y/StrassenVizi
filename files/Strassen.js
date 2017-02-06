/*     
 Author     : Konstantinov Dmitrii
 e-mail: aser00707@ya.ru
 */
var SIZE = 8, NormSize = 1, MAXSIZE = 128; //Выше значения MAXSIZE канвас не может вывести изображения из-за слишком большого размера
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

function Initial() {
    document.getElementById("SizeInput").value = SIZE;
    RandMatrix();
}
function ReadSize() {
    var SizeInput = document.getElementById("SizeInput");
    var tmp = SizeInput.value;
    if (tmp && isInt(tmp) && tmp > 0) {
        if (tmp > MAXSIZE)
            alert("Слишком большой размер");
        else
            SIZE = tmp;
    } else {
        alert("Bad size");
    }

}
function isInt(n) {
    return n % 1 === 0;
}
function startStrassen() {
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
    var arr = [];
    for (var i = 0; i < size; i++) {
        arr[i] = [];
        for (var j = 0; j < size; j++) {
            arr[i][j] = Math.floor(Math.random() * (11 + 10) - 10) + 1;
        }
    }
    return arr;
}

function wrapText(context, arr, marginLeft, marginTop, lineHeight, color) {
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
            left += 24;
        }
        top += lineHeight;
    }

}

function wrapSign(context, marginLeft, marginTop, sign) {
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
    canvas.width = (24 * arr1.length + 40) * 3;
    canvas.height = 12 * arr1.length + 6;
    var lineHeight = 12;
    var marginTop = 12;
    context.font = "8pt Arial";
    context.fillStyle = "#000";
    wrapText(context, arr1, 6, marginTop, lineHeight, colorA);
    wrapMatrixBrackets(context, 24 * arr1.length, 12 * arr1.length - marginTop + 3, 0, 2);
    wrapText(context, arr2, 24 * arr1.length + 46, marginTop, lineHeight, colorB);
    wrapMatrixBrackets(context, 24 * arr1.length, 12 * arr1.length - marginTop + 3, 24 * arr1.length + 40, 2);
    wrapText(context, arr3, 24 * arr1.length * 2 + 82, marginTop, lineHeight, colorC);
    wrapMatrixBrackets(context, 24 * arr1.length, 12 * arr1.length - marginTop + 3, (24 * arr1.length + 40) * 2, 2);
}

function wrapMatrix(context, matrix, marginLeft, marginTop, lineHeight) {
    context.beginPath();
    var left = marginLeft;
    var top = marginTop + 7;
    context.fillStyle = matrix.color;
    var sizeY = 12 * matrix.array.length;
    var sizeX = 31 * matrix.array.length;
    var line = "";
    for (var n = 0; n < matrix.array.length; n++) {
        left = marginLeft + 10;
        for (var i = 0; i < matrix.array.length; i++) {
            line = matrix.array[n][i];
            context.fillText(line, left, top);
            left += 30;
        }
        top += lineHeight;
    }
    wrapMatrixBrackets(context, sizeX, sizeY, marginLeft, marginTop - 7);
}

function wrapBracket(context, startPosX, startPosY, height, inverse) {
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

function wrapMatrixBrackets(context, matrixWidth, matrixHeight, marginLeft, marginTop) {
    wrapBracket(context, marginLeft, marginTop, matrixHeight, 0);
    wrapBracket(context, marginLeft + matrixWidth, marginTop, matrixHeight, 1);
}

function ShowPMatrix(P1, P2, P3, P4, P5, P6, P7, A11, A12, A21, A22, B11, B12, B21, B22, C1, C2, C3, C4) {
    var canvas = document.getElementById("canvasP");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, 12 * arr1.length, 20 * arr1.length);
    canvas.width = (40 * P1.array.length) * 5.1;
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
    var mtrixArray = [A11, A12, A21, A22, B11, B12, B21, B22, C1, C2, C3, C3, P1, P2, P3, P4, P5, P6, P7];
    var matrixOrder = [12, 0, 3, 4, 7, 13, 2, 3, 4, 14, 0, 5, 7, 15, 3, 6, 4, 16, 0, 1, 7, 17, 2, 0, 4, 5,
        18, 1, 3, 6, 7, 8, 12, 15, 16, 18, 9, 14, 16, 10, 13, 15, 11, 12, 13, 14, 17];
    var matrixQuantityInString = [5, 4, 4, 4, 4, 5, 5, 5, 3, 3, 5];
    var symbArr = ['=', '+', 'x', '+', '=', '+', 'x', '=', 'x', '-', '=', 'x', '-', '=', '+', 'x', '=', '-',
        'x', '+', '=', '-', 'x', '+', '=', '+', '-', '+', '=', '+', '=', '+', '=', '-', '+', '-'];
    for (var i = 0, top = 10, cur = 0, signcount = 0; i < 11; i++, top += marginTop + sizeY) {
        for (var j = 0, left = 0; j < matrixQuantityInString[i]; j++, left += marginLeft + sizeX) {
            wrapMatrix(context, mtrixArray[matrixOrder[cur]], left, top, lineHeight);
            if (matrixQuantityInString[i] !== (j + 1)) {
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


function wrapLine(context, x, y, width) {
    context.beginPath();
    context.lineWidth = 4;
    context.moveTo(x, y);
    context.lineTo(width, y);
    context.stroke();
}

function DiscreteMatrix(A, startI, startJ, endI, endJ)
//деление матрицы на 4 части
{
    var subA = [];
    size = A.length;
    if (size > 2) {
        for (var i = startI, k = 0; i < endI; k++, i++) {
            subA[k] = [];
            for (var j = startJ, g = 0; j < endJ; g++, j++) {
                subA[k][g] = A[i][j];
            }
        }
    }
    if (size === 2) {
        subA[0] = [];
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
    P3 = new Matrix(multi(A11.array, diff(B12.array, B22.array)), colorP.color3);
    P4 = new Matrix(multi(A22.array, diff(B21.array, B11.array)), colorP.color4);
    P5 = new Matrix(multi(summ(A11.array, A12.array), B22.array), colorP.color5);
    P6 = new Matrix(multi(diff(A21.array, A11.array), summ(B11.array, B12.array)), colorP.color6);
    P7 = new Matrix(multi(diff(A12.array, A22.array), summ(B21.array, B22.array)), colorP.color7);
    C1 = new Matrix(summ(P1.array, summ(P7.array, diff(P4.array, P5.array))), colorC.color1);
    C2 = new Matrix(summ(P3.array, P5.array), colorC.color2);
    C3 = new Matrix(summ(P2.array, P4.array), colorC.color3);
    C4 = new Matrix(summ(diff(P1.array, P2.array), summ(P3.array, P6.array)), colorC.color4);
    if (C1.array.length === (SIZE / 2) | C1.array.length === (NormSize / 2)) {
        ShowPMatrix(P1, P2, P3, P4, P5, P6, P7, A11, A12, A21, A22, B11, B12, B21, B22, C1, C2, C3, C4);
    }
    C = new compileMatrix(C1.array, C2.array, C3.array, C4.array);
    return C;
}

function summ(A, B)
//cумма матриц
{
    var C = [];
    if (A.length > 1 && B.length > 1) {

        for (var i = 0; i < A.length; i++) {
            C[i] = [];
            for (var j = 0; j < A.length; j++) {
                C[i][j] = A[i][j] + B[i][j];
            }
        }
    } else {
        C[0] = [];
        C[0][0] = A[0][0] + B[0][0];
    }
    return C;
}

function diff(A, B)
//разность матриц
{
    var C = [];
    if (A.length > 1 && B.length > 1) {

        for (var i = 0; i < A.length; i++) {
            C[i] = [];
            for (var j = 0; j < A.length; j++) {
                C[i][j] = A[i][j] - B[i][j];
            }
        }
    } else {
        C[0] = [];
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
        C = [];
        C[0] = [];
        C[0][0] = A[0][0] * B[0][0];
    }
    return C;
}

function compileMatrix(A1, A2, A3, A4)
//сбор матрицы из четырех частей
{
    var size = A1.length * 2;
    var result = [];
    for (var i = 0, k = 0; i < size / 2; k++, i++) {
        result[i] = [];
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
        result[i] = [];
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
    while (tmp >= 2) {
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
        arr[i] = [];
        for (var j = 0; j < NormSize; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}
function RandMatrix() {
    result = DeleteArray(result);
    arr1 = randMatrixArray(SIZE);
    arr2 = randMatrixArray(SIZE);
    ShowMainScreen();
}
function DecrementSize() {
    if (SIZE > 1) {
        SIZE--;
        document.getElementById("SizeInput").value = SIZE;
    }
}
function IncrementSize() {
    SIZE++;
    document.getElementById("SizeInput").value = SIZE;
}
function Reset() {
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

function SetInputMatrix(InputName, arr) {
    if (arr) {
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
    } else {
        SetNullInputMatrix(InputName);
    }
}
function SetNullInputMatrix(InputName) {
    for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
            document.getElementById(InputName + '_' + i + '_' + j).value = 0;
        }
    }
}

function ClearInputs() {
    CreateInputs(document.getElementById("matrixA"), "A");
    CreateInputs(document.getElementById("matrixB"), "B");
}

function ReadInput(InputName, arr) {
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

function InputMatrix() {
    document.getElementById("SizeManageMain").style.display =
        document.getElementById("Steps").style.display =
            document.getElementById("canvasTOP").style.display =
                document.getElementById("Operations").style.display = 'none';
    document.getElementById("SizeManageInput").style.display = 'inline-block';
    document.getElementById("content").style.display = document.getElementById("InputMenu").style.display = 'block';
    document.getElementById("matrixA").style.display = 'inline-block';
    document.getElementById("matrixB").style.cssText = 'display:inline-block ;margin-left:3%';
    CreateInputs(document.getElementById("matrixA"), "A");
    SetInputMatrix("A", arr1);
    CreateInputs(document.getElementById("matrixB"), "B");
    SetInputMatrix("B", arr2);
}

function ShowMainScreen() {
    document.getElementById("SizeManageInput").style.display =
        document.getElementById("matrixA").style.display =
            document.getElementById("matrixB").style.display =
                document.getElementById("InputMenu").style.display = 'none';
    document.getElementById("content").style.display =
        document.getElementById("canvasTOP").style.display = 'block';
    document.getElementById("SizeManageMain").style.display = 'inline-block';
    document.getElementById("Operations").style.display = 'block';
    startStrassen();
}

function ApplyInput() {
    arr1 = DeleteArray(arr1);
    arr2 = DeleteArray(arr2);
    result = DeleteArray(result);
    arr1 = ReadInput("A", arr1);
    arr2 = ReadInput("B", arr2);
    ShowMainScreen();
}

function DeleteArray(arr) {
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

function ReadSizeInput() {
    ReadSize();
    InputMatrix();
}

function NaNtoInt(arr) {
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
    // var param;
    // if (flag === 1) {
    //     param = 'block';
    // }
    // if (flag === 0) {
    //     param = 'none';
    // }
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
