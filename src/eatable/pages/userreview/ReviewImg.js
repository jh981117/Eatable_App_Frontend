import React, { useEffect, useState } from "react";

function ReviewImg({ storeId = 1 }) {
  const [reviewImages, setReviewImages] = useState([]);

  useEffect(() => {
    const fetchReviewImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/store/${storeId}/review/images`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch review images");
        }
        const data = await response.json();
        console.log(data, "1232114");
        setReviewImages(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchReviewImages();
  }, [storeId]);

  return (
    <div>
     
      <div>
        {reviewImages.map((image) => (
          <img key={image.imageUrl} src={image.imageUrl} alt="Review" style={{borderRadius: "10px"}} />
        ))}
      </div>
    </div>
  );
}

export default ReviewImg;
