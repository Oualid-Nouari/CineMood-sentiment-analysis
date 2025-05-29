from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
import gensim.downloader as api # For GloVe
import joblib # For loading your SVM model
import os

app = Flask(__name__)
CORS(app) # This enables Cross-Origin Resource Sharing to allow requests from your Next.js app

# --- Pre-load NLTK resources, models, etc. ---
# This code runs once when the Flask app starts for efficiency.
print("Initializing NLTK resources and models...")
try:
    nltk.data.find('tokenizers/punkt')
except:
    nltk.download('punkt', quiet=True)
try:
    nltk.data.find('corpora/stopwords')
except:
    nltk.download('stopwords', quiet=True)
try:
    nltk.data.find('corpora/wordnet')
except:
    nltk.download('wordnet', quiet=True)
try:
    nltk.data.find('tokenizers/punkt_tab') # From previous fix
except:
    nltk.download('punkt_tab', quiet=True)

lemmatizer = WordNetLemmatizer()
stop_words_set = set(stopwords.words('english'))

glove_model = None
svm_model = None

try:
    # Ensure the GENSIM_DATA_DIR is set if your GloVe model is cached in a non-default location
    # For example, if 'gensim' folder in 'emotions' is the cache:
    # os.environ['GENSIM_DATA_DIR'] = os.path.join(os.path.dirname(__file__), 'gensim')
    print("Loading GloVe word embeddings (this may take a moment)...")
    glove_model = api.load("glove-wiki-gigaword-300")
    print("GloVe embeddings loaded successfully!")
except Exception as e:
    print(f"Error loading GloVe model: {e}. Ensure you have an internet connection or model is cached.")

try:
    # Path to your saved SVM model
    model_path = os.path.join(os.path.dirname(__file__), 'glove_embedding_svm_model.pkl')
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"SVM model not found at {model_path}")
    svm_model = joblib.load(model_path)
    print("SVM model loaded successfully!")
except Exception as e:
    print(f"Error loading SVM model: {e}")

print("Initialization complete.")

# --- Helper Functions (adapted from your notebook) ---
def clean_text_for_analysis(text):
    text = str(text).lower()
    negation_patterns = [
        (r"n't\s", " not "), (r"not\s", " NOT_"),
        (r"no\s", " NO_"), (r"never\s", " NEVER_")
    ]
    for pattern, replacement in negation_patterns:
        text = re.sub(pattern, replacement, text)

    sarcasm_patterns = [
        (r'\s*[!]+\s*', ' EXCL '), (r'\s*[?!]+\s*', ' SARCASM '),
        (r'\"(.+?)\"', ' QUOTE \\1 QUOTE '), (r'\s*lol\s*', ' LOL '),
        (r'\s*haha+\s*', ' LAUGH '), (r'\s*right+\s*[.?!]', ' SARC_RIGHT ')
    ]
    for pattern, replacement in sarcasm_patterns:
        text = re.sub(pattern, replacement, text)

    text = re.sub(r'<.*?>', '', text) # Remove HTML tags
    text = re.sub(r':-?\)', ' HAPPY_EMOTICON ', text)
    text = re.sub(r':-?\(', ' SAD_EMOTICON ', text) # Corrected sad emoticon
    text = re.sub(r'[^a-zA-Z\s_]', ' ', text) # Keep underscore for special tokens
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def tokenize_and_lemmatize(text):
    tokens = word_tokenize(text)
    # Special tokens are those that are fully formed like 'NOT_', 'EXCL', etc.
    # or words that follow them like 'NOT_good'
    special_token_prefixes = ['NOT_', 'NO_', 'NEVER_', 'EXCL', 'SARCASM', 'QUOTE', 'LOL', 'LAUGH',
                             'SARC_RIGHT', 'HAPPY_EMOTICON', 'SAD_EMOTICON']
    filtered_tokens = []
    for token in tokens:
        is_special_or_related = False
        for prefix in special_token_prefixes:
            if token.startswith(prefix): # This covers 'NOT_amazing' and 'EXCL' itself
                filtered_tokens.append(token)
                is_special_or_related = True
                break
        if not is_special_or_related and token not in stop_words_set:
            filtered_tokens.append(lemmatizer.lemmatize(token))
    return filtered_tokens


def get_document_vector(tokens, embedding_model, vector_size=300):
    doc_vector = np.zeros(vector_size)
    count = 0
    if embedding_model is None:
        return doc_vector # Or handle error appropriately

    for word in tokens:
        if word in embedding_model: # Check if word is in GloVe vocabulary
            try:
                doc_vector += embedding_model[word]
                count += 1
            except KeyError: # Should not happen if "word in embedding_model" check is used.
                pass
    if count > 0:
        doc_vector /= count
    else: # As per your notebook, for empty/OOV docs
        doc_vector = np.random.normal(0, 0.01, vector_size)
    return doc_vector

# This is your core sentiment prediction logic
def predict_sentiment_with_confidence(model, review_text, glove_embedding_model, confidence_threshold=0.4):
    if model is None or glove_embedding_model is None:
        return {
            'sentiment': "Error", 'confidence': 0,
            'probabilities': {'negative': 0, 'positive': 0},
            'error_message': "Backend model or embeddings not loaded."
        }

    cleaned_review = clean_text_for_analysis(review_text)
    processed_tokens = tokenize_and_lemmatize(cleaned_review)

    review_vector = get_document_vector(processed_tokens, glove_embedding_model)
    review_vector_reshaped = review_vector.reshape(1, -1) # Model expects 2D array

    # Get probabilities: model.classes_ should show order, e.g., ['negative', 'positive']
    # Assuming probabilities[0] is for 'negative' and probabilities[1] is for 'positive'
    # This depends on how the labels were encoded when training the SVM.
    # If your model.classes_ is ['positive', 'negative'], then swap probabilities[0] and probabilities[1] below.
    # You can check model.classes_ after loading the model if unsure.
    # For now, assuming standard alphabetical: 'negative' (class 0), 'positive' (class 1)
    probabilities_raw = model.predict_proba(review_vector_reshaped)[0]

    # To be safe, map probabilities to labels if classes_ attribute is available
    # For example: prob_dict = dict(zip(model.classes_, probabilities_raw))
    # Then access prob_dict['positive'] and prob_dict['negative']
    # Assuming 'positive' is the second class and 'negative' is the first for now.
    prob_positive = float(probabilities_raw[1])
    prob_negative = float(probabilities_raw[0])

    confidence = abs(prob_positive - prob_negative)

    sentiment = ""
    if confidence < confidence_threshold:
        sentiment = "Neutral"
    elif prob_positive > prob_negative:
        sentiment = "Positive"
    else:
        sentiment = "Negative"

    return {
        'sentiment': sentiment,
        'confidence': float(confidence),
        'probabilities': {
            'negative': prob_negative,
            'positive': prob_positive
        }
    }

@app.route('/predict_sentiment', methods=['POST'])
def handle_predict_sentiment():
    if svm_model is None or glove_model is None:
        return jsonify({"error": "Sentiment analysis model is not ready."}), 503 # Service Unavailable

    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    review_text = data.get('review_text')

    if not review_text:
        return jsonify({"error": "Missing 'review_text' in request body"}), 400

    try:
        result = predict_sentiment_with_confidence(svm_model, review_text, glove_model)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error during prediction: {str(e)}")
        return jsonify({"error": "An error occurred during sentiment prediction."}), 500

if __name__ == '__main__':
    # Check if models loaded before starting
    if svm_model is None or glove_model is None:
        print("CRITICAL: SVM or GloVe model failed to load. API will not function correctly.")
    else:
        print("Models loaded. Starting Flask server on http://localhost:5001")
    app.run(debug=True, port=5001) # Run on a different port than Next.js (default 3000)