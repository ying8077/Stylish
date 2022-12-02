import { useState, useEffect } from "react";
import { apiOrder } from "../../global/constants";
import "../../assets/style/dashboard.css"
import TotalRevenue from "./components/TotalRevenue";
import ColorGroup from "./components/ColorGroup";
import PriceGroup from "./components/PriceGroup";
import HotProduct from "./components/HotProduct";

const DashboardPage = () => {
    const getTotal = () => apiOrder.get(`/revenue`);
    const getColorSales = () => apiOrder.get(`/colors`);
    const getAllPrice = () => apiOrder.get(`/prices`);
    const getHotGroup = () => apiOrder.get(`/hots`);

    const [total, setTotal] = useState();
    const [colorGroup, setColorGroup] = useState();
    const [priceGroup, setPriceGroup] = useState();
    const [hotGroup, setHotGroup] = useState();

    async function getData() {
        const res_total = await getTotal();
        const data_total = res_total.data.data.total
        setTotal(data_total);

        const res_color = await getColorSales();
        setColorGroup(res_color.data);

        const res_price = await getAllPrice();
        setPriceGroup(res_price.data);

        const res_hot = await getHotGroup();
        console.log(res_hot.data);
        setHotGroup(res_hot.data);
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div className="dashboard_container">
            <TotalRevenue total={total} />
            {colorGroup && (
                <ColorGroup colorGroup={colorGroup} />
            )}
            <PriceGroup priceGroup={priceGroup} />
            {hotGroup && (
                <HotProduct hotGroup={hotGroup} />
            )}
        </div>
    )
}

export default DashboardPage