import { STRAPI_JWT } from 'react-tinacms-strapi';

const previewHandler = (req, res) => {
  console.log({ STRAPI_JWT, cookies: req.cookies });

  const previewData = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    strapi_jwt: req.cookies[STRAPI_JWT],
  };

  res.setPreviewData(previewData);
  res.status(200).end();
};

export default previewHandler;
