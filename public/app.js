document.addEventListener('DOMContentLoaded', () => {
    const productTableBody = document.getElementById('productTableBody');
    const searchInput = document.getElementById('searchInput');
    const productDetailsDiv = document.getElementById('productDetails'); 

    let products = []; 
    async function fetchProducts() {
        try {
            const response = await fetch('/api/products');
            products = await response.json(); 
            displayProducts(products); 
            handleProductIdFromUrl(); 
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    function displayProducts(productsToDisplay) {
        productTableBody.innerHTML = ''; 

        productsToDisplay.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="#" class="product-link" data-id="${product.id}">${product.id}</a></td>
                <td>${product.name}</td>
                <td><img src="${product.image}" alt="${product.name}" width="100"></td>
                <td>$${product.price}</td>
                <td>${product.desc || 'No description available.'}</td>
            `;
            productTableBody.appendChild(row);
        });

        const productLinks = document.querySelectorAll('.product-link');
        productLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const productId = event.target.getAttribute('data-id');
                
                console.log('Product ID clicked:', productId); 

                history.pushState({ productId }, '', `?id=${productId}`);

                fetchProductById(productId);
            });
        });
    }

    async function fetchProductById(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            if (!response.ok) {
                throw new Error('Product not found'); 
            }
            const product = await response.json();

            displayProducts([product]);
        } catch (error) {
            console.error('Error fetching product:', error);
            productDetailsDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
            displayProducts([]); 
        }
    }

    function displayProductDetails(product) {
        productDetailsDiv.innerHTML = `
            <h2>${product.name}</h2>
            <p>ID: ${product.id}</p>
            <img src="${product.image}" alt="${product.name}" width="200">
            <p>Description: ${product.desc || 'No description available.'}</p>
        `;
    }

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.id.toString().includes(searchTerm)
        );
        displayProducts(filteredProducts); 

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('search', searchTerm);
        history.replaceState(null, '', `?${searchParams.toString()}`);
    });

    const handleProductIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            fetchProductById(id); 
        }
    };

    fetchProducts(); 
});
