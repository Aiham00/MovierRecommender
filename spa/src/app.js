

const express = require('express')
const path = require('path')
/*app.listen(8040, function(){
	console.log("SPA RUNNING")
})*/
module.exports = function () {

	
	const app = express() 
	
	app.use(express.static(path.join(__dirname, 'public')))
	
			
	app.get("*", function(request, response){
		response.sendFile(__dirname+"/index.html")
	})


    return app


}