import axios from 'axios';

export default async function getHomeData() {
  try {
    // Use Promise.all to fetch all data concurrently
    const [homeConfig, submenu, headers] = await Promise.all([
      axios.get("https://backend.gezeno.in/api/home/config"),
      axios.get("https://backend.gezeno.in/api/submenu"),
      axios.get("https://backend.gezeno.in/api/home/headers"),
    ]);

    // Return the data after all promises are resolved
    return {
      homeConfig: homeConfig.data,
      submenu: submenu.data,
      headers: headers.data,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      homeConfig: null,
      submenu: null,
      headers: null,
    };
  }
}