$(document).ready(() => {
    // $("#searchForm").on('submit', (e) => {
    //     e.preventDefault();
    //     let searchText = $("#searchText").val();
    //     getMovies(searchText);
    //     //let searchActor = $("#searchActor").val();
    //     // getActorsMovie(searchActor);

    //});
    $("#knopka").on("click" , (e)=>{
        filter();
    })
});

async function filter() {
    //make request to api using axios
    // Make a request for a user with a given ID
    localStorage.primer=1;

    searchActor = document.getElementById("searchActor").value;
    searchText = document.getElementById("searchText").value;
    searchYear = document.getElementById("searchYear").value;
    let sel = document.getElementById("selgen");
    let genre_id = sel.options[sel.selectedIndex].value;
    let searchByFilter = async (searchActor, searchYear, genre_id) => {
        console.log(searchYear);
        if (searchYear == undefined) {
            searchYear = "";
        }

        if (searchActor == undefined) {
            searchActor = "";
        }
        let ame = "";
        if (searchActor != "") {
            let response = await fetch("https://api.themoviedb.org/3/search/person?api_key=2227b93d43061d30768e0d290701ef2a&language=en-US&query=" + searchActor + "&page=1&include_adult=false")
            let name = await response.json();
            ame = name.results["0"].id;
        }
        let res = await fetch("https://api.themoviedb.org/3/discover/movie?api_key=2227b93d43061d30768e0d290701ef2a&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=" + searchYear + "&with_genres=" + genre_id + "&with_people=" + ame)
        let answer = await res.json();
        console.log(answer);
        title = answer.results['0'].original_title;
        console.log(title);
        return axios.get("https://api.themoviedb.org/3/discover/movie?api_key=2227b93d43061d30768e0d290701ef2a&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=" + searchYear + "&with_genres=" + genre_id + "&with_people=" + ame)
            .then(function (response) {
                return response.data.results;
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    console.log(searchYear);
    console.log(searchActor);
    console.log(genre_id);


    if (searchActor == "" && searchYear == "" && genre_id == "" && searchText != "") {
        getMovies(searchText);
    } else if ((searchActor != "" || searchYear != "" || genre_id != "") && searchText == "") {
        let movies = await searchByFilter(searchActor, searchYear, genre_id)
        console.log(movies);
        let output = '';
        $.each(movies, (index, movie) => {
            output += `
          <div class="col-md-3 ">
            <div class="well text-center ">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
              <h5>${movie.title}</h5>
              <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
          
        `;
        });
        $('#movies').html(output);
    } else {
        let movies = await searchByFilter(searchActor, searchYear, genre_id);
        movies = movies.filter(item => {
            return item.original_title.toLowerCase().includes(searchText.toLowerCase())
        })
        let output = '';
        $.each(movies, (index, movie) => {
            output += `
          <div class="col-md-3 ">
            <div class="well text-center ">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
              <h5>${movie.title}</h5>
              <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
          
        `;
        });
        $('#movies').html(output);
    }


}

function getMovies(searchText) {
    //make request to api using axios
    // Make a request for a user with a given ID
    axios.get("https://api.themoviedb.org/3/search/movie?api_key=98325a9d3ed3ec225e41ccc4d360c817&language=en-US&query=" + searchText)
        .then(function (response) {
            let movies = response.data.results;
            let output = '';
            $.each(movies, (index, movie) => {
                output += `
          <div class="col-md-3 ">
            <div class="well text-center ">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
              <h5>${movie.title}</h5>
              <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
        `;
            });
            $('#movies').html(output);
        })
        .catch(function (error) {
            console.log(error);
        });
}


function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = 'movie.html';
    return false;
}

function getMovie() {
    let movieId = sessionStorage.getItem('movieId');
    // Make a request for a user with a given ID
    axios.get("https://api.themoviedb.org/3/movie/" + movieId + "?api_key=98325a9d3ed3ec225e41ccc4d360c817")
        .then(function (response) {
            let movie = response.data;
            //console.log(movie);
            let output = `
        <div class="row">
          <div class="col-md-4">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="thumbnail">
          </div>
          <div class="col-md-8 ">
            <h2>${movie.title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.genres[0].name}, ${movie.genres[1].name}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.release_date}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.vote_average}</li>
              <li class="list-group-item"><strong>Runtime:</strong> ${movie.runtime} min.</li>
              <li class="list-group-item"><strong>Production Companies:</strong> ${movie.production_companies[0].name} min.</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.overview}
            <hr>
            <a href="http://imdb.com/title/${movie.imdb_id}" target="_blank" class="btn btn-primary">View IMDB (TMDB)</a> 
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
    `;
            $('#movie').html(output);
        })
        .catch(function (error) {
            console.log(error);
        });
}