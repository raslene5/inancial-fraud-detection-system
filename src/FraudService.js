export const predictFraud = async (data) => {
  try {
    const response = await fetch("http://localhost:8089/api/fraud-detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Prediction result:", result);
    return result;
  } catch (error) {
    console.error("Error predicting fraud:", error);
    return null;
  }
};
