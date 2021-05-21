
let apiUrl: string = "";

if (process.env.VIPPS_AGREEMENT_PAGE_API_URL) {
  apiUrl = process.env.VIPPS_AGREEMENT_PAGE_API_URL;
} else {
  //apiUrl = "https://dev.data.gieffektivt.no";
  apiUrl = "http://localhost:3000"
}

export const API_URL = apiUrl;