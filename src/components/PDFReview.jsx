import React from 'react'
import { useSelector } from 'react-redux'
import {Page,Document,Text,Image,StyleSheet} from "@react-pdf/renderer"
import { keys } from '../env';
import {getText} from ".././utils/getText"
import {useTranslation} from "react-i18next"

const PDFReview = ({review}) => {
    const {t}=useTranslation();
   
    const styles=StyleSheet.create({
        body:{
        paddingTop:20,
        paddingBottom:20,
        paddingHorizontal:20
        },
        
        img:{
            marginVertical: 15,
            marginHorizontal: 100,
        },
        title:{
            fontSize:24,
            textAlign:"center"
        },
        text:{
            marginTop:"30px"
        },
        profile:{
            width:"40px",
            height:"40px",
            borderRadius:"50%"
        },
        pageNumber:{
            position:"absolute",
            bottom:20,
            left:0,
            right:0,
            textAlign:"center",
            fontSize:12,
            color:"gray"
        }
    })
    const images=review.reviewImages.map(item=>(
        <Image style={styles.img} src={item.isDefault?keys.PF+item.img:item.img}/>
    ))
  return (
    <Document >
    <Page size="A4" style={styles.body}>
    <Text style={styles.title}>Review Name:{review.reviewName}</Text>
        {images}
    <Text style={styles.text} >Reviewed Piece:{review.reviewedPiece}</Text>
    <Text style={styles.text} >Tags:{review.tags.split(",").map(item=>`#${item}`)}</Text>
    <Text style={styles.text}>Group:{review.group}</Text>
    <Text style={styles.text} >Review Text:{getText(review.reviewText)}</Text>
   
    <Text style={styles.text}>Created By:</Text>
    <Image  style={styles.profile} src={review.user.profUpdated?review.user.profileImg:keys.PF+review.user.profileImg}/>
    <Text >{review.user.firstName} {review.user.lastName}</Text>
  
    <Text style={styles.pageNumber} render={({pageNumber,totalPages})=>`${pageNumber}/${totalPages}`} />


    </Page>
    </Document>
  )
}

export default PDFReview;