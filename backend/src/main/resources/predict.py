import sys
import json
import os
import time as import_time
import numpy as np
import joblib

try:
    # Try to import tensorflow, but handle gracefully if not available
    try:
        import tensorflow as tf
        tf_available = True
    except ImportError:
        tf_available = False
        sys.stderr.write("PYTHON_LOG: WARNING: TensorFlow not available, using RF-only prediction\n")
        sys.stderr.flush()

    # Get absolute path to models directory
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODEL_DIR = os.path.join(BASE_DIR, 'models')

    # Load models with error handling
    models_loaded = {}
    
    try:
        xgb = joblib.load(os.path.join(MODEL_DIR, 'xgboost_model.pkl'))
        models_loaded['xgb'] = True
        sys.stderr.write("PYTHON_LOG: XGBoost model loaded successfully\n")
    except FileNotFoundError:
        models_loaded['xgb'] = False
        sys.stderr.write("PYTHON_LOG: WARNING: XGBoost model not found\n")
    
    try:
        rf = joblib.load(os.path.join(MODEL_DIR, 'random_forest_model.pkl'))
        models_loaded['rf'] = True
        sys.stderr.write("PYTHON_LOG: Random Forest model loaded successfully\n")
    except FileNotFoundError:
        models_loaded['rf'] = False
        sys.stderr.write("PYTHON_LOG: ERROR: Random Forest model not found\n")
        sys.exit(1)
    
    try:
        if tf_available:
            cnn = tf.keras.models.load_model(os.path.join(MODEL_DIR, 'cnn_model.h5'))
            models_loaded['cnn'] = True
            sys.stderr.write("PYTHON_LOG: CNN model loaded successfully\n")
        else:
            models_loaded['cnn'] = False
    except (FileNotFoundError, OSError):
        models_loaded['cnn'] = False
        sys.stderr.write("PYTHON_LOG: WARNING: CNN model not found\n")

    # Load scalers
    try:
        scaler_rf = joblib.load(os.path.join(MODEL_DIR, 'scaler_rf.pkl'))
        sys.stderr.write("PYTHON_LOG: RF scaler loaded successfully\n")
    except FileNotFoundError:
        sys.stderr.write("PYTHON_LOG: ERROR: RF scaler not found\n")
        sys.exit(1)
    
    try:
        if models_loaded['xgb']:
            scaler_xgb = joblib.load(os.path.join(MODEL_DIR, 'scaler.pkl'))
            sys.stderr.write("PYTHON_LOG: XGB scaler loaded successfully\n")
    except FileNotFoundError:
        sys.stderr.write("PYTHON_LOG: WARNING: XGB scaler not found\n")
        models_loaded['xgb'] = False

    # Load PCA 
    try:
        if models_loaded['xgb']:
            pca = joblib.load(os.path.join(MODEL_DIR, 'pca_model.pkl'))
            sys.stderr.write("PYTHON_LOG: PCA model loaded successfully\n")
            models_loaded['pca'] = True
    except FileNotFoundError:
        sys.stderr.write("PYTHON_LOG: WARNING: PCA model not found\n")
        models_loaded['pca'] = False

    # One-hot encoding setup (same order as training)
    type_categories = ['CASH_OUT', 'TRANSFER', 'PAYMENT', 'CASH_IN', 'DEBIT']
    pair_categories = ['cc', 'cm']
    part_day_categories = ['morning', 'afternoon', 'evening', 'night']

    def one_hot_encode(value, categories):
        return [1 if value == cat else 0 for cat in categories]

    # Read JSON input from stdin
    input_json = sys.stdin.read()
    if not input_json:
        print(json.dumps({"error": "Empty input received"}))
        sys.exit(1)
    
    # Log input to stderr (will be captured by Java)
    sys.stderr.write(f"PYTHON_LOG: INPUT DATA: {input_json}\n")
    sys.stderr.flush()
    
    data = json.loads(input_json)

    # Validate input
    required_fields = ["amount", "day", "type", "transaction_pair_code", "part_of_the_day"]
    for field in required_fields:
        if field not in data:
            print(json.dumps({"error": f"Missing field: {field}"}))
            sys.exit(1)

    # Additional validation
    if not isinstance(data["amount"], (int, float)) or data["amount"] <= 0:
        print(json.dumps({"error": "Amount must be a positive number"}))
        sys.exit(1)
    if not isinstance(data["day"], int) or data["day"] < 1 or data["day"] > 31:
        print(json.dumps({"error": "Day must be an integer between 1 and 31"}))
        sys.exit(1)
    if data["type"] not in type_categories:
        print(json.dumps({"error": f"Invalid type: {data['type']}"}))
        sys.exit(1)
    if data["transaction_pair_code"] not in pair_categories:
        print(json.dumps({"error": f"Invalid transaction_pair_code: {data['transaction_pair_code']}"}))
        sys.exit(1)
    if data["part_of_the_day"] not in part_day_categories:
        print(json.dumps({"error": f"Invalid part_of_the_day: {data['part_of_the_day']}"}))
        sys.exit(1)

    # Compose feature vector
    type_encoded = one_hot_encode(data["type"], type_categories)
    pair_encoded = one_hot_encode(data["transaction_pair_code"], pair_categories)
    part_encoded = one_hot_encode(data["part_of_the_day"], part_day_categories)

    # Log the encoded features
    sys.stderr.write(f"PYTHON_LOG: ENCODED FEATURES: type={type_encoded}, pair={pair_encoded}, part_of_day={part_encoded}\n")
    sys.stderr.flush()

    # Full feature vector for RF (13 features)
    features_rf = np.array([
        data["amount"],
        data["day"],
        *type_encoded,
        *pair_encoded,
        *part_encoded
    ]).reshape(1, -1)

    # Reduced feature vector for XGB (based on PCA - typically fewer features)
    # We'll use the same features but apply PCA transformation 
    features_xgb = features_rf.copy()

    # Initialize prediction variables
    final_proba = 0.0
    final_pred = False
    prediction_method = "unknown"
    model_predictions = {}

    # ENSEMBLE PREDICTION APPROACH
    if models_loaded['xgb'] and models_loaded['rf'] and models_loaded['cnn']:
        # Full ensemble: XGB + RF -> CNN
        sys.stderr.write("PYTHON_LOG: Using full ensemble (XGB + RF -> CNN)\n")
        
        try:
            # Get XGBoost prediction
            scaled_xgb_input = scaler_xgb.transform(features_xgb)
            if models_loaded.get('pca', False):
                scaled_xgb_input = pca.transform(scaled_xgb_input)
            xgb_proba = xgb.predict_proba(scaled_xgb_input)[:, 1][0]
            model_predictions['xgb'] = float(xgb_proba)
            sys.stderr.write(f"PYTHON_LOG: XGB prediction: {xgb_proba}\n")
        except Exception as e:
            sys.stderr.write(f"PYTHON_LOG: XGB prediction failed: {str(e)}, falling back to RF+CNN\n")
            models_loaded['xgb'] = False
            xgb_proba = 0.0
        
        # Get Random Forest prediction
        scaled_rf_input = scaler_rf.transform(features_rf)
        rf_proba = rf.predict_proba(scaled_rf_input)[:, 1][0]
        model_predictions['rf'] = float(rf_proba)
        sys.stderr.write(f"PYTHON_LOG: RF prediction: {rf_proba}\n")
        
        if models_loaded['xgb']:
            # Combine XGB and RF outputs as input to CNN
            # Create ensemble features: original features + model predictions
            ensemble_features = np.concatenate([
                features_rf.flatten(),  # Original features
                [xgb_proba, rf_proba]  # Model predictions as additional features
            ]).reshape(1, -1)
        else:
            # Use RF prediction only with original features
            ensemble_features = np.concatenate([
                features_rf.flatten(),  # Original features
                [rf_proba]  # RF prediction as additional feature
            ]).reshape(1, -1)
        
        try:
            # Ensure the input shape matches what CNN expects
            # Reshape for CNN (assuming it expects a specific input shape)
            cnn_input = ensemble_features.reshape(1, -1, 1)  # Reshape for 1D CNN
            
            # Get CNN prediction
            cnn_proba = cnn.predict(cnn_input, verbose=0)[0][0]
            model_predictions['cnn'] = float(cnn_proba)
            
            # RF-major weighted ensemble: RF 70%, XGB 20%, CNN 10%
            final_proba = (0.7 * rf_proba) + (0.2 * xgb_proba) + (0.1 * cnn_proba)
            final_pred = final_proba > 0.5
            prediction_method = "rf_major_ensemble"
            sys.stderr.write(f"PYTHON_LOG: CNN prediction: {cnn_proba}\n")
            
        except Exception as e:
            sys.stderr.write(f"PYTHON_LOG: CNN prediction failed: {str(e)}, falling back to weighted ensemble\n")
            # Fallback to RF-major ensemble
            if models_loaded['xgb']:
                final_proba = (0.8 * rf_proba) + (0.2 * xgb_proba)
                prediction_method = "rf_xgb_ensemble"
            else:
                final_proba = rf_proba
                prediction_method = "rf_only_fallback"
            final_pred = final_proba > 0.5
        
    elif models_loaded['xgb'] and models_loaded['rf']:
        # XGB + RF ensemble (weighted average)
        sys.stderr.write("PYTHON_LOG: Using XGB + RF ensemble\n")
        
        try:
            # Get XGBoost prediction
            scaled_xgb_input = scaler_xgb.transform(features_xgb)
            if models_loaded.get('pca', False):
                scaled_xgb_input = pca.transform(scaled_xgb_input)
            xgb_proba = xgb.predict_proba(scaled_xgb_input)[:, 1][0]
            model_predictions['xgb'] = float(xgb_proba)
        except Exception as e:
            sys.stderr.write(f"PYTHON_LOG: XGB prediction failed: {str(e)}, using RF only\n")
            xgb_proba = 0.0
            models_loaded['xgb'] = False
        
        # Get Random Forest prediction
        scaled_rf_input = scaler_rf.transform(features_rf)
        rf_proba = rf.predict_proba(scaled_rf_input)[:, 1][0]
        model_predictions['rf'] = float(rf_proba)
        
        if models_loaded['xgb']:
            # RF-major weighted ensemble 
            final_proba = (0.8 * rf_proba) + (0.2 * xgb_proba)
            prediction_method = "rf_major_weighted"
        else:
            final_proba = rf_proba
            prediction_method = "rf_only"
        
        final_pred = final_proba > 0.5
        
    elif models_loaded['rf']:
        # Fallback to RF only
        sys.stderr.write("PYTHON_LOG: Using Random Forest only\n")
        
        scaled_rf_input = scaler_rf.transform(features_rf)
        rf_proba = rf.predict_proba(scaled_rf_input)[:, 1][0]
        model_predictions['rf'] = float(rf_proba)
        
        final_proba = rf_proba
        final_pred = rf_proba > 0.5
        prediction_method = "rf_only"
        
    else:
        print(json.dumps({"error": "No valid models available for prediction"}))
        sys.exit(1)
    
    # Log the prediction details
    sys.stderr.write(f"PYTHON_LOG: PREDICTION METHOD: {prediction_method}\n")
    sys.stderr.write(f"PYTHON_LOG: MODEL PREDICTIONS: {model_predictions}\n")
    sys.stderr.write(f"PYTHON_LOG: FINAL PREDICTION: probability={final_proba}, isFraud={final_pred}\n")
    sys.stderr.flush()

    # Output result with enhanced fields for frontend
    result = {
        "isFraud": bool(final_pred),
        "probability": float(final_proba),
        "status": "fraud" if final_pred else "suspicious" if final_proba > 0.3 else "normal",
        "riskScore": int(round(final_proba * 100)),
        "amount": data["amount"],
        "type": data["type"],
        "day": data["day"],
        "transaction_pair_code": data["transaction_pair_code"],
        "part_of_the_day": data["part_of_the_day"],
        "factors": [],
        "predictionMethod": prediction_method,
        "modelPredictions": model_predictions
    }
    
    # Add risk factors based on input and model prediction
    if data["amount"] > 1000:
        result["factors"].append("High transaction amount")
    if data["part_of_the_day"] == "night":
        result["factors"].append("Unusual transaction time")
    if data["type"] == "CASH_OUT":
        result["factors"].append("Cash out transaction")
    if final_proba > 0.7:
        result["factors"].append("High fraud probability score")
    if final_proba > 0.5:
        result["factors"].append("Unusual transaction pattern")
    if data["type"] == "TRANSFER" and data["amount"] > 500:
        result["factors"].append("Large transfer amount")
    if data["transaction_pair_code"] == "cm" and data["part_of_the_day"] == "night":
        result["factors"].append("Unusual merchant transaction time")
    
    # Add ensemble-specific factors
    if prediction_method == "ensemble_cnn":
        result["factors"].append("Advanced ensemble prediction used")
    elif "ensemble_weighted" in prediction_method:
        result["factors"].append("Multi-model ensemble prediction")
        
    # Log the result to stderr
    sys.stderr.write(f"PYTHON_LOG: PREDICTION RESULT: {json.dumps(result)}\n")
    sys.stderr.flush()
    
    # Send the result to stdout for Java to read
    print(json.dumps(result))

except json.JSONDecodeError as e:
    error_msg = f"Invalid JSON input: {str(e)}"
    sys.stderr.write(f"PYTHON_LOG: ERROR: {error_msg}\n")
    sys.stderr.flush()
    print(json.dumps({"error": error_msg}))
    sys.exit(1)
except FileNotFoundError as e:
    error_msg = f"Model file not found: {str(e)}"
    sys.stderr.write(f"PYTHON_LOG: ERROR: {error_msg}\n")
    sys.stderr.flush()
    print(json.dumps({"error": error_msg}))
    sys.exit(1)
except Exception as e:
    import traceback
    error_details = traceback.format_exc()
    error_msg = f"Unexpected error: {str(e)}"
    sys.stderr.write(f"PYTHON_LOG: ERROR: {error_msg}\n")
    sys.stderr.write(f"PYTHON_LOG: TRACEBACK: {error_details}\n")
    sys.stderr.flush()
    print(json.dumps({
        "error": error_msg,
        "details": error_details,
        "timestamp": import_time.strftime("%Y-%m-%dT%H:%M:%S")
    }))
    sys.exit(1)