import Header from "../../components/Header"
import Footer from "../../components/Footer"
import SignIn from "./components/SignIn"
import "../../assets/style/signIn.css"

const signInPage = () =>{
    return(
        <>
            <Header />
            <SignIn />
            <Footer />
        </>
    )
}

export default signInPage