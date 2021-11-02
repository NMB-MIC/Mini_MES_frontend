// App_Init
export const APP_INIT = "APP_INIT";
export const APP_TITLE = "Template";

// Error Code
export const E_PICKER_CANCELLED = "E_PICKER_CANCELLED";
export const E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR =
  "E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR";
export const E_PERMISSION_MISSING = "E_PERMISSION_MISSING";
export const E_PICKER_NO_CAMERA_PERMISSION = "E_PICKER_NO_CAMERA_PERMISSION";
export const E_USER_CANCELLED = "E_USER_CANCELLED";
export const E_UNKNOWN = "E_UNKNOWN";
export const E_DEVELOPER_ERROR = "E_DEVELOPER_ERROR";
export const TIMEOUT_NETWORK = "ECONNABORTED"; // request service timeout
export const NOT_CONNECT_NETWORK = "NOT_CONNECT_NETWORK";

//////////////// Localization Begin ////////////////
export const NETWORK_CONNECTION_MESSAGE =
  "Cannot connect to server, Please try again.";
export const NETWORK_TIMEOUT_MESSAGE =
  "A network timeout has occurred, Please try again.";
export const UPLOAD_PHOTO_FAIL_MESSAGE =
  "An error has occurred. The photo was unable to upload.";

export const apiUrl = "http://localhost:2008/api/mini_mes/";
// export const imageUrl = "http://54.255.187.109:2009/";

export const YES = "YES";
export const NO = "NO";
export const OK = "ok";
export const NOK = "nok";

export const server = {
  LOGIN_URL: `authen/login`,
  REGISTER_URL: `authen/register`,
  USER_URL: `manage_user/user`,
  FIND_USER_URL: `manage_user/find_user`,
  CHANGE_LV_URL: `manage_user/changeLevel`,
  MODELS_MASTER_URL: 'models_master/model',
  MATERIALS_MASTER_URL: 'materials_master/material',
  BOM_URL: 'bill_of_material/bom'
};

export const key = {
  LOGIN_PASSED: `LOGIN_PASSED`,
  API_KEY: `API_KEY`,
  USER_LV: `USER_LV`,
  USER_NAME: "USER_NAME",
  USER_EMP: "USER_EMP",
  TEMP_EMP: "TEMP_EMP",
  TOKEN: "TOKEN",
  TIME_LOGIN: 'TIME_LOGIN',
};
