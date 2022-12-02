import Plot from 'react-plotly.js';

const HotProduct = ({ hotGroup }) => {
    let hot_id = [];
    let size_S = [];
    let size_M = [];
    let size_L = [];

    for (let i = 0; i < hotGroup.length; i++) {
        hot_id.push(`product${hotGroup[i].id}`);
        size_S.push(hotGroup[i].sizes[0].qty);
        size_M.push(hotGroup[i].sizes[1].qty);
        size_L.push(hotGroup[i].sizes[2].qty);
        console.log(hot_id);
    }

    return (
        <Plot className='stack-bar'
            data={[
                {
                    x: hot_id,
                    y: size_L,
                    name: 'L',
                    type: 'bar'
                }, {
                    x: hot_id,
                    y: size_M,
                    name: 'M',
                    type: 'bar'
                },
                {
                    x: hot_id,
                    y: size_S,
                    name: 'S',
                    type: 'bar'
                }
            ]}
            layout={{ barmode: 'stack', title: 'TOP5 product sold in different sizes' }}
        />

    )
}

export default HotProduct