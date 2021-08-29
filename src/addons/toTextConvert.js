export default function toTextConvert (data) {
  
  let string = "";
  let index = 1;
  for (let title in data) {
    string += `# ${title.split("_").join(" ")} #\n`;
    for (let item of data[title]) {
      const {
        title_name,
        total_episode, 
        total_movie,
        combinedLength_in_normal_EP: combinedLength
      } = item;
      
      let combine = "";
      if (title_name)     { combine += `${title_name} `; }
      if (total_episode)  { combine += `${total_episode} `; }
      if (combinedLength) { combine += `${combinedLength} `; }
      if (total_movie)    { combine += `Movie${total_movie} `; }
      
      string += `${index}. ${combine}\n`;
      index += 1;
    }
    string += "\n";
    index = 1;
  }
  // console.log(string);
  return string;
}