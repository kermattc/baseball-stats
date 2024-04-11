import os
import sys
print(sys.path)
from flask import Flask, json, jsonify
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

player_list_path = os.path.join(os.path.dirname(__file__), 'player-list.json')
# player_stats_path = os.path.join(os.path.dirname(__file__), 'hitter-stats.json')
player_stats_path = os.path.join(os.path.dirname(__file__), 'hitter-stats-2023.json')
# player_stats_path = os.path.join(os.path.dirname(__file__), 'pitcher-stats.json')

@app.route('/player-list', methods=["GET"])
# @cross_origin()
def send_player_list_json():
    with open(player_list_path, 'r') as file:
        data = json.load(file)

    return jsonify(data)

@app.route('/hitter-stats', methods=["GET"])
# @app.route('/pitcher-stats', methods=["GET"])
def send_player_stats_json():
    with open(player_stats_path, 'r') as file:
        data = json.load(file)

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)