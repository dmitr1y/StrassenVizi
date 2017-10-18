function wrapFormulas() {
    document.getElementById('C_f').innerHTML=katex.renderToString("A * B = C");

    document.getElementById('P1_f').innerHTML=katex.renderToString("P1 = (A_{1,1} + A_{2,2})*(B_{1,1} + B_{2,2})");
    document.getElementById('P2_f').innerHTML=katex.renderToString("P2 = (A_{2,1} + A_{2,2})*B_{1,1}");
    document.getElementById('P3_f').innerHTML=katex.renderToString("P3 = A_{1,1} * (B_{1,2} - B_{2,2})");
    document.getElementById('P4_f').innerHTML=katex.renderToString("P4 = A_{2,2} * (B_{2,1} - B_{1,1})");
    document.getElementById('P5_f').innerHTML=katex.renderToString("P5 = (A_{1,1} + A_{1,2})*B_{2,2}");
    document.getElementById('P6_f').innerHTML=katex.renderToString("P6 = (A_{2,1} - A_{1,1})*(B_{1,1} + B_{1,2})");
    document.getElementById('P7_f').innerHTML=katex.renderToString("P7 = (A_{1,2} - A_{2,2})*(B_{2,1} + B_{2,2})");

    document.getElementById('C11_f').innerHTML=katex.renderToString("C_{1,1} = P_1 + P_4 - P_5 + P_7");
    document.getElementById('C12_f').innerHTML=katex.renderToString("C_{1,2} = P_3 + P_5");
    document.getElementById('C21_f').innerHTML=katex.renderToString("C_{2,1} = P_2 + P_4");
    document.getElementById('C22_f').innerHTML=katex.renderToString("C_{2,2} = P_1 + P_3 - P_2 + P_6");

    wrapSigns();
}

function wrapSigns() {
    wrapSign('sign-plus','+');
    wrapSign('sign-minus','-');
    wrapSign('sign-equal','=');
    wrapSign('sign-multi','*');
    wrapSign('sign-lbracket','(');
    wrapSign('sign-rbracket',')');
}

function wrapSign(className,sign) {
    var blocks=document.getElementsByClassName(className);
    for (var i=0; i<blocks.length;i++)
        blocks[i].innerHTML=katex.renderToString(sign);
}