import axios from 'axios';


const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTU0MDEzLCJpYXQiOjE3NDQ5NTM3MTMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjhlOWE4YmQ0LWViNWEtNGEwZS1iOGM4LWZhNjBhYWM2OGY2NSIsInN1YiI6InNoYXJhZC5jaGF1aGFuX2NzMjJAZ2xhLmFjLmluIn0sImVtYWlsIjoic2hhcmFkLmNoYXVoYW5fY3MyMkBnbGEuYWMuaW4iLCJuYW1lIjoic2hhcmFkIHNpbmdoIGNoYXVoYW4iLCJyb2xsTm8iOiIyMjE1MDAxNjM1IiwiYWNjZXNzQ29kZSI6IkNObmVHVCIsImNsaWVudElEIjoiOGU5YThiZDQtZWI1YS00YTBlLWI4YzgtZmE2MGFhYzY4ZjY1IiwiY2xpZW50U2VjcmV0IjoiSEd6VmNXSEZhWFVQd2VCVSJ9.24E4pLijOAGeRg1XiyB4CjwnUu9ymEAKYTvQVOD2zas'; // your token here

const headers = {
  Auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTU3ODU5LCJpYXQiOjE3NDQ5NTc1NTksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjhlOWE4YmQ0LWViNWEtNGEwZS1iOGM4LWZhNjBhYWM2OGY2NSIsInN1YiI6InNoYXJhZC5jaGF1aGFuX2NzMjJAZ2xhLmFjLmluIn0sImVtYWlsIjoic2hhcmFkLmNoYXVoYW5fY3MyMkBnbGEuYWMuaW4iLCJuYW1lIjoic2hhcmFkIHNpbmdoIGNoYXVoYW4iLCJyb2xsTm8iOiIyMjE1MDAxNjM1IiwiYWNjZXNzQ29kZSI6IkNObmVHVCIsImNsaWVudElEIjoiOGU5YThiZDQtZWI1YS00YTBlLWI4YzgtZmE2MGFhYzY4ZjY1IiwiY2xpZW50U2VjcmV0IjoiSEd6VmNXSEZhWFVQd2VCVSJ9.LyUgWo7mstiQh7ZkEPiO6iWHSf7R20e8wJNwVUbOZTo"
};


const BASE_URL = 'http://20.244.56.144/test';
const USER_COUNT = 2; // Assuming 10 users (user IDs 1 to 10)

const fetchPostsForUser = async (userId) => {
    try{
        const response = await axios.get(`${BASE_URL}/users/${userId}/posts`,headers);
        console.log("Fetching posts for user:");
     return response.data.posts;
    }
    catch(err){
        console.error("Error fetching posts for user:", err);
        // throw err;
    }
};

const fetchCommentsForPost = async (postId) => {
  const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`);
  return response.data.comments;
};

export async function getTopUsers() {
    const userCommentMap = new Map();
  
    for (let userId = 1; userId <= USER_COUNT; userId++) {
      const posts = await fetchPostsForUser(userId);
  
      let totalComments = 0;
      for (const post of posts) {
        const comments = await fetchCommentsForPost(post.id);
        totalComments += comments.length;
      }
      userCommentMap.set(userId, totalComments);
    }
  
    const sorted = [...userCommentMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, totalComments]) => ({ userId, totalComments }));
  
    return sorted;
  }

  export async function getPosts(type) {
    let allPosts = [];
  
    for (let userId = 1; userId <= USER_COUNT; userId++) {
      const posts = await fetchPostsForUser(userId);
      allPosts.push(...posts);
    }
  
    if (type === 'latest') {
      // Assuming posts have numeric IDs as a proxy for time (higher = newer)
      const sorted = allPosts.sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 5);
      return sorted;
    }
  
    if (type === 'popular') {
      const postCommentCounts = await Promise.all(
        allPosts.map(async (post) => {
          const comments = await fetchCommentsForPost(post.id);
          return { ...post, commentCount: comments.length };
        })
      );
  
      const maxCount = Math.max(...postCommentCounts.map(p => p.commentCount));
      const popularPosts = postCommentCounts.filter(p => p.commentCount === maxCount);
      return popularPosts;
    }
  }