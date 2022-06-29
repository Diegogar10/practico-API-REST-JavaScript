//Data

const api = axios.create({
    baseURL:'http://api.themoviedb.org/3/',
    Headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        "language":"es-ES"
    }
});

const likeMoviesList = () => {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if(item){
        movies = item;
    }else {
        movies = {};
    }
    return movies;
}

const likeMovie = (movie) => {

    const likedMovies = likeMoviesList();

    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem('liked_movies',JSON.stringify(likedMovies));
}



//utils
const callback = (entries)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-src');
            entry.target.setAttribute('src',url);
        }
    });
}
const lazyLoader = new IntersectionObserver(callback);

const createMoviesAddContainer = async (
        movies, 
        container, 
        {
            lazyLoad = false, 
            clean = true
        } = {},
        ) => {
            if(clean){
                container.innerHTML='';
            }
            movies.forEach(movie => {
                const movieContainer =  document.createElement('div');
                const movieImg = document.createElement('img');
                movieContainer.classList.add('movie-container')
                movieContainer.addEventListener('click', () => location.hash='#movie='+movie.id);
                movieImg.classList.add('movie-img');
                movieImg.setAttribute('alt', movie.title);
                movieImg.setAttribute(
                    lazyLoad ? 'data-src':'src',
                    'https://image.tmdb.org/t/p/w300/'+movie.poster_path
                );
                
                const movieBtn = document.createElement('button');
                movieBtn.classList.add('movie-btn');
                likeMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
                movieBtn.addEventListener('click', (evt)=>{
                    evt.stopPropagation();
                    movieBtn.classList.toggle('movie-btn--liked');
                    likeMovie(movie);
                })

                if(lazyLoad){
                    lazyLoader.observe(movieImg);
                }
                movieContainer.appendChild(movieImg);
                movieContainer.appendChild(movieBtn);
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
   
    createMoviesAddContainer(movies, trendingMoviesPreviewList, { lazyLoad: true, clean: true });    
    
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
const getPaginatedCategoryMovies = (id) =>{

    return async () => {
        
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
    
        const scrollISBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    
        if(scrollISBottom){
            page++;
            const {data} = await api('/discover/movie', {
                params: {
                    with_genres: id,
                    page,
                }
            });
            const movies = await data.results;
    
            createMoviesAddContainer(movies, genericSection, { lazyLoad: true, clean: false});
        }
        
    }
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
const getPaginatedSearchMovies = (query) =>{

    return async () => {
        
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
    
        const scrollISBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    
        if(scrollISBottom){
            page++;
            const {data} = await api('/search/movie', {
                params: {
                    query,
                    page,
                }
            });
            const movies = await data.results;
    
            createMoviesAddContainer(movies, genericSection, { lazyLoad: true, clean: false});
        }
        
    }
}
const getTrendingMovies = async () => {
    /*  const response = await fetch('http://api.themoviedb.org/3/trending/movie/week?api_key='+API_KEY);
    const data = await response.json();
    */
    const {data} = await api('trending/movie/week');
    const movies = await data.results;
   
    createMoviesAddContainer(movies, genericSection, { lazyLoad: true, clean: true});

    /* const btnLoadMore = document.createElement('button');
    btnLoadMore.innerHTML = 'Cargar más';
    btnLoadMore.addEventListener('click',getPaginatedTrendingMovies);
    genericSection.appendChild(btnLoadMore); */

}

const getPaginatedTrendingMovies = async () => {
    
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    const scrollISBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    if(scrollISBottom){
        page++;
        const {data} = await api('trending/movie/week', {
            params: {
                page,
            }
        });
        const movies = await data.results;

        createMoviesAddContainer(movies, genericSection, { lazyLoad: true, clean: false});
    }
    
    //element.srcElement.remove();
   /*  const btnLoadMore = document.createElement('button');
    btnLoadMore.innerHTML = 'Cargar más';
    btnLoadMore.addEventListener('click',getPaginatedTrendingMovies);
    genericSection.appendChild(btnLoadMore); */
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

const getLikedMovies = ()=>{
    const likedMovies = likeMoviesList();
    const moviesArray = Object.values(likedMovies);
    createMoviesAddContainer(
        moviesArray, 
        likedMoviesContainer, 
        {
            lazyLoad : true, 
            clean : true
        });
}
