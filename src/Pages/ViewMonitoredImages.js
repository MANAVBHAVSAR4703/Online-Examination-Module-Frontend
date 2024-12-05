import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Loading from "../Components/Loading";

function ViewMonitoredImages() {
  const token = Cookies.get("token");
  const location = useLocation();
  const userEmail = location.state?.userEmail;
  const exam = location?.state?.exam;
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For modal
  console.log(userEmail);

  if (!token) {
    throw new Error("JWT token not found in cookie");
  }

  let AuthStr = `Bearer ${token}`;

  useEffect(() => {
    if (userEmail) {
      axios
        .get(
          `http://localhost:8080/api/admin/getMonitorImages/${userEmail}/${exam?.examId}`,
          {
            headers: {
              Authorization: AuthStr,
            },
          }
        )
        .then((response) => {
          setImages(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
          setError("Failed to load images.");
          setLoading(false);
        });
    }
  }, [userEmail]);

  if (loading) return <Loading/>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>
        Monitored Images for <b style={{fontFamily:'cursive'}}>{userEmail}</b> for <b style={{fontFamily:'cursive'}}>{exam?.examName}</b>
      </h2>
      {images.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {images.map((data, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                position: "relative",
              }}>
              <img
                src={`data:image/png;base64,${data?.image}`}
                alt={`Monitored screenshot ${index + 1}`}
                style={{ width: "200px", height: "150px", objectFit: "cover" }}
              />
              <button
                onClick={() =>
                  setSelectedImage(`data:image/png;base64,${data?.image}`)
                }
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  border: "none",
                  padding: "5px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}>
                🔍
              </button>
              <p>Screenshot {index + 1}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>No images captured for this user.</div>
      )}

      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}>
          <div
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
              left: "10%",
            }}>
            <img
              src={selectedImage}
              alt='Fullscreen View'
              style={{ width: "80%", height: "80%", objectFit: "contain" }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: "fixed",
                top: "10px",
                right: "10px",
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
                border: "none",
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "18px",
              }}>
              ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewMonitoredImages;
