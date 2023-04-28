import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchUrl } from './js/api/fetchImages';
import { scroll } from './js/scroll/scroll';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

form.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', onClick);

let pageNumber = 1;
loadMore.style.display = 'none';

const gallerySimpleBox = new SimpleLightbox('.gallery a');

async function onSubmit(ev) {
  ev.preventDefault();
  refreshGallery();
  const searchValue = form.elements.searchQuery.value;

  const response = await fetchUrl(searchValue, pageNumber);
  if (response.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    renderImages(response.hits);
    gallerySimpleBox.refresh();
    Notify.success(`Hooray! We found ${response.totalHits} images.`);

    if (response.totalHits === response.hits.length) {
      loadMore.style.display = 'none';
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMore.style.display = 'block';
    }
  }
}

function renderImages(images) {
  const markUp = images.map(image => {
    return `<div class="photo-card">
 <a href="${image.largeImageURL}"> <img class="photo-card__img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy"  /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${image.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${image.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${image.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${image.downloads}</b>
    </p>
  </div>
</div>`;
  });
  const fixMArkUP = markUp.join('');
  gallery.innerHTML += fixMArkUP;
}

async function onClick() {
  const searchValue = form.elements.searchQuery.value;
  pageNumber += 1;
  const response = await fetchUrl(searchValue, pageNumber);
  renderImages(response.hits);
  if (response.totalHits === response.hits.length) {
    loadMore.style.display = 'none';

    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
  scroll();
}

function refreshGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  loadMore.style.display = 'none';
}
