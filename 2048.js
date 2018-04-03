$.fn.make2048 = function(option){
    var defaultOption = {
        width:4,
        height:4,
        style:{
            background_color:"rgb(184,175,158)",
            block_background_color:"rgb(204,192,178)",
            padding:18,
            block_size:100,
            block_style:{
                "font-family":"微软雅黑",
                "font-weight":"bold",
                "text-align":"center",
            }
        },
        blocks:[
            {level:0,value:2,style:{"background-color":"rgb(238,228,218)","color":"rgb(124,115,106)","font-size":58}},
            {level:1,value:4,style:{"background-color":"rgb(236,224,200)","color":"rgb(124,115,106)","font-size":58}},
            {level:2,value:8,style:{"background-color":"rgb(242,177,121)","color":"rgb(255,247,235)","font-size":58}},
            {level:3,value:16,style:{"background-color":"rgb(245,149,99)","color":"rgb(255,250,233)","font-size":50}},
            {level:4,value:32,style:{"background-color":"rgb(244,123,94)","color":"rgb(255,247,235)","font-size":50}},
            {level:5,value:64,style:{"background-color":"rgb(247,90,59)","color":"rgb(255,247,235)","font-size":50}},
            {level:6,value:128,style:{"background-color":"rgb(236,205,112)","color":"rgb(255,247,235)","font-size":42}},
            {level:7,value:256,style:{"background-color":"rgb(237,200,80)","color":"rgb(255,247,235)","font-size":42}},
            {level:8,value:512,style:{"background-color":"rgb(237,204,97)","color":"rgb(124,115,106)","font-size":42}},
            {level:9,value:1024,style:{"background-color":"rgb(236,200,80)","color":"rgb(124,115,106)","font-size":34}},
            {level:10,value:2048,style:{"background-color":"rgb(238,194,46)","color":"rgb(124,115,106)","font-size":34}},
            {level:11,value:4096,style:{"background-color":"rgb(61,58,51)","color":"rgb(124,115,106)","font-size":34}},
            {level:12,value:8192,style:{"background-color":"rgb(238,228,218)","color":"rgb(124,115,106)","font-size":34}},
        ],
        animateSpeed:300
    }
    var state = [];

    option = $.extend({},defaultOption,option);
    
    if(this.length > 1) throw "一次只能开始一个游戏";
    if(this.length = 0) throw "未找到游戏容器";

    
    var $this = $(this[0]);

    //设置最外层背景
    $this.css({
        "background-color":option.style.background_color,
        "border-radius":option.style.padding,
        "position":"relative",
        "-webkit-user-select":"none"
    })
    //创建游戏块位置的方法
    var getPosition = function(x,y){
        return{
            "top":option.style.padding + y * (option.style.block_size + option.style.padding),
            "left":option.style.padding + x * (option.style.block_size + option.style.padding)
        }
    }
    //创建游戏移动块
    var buildBackground = function(){
        var backgrounds = [];
        for(var x = 0;x<option.width;x++){
            for(var y = 0;y<option.height;y++){
                state.push(null);
                var bg_block = $("<div></div>");
                var position = getPosition(x,y);
                bg_block.css({
                    "width":option.style.block_size,
                    "height":option.style.block_size,
                    "background-color":option.style.block_background_color,
                    "position":"absolute",
                    "top":position.top,
                    "left":position.left,
                })
                backgrounds.push(bg_block);
            }   
        }
        $this.append(backgrounds);
        $this.width((option.style.padding + option.style.block_size) * option.width + option.style.padding);
        $this.height((option.style.padding + option.style.block_size) * option.height + option.style.padding);
    }
    

    var getCoordinate = function(index){//得到坐标
        return{
            x:index % option.width,
            y:Math.floor(index / option.width),
        }
    }

    var getIndex = function(x,y){
        return x + y * option.width;
    }

    var getBlock = function(x,y){
        return state[getIndex(x,y)]
    }

    var getEmptyBlockIndexs = function(){
        var emptyBlockIndexs = [];
        $(state).each(function(i,o){           
            if(o == null) emptyBlockIndexs.push(i);
        })
        return emptyBlockIndexs;
    }

    var buildBlock = function(level,x,y){
        var emptyBlockIndexs = getEmptyBlockIndexs();
        if(emptyBlockIndexs.length == 0) return false;
        
        var putIndex;
        if(x != undefined && y != undefined){
            putIndex = getIndex(x,y);
        }else{
            putIndex = emptyBlockIndexs[Math.floor(Math.random() * emptyBlockIndexs.length)];//生成一个正确的随机空格
        }

        //重载
        var block;
        if(level != undefined){
            block = $.extend({},option.blocks[level]);
        }else{
            block = $.extend({},Math.random() >=0.5 ? option.blocks[0] : option.blocks[1]);
        }

        var coordinate = getCoordinate(putIndex);
        var position = getPosition(coordinate.x,coordinate.y);
        var blockDom = $("<div></div>");
        blockDom.addClass("block_" + coordinate.x + "_" + coordinate.y);
        blockDom.css($.extend(option.style.block_style,{
            "position":"absolute",
            "top":position.top + option.style.block_size/2,
            "left":position.left + option.style.block_size/2, 
            "width":0,
            "height":0           
        },block.style));

        $this.append(blockDom);
        state[putIndex] = block;//游戏数据，已经出现在游戏界面里的块

        blockDom.animate({
            "width":option.style.block_size,
            "height":option.style.block_size,
            "line-height":option.style.block_size + "px",
            "top":position.top,
            "left":position.left,
        },option.animateSpeed,(function(blockDom){
            return function(){
                blockDom.html(block.value);
            }
        })(blockDom))

        return true;
    }

    var move = function(direction){
        switch(direction){
            case "up":
                for(var x = 0;x < option.width;x++){
                    for(var y = 1;y < option.height;y++){//第二排开始遍历
                        var block = getBlock(x,y);
                        if(block == null) continue;

                        var target_coordinate = {x:x,y:y-1};
                        var target_block = getBlock(target_coordinate.x,target_coordinate.y);
                        var moved = 0;
                        while(target_coordinate.y > 0 && target_block == null){
                            target_coordinate.y = target_coordinate.y - 1;
                            target_block = getBlock(target_coordinate.x,target_coordinate.y);
                            if(++moved > Math.max(option.width,option.height)) break;
                        }

                        
                    }
                }
                break;
            case "down":
                break;
            case "left":
                break;
            case "right":
                break;
        }
    }
    buildBackground();
    buildBlock(0,0,0);
    buildBlock(1,1,1);
    buildBlock(2,2,1);
    buildBlock(3,3,1);
    buildBlock(4,1,3);
    buildBlock(5,1,2);
   

}