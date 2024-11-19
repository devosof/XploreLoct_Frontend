const BASE_URL = 'https://countriesnow.space/api/v0.1';

export const fetchCountries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/countries/codes`);
    const data = await response.json();
    if (data.error) throw new Error(data.msg);
    return data.data.map(country => ({
      name: country.name,
      code: country.code,
      phoneCode: country.dial_code
    }));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

export const fetchCitiesByCountry = async (country) => {
  try {
    const response = await fetch(`${BASE_URL}/countries/cities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ country })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.msg);
    return data.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};