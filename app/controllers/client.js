$(document).ready(function(){

    var relX
    var relY
    var toBeMoved;
    var highestZ = 0
    var pieces = ["red", "blue", "white", "green"]
    var game = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    var json = {"game": game, "red": "100px,25px", "blue": "150px,115px", "green": "120px,155px", "white": "80px,55px"};
    var socket = io();
    socket.emit("join", game);
    socket.on("dice", function (arr) {
        console.log("recieved arr", arr)
        animateDice(JSON.parse(arr))
      });

    pieces.forEach(function(elem){
        $("#" + elem +"piece, #" + elem + "pieceoverlay").animate({left: json[elem].split(",")[0], top: json[elem].split(",")[1]})
    })
    
     
    function checkTouchDevice() {
       return 'ontouchstart' in document.documentElement;
    }
    
    var isTouchScreen = checkTouchDevice()
    
    if (!isTouchScreen){
    $("#board").mousemove(function(event){ 
                event.preventDefault()
                relX = Math.round(event.pageX - $(this).offset().left);
                relY = Math.round(event.pageY - $(this).offset().top);
                $("#"+toBeMoved).css("top", relY-7 +"px")
                $("#"+toBeMoved).css("left", relX-7 +"px")
                $("#"+toBeMoved + "overlay").css("top", relY-7 +"px")
                $("#"+toBeMoved + "overlay").css("left", relX-7 +"px")
    
            });
    } else {
        $("#board").on('touchmove', function(event){ 
                if (toBeMoved){
                event.preventDefault()
                }
                //alert("anything")
                relX = Math.round(event.pageX - $(this).offset().left);
                relY = Math.round(event.pageY - $(this).offset().top);
                //console.log(relX, relY)
                var bcr = document.getElementById("board").getBoundingClientRect();
                console.log(event.target.id)
                var x = event.targetTouches[0].clientX - bcr.x;
                var y = event.targetTouches[0].clientY - bcr.y;
                console.log("x, y", x, y)
                console.log(/*bcr.x,bcr.y, */event.targetTouches[0].clientX, event.targetTouches[0].clientY)
                console.log("should be static", bcr.x, bcr.y)
                $("#"+toBeMoved).css("top", y-7 +"px")
                $("#"+toBeMoved).css("left", x-7 +"px")
                $("#"+toBeMoved + "overlay").css("top", y-7 +"px")
                $("#"+toBeMoved + "overlay").css("left", x-7 +"px")
    
            });
    }
    
    if (!isTouchScreen){
        $(".pieceoverlay").click(function(e){
            move(e.target.id.split("overl")[0])
        })
    } else {
        $(".pieceoverlay").on("touchstart", function(e){
            move(e.target.id.split("overl")[0])
        })
        $(".pieceoverlay").on("touchend", function(e){
            move(e.target.id.split("overl")[0])
        })
    }
            
    function move(id){
                //console.log(id)
                if (id.length < 3){return}
                if (toBeMoved === undefined){
                     toBeMoved = id
                     highestZ++
                     $("#" + id).css("z-index", highestZ)
                     $("#" + id + "overlay").css("z-index", highestZ)
                } else {
                    var posString = $("#" + id).css("left")+","+$("#" + id).css("top")
                    json[id.split("pie")[0]] = posString
                    console.log(json)
                    toBeMoved = undefined
                }
    }

    $("#kasta").click(kasta)
    
    function kasta(){
        var values = [1,2,3,4,5,6]
        var value
        var valueArr = []
        for (var i = 0; i < 20; i++){
        value = values[Math.floor(Math.random()*6)]
        valueArr.push(value)   
        }
        animateDice(valueArr)
        socket.emit("dice", game, JSON.stringify(valueArr));
    }

    function animateDice(arr){
        for (var i = 0; i < arr.length; i++){
        setTimeout(function(){$("#thedice").attr("src", "/public/img/dice" + arr[0] + ".jpg"); arr.shift()}, i*80)
        }
    }
            
    });

   