import json
import asyncio
from flask import Flask, request
import Db as Db
import jwt
import json
app = Flask(__name__)
import engine

@app.route("/")
def send_users():
    return "start"

@app.route('/account/signup', methods=['POST'])
def signup():
    request_data = request.get_json()
    email = request_data['email']
    password = request_data['password']
    result = asyncio.run(Db.signup(request_data))
    if (result != "error"):
        
        return '''
            The email value is: {}
            The password value is: {}
            '''.format(email, password)
    else:
        return '''
           { error }
            '''
@app.route('/account/signin', methods=['POST'])
def signin():
    request_data = request.get_json()
    email = request_data['email']
    password = request_data['password']
    result = asyncio.run(Db.signin(email,password))
    print(result)
    if (result == "error"):
        return '''
           { error }
            '''        

    elif(result == "false"):
        return '''
           { wrong email or password }
            '''  
    else:
        return '''
        The email value is: {}
        The password value is: {}
        '''.format(email, password)
        

@app.route('/recommendation')
def query_example():
    # if key doesn't exist, returns None
    userId1 = request.args.get('userId1')

    # if key doesn't exist, returns a 400, bad request error 
    userId2 = request.args['userId2']
    type = True if (request.args['type'] == "true") else False


    recommendations = engine.getUsersRecommendations(userId1,userId2,type)
    recommendations = recommendations.to_json(orient="records")
    return json.dumps(recommendations)




app.run()