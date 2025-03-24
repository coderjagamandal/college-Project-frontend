import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { X, Flag, Heart, Send, MessagesSquare } from "lucide-react";
import { AllPostContextData } from "../../Context/AllPostContext";
import { UserAuthCheckContext } from "../../Context/UserAuthCheck";
import gsap from "gsap";
import './PostModel.css'
import defaultprofilepic from '../../Photo/defaultprofilepic.png'
import { formatDistanceToNow, isToday, parseISO } from "date-fns";
import CommentSection from "./CommentSection";


const PostModel = ({ postId, onClose }) => {

    const [comments, setComments] = useState([]);
    const [mobileview, setMobileview] = useState(false);
    const { allpost, setAllpost, isLiked, setIsLiked } = useContext(AllPostContextData);
    const { usertoken } = useContext(UserAuthCheckContext);
    const modalRef = useRef(null);

    useEffect(() => {
        const resize = () => {
            if (window.innerWidth < 644) {
                setMobileview(false);
            } else {
                setMobileview(true);
            }
        };
    

        resize();
    
        window.addEventListener('resize', resize);
    
        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []); 
 


    useEffect(() => {
        if (!postId || !modalRef.current) {
            console.warn("GSAP Error: modalRef is missing.");
            return;
        }
        let tl = gsap.timeline();
        if(mobileview){
          
    
                tl.to(modalRef.current, { scale: 1, duration: 0.5, ease: "power2.out" })
    
                .to(modalRef.current, { backgroundColor: 'rgba(0, 0, 0, 0.7)', duration: 0.5, ease: "power2.out" })
                document.body.style.overflowY = 'hidden'
           
        }else{
               document.body.style.overflowY = 'hidden'
            tl.fromTo(
                modalRef.current,
                { y : '100%' }, // Start from scale 0
                { y: "0%", duration: 0.5, ease: "power2.out" }
              )
    
              .fromTo(modalRef.current,  
                { backgroundColor: 'rgba(0, 0, 0, 0)' }, // Start from transparent
                { backgroundColor: 'rgba(0, 0, 0, 0.7)', duration: 0.5, ease: "power2.out" })
        }

        return () => {
            if (tl) tl.kill(); // Stop animation if component unmounts
            document.body.style.overflowY = 'scroll';
        };
      
    }, [postId,mobileview]);

    // ✅ Close animation (100% → 0%)
    const handleClose = () => {
        if (modalRef.current) {
            gsap.to(modalRef.current, { opacity: 0, y: "100%", duration: 0.3, ease: "power2.in", 
                onComplete: () => {
                    document.body.style.overflowY = 'scroll';
                    onClose(); // Close modal after animation completes
                } 
            });
        } else {
            console.warn("GSAP Warning: modalRef is null on close.");
            onClose(); // Ensure modal closes even if GSAP fails
        }
    };



    if (!usertoken) return null;

    const post = allpost.find(post => post.post_id === postId);
    if (!post) return null;

    const handlelike = async () => {
        try {
            const response = await axios.post("/api/posts/like", {
                user_id: usertoken.user.id,
                post_id: postId,
            });

            setAllpost((prevPosts) =>
                prevPosts.map((post) =>
                    post.post_id === postId
                        ? { ...post, like_count: post.like_count + response.data.change }
                        : post
                )
            );

            // ✅ Store liked status for UI toggle
            setIsLiked((prevLiked) => ({
                ...prevLiked,
                [postId]: response.data.liked, // Store liked status as true/false
            }));

        } catch (error) {
            console.error("Error liking post:", error);
        }
    };



  

   
    const formatTimeAgo = (createdAt) => {
        const date = parseISO(createdAt);

        if (isToday(date)) {

            return formatDistanceToNow(date, { addSuffix: true });
        } else {

            return formatDistanceToNow(date, { addSuffix: true, includeSeconds: false });
        }
    };


    // console.log("this is post ",post);
    // console.log("this is allpost ",allpost);

    return (
        <div className="modal-overlay" ref={modalRef}>
            <div className="modal-content">
                <button className="close-btn" onClick={handleClose}><X size={24} /></button>


                <div className="modal-left">
                    <div className="modle-left-name-box">
                        <div className="modle-left-name-box-inside">
                            <img src={post.post_user_pic ? post.post_user_pic : defaultprofilepic} alt="Post" />
                            <div className="modle-left-name-box-name">
                                <h3>{post.post_username} &nbsp; <p>{formatTimeAgo(post.created_at)}</p></h3>

                            </div>
                        </div>

                        <button className="report-btn"><Flag size={24} /></button>

                    </div>
                    <p className="post-model-contect">{post.content}</p>
                    <div className="post-view-box-image">
                        {post.image && <img src={post.image} alt="Post" className="post-image" />}
                    </div>


                </div>

                <div className="modal-right">

                    <div className="model-right-comment-area">
                        <div className="modal-right-content-function-box">

                            <span className="likes"><Heart size={16} onClick={handlelike} className={isLiked[post.post_id] ? "liked" : ""} /> {post.like_count} </span>
                            <span><MessagesSquare size={16} />   {post.comments.filter(comment => comment.comment_id && comment.comment_text).length}</span>
                            <span><Send size={16} /></span>
                        </div>

                 
                       
                        <CommentSection post={post}  />



                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostModel
