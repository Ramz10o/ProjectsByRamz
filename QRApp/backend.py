from flask import Flask, jsonify, request, Response, render_template, make_response
from flask_cors import CORS
import psycopg2 
from psycopg2 import sql
import io
import os
import qrcode 
import cv2
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from PIL import Image
import numpy as np
import datetime

app = Flask(__name__)
CORS(app)

def close_handle(**args) :
    for k, v in args.items():
        v.close()
    
def get_connection() :
    return psycopg2.connect(
        host='localhost',
        database='Demo',
        user='postgres',
        password='123456')
    
def create_tables_if_not_existing() :
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        '''
        CREATE TABLE IF NOT EXISTS Codes (
        email VARCHAR(255) PRIMARY KEY,
        content VARCHAR(255) NOT NULL );  
        '''
    )
    cursor.execute(
        '''
        CREATE TABLE IF NOT EXISTS Users (
        id  SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
            );
        '''
    )
    conn.commit()
    close_handle(cursor=cursor, conn=conn)

@app.route('/')
def index() :
    return render_template('index.html')

@app.route('/home')
def home() :
    return render_template('home.html')

@app.route('/generate')
def generate() :
    return render_template('generate.html')

@app.route('/read')
def read() :
    return render_template('read.html')

@app.route('/login')
def log() :
    return render_template('login.html')

@app.route('/register')
def reg() :
    return render_template('register.html')
    
@app.route('/auth/register', methods=['POST'])
def register(): 
    data = request.json
    if not data.get('username') or not data.get('password') or not data.get('email'):
        return jsonify({'message' : 'All fields are required'}), 400
    conn = get_connection()
    cursor = conn.cursor()
    try :
        cursor.execute("INSERT INTO Users (username, password, email) VALUES (%s, %s, %s)" , (data.get('username'), generate_password_hash(data.get('password')), data.get('email')))
        conn.commit()
        close_handle(cursor=cursor, conn=conn)
        return jsonify({'message' : 'Successfully Registered'})
    
    except psycopg2.errors.UniqueViolation as e :
        return jsonify({'message' : 'Username or Email already exists'}), 400
    except Exception as e :
        print(e)
        return jsonify({'message' : str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login() :
    data = request.json
    if not data.get('username') or not data.get('password'):
        return jsonify({'message' : 'All fields are required'}), 400
    conn = get_connection()
    cursor = conn.cursor()
    try :
        cursor.execute('SELECT * FROM users WHERE username = %s',(data.get('username'),))
        user = cursor.fetchone() 
        if not user or not check_password_hash(user[3], data.get('password')) :
            return jsonify({'message' : 'Invalid username or password'}), 401
        token = jwt.encode({'username' : user[2],
                            'exp ' : str(datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes = 2)) 
                            }, 'CODM is best Mobile FPS Shooter', algorithm='HS512')
        return jsonify({'token' : token, 'message' : 'Login Successful'})
            
    except Exception as e :
        print(e)
        return jsonify({'message' : str(e)}), 500

@app.route('/qr/generate', methods=['POST'])
def get_qr() :
    try :
        token = request.headers.get('Authorization')
        jwt.decode(token, 'CODM is best Mobile FPS Shooter', algorithms=['HS512'])
        print('Generate API called')
        data = request.json
        if not data.get('content') or not data.get('email') :
            return jsonify({"message" : "Email and Content are required fields"}), 400
        
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO Codes (email, content) VALUES (%s, %s)',(data['email'],data['content']))
        conn.commit()
        close_handle(cursor=cursor, conn=conn)
        
        img = qrcode.make(data['content'])
        buffer = io.BytesIO()
        img.save(buffer, format='png')
        buffer.seek(0)
        
        res = make_response(buffer.getvalue())
        res.mimetype = 'image/png'
        return res
    
    except jwt.ExpiredSignatureError :
        return jsonify({'message' : 'Token has expired'}), 401
    except jwt.InvalidSignatureError :
        return jsonify({'message' : 'Invalid token'}), 401
    except Exception as e :
        print(str(e))
        return jsonify({"message" : str(e)}), 500

@app.route('/qr/read', methods=['POST'])
def read_qr() :
    try:
        token = request.headers.get('Authorization')
        jwt.decode(token, 'CODM is best Mobile FPS Shooter', algorithms=['HS512'])
        print('Read API called')
        if 'file' not in request.files :
            return jsonify({"message" : "File is required"}), 400
        file = request.files['file']
        print(file)
        if file.filename == '' :
            return jsonify({"message" : "File should be selected"}), 400
        img = Image.open(file.stream)
        img = img.convert('RGB')
        img = np.array(img)
        detector = cv2.QRCodeDetector()
        data,pls,qrcode = detector.detectAndDecode(cv2.cvtColor(img, cv2.COLOR_RGB2GRAY))
        if data :
            return jsonify({"data" : data})
        else : 
            return jsonify({"error" : "No QR Code detected"}), 400
    
    except jwt.ExpiredSignatureError :
        return jsonify({'message' : 'Token has expired'}), 401
    except jwt.InvalidSignatureError :
        return jsonify({'message' : 'Invalid token'}), 401
    except Exception as e :
        return jsonify({'message' : str(e)}), 500

if __name__ == '__main__' :
    create_tables_if_not_existing()
    app.run(debug=True)