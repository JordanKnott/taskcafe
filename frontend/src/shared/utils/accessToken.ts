let accessToken = '';

export function setAccessToken(newToken: string) {
  console.log(newToken);
  accessToken = newToken;
}
export function getAccessToken() {
  return accessToken;
}

export async function getNewToken() {
  return fetch('/auth/refresh_token', {
    method: 'POST',
    credentials: 'include',
  }).then(x => {
    return x.json();
  });
}
