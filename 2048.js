$.fn.make2048 = function(option){
    var defaultOption = {
        width:4,
        height:4,
        style:{
            background_color:"rgb(184,175,158)",
            block_background_color:"rgb(204,192,178)",
            padding:18,
            block_size:100,
        }
    }
    var state = [];

    option = $.extend({},defaultOption,option);
    
    if(this.length > 1) throw "一次只能开始一个游戏";
    if(this.length = 0) throw "未找到游戏容器";

    console.log(this);
    var $this = $(this[0]);
    $this.css({
        "background-color":option.style.background_color,
        "border-radius":option.style.padding,
        "position":"relative",
        "-webkit-user-select":"none"
    })

    var getPosition = function(x,y){
        return{
            "top":option.style.padding + y * (option.style.block_size + option.style.padding),
            "left":option.style.padding + x * (option.style.block_size + option.style.padding)
        }
    }

    var buildBackground = function(){
        var backgrounds = [];
        for(var x = 0;x<option.width;x++){
            for(var y = 0;y<option.height;y++){
                state.push(null);
                var bg_block = $("<div></div>");
                var position =getPosition(x,y);
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
    buildBackground()
}