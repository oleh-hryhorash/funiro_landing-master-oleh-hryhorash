// const { doc } = require("prettier");
import products from '../json/products.json';

//==========================================================================

let menu = document.querySelector(".menu__body");
let menuIcon = document.querySelector(".icon-menu");

menuIcon.addEventListener('click', burgerMenuOnOff);

menu.addEventListener('click', (e) => {
    if (!menu.classList.contains('active')) return;
    if (e.target.nodeName == "A") {
        burgerMenuOnOff();
    }
});

function burgerMenuOnOff() {
    menuIcon.classList.toggle('active');
    menu.classList.toggle('active');
    document.querySelector("body").classList.toggle('lock');
}

function ibg(){
    let elements = document.querySelectorAll('.ibg');
    elements?.forEach(function(item){
        let image = item.querySelector('img');
        if( image.src.length > 0 ){
            item.style.backgroundImage = `url("${image.src}")`;
        }
    });
}

ibg();

//==========================================================================

let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

window.onload = function () {
    document.body.style.display = 'block';
    document.addEventListener('click', documentActions);

    function documentActions(e) {
        const targetElement = e.target;

        if (isMobile.any() || e.pointerType == 'touch') {
            if (targetElement.classList.contains('menu__arrow') || targetElement.classList.contains('menu__link')) {
                let menuItems = document.querySelectorAll('.menu__item');
                menuItems.forEach(element => {
                    if (element != targetElement.closest('.menu__item') && element.classList.contains('_hover') && !menu.classList.contains('active')) {
                        element.classList.remove('_hover');
                    }
                });
                targetElement.closest('.menu__item').classList.toggle('_hover');
            }
            if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
                document.querySelectorAll('.menu__item._hover').forEach(el => el.classList.remove('_hover'));
            }
        }
        if (window.innerWidth < 768) {
            if (targetElement.classList.contains('menu__arrow') || targetElement.classList.contains('menu__link')) {
                let subList = targetElement.closest('.menu__item').querySelector('.menu__sub-list');
                if (subList) {
                    subList.classList.toggle('accordion');
                }
            }
            if (targetElement.classList.contains('menu-footer__title')) {
                let subList = targetElement.closest('.menu-footer__column').querySelector('.menu-footer__list');
                if (subList) {
                    subList.classList.toggle('accordion');
                    targetElement.classList.toggle('active');
                }
            }
        }
        if (targetElement.classList.contains('search-form__icon')) {
            document.querySelector('.search-form').classList.toggle('_active');
        } else if (!targetElement.closest('.search-form') && document.querySelector('.search-form._active')) {
            document.querySelector('.search-form').classList.remove('_active');
        }
        if (targetElement.classList.contains('products__more')) {
            e.preventDefault();
            getProducts(targetElement);
        }
        if (targetElement.classList.contains('actions-product__button')) {
            e.preventDefault();
            const productId = targetElement.closest('.item-product').dataset.pid;
            addToCart(targetElement, productId);
        }
        if (targetElement.classList.contains('cart-header__icon') || targetElement.closest('.cart-header__icon')) {
            e.preventDefault();
            if (document.querySelector('.cart-list').children.length > 0) {
                document.querySelector('.cart-header').classList.toggle('_active');
            }
        } else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
            document.querySelector('.cart-header').classList.remove('_active');
        }
        if (targetElement.classList.contains('cart-list__delete')) {
            e.preventDefault();
            const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
            updateCart(targetElement, productId, false);
        }
        if (targetElement.classList.contains('menu__sub-link') || targetElement.classList.contains('slider-main__content') || targetElement.parentElement.classList.contains('slider-main__content')) {
            let productFilter = {
                product: 'all',
                room: 'all'
            }
            let filter = targetElement.dataset.product;
            if(filter) {
                productFilter.product = filter;
                localStorage.setItem('productFilter', JSON.stringify(productFilter));
            } else {
                filter = targetElement.dataset.room;
                if(filter) {
                    productFilter.room = filter;
                    localStorage.setItem('productFilter', JSON.stringify(productFilter));
                } else {
                    filter = targetElement.parentElement.dataset.room;
                    if(filter) {
                        productFilter.room = filter;
                        localStorage.setItem('productFilter', JSON.stringify(productFilter));
                    }
                }
            }
        }
        if (targetElement.classList.contains('actions-product__link') || targetElement.classList.contains('inspiration__button') || targetElement.classList.contains('slider-inspiration__content') || targetElement.closest('.slider-inspiration__content') || targetElement.classList.contains('slider-tips__image') || targetElement.classList.contains('slider-tips__title') || targetElement.classList.contains('actions-header__item_favorites')) {
            e.preventDefault();
        }
    }

    document.addEventListener('submit', documentSubmitActions);

    function documentSubmitActions(e) {
        const targetElement = e.target;
        if (targetElement.classList.contains('search-form__item')) {
            e.preventDefault();
            searchFormHandler(e.target[1].value);
            // targetElement.reset();
        }
        if (targetElement.classList.contains('subscribe__form')) {
            e.preventDefault();
            targetElement.reset();
        }
    }

    //==========================================================================
    //Header
    const headerElement = document.querySelector('.header');

    const headerObserver = new IntersectionObserver(function(entries) {
        if(entries[0].isIntersecting) {
            headerElement.classList.remove('_scroll');
        } else {
            headerElement.classList.add('_scroll');
        }
    });
    headerObserver.observe(headerElement);

    //==========================================================================
    //Load more products
    let productIndex = 4;
    function getProducts(button) {
        if (button.classList.contains('_hold')) { return };

        button.classList.add('_hold');
        let productsToLoad = products.products.slice(productIndex, productIndex + 4);
        productIndex += 4;
        loadProducts(productsToLoad);
        button.classList.remove('_hold');
        if (productIndex >= products.products.length) {
            button.remove();
        }
    }

    function loadProducts(data) {
        const productsItems = document.querySelector('.products__items');

        data.forEach(item => {
			let productTemplateStart = `<article data-pid="${item.id}" class="products__item item-product">`;
			let productTemplateEnd = `</article>`;

			let productTemplateLabels = '';
			if (item.labels.length > 0) {
				let productTemplateLabelsStart = `<div class="item-product__labels">`;
				let productTemplateLabelsEnd = `</div>`;
				let productTemplateLabelsContent = '';

				item.labels.forEach(labelItem => {
					productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
				});

				productTemplateLabels += productTemplateLabelsStart;
				productTemplateLabels += productTemplateLabelsContent;
				productTemplateLabels += productTemplateLabelsEnd;
			}

			let productTemplateImage = `
                <a href="${item.url}" class="item-product__image item-product__image_loaded">
                    <img src="../assets/images/products/${item.image}" alt="${item.title}">
                </a>
            `;

			let productTemplateBodyStart = `<div class="item-product__body">`;
			let productTemplateBodyEnd = `</div>`;

			let productTemplateContent = `
                <div class="item-product__content">
                    <h3 class="item-product__title">${item.title}</h3>
                    <div class="item-product__text">${item.text}</div>
                </div>
            `;

			let productTemplatePrices = '';
			let productTemplatePricesStart = `<div class="item-product__prices">`;
			let productTemplatePricesCurrent = `<div class="item-product__price">$ ${item.price}</div>`;
			let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">$ ${item.priceOld}</div>`;
			let productTemplatePricesEnd = `</div>`;

			productTemplatePrices = productTemplatePricesStart;
			productTemplatePrices += productTemplatePricesCurrent;
			if (item.priceOld) {
				productTemplatePrices += productTemplatePricesOld;
			}
			productTemplatePrices += productTemplatePricesEnd;

			let productTemplateActions = `
                <div class="item-product__actions actions-product">
                    <div class="actions-product__body">
                        <a href="" class="actions-product__button btn btn_white">Add to cart</a>
                        <a href="${item.shareUrl}" class="actions-product__link _icon-share">Share</a>
                        <a href="${item.likeUrl}" class="actions-product__link _icon-favorite">Like</a>
                    </div>
                </div>
            `;

			let productTemplateBody = '';
			productTemplateBody += productTemplateBodyStart;
			productTemplateBody += productTemplateContent;
			productTemplateBody += productTemplatePrices;
			productTemplateBody += productTemplateActions;
			productTemplateBody += productTemplateBodyEnd;

			let productTemplate = '';
			productTemplate += productTemplateStart;
			productTemplate += productTemplateLabels;
			productTemplate += productTemplateImage;
			productTemplate += productTemplateBody;
			productTemplate += productTemplateEnd;

			productsItems.insertAdjacentHTML('beforeend', productTemplate);
        })
    }

    //==========================================================================
    //Add to cart
    let itemsInCart = JSON.parse(localStorage.getItem('cartFuniro'));
    if (itemsInCart) {
        for (const itemId in itemsInCart) {
            let numberOfItems = itemsInCart[itemId];
            while (numberOfItems > 0) {
                updateCart(null, itemId, true);
                numberOfItems--;
            }
        }
    } else {
        itemsInCart = {};
    }

    function addToCart(productButton, productId) {
        if (productButton.classList.contains('_hold')) { return };

        productButton.classList.add('_hold');
        productButton.classList.add('_fly');

        const cart = document.querySelector('.cart-header__icon');
        const productsItems = document.querySelector('.products__items');
        const product = productsItems.querySelector(`[data-pid="${productId}"]`);
        const productImage = product.querySelector('.item-product__image');
        const productImageFly = productImage.cloneNode(true);
        const productImageFlyWidth = productImage.offsetWidth;
        const productImageFlyHeight = productImage.offsetHeight;
        const productImageFlyTop = productImage.getBoundingClientRect().top;
        const productImageFlyLeft = productImage.getBoundingClientRect().left;

        productImageFly.setAttribute('class', '_flyImage');
        productImageFly.style.cssText = `
            left: ${productImageFlyLeft}px;
            top:  ${productImageFlyTop}px;
            width:  ${productImageFlyWidth}px;
            height:  ${productImageFlyHeight}px;
        `;
        document.body.append(productImageFly);

        const cartFlyLeft = cart.getBoundingClientRect().left;
        const cartFlyTop = cart.getBoundingClientRect().top;
        productImageFly.style.cssText = `
            left: ${cartFlyLeft}px;
            top:  ${cartFlyTop}px;
            width: 0px;
            height: 0px;
            opacity: 0;
        `;

        productImageFly.addEventListener('transitionend', function() {
            if (productButton.classList.contains('_fly')) {
                productImageFly.remove();
                updateCart(productButton, productId);
                productButton.classList.remove('_fly');
                // productButton.classList.remove('_hold');
            }
        })
    }

    function updateCart(productButton, productId, productAdd = true) {
        const cart = document.querySelector('.cart-header');
        const cartIcon = cart.querySelector('.cart-header__icon');
        const cartQuantity = cartIcon.querySelector('span');
        const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
        const cartList = document.querySelector('.cart-list');

        if (productAdd) {
            if (cartQuantity) {
                cartQuantity.innerHTML = ++cartQuantity.innerHTML;
            } else {
                cartIcon.insertAdjacentHTML('beforeend', '<span>1</span>');
            }
            if (!cartProduct) {
                const product = products.products[productId - 1];
                const cartProductImage = product.image;
                const cartProductTitle = product.title;

				const cartProductContent = `
                    <a href="" class="cart-list__image">
                        <img src="../assets/images/products/${cartProductImage}" alt="${cartProductTitle}">
                    </a>
                    <div class="cart-list__body">
                        <a href="" class="cart-list__title">${cartProductTitle}</a>
                        <div class="cart-list__quantity">Quantity: <span>1</span></div>
                        <a href="" class="cart-list__delete">Delete</a>
                    </div>
                `;
				cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`);

                itemsInCart[productId] = 1;
                localStorage.setItem('cartFuniro', JSON.stringify(itemsInCart));
			} else {
				const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
				cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;

                itemsInCart[productId] += 1;
                localStorage.setItem('cartFuniro', JSON.stringify(itemsInCart));
			}
            if (productButton) {
                productButton.classList.remove('_hold');
            }
        } else {
            const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
			cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;

            itemsInCart[productId] -= 1;
            localStorage.setItem('cartFuniro', JSON.stringify(itemsInCart));

			if (!parseInt(cartProductQuantity.innerHTML)) {
				cartProduct.remove();

                delete itemsInCart[productId];
                localStorage.setItem('cartFuniro', JSON.stringify(itemsInCart));
			}

			const cartQuantityValue = --cartQuantity.innerHTML;

			if (cartQuantityValue) {
				cartQuantity.innerHTML = cartQuantityValue;
			} else {
				cartQuantity.remove();
				cart.classList.remove('_active');

                localStorage.removeItem('cartFuniro');
			}
        }
    }
    
    //==========================================================================
    //Gallery
    const gallery = document.querySelector('.gallery__body');
    let galleryItems, galleryColumn, speed, positionX, coordXpercentage;

    if (gallery && !isMobile.any()) {
        galleryItems = document.querySelector('.gallery__items');
		galleryColumn = document.querySelectorAll('.gallery__column');

		// Speed of animation
		speed = gallery.dataset.speed;

		positionX = 0;
		coordXpercentage = 0;

		gallery.addEventListener("mousemove", function (e) {
			const furnitureWidth = gallery.offsetWidth;

			const coordX = e.pageX - furnitureWidth / 2;

			coordXpercentage  = coordX / furnitureWidth * 200;

			if (!gallery.classList.contains('_init')) {
				requestAnimationFrame(setMouseGalleryStyle);
				gallery.classList.add('_init');
			}
		});
    }

    function setMouseGalleryStyle() {
        let galleryItemsWidth = 0;
        galleryColumn.forEach(element => {
            galleryItemsWidth += element.offsetWidth;
        });

        const furnitureDifferent = galleryItemsWidth - gallery.offsetWidth;
        const distX = Math.floor(coordXpercentage - positionX);

        positionX = positionX + (distX * speed);
        let position = furnitureDifferent / 200 * positionX;

        galleryItems.style.cssText = `transform: translate3d(${-position}px,0,0);`;

        if (Math.abs(distX) > 0) {
            requestAnimationFrame(setMouseGalleryStyle);
        } else {
            gallery.classList.remove('_init');
        }
    }
    
    //================================================================================
    //Products page filter & load products

    let productFilters = {
        new: 'New arrivals',
        sale: 'Sale',
        bedroom: 'Bedroom',
        living: 'Living room',
        dining: 'Dining room'
    }

    if (window.location.pathname == '/products.html') {
        let productFilter = JSON.parse(localStorage.getItem('productFilter'));
        let searchFilter = JSON.parse(localStorage.getItem('searchFilter'));
        let productToShow, roomToShow;
        let productData;
        if (productFilter) {
            productToShow = productFilter.product;
            roomToShow = productFilter.room;
            const filterTitleOutput = document.querySelector('.filter-products__title');
            const filterSubtitleOutput = document.querySelector('.filter-products__subtitle');
            const filetArrow = document.querySelector('.filter-products__arrow');
            // filter-products__title 
            if (productToShow != 'all') {
                filterTitleOutput.textContent = 'Product'
                filterSubtitleOutput.textContent = productFilters[productToShow];
                productData = filterProductsByType(products.products, productToShow)
            } else if (roomToShow != 'all') {
                filterTitleOutput.textContent = 'Room'
                filterSubtitleOutput.textContent = productFilters[roomToShow];
                productData = products.products.filter(el => el.room.includes(roomToShow))
            } else {
                if (!searchFilter || searchFilter.search == 'false') {
                    filetArrow.style.display = 'none';
                    productData = products.products;
                }
                else {
                    filetArrow.style.display = 'none';
                    filterTitleOutput.textContent = `Showing results for "${searchFilter.input}"`;
                    productData = searchFilterHandler(searchFilter.input);
                    localStorage.setItem('searchFilter', JSON.stringify({search:'false', input:''}));
                }
            }
        }

        if (productData.length > 0) {
            loadProducts(productData);
        } 
    }

    function filterProductsByType(data, type) {
        let filteredProducts = [];
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const labelTypes = element.labels;

            for (let j = 0; j < labelTypes.length; j++) {
                const label = labelTypes[j];
                if (label.type == type) {
                    filteredProducts.push(element);
                }
            }
        }
        return filteredProducts;
    }
}

//================================================================================
//Search Form

function searchFormHandler(input) {
    localStorage.setItem('productFilter', JSON.stringify({product:'all', room:'all'}));
    localStorage.setItem('searchFilter', JSON.stringify({search:'true', input:input}));
    window.location.pathname = '/products.html';
}

function searchFilterHandler(input) {
    const searchInput = input.toLowerCase();
    let filteredProducts = [];
    products.products.forEach(product => {
        let addProduct = false;
        if (product.title.toLowerCase().includes(searchInput) || product.text.toLowerCase().includes(searchInput)) {
            filteredProducts.push(product);
            addProduct = true;
        }

        if (!addProduct) {
            for (const room of product.room) {
                if (room.toLowerCase().includes(searchInput)) {
                    filteredProducts.push(product);
                    addProduct = true;
                    break;
                }
            }
        }

        if (!addProduct) {
            for (const label of product.labels) {
                if (label.type.toLowerCase().includes(searchInput)) {
                    filteredProducts.push(product);
                    addProduct = true;
                    break;
                }
            }
        }
    })
    return filteredProducts;
}

//================================================================================
//For Safari

if (!isMobile.any()) {
    window.ontouchstart = function (e) {
        const targetElement = e.target;

        if (targetElement.classList.contains('menu__arrow') || targetElement.classList.contains('menu__link')) {
            let menuItems = document.querySelectorAll('.menu__item');
            menuItems.forEach(element => {
                if (element != targetElement.closest('.menu__item') && element.classList.contains('_hover') && !menu.classList.contains('active')) {
                    element.classList.remove('_hover');
                }
            });
            targetElement.closest('.menu__item').classList.toggle('_hover');
        }
        if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
            document.querySelectorAll('.menu__item._hover').forEach(el => el.classList.remove('_hover'));
        }
    }
}