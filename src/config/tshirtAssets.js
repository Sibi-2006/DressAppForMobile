export const tshirtAssets = {
    fits: {
        normal: {
            label: 'Normal Fit',
            price: '₹799',
        },
        oversized: {
            label: 'Oversized',
            price: '₹999',
        },
    },
    colors: [
        {
            id: 'black',
            name: 'Black',
            hex: '#000000',
            images: {
                normal: {
                    front: require('../../assets/tshirts/normal_black_front.png'),
                    back: require('../../assets/tshirts/normal_black_back.png'),
                },
                oversized: {
                    front: require('../../assets/tshirts/oversized_black_front.png'),
                    back: require('../../assets/tshirts/oversized_black_back.png'),
                },
            },
        },
        {
            id: 'white',
            name: 'White',
            hex: '#FFFFFF',
            images: {
                normal: {
                    front: require('../../assets/tshirts/normal_white_front.png'),
                    back: require('../../assets/tshirts/normal_white_back.png'),
                },
                oversized: {
                    front: require('../../assets/tshirts/oversized_white_front.png'),
                    back: require('../../assets/tshirts/oversized_white_back.png'),
                },
            },
        },
        {
            id: 'blue',
            name: 'Blue',
            hex: '#00BFFF',
            images: {
                normal: {
                    front: require('../../assets/tshirts/normal_blue_front.png'),
                    back: require('../../assets/tshirts/normal_blue_back.png'),
                },
                oversized: {
                    front: require('../../assets/tshirts/oversized_blue_front.png'),
                    back: require('../../assets/tshirts/oversized_blue_back.png'),
                },
            },
        },
        {
            id: 'purple',
            name: 'Purple',
            hex: '#8B00FF',
            images: {
                normal: {
                    front: require('../../assets/tshirts/normal_purple_front.png'),
                    back: require('../../assets/tshirts/normal_purple_back.png'),
                },
                oversized: {
                    front: require('../../assets/tshirts/oversized_purple_front.png'),
                    back: require('../../assets/tshirts/oversized_purple_back.png'),
                },
            },
        },
    ],
};
