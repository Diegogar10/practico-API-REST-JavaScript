const api = axios.create({
    baseURL:'http://api.themoviedb.org/3/',
    Headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }
});
const createMoviesAddContainer = async (movies, container) => {
    
    container.innerHTML='';
    movies.forEach(movie => {
        const movieContainer =  document.createElement('div');
        const movieImg = document.createElement('img');
        movieContainer.classList.add('movie-container')
        movieContainer.addEventListener('click',() => location.hash='#movie='+movie.id);
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300/'+movie.poster_path);
        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
    
}
const createListCategoriesAddContainer = async (category, container) => {
    
    container.innerHTML = '';
    
    category.forEach(element => {

        const listContainer =  document.createElement('div');
        const nameCategory = document.createElement('h3');
        const titulo = document.createTextNode(element.name);
        
        listContainer.classList.add('category-container')
        nameCategory.classList.add('category-title');
        nameCategory.setAttribute('id', 'id' + element.id);
        nameCategory.addEventListener('click', () => {
            location.hash=`#category=${element.id}-${element.name}`;
        });
    
        nameCategory.append(titulo);
        listContainer.appendChild(nameCategory);
        container.appendChild(listContainer);
    });

}
const getTrendingMoviesPreview = async () => {
    /*  const response = await fetch('http://api.themoviedb.org/3/trending/movie/week?api_key='+API_KEY);
    const data = await response.json();
    */
    const {data} = await api('trending/movie/week');
    const movies = await data.results;
   
    createMoviesAddContainer(movies, trendingMoviesPreviewList);    
    
}
const getCategoriesMovies = async () => {
    const {data} = await api('genre/movie/list');
    const categories = await data.genres;

    createListCategoriesAddContainer(categories, categoriesPreviewList);    
}
const getMoviesByCategory = async (id) => {
    /*  const response = await fetch('http://api.themoviedb.org/3/trending/movie/week?api_key='+API_KEY);
    const data = await response.json();
    */
    const {data} = await api('/discover/movie',{
        params:{
            with_genres: id,
        }
    });
    const movies = await data.results;
    
    createMoviesAddContainer(movies, genericSection);    
   
}
const getMoviesBySearch = async (query) => {
    /*  const response = await fetch('http://api.themoviedb.org/3/trending/movie/week?api_key='+API_KEY);
    const data = await response.json();
    */
    const {data} = await api('/search/movie',{
        params:{
            query,
        }
    });
    const movies = await data.results;
    
    createMoviesAddContainer(movies, genericSection);    
   
}
const getTrendingMovies = async () => {
    /*  const response = await fetch('http://api.themoviedb.org/3/trending/movie/week?api_key='+API_KEY);
    const data = await response.json();
    */
    const {data} = await api('trending/movie/week');
    const movies = await data.results;
   
    createMoviesAddContainer(movies, genericSection);    
    
}
const getMovieById = async (id) => {

    const {data:movie} = await api('movie/'+id);
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500'+ movie.poster_path;
    headerSection.style.background = `
        linear-gradient(
            180deg,
            rgba(0,0,0,0.35) 19.27%,
            rgba(0,0,0,0) 29.17%
        ),
        url(${movieImgUrl})
    `;
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createListCategoriesAddContainer(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesId(id);
}
const getRelatedMoviesId = async (id) => {
    const {data} = await api(`/movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMoviesAddContainer(relatedMovies, relatedMoviesContainer);
}
