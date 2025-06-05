document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("edit-username").value = localStorage.getItem("username") || "";
  document.getElementById("edit-bio").value = localStorage.getItem("bio") || "";
  document.getElementById("edit-link").value = localStorage.getItem("link") || "";

  document.getElementById("edit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("username", document.getElementById("edit-username").value);
    localStorage.setItem("bio", document.getElementById("edit-bio").value);
    localStorage.setItem("link", document.getElementById("edit-link").value);

    const file = document.getElementById("edit-image").files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem("profileImage", reader.result);
        location.href = "index.html";
      };
      reader.readAsDataURL(file);
    } else {
      location.href = "index.html";
    }
  });
});