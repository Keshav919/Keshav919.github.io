function changeAspect()
{
    var height = window.innerHeight;
    var width = window.innerWidth;
    if(height > width){
        var elem = document.getElementById("mainHeadingHorizontal");
        if (elem){
            elem.setAttribute("id", "mainHeadingVertical");
        }
    }
    else{
        var elem = document.getElementById("mainHeadingVertical");
        if (elem){
            elem.setAttribute("id", "mainHeadingHorizontal");
        }
    }
}