import markdownToHtml from 'markdownToHtml';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { InlineWysiwyg } from 'react-tinacms-editor';
import { InlineForm, InlineImage, InlineText } from 'react-tinacms-inline';
import { queryStrapi, STRAPI_BASE_URL } from 'strapi-service';
import { useCMS, useForm, usePlugin } from 'tinacms';

export default function Home({ homepageContent, blogs }) {
  const cms = useCMS();

  const formConfig = {
    id: homepageContent.id,
    label: 'Home Page',
    initialValues: homepageContent,
    onSubmit: async (values) => {
      const saveMutation = `
      mutation UpdateHomePageContent(
        $heroText: String
        $subText: String
        $heroImage: ID
        $body: String
      ) {
        updateHomepage(
          input: {
            data: { heroText: $heroText, subText: $subText, heroImage: $heroImage, body: $body}
          }
        ) {
          homepage {
            id
          }
        }
      }`;

      const response = await cms.api.strapi.fetchGraphql(saveMutation, {
        heroText: values.heroText,
        subText: values.subText,
        heroImage: values.heroImage.id,
        body: values.body,
      });

      if (response.data) {
        cms.alerts.success('Changes Saved');
      } else {
        cms.alerts.error('Error saving changes');
      }
    },
    fields: [],
  };

  const [content, form] = useForm(formConfig);

  usePlugin(form);

  if (!homepageContent) {
    return null;
  }

  const { heroImage } = homepageContent;

  return (
    <div className="w-screen h-full flex flex-col items-center pb-8">
      <div className="h-full flex flex-col w-full max-w-7xl">
        <InlineForm form={form}>
          <InlineImage
            name="heroImage.id"
            parse={(media) => media.id}
            uploadDir={() => '/'}
          >
            {() => (
              <img
                alt={heroImage.alternativeText}
                className="z-0 w-full h-[400px] object-cover"
                src={`${STRAPI_BASE_URL}${content.heroImage.url}`}
              />
            )}
          </InlineImage>
          <div className="z-10 pt-10 flex flex-col">
            <InlineText focusRing={false} name="heroText">
              <h1 className="text-3xl font-semibold text-center">
                {content.heroText}
              </h1>
            </InlineText>
            <InlineText focusRing={false} name="subText">
              <h1 className="text-xl font-semibold text-center">
                {content.subText}
              </h1>
            </InlineText>
          </div>
          <div className="max-w-7xl mt-8 prose">
            <InlineWysiwyg format="markdown" name="body">
              <ReactMarkdown>{content.body}</ReactMarkdown>
            </InlineWysiwyg>
          </div>
        </InlineForm>
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

export const getStaticProps = async ({ preview, previewData }) => {
  const [homepageContent, blogs] = await Promise.all([
    queryStrapi('/homepage'),
    queryStrapi('/blogs'),
  ]);

  const bodyContent = await markdownToHtml(homepageContent?.body || '');

  const pageData = {
    blogs,
    homepageContent: {
      ...homepageContent,
      bodyContent,
    },
  };

  if (preview) {
    return {
      props: {
        ...pageData,
        preview,
        ...previewData,
      },
    };
  }

  return {
    props: {
      ...pageData,
      preview: false,
    },
  };
};
