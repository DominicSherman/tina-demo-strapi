import markdownToHtml from 'markdownToHtml';
import Link from 'next/link';
import { queryStrapi, STRAPI_BASE_URL } from 'strapi-service';

export default function Home({ homepageContent, blogs }) {
  if (!homepageContent) {
    return null;
  }

  const { heroImage } = homepageContent;

  return (
    <div className="w-screen h-full flex flex-col items-center pb-8">
      <div className="h-full flex flex-col w-full max-w-7xl">
        <img
          alt={heroImage.alternativeText}
          className="z-0 w-full h-[400px] object-cover"
          src={`${STRAPI_BASE_URL}${heroImage.url}`}
        />
        <div className="z-10 pt-10">
          <h1 className="text-3xl font-semibold ml-7 text-center">
            {homepageContent.heroText}
          </h1>
          <h3 className="text-xl font-semibold ml-7 text-center">
            {homepageContent.subText}
          </h3>
        </div>
        <div className="max-w-7xl mt-8 prose">
          <div
            dangerouslySetInnerHTML={{ __html: homepageContent.bodyContent }}
          />
        </div>
        <div className="max-w-7xl mt-10">
          <h1 className="text-5xl font-bold mb-4">Blog Posts</h1>
          <div className=" grid grid-flow-row grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <Link href={`/blogs/${blog.slug}`}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>
                  <div className="flex flex-col w-full items-center border border-gray-300 rounded-md p-4 mt-3">
                    <h3 className="text-2xl font-semibold">{blog.title}</h3>
                    <h4 className="text-lg mt-1">{blog.description}</h4>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  const [homepageContent, blogs] = await Promise.all([
    queryStrapi('/homepage'),
    queryStrapi('/blogs'),
  ]);

  const bodyContent = await markdownToHtml(homepageContent?.body || '');

  return {
    props: {
      blogs,
      homepageContent: {
        ...homepageContent,
        bodyContent,
      },
    },
  };
};
