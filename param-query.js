module.exports = (app, products) => {
    
    app.get('/', (req, res) => {
        res.send('<h1>Home Page</h1><a href="/api/products">View Products</a>');
    });

    app.get('/api/products', (req, res) => {
        res.json(products);  
    });

    app.get('/api/products/:productID', (req, res) => {
        const { productID } = req.params;
        const singleProduct = products.find(product => product.id === Number(productID));
        if (!singleProduct) {
            return res.status(404).send('Product Does Not Exist');
        }
        res.json(singleProduct);
    });

    app.get('/api/products/:productID/reviews/:reviewID', (req, res) => {
        console.log(req.params);
        res.send('Review endpoint');
    });

    app.get('/api/v1/query', (req, res) => {
        const { search, limit } = req.query;
        let sortedProducts = [...products];

        if (search) {
            sortedProducts = sortedProducts.filter(product =>
                product.name.toLowerCase().startsWith(search.toLowerCase())
            );
        }
        if (limit) {
            sortedProducts = sortedProducts.slice(0, Number(limit));
        }
        if (sortedProducts.length < 1) {
            return res.status(200).json({ success: true, data: [] });
        }
        res.status(200).json(sortedProducts);
    });
};
