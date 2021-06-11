export const STRAPI_BASE_URL =
  'https://custom-auth-example-production.up.railway.app';

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
