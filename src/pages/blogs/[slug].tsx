import markdownToHtml from 'markdownToHtml';
import { queryStrapi, STRAPI_BASE_URL } from 'strapi-service';

export default function Post({ blog }) {
  if (!blog) {
    return null;
  }

  const { headerImage, title, description, content } = blog;

  return (
    <div className="w-screen h-full flex flex-col items-center pb-8">
      <div className="h-full flex flex-col w-full max-w-4xl">
        <img
          alt={headerImage.alternativeText}
          className="z-0 w-full h-[400px] object-cover"
          src={`${STRAPI_BASE_URL}${headerImage.url}`}
        />
        <div className="z-10 pt-10">
          <h1 className="text-3xl font-semibold ml-7 text-center">{title}</h1>
          <h3 className="text-xl ml-7 text-center">{description}</h3>
        </div>
        <div className="max-w-4xl mt-8 prose">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const blogs = await queryStrapi(`/blogs?slug=${params.slug}`);
  const blog = blogs.length ? blogs[0] : null;
  const content = await markdownToHtml(blog?.body || '');

  return {
    props: {
      blog: {
        ...blog,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const blogs = await queryStrapi('/blogs');

  return {
    paths: blogs?.map((blog) => `/blogs/${blog.slug}`) || [],
    fallback: true,
  };
}
