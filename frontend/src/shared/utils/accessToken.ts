let accessToken = '';

export function setAccessToken(newToken: string) {
  accessToken = newToken;
}
export function getAccessToken() {
  return accessToken;
}

export async function getNewToken() {
  return fetch('http://localhost:3333/auth/refresh_token', {
    method: 'POST',
    credentials: 'include',
  }).then(x => {
    return x.json();
  });
}
