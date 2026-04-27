from flask import Flask, render_template, jsonify
import pandas as pd
from sklearn.cluster import KMeans

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")



# kmeans clustering for Task 7
@app.route("/school-clusters")
def school_clusters():
    # Load CSV
    df = pd.read_csv("static/data/school_locations.csv")

    # Coordinates for clustering
    coords = df[["xcoord", "ycoord"]]

    # Choose number of clusters
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    df["cluster"] = kmeans.fit_predict(coords)

    # Convert to JSON-friendly format
    schools = df[["Name", "description", "xcoord", "ycoord", "cluster"]].to_dict(orient="records")

    # Add centroids to clarify the clusters visually

    centroids = [
        {
            "cluster": i,
            "xcoord": center[0],
            "ycoord": center[1]
        }
        for i, center in enumerate(kmeans.cluster_centers_)
    ]


    return jsonify({
        "schools": schools,
        "centroids": centroids
    })



if __name__ == "__main__":
    app.run(debug=True)


