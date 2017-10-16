$.fn.make2048 = function(option){
    var defaultOption = {
        width:4,
        height:4,
        style:{
            background_color:"rgb(184,175,158)",
            block_background_color:"rgb(204,192,178)",
            padding:18,
        }
    }

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
}