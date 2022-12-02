import iconLine from '../assets/images/line.png';
import iconTwitter from '../assets/images/twitter.png';
import iconFb from '../assets/images/facebook.png';

const Footer = () =>{
    return <footer>
    <div className="container">   
        <div className="nav-link">
            <a href="/#">關於STYLiSH</a>
            <a href="/#">服務條款</a>
            <a href="/#">隱私政策</a>
            <a href="/#">聯絡我們</a>
            <a href="/#">FAQ</a>
        </div>
        <div className="footer-right">
            <img src={iconLine} alt="line" />
            <img src={iconTwitter} alt="twitter" />
            <img src={iconFb} alt="facebook" />
        </div>
        <div className="copyright">&copy; 2022. All rights reserved.</div>
    </div> 
</footer>
}

export default Footer