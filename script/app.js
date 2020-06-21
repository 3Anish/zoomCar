
const listElement = document.querySelector('.cities');

const otherCities=document.querySelector('.other_cities');

const postTemplate = document.getElementById('single-city');

const hd_enabled=document.getElementById("hd_enabled");
const one_way_enabled=document.getElementById("one_way_enabled");

function CheckError(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
   
  }

fetch('https://api.zoomcar.com/v4/cities?platform=web')
  .then(CheckError)
  .then(data =>{
      
      getCitiesData(data.cities);

      hd_enabled.addEventListener('change',e=>{
            searchCities(hd_enabled.checked,one_way_enabled.checked,data.cities,false);
      },false);
    
      one_way_enabled.addEventListener('change',e=>{
        searchCities(hd_enabled.checked,one_way_enabled.checked,data.cities,false);   
      },false);

      document.getElementById("input_field").addEventListener("input",e=>{
        efficientSearchFunction(hd_enabled.checked,one_way_enabled.checked,data.cities,true);
      },false);
    })
    .catch(error => {
        alert(error);
      });
    



function getCitiesData(listOfCities){    

    for(const city of listOfCities){
    
        if(city.popular){
    
            const postEl=document.importNode(postTemplate.content, true);
            postEl.querySelector('img').setAttribute('src',city.icon);
            postEl.querySelector('p').textContent=city.name;
            listElement.append(postEl);
        }
        else{
            const otherCitiesEl=document.importNode(postTemplate.content, true);
            otherCitiesEl.querySelector('img').setAttribute('src',city.icon);
            otherCitiesEl.querySelector('p').textContent=city.name;
            otherCities.append(otherCitiesEl);
        }
    }
}


function searchCities(hd_enabled,one_way_enabled,cities,search){
    console.log("Search function is called");
    const hd_enabledPopularCities=cities.filter(city=>city.hd_enabled===true&&city.popular).map(city=>city.name);
     
    const hd_enabledOtherCities=cities.filter(city=>city.hd_enabled===true&&!city.popular).map(city=>city.name);

    const one_way_enabledPopularCities=cities.filter(city=>city.one_way_enabled===true&&city.popular).map(city=>city.name);

    const one_way_enabledOtherCities=cities.filter(city=>city.one_way_enabled===true&&!city.popular).map(city=>city.name);

   
    let input, filter, ul_popular, li_popular, a, i, txtValue;
    input = document.getElementById('input_field');
    filter = input.value.toLowerCase();
    ul_popular = document.getElementById("cities_id");
    li_popular = ul_popular.getElementsByTagName('li');
    
    ul_other=document.getElementById("other_cities_id");
    li_other=ul_other.getElementsByTagName("li");
  for (i = 0; i < li_popular.length; i++) {
            a = li_popular[i].getElementsByTagName("p")[0];
            txtValue = a.textContent || a.innerText;
        if(search){
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                li_popular[i].style.display = "";
            } else {
                li_popular[i].style.display = "none";
              
            }
           
        }
              
    
        else if(hd_enabled&&one_way_enabled){
                if(hd_enabledPopularCities.includes(txtValue)&&one_way_enabledPopularCities.includes(txtValue)){
                    li_popular[i].removeAttribute("style");
                }
                else{
                    li_popular[i].style.display = "none";
                }
        }
        else if(hd_enabled&&!one_way_enabled){

                if(hd_enabledPopularCities.includes(txtValue)){
                    li_popular[i].removeAttribute("style");
                }
                else{
                    li_popular[i].style.display = "none";
                }
        }
        else if(!hd_enabled&&one_way_enabled){
                if(one_way_enabledPopularCities.includes(txtValue)){
                    li_popular[i].removeAttribute("style");
                }
                else{
                    li_popular[i].style.display = "none";
                }
        }
        else{
                if(li_popular[i].style){
                    li_popular[i].removeAttribute("style");
        }
                
      }
    }
  for (i = 0; i < li_other.length; i++) {
    
        a = li_other[i].getElementsByTagName("p")[0]; 
        txtValue = a.textContent || a.innerText;
            if(search){
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                   
                    li_other[i].removeAttribute("style");
                } else {
                    li_other[i].style.display = "none";
                   
                }
               

            }
            else if(hd_enabled&&one_way_enabled){
            

                if(hd_enabledOtherCities.includes(txtValue)&&one_way_enabledOtherCities.includes(txtValue)){
                     li_other[i].removeAttribute("style");
                }
                else{
                    li_other[i].style.display = "none";
                }
            }
            else if(hd_enabled&&!one_way_enabled){
               
                if(hd_enabledOtherCities.includes(txtValue)){
                    li_other[i].removeAttribute("style");
                }
                else{
                    li_other[i].style.display = "none";
                }
            }
            else if(!hd_enabled&&one_way_enabled){
                if(one_way_enabledOtherCities.includes(txtValue)){
                    li_other[i].removeAttribute("style");
                }
                else{
                    li_other[i].style.display = "none";
                }
            }
            else{
                if(li_other[i].style){
                    li_other[i].removeAttribute("style");
                }
            }
  }
}
const debouncingSearch=function(fn,d){
    let timer;
    return function(){
        
        let context=this;
        let args=arguments;   //args passed to internal function
        clearTimeout(timer);
      timer = setTimeout(function(){
            searchCities.apply(context,args);
        },d)
    }
}
const efficientSearchFunction=debouncingSearch(searchCities,400);



