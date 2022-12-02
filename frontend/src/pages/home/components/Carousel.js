import Carousel from 'react-bootstrap/Carousel';
import banner from '../../../assets/images/banner.png';

function CarouselFade() {
    return (
        <Carousel fade controls={false}>
            <Carousel.Item>
                <img className="d-block w-100" src={banner} alt="first slide" />
            </Carousel.Item>
            <Carousel.Item>
                <img className="d-block w-100" src="https://picsum.photos/1200/300?random=1" alt="second slide" />
            </Carousel.Item>
            <Carousel.Item>
                <img className="d-block w-100" src="https://picsum.photos/1200/300?random=2" alt="third slide" />
            </Carousel.Item>
        </Carousel>
    );
}

export default CarouselFade;