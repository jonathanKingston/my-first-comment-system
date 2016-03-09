const urlParams = new URLSearchParams(window.location.search.substring(1));
const user = 'jonathanKingston';
const repo = 'my-first-comment-system';
const issue = urlParams.get('issue') || 44;

function load() {
  const url = `https://api.github.com/repos/${user}/${repo}/issues/${issue}/comments`;
  const req = fetch(url);

  req.then((res) => {
    return res.json();
  }).then((jsonBody) => {
    renderPost(jsonBody || []);
  });
}

function renderPost(responseBody) {
  const main = document.querySelector('main');
  const commentDOM = document.createElement('a');

  commentDOM.target = '_blank';
  commentDOM.innerText = 'Add a comment >>';
  commentDOM.href = `https://github.com/${user}/${repo}/issues/${issue}`;

  responseBody.forEach((comment) => {
    const commentDOM = makeComment(comment);
    main.appendChild(commentDOM);
  });

  main.appendChild(commentDOM);
}

function parseTags(text) {
  const match = text.match(/<\s*script[^>]*>[^<]*<\/\s*script\s*>/g) || [];
  const codeMatch = /<\s*script[^>]*>([^<]*)<\/\s*script\s*>/;
  let el = document.createElement('div');
  let frag = document.createDocumentFragment();
  el.innerHTML = text.replace(codeMatch, '');

  for (let child of el.childNodes) {
    frag.appendChild(child);
  }

  match.forEach((script) => {
    let code = script.match(codeMatch);
    if (code && code[1]) {
      const script = document.createElement('script');
      script.innerHTML = code[1];
      frag.appendChild(script);
    }
  });

  return frag;
}

function makeUser(user) {
  const userDOM = document.createElement('div');
  userDOM.innerHTML = `
    <strong>${user.login}</strong>
    <img src="${user.avatar_url}" class="avatar" />
  `;

  userDOM.className = 'user';

  return userDOM;
}

function makeComment(comment) {
  const commentDOM = document.createElement('div');
  const commentBodyDOM = document.createElement('div');
  const tags = parseTags(comment.body);
  const userDOM = makeUser(comment.user);

  commentBodyDOM.className = 'body';
  commentDOM.className = 'comment';

  commentBodyDOM.appendChild(tags);

  commentDOM.appendChild(commentBodyDOM);
  commentDOM.appendChild(userDOM);

  return commentDOM;
}


load();
