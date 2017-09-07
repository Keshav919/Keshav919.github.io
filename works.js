function enlarge1(elmnt){
	document.getElementById("display1").style.display="block";
	document.getElementById("display1").src=elmnt.src;
	document.getElementById("display1").style.height="50%";
	document.getElementById("display1").style.width="50%";
	document.getElementById("display1").style.marginLeft="20%";
	document.getElementById("display1").style.marginTop="20px";
	document.getElementById("displayarea1").style.backgroundColor="#333333";
	document.getElementById("displayarea1").style.paddingTop="20px";
	document.getElementById("displayarea1").style.paddingBottom="40px";
	document.getElementById("displayarea1").style.display="block";
}	
function small1(){
	document.getElementById("display1").src="#";
	document.getElementById("displayarea1").style.display= "none";
}	
function enlarge2(elmnt){
	document.getElementById("display2").style.display="block";
	document.getElementById("display2").src=elmnt.src;
	document.getElementById("display2").style.height="40%";
	document.getElementById("display2").style.width="40%";
	document.getElementById("display2").style.marginLeft="20%";
	document.getElementById("display2").style.marginTop="20px";
	document.getElementById("displayarea2").style.backgroundColor="#333333";
	document.getElementById("displayarea2").style.paddingTop="20px";
	document.getElementById("displayarea2").style.paddingBottom="40px";
	document.getElementById("displayarea2").style.display="block";
}	
function small2(){
	document.getElementById("display2").src="#";
	document.getElementById("displayarea2").style.display= "none";
}	
