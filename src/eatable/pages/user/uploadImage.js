const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const uploadResponse = await fetch(
      "http://localhost:8080/api/attachments/update-image",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload image.");
    }

    return await uploadResponse.json();
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};

export default uploadImage;
