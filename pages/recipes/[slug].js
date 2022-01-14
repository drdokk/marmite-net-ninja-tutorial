import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// build time
export const getStaticPaths = async () => {
  const response = await client.getEntries({ content_type: "recipe" });

  const paths = response.items.map((item) => {
    return {
      params: {
        slug: item.fields.slug,
      },
    };
  });

  return {
    //   paths: [{ params: { slug: 'a-slug'}}, ...]
    paths,
    // return 404 page if we try to reach a not existing path
    fallback: false,
  };
};

// fetch a single item based on the page we are on
export const getStaticProps = async ({ params }) => {
  // destructure "items" from reponse
  const { items } = await client.getEntries({
    content_type: "recipe",
    "fields.slug": params.slug,
  });

  // return the item to inject
  return {
    props: { recipe: items[0] },
  };
};

export default function RecipeDetails({ recipe }) {
  const { title } = recipe.fields;
  return <div>Recipe Details: {title}</div>;
}
