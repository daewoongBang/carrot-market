import Layout from '@components/layout';
import { readdirSync, readFileSync } from 'fs';
import matter from 'gray-matter';
import { NextPage } from 'next';
import Link from 'next/link';

interface IPost {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: IPost[] }> = ({ posts }) => {
  return (
    <Layout title='Blog' seoTitle='Blog'>
      <h1 className='font-semibold text-center text-xl mt-5 mb-10'>
        Latest Posts
      </h1>

      <ul>
        {posts.map((post, index) => (
          <div key={index} className='mb-5'>
            <Link href={`/blog/${post.slug}`}>
              <div>
                <span className='text-lg text-blue-500'>{post.title}</span>
                <div>
                  <span>
                    {post.date} / {post.category}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </ul>
    </Layout>
  );
};

export async function getStaticProps() {
  const blogPosts = readdirSync('./posts').map(file => {
    const content = readFileSync(`./posts/${file}`, 'utf-8');
    const [slug, _] = file.split('.');

    return { ...matter(content).data, slug };
  });

  return {
    props: { posts: blogPosts }
  };
}

export default Blog;
