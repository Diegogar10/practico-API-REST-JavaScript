let page = 1;
let infiniteScroll;

const navigator = () => {

    if(infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, {passive:false});
        infiniteScroll = undefined;
    }
    
    if(location.hash.startsWith('#trends')) {
       trendsPage();
    }else if(location.hash.startsWith('#search=')) {
       searchPage();
    }else if(location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    }else if(location.hash.startsWith('#category=')) {
        categoriesPage();
    }else {
        homePage();
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    if(infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, {passive:false});
    }
}

const homePage = () => {
    console.log('HOME');

    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    categoriesPreviewSection.classList.remove('inactive');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');

    getTrendingMoviesPreview();
    getCategoriesMovies();
    getLikedMovies();
}
const trendsPage = () => {
    console.log('TRENDS');

    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    categoriesPreviewSection.classList.add('inactive');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    headerTitle.classList.add('inactive');
    headerCategoryTitle.innerHTML='Tendencias';
    headerCategoryTitle.classList.remove('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    getTrendingMovies();

    infiniteScroll = getPaginatedTrendingMovies;
}
const searchPage = () => {
    console.log('SEARCH');

    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    categoriesPreviewSection.classList.add('inactive');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    const [_,query] = location.hash.split('=');
    getMoviesBySearch(query);
    infiniteScroll = getPaginatedSearchMovies(query);
}
const movieDetailsPage = () => {
    console.log('MOVIE');
   
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    categoriesPreviewSection.classList.add('inactive');
    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    const [_,queryId] = location.hash.split('=');

    getMovieById(queryId);
    
}
const categoriesPage = () => {
    console.log('CATEGORIES');
    
    const [,categoryData] = location.hash.split('=');
    const [categoryID,categoryName] = categoryData.split('-');

    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    categoriesPreviewSection.classList.add('inactive');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    headerCategoryTitle.innerHTML=categoryName;
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    getMoviesByCategory(categoryID);

    
    infiniteScroll = getPaginatedCategoryMovies(categoryID);
}

searchFormBtn.addEventListener('click', () => {
    location.hash='#search=' +searchFormInput.value;
});

trendingBtn.addEventListener('click', () => {
    location.hash='#trends';
});

arrowBtn.addEventListener('click', () => {
    history.back();
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, {passive: false});
