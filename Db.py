import sqlite3
import asyncio
import aiosqlite



#db.execute('CREATE TABLE IF NOT EXISTS "persons" ("id"	INTEGER UNIQUE,"name"	TEXT UNIQUE,PRIMARY KEY("id" AUTOINCREMENT));')
async def createTable():
    conn=sqlite3.connect("db.db",check_same_thread=False)
    db=conn.cursor()
    d = db.execute("""CREATE TABLE IF NOT EXISTS "users"
              ("id"	INTEGER UNIQUE,"firstName"	TEXT,"lastName"	TEXT ,
              "email" TEXT UNIQUE, "password" TEXT,
              PRIMARY KEY("id" AUTOINCREMENT),UNIQUE("firstName" , "lastName"));""")
    db.close()
    return d

async def signup(user):
    try:
        db = await aiosqlite.connect("db.db")
        email = user['email']
        password = user['password']
        result = await db.execute("""INSERT INTO  users ("email" , "password") VALUES(?,?)""",(email,password))
        await db.commit()
        await db.close()
        return result
    except:
        print("eeeee","f")
        return "error"
    
async def signin(email, password):
    try:
        db = await aiosqlite.connect("db.db")

        result= await db.execute("""SELECT * FROM users WHERE email = ? """,(email,))
        id,firstName,lastName,storedEmail,storedPassowred = await result.fetchone()
        await result.close()
        await db.close()
        if(password == storedPassowred):
            return id,firstName,lastName,storedEmail,storedPassowred
        else:
            return "false"

    except:
        return "error"

      
async def createDb():
    print('Hello ...')
    c = await createTable()
    print('... World!')

asyncio.run(createDb())