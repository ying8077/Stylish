const Item = ({ id, color, img, price, title }) => {
    const arr_colors = color.split(',');

    return (
    <a href={`products/detail?id=${id}`} className="item">
        <img className="product-img" src={img} alt="product"/>
        <div className="details">
            <div className="colors">
                {arr_colors.map(color => {
                    return <span key={color} className="color" style={{ backgroundColor: color }}></span>
                })}
            </div>
            <div className="product-name">{title}</div>
            <div className="price">TWD.{price}</div>
        </div>
    </a>
    )
}

export default Item