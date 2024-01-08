import json
import asyncio
from flask import Flask, request
import Db as Db
import jwt
import json
import engine
from flask_cors import CORS
from flask import jsonify

app = Flask(__name__)
CORS(app)
@app.route("/")
def send_users():
    return "start"

@app.route('/account/signup', methods=['POST'])
def signup():
    request_data = request.get_json()
    email = request_data['email']
    result = Db.signup(request_data)
    print(result)

    if (result != "error"):
        response = app.response_class(
        response=json.dumps([email]),
        status=201,
        mimetype='application/json'
        )
        return response
    else:
        response = app.response_class(
        response=json.dumps(["error"]),
        status=400,
        mimetype='application/json'
        )
        return response
        
@app.route('/account/signin', methods=['POST'])
def signin():
    request_data = request.get_json()
    print(request_data)
    grantType = request_data["grant_type"]
    email = request_data['email']
    password = request_data['password']
    if (grantType == "password"):
        result = asyncio.run(Db.signin(email,password))
        if (result ["error"] == "false"):
            id = result["id"]
            key='super-secret'
            payload={"id":id,"email":email, "isLoggedin": "true" }
            accessToken = jwt.encode(payload, key, algorithm="HS256")
            
            response = app.response_class(
            response=json.dumps({"access_token": accessToken}),
            status=200,
            mimetype='application/json'
            )
            return response
        else:
            response = app.response_class(
            response=json.dumps({"error": result["error"]}),
            status=404,
            mimetype='application/json'
            )
            return response
            
    else:
        response = app.response_class(
        response=json.dumps({"error":"bad request"}),
        status=400,
        mimetype='application/json'
        )
        return response
        
def toJson(items):
    listOfItems = []
    for item in items:
        listOfItems.append(item)
    return listOfItems
def formatMovies(movies):
    formatedmovies = []
    for movie in movies:
        formatedMovie = [movie["genre"]["value"],movie["title"]["value"],movie["date"]["value"]]
        formatedmovies.append(formatedMovie)
    return formatedmovies
            
@app.route('/recommendation')
def query_example():
    authorizationHeader = request.headers['Authorization']
    start =len("Bearer ")
    end = len(authorizationHeader)
    token = authorizationHeader[start:end]
    decodedToken = jwt.decode(token, 'super-secret', algorithms=["HS256"])
    
    # if key doesn't exist, returns None
    userId1 = str(decodedToken['id'])

    # if key doesn't exist, returns a 400, bad request error 
    userId2 = request.args['userId2']
    type = request.args['type']
    recommendations = ""
    print(type)

    if(type=="wiki"):
        movies = engine.getWikidataRecommendations(userId1,userId2)
        recommendations = formatMovies(movies)
  
    else:
        print("2222")
        type = True if (request.args['type'] == "true") else False
        recommendations = engine.geLensKitRecommendations(userId1,userId2,type)
    #recommendations = recommendations.to_json(orient="records")
    if (not isinstance(recommendations, list)):
        recommendations = recommendations.values.tolist()
    response = app.response_class(
    
    response=json.dumps(recommendations),
    status=200,
    mimetype='application/json'
    )
    return response




app.run()