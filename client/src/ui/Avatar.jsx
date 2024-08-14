import {  useEffect, useState } from "react"
import styles from "./Avatar.module.css"
import placeholder from "./../assets/default-avatar.jpg";

const AVATAR_URL="https://randomuser.me/api/"

function Avatar() {
    const [avatarLink, setAvatarLink] = useState("")
    const [loading, setIsloading] = useState(false)
    useEffect(()=>{
        async function fetchAvatar(){
            setIsloading(true)
            try{
                const res = await fetch(`${AVATAR_URL}`)
                const data = await res.json();
                setAvatarLink(data.results[0].picture.medium)
            }catch(err){
                console.error("Error fetching avatar", err);
            }
            finally{
                setIsloading(false)
            }
        }
        fetchAvatar()
    }, [])
    return (
        <img src={loading ? placeholder : avatarLink} alt="avatar" className={loading ? styles.placeholder : styles.avatar }>
            
        </img>
    )
}

export default Avatar
