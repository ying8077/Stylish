import Plot from 'react-plotly.js';

const ColorGroup = ({colorGroup}) => {

    return (
        <Plot className='pie'
            data={[
                {
                    values: colorGroup.quantity,
                    labels: colorGroup.color_name,
                    type: 'pie',
                    marker: {
                        colors: colorGroup.color_code
                    },
                }
            ]}
            layout={{ title: 'Product sold percentage in different colors' }}
        />
    
    )
}

export default ColorGroup