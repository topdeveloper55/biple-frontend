import axios from 'axios';
/* eslint-disable camelcase */
// const base_url = 'http://localhost:8080/';
const base_url = "https://biple-server-58ea.onrender.com/"
class JwtService {
  constructor() {
    axios.defaults.baseURL = base_url;
    // axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
    // axios.defaults.headers.common["Access-Control-Allow-Methods"] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  }

  //Auth API
  checkMail = (email: string) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth/checkmail', { email })
        .then((res) => {
          if (res.data) {
            resolve(res.data);
          } else reject(res);
        })
        .catch((e) => {
          if (e.response) reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };
  createUser = (data: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth/register', data)
        .then((response) => {
          if (response.data) {
            // this.setSession(response.data.accesstoken);
            resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch((e) => {
          if (e.response && e.response.status === 400)
            reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };

  signIn = (userName: string, password: string, referral: string) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth/login', { userName, password, referral })
        .then((response) => {
          if (response.data.accessToken) {
            this.setSession(response.data);
            resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch((e) => {
          if (e.response && e.response.status === 400)
            reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };

  updateUser = (data: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth/update', data)
        .then((response) => {
          if (response.data.status) {
            resolve(response.data.user);
          } else {
            reject(response.data.message);
          }
        })
        .catch((e) => {
          if (e.response && e.response.status === 400)
            reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };

  getUserInfo = (userName: string) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth/getuser', { userName })
        .then((response) => {
          if (response.data.status) {
            resolve(response.data.user);
          } else {
            reject(response.data.message);
          }
        })
        .catch((e) => {
          if (e.response && e.response.status === 400)
            reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };

  setSession = (userData: any) => {
    const { accessToken, user } = userData;
    if (accessToken) {
      try {
        localStorage.setItem('jwt_access_token', accessToken);
        localStorage.setItem('user_data', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `JWT ${accessToken}`;
      } catch (e) {
        console.log(e);
      }
    } else {
      localStorage.removeItem('jwt_access_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  logout = () => {
    this.setSession(null);
  };

  // isAuthTokenValid = (access_token: string) => {
  // 	if (!access_token) {
  // 		return false;
  // 	}
  // 	const decoded: any = jwtDecode(access_token);
  // 	const currentTime = Date.now() / 1000;
  // 	if (decoded.exp < currentTime) {
  // 		console.warn('access token expired');
  // 		return false;
  // 	}

  // 	return true;
  // };

  getAccessToken = (): string => {
    const token = localStorage.getItem('jwt_access_token');
    return token ? token : '';
  };

  //Community API
  getServersByUser = (userId: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get('/community/user', { params: { userId } })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch((e) => {
          if (e.response && e.response.status === 400)
            reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };
  getServersBySearch = (searchString: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get('/community/search', { params: { searchString } })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch((e) => {
          if (e.response && e.response.status === 400)
            reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };
  createServer = (data: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/community/create', data)
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch((e) => {
          if (e.response && e.response.status === 400)
            reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };
  joinServer = (data: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/community/join', data)
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch((e) => {
          if (e.response && e.response.status === 400)
            reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };
  updateServer = (data: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/community/update', data)
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch((e) => {
          if (e.response) reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };
  leaveServer = (data: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/community/leave', data)
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch((e) => {
          if (e.response && e.response.status === 400)
            reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };
  deleteServer = (communityId: string) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/community/delete', { communityId })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch((e) => {
          if (e.response) reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };
  uploadImage = (data: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/upload', data)
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch((e) => {
          if (e.response && e.response.status === 400)
            reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };
  generateOtp = (generating: boolean) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth/otp/generate', { generating })
        .then((res) => {
          if (res.data) {
            resolve(res.data);
          } else {
            reject(res.data.message);
          }
        })
        .catch((e) => {
          if (e.response) reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };
  validateOtp = (token: string) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth/otp/validate', { token })
        .then((res) => {
          if (res.data) {
            resolve(res.data);
          } else {
            reject(res.data.message);
          }
        })
        .catch((e) => {
          if (e.response) reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };
  verifyOtp = (token: string) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth/otp/validate', { token })
        .then((res) => {
          if (res.data) {
            resolve(res.data);
          } else {
            reject(res.data.message);
          }
        })
        .catch((e) => {
          if (e.response && e.response.status === 400)
            reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };
  disableOtp = () => {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth/otp/disable')
        .then((res) => {
          if (res.data) {
            resolve(res.data);
          } else {
            reject(res.data.message);
          }
        })
        .catch((e) => {
          if (e.response && e.response.status === 400)
            reject(e.response.data.message);
          else reject(e.message);
        });
    });
  };
}

const instance = new JwtService();

export default instance;
