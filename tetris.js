/**
 * Created by dmatt on 10/11/14.
 */
/**
 * The canvas ctx
 **/
var ctx = $('canvas')[0].getContext('2d');
var gameover = false;
var canvas_width  = 800;
var canvas_height = 800;
var gamefield_width = 340;
var gamefield = [];
var binfield = [];
var pixel_size = gamefield_width/10;
var gamefield_height = pixel_size*20;
var fontSize = Math.floor(.75*pixel_size);
var line_padding = pixel_size/7;
var score = 000;
var highscore;
var x = 4;
var y = 0;



var O = {template:[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],color:"#16a085"};
var I = {template:[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],color:"#27ae60"};
var Z = {template:[[0,0,0,0],[0,1,1,0],[0,0,1,1],[0,0,0,0]],color:"#8e44ad"};
var S = {template:[[0,0,0,0],[0,0,1,1],[0,1,1,0],[0,0,0,0]],color:"#f39c12"};
var T = {template:[[0,0,0,0],[0,1,1,1],[0,0,1,0],[0,0,0,0]],color:"#d35400"};
var J = {template:[[0,0,0,0],[0,1,1,1],[0,0,0,1],[0,0,0,0]],color:"#2980b9"};
var L = {template:[[0,0,0,1],[0,1,1,1],[0,0,0,0],[0,0,0,0]],color:"#c0392b"};
var bound = {template:[[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]],color:"#FF00FF"};

var tiles = [O,I,Z,S,T,J,L];

var Ocolor = "#16a085";
var Icolor = "#27ae60";
var Zcolor = "#8e44ad";
var Scolor = "#f39c12";
var Tcolor = "#d35400";
var Jcolor = "#2980b9";
var Lcolor = "#c0392b";

var tile=tiles[Math.floor(Math.random()*tiles.length)];
//var tile = bound;
var shape = tile.template;
var next_tile = tiles[Math.floor(Math.random()*tiles.length)];
var next_shape = next_tile.template;
var next_color = next_tile.color;
var shape_color = tile.color;

$('canvas').css('background-color', 'rgba(158, 167, 184, 0.2)');


initializeGameField();


$(document).ready( function(){
    //Get the canvas &
    $('#my_popup').popup({
        backgroundactive:true
    });
    var c = $('#board');
    var ct = c.get(0).getContext('2d');
    var container = $(c).parent();

    //Run function when browser resizes
    $(window).resize( respondCanvas );

    function respondCanvas(){
        c.attr('width', $(container).width() ); //max width
        c.attr('height', 2*$(container).width() ); //max height
        canvas_width = $(container).width();
        canvas_height = 2*canvas_width;
        if(canvas_width < 700){
            line_padding = canvas_width/138;
            pixel_size = (canvas_width-12*line_padding)/18;
            gamefield_width = pixel_size*10;
            gamefield_height = pixel_size*20;
            fontSize = Math.floor(.75*pixel_size);
            $("p").text("Swipe left, right, and down to move. Swipe up to rotate. Tap to pause. Hold to reset.")
            $("#my_popup").text("Tap to Resume");
        }
        canvas_height = gamefield_height+4*line_padding;
        console.log("pixelsize: ",pixel_size);
        console.log("gheight: ",gamefield_height);
        console.log("gwidth: ",gamefield_width);
        console.log("cheight: ",canvas_height);
        console.log("cwidth: ",canvas_width);
        //Call a function to redraw other content (texts, images etc)
    }

    //Initial call
    respondCanvas();

});




function rgb(r, g, b){
    return "rgb("+r+","+g+","+b+")";
}
function rgb_darken(r, g, b,factor){
    r = Math.floor(r*factor);
    g = Math.floor(g*factor);
    b = Math.floor(b*factor);
//    console.log("red: "+r+"green: "+g+"blue: "+b);
    return rgb(r,g,b);
}
function initializeGameField(){
    for(var i = 0;i<10;i++){
        gamefield[i] = [];
        binfield[i] = [];
        for(var j = 0;j<20;j++){
            gamefield[i][j] = "";
            binfield[i][j] = 0;
        }
    }
}

function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function drawScore(){
    strscore = leftPad(score,5);
    strspeed = leftPad(500-counter,3);
    var sidelen = pixel_size*4+2*line_padding;
    ctx.lineWidth = line_padding*2;
    ctx.strokeStyle = 'gray';
    ctx.strokeRect(canvas_width-sidelen-line_padding,line_padding,sidelen,sidelen);

    ctx.fillStyle = "#323232";
    ctx.fillRect(canvas_width-sidelen,2*line_padding,sidelen-2*line_padding,sidelen-2*line_padding);
    ctx.font = fontSize+"px VT323";
    ctx.fillStyle = "white";
    var scorex = canvas_width-4.13*pixel_size;
    if(supports_html5_storage()){
        highscore = Number(localStorage.high);
        var strhigh = leftPad(highscore,5);
        if(score > highscore){
            highscore = score;
            localStorage.high = highscore;
            strhigh = leftPad(highscore,5);
            console.log(strhigh);
        }
        ctx.fillText("Score: "+strscore,scorex,1.5*pixel_size);
        ctx.fillText("High : "+strhigh,scorex,2.5*pixel_size);
        ctx.fillText("Speed: "+strspeed,scorex,3.5*pixel_size);
    }
    else{
        ctx.fillText("Score: "+strscore,scorex,1.5*pixel_size);
        ctx.fillText("Speed: "+strspeed,scorex,3*pixel_size);
    }

}
function drawDisplay(){
    var sidelen = pixel_size*4+2*line_padding;
    ctx.lineWidth = line_padding*2;
    ctx.strokeStyle = 'gray';
    ctx.strokeRect(line_padding,line_padding,sidelen,sidelen);
    for(i = 0;i<4;i++){
        for(j=0;j<4;j++){
            drawDisplayRect(i,j,"#323232",pixel_size,line_padding);
        }
    }
    ctx.font = fontSize+"px VT323";
    ctx.fillStyle = "white";
    ctx.fillText("Up Next",1.33*pixel_size,2*line_padding +.6*pixel_size);
}

function drawGameField(canvas_width,gamefield_width,gamefield_height,line_padding){
    ctx.lineWidth = line_padding*2;
    ctx.strokeStyle = 'gray';
    ctx.strokeRect((canvas_width-gamefield_width)/2-line_padding,
        line_padding,
        gamefield_width+2*line_padding,
        gamefield_height+2*line_padding);
}

function drawDisplayRect(x,y,color,pixel_size,line_padding){
    var x_pos = line_padding*2+x*pixel_size;
    var y_pos = line_padding*2+y*pixel_size;
    var comp = hexToRgb(color);
    ctx.fillStyle = rgb(comp.r,comp.g,comp.b);
    ctx.fillRect(x_pos,y_pos,pixel_size,pixel_size);
    ctx.lineWidth = line_padding;
    ctx.strokeStyle = rgb_darken(comp.r,comp.g,comp.b,.92);
    ctx.strokeRect(x_pos+line_padding/2,y_pos+line_padding/2,pixel_size-line_padding,pixel_size-line_padding);
}

function pause(){

    if(ispaused){
        timerHelper = setTimeout(Timer, counter);
        $("#my_popup").popup('hide');
        ispaused = false;

    }
    else{
        $("#my_popup").popup('show');
        clearTimeout(timerHelper);
        ispaused = true;
    }
}

function drawDisplayTetromino(template,color){
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (template[i][j] == 1) {
                drawDisplayRect(i,j, color, pixel_size,line_padding);
            }
        }
    }
}

function drawComponentSquare(x,y,color,pixel_size,canvas_width,gamefield_width,line_padding){
    var x_pos = (canvas_width-gamefield_width)/2+x*pixel_size;
    var y_pos = 2*line_padding+y*pixel_size;
    var comp = hexToRgb(color);
    ctx.fillStyle = rgb(comp.r,comp.g,comp.b);
    ctx.fillRect(x_pos,y_pos,pixel_size,pixel_size);
    ctx.lineWidth = line_padding;
    ctx.strokeStyle = rgb_darken(comp.r,comp.g,comp.b,.92);
    ctx.strokeRect(x_pos+line_padding/2,y_pos+line_padding/2,pixel_size-line_padding,pixel_size-line_padding);
}
function placeTetromino(template,x,y){
    var legal = 0;
    for(var i = 0;i<4;i++){
        for(var j = 0;j<4;j++){
            xcoord = x + i-1;
            ycoord = y + j-1;
            xlegal = xcoord <= 9 && xcoord >= 0;
            ylegal = ycoord <= 19 && ycoord >= 0;
            if(!xlegal || !ylegal) {
                if (template[i][j] == 1) {
                    legal++;
                }
            }
            else if(binfield[xcoord][ycoord] == 1&&template[i][j] == 1) {
                //console.log(i,j);
                legal++;
            }

        }
    }
    if(legal == 0 && !ispaused){
        return true;
    }
    else{
        return false;
    }
}
function projectTetromino(template,x,y){
    var projY = y;
    while(placeTetromino(template,x,projY)){
        projY++;
    }
    drawTetromino(template,"#BEBEBE",x,projY-1,pixel_size,canvas_width,gamefield_width,line_padding,true);
}

function drawTetromino(template,color,x,y,pixel_size,canvas_width,gamefield_width,line_padding,legal){
    // template is a 4x4 Array with 1s representing filled squares
    if(legal) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (template[i][j] == 1) {
                    drawComponentSquare(x + i - 1, y + j - 1, color, pixel_size, canvas_width, gamefield_width, line_padding);
                }
            }
        }
    }
}
function checkClear(){
    clearCount = 0;
    for(j=0;j<20;j++){
        canClear = true;
        for(i=0;i<10;i++){
            if(canClear && binfield[i][j] == 1){
                continue;
            }
            else{
                canClear = false;
            }
        }
        if(canClear){
            clearCount++;
            for(i=0;i<10;i++){
                binfield[i][j] = 0;
                gamefield[i][j] = "";
            }
            for(k=j;k>0;k--){
                for(i=0;i<10;i++){
                    binfield[i][k] = binfield[i][k-1];
                    gamefield[i][k] = gamefield[i][k-1];
                }
            }
        }
    }
    score = score + clearCount*100;
    counter = Math.floor(500 - Math.pow(score,.7));
}
function refresh(x,y,shape,color){
    checkClear();
    drawScore();
    drawDisplay();
    drawDisplayTetromino(next_shape,next_color);
    drawGameField(canvas_width,gamefield_width,gamefield_height,line_padding);
    testGameField();
    if(!gameover){projectTetromino(shape,x,y);}
    drawTetromino(shape, color,x,y,pixel_size,canvas_width,gamefield_width,line_padding,placeTetromino(shape,x,y));

}

function rotate(array,dir){
    //clockwise for dir == 1 counter clockwise for dir == -1
    var newArray = [];
    for(var i = 0;i<4;i++){
        newArray[i] = [];
        for(var j=0;j<4;j++){
            if(dir == 1){
                newArray[i][j] = array[j][3-i];
            }
        }
    }
    return newArray;
}

function testGameField(){
    for(var i = 0;i<10;i++){
        for(var j = 0;j<20;j++){
            if(gamefield[i][j] == ""){
                var color = "#323232"
            }
            else{
                var color = gamefield[i][j]
            }
            drawComponentSquare(i,j,color,pixel_size,canvas_width,gamefield_width,line_padding)
        }
    }
}
function lockTile(x,y,shape,shape_color){
    for(i = 0;i<4;i++){
        for(j = 0;j<4;j++){
            if(shape[i][j] == 1){
                gamefield[x+i-1][y+j-1] = shape_color;
                binfield[x+i-1][y+j-1] = 1;
               // console.log(binfield);
            }
        }
    }
}
function move(shape,by_X,by_Y){
    if(placeTetromino(shape,x+by_X,y+by_Y)){
        x = x+by_X;
        y = y+by_Y;
    }
    drawTetromino()
}



var x = 4;
var y = 0;
var tile=tiles[Math.floor(Math.random()*tiles.length)];
//var tile = bound;
var shape = tile.template;
var next_tile = tiles[Math.floor(Math.random()*tiles.length)];
var next_shape = next_tile.template;
var next_color = next_tile.color;
var shape_color = tile.color;
refresh(x,y,shape,shape_color);

function placeNext(){
    x = 5;
    y = 0;
    tile = next_tile;
    shape = next_shape;
    shape_color = next_color;
    next_tile=tiles[Math.floor(Math.random()*tiles.length)];
    next_shape = next_tile.template;
    next_color = next_tile.color;
    if(placeTetromino(shape,x,y)){
        ctx.clearRect(0,0,canvas_width,canvas_height);
        refresh(x,y,shape,shape_color);
    }
    else{
        gameover = true;
    }

}

$(document).on('touchmove', function(e) {
    e.preventDefault();
});

(function($) {
    $.fn.nodoubletapzoom = function() {
        $(this).bind('touchstart', function preventZoom(e) {
            var t2 = e.timeStamp
                , t1 = $(this).data('lastTouch') || t2
                , dt = t2 - t1
                , fingers = e.originalEvent.touches.length;
            $(this).data('lastTouch', t2);
            if (!dt || dt > 500 || fingers > 1) return; // not double-tap

            e.preventDefault(); // double tap - prevent the zoom
            // also synthesize click events we just swallowed up
            $(this).trigger('click').trigger('click');
        });
    };
})(jQuery);
var timeout = 0;
var thresh = 20;
setInterval(function(){ timeout++; }, 5);

var myElement = document.getElementById("myElement");
var mc = new Hammer(myElement);
var ispaused = false;

mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
mc.get('pan').set({ threshold: 10 });
var canMove;
mc.on("press",function(ev){
    var r = confirm("Reset?");
    if (r == true) {
        init()
    }
});
mc.on("panleft", function(ev) {
    //mc.on("panend",function(ev){
        if(placeTetromino(shape,x-1,y)&&timeout>thresh){
            x--;
            timeout = 0;
            ctx.clearRect(0,0,canvas_width,canvas_height);
            refresh(x,y,shape,shape_color);
        }
    //});
});
mc.on("panright",function(ev){
    //mc.on("panend",function(ev){
        if(placeTetromino(shape,x+1,y)&&timeout>thresh) {
            x++;
            timeout = 0;
            ctx.clearRect(0,0,canvas_width,canvas_height);
            refresh(x,y,shape,shape_color);
        }
    //});
});
mc.on("pandown",function(ev)  {
    if(placeTetromino(shape,x,y+1)&&timeout>thresh){
        y++;
        ctx.clearRect(0,0,canvas_width,canvas_height);
        refresh(x,y,shape,shape_color);
    }
});
mc.on("panup",function(ev){
    if(placeTetromino(rotate(shape,1),x,y)&&canMove) {
        shape = rotate(shape, 1);
        canMove = false;
        ctx.clearRect(0,0,canvas_width,canvas_height);
        refresh(x,y,shape,shape_color);
    }
});
mc.on("tap",function(ev){
    pause();
});

var curcounter;
$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
            if(placeTetromino(shape,x-1,y)){
                x--;
            }
            break;

        case 38: // up
            if(placeTetromino(rotate(shape,1),x,y)) {
                shape = rotate(shape, 1);
            }
            break;


        case 39: // right
            if(placeTetromino(shape,x+1,y)){
                x++;
            }
            break;

        case 40: // down
            if(placeTetromino(shape,x,y+1)){
                y++;
            }
            break;
        case 78: //N
            init();
            break;
        case 32:
            while(placeTetromino(shape,x,y+1)){
                y++;
            }
            break;
        case 80: // P
            pause();
            break;
        default: return; // exit this handler for other keys
    }
    ctx.clearRect(0,0,canvas_width,canvas_height);
    refresh(x,y,shape,shape_color);

    e.preventDefault(); // prevent the default action (scroll / move caret)
});
var moveDown = function(){
    if(placeTetromino(shape,x,y+1)){y++;} else{lockTile(x,y,shape,shape_color);placeNext();}
};

function main(){
    if(!gameover){
        moveDown();
        canMove = true;
        ctx.clearRect(0,0,canvas_width,canvas_height);
        refresh(x,y,shape,shape_color);
    }
    else{
       alert("Game Over");
        console.log("Game Over");
    }
}

var counter = 500;
//var myFunction = function(){
//    if(!gameover){
//        clearInterval(interval);
//        main();
//        interval = setInterval(myFunction, counter);
//    }
//    else{
//        main();
//        clearInterval(interval);
//    }
//}
//var interval = setInterval(myFunction, counter);
var timerHelper;
function Timer() {
    if(!gameover){
        timerHelper = setTimeout(Timer, counter);
        main();
    }
    else if(ispaused){
        timerHelper = setTimeout(Timer, counter);
    }
    else{
        main();
        console.log("gameover");
    }
}


function init(){
    clearTimeout(timerHelper);
    x = 4;
    y = 0;
    score = 0;
    if(!localStorage.high){localStorage.high = 0;}
    counter = 500;
    gameover = false;
    tile=tiles[Math.floor(Math.random()*tiles.length)];
    shape = tile.template;
    next_tile = tiles[Math.floor(Math.random()*tiles.length)];
    next_shape = next_tile.template;
    next_color = next_tile.color;
    shape_color = tile.color;
    initializeGameField();
    timerHelper = setTimeout(Timer, counter);

}

init();