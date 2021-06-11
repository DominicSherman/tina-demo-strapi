export const STRAPI_BASE_URL = 'http://localhost:1337';

export const queryStrapi = async (path) => {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}${path}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.log('Strapi Error', error);
  }

  return null;
};
