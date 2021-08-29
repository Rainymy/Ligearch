function convert(text) {
  try { return JSON.parse(text); } 
  catch (e) {
    let bigArray = {};
    let title = /[^#]+(?=#)/gi;
    
    let listNumber = /^[0-9]+/gi;
    let totaltEp = /(Ep.[0-9]+)/gi;
    let totalMovie = /(?!Movie):[0-9]+/gi;
    let combinedLength = /([Ep.[0-9]+])/gi;
    let titleName = /\b(?!Ep|Movie|[0-9]|:|\.|,|])\b\S+/gi;
    
    let currentTitle = "";
    let arrayList = text.split("\n");
    
    let format = (string) => {
      return string.split(":").join("").trim().split(" ").join("_");
    }
    
    for (let i = 0; i < arrayList.length; i++) {
      if (arrayList[i].match(title)) {
          currentTitle = format(arrayList[i].match(title)[0]);
          bigArray[currentTitle] = new Array(0);
          continue;
      }
      if (arrayList[i].match(titleName) == null) { continue; }
      bigArray[currentTitle].push({
          title_name: [arrayList[i].match(titleName)].join("").split(",").join(" "),
          total_episode : arrayList[i].match(totaltEp) ? arrayList[i].match(totaltEp)[0]: null,
          total_movie: arrayList[i].match(totalMovie) ? arrayList[i].match(totalMovie)[0]: null,
          list_number: arrayList[i].match(listNumber) ? arrayList[i].match(listNumber)[0]: null,
          combinedLength_in_normal_EP: arrayList[i].match(combinedLength) 
            ? arrayList[i].match(combinedLength) : null,
      });
    }
    return bigArray;
  }
}

export default convert;