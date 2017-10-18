/*     
 Author     : Konstantinov Dmitrii
 e-mail: dmitriy@konstantinov.com.ru
 */
var SIZE = 1, NormSize = 1;
var arr1 = null, arr2 = null, result = null;

var maxCellSize=0;

const colorA = {
    color1: '#5b9bd5',
    color2: '#ed7d31',
    color3: '#a5a5a5',
    color4: '#ffc000'
};
const colorB = {
    color1: '#70ad47',
    color2: '#0563c1',
    color3: '#954f72',
    color4: '#a5b592'
};
const colorC = {
    color1: '#e32d91',
    color2: '#4ea6dc',
    color3: '#d8d9dc',
    color4: '#9b57d3'
};
const colorP = {
    color1: '#d092a7',
    color2: '#7f6f6f',
    color3: '#418ab3',
    color4: '#df5327',
    color5: '#9f2936',
    color6: '#996600',
    color7: '#b58b80'
};

function Matrix(array, color) {
    this.array = array;
    this.color = color;
    return this;
}

function Initial() {
    SIZE = 8;
    document.getElementById("SizeInput").value = SIZE;
    RandMatrix();
    wrapFormulas();
}

function ReadSize() {
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

function startStrassen() {
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
    NormSize = 1;
    var divContent = document.getElementById("content"), divP = document.getElementById("Steps");
    divContent.style.display = divP.style.display = 'block';
    if (arr1 && arr2) {
        arr1 = NaNtoInt(arr1);
        arr2 = NaNtoInt(arr2);
        if (!isExp2(arr1.length) || arr1.length === 1) {
            // Дополнение матрицы до размера степени двойки
            arr1 = AddTo2Matrix(arr1, arr1.length);
            arr2 = AddTo2Matrix(arr2, arr2.length);
        }
        result = multi(arr1, arr2);
        ShowMainMatrix(arr1, arr2, result);
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

function wrapText(context, arr, marginLeft, marginTop, lineHeight, color,colorMode ) {
    var left = marginLeft;
    var top = marginTop;
    var line = "";
    context.canvas.style.width=25*arr.length+'px';
    context.canvas.style.height=12*arr.length+'px';
    for (var n = 0; n < arr.length; n++) {
        left = marginLeft;
        for (var i = 0; i < arr.length; i++) {
            line = arr[n][i];
            if (colorMode ==='multi') {
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
            }else {
                context.fillStyle = color;
            }
            context.fillText(line, left, top);
            left += 25;
        }
        top += lineHeight;
    }

}

function ShowMainMatrix(arr1, arr2, arr3)
//Вывод матрицы
{
    var mA = document.getElementById("canvasA").getContext("2d");
    var mB = document.getElementById("canvasB").getContext("2d");
    var mC = document.getElementById("canvasC").getContext("2d");

    var mWidth = 25 * arr1.length ,
        mHeight = 13 * arr1.length;
    mA.canvas.width = mB.canvas.width = mC.canvas.width = mWidth;
    mA.canvas.height = mB.canvas.height = mC.canvas.height = mHeight;
    clearCanvas(mA, mHeight, mWidth);
    clearCanvas(mB, mHeight, mWidth);
    clearCanvas(mC, mHeight, mWidth);

    var lineHeight = 12;
    var marginTop = 12;
    mA.font = mB.font = mC.font = "8pt Arial";
    mA.fillStyle = mB.fillStyle = mC.fillStyle = "#000";
    wrapText(mA, arr1, 10, marginTop, lineHeight, colorA,'multi');
    // wrapMatrixBrackets(mA, 25.5 * arr1.length, 11.5 * arr1.length, 0, 0);

    wrapText(mB, arr2, 10, marginTop, lineHeight, colorB,'multi');
    // wrapMatrixBrackets(mB, 25.5 * arr1.length, 11.5 * arr1.length, 0, 0);

    wrapText(mC, arr3, 10, marginTop, lineHeight, colorC,'multi');
    // wrapMatrixBrackets(mC, 25.5 * arr1.length, 11.5 * arr1.length, 0, 0);
}

function clearCanvas(context, height, weight) {
    context.clearRect(0, 0, height, weight);
}

function ShowPMatrix(P1, P2, P3, P4, P5, P6, P7, A11, A12, A21, A22, B11, B12, B21, B22, C1, C2, C3, C4) {
    var allMatrix = [A11, A12, A21, A22, B11, B12, B21, B22, C1, C2, C3, C4, P1, P2, P3, P4, P5, P6, P7];
    var mP = {
        P1: {
            order: [12, 0, 3, 4, 7],
            color : colorP.color1
        },
        P2: {
            order: [13, 2, 3, 4],
            color : colorP.color2
        },
        P3: {
            order: [14, 0, 5, 7],
            color : colorP.color3
        },
        P4: {
            order: [15, 3, 6, 4],
            color : colorP.color4
        },
        P5: {
            order: [16, 0, 1, 7],
            color : colorP.color5
        },
        P6: {
            order: [17, 2, 0, 4, 5],
            color : colorP.color6
        },
        P7: {
            order: [18, 1, 3, 6, 7],
            color : colorP.color7
        }
    };
    var mC = {
        C1: {
            order: [8, 12, 15, 16, 18]
        },
        C2: {
            order: [9, 14, 16]
        },
        C3:{
            order:[0, 13, 15]
        },
        C4:{
            order:[11, 12, 13, 14, 17]
        }
    };
    for (var k = 1; k <= 7; k++) {
        for (var l = 0; l < mP["P" + k].order.length; l++) {
            var context = document.getElementById('P' + k + '_'+l).getContext('2d');
            context.font = "8pt Arial";
            context.canvas.width = allMatrix[mP['P'+k].order[l]].array.length*25+5;
            context.canvas.height = allMatrix[mP['P'+k].order[l]].array.length*12;
            wrapText(context,allMatrix[mP['P'+k].order[l]].array,5,10,12,allMatrix[mP['P'+k].order[l]].color);
        }
    }
    for (var i=1; i<=4; i++){
        for (var j=0; j< mC["C"+i].order.length;j++){
            var cnx = document.getElementById('C' + i + '_'+j).getContext('2d');
            cnx.font = "8pt Arial";
            cnx.canvas.width = allMatrix[mC['C'+i].order[j]].array.length*25+5;
            cnx.canvas.height = allMatrix[mC['C'+i].order[j]].array.length*12;
            wrapText(cnx,allMatrix[mC['C'+i].order[j]].array,5,10,12,allMatrix[mC['C'+i].order[j]].color);
        }
    }
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
            // document.getElementById("canvasTOP").style.display =
            document.getElementById("Operations").style.display = 'none';
    document.getElementById("SizeManageInput").style.display = 'inline-block';
    document.getElementById("content").style.display = document.getElementById("ApplyMatrix").style.display = 'block';
    document.getElementById("matrixA").style.display = 'inline-block';
    document.getElementById("matrixB").style.cssText = 'display:inline-block; margin-left:3%';
    CreateInputs(document.getElementById("matrixA"), "A");
    SetInputMatrix("A", arr1);
    CreateInputs(document.getElementById("matrixB"), "B");
    SetInputMatrix("B", arr2);
}

function ShowMainScreen() {
    document.getElementById("SizeManageInput").style.display =
        document.getElementById("matrixA").style.display =
            document.getElementById("matrixB").style.display =
                document.getElementById("ApplyMatrix").style.display = 'none';
    document.getElementById("content").style.display =
        // document.getElementById("canvasTOP").style.display = 'block';
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