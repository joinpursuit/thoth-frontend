import { useEffect } from "react"
import { useNavigate } from "react-router";


export default function LoginRequired(props) {

  const navigate = useNavigate();
  
  useEffect(() => {
    if(!props.currentUser) {
      navigate("/login");
    }
  }, [props.currentUser])
  
  return (
    <>
      { props.children }
    </>
  )
}