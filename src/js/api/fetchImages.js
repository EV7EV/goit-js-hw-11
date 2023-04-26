import axios from 'axios';
const KEY = '35616780-389f725697a1b8e578a276820';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchUrl(searchQuery, pageCount) {
  const params = {
    params: {
      key: KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: pageCount,
      per_page: 40,
    },
  };
  try {
    const response = await axios.get(BASE_URL, params);
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}
