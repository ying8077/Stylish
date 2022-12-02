let nextPage = 0;
let throttleTimer;
const productsDOM = document.querySelector(".wrap");
const productWomen = document.querySelector(".category-women");
const productMen = document.querySelector(".category-men");
const productAccessories = document.querySelector(".category-accessories");
const iptSearch = document.querySelector('input[type="search"]');
const apiProduct = axios.create({
    baseURL: `http://localhost:8000/products`,
    headers: {
        "Content-Type": "application/json",
    }
})
const getProductList = (category) => apiProduct.get(`/${category}paging=${nextPage}`);

document.addEventListener("DOMContentLoaded", loadProduct);
productWomen.addEventListener("click", loadProduct);
productMen.addEventListener("click", loadProduct);
productAccessories.addEventListener("click", loadProduct);
iptSearch.addEventListener('search', () => {
    window.location.replace(`index.html?keyword=${iptSearch.value}`);
    loadProduct();
});

async function loadProduct() {
    try {
        const response = await getProductList(getCategory());
        const products = response.data.products;
        nextPage = response.data.next_paging;
        for (let i = 0; i < products.length; i++) {
            appendProductToDOM(productsDOM, products[i]);
        }
    } catch (error) { console.log(error) }
}

function getCategory() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let category = urlParams.get('category');
    if (urlParams.has('keyword')) {
        category = `search?keyword=${urlParams.get('keyword')}&`;
    } else if (urlParams.has('category') === false) {
        category = "all?";
    } else {
        category = `${urlParams.get('category')}?`;
    }
    return category;
}

function appendProductToDOM(container, product) {
    const arr_colors = product.color.split(',');
    const html = `
        <div class="item">
            <img class="product-img" src=${product.img}>
            <div class="details">
                <div class="colors">
                    ${arr_colors.map( color => `<span class="color" style="background-color: ${color}"></span>`).join("")}
                </div>
                <div id="product-name">${product.title}</div>
                <div id="price">TWD.${product.price}</div>
            </div>
        </div>`;
    container.innerHTML += html;
}

window.addEventListener("scroll", handleInfiniteScroll);

function throttle(callback, time) {
    if (throttleTimer) return;
    throttleTimer = true;
    setTimeout(() => {
        callback();
        throttleTimer = false;
    }, time);
};

function handleInfiniteScroll() {
    throttle(async () => {
        const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
        if (endOfPage && nextPage !== undefined) {
            loadProduct();
        } else if (nextPage === undefined) {
            removeInfiniteScroll();
        }
    }, 1000);
};

function removeInfiniteScroll() {
    window.removeEventListener("scroll", handleInfiniteScroll);
};