import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue, runTransaction, push } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHm1pqLKr3Fd1AX3aA0GbjZ-klaN78s_s",
  authDomain: "cleanpay1-2d41e.firebaseapp.com",
  projectId: "cleanpay1-2d41e",
  storageBucket: "cleanpay1-2d41e.appspot.com",
  messagingSenderId: "389388336812",
  appId: "1:389388336812:web:4475d1766554d9b6a0e909",
  measurementId: "G-HR52C0XZGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Slide transition from summary to voting section
document.getElementById('voteNow').addEventListener('click', () => {
  document.getElementById('summarySection').classList.add('hidden');
  document.getElementById('votingSection').classList.remove('hidden');
});

// Vote references
const voteYesRef = ref(database, 'votes/yes');
const voteNoRef = ref(database, 'votes/no');

// Voting Yes
document.getElementById('voteYes').addEventListener('click', () => {
  runTransaction(voteYesRef, (currentVotes) => {
    return (currentVotes || 0) + 1;
  });
});

// Voting No
document.getElementById('voteNo').addEventListener('click', () => {
  runTransaction(voteNoRef, (currentVotes) => {
    return (currentVotes || 0) + 1;
  });
  document.getElementById('commentBox').style.display = 'block';  // Show comment box when No is clicked
});

// Realtime update for vote counts
onValue(voteYesRef, (snapshot) => {
  document.getElementById('voteCountYes').textContent = snapshot.val() || 0;
});

onValue(voteNoRef, (snapshot) => {
  document.getElementById('voteCountNo').textContent = snapshot.val() || 0;
});

// Handle sending the "No" comment
document.getElementById('sendComment').addEventListener('click', () => {
  const comment = document.getElementById('noComment').value;
  const commentsRef = ref(database, 'comments/');

  if (comment) {
    const newCommentRef = push(commentsRef);  // Add a new comment
    set(newCommentRef, {
      comment: comment,
      timestamp: new Date().toISOString()
    }).then(() => {
      alert('Comment sent!');
      document.getElementById('noComment').value = '';  // Clear the textarea
    });
  }
});

// Toggle the comment sidebar
document.getElementById('readComments').addEventListener('click', () => {
  const sidebar = document.getElementById('commentSidebar');
  sidebar.classList.toggle('show-sidebar');

  // Load comments from Firebase
  const commentsRef = ref(database, 'comments/');
  onValue(commentsRef, (snapshot) => {
    const comments = snapshot.val();
    let commentsHtml = '';
    for (let key in comments) {
      commentsHtml += `<p>${comments[key].comment} - ${new Date(comments[key].timestamp).toLocaleString()}</p>`;
    }
    document.getElementById('commentsList').innerHTML = commentsHtml;
  });
});

document.getElementById('addComment').addEventListener('click', () => {
  document.getElementById('commentBox').style.display = 'block';
});
