from flask import Flask, json, jsonify
# from flask_cors import CORS

app = Flask(__name__)
# CORS(app)

@app.route('/player-list', methods=["GET"])
# @app.route("/json")

def send_json():
    with open('player-list.json', 'r') as file:
        data = json.load(file)

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)