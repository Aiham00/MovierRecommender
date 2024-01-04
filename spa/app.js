const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
        
app.get("*", function(request, response){
	response.sendFile(__dirname+"/index.html")
})

app.listen(8040)