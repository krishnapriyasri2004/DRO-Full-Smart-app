from flask import Flask, request, jsonify
from flask_cors import CORS
from route_optimizer import optimize_routes
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/optimize', methods=['POST'])
def optimize():
    try:
        data = request.json
        
        # Extract data from request
        algorithm = data.get('algorithm', 'greedy')
        locations = data.get('locations', [])
        partners = data.get('partners', [])
        
        # Validate input
        if not locations:
            return jsonify({"error": "No locations provided"}), 400
        
        if not any(loc.get('type') == 'depot' for loc in locations):
            return jsonify({"error": "No depot location found"}), 400
        
        if not partners:
            return jsonify({"error": "No delivery partners provided"}), 400
        
        # Run optimization
        result = optimize_routes(locations, partners, algorithm)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
