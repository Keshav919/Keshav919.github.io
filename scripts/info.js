function changeAspect()
{
    var height = window.innerHeight;
    var width = window.innerWidth;
    if(height + 120 > width){
        var elem = document.getElementById("mainHeadingHorizontal");
        var name = document.getElementById("name")
        if (elem){
            elem.setAttribute("id", "mainHeadingVertical");
        }
        if (name){
            name.setAttribute("id", "nameVertical");
        }
    }
    else{
        var elem = document.getElementById("mainHeadingVertical");
        var name = document.getElementById("nameVertical")
        if (elem){
            elem.setAttribute("id", "mainHeadingHorizontal");
        }
        if (name){
            name.setAttribute("id", "name");
        }
    }
}