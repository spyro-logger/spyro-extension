function removeUrlParameter(url, parameter) {
  let updatedUrl;
  const urlParts = url.split('?');

  if (urlParts.length >= 2) {
    const urlBase = urlParts.shift();
    const queryString = urlParts.join('?');

    const prefix = `${encodeURIComponent(parameter)}=`;
    const parts = queryString.split(/[&;]/g);

    parts.forEach((element, index) => {
      if (element.lastIndexOf(prefix, 0) !== -1) {
        parts.splice(index, 1);
      }
    });

    updatedUrl = `${urlBase}?${parts.join('&')}`;
  }
  return updatedUrl;
}

export default removeUrlParameter;
