from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import traceback

app = Flask(__name__)

# ✅ CORS (pakai whitelist + fallback * untuk hosting)
CORS(app, resources={r"/predict": {"origins": [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://herbalif.vercel.app"
]}}, supports_credentials=True)

# Fallback kalau whitelist gagal
CORS(app)

# ✅ Load model
try:
    with open("model.pkl", "rb") as f:
        model = pickle.load(f)
    print("✅ Model berhasil dimuat")
except Exception as e:
    print(f"❌ Gagal memuat model: {e}")
    model = None


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model tidak tersedia"}), 500

    try:
        if "file" not in request.files:
            return jsonify({"error": "Tidak ada file yang diupload"}), 400

        file = request.files["file"]

        # TODO: ganti bagian ini sesuai cara ekstraksi fitur gambarmu
        # contoh dummy prediksi pakai angka random
        fitur = np.random.rand(1, 4)  # misalnya fitur 4 dimensi
        prediksi = model.predict(fitur)[0]

        return jsonify({"prediksi": str(prediksi)})

    except Exception as e:
        print("❌ ERROR saat prediksi:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask backend jalan ✅"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
