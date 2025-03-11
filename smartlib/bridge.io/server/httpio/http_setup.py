from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return "Welcome to the Flask Server!"

@app.route('/transaction', methods=['GET'])
def transaction():
    return jsonify({"message": "Transaction endpoint."})

def get_flask_app():
    return app
