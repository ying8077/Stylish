import Item from "./Item"

const Product = ({ product }) => {
    return <section className="product-container">
        <div className="wrap">
            {product.map((item) => {
                const { id, color, img, price, title } = item;
                return (
                    <Item
                        key={id}
                        id={id}
                        color={color}
                        img={img}
                        price={price}
                        title={title}
                    />
                );
            })}
        </div>
    </section>
}

export default Product