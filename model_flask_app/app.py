import os
import sys
import transformers
# import tensorflow as tf
# from datasets import load_dataset
from transformers import AutoTokenizer
from transformers import TFAutoModelForSeq2SeqLM, DataCollatorForSeq2Seq
from transformers import AdamWeightDecay
from transformers import AutoTokenizer, TFAutoModelForSeq2SeqLM
import pickle 
from flask import Flask , request, render_template , jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.route("/translateHindi", methods=['POST'])
def languageTranslationHindi():
    print("In the Translation APP")

    inputQuery1 = request.json['english_text']
    print(inputQuery1)

    model_checkpoint = "Helsinki-NLP/opus-mt-en-hi"
    tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)
    model = TFAutoModelForSeq2SeqLM.from_pretrained(model_checkpoint)
    tokenized = tokenizer([inputQuery1], return_tensors='np')
    out = model.generate(**tokenized, max_length=128)
    print(out)
    
    with tokenizer.as_target_tokenizer():
        translatedSentence = tokenizer.decode(out[0], skip_special_tokens=True)
        print(translatedSentence)
    
    return jsonify({"response" : translatedSentence})   

@app.route("/translateEnglish", methods=['POST'])
def languageTranslationEnglish():
    print("In the Translation APP")

    inputQuery1 = request.json['hindi_text']
    print(inputQuery1)

    model_checkpoint = "Helsinki-NLP/opus-mt-hi-en"
    tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)
    model = TFAutoModelForSeq2SeqLM.from_pretrained(model_checkpoint)
    tokenized = tokenizer([inputQuery1], return_tensors='np')
    out = model.generate(**tokenized, max_length=128)
    print(out)
    
    with tokenizer.as_target_tokenizer():
        translatedSentence = tokenizer.decode(out[0], skip_special_tokens=True)
        print(translatedSentence)
    
    return jsonify({"response" : translatedSentence}) 

if __name__ == "__main__":     
    app.run(debug=True , port=5000)
