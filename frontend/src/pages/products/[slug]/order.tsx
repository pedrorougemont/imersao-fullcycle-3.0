import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
import { Typography, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Button, Grid, Box } from "@material-ui/core"
import styles from '../../../../styles/Home.module.css'
import { Product } from '../../../model'
import http from '../../../http'
import axios from 'axios'
import { useRouter } from 'next/dist/client/router'

interface OrderPageProps {
    product: Product
}

const OrderPage : NextPage<OrderPageProps> = ({product}) => {
//const ProductDetailPage = () => {
  //const product = products[0];
  const router = useRouter();
  if(router.isFallback) {
    return <div>Carregando...</div>
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pagamento</title>
      </Head>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Checkout
      </Typography>
      <ListItem >
          <ListItemAvatar>
              <Avatar src={product.image_url} />
          </ListItemAvatar>
          <ListItemText primary={product.name} secondary={`R$ ${product.price}`}></ListItemText>
      </ListItem>
      <Typography component="h2" variant="h6" gutterBottom>
        Pague com cartão de crédito
      </Typography>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField label="Nome" fullWidth required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Número do cartão" required inputProps={{maxLength: 16}} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="CVV" fullWidth type="number" required />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField label="Expiração mês" fullWidth type="number" required />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Expiração ano" fullWidth type="number" required />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box marginTop={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth>Pagar</Button>
        </Box>
      </form>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<OrderPageProps, {slug : string}> = async (context) => {
    const { slug } = context.params!
    try {
      const { data: product } = await http.get(`products/${slug}`)
      console.log(product)
      return {
        props: {
          product
        }
      };
    } catch (e) {
      if(axios.isAxiosError(e) && e.response?.status == 404) {
        return { notFound: true }
      }
      throw e
    }
}  

export default OrderPage;