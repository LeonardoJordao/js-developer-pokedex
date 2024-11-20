const fetchApi = {};

fetchApi.getJson = async url => {
  return fetch(url)
    .then(res => res.json())
    .catch(err => console.log(err));
};

export default fetchApi;
