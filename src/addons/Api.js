export function netflix(content) {
  console.log("Netflix");
  return;
}

export async function imdb(content) {
  let uri = encodeURIComponent(content);
  let url = `https://www.imdb.com/find?q=${uri}&s=tt`;
  // let url = `https://www.imdb.com/find?q=${uri}`;
  
  return await new Promise(function(resolve, reject) {
    fetch(url, {
      method: "GET",
      mode: "no-cors", // put this to "cors" and make it work
      headers: {
        'Content-Type': 'text/html'
      },
      credentials: 'same-origin',
    })
      .then(async response => await response.text())
      .then(data => resolve(data))
      .catch(e => reject(e));
  });
}

export function myAnimeList(content) {
  console.log("MyAnimeList");
  return;
}

export default async function Api(api, content) {
  let command = api.toLowerCase().trim();
  let data;
  
  if (command === "netflix") {
    data = await netflix(content);
    return data;
  }
  if (command === "myanimelist") {
    data = await myAnimeList(content);
    return data;
  }
  if (command === "imdb") {
    let htmlString = await imdb(content);
    
    let html = document.createElement("html");
    html.innerHTML = htmlString;
    let elements = Array.from(html.querySelectorAll("div.findSection"));
    
    // elements = elements.reduce((acc, current) => {
    //   if (current.children[0].textContent.toLowerCase() !== "titles") {
    //     return acc;
    //   }
    //   acc.push(current);
    //   return acc;
    // }, []);
    
    let list = Array.from(
      elements[0]?.querySelectorAll("table.findList > tbody > tr") ?? []
    );
    
    let parsed = [];
    for (let i = 0; i < list.length; i++) {
      let img = list[i].querySelector("td.primary_photo > a > img").src;
      img = img.replace(/._V1_.*.jpg/gm, "._V1_.jpg");
      
      let nameParent = list[i].querySelector("td.result_text");
      
      let title = nameParent.querySelector("a").textContent;
      let link = nameParent.querySelector("a").getAttribute("href");
      
      let temp;
      try { temp = new URL(link); }
      catch (e) { temp = new URL(`https://example.com${link}`); }
      
      link = temp.pathname;
      
      let releaseDate = nameParent.childNodes[2].textContent;
      
      parsed.push({ title, img: [img], releaseDate, link });
    }
    
    return parsed;
  }
  
  return;
}