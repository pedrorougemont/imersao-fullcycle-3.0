import { Typography } from "@material-ui/core"
import { NextPage } from "next"
import Head from "next/head"
import styles from '../../styles/Home.module.css'

const Page404: NextPage = () => { 
    return (
        <div className={styles.container}>
            <Head>
                <title>Página não encontrada</title>
            </Head>
            <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
                404 - Página não encontrada
            </Typography>
        </div>        
    )
}

export default Page404;