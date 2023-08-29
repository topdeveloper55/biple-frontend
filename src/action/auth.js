import * as sdk from 'matrix-js-sdk';
import cons from 'services/cons';

const updateLocalStore = (accessToken, deviceId, userId, baseUrl) => {
  localStorage.setItem(cons.secretKey.ACCESS_TOKEN, accessToken);
  localStorage.setItem(cons.secretKey.DEVICE_ID, deviceId);
  localStorage.setItem(cons.secretKey.USER_ID, userId);
  localStorage.setItem(cons.secretKey.BASE_URL, baseUrl);
};

export const createTemporaryClient = (baseUrl) => {
  return sdk.createClient({ baseUrl });
};

export const startSsoLogin = async (baseUrl, type, idpId) => {
  const client = createTemporaryClient(baseUrl);
  localStorage.setItem(cons.secretKey.BASE_URL, client.baseUrl);
  window.location.href = client.getSsoLoginUrl(
    window.location.href,
    type,
    idpId
  );
};

export const login = async (baseUrl, username, email, password) => {
  const identifier = {};
  if (username) {
    identifier.type = 'm.id.user';
    identifier.user = username;
  } else if (email) {
    identifier.type = 'm.id.thirdparty';
    identifier.medium = 'email';
    identifier.address = email;
  } else throw new Error('Bad Input');

  const client = createTemporaryClient(baseUrl);
  const res = await client.login('m.login.password', {
    identifier,
    password,
    initial_device_display_name: cons.DEVICE_DISPLAY_NAME,
  });

  const myBaseUrl =
    res?.well_known?.['m.homeserver']?.base_url || client.baseUrl;
  updateLocalStore(res.access_token, res.device_id, res.user_id, myBaseUrl);
  return res;
};

export const loginWithToken = async (baseUrl, token) => {
  const client = createTemporaryClient(baseUrl);

  const res = await client.login('m.login.token', {
    token,
    initial_device_display_name: cons.DEVICE_DISPLAY_NAME,
  });

  const myBaseUrl =
    res?.well_known?.['m.homeserver']?.base_url || client.baseUrl;
  updateLocalStore(res.access_token, res.device_id, res.user_id, myBaseUrl);
};

// eslint-disable-next-line camelcase
export const verifyEmail = async (
  baseUrl,
  email,
  client_secret,
  send_attempt,
  next_link
) => {
  const res = await fetch(
    `${baseUrl}/_matrix/client/r0/register/email/requestToken`,
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        client_secret,
        send_attempt,
        next_link,
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'same-origin',
    }
  );
  const data = await res.json();
  return data;
};

export const completeRegisterStage = async (
  baseUrl,
  username,
  password,
  auth
) => {
  const tempClient = createTemporaryClient(baseUrl);

  try {
    const result = await tempClient.registerRequest(
      {
        username,
        password,
        auth,
        initial_device_display_name: cons.DEVICE_DISPLAY_NAME,
      },
      'user'
    );
    const data = { completed: result.completed || [] };
    if (result.access_token) {
      data.done = true;
      updateLocalStore(
        result.access_token,
        result.device_id,
        result.user_id,
        baseUrl
      );
    }
    return result;
  } catch (e) {
    const result = e.data;
    const data = { completed: result.completed || [] };
    if (result.access_token) {
      data.done = true;
      updateLocalStore(
        result.access_token,
        result.device_id,
        result.user_id,
        baseUrl
      );
    }
    return data;
  }
};
