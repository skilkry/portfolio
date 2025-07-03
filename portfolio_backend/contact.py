from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv()

TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')

print('Token:', TELEGRAM_TOKEN)
print('Chat ID:', TELEGRAM_CHAT_ID)


@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    subject = data.get('subject', 'Sin asunto')

    if not all([name, email, message]):
        return jsonify({'error': 'Faltan campos.'}), 400

    text = f"📩 *Nuevo mensaje desde tu portfolio:*\n\n*Asunto:* {subject}\n👤 *Nombre:* {name}\n📧 *Email:* {email}\n📝 *Mensaje:* {message}"

    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    payload = {
        'chat_id': TELEGRAM_CHAT_ID,
        'text': text,
        'parse_mode': 'Markdown'
    }

    resp = requests.post(url, json=payload)
    print('Telegram response:', resp.status_code, resp.text)


    if resp.status_code == 200:
        return jsonify({'success': True})
    else:
        return jsonify({'error': 'Error enviando mensaje a Telegram'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    app.run(debug=True, host='0.0.0.0', port=port)

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port)