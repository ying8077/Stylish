import Plot from 'react-plotly.js';

const PriceGroup = ({ priceGroup }) => {

    return (
        <Plot className='histogram'
            data={[
                {
                    x: priceGroup,
                    y:10,
                    // name: 'control',
                    autobinx: false,
                    histnorm: "count",
                    marker: {
                        color: "rgba(255, 100, 102, 0.7)",
                        line: {
                            color: "rgba(255, 100, 102, 1)",
                            width: 1
                        }
                    },
                    // opacity: 0.5,
                    type: "histogram",
                    xbins: {
                        size: 20,
                    }
                }
            ]}
            layout={{
                bargap: 0.05,
                // bargroupgap: 0.2,
                // barmode: "overlay",
                title: "Product sold in different price range",
                xaxis: { title: "Price Range" },
                yaxis: { title: "Quantity" }
            }}
        />
    )
}

export default PriceGroup