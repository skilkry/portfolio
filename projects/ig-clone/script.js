function loadProfile() {
  const username = localStorage.getItem("username") || "jordan";
  const bio = localStorage.getItem("bio") || "Graphic designer and photographer";
  const link = localStorage.getItem("link") || "https://www.defectsdesigns.com";
  const image = localStorage.getItem("profileImage");

  document.getElementById("username").textContent = username;
  document.getElementById("bio").textContent = bio;
  document.getElementById("link").textContent = link;
  if (image) {
    document.getElementById("profile-img").style.backgroundImage = `url(${image})`;
  }

  loadStories();
  loadPosts();
}
function loadStories() {
  const stories = JSON.parse(localStorage.getItem("stories") || "[]");
  const storiesContainer = document.getElementById("stories");
  storiesContainer.innerHTML = "";
  stories.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    storiesContainer.appendChild(img);
  });
}
function loadPosts() {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = "";
  posts.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    postsContainer.appendChild(img);
  });
}
document.getElementById("upload-story").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const stories = JSON.parse(localStorage.getItem("stories") || "[]");
    stories.push(reader.result);
    localStorage.setItem("stories", JSON.stringify(stories));
    loadStories();
  };
  reader.readAsDataURL(file);
});
document.getElementById("upload-post").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.push(reader.result);
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
  };
  reader.readAsDataURL(file);
});
loadProfile();