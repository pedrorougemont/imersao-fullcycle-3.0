import Head from 'next/head'
import { GetStaticProps, NextPage, GetStaticPaths } from 'next'
import { Typography, Card, CardMedia, CardContent, CardActions, CardHeader, Button } from "@material-ui/core"
import styles from '../../../../styles/Home.module.css'
import { Product } from '../../../model'
import http from '../../../http'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/dist/client/router'

interface ProductDetailPageProps {
    product: Product
}

const ProductDetailPage : NextPage<ProductDetailPageProps> = ({product}) => {
//const ProductDetailPage = () => {
  //const product = products[0];
  const router = useRouter();
  if(router.isFallback) {
    return <div>Carregando...</div>
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{product.name} - Detalhes do produto</title>
      </Head>
      <Card>
        <CardHeader title={ product.name.toUpperCase() }
                    subheader={`R$ ${product.price}`}
        ></CardHeader>
        <CardActions>
          <Link href="/products/[slug]/order" as={`/products/${product.slug}/order`} passHref>
            <Button size="small" color="primary" component="a">Comprar</Button>
          </Link>
        </CardActions>
        <CardMedia style={{ paddingTop: "56%" }} image={product.image_url} />
        <CardContent>
            <Typography component="p" variant="body2" color="textSecondary">
                {product.description}
            </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export const getStaticProps: GetStaticProps<ProductDetailPageProps, {slug : string}> = async (context) => {
    const { slug } = context.params!
    try {
      const { data: product } = await http.get(`products/${slug}`)
      console.log(product)
      return {
        props: {
          product
        },
        revalidate: 1 * 60 * 2
      };
    } catch (e) {
      if(axios.isAxiosError(e) && e.response?.status == 404) {
        return { notFound: true }
      }
      throw e
    }
}  

export const getStaticPaths : GetStaticPaths = async (context) => {
  const { data: products } = await http.get('products')

  const paths = products.map((p: Product) => ({
    params: { slug : p.slug }
  }))

  return { paths, fallback: 'blocking' }
}

export default ProductDetailPage;