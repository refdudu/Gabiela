const deleteImage = (element) => {
  const e = document.createElement("div");
  e.firstElementChild;
  const parent = element.parentNode;
  const image = parent.firstElementChild;
  const imagePath = image.getAttribute("src");
  const imageName = imagePath.replace("/images/", "");
  const id = imageName.replace(".jpg", "");
  $.ajax({
    url: `upload/${id}`,
    type: "DELETE",
    processData: false,
    contentType: false,
    success: function (response) {
      window.location.reload();
    },
    error: function (jqXHR, textStatus, errorMessage) {
      console.log(errorMessage); // Optional
    },
  });
};
