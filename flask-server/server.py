import os
from flask import Flask, json, jsonify
# from flask_cors import CORS

player_list_path = os.path.join(os.path.dirname(__file__), 'player-list.json')
player_stats_path = os.path.join(os.path.dirname(__file__), 'player-stats.json')

app = Flask(__name__)
# CORS(app)

@app.route('/player-list', methods=["GET"])
def send_player_list_json():
    with open(player_list_path, 'r') as file:
        data = json.load(file)

    return jsonify(data)


@app.route('/player-stats', methods=["GET"])
def send_player_stats_json():
    with open(player_stats_path, 'r') as file:
        data = json.load(file)

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)