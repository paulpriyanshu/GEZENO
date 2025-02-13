export default async function getHomeData() {
  try {
    // Use Promise.all to fetch all data concurrently
    const [homeConfig, submenu, headers,categories] = await Promise.all([
      fetch("https://backend.gezeno.in/api/home/config").then((res) => res.json()),
      fetch("https://backend.gezeno.in/api/submenu").then((res) => res.json()),
      fetch("https://backend.gezeno.in/api/home/headers").then((res) => res.json()),
      fetch("https://backend.gezeno.in/api/getOnlyCategories").then((res)=>res.json())
    ]);

    // Return the data after all promises are resolved
    return {
      homeConfig,
      submenu,
      headers,
      categories
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      homeConfig: null,
      submenu: null,
      headers: null,
      categories:null
    };
  }
}