(async function () {
    await init();
    await bootstrapCarouselEvent();
})();


async function init(){
    let accordion = document.getElementById('accordion');
    let accordionMarkup = '';
    let id = ['One', 'Two', 'Three'];
    for(let index=0; index < magazines.length; index++ ){
        let link = magazines[index];
        let title = ['Covid-19 Updates', 'Indian Technology', 'Sports News'];
        let carouselId = ['carouselCovidNews', 'carouselTechnologyNews', 'carouselSportsNews']
        accordionMarkup += '<div class="card border-0 w-100">';
        accordionMarkup += `<div class="accordion" id="heading${id[index]}">`;
        accordionMarkup += '<h5 class="mb-0">';
        accordionMarkup += `<button class="btn p-0" data-toggle="collapse" data-target="#collapse${id[index]}" aria-expanded="true" aria-controls="collapse${id[index]}">`;
        accordionMarkup += `<p class="accordion-title"><i class="fas fa-angle-${index == 0 ? 'up' : 'down'}"></i>&nbsp;&nbsp;${title[index]}</p>`;
        accordionMarkup += '</a>';
        accordionMarkup += '</h5>';
        accordionMarkup += '</div>';
        accordionMarkup += `<div id="collapse${id[index]}" class="collapse ${index == 0 ? 'show':'' }" aria-labelledby="heading${id[index]}" data-parent="#accordion">`;
        accordionMarkup += '<div class="card-body m-0 p-0">';
        let data = await fetchMagazineData(link);
        let carousel = getCarouselMarkup(data, carouselId[index]);
        accordionMarkup += carousel;
        accordionMarkup += '</div>';
        accordionMarkup += '</div>';
        accordionMarkup += '</div>'
    }
   
    accordion.innerHTML = accordionMarkup;

    
}

async function fetchMagazineData(url){
    let jsonUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' +url;
    try{
        let magazinesData = await fetch(jsonUrl)
            .then(response => response.json())
            .then(data => data.items);
        return magazinesData;
    }catch(error){
        console.error(error);
        return null;
    };
}


function getCardMarkup(item) {
    let date = new Date(item.pubDate);
    let published_date = date.toLocaleDateString("en-IN"); 
    let cardMarkup = '<div class="card border-0 magazine-tile">';
    cardMarkup += `<a href=${item.link}>`;
    cardMarkup += `<img class="img-fluid" src="${item.enclosure.link}" alt="${item.title}">`;
    cardMarkup += `<div class="card-body">`;
    cardMarkup += `<h4 class="card-title">${item.title}</h5>`;
    cardMarkup += `<p class="card-text"><small class="accordion-text">${item.author} <small><i class="fas fa-circle"></i></small> ${published_date}</small></p>`;
    cardMarkup += `<p class="card-summary">${item.description}`;
    cardMarkup += '</div>';
    cardMarkup += '</a>';
    cardMarkup += '</div>';
    return cardMarkup;
}

function getCarouselMarkup(items, carousel_id){
    let carouselMarkup = `<div id="${carousel_id}" class="carousel slide">`;
    carouselMarkup += '<div class="carousel-control left">';
    carouselMarkup += `<a class="carousel-control-prev-icon" href="#${carousel_id}" role="button" data-slide="prev">`;
    carouselMarkup += '<span aria-hidden="true"><i class="fas fa-angle-left"></i></span>';
    carouselMarkup += '<span class="sr-only">Previous</span>';
    carouselMarkup += '</a>';
    carouselMarkup += '</div>';
    carouselMarkup += '<div class="carousel-inner">';
    
    items.forEach((item, index) => {
        if (index == 0){
            carouselMarkup += '<div class="carousel-item active">';
        }else{
            carouselMarkup += '<div class="carousel-item">';
        }
        let cardMarkup = getCardMarkup(item);
        carouselMarkup += cardMarkup;
        carouselMarkup += '</div>';
    });
    carouselMarkup += '</div>';
    carouselMarkup += '<div class="carousel-control right">';
    carouselMarkup += `<a class="carousel-control-next-icon" href="#${carousel_id}" role="button" data-slide="next">`;
    carouselMarkup += '<span aria-hidden="true"><i class="fas fa-angle-right"></i></span>';
    carouselMarkup += '<span class="sr-only">Next</span>';
    carouselMarkup += '</a>';
    carouselMarkup += '</div>';
    carouselMarkup += '</div>';
    
    return carouselMarkup;

}


function bootstrapCarouselEvent(){
    $(".carousel").carousel({
        interval: false,
        wrap: false
    });

    $('.carousel').on('slid', '', function(){
        let id = $(this)[0].id;
        let $this = $('#'+id);
        updateCarousel($this);
    }); 

    $('.carousel').on('slid.bs.carousel', '', function(){
        let id = $(this)[0].id;
        let $this = $('#'+id);
        updateCarousel($this);
    });

    $('.collapse').on('hidden.bs.collapse', function () {
        $(this).prev('.accordion').find('.fas').toggleClass('fa-angle-up fa-angle-down');
    });

    $('.collapse').on('show.bs.collapse', function () {
        $(this).prev('.accordion').find('.fas').toggleClass('fa-angle-up fa-angle-down');
    });
    
    

    $(document).ready(function(){
        var $this = $('#carouselCovidNews');
        updateCarousel($this);
        var $this = $('#carouselTechnologyNews');
        updateCarousel($this);
        var $this = $('#carouselSportNews');
        updateCarousel($this);
    });
}

function updateCarousel(ele){
    if($('.carousel-inner .carousel-item:first').hasClass('active')) {
        ele.children('.carousel-control.left').hide();
        ele.children('.carousel-control.right').show();
    } else if($('.carousel-inner .carousel-item:last-child').hasClass('active')) {
        ele.children('.carousel-control.left').show();
        ele.children('.carousel-control.right').hide();
    } else {
        ele.children('.carousel-control').show();
    } 
}

